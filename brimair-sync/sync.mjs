const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, NOTION_API_KEY, NOTION_DB_ID } = process.env;

const PROMPT_FILES = {
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

function githubHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

function notionHeaders() {
  return {
    Authorization: `Bearer ${NOTION_API_KEY}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Request failed (${response.status}) ${response.statusText}: ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function extractPromptNumber(branch) {
  const match = branch.match(/prompt\/(\d+)/);
  if (!match) {
    return null;
  }

  const parsedValue = Number.parseInt(match[1], 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

export function mapStatus(pr) {
  if (pr.merged_at) {
    return "Merged";
  }

  if (pr.state === "closed") {
    return "Closed";
  }

  if (pr.draft) {
    return "In Progress";
  }

  if ((pr.requested_reviewers ?? []).length > 0) {
    return "In Review";
  }

  return "In Progress";
}

export async function findNotionPage(promptNum) {
  if (!NOTION_DB_ID) {
    console.error("❌ Missing NOTION_DB_ID environment variable.");
    return null;
  }

  const response = await fetchJson(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      filter: {
        property: "Prompt #",
        number: {
          equals: promptNum
        }
      },
      page_size: 1
    })
  });

  const firstResult = response.results?.[0];
  return firstResult ? firstResult.id : null;
}

export async function updateNotionPage(pageId, data) {
  await fetchJson(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(),
    body: JSON.stringify({
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
    })
  });
}

export async function createNotionPage(data) {
  if (!NOTION_DB_ID) {
    console.error("❌ Missing NOTION_DB_ID environment variable.");
    return;
  }

  await fetchJson("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
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
    })
  });
}

export async function getCIStatus(ref) {
  if (!GITHUB_OWNER || !GITHUB_REPO) {
    console.error("❌ Missing GITHUB_OWNER or GITHUB_REPO environment variables.");
    return false;
  }

  const response = await fetchJson(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${ref}/status`,
    {
      headers: githubHeaders()
    }
  );

  return response.state === "success";
}

export async function sync() {
  try {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !NOTION_API_KEY || !NOTION_DB_ID) {
      console.error("❌ Missing required environment variables. Please set env vars before running sync.");
      return;
    }

    console.log("🔄 Fetching pull requests from GitHub...");
    const pullRequests = await fetchJson(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls?state=all&base=main&per_page=100`,
      {
        headers: githubHeaders()
      }
    );

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

        const data = {
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
