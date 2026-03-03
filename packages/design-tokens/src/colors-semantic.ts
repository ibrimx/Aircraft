/**
 * Semantic color tokens for Aircraft — maps PALETTE primitives to UI roles.
 * Dark/Light mappings per Design System Guide §2.4 / §2.5.
 * Updated to Framer 2025 — Pitch Black dark mode.
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

/** Dark-mode semantic tokens — Framer 2025 Pitch Black. */
export const DARK_COLORS: SemanticColorTokens = {
  background: {
    primary:   '#0f0f11',
    secondary: '#09090b',
    tertiary:  '#1a1a1e',
  },
  surface: {
    default:  '#141416',
    raised:   '#1a1a1e',
    sunken:   '#09090b',
    overlay:  'rgba(0, 0, 0, 0.72)',
  },
  text: {
    primary:  'rgba(255, 255, 255, 0.88)',
    secondary:'rgba(255, 255, 255, 0.48)',
    tertiary: 'rgba(255, 255, 255, 0.28)',
    disabled: 'rgba(255, 255, 255, 0.15)',
    inverse:  'rgba(0, 0, 0, 0.90)',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.07)',
    subtle:  'rgba(255, 255, 255, 0.04)',
    strong:  'rgba(255, 255, 255, 0.12)',
  },
  accent: {
    default: '#2f7df6',
    hover:   '#408af7',
    active:  '#1e6de0',
    subtle:  'rgba(47, 125, 246, 0.10)',
  },
  destructive: {
    default: '#e5484d',
    hover:   '#f05257',
    subtle:  'rgba(229, 72, 77, 0.08)',
  },
  success: {
    default: '#1db954',
    subtle:  'rgba(29, 185, 84, 0.08)',
  },
  warning: {
    default: '#e5a210',
    subtle:  'rgba(229, 162, 16, 0.08)',
  },
}

/** Light-mode semantic tokens — Design System Guide §2.5. */
export const LIGHT_COLORS: SemanticColorTokens = {
  background: {
    primary:   PALETTE.gray[50],
    secondary: PALETTE.gray[100],
    tertiary:  PALETTE.white,
  },
  surface: {
    default:  PALETTE.white,
    raised:   PALETTE.white,
    sunken:   PALETTE.gray[100],
    overlay:  'rgba(0, 0, 0, 0.4)',
  },
  text: {
    primary:  PALETTE.gray[900],
    secondary:PALETTE.gray[500],
    tertiary: PALETTE.gray[400],
    disabled: PALETTE.gray[300],
    inverse:  PALETTE.white,
  },
  border: {
    default: 'rgba(0, 0, 0, 0.09)',
    subtle:  'rgba(0, 0, 0, 0.05)',
    strong:  'rgba(0, 0, 0, 0.15)',
  },
  accent: {
    default: PALETTE.blue[500],
    hover:   PALETTE.blue[600],
    active:  PALETTE.blue[700],
    subtle:  'rgba(0, 153, 255, 0.10)',
  },
  destructive: {
    default: PALETTE.red[500],
    hover:   PALETTE.red[600],
    subtle:  'rgba(255, 68, 68, 0.08)',
  },
  success: {
    default: PALETTE.green[500],
    subtle:  'rgba(48, 209, 88, 0.08)',
  },
  warning: {
    default: PALETTE.yellow[500],
    subtle:  'rgba(255, 214, 10, 0.08)',
  },
}

/** Returns the semantic color set for the given resolved theme mode. */
export function getSemanticColors(mode: ThemeMode): SemanticColorTokens {
  return mode === 'dark' ? DARK_COLORS : LIGHT_COLORS
}
