// P31
import { useState, useRef, useCallback, useEffect, cloneElement } from 'react'
import { createPortal } from 'react-dom'
import type { ReactElement, CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'
import { Z_INDEX } from '@brimair/design-tokens'
import { cssTransition } from '@brimair/design-tokens'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = {
  content: string
  placement?: TooltipPlacement
  delay?: number
  children: ReactElement
  className?: string
  style?: CSSProperties
}

export function Tooltip({
  content, placement = 'top', delay = 300,
  children, className, style,
}: TooltipProps) {
  const theme = useThemeTokens()
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const pos = calcPosition(rect, placement)
      setCoords(pos)
      setVisible(true)
    }, delay)
  }, [delay, placement])

  const hide = useCallback(() => {
    clearTimeout(timerRef.current)
    setVisible(false)
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <>
      {cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: show, onMouseLeave: hide,
        onFocus: show, onBlur: hide,
      })}
      {visible && createPortal(
        <div
          role="tooltip" className={className}
          style={{
            position: 'fixed', top: coords.top, left: coords.left,
            zIndex: Z_INDEX.tooltip,
            background: theme.colors.text.primary,
            color: theme.colors.text.inverse,
            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
            borderRadius: theme.radius.sm,
            boxShadow: theme.shadows.sm,
            fontSize: theme.textStyles.caption.fontSize,
            fontFamily: theme.fontFamily.sans,
            maxWidth: '240px',
            pointerEvents: 'none',
            transition: cssTransition('opacity', 'fast', 'easeOut'),
            ...style,
          }}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  )
}

function calcPosition(
  rect: DOMRect, placement: TooltipPlacement,
): { top: number; left: number } {
  const GAP = 6
  switch (placement) {
    case 'top':    return { top: rect.top - GAP, left: rect.left + rect.width / 2 }
    case 'bottom': return { top: rect.bottom + GAP, left: rect.left + rect.width / 2 }
    case 'left':   return { top: rect.top + rect.height / 2, left: rect.left - GAP }
    case 'right':  return { top: rect.top + rect.height / 2, left: rect.right + GAP }
  }
}
