import type { AssetId } from "./ids";

const commonBrand: unique symbol = Symbol("common-brand");

type BrandedValue<TBase, TName extends string> = TBase & {
  readonly [commonBrand]: TName;
};

/** ISO 8601 date-time string used for serialized timestamps. */
export type ISODateString = BrandedValue<string, "ISODateString">;

/** Unix timestamp in milliseconds. */
export type Timestamp = BrandedValue<number, "Timestamp">;

/** Hex color string in #RRGGBB or #RRGGBBAA format. */
export type HexColor = BrandedValue<string, "HexColor">;

/** RGBA color object where channels are normalized to valid ranges. */
export type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

/** Single stop inside a gradient definition. */
export type GradientStop = {
  color: HexColor;
  position: number;
};

/** Color value accepted by shared rendering and style systems. */
export type ColorValue = HexColor | RGBAColor;

/** 2D point coordinates. */
export type Point = {
  x: number;
  y: number;
};

/** 2D size dimensions. */
export type Size = {
  width: number;
  height: number;
};

/** Rectangle shape combining position and size. */
export type Rect = Point & Size;

/** Transform and bounds values for positioned elements. */
export type Transform = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
};

/** Recursive rich-text AST node used for structured content fields. */
export type RichTextNode = {
  type: "text" | "bold" | "italic" | "link" | "paragraph" | "heading";
  content?: string;
  children?: RichTextNode[];
  url?: string;
  level?: number;
};

/** Reference to an uploaded asset with metadata used by renderers. */
export type AssetRef = {
  assetId: AssetId;
  url: string;
  mimeType: string;
  width?: number;
  height?: number;
};

/** Generic async loading state for UI and data workflows. */
export type LoadingState = "idle" | "loading" | "success" | "error";

/** Generic result object with success or error payload for safe branching. */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/** Standard pagination metadata for list responses. */
export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

/** Deeply readonly utility that recursively freezes nested objects and arrays. */
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer TItem)[]
    ? readonly DeepReadonly<TItem>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

/** Utility to flatten intersections and mapped types for easier IDE display. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/** Array type that guarantees at least one item exists. */
export type NonEmptyArray<T> = [T, ...T[]];

/** Utility to mark a type as nullable. */
export type Nullable<T> = T | null;
