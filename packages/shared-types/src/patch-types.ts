import type {
  BindingId,
  ComponentId,
  DocumentId,
  ElementId,
  PageId,
  PatchId,
  RevisionId,
  SnapshotId,
  UserId,
} from './ids'
import type { ISODateString } from './common'
import type { DesignElement, GridConfig, Guide } from './design-document'

/** Metadata envelope attached to every patch operation across scopes. */
export type PatchEnvelope = {
  patchId: PatchId
  docId: DocumentId | PageId
  actorId: UserId
  baseRevision: RevisionId
  timestamp: ISODateString
  logicalClock: number
  deps: PatchId[]
}

/** Supported Studio patch operation identifiers. */
export type StudioPatchType =
  | 'element:add'
  | 'element:remove'
  | 'element:update'
  | 'element:reorder'
  | 'element:reparent'
  | 'document:update'
  | 'guide:add'
  | 'guide:remove'
  | 'guide:update'
  | 'grid:update'

/** Supported Builder patch operation identifiers. */
export type BuilderPatchType =
  | 'section:add'
  | 'section:remove'
  | 'section:update'
  | 'section:reorder'
  | 'component:add'
  | 'component:remove'
  | 'component:update'
  | 'component:reorder'
  | 'component:reparent'
  | 'binding:add'
  | 'binding:remove'
  | 'binding:update'
  | 'page:update'

/** Payload for adding a Studio element. */
export type ElementAddPayload = { element: DesignElement; parentId: ElementId | null; index: number }
/** Payload for removing a Studio element. */
export type ElementRemovePayload = { elementId: ElementId }
/** Payload for updating a Studio element with undo values. */
export type ElementUpdatePayload = {
  elementId: ElementId
  changes: Record<string, unknown>
  previousValues: Record<string, unknown>
}
/** Payload for reordering a Studio element. */
export type ElementReorderPayload = { elementId: ElementId; fromIndex: number; toIndex: number }
/** Payload for reparenting a Studio element. */
export type ElementReparentPayload = {
  elementId: ElementId
  fromParentId: ElementId | null
  toParentId: ElementId | null
  index: number
}
/** Payload for updating document-level fields with undo values. */
export type DocumentUpdatePayload = {
  changes: Record<string, unknown>
  previousValues: Record<string, unknown>
}
/** Payload for guide operations in Studio scope. */
export type GuidePayload = { guide: Guide }
/** Payload for updating grid configuration with undo values. */
export type GridUpdatePayload = {
  changes: Partial<GridConfig>
  previousValues: Partial<GridConfig>
}

/** Generic remove payload addressed by ID. */
export type RemoveByIdPayload<IdType> = { id: IdType }
/** Generic update payload with reversible changes. */
export type UpdatePayload<IdType> = {
  id: IdType
  changes: Record<string, unknown>
  previousValues: Record<string, unknown>
}
/** Generic reorder payload between two indices. */
export type ReorderPayload<IdType> = { id: IdType; fromIndex: number; toIndex: number }
/** Generic reparent payload between two parent nodes. */
export type ReparentPayload<IdType> = {
  id: IdType
  fromParentId: ComponentId | null
  toParentId: ComponentId | null
  index: number
}
/** Builder payload for adding a section. */
export type SectionAddPayload = { section: Record<string, unknown>; index: number }
/** Builder payload for adding a component. */
export type ComponentAddPayload = {
  component: Record<string, unknown>
  parentId: ComponentId | null
  index: number
}
/** Builder payload for adding a binding. */
export type BindingAddPayload = { binding: Record<string, unknown> }
/** Builder payload for updating page-level data with undo values. */
export type PageUpdatePayload = {
  changes: Record<string, unknown>
  previousValues: Record<string, unknown>
}

/** Studio payload map keyed by patch type. */
export type StudioPayloadByType = {
  'element:add': ElementAddPayload
  'element:remove': ElementRemovePayload
  'element:update': ElementUpdatePayload
  'element:reorder': ElementReorderPayload
  'element:reparent': ElementReparentPayload
  'document:update': DocumentUpdatePayload
  'guide:add': GuidePayload
  'guide:remove': GuidePayload
  'guide:update': GuidePayload
  'grid:update': GridUpdatePayload
}

/** Builder payload map keyed by patch type. */
export type BuilderPayloadByType = {
  'section:add': SectionAddPayload
  'section:remove': RemoveByIdPayload<ComponentId>
  'section:update': UpdatePayload<ComponentId>
  'section:reorder': ReorderPayload<ComponentId>
  'component:add': ComponentAddPayload
  'component:remove': RemoveByIdPayload<ComponentId>
  'component:update': UpdatePayload<ComponentId>
  'component:reorder': ReorderPayload<ComponentId>
  'component:reparent': ReparentPayload<ComponentId>
  'binding:add': BindingAddPayload
  'binding:remove': RemoveByIdPayload<BindingId>
  'binding:update': UpdatePayload<BindingId>
  'page:update': PageUpdatePayload
}

/** Discriminated Studio patch union bound to typed payloads by patch type. */
export type StudioPatch = {
  [T in StudioPatchType]: PatchEnvelope & { scope: 'studio'; type: T; payload: StudioPayloadByType[T] }
}[StudioPatchType]

/** Discriminated Builder patch union bound to typed payloads by patch type. */
export type BuilderPatch = {
  [T in BuilderPatchType]: PatchEnvelope & { scope: 'builder'; type: T; payload: BuilderPayloadByType[T] }
}[BuilderPatchType]

/** Unified patch type for Studio and Builder operations. */
export type Patch = StudioPatch | BuilderPatch

/** Patch log entry containing application metadata and patch lifecycle status. */
export type PatchHistoryEntry = {
  patch: Patch
  appliedAt: ISODateString
  status: 'applied' | 'undone' | 'rejected'
}

/** Immutable snapshot of full document state and revision metadata. */
export type DocumentSnapshot = {
  snapshotId: SnapshotId
  docId: DocumentId | PageId
  revision: RevisionId
  schemaVersion: number
  documentState: unknown
  patchCount: number
  createdAt: ISODateString
  stateHash: string
}
