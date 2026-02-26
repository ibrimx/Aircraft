import type {
  BindingId,
  CollectionId,
  ComponentId,
  PageId,
  ProjectId,
  RecordId,
  UserId,
} from './ids'
import type { AssetRef, HexColor, ISODateString } from './common'

/** Supported responsive breakpoints for Builder page rendering. */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

/** Per-breakpoint value map that always includes mobile, tablet, and desktop keys. */
export type BreakpointValues<T> = Record<Breakpoint, T>

/** Flex container main-axis direction variants. */
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'

/** Flex line wrapping behavior. */
export type FlexWrap = 'nowrap' | 'wrap'

/** Main-axis distribution options for flex/grid content. */
export type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

/** Cross-axis alignment options for items within a layout container. */
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'

/** Four-sided spacing values in pixels (top, right, bottom, left). */
export type SpacingValue = {
  top: number
  right: number
  bottom: number
  left: number
}

/** Section/container layout configuration shared across breakpoints. */
export type LayoutConfig = {
  display: 'flex' | 'grid'
  direction: FlexDirection
  wrap: FlexWrap
  justify: JustifyContent
  align: AlignItems
  gap: number
  padding: SpacingValue
  gridColumns: number | null
  gridRows: number | null
}

/** Runtime style overrides applied to a component or section instance. */
export type StyleOverrides = {
  width: string | null
  height: string | null
  margin: SpacingValue | null
  padding: SpacingValue | null
  backgroundColor: HexColor | null
  borderRadius: number | null
  opacity: number | null
  customCSS: Record<string, string> | null
}

/** Reference to a data binding used to populate a component property. */
export type BindingRef = {
  bindingId: BindingId
  property: string
  collectionId: CollectionId
  recordId: RecordId | null
  fieldPath: string | null
  fallback: unknown | null
}

/** Concrete component instance placed inside a Builder page document. */
export type ComponentInstance = {
  id: ComponentId
  specId: string
  name: string
  props: Record<string, unknown>
  styles: BreakpointValues<StyleOverrides>
  bindings: BindingRef[]
  children: ComponentId[]
  order: number
  visible: BreakpointValues<boolean>
}

/** Top-level section node that groups and orders page component trees. */
export type SectionNode = {
  id: ComponentId
  name: string
  layout: BreakpointValues<LayoutConfig>
  styles: BreakpointValues<StyleOverrides>
  children: ComponentId[]
  order: number
  visible: BreakpointValues<boolean>
}

/** SEO and head metadata stored alongside the page content structure. */
export type PageMeta = {
  title: string
  description: string
  ogImage: AssetRef | null
  noIndex: boolean
  customHead: string | null
}

/** Canonical Builder page document containing sections, components, and metadata. */
export type PageDocument = {
  id: PageId
  projectId: ProjectId
  schemaVersion: number
  title: string
  slug: string
  description: string
  sections: Record<ComponentId, SectionNode>
  components: Record<ComponentId, ComponentInstance>
  sectionOrder: ComponentId[]
  meta: PageMeta
  createdAt: ISODateString
  updatedAt: ISODateString
  createdBy: UserId
}

/** Creates a new empty page document with sensible default metadata and maps. */
export function createEmptyPage(
  id: PageId,
  projectId: ProjectId,
  title: string,
  slug: string,
  createdBy: UserId
): PageDocument {
  const now = new Date().toISOString() as ISODateString

  return {
    id,
    projectId,
    schemaVersion: 1,
    title,
    slug,
    description: '',
    sections: {},
    components: {},
    sectionOrder: [],
    meta: {
      title,
      description: '',
      ogImage: null,
      noIndex: false,
      customHead: null,
    },
    createdAt: now,
    updatedAt: now,
    createdBy,
  }
}
