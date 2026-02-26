/** @internal Shared unique symbol used to brand all ID types. */
declare const idBrand: unique symbol

type Brand<Tag extends string> = { readonly [idBrand]: Tag }
type BrandedId<Tag extends string> = string & Brand<Tag>

/** Unique identifier for a project. */
export type ProjectId = BrandedId<'project'>
/** Unique identifier for a document. */
export type DocumentId = BrandedId<'document'>
/** Unique identifier for a page. */
export type PageId = BrandedId<'page'>

/** Unique identifier for a design element. */
export type ElementId = BrandedId<'element'>
/** Unique identifier for a layer. */
export type LayerId = BrandedId<'layer'>
/** Unique identifier for a reusable component. */
export type ComponentId = BrandedId<'component'>
/** Unique identifier for a data binding. */
export type BindingId = BrandedId<'binding'>

/** Unique identifier for a patch operation. */
export type PatchId = BrandedId<'patch'>
/** Unique identifier for a document snapshot. */
export type SnapshotId = BrandedId<'snapshot'>
/** Unique identifier for a revision entry. */
export type RevisionId = BrandedId<'revision'>

/** Unique identifier for a user. */
export type UserId = BrandedId<'user'>
/** Unique identifier for a workspace. */
export type WorkspaceId = BrandedId<'workspace'>
/** Unique identifier for an invitation. */
export type InviteId = BrandedId<'invite'>
/** Unique identifier for a role. */
export type RoleId = BrandedId<'role'>
/** Unique identifier for a session. */
export type SessionId = BrandedId<'session'>

/** Unique identifier for a CMS source. */
export type SourceId = BrandedId<'source'>
/** Unique identifier for a CMS collection. */
export type CollectionId = BrandedId<'collection'>
/** Unique identifier for a CMS record. */
export type RecordId = BrandedId<'record'>
/** Unique identifier for a CMS field. */
export type FieldId = BrandedId<'field'>

/** Unique identifier for an asset. */
export type AssetId = BrandedId<'asset'>
/** Unique identifier for a publish target. */
export type PublishTargetId = BrandedId<'publish-target'>

/**
 * Coerces a raw string into a branded ID.
 * Use only when reading trusted values from the database.
 */
export function unsafeCoerce<T extends BrandedId<string>>(value: string): T {
  return value as T
}

/** Creates a new UUID and returns it as the requested branded ID type. */
export function createId<T extends BrandedId<string>>(): T {
  return unsafeCoerce<T>(crypto.randomUUID())
}

/** Validates that a value is a RFC 4122 UUID string. */
export function isValidId(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}
