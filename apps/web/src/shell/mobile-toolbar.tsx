/**
 * Mobile Toolbar — Framer 2025 Style
 * Top bar for mobile layout
 * @package apps/web
 */

import { useState, type CSSProperties } from 'react'
import { Menu, Undo2, Play, MoreHorizontal } from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type MobileToolbarProps = {
  projectName?: string
  onMenuOpen?: () => void
  onPreview?: () => void
  onUndo?: () => void
  onMore?: () => void
  className?: string
  style?: CSSProperties
}

export function MobileToolbar({
  projectName = 'Untitled',
  onMenuOpen,
  onPreview,
  onUndo,
  onMore,
  className,
  style,
}: MobileToolbarProps) {
  const theme = useThemeTokens()
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    paddingInline: '8px',
    background: theme.colors.surface.default,
    borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
    flexShrink: 0,
    ...style,
  }

  const btnStyle = (id: string): CSSProperties => ({
    width: '36px',
    height: '36px',
    display: 'grid',
    placeItems: 'center',
    background: hoveredBtn === id ? 'rgba(255,255,255,0.04)' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: theme.colors.text.secondary,
    borderRadius: '6px',
    transition: 'background 0.1s ease',
    flexShrink: 0,
  })

  const titleStyle: CSSProperties = {
    flex: 1,
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 500,
    color: theme.colors.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingInline: '8px',
  }

  const sectionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  }

  return (
    <header className={className} style={headerStyle}>
      <div style={sectionStyle}>
        <button
          onClick={onMenuOpen}
          onPointerEnter={() => setHoveredBtn('menu')}
          onPointerLeave={() => setHoveredBtn(null)}
          aria-label="Open menu"
          style={btnStyle('menu')}
        >
          <Menu size={18} />
        </button>
      </div>

      <span style={titleStyle}>{projectName}</span>

      <div style={sectionStyle}>
        <button
          onClick={onUndo}
          onPointerEnter={() => setHoveredBtn('undo')}
          onPointerLeave={() => setHoveredBtn(null)}
          aria-label="Undo"
          style={btnStyle('undo')}
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={onPreview}
          onPointerEnter={() => setHoveredBtn('preview')}
          onPointerLeave={() => setHoveredBtn(null)}
          aria-label="Preview"
          style={btnStyle('preview')}
        >
          <Play size={16} />
        </button>
        <button
          onClick={onMore}
          onPointerEnter={() => setHoveredBtn('more')}
          onPointerLeave={() => setHoveredBtn(null)}
          aria-label="More options"
          style={btnStyle('more')}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </header>
  )
}
