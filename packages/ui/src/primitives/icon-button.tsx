/**
 * P26 — icon-button.tsx · Square icon button with required aria-label
 * @package @aircraft/ui
 */

import { forwardRef } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { Button } from './button'
import type { ButtonProps, ButtonSize } from './button'

export type IconButtonProps = Omit<ButtonProps, 'children' | 'fullWidth'> & {
  icon: ReactNode
  'aria-label': string
}

const ICON_SIZE: Record<ButtonSize, string> = {
  sm: '32px', md: '40px', lg: '48px',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, size = 'md', style, ...rest }, ref) {
    const iconStyle: CSSProperties = {
      width: ICON_SIZE[size],
      paddingInline: '0px',
      ...style,
    }

    return (
      <Button
        ref={ref}
        size={size}
        style={iconStyle}
        {...rest}
      >
        {icon}
      </Button>
    )
  },
)
