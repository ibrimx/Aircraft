/** UI breakpoint buckets used by responsive app layouts. */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide'

/** UI breakpoint name alias used by design-token consumers. */
export type BreakpointName = Breakpoint

/** Configuration for a single breakpoint range. */
export type BreakpointConfig = {
  name: BreakpointName
  minWidth: number
  maxWidth: number | null
}

/** Supported theme selection modes. */
export type Theme = 'dark' | 'light' | 'system'

/** Resolved theme mode without system — used by design-token consumers. */
export type ThemeMode = 'dark' | 'light'

/** Interface text/layout direction. */
export type Direction = 'ltr' | 'rtl'

/** Supported application locale codes. */
export type Locale = 'ar' | 'en'

/** Runtime platform identifiers. */
export type Platform = 'ios' | 'android' | 'desktop'

/** Active pointer/input modality. */
export type InputMode = 'touch' | 'mouse'

/** Device orientation modes. */
export type Orientation = 'portrait' | 'landscape'

/** Known workspace panel identifiers. */
export type PanelId = 'layers' | 'history' | 'assets' | 'components' | 'brand' | 'cms'

/** Panel mounting position in the workspace shell. */
export type PanelPosition = 'sidebar' | 'inspector' | 'float'

/** Bottom-sheet snap points for mobile-first interactions. */
export type SheetSnap = 'closed' | 'peek' | 'half' | 'full'

/** Alias for SheetSnap used in snap-point configuration contexts. */
export type SheetSnapPoint = SheetSnap

/** Sheet configuration and available snap behavior. */
export type SheetConfig = {
  defaultSnap: SheetSnap
  allowedSnaps: SheetSnap[]
  peekHeight: number
  halfHeight: number
  fullHeight: number
}

/** Mapping of snap points to their normalized viewport height percentages. */
export type SheetSnapConfig = Record<SheetSnap, number>

/** Default snap-point percentages for mobile bottom sheet positioning. */
export const SHEET_SNAP_CONFIG: SheetSnapConfig = {
  closed: 0,
  peek: 0.15,
  half: 0.5,
  full: 0.92,
}

/** Available tool identifiers in the editor toolbar. */
export type ToolId = 'select' | 'frame' | 'text' | 'shape' | 'image' | 'pen' | 'hand'

/** Supported toast presentation variants. */
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

/** Toast message configuration displayed to the user. */
export type ToastConfig = {
  type: ToastType
  message: string
  duration: number
  dismissible: boolean
  action: { label: string; onClick: () => void } | null
}

/** Keyboard shortcut descriptor for command mapping and UI hints. */
export type KeyboardShortcut = {
  key: string
  ctrl: boolean
  shift: boolean
  alt: boolean
  meta: boolean
  label: string
  action: string
}

/** Gesture directions detected by pointer/touch gesture hooks. */
export type GestureDirection = 'left' | 'right' | 'up' | 'down'

/** Haptic feedback pattern payload used by UI mobile haptic helpers. */
export type HapticPattern =
  | { kind: 'impact'; style: 'light' | 'medium' | 'heavy' }
  | { kind: 'notification'; type: 'success' | 'warning' | 'error' }
  | { kind: 'selection' }

