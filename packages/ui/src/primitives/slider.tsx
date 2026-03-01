// P28 — slider.tsx
import { useCallback } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'

export type SliderProps = {
  value: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onChange: (value: number) => void
  className?: string
  style?: CSSProperties
}

export function Slider({
  value, min = 0, max = 100, step = 1,
  disabled = false, onChange, className, style,
}: SliderProps) {
  const theme = useThemeTokens()
  const percent = ((value - min) / (max - min)) * 100

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value)),
    [onChange],
  )

  return (
    <div className={className} style={{ position: 'relative', opacity: disabled ? 0.4 : 1, ...style }}>
      {/* Visual track */}
      <div style={{
        height: '4px', borderRadius: theme.radius.pill,
        background: theme.colors.border.default,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${percent}%`,
          background: theme.colors.accent.default,
          borderRadius: theme.radius.pill,
          transition: cssTransition('width', 'fast', 'easeOut'),
        }} />
      </div>
      {/* Native range input (invisible, on top for a11y) */}
      <input
        type="range" min={min} max={max} step={step} value={value}
        disabled={disabled} onChange={handleChange}
        style={{
          position: 'absolute', inset: 0, width: '100%',
          opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer',
          height: '44px', marginBlockStart: '-20px',
        }}
      />
    </div>
  )
}
