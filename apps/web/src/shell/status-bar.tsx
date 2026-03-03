/**
 * Status Bar — Framer 2025 Desktop Style
 * @package apps/web
 */

import type { CSSProperties } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type StatusBarProps = {
  zoom?: number
  selectedCount?: number
  isOnline?: boolean
  canvasWidth?: number
  canvasHeight?: number
  className?: string
  style?: CSSProperties
}

export function StatusBar({
  zoom = 100,
  selectedCount = 0,
  isOnline = true,
  canvasWidth = 1440,
  canvasHeight = 900,
  className,
  style,
}: StatusBarProps) {
  const theme = useThemeTokens()

  const footerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '24px',
    paddingInline: '12px',
    background: theme.colors.surface.default,
    borderBlockStart: `1px solid ${theme.colors.border.subtle}`,
    fontSize: '10px',
    color: theme.colors.text.tertiary,
    flexShrink: 0,
    userSelect: 'none',
    ...style,
  }

  const sectionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }

  const sepStyle: CSSProperties = {
    width: '1px',
    height: '10px',
    background: theme.colors.border.subtle,
  }

  const dotStyle: CSSProperties = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: isOnline ? theme.colors.success.default : theme.colors.warning.default,
    flexShrink: 0,
  }

  return (
    <footer className={className} style={footerStyle}>
      <div style={sectionStyle}>
        <span>{zoom}%</span>
        <div style={sepStyle} />
        <span>{selectedCount > 0 ? `${selectedCount} selected` : 'No selection'}</span>
        <div style={sepStyle} />
        <span>{canvasWidth} × {canvasHeight}</span>
      </div>

      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={dotStyle} />
          <span>{isOnline ? 'Connected' : 'Offline'}</span>
        </div>
      </div>
    </footer>
  )
}
