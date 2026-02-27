import type { AssetId } from './ids'

/** @internal Unique symbol used to brand ISO date strings. */
declare const isoDateBrand: unique symbol
/** @internal Unique symbol used to brand Unix millisecond timestamps. */
declare const timestampBrand: unique symbol
/** @internal Unique symbol used to brand validated hex colors. */
declare const hexColorBrand: unique symbol

/** ISO 8601 date-time string (for example: `2026-01-01T10:00:00.000Z`). */
export type ISODateString = string & { readonly [isoDateBrand]: 'ISODateString' }

/** Unix timestamp in milliseconds since epoch, branded to avoid raw numbers. */
export type Timestamp = number & { readonly [timestampBrand]: 'Timestamp' }

/** Hex color string in `#RRGGBB` or `#RRGGBBAA` format. */
export type HexColor = string & {
  readonly [hexColorBrand]: 'HexColor'
}

/** RGBA color value using integer RGB channels and alpha (0..1). */
export type RGBAColor = {
  /** Red channel (0..255). */
  r: number
  /** Green channel (0..255). */
  g: number
  /** Blue channel (0..255). */
  b: number
  /** Alpha channel (0..1). */
  a: number
}

/** Single stop in a gradient definition. */
export type GradientStop = {
  /** Gradient color at this stop. */
  color: HexColor
  /** Stop position in normalized range (0..1). */
  position: number
}

/** Generic color input accepted across the system. */
export type ColorValue = HexColor | RGBAColor

/** 2D point coordinates. */
export type Point = {
  /** Horizontal position. */
  x: number
  /** Vertical position. */
  y: number
}

/** Width and height dimensions. */
export type Size = {
  /** Element width. */
  width: number
  /** Element height. */
  height: number
}

/** Rectangle described by position and size values. */
export type Rect = Point & Size

/** Basic 2D transform data used for layout and rendering. */
export type Transform = {
  /** Horizontal translation. */
  x: number
  /** Vertical translation. */
  y: number
  /** Rendered width before scale. */
  width: number
  /** Rendered height before scale. */
  height: number
  /** Rotation angle in degrees. */
  rotation: number
  /** Horizontal scale multiplier. */
  scaleX: number
  /** Vertical scale multiplier. */
  scaleY: number
}

/** Recursive rich-text node used to model portable formatted content trees. */
export type RichTextNode = {
  /** Node kind that controls how content should be rendered. */
  type: 'text' | 'bold' | 'italic' | 'link' | 'paragraph' | 'heading'
  /** Plain text content for text-like nodes. */
  content?: string
  /** Nested rich-text children for container nodes. */
  children?: RichTextNode[]
  /** Link target URL, used when `type` is `link`. */
  url?: string
  /** Heading level, used when `type` is `heading`. */
  level?: number
}

/** Reference to a stored media/file asset and its metadata. */
export type AssetRef = {
  /** Stable identifier of the referenced asset. */
  assetId: AssetId
  /** Public or signed URL where the asset can be fetched. */
  url: string
  /** MIME type of the asset (for example `image/png`). */
  mimeType: string
  /** Optional intrinsic width for image-like assets. */
  width?: number
  /** Optional intrinsic height for image-like assets. */
  height?: number
}

/** Async loading lifecycle state. */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/** Generic operation result with success/error branches for safe narrowing. */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

/** Pagination settings and total record count. */
export type Pagination = {
  /** Current page index (usually 1-based). */
  page: number
  /** Number of items per page. */
  pageSize: number
  /** Total number of available items. */
  total: number
}

/** Deep immutable view of a type, including nested objects and arrays. */
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T

/** Flattens intersections/mapped types to improve editor readability. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

/** Array type guaranteed to contain at least one item. */
export type NonEmptyArray<T> = [T, ...T[]]

/** Nullable wrapper for values that may intentionally be `null`. */
export type Nullable<T> = T | null
