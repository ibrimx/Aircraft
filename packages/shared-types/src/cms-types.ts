import type {
  CollectionId,
  FieldId,
  RecordId,
  SourceId,
  UserId,
} from './ids'
import type { ISODateString, RichTextNode } from './common'

/** Supported CMS connector source types. */
export type CmsSourceType =
  | 'notion'
  | 'airtable'
  | 'sheets'
  | 'supabase'
  | 'markdown'
  | 'json'
  | 'rest'

/** Connection and sync status for a CMS source. */
export type CmsSourceStatus = 'connected' | 'error' | 'syncing' | 'disconnected'

/** CMS source configuration and lifecycle metadata. */
export type CmsSource = {
  id: SourceId
  type: CmsSourceType
  name: string
  status: CmsSourceStatus
  syncInterval: number
  lastSync: ISODateString | null
  lastError: string | null
  config: Record<string, unknown>
  createdAt: ISODateString
  createdBy: UserId
}

/** Supported field kinds for normalized CMS schemas. */
export type CmsFieldType =
  | 'text'
  | 'richtext'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'image'
  | 'file'
  | 'url'
  | 'email'
  | 'phone'
  | 'select'
  | 'multiselect'
  | 'relation'
  | 'rollup'
  | 'formula'
  | 'person'
  | 'location'

/** Schema entry describing one field in a CMS collection. */
export type CmsFieldSchema = {
  id: FieldId
  name: string
  type: CmsFieldType
  required: boolean
  options: string[] | null
  relationCollection: CollectionId | null
}

/** CMS collection metadata and normalized schema information. */
export type CmsCollection = {
  id: CollectionId
  sourceId: SourceId
  externalId: string
  name: string
  schema: CmsFieldSchema[]
  recordCount: number
  lastUpdated: ISODateString | null
  syncEnabled: boolean
}

/** Rich-text value container for CMS fields. */
export type CmsRichTextValue = {
  type: 'richtext'
  nodes: RichTextNode[]
}

/** Relation field value linking to records in another collection. */
export type CmsRelationValue = {
  type: 'relation'
  recordIds: RecordId[]
  collectionId: CollectionId
}

/** Image field value with optional dimensions and alt text. */
export type CmsImageValue = {
  type: 'image'
  url: string
  alt: string | null
  width: number | null
  height: number | null
}

/** File field value with metadata about uploaded asset. */
export type CmsFileValue = {
  type: 'file'
  url: string
  name: string
  mimeType: string
  sizeBytes: number | null
}

/** Union of all supported normalized CMS field values. */
export type CmsFieldValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | CmsRichTextValue
  | CmsRelationValue
  | CmsImageValue
  | CmsFileValue

/** Normalized CMS record with typed field values and raw source payload. */
export type CmsRecord = {
  id: RecordId
  collectionId: CollectionId
  externalId: string
  fields: Record<string, CmsFieldValue>
  createdAt: ISODateString
  updatedAt: ISODateString
  _raw: unknown
}

/** Query filter expression for CMS collection queries. */
export type CmsFilter = {
  field: string
  operator:
    | 'eq'
    | 'neq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'contains'
    | 'not_contains'
    | 'starts_with'
    | 'ends_with'
    | 'is_empty'
    | 'is_not_empty'
  value: unknown
}

/** Sort expression for CMS query execution. */
export type CmsSort = {
  field: string
  direction: 'asc' | 'desc'
}

/** Normalized query contract accepted by CMS adapters. */
export type CmsQuery = {
  collectionId: CollectionId
  filters: CmsFilter[]
  sort: CmsSort[]
  limit: number
  offset: number
}

/** Capability matrix describing feature support for one source type. */
export type CmsSourceCapabilities = {
  supportsRealtime: boolean
  supportsWebhooks: boolean
  supportsRelations: boolean
  supportsRichText: boolean
  supportsFiltering: boolean
  supportsSorting: boolean
  supportsPagination: boolean
  maxRequestsPerMinute: number | null
}

/** Runtime status and counters for CMS synchronization process. */
export type CmsSyncStatus = {
  sourceId: SourceId
  status: 'idle' | 'syncing' | 'success' | 'error'
  lastSync: ISODateString | null
  nextSync: ISODateString | null
  recordsSynced: number
  errors: string[]
}
