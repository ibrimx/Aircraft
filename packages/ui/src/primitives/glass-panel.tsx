/**
 * P25 — glass-panel.tsx · Glass morphism container
 * @package @brimair/ui
 * Frosted glass panel matching DSG §6.2 Glass Panel Recipe.
 * 📖 DSG §6.2 Glass Morphism · §10 Interactive States
 * 📖 FRAMER §5 Micro-interactions · STUDIO §11 Compliance
 */

import type { ReactNode, ElementType, CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'
import { cssBackdropBlur } from '@brimair/design-tokens'
import type { BlurKey, RadiusKey, SpacingAlias } from '@brimair/design-tokens'

export type GlassPanelProps = {
  blur?: BlurKey
  opacity?: number
  padding?: SpacingAlias
  radius?: RadiusKey
  border?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: ElementType
}

export function GlassPanel({
  blur = 'lg',
  opacity = 0.72,
  padding = 'md',
  radius = 'lg',
  border = true,
  children,
  className,
  style,
  as: Component = 'div',
}: GlassPanelProps): JSX.Element {
  const theme = useThemeTokens()

  return (
    <Component
      className={className}
      style={{
        background: `rgba(28, 28, 28, ${opacity})`,
        backdropFilter: cssBackdropBlur(blur),
        WebkitBackdropFilter: cssBackdropBlur(blur),
        border: border ? '1px solid rgba(255,255,255,0.08)' : 'none',
        borderRadius: theme.radius[radius],
        padding: theme.spacingAlias[padding],
        ...style,
      }}
    >
      {children}
    </Component>
  )
}
