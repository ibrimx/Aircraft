/**
 * Mobile Bottom Bar — Canva-style scrollable tools
 * @package apps/web
 */

import { useRef, useState, type CSSProperties } from 'react'
import {
  Plus,
  Layers,
  LayoutGrid,
  Type,
  Pen,
  Database,
  Image,
} from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type BottomBarCategory =
  | 'add'
  | 'layers'
  | 'layout'
  | 'text'
  | 'vector'
  | 'cms'
  | 'media'

export type MobileBottomBarProps = {
  activeCategory?: BottomBarCategory | null
  onCategoryPress?: (category: BottomBarCategory) => void
  className?: string
  style?: CSSProperties
}

type CategoryItem = {
  id: BottomBarCategory
  label: string
  icon: typeof Plus
}

const CATEGORIES: CategoryItem[] = [
  { id: 'add', label: 'Add', icon: Plus },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'layout', label: 'Layout', icon: LayoutGrid },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'vector', label: 'Vector', icon: Pen },
  { id: 'cms', label: 'CMS', icon: Database },
  { id: 'media', label: 'Media', icon: Image },
]

export function MobileBottomBar({
  activeCategory = null,
  onCategoryPress,
  className,
  style,
}: MobileBottomBarProps) {
  const theme = useThemeTokens()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [pressedId, setPressedId] = useState<string | null>(null)

  const barStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '52px',
    background: theme.colors.surface.default,
    borderBlockStart: `1px solid ${theme.colors.border.subtle}`,
    flexShrink: 0,
    ...style,
  }

  const scrollStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    paddingInline: '8px',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
    flex: 1,
  }

  const itemStyle = (isActive: boolean, isPressed: boolean): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    minWidth: '56px',
    height: '44px',
    paddingInline: '8px',
    background: isActive
      ? theme.colors.accent.subtle
      : isPressed
        ? 'rgba(255,255,255,0.04)'
        : 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.1s ease, transform 0.1s ease',
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    flexShrink: 0,
  })

  const iconStyle = (isActive: boolean): CSSProperties => ({
    color: isActive ? theme.colors.accent.default : theme.colors.text.secondary,
    transition: 'color 0.1s ease',
  })

  const labelStyle = (isActive: boolean): CSSProperties => ({
    fontSize: '10px',
    fontWeight: isActive ? 600 : 400,
    color: isActive ? theme.colors.accent.default : theme.colors.text.tertiary,
    whiteSpace: 'nowrap',
    transition: 'color 0.1s ease',
  })

  const handlePress = (id: BottomBarCategory) => {
    if (activeCategory === id) {
      onCategoryPress?.(id)
    } else {
      onCategoryPress?.(id)
    }
  }

  return (
    <div className={className} style={barStyle}>
      <div ref={scrollRef} style={scrollStyle}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id
          const isPressed = pressedId === cat.id
          const IconComp = cat.icon

          return (
            <button
              key={cat.id}
              onClick={() => handlePress(cat.id)}
              onPointerDown={() => setPressedId(cat.id)}
              onPointerUp={() => setPressedId(null)}
              onPointerLeave={() => setPressedId(null)}
              aria-label={cat.label}
              aria-pressed={isActive}
              style={itemStyle(isActive, isPressed)}
            >
              <IconComp size={18} style={iconStyle(isActive)} />
              <span style={labelStyle(isActive)}>{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
