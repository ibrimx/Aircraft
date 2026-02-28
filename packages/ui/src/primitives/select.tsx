// P29 — select.tsx
import { useState, useRef, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'
import { Z_INDEX } from '@brimair/design-tokens'
import { cssTransition } from '@brimair/design-tokens'

export type SelectOption = { value: string; label: string; disabled?: boolean }
export type SelectSize = 'sm' | 'md' | 'lg'

export type SelectProps = {
  options: SelectOption[]
  value?: string
  placeholder?: string
  size?: SelectSize
  disabled?: boolean
  error?: boolean
  onChange: (value: string) => void
  className?: string
  style?: CSSProperties
}

const SIZE_MAP = {
  sm: { height: '32px', fontSize: '12px', paddingInline: '8px' },
  md: { height: '40px', fontSize: '1rem', paddingInline: '12px' },
  lg: { height: '48px', fontSize: '1rem', paddingInline: '16px' },
}

export function Select({
  options, value, placeholder = 'Select\u2026', size = 'md',
  disabled = false, error = false, onChange, className, style,
}: SelectProps) {
  const theme = useThemeTokens()
  const s = SIZE_MAP[size]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const borderColor = error
    ? theme.colors.destructive.default
    : theme.colors.border.default

  return (
    <div ref={ref} className={className} style= position: 'relative', ...style >
      {/* Trigger */}
      <button
        type="button" disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', height: s.height, paddingInline: s.paddingInline,
          background: theme.colors.surface.sunken,
          border: `1px solid ${borderColor}`,
          borderRadius: theme.radius.md,
          color: selected ? theme.colors.text.primary : theme.colors.text.tertiary,
          fontSize: s.fontSize, fontFamily: theme.fontFamily.sans,
          textAlign: 'start' as const, cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          transition: cssTransition('border-color', 'normal', 'easeInOut'),
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span style= fontSize: '10px', marginInlineStart: '8px' >{"\u25BC"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', insetInlineStart: 0, top: '100%',
          marginBlockStart: '4px', width: '100%',
          background: theme.colors.surface.raised,
          border: `1px solid ${theme.colors.border.subtle}`,
          borderRadius: theme.radius.md,
          boxShadow: theme.shadows.lg,
          zIndex: Z_INDEX.dropdown,
          maxHeight: '200px', overflowY: 'auto' as const,
        }}>
          {options.map((opt) => (
            <div
              key={opt.value} role="option" aria-selected={opt.value === value}
              onClick={() => { if (!opt.disabled) { onChange(opt.value); setOpen(false) } }}
              style=
                paddingBlock: '8px', paddingInline: s.paddingInline,
                fontSize: s.fontSize, fontFamily: theme.fontFamily.sans,
                color: opt.disabled ? theme.colors.text.disabled : theme.colors.text.primary,
                cursor: opt.disabled ? 'not-allowed' : 'pointer',
                background: opt.value === value ? theme.colors.accent.subtle : 'transparent',
              
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
