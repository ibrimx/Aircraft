import type {
  AssetId,
  CollectionId,
  PageId,
  ProjectId,
  PublishTargetId,
} from './ids'
import type { ISODateString } from './common'

/** Publish-time manifest describing the static output package for a site. */
export type SiteManifest = {
  projectId: ProjectId
  name: string
  description: string
  pages: PageManifestEntry[]
  assets: AssetManifestEntry[]
  brandTokens: Record<string, string>
  generatedAt: ISODateString
  publishTarget: PublishTargetId
  schemaVersion: number
}

/** Per-page output entry generated during publishing. */
export type PageManifestEntry = {
  pageId: PageId
  title: string
  slug: string
  outputPath: string
  isIndex: boolean
  isDynamic: boolean
  collectionId: CollectionId | null
}

/** Per-asset output entry generated during publishing. */
export type AssetManifestEntry = {
  assetId: AssetId
  originalName: string
  outputPath: string
  mimeType: string
  sizeBytes: number
}
