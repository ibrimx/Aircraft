import type { Id, Point, Size, EffectShadow, EffectStroke, EffectWarp } from './types'

/**
 * Document model
 *
 * R7 ✅ includes stroke/shadow/warp placeholders from day 1
 */

export type NodeBase = {
  id: Id
  name: string
  visible: boolean
  locked: boolean
  position: Point
  size: Size
  rotation: number
}

export type TextStyle = {
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  fill: string
  align: 'start' | 'center' | 'end'
  direction: 'ltr' | 'rtl'
  stroke: EffectStroke
  shadow: EffectShadow
  warp: EffectWarp
}

export type TextNode = NodeBase & {
  type: 'text'
  text: string
  style: TextStyle
}

export type ShapeNode = NodeBase & {
  type: 'shape'
  fill: string
}

export type Node = TextNode | ShapeNode

export type Doc = {
  id: Id
  title: string
  nodes: Record<Id, Node>
  order: Id[]
  selectedIds: Id[]
}

export function createEmptyDoc(docId: string, title = 'demo'): Doc {
  return {
    id: docId,
    title,
    nodes: {},
    order: [],
    selectedIds: [],
  }
}
