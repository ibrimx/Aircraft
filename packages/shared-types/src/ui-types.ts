/** UI breakpoint buckets used by responsive app layouts. */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide'

/** Supported theme selection modes. */
export type Theme = 'dark' | 'light' | 'system'

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

/** Sheet configuration and available snap behavior. */
export type SheetConfig = {
  defaultSnap: SheetSnap
  allowedSnaps: SheetSnap[]
  peekHeight: number
  halfHeight: number
  fullHeight: number
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
