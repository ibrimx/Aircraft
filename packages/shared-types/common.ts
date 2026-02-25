import type { AssetId, Brand } from "./ids";

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

export type HEXColor = Brand<`#${string}`, "HEXColor">;
export type RGBAColor = Brand<`rgba(${number},${number},${number},${number})`, "RGBAColor">;

export interface AssetRef {
  readonly id: AssetId;
  readonly src: string;
  readonly mimeType: string;
  readonly width?: number;
  readonly height?: number;
  readonly alt?: string;
}

export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

export type NonEmptyArray<T> = readonly [T, ...T[]];
