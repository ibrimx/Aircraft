import type { Brand, DocumentId, ProjectId } from "./ids";

export type PageId = Brand<string, "PageId">;
export const asPageId = (value: string): PageId => value as PageId;

export interface SiteManifestPage {
  readonly pageId: PageId;
  readonly slug: string;
  readonly title: string;
  readonly documentId: DocumentId;
}

export interface SiteCmsConfig {
  readonly databaseId?: string;
  readonly collectionId?: string;
  readonly spaceId?: string;
  readonly endpoint?: string;
  readonly apiVersion?: string;
  readonly apiKeyEnvVar?: string;
  readonly contentPath?: string;
}

export interface SiteManifest {
  readonly siteId: ProjectId;
  readonly name: string;
  readonly pages: readonly SiteManifestPage[];
  readonly publishTarget: "astro" | "next" | "static";
  readonly repoIntegration?: {
    readonly provider: "github" | "gitlab";
    readonly repo: string;
    readonly branch: string;
    readonly path: string;
  };
  readonly cms?: {
    readonly provider: "notion" | "headless";
    readonly config: SiteCmsConfig;
  };
}
