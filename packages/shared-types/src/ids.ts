const idBrand: unique symbol = Symbol("id-brand");

type BrandedId<TName extends string> = string & { readonly [idBrand]: TName };

/** Unique ID for a project. */
export type ProjectId = BrandedId<"ProjectId">;
/** Unique ID for a document. */
export type DocumentId = BrandedId<"DocumentId">;
/** Unique ID for a page. */
export type PageId = BrandedId<"PageId">;

/** Unique ID for a design element. */
export type ElementId = BrandedId<"ElementId">;
/** Unique ID for a layer. */
export type LayerId = BrandedId<"LayerId">;
/** Unique ID for a reusable component. */
export type ComponentId = BrandedId<"ComponentId">;
/** Unique ID for a binding reference. */
export type BindingId = BrandedId<"BindingId">;

/** Unique ID for a patch operation. */
export type PatchId = BrandedId<"PatchId">;
/** Unique ID for a document snapshot. */
export type SnapshotId = BrandedId<"SnapshotId">;
/** Unique ID for a revision entry. */
export type RevisionId = BrandedId<"RevisionId">;

/** Unique ID for a user. */
export type UserId = BrandedId<"UserId">;
/** Unique ID for a workspace. */
export type WorkspaceId = BrandedId<"WorkspaceId">;
/** Unique ID for an invite. */
export type InviteId = BrandedId<"InviteId">;
/** Unique ID for a role. */
export type RoleId = BrandedId<"RoleId">;
/** Unique ID for an authenticated session. */
export type SessionId = BrandedId<"SessionId">;

/** Unique ID for a CMS source. */
export type SourceId = BrandedId<"SourceId">;
/** Unique ID for a CMS collection. */
export type CollectionId = BrandedId<"CollectionId">;
/** Unique ID for a CMS record. */
export type RecordId = BrandedId<"RecordId">;
/** Unique ID for a CMS field. */
export type FieldId = BrandedId<"FieldId">;

/** Unique ID for an uploaded asset. */
export type AssetId = BrandedId<"AssetId">;
/** Unique ID for a publish target. */
export type PublishTargetId = BrandedId<"PublishTargetId">;

const UUID_V4_OR_V7_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[47][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Generates a UUID and returns it as the requested branded ID type.
 */
export function createId<TId extends BrandedId<string>>(): TId {
  return unsafeCoerce<TId>(crypto.randomUUID());
}

/**
 * Coerces a raw string into a branded ID type.
 * Use only at trusted boundaries (for example: values read from DB).
 */
export function unsafeCoerce<TId extends BrandedId<string>>(value: string): TId {
  return value as TId;
}

/**
 * Checks whether a value is a valid UUID string (v4 or v7).
 */
export function isValidId(value: string): boolean {
  return UUID_V4_OR_V7_PATTERN.test(value);
}
