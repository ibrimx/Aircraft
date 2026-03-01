/**
 * Semantic color tokens for Aircraft — maps PALETTE primitives to UI roles.
 * Dark/Light mappings per Design System Guide §2.4 / §2.5.
 * @see SemanticColorTokens — the canonical token shape for all themes.
 */
import { PALETTE } from './colors'
import type { ThemeMode } from '@aircraft/shared-types'

/** Semantic color token shape shared by every theme. */
export type SemanticColorTokens = {
  background: { primary: string; secondary: string; tertiary: string }
  surface: { default: string; raised: string; sunken: string; overlay: string }
  text: { primary: string; secondary: string; tertiary: string; disabled: string; inverse: string }
  border: { default: string; subtle: string; strong: string }
  accent: { default: string; hover: string; active: string; subtle: string }
  destructive: { default: string; hover: string; subtle: string }
  success: { default: string; subtle: string }
  warning: { default: string; subtle: string }
}

/** Dark-mode semantic tokens — Design System Guide §2.4. */
export const DARK_COLORS: SemanticColorTokens = {
  background: { primary: PALETTE.gray[900], secondary: PALETTE.gray[950], tertiary: PALETTE.gray[800] },
  surface: { default: PALETTE.gray[800], raised: PALETTE.gray[700], sunken: PALETTE.gray[950], overlay: 'rgba(0,0,0,0.6)' },
  text: { primary: PALETTE.white, secondary: PALETTE.gray[400], tertiary: PALETTE.gray[500], disabled: PALETTE.gray[600], inverse: PALETTE.gray[900] },
  border: { default: 'rgba(255,255,255,0.1)', subtle: 'rgba(255,255,255,0.06)', strong: 'rgba(255,255,255,0.2)' },
  accent: { default: PALETTE.blue[500], hover: PALETTE.blue[600], active: PALETTE.blue[700], subtle: 'rgba(0,153,255,0.12)' },
  destructive: { default: PALETTE.red[500], hover: PALETTE.red[600], subtle: 'rgba(255,68,68,0.12)' },
  success: { default: PALETTE.green[500], subtle: 'rgba(48,209,88,0.12)' },
  warning: { default: PALETTE.yellow[500], subtle: 'rgba(255,214,10,0.12)' },
}

/** Light-mode semantic tokens — Design System Guide §2.5. */
export const LIGHT_COLORS: SemanticColorTokens = {
  background: { primary: PALETTE.gray[50], secondary: PALETTE.gray[100], tertiary: PALETTE.white },
  surface: { default: PALETTE.white, raised: PALETTE.white, sunken: PALETTE.gray[100], overlay: 'rgba(0,0,0,0.4)' },
  text: { primary: PALETTE.gray[900], secondary: PALETTE.gray[500], tertiary: PALETTE.gray[400], disabled: PALETTE.gray[300], inverse: PALETTE.white },
  border: { default: 'rgba(0,0,0,0.1)', subtle: 'rgba(0,0,0,0.06)', strong: 'rgba(0,0,0,0.2)' },
  accent: { default: PALETTE.blue[500], hover: PALETTE.blue[600], active: PALETTE.blue[700], subtle: 'rgba(0,153,255,0.12)' },
  destructive: { default: PALETTE.red[500], hover: PALETTE.red[600], subtle: 'rgba(255,68,68,0.12)' },
  success: { default: PALETTE.green[500], subtle: 'rgba(48,209,88,0.12)' },
  warning: { default: PALETTE.yellow[500], subtle: 'rgba(255,214,10,0.12)' },
}

/** Returns the semantic color set for the given resolved theme mode. */
export function getSemanticColors(mode: ThemeMode): SemanticColorTokens {
  return mode === 'dark' ? DARK_COLORS : LIGHT_COLORS
}
