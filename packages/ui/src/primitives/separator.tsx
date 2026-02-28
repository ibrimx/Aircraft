// P33
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'

export type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  style?: CSSProperties
}

export function Separator({
  orientation = 'horizontal', className, style,
}: SeparatorProps) {
  const theme = useThemeTokens()
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={className}
      style={{
        background: theme.colors.border.subtle,
        ...(isHorizontal
          ? { height: '1px', width: '100%' }
          : { width: '1px', alignSelf: 'stretch' }),
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
