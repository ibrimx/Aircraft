/**
 * Sidebar Rail — Framer 2025 Desktop Style
 * @package apps/web
 */

import { useState, type CSSProperties } from 'react'
import {
  Layers,
  Image,
  Component,
  FileText,
  Database,
  Settings,
  Search,
} from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type SidebarRailProps = {
  activePanel?: string
  onPanelChange?: (panel: string) => void
  onExpand?: () => void
  className?: string
  style?: CSSProperties
}

type PanelItem = {
  id: string
  icon: typeof Layers
  label: string
  shortcut: string
}

const TOP_ITEMS: PanelItem[] = [
  { id: 'layers', icon: Layers, label: 'Layers', shortcut: '⌘1' },
  { id: 'assets', icon: Image, label: 'Assets', shortcut: '⌘2' },
  { id: 'components', icon: Component, label: 'Components', shortcut: '⌘3' },
  { id: 'pages', icon: FileText, label: 'Pages', shortcut: '⌘4' },
  { id: 'cms', icon: Database, label: 'CMS', shortcut: '⌘5' },
]

const BOTTOM_ITEMS: PanelItem[] = [
  { id: 'search', icon: Search, label: 'Search', shortcut: '⌘F' },
  { id: 'settings', icon: Settings, label: 'Settings', shortcut: '⌘,' },
]

export function SidebarRail({
  activePanel = 'layers',
  onPanelChange,
  onExpand,
  className,
  style,
}: SidebarRailProps) {
  const theme = useThemeTokens()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '44px',
    paddingBlock: '6px',
    gap: '1px',
    height: '100%',
    background: theme.colors.surface.default,
    borderInlineEnd: `1px solid ${theme.colors.border.subtle}`,
    flexShrink: 0,
    ...style,
  }

  const sepStyle: CSSProperties = {
    width: '22px',
    height: '1px',
    background: theme.colors.border.subtle,
    marginBlock: '4px',
  }

  const btnStyle = (id: string): CSSProperties => {
    const isActive = activePanel === id
    const isHovered = hoveredItem === id
    return {
      width: '32px',
      height: '32px',
      display: 'grid',
      placeItems: 'center',
      background: isActive
        ? theme.colors.accent.subtle
        : isHovered
          ? 'rgba(255,255,255,0.04)'
          : 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: isActive
        ? theme.colors.accent.default
        : theme.colors.text.secondary,
      borderRadius: '6px',
      transition: 'background 0.1s ease, color 0.1s ease',
      flexShrink: 0,
    }
  }

  const handleClick = (id: string) => {
    onPanelChange?.(id)
    onExpand?.()
  }

  return (
    <div className={className} style={rootStyle}>
      {TOP_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            onPointerEnter={() => setHoveredItem(item.id)}
            onPointerLeave={() => setHoveredItem(null)}
            aria-label={item.label}
            aria-pressed={activePanel === item.id}
            title={`${item.label} (${item.shortcut})`}
            style={btnStyle(item.id)}
          >
            <Icon size={16} />
          </button>
        )
      })}

      <div style={{ flex: 1 }} />

      <div style={sepStyle} />

      {BOTTOM_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            onPointerEnter={() => setHoveredItem(item.id)}
            onPointerLeave={() => setHoveredItem(null)}
            aria-label={item.label}
            aria-pressed={activePanel === item.id}
            title={`${item.label} (${item.shortcut})`}
            style={btnStyle(item.id)}
          >
            <Icon size={16} />
          </button>
        )
      })}
    </div>
  )
}
