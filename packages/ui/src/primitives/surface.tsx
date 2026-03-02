/**
 * P24 — surface.tsx · Surface primitive component
 * @package @aircraft/ui
 * Renders a themed container with flat / raised / sunken variants.
 * 📖 DSG §6 Shadows · §10 Interactive States (Panel/Card)
 * 📖 FRAMER §5 Micro-interactions (hover scale, focus ring)
 */

import type { ReactNode, ElementType, CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import type { SpacingAlias, RadiusKey } from '@aircraft/design-tokens'

export type SurfaceVariant = 'flat' | 'raised' | 'sunken'

export type SurfaceProps = {
  variant?: SurfaceVariant
  padding?: SpacingAlias
  radius?: RadiusKey
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: ElementType
}

export function Surface({
  variant = 'flat',
  padding = 'md',
  radius = 'md',
  children,
  className,
  style,
  as: Component = 'div'
}: SurfaceProps): JSX.Element {
  const theme = useThemeTokens()

  const variantStyles: Record<SurfaceVariant, { background: string; boxShadow: string }> = {
    flat:   { background: theme.colors.surface.default, boxShadow: theme.shadows.none },
    raised: { background: theme.colors.surface.raised,  boxShadow: theme.shadows.md },
    sunken: { background: theme.colors.surface.sunken,  boxShadow: theme.shadows.inner },
  }

  const v = variantStyles[variant]

  return (
    <Component
      className={className}
      style={{
        background: v.background,
        boxShadow: v.boxShadow,
        padding: theme.spacingAlias[padding],
        borderRadius: theme.radius[radius],
        ...style,
      }}
    >
      {children}
    </Component>
  )
}
