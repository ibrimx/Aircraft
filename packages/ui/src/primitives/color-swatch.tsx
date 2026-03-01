// P30
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'

export type ColorSwatchSize = 'sm' | 'md' | 'lg'

export type ColorSwatchProps = {
  color: string
  selected?: boolean
  size?: ColorSwatchSize
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

const SWATCH_SIZE: Record<ColorSwatchSize, string> = {
  sm: '24px', md: '32px', lg: '40px',
}

const CHECKERBOARD =
  'repeating-conic-gradient(#e0e0e0 0% 25%, transparent 0% 50%) 0 0 / 8px 8px'

export function ColorSwatch({
  color, selected = false, size = 'md',
  onClick, className, style,
}: ColorSwatchProps) {
  const theme = useThemeTokens()
  const dim = SWATCH_SIZE[size]

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label={`Color: ${color}`}
      style={{
        width: dim, height: dim, minWidth: dim,
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.border.subtle}`,
        background: CHECKERBOARD,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        padding: 0, outline: 'none',
        boxShadow: selected
          ? `0 0 0 2px ${theme.colors.surface.default}, 0 0 0 4px ${theme.colors.accent.default}`
          : 'none',
        transition: cssTransition('box-shadow', 'fast', 'easeInOut'),
        overflow: 'hidden',
        ...style,
      }}
    >
      <span style=
        position: 'absolute', inset: 0,
        background: color,
        borderRadius: 'inherit',
       />
    </button>
  )
}
