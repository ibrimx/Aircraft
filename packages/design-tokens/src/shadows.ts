/**
 * Shadow tokens — Framer 2025 style.
 * أخف وأنعم مع border خفي على الـ float.
 */

export type ShadowKey = 'sm' | 'md' | 'lg' | 'xl' | 'float' | 'glow' | 'inset' | 'none'

export const SHADOWS: Record<ShadowKey, string> = {
  none:  'none',
  sm:    '0 1px 2px rgba(0, 0, 0, 0.4)',
  md:    '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03)',
  lg:    '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)',
  xl:    '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04)',
  float: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)',
  glow:  '0 0 0 1px rgba(47, 125, 246, 0.35), 0 0 8px rgba(47, 125, 246, 0.10)',
  inset: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
}
