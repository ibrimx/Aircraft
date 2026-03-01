/**
 * P26 — button.tsx · Theme-aware button with 4 variants × 3 sizes
 * @package @aircraft/ui
 */

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react'
import { useThemeTokens, cssTransition } from '@aircraft/design-tokens'
import type { AircraftTheme } from '@aircraft/design-tokens'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>

const SIZE_MAP = {
  sm: { height: '32px', paddingInline: '8px', textStyle: 'caption' as const },
  md: { height: '40px', paddingInline: '16px', textStyle: 'body' as const },
  lg: { height: '48px', paddingInline: '24px', textStyle: 'body' as const },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', disabled = false,
      loading = false, fullWidth = false, children, className, style, ...rest },
    ref,
  ) {
    const theme = useThemeTokens()
    const s = SIZE_MAP[size]
    const variantStyle = getVariantStyle(variant, theme)

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={className}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: theme.spacing[2],
          height: s.height,
          paddingInline: s.paddingInline,
          borderRadius: theme.radius.md,
          fontFamily: theme.fontFamily.sans,
          fontSize: theme.textStyles[s.textStyle].fontSize,
          fontWeight: theme.textStyles[s.textStyle].fontWeight,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled || loading ? 0.4 : 1,
          width: fullWidth ? '100%' : 'auto',
          transition: cssTransition('background', 'normal', 'easeInOut'),
          border: 'none',
          outline: 'none',
          ...variantStyle,
          ...style,
        }}
        {...rest}
      >
        {loading ? '\u2026' : children}
      </button>
    )
  },
)

function getVariantStyle(variant: ButtonVariant, theme: AircraftTheme): CSSProperties {
  switch (variant) {
    case 'primary': return {
      background: theme.colors.accent.default, color: '#FFFFFF',
    }
    case 'secondary': return {
      background: 'transparent', color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.default}`,
    }
    case 'ghost': return {
      background: 'transparent', color: theme.colors.text.primary,
    }
    case 'destructive': return {
      background: theme.colors.destructive.default, color: '#FFFFFF',
    }
  }
}
