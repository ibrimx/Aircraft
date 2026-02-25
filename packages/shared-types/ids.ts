export type Brand<K, T extends string> = K & { readonly __brand: T };

export type ProjectId = Brand<string, "ProjectId">;
export type DocumentId = Brand<string, "DocumentId">;
export type NodeId = Brand<string, "NodeId">;
export type AssetId = Brand<string, "AssetId">;
export type PatchId = Brand<string, "PatchId">;
export type JobId = Brand<string, "JobId">;
export type SessionId = Brand<string, "SessionId">;
export type ActorId = Brand<string, "ActorId">;

export const asProjectId = (value: string): ProjectId => value as ProjectId;
export const asDocumentId = (value: string): DocumentId => value as DocumentId;
export const asNodeId = (value: string): NodeId => value as NodeId;
export const asAssetId = (value: string): AssetId => value as AssetId;
export const asPatchId = (value: string): PatchId => value as PatchId;
export const asJobId = (value: string): JobId => value as JobId;
export const asSessionId = (value: string): SessionId => value as SessionId;
export const asActorId = (value: string): ActorId => value as ActorId;
