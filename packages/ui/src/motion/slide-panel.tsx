// P38 · slide-panel.tsx — directional slide with RTL + backdrop
import type { ReactNode, CSSProperties } from 'react'
import { AnimatedPresence } from './animated-presence'
import { TRANSITION_PRESETS } from './presets'
import { useThemeTokens, Z_INDEX, cssTransition } from '@aircraft/design-tokens'

export type SlidePanelDirection = 'left' | 'right' | 'top' | 'bottom'

export type SlidePanelProps = {
  visible: boolean
  direction?: SlidePanelDirection
  children: ReactNode
  width?: number | string
  height?: number | string
  overlay?: boolean
  onClose?: () => void
  className?: string
  style?: CSSProperties
}

const DIRECTION_STYLES: Record<SlidePanelDirection, (open: boolean) => CSSProperties> = {
  left: (open) => ({
    insetInlineStart: 0, top: 0, bottom: 0,
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
  }),
  right: (open) => ({
    insetInlineEnd: 0, top: 0, bottom: 0,
    transform: open ? 'translateX(0)' : 'translateX(100%)',
  }),
  top: (open) => ({
    top: 0, insetInlineStart: 0, insetInlineEnd: 0,
    transform: open ? 'translateY(0)' : 'translateY(-100%)',
  }),
  bottom: (open) => ({
    bottom: 0, insetInlineStart: 0, insetInlineEnd: 0,
    transform: open ? 'translateY(0)' : 'translateY(100%)',
  }),
}

export function SlidePanel({
  visible, direction = 'right', children,
  width = 300, height = '50%',
  overlay = true, onClose, className, style,
}: SlidePanelProps) {
  const theme = useThemeTokens()
  const isHorizontal = direction === 'left' || direction === 'right'

  return (
    <AnimatedPresence present={visible}>
      {overlay && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: theme.colors.surface.overlay,
            zIndex: Z_INDEX.overlay - 1,
            opacity: visible ? 1 : 0,
            transition: cssTransition('opacity', 'normal', 'easeInOut'),
          }}
        />
      )}
      <div
        className={className}
        style={{
          position: 'fixed',
          width: isHorizontal ? width : '100%',
          height: isHorizontal ? '100%' : height,
          zIndex: Z_INDEX.overlay,
          background: theme.colors.surface.raised,
          boxShadow: theme.shadows.xl,
          transition: cssTransition('transform', 'normal', 'easeOut'),
          ...DIRECTION_STYLES[direction](visible),
          ...style,
        }}
      >
        {children}
      </div>
    </AnimatedPresence>
  )
}
