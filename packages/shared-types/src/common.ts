import type { AssetId } from './ids'

/** Hex color string in #RRGGBB or #RRGGBBAA format. */
export type HexColor = `#${string}`

/** ISO-8601 date-time string. */
export type ISODateString = string

/** 2D point coordinate in document space. */
export type Point = {
  x: number
  y: number
}

/** 2D size dimensions in pixels. */
export type Size = {
  width: number
  height: number
}

/** Transform values applied to an element on the canvas. */
export type Transform = {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
}

/** External or library-backed asset reference used by fills/images. */
export type AssetRef = {
  id: AssetId
  url: string
}

/** One color stop within a gradient definition. */
export type GradientStop = {
  color: HexColor
  offset: number
  opacity: number
}
