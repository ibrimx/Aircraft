// P35
import { useRef, useEffect } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'

export type ScrollAreaProps = {
  maxHeight?: string | number
  orientation?: 'vertical' | 'horizontal' | 'both'
  autoHide?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
}

let scrollStyleInjected = false

export function ScrollArea({
  maxHeight = '100%', orientation = 'vertical',
  autoHide = true, children, className, style,
}: ScrollAreaProps) {
  const theme = useThemeTokens()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollStyleInjected) return
    const css = [
      `.brimair-scroll::-webkit-scrollbar{width:6px;height:6px}`,
      `.brimair-scroll::-webkit-scrollbar-thumb{background:${theme.colors.border.default};border-radius:9999px}`,
      `.brimair-scroll::-webkit-scrollbar-track{background:transparent}`,
      `@media(prefers-reduced-motion:reduce){.brimair-scroll{scroll-behavior:auto!important}}`,
    ].join('')
    const sheet = document.createElement('style')
    sheet.textContent = css
    document.head.appendChild(sheet)
    scrollStyleInjected = true
  }, [theme])

  const overflow: CSSProperties = ({
    vertical:   { overflowY: 'auto', overflowX: 'hidden' },
    horizontal: { overflowX: 'auto', overflowY: 'hidden' },
    both:       { overflow: 'auto' },
  } as Record<string, CSSProperties>)[orientation]!

  return (
    <div
      ref={ref}
      className={`brimair-scroll ${className ?? ''}`}
      style={{
        maxHeight,
        ...overflow,
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollbarColor: `${theme.colors.border.default} transparent`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
