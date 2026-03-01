// P27
import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'

export type InputSize = 'sm' | 'md' | 'lg'

export type InputProps = {
  size?: InputSize
  error?: boolean
  helperText?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  fullWidth?: boolean
  className?: string
  style?: CSSProperties
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>

const SIZE_MAP = {
  sm: { height: '32px', fontSize: '12px', paddingInline: '8px' },
  md: { height: '40px', fontSize: '1rem', paddingInline: '12px' },
  lg: { height: '48px', fontSize: '1rem', paddingInline: '16px' },
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({
    size = 'md', error = false, helperText, startIcon, endIcon,
    fullWidth = false, className, style, disabled, ...rest
  }, ref) {
    const theme = useThemeTokens()
    const s = SIZE_MAP[size]
    const borderColor = error
      ? theme.colors.destructive.default
      : theme.colors.border.default

    return (
      <div style=463>
        <div
          className={className}
          style={{
            display: 'flex', alignItems: 'center', gap: theme.spacing[2],
            height: s.height,
            paddingInline: s.paddingInline,
            background: theme.colors.surface.sunken,
            border: `1px solid ${borderColor}`,
            borderRadius: theme.radius.md,
            transition: cssTransition('border-color', 'normal', 'easeInOut'),
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            ...style,
          }}
        >
          {startIcon}
          <input
            ref={ref}
            disabled={disabled}
            style=464
            {...rest}
          />
          {endIcon}
        </div>
        {helperText && (
          <span style=465>
            {helperText}
          </span>
        )}
      </div>
    )
  },
)
