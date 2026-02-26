import { config } from "dotenv";
import { Client } from "@notionhq/client";
import { Octokit } from "octokit";

config();

type NotionStatus = "Not Started" | "In Progress" | "In Review" | "Merged" | "Closed";

type PullRequestInfo = {
  number: number;
  title: string;
  state: "open" | "closed";
  draft: boolean;
  merged_at: string | null;
  head: {
    ref: string;
    sha: string;
  };
  html_url: string;
  requested_reviewers: Array<{ login: string }>;
};

type SyncData = {
  branch: string;
  promptNum: number;
  prLink: string;
  status: NotionStatus;
  files: string;
  passing: boolean;
};

const {
  GITHUB_TOKEN,
  GITHUB_OWNER,
  GITHUB_REPO,
  NOTION_API_KEY,
  NOTION_DB_ID
} = process.env;

const PROMPT_FILES: Record<number, string> = {
  1: "ids.ts",
  2: "common.ts",
  3: "design-document.ts",
  4: "page-document.ts, component-spec.ts",
  5: "patch-types.ts, errors.ts",
  6: "performance-budget.ts, ui-types.ts, site-manifest.ts",
  7: "cms-types.ts, auth-types.ts",
  8: "permission-types.ts",
  9: "invite-service.ts, invite-validator.ts",
  10: "role-engine.ts",
  11: "permission-resolver.ts"
};

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const notion = new Client({ auth: NOTION_API_KEY });

/**
 * Extracts a numeric prompt number from a branch name like "prompt/12-feature".
 */
export function extractPromptNumber(branch: string): number | null {
  const match = branch.match(/prompt\/(\d+)/);
  if (!match) {
    return null;
  }

  const parsedValue = Number.parseInt(match[1], 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

/**
 * Maps GitHub PR state details to Notion status values.
 */
export function mapStatus(pr: PullRequestInfo): NotionStatus {
  if (pr.merged_at) {
    return "Merged";
  }

  if (pr.state === "closed") {
    return "Closed";
  }

  if (pr.draft) {
    return "In Progress";
  }

  if (pr.requested_reviewers.length > 0) {
    return "In Review";
  }

  return "In Progress";
}

/**
 * Finds an existing Notion page ID by Prompt # value.
 */
export async function findNotionPage(promptNum: number): Promise<string | null> {
  if (!NOTION_DB_ID) {
    console.error("❌ Missing NOTION_DB_ID environment variable.");
    return null;
  }

  const response = await notion.databases.query({
    database_id: NOTION_DB_ID,
    filter: {
      property: "Prompt #",
      number: {
        equals: promptNum
      }
    },
    page_size: 1
  });

  const firstResult = response.results[0];
  return firstResult ? firstResult.id : null;
}

/**
 * Updates an existing Notion page with the latest PR sync fields.
 */
export async function updateNotionPage(pageId: string, data: SyncData): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Branch: {
        title: [
          {
            text: {
              content: data.branch
            }
          }
        ]
      },
      "PR Link": {
        url: data.prLink
      },
      Status: {
        status: {
          name: data.status
        }
      },
      Passing: {
        checkbox: data.passing
      }
    }
  });
}

/**
 * Creates a new Notion page for a PR prompt.
 */
export async function createNotionPage(data: SyncData): Promise<void> {
  if (!NOTION_DB_ID) {
    console.error("❌ Missing NOTION_DB_ID environment variable.");
    return;
  }

  await notion.pages.create({
    parent: {
      database_id: NOTION_DB_ID
    },
    properties: {
      Branch: {
        title: [
          {
            text: {
              content: data.branch
            }
          }
        ]
      },
      "Prompt #": {
        number: data.promptNum
      },
      Files: {
        rich_text: [
          {
            text: {
              content: data.files
            }
          }
        ]
      },
      "PR Link": {
        url: data.prLink
      },
      Status: {
        status: {
          name: data.status
        }
      },
      Passing: {
        checkbox: data.passing
      }
    }
  });
}

/**
 * Reads combined CI status for a ref SHA and returns whether checks passed.
 */
export async function getCIStatus(ref: string): Promise<boolean> {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    console.error("❌ Missing GITHUB_OWNER or GITHUB_REPO environment variables.");
    return false;
  }

  const statusResponse = await octokit.rest.repos.getCombinedStatusForRef({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    ref
  });

  return statusResponse.data.state === "success";
}

/**
 * Synchronizes all GitHub PRs targeting main to the Notion PR tracker.
 */
export async function sync(): Promise<void> {
  try {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !NOTION_API_KEY || !NOTION_DB_ID) {
      console.error("❌ Missing required environment variables. Please check .env.");
      return;
    }

    console.log("🔄 Fetching pull requests from GitHub...");
    const prResponse = await octokit.rest.pulls.list({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      state: "all",
      base: "main",
      per_page: 100
    });

    const pullRequests = prResponse.data as PullRequestInfo[];
    console.log(`📦 Found ${pullRequests.length} PR(s) targeting main.`);

    for (const pr of pullRequests) {
      const branch = pr.head.ref;
      const promptNum = extractPromptNumber(branch);

      if (!promptNum) {
        console.log(`⏭️ Skipping PR #${pr.number} (${branch}) — no prompt number detected.`);
        continue;
      }

      try {
        const status = mapStatus(pr);
        const passing = await getCIStatus(pr.head.sha);
        const files = PROMPT_FILES[promptNum] ?? "";

        const data: SyncData = {
          branch,
          promptNum,
          prLink: pr.html_url,
          status,
          files,
          passing
        };

        const existingPageId = await findNotionPage(promptNum);
        if (existingPageId) {
          await updateNotionPage(existingPageId, data);
          console.log(`✅ Updated Notion page for PR #${pr.number} (Prompt #${promptNum}).`);
        } else {
          await createNotionPage(data);
          console.log(`🆕 Created Notion page for PR #${pr.number} (Prompt #${promptNum}).`);
        }
      } catch (error) {
        console.error(`❌ Failed syncing PR #${pr.number}:`, error);
      }
    }

    console.log("🎉 Sync completed.");
  } catch (error) {
    console.error("❌ Sync failed:", error);
  }
}

sync();
