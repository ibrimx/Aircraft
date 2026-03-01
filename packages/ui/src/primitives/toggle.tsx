// P28 — toggle.tsx
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'

export type ToggleProps = {
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
  size?: 'sm' | 'md'
  'aria-label': string
  className?: string
  style?: CSSProperties
}

const SIZE_MAP = {
  sm: { trackW: '36px', trackH: '20px', thumb: '16px', travel: '16px' },
  md: { trackW: '44px', trackH: '24px', thumb: '20px', travel: '20px' },
}

export function Toggle({
  checked, disabled = false, onChange, size = 'md',
  className, style, ...rest
}: ToggleProps) {
  const theme = useThemeTokens()
  const s = SIZE_MAP[size]

  return (
    <button
      role="switch" aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center',
        width: s.trackW, height: s.trackH,
        borderRadius: theme.radius.pill,
        padding: '2px',
        border: 'none', outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? theme.colors.accent.default : theme.colors.border.default,
        opacity: disabled ? 0.4 : 1,
        transition: cssTransition('background', 'normal', 'easeInOut'),
        ...style,
      }}
      {...rest}
    >
      <span style={{
        width: s.thumb, height: s.thumb,
        borderRadius: '50%', background: '#FFFFFF',
        boxShadow: theme.shadows.sm,
        transform: checked ? `translateX(${s.travel})` : 'translateX(0)',
        transition: cssTransition('transform', 'normal', 'easeInOut'),
      }} />
    </button>
  )
}
