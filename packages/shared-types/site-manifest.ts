import type { DocumentId, ProjectId } from "./ids";

export interface SiteManifest {
  readonly siteId: ProjectId;
  readonly name: string;
  readonly pages: ReadonlyArray<{
    readonly pageId: string;
    readonly slug: string;
    readonly title: string;
    readonly documentId: DocumentId;
  }>;
  readonly publishTarget: "astro" | "next" | "static";
  readonly repoIntegration?: {
    readonly provider: "github" | "gitlab";
    readonly repo: string;
    readonly branch: string;
    readonly path: string;
  };
  readonly cms?: {
    readonly provider: "notion" | "headless";
    readonly config: Readonly<object>;
  };
}
