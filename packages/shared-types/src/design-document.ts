import type { ComponentId, DocumentId, ElementId, ProjectId, RevisionNumber, UserId } from './ids'
import type {
  AssetRef,
  GradientStop,
  HexColor,
  ISODateString,
  Transform,
} from './common'

/** Supported design element kinds used by Studio canvas layers. */
export type ElementType = 'frame' | 'text' | 'shape' | 'image' | 'group' | 'component_instance'

/** Supported layer blend modes for compositing elements. */
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'

/** Gradient configuration used by gradient fills. */
export type GradientConfig = {
  type: 'linear' | 'radial'
  angle: number
  stops: GradientStop[]
}

/** Fill paint configuration for solid, gradient, or image-based fills. */
export type Fill = {
  type: 'solid' | 'gradient' | 'image'
  color: HexColor
  gradient: GradientConfig | null
  imageRef: AssetRef | null
  opacity: number
}

/** Stroke paint configuration for element borders. */
export type Stroke = {
  color: HexColor
  width: number
  position: 'inside' | 'center' | 'outside'
  opacity: number
}

/** Shadow effect for elements, supporting drop and inner shadows. */
export type Shadow = {
  color: HexColor
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  type: 'drop' | 'inner'
}

/** Blur effect definition for element-level visual blur. */
export type BlurEffect = {
  type: 'gaussian' | 'background'
  radius: number
}

/** Typography styling configuration used by text elements. */
export type TextStyle = {
  fontFamily: string
  fontWeight: number
  fontSize: number
  lineHeight: number | 'auto'
  letterSpacing: number
  textAlign: 'left' | 'center' | 'right' | 'justify'
  textDirection: 'ltr' | 'rtl' | 'auto'
  color: HexColor
  textDecoration: 'none' | 'underline' | 'strikethrough'
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
}

/** Radius value for either uniform corners or per-corner values. */
export type CornerRadius = number | [number, number, number, number]

/** Shared properties present on every design element in the document map. */
export type BaseElement = {
  id: ElementId
  type: ElementType
  name: string
  transform: Transform
  opacity: number
  visible: boolean
  locked: boolean
  parentId: ElementId | null
  order: number
  blendMode: BlendMode
}

/** Frame container element that can clip and own child layers. */
export type FrameElement = BaseElement & {
  type: 'frame'
  fills: Fill[]
  strokes: Stroke[]
  shadows: Shadow[]
  cornerRadius: CornerRadius
  clipContent: boolean
  children: ElementId[]
}

/** Text layer element containing content and text styling data. */
export type TextElement = BaseElement & {
  type: 'text'
  content: string
  style: TextStyle
  fills: Fill[]
}

/** Vector/basic shape layer such as rectangle, ellipse, polygon, or star. */
export type ShapeElement = BaseElement & {
  type: 'shape'
  shapeType: 'rectangle' | 'ellipse' | 'polygon' | 'star'
  fills: Fill[]
  strokes: Stroke[]
  shadows: Shadow[]
  cornerRadius: CornerRadius
  pointCount: number
}

/** Image layer element that references an asset and fitting mode. */
export type ImageElement = BaseElement & {
  type: 'image'
  imageRef: AssetRef
  fills: Fill[]
  strokes: Stroke[]
  shadows: Shadow[]
  objectFit: 'cover' | 'contain' | 'fill'
}

/** Group element for logical hierarchy and transform grouping of children. */
export type GroupElement = BaseElement & {
  type: 'group'
  children: ElementId[]
}

/** Component instance element that references a master component and applies overrides. */
export type ComponentInstanceElement = BaseElement & {
  type: 'component_instance'
  /** ID of the master component this instance derives from. */
  componentId: ComponentId
  /** Property overrides applied on top of the master component defaults. */
  overrides: Record<string, unknown>
  children: ElementId[]
}

/** Discriminated union for all supported design element variants. */
export type DesignElement =
  | FrameElement
  | TextElement
  | ShapeElement
  | ImageElement
  | GroupElement
  | ComponentInstanceElement

/** Canvas guide used for alignment in either horizontal or vertical axis. */
export type Guide = {
  id: string
  axis: 'horizontal' | 'vertical'
  position: number
}

/** Grid rendering and snapping configuration for the design canvas. */
export type GridConfig = {
  enabled: boolean
  size: number
  color: HexColor
  opacity: number
  snapToGrid: boolean
}

/**
 * Primary Studio document model; the single source of truth for canvas state.
 * Uses Record<ElementId, DesignElement> for element storage — chosen over Map
 * for better JSON serialization compatibility and simpler persistence layer.
 */
export type DesignDocument = {
  id: DocumentId
  projectId: ProjectId
  schemaVersion: number
  /** Monotonic revision counter for optimistic concurrency control. */
  revision: RevisionNumber
  name: string
  width: number
  height: number
  backgroundColor: HexColor
  elements: Record<ElementId, DesignElement>
  rootElementIds: ElementId[]
  guides: Guide[]
  gridConfig: GridConfig
  createdAt: ISODateString
  updatedAt: ISODateString
  createdBy: UserId
}

/**
 * Creates a new empty design document with default canvas/grid settings.
 */
export function createEmptyDocument(
  id: DocumentId,
  projectId: ProjectId,
  name: string,
  width: number,
  height: number,
  createdBy: UserId
): DesignDocument {
  const now = new Date().toISOString() as ISODateString

  return {
    id,
    projectId,
    schemaVersion: 1,
    revision: 0 as RevisionNumber,
    name,
    width,
    height,
    backgroundColor: '#ffffff' as HexColor,
    elements: {},
    rootElementIds: [],
    guides: [],
    gridConfig: {
      enabled: false,
      size: 8,
      color: '#d9d9d9' as HexColor,
      opacity: 0.5,
      snapToGrid: false,
    },
    createdAt: now,
    updatedAt: now,
    createdBy,
  }
}
