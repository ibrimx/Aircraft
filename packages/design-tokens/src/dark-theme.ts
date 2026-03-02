import { DARK_COLORS } from './colors-semantic'
import { withLegacyAliases, type AircraftTheme } from './light-theme'

export const darkTheme: AircraftTheme = withLegacyAliases('dark', DARK_COLORS)
