// P34
import { useRef, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'
import type { RadiusKey } from '@brimair/design-tokens'

export type SkeletonProps = {
  width?: string | number
  height?: string | number
  radius?: RadiusKey
  circle?: boolean
  className?: string
  style?: CSSProperties
}

const SHIMMER_STYLES = [
  '@keyframes brimair-shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}',
  '@media(prefers-reduced-motion:reduce){[data-brimair-shimmer]{animation:none!important}}',
].join('')

export function Skeleton({
  width = '100%', height = '20px',
  radius = 'md', circle = false,
  className, style,
}: SkeletonProps) {
  const theme = useThemeTokens()
  const injected = useRef(false)

  useEffect(() => {
    if (injected.current) return
    const sheet = document.createElement('style')
    sheet.textContent = SHIMMER_STYLES
    document.head.appendChild(sheet)
    injected.current = true
  }, [])

  const dim = circle ? (typeof width === 'number' ? width : height) : undefined

  return (
    <div
      className={className}
      style=
        width: circle ? dim : width,
        height: circle ? dim : height,
        borderRadius: circle ? '50%' : theme.radius[radius],
        background: theme.colors.surface.sunken,
        overflow: 'hidden',
        position: 'relative',
        ...style,
      
    >
      <div
        data-brimair-shimmer
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${theme.colors.border.subtle} 50%, transparent 100%)`,
          animation: 'brimair-shimmer 1.5s ease-in-out infinite',
        }}
      />
    </div>
  )
}
