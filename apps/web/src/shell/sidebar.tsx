/**
 * Sidebar — Framer 2025 Desktop Style
 * @package apps/web
 */

import { useState, type ReactNode, type CSSProperties } from 'react'
import {
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  GripVertical,
  Search,
  Plus,
  Frame,
  Type as TypeIcon,
  Square,
  Image,
  Component,
} from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { SidebarRail } from './sidebar-rail'

export type SidebarProps = {
  open: boolean
  onToggle: () => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

type MockLayer = {
  id: string
  name: string
  type: 'frame' | 'text' | 'rectangle' | 'image' | 'component'
  visible: boolean
  children?: MockLayer[]
}

const MOCK_LAYERS: MockLayer[] = [
  {
    id: 'frame-1',
    name: 'Desktop — 1440',
    type: 'frame',
    visible: true,
    children: [
      { id: 'nav', name: 'Navigation', type: 'frame', visible: true },
      { id: 'hero-title', name: 'Hero Title', type: 'text', visible: true },
      { id: 'hero-sub', name: 'Subtitle', type: 'text', visible: true },
      { id: 'cta-btn', name: 'CTA Button', type: 'component', visible: true },
      { id: 'hero-img', name: 'Hero Image', type: 'image', visible: true },
      { id: 'card-1', name: 'Feature Card', type: 'rectangle', visible: true },
      { id: 'card-2', name: 'Feature Card 2', type: 'rectangle', visible: false },
    ],
  },
  {
    id: 'frame-2',
    name: 'Mobile — 375',
    type: 'frame',
    visible: true,
    children: [],
  },
]

const TYPE_ICONS: Record<string, typeof Frame> = {
  frame: Frame,
  text: TypeIcon,
  rectangle: Square,
  image: Image,
  component: Component,
}

export function Sidebar({ open, onToggle, children, className, style }: SidebarProps) {
  const theme = useThemeTokens()
  const [activePanel, setActivePanel] = useState('layers')
  const [expandedFrames, setExpandedFrames] = useState<Set<string>>(new Set(['frame-1']))
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null)
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleExpand = (id: string) => {
    setExpandedFrames((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    flexShrink: 0,
    ...style,
  }

  const panelStyle: CSSProperties = {
    width: open ? '220px' : '0px',
    overflow: 'hidden',
    background: theme.colors.surface.default,
    borderInlineEnd: open ? `1px solid ${theme.colors.border.subtle}` : 'none',
    transition: 'width 0.2s ease-out',
    display: 'flex',
    flexDirection: 'column',
  }

  const panelHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '36px',
    paddingInline: '12px',
    borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
    flexShrink: 0,
  }

  const panelTitleStyle: CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  }

  const addBtnStyle: CSSProperties = {
    width: '22px',
    height: '22px',
    display: 'grid',
    placeItems: 'center',
    background: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: theme.colors.text.tertiary,
  }

  const searchStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    margin: '6px 8px',
    paddingInline: '8px',
    height: '28px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid transparent',
    borderRadius: '6px',
    fontSize: '11px',
    color: theme.colors.text.tertiary',
    flexShrink: 0,
  }

  const searchInputStyle: CSSProperties = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: theme.colors.text.primary,
    fontSize: '11px',
  }

  const layerBodyStyle: CSSProperties = {
    flex: 1,
    overflow: 'auto',
    paddingBlock: '4px',
  }

  const frameRowStyle = (id: string): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    paddingInline: '8px',
    paddingBlock: '4px',
    cursor: 'pointer',
    background: selectedLayer === id
      ? theme.colors.accent.subtle
      : hoveredLayer === id
        ? 'rgba(255,255,255,0.04)'
        : 'transparent',
    transition: 'background 0.08s ease',
  })

  const childRowStyle = (id: string): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    paddingInlineStart: '28px',
    paddingInlineEnd: '8px',
    paddingBlock: '3px',
    cursor: 'pointer',
    background: selectedLayer === id
      ? theme.colors.accent.subtle
      : hoveredLayer === id
        ? 'rgba(255,255,255,0.04)'
        : 'transparent',
    transition: 'background 0.08s ease',
  })

  const chevronStyle = (expanded: boolean): CSSProperties => ({
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.12s ease',
    color: theme.colors.text.tertiary,
    flexShrink: 0,
  })

  const layerNameStyle = (isSelected: boolean): CSSProperties => ({
    fontSize: '12px',
    color: isSelected ? theme.colors.accent.default : theme.colors.text.primary,
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  })

  const visibilityStyle: CSSProperties = {
    color: theme.colors.text.tertiary,
    flexShrink: 0,
    opacity: 0,
    transition: 'opacity 0.1s ease',
  }

  const emptyStyle: CSSProperties = {
    color: theme.colors.text.tertiary,
    fontSize: '11px',
    textAlign: 'center',
    paddingBlock: '24px',
  }

  const panelTitles: Record<string, string> = {
    layers: 'Layers',
    assets: 'Assets',
    components: 'Components',
    pages: 'Pages',
    cms: 'CMS',
    search: 'Search',
    settings: 'Settings',
  }

  return (
    <nav className={className} style={rootStyle}>
      <SidebarRail
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        onExpand={() => !open && onToggle()}
      />

      <div style={panelStyle}>
        <div style={panelHeaderStyle}>
          <span style={panelTitleStyle}>{panelTitles[activePanel] || 'Panel'}</span>
          {activePanel === 'layers' && (
            <button style={addBtnStyle} aria-label="Add layer">
              <Plus size={14} />
            </button>
          )}
        </div>

        {activePanel === 'layers' && (
          <>
            <div style={searchStyle}>
              <Search size={12} />
              <input
                type="text"
                placeholder="Search layers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
            </div>

            <div style={layerBodyStyle}>
              {MOCK_LAYERS.map((frame) => {
                const isExpanded = expandedFrames.has(frame.id)
                const FrameIcon = TYPE_ICONS[frame.type]

                return (
                  <div key={frame.id}>
                    <div
                      style={frameRowStyle(frame.id)}
                      onClick={() => { setSelectedLayer(frame.id); toggleExpand(frame.id) }}
                      onPointerEnter={() => setHoveredLayer(frame.id)}
                      onPointerLeave={() => setHoveredLayer(null)}
                    >
                      <ChevronRight size={12} style={chevronStyle(isExpanded)} />
                      <FrameIcon size={13} style={{ color: theme.colors.text.tertiary, flexShrink: 0 }} />
                      <span style={layerNameStyle(selectedLayer === frame.id)}>{frame.name}</span>
                      <Eye
                        size={12}
                        style={{
                          ...visibilityStyle,
                          opacity: hoveredLayer === frame.id ? 1 : 0,
                        }}
                      />
                    </div>

                    {isExpanded && frame.children?.map((child) => {
                      const ChildIcon = TYPE_ICONS[child.type]
                      return (
                        <div
                          key={child.id}
                          style={childRowStyle(child.id)}
                          onClick={() => setSelectedLayer(child.id)}
                          onPointerEnter={() => setHoveredLayer(child.id)}
                          onPointerLeave={() => setHoveredLayer(null)}
                        >
                          <ChildIcon
                            size={12}
                            style={{
                              color: theme.colors.text.tertiary,
                              flexShrink: 0,
                              opacity: child.visible ? 1 : 0.3,
                            }}
                          />
                          <span style={{
                            ...layerNameStyle(selectedLayer === child.id),
                            opacity: child.visible ? 1 : 0.4,
                          }}>
                            {child.name}
                          </span>
                          {hoveredLayer === child.id && (
                            <GripVertical size={10} style={{ color: theme.colors.text.tertiary }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {activePanel === 'assets' && (
          <div style={{ padding: '8px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px',
            }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    background: theme.colors.surface.raised,
                    borderRadius: '6px',
                    border: `1px solid ${theme.colors.border.subtle}`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activePanel === 'components' && <div style={emptyStyle}>No components yet</div>}
        {activePanel === 'pages' && <div style={emptyStyle}>Page 1 (Home)</div>}
        {activePanel === 'cms' && <div style={emptyStyle}>No collections</div>}
        {activePanel === 'search' && <div style={emptyStyle}>Type to search</div>}
        {activePanel === 'settings' && <div style={emptyStyle}>Project Settings</div>}

        {children}
      </div>
    </nav>
  )
}
