// P34
import type { CSSProperties } from 'react'
import { useThemeTokens, cssTransition } from '@aircraft/design-tokens'

export type ProgressSize = 'sm' | 'md'

export type ProgressProps = {
  value: number
  max?: number
  size?: ProgressSize
  showLabel?: boolean
  className?: string
  style?: CSSProperties
}

const HEIGHT: Record<ProgressSize, string> = { sm: '4px', md: '8px' }

export function Progress({
  value, max = 100, size = 'sm',
  showLabel = false, className, style,
}: ProgressProps) {
  const theme = useThemeTokens()
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  const outerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    ...style,
  }

  const trackStyle: CSSProperties = {
    flex: 1,
    height: HEIGHT[size],
    background: theme.colors.surface.sunken,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
  }

  const labelStyle: CSSProperties = {
    fontSize: theme.textStyles.caption.fontSize,
    color: theme.colors.text.secondary,
    fontFamily: theme.fontFamily.sans,
    minWidth: '36px',
    textAlign: 'end',
  }

  return (
    <div className={className} style={outerStyle}>
      <div
        role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}
        style={trackStyle}
      >
        <div style={{
          height: '100%', width: `${percent}%`,
          background: theme.colors.accent.default,
          borderRadius: theme.radius.pill,
          transition: cssTransition('width', 'slow', 'easeInOut'),
        }} />
      </div>
      {showLabel && (
        <span style={labelStyle}>
          {Math.round(percent)}%
        </span>
      )}
    </div>
  )
}
