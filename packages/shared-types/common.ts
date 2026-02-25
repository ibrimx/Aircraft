import type { ActorId, AssetId, Brand, ProjectId } from "./ids";

export type ISODateString = Brand<string, "ISODateString">;

export type Locale = "ar" | "en";

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Size {
  readonly width: number;
  readonly height: number;
}

export interface Rect extends Point, Size {}

export interface Transform {
  readonly x: number;
  readonly y: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly rotation: number;
}

/** Expected format: "#RRGGBB" or "#RRGGBBAA". */
export type HEXColor = Brand<string, "HEXColor">;
/** Expected format: "rgba(r,g,b,a)" with any spacing. */
export type RGBAColor = Brand<string, "RGBAColor">;

export interface AssetRef {
  readonly id: AssetId;
  readonly url: string;
  readonly mime: string;
  readonly width?: number;
  readonly height?: number;
  readonly hash?: string;
  readonly size?: number;
  readonly tags?: readonly string[];
  readonly ownerId?: ActorId;
  readonly projectId?: ProjectId;
  readonly createdAt?: ISODateString;
}

export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

export type NonEmptyArray<T> = readonly [T, ...T[]];
