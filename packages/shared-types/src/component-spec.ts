import type { StyleOverrides } from './page-document'

/** Supported property input kinds in the Builder component inspector. */
export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'image'
  | 'richtext'
  | 'select'
  | 'url'
  | 'icon'

/** Property schema definition for one configurable component prop. */
export type PropDefinition = {
  name: string
  type: PropType
  label: string
  defaultValue: unknown
  required: boolean
  options: string[] | null
  placeholder: string | null
}

/** High-level component grouping used for browsing the insert panel. */
export type ComponentCategory =
  | 'layout'
  | 'content'
  | 'media'
  | 'navigation'
  | 'form'
  | 'data'
  | 'social'
  | 'custom'

/** Declarative spec describing a component's editor/runtime capabilities. */
export type ComponentSpec = {
  id: string
  name: string
  category: ComponentCategory
  description: string
  icon: string
  props: PropDefinition[]
  acceptsChildren: boolean
  maxChildren: number | null
  defaultStyles: StyleOverrides
  preview: string | null
}
