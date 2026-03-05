/**
 * Shared editor types
 *
 * R2 ✅ Typed data structures
 * R7 ✅ Extensibility hooks (effects placeholders)
 */
export type Id = string

export type Point = { x: number; y: number }
export type Size = { w: number; h: number }

export type ToolId = 'select' | 'text' | 'shape' | 'layers' | 'action'

export type EffectStroke = {
  enabled: boolean
  width: number
  color: string
  opacity: number
}

export type EffectShadow = {
  enabled: boolean
  blur: number
  x: number
  y: number
  color: string
  opacity: number
}

/**
 * Warp placeholder (MVP: not implemented)
 * Later: mesh warp / arc / envelope.
 */
export type EffectWarp = {
  enabled: boolean
  kind: 'none' | 'arc' | 'mesh'
  amount: number
}
