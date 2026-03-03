/**
 * Mobile Category Panels — Content for each bottom bar category
 * @package apps/web
 */

import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Monitor,
  Tablet,
  Smartphone,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Pentagon,
  Star,
  PenTool,
  Upload,
  Search,
  Plus,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  GripVertical,
  Trash2,
  Copy,
  Database,
} from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'
import type { BottomBarCategory } from './mobile-bottom-bar'

export type MobileCategoryPanelsProps = {
  activeCategory: BottomBarCategory
}

export function MobileCategoryPanels({ activeCategory }: MobileCategoryPanelsProps) {
  switch (activeCategory) {
    case 'add': return <AddPanel />
    case 'layers': return <LayersPanel />
    case 'layout': return <LayoutPanel />
    case 'text': return <TextPanel />
    case 'vector': return <VectorPanel />
    case 'cms': return <CmsPanel />
    case 'media': return <MediaPanel />
    default: return null
  }
}

/* ═══════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════ */

function PanelHeader({ title, onClose }: { title: string; onClose?: () => void }) {
  const theme = useThemeTokens()

  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: '16px',
    paddingBlock: '12px',
    borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
  }

  const titleStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: theme.colors.text.primary,
  }

  return (
    <div style={style}>
      <span style={titleStyle}>{title}</span>
    </div>
  )
}

function SectionTitle({ children }: { children: string }) {
  const theme = useThemeTokens()

  return (
    <div style={{
      fontSize: '10px',
      fontWeight: 600,
      color: theme.colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      paddingInline: '16px',
      paddingBlockStart: '16px',
      paddingBlockEnd: '8px',
    }}>
      {children}
    </div>
  )
}

function GridItem({ icon, label, onPress }: { icon: ReactNode; label: string; onPress?: () => void }) {
  const theme = useThemeTokens()
  const [pressed, setPressed] = useState(false)

  const style: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    paddingBlock: '16px',
    background: pressed ? 'rgba(255,255,255,0.04)' : theme.colors.surface.raised,
    border: `1px solid ${theme.colors.border.subtle}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.1s ease, transform 0.1s ease',
    transform: pressed ? 'scale(0.96)' : 'scale(1)',
  }

  const labelStyle: CSSProperties = {
    fontSize: '11px',
    color: theme.colors.text.secondary,
  }

  return (
    <button
      onClick={onPress}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={style}
    >
      {icon}
      <span style={labelStyle}>{label}</span>
    </button>
  )
}

function ListItem({ icon, label, trailing, onPress }: {
  icon: ReactNode
  label: string
  trailing?: ReactNode
  onPress?: () => void
}) {
  const theme = useThemeTokens()
  const [pressed, setPressed] = useState(false)

  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingInline: '16px',
    paddingBlock: '10px',
    background: pressed ? 'rgba(255,255,255,0.04)' : 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.1s ease',
    width: '100%',
    textAlign: 'start',
  }

  const iconWrap: CSSProperties = {
    width: '32px',
    height: '32px',
    display: 'grid',
    placeItems: 'center',
    background: theme.colors.surface.raised,
    borderRadius: '6px',
    color: theme.colors.text.secondary,
    flexShrink: 0,
  }

  const labelStyle: CSSProperties = {
    fontSize: '13px',
    color: theme.colors.text.primary,
    flex: 1,
  }

  return (
    <button
      onClick={onPress}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={style}
    >
      <div style={iconWrap}>{icon}</div>
      <span style={labelStyle}>{label}</span>
      {trailing}
    </button>
  )
}

/* ═══════════════════════════════════════════════════
   ADD PANEL
   ═══════════════════════════════════════════════════ */

function AddPanel() {
  const theme = useThemeTokens()

  return (
    <div>
      <PanelHeader title="Add Element" />

      <SectionTitle>Frames</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', paddingInline: '16px' }}>
        <GridItem icon={<Smartphone size={20} color={theme.colors.text.secondary} />} label="Mobile" />
        <GridItem icon={<Tablet size={20} color={theme.colors.text.secondary} />} label="Tablet" />
        <GridItem icon={<Monitor size={20} color={theme.colors.text.secondary} />} label="Desktop" />
        <GridItem icon={<Square size={20} color={theme.colors.text.secondary} />} label="Custom" />
      </div>

      <SectionTitle>Components</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', paddingInline: '16px' }}>
        <GridItem icon={<Square size={20} color={theme.colors.text.secondary} />} label="Button" />
        <GridItem icon={<Square size={20} color={theme.colors.text.secondary} />} label="Card" />
        <GridItem icon={<Square size={20} color={theme.colors.text.secondary} />} label="Input" />
        <GridItem icon={<Square size={20} color={theme.colors.text.secondary} />} label="Nav" />
      </div>

      <SectionTitle>Embed</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', paddingInline: '16px', paddingBlockEnd: '16px' }}>
        <GridItem icon={<Square size={20} color={theme.colors.text.secondary} />} label="Code" />
        <GridItem icon={<Square size={20} color={theme.colors.text.secondary} />} label="YouTube" />
        <GridItem icon={<Square size={20} color={theme.colors.text.secondary} />} label="Map" />
        <GridItem icon={<Star size={20} color={theme.colors.text.secondary} />} label="Lottie" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   LAYERS PANEL
   ═══════════════════════════════════════════════════ */

function LayersPanel() {
  const theme = useThemeTokens()
  const [expandedFrame, setExpandedFrame] = useState<string | null>('frame-1')

  const mockLayers = [
    {
      id: 'frame-1',
      name: 'Frame - Mobile',
      type: 'frame',
      children: [
        { id: 'header', name: 'Header', type: 'frame' },
        { id: 'heading', name: 'Heading', type: 'text' },
        { id: 'paragraph', name: 'Paragraph', type: 'text' },
        { id: 'button', name: 'Button', type: 'component' },
        { id: 'bg-image', name: 'Background', type: 'image' },
      ],
    },
    {
      id: 'frame-2',
      name: 'Frame - Desktop',
      type: 'frame',
      children: [],
    },
  ]

  const searchStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '8px 16px',
    paddingInline: '10px',
    height: '32px',
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid transparent`,
    borderRadius: '6px',
    color: theme.colors.text.tertiary,
    fontSize: '12px',
  }

  const frameStyle = (isExpanded: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingInline: '16px',
    paddingBlock: '8px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'start',
  })

  const childStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingInlineStart: '40px',
    paddingInlineEnd: '16px',
    paddingBlock: '6px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'start',
  }

  const chevronStyle = (expanded: boolean): CSSProperties => ({
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.15s ease',
    color: theme.colors.text.tertiary,
  })

  const typeIcons: Record<string, string> = {
    frame: '⬜',
    text: 'T',
    component: '⧉',
    image: '🖼',
  }

  return (
    <div>
      <PanelHeader title="Layers" />

      <div style={searchStyle}>
        <Search size={14} />
        <span>Search layers...</span>
      </div>

      {mockLayers.map((frame) => {
        const isExpanded = expandedFrame === frame.id
        return (
          <div key={frame.id}>
            <button
              onClick={() => setExpandedFrame(isExpanded ? null : frame.id)}
              style={frameStyle(isExpanded)}
            >
              <ChevronRight size={14} style={chevronStyle(isExpanded)} />
              <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>📱</span>
              <span style={{ fontSize: '13px', color: theme.colors.text.primary, flex: 1 }}>{frame.name}</span>
              <Eye size={14} style={{ color: theme.colors.text.tertiary }} />
            </button>

            {isExpanded && frame.children.map((child) => (
              <button key={child.id} style={childStyle}>
                <span style={{ fontSize: '11px', color: theme.colors.text.tertiary, width: '16px', textAlign: 'center' }}>
                  {typeIcons[child.type] || '□'}
                </span>
                <span style={{ fontSize: '12px', color: theme.colors.text.primary, flex: 1 }}>{child.name}</span>
                <GripVertical size={12} style={{ color: theme.colors.text.tertiary }} />
              </button>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   LAYOUT PANEL
   ═══════════════════════════════════════════════════ */

function LayoutPanel() {
  const theme = useThemeTokens()
  const [direction, setDirection] = useState<'row' | 'column'>('column')

  const toggleGroupStyle: CSSProperties = {
    display: 'flex',
    gap: '4px',
    paddingInline: '16px',
  }

  const toggleStyle = (isActive: boolean): CSSProperties => ({
    flex: 1,
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: isActive ? theme.colors.accent.subtle : theme.colors.surface.raised,
    border: `1px solid ${isActive ? theme.colors.accent.default : theme.colors.border.subtle}`,
    borderRadius: '6px',
    color: isActive ? theme.colors.accent.default : theme.colors.text.secondary,
    fontSize: '12px',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 0.1s ease',
  })

  const alignGroupStyle: CSSProperties = {
    display: 'flex',
    gap: '4px',
    paddingInline: '16px',
  }

  const alignBtnStyle: CSSProperties = {
    width: '36px',
    height: '36px',
    display: 'grid',
    placeItems: 'center',
    background: theme.colors.surface.raised,
    border: `1px solid ${theme.colors.border.subtle}`,
    borderRadius: '6px',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
  }

  const sliderWrapStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingInline: '16px',
  }

  const sliderStyle: CSSProperties = {
    flex: 1,
    height: '4px',
    appearance: 'none',
    background: theme.colors.surface.raised,
    borderRadius: '2px',
    outline: 'none',
  }

  const sliderValueStyle: CSSProperties = {
    fontSize: '12px',
    color: theme.colors.text.primary,
    minWidth: '36px',
    textAlign: 'end',
  }

  const inputRowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
    paddingInline: '16px',
  }

  const miniInputStyle: CSSProperties = {
    height: '32px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid transparent',
    borderRadius: '4px',
    color: theme.colors.text.primary,
    fontSize: '12px',
    textAlign: 'center',
    outline: 'none',
  }

  const miniLabelStyle: CSSProperties = {
    fontSize: '9px',
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginBlockStart: '2px',
  }

  return (
    <div>
      <PanelHeader title="Layout" />

      <SectionTitle>Direction</SectionTitle>
      <div style={toggleGroupStyle}>
        <button onClick={() => setDirection('row')} style={toggleStyle(direction === 'row')}>
          ↔ Row
        </button>
        <button onClick={() => setDirection('column')} style={toggleStyle(direction === 'column')}>
          ↕ Column
        </button>
      </div>

      <SectionTitle>Justify</SectionTitle>
      <div style={alignGroupStyle}>
        <button style={alignBtnStyle} aria-label="Start"><AlignLeft size={14} /></button>
        <button style={alignBtnStyle} aria-label="Center"><AlignCenter size={14} /></button>
        <button style={alignBtnStyle} aria-label="End"><AlignRight size={14} /></button>
        <button style={alignBtnStyle} aria-label="Between"><AlignJustify size={14} /></button>
      </div>

      <SectionTitle>Align</SectionTitle>
      <div style={alignGroupStyle}>
        <button style={alignBtnStyle} aria-label="Start"><AlignLeft size={14} /></button>
        <button style={alignBtnStyle} aria-label="Center"><AlignCenter size={14} /></button>
        <button style={alignBtnStyle} aria-label="End"><AlignRight size={14} /></button>
        <button style={alignBtnStyle} aria-label="Stretch"><AlignJustify size={14} /></button>
      </div>

      <SectionTitle>Gap</SectionTitle>
      <div style={sliderWrapStyle}>
        <input type="range" min="0" max="64" defaultValue="16" style={sliderStyle} />
        <span style={sliderValueStyle}>16px</span>
      </div>

      <SectionTitle>Padding</SectionTitle>
      <div style={inputRowStyle}>
        <div>
          <input type="text" defaultValue="16" style={miniInputStyle} />
          <div style={miniLabelStyle}>Top</div>
        </div>
        <div>
          <input type="text" defaultValue="16" style={miniInputStyle} />
          <div style={miniLabelStyle}>Right</div>
        </div>
        <div>
          <input type="text" defaultValue="16" style={miniInputStyle} />
          <div style={miniLabelStyle}>Bottom</div>
        </div>
        <div>
          <input type="text" defaultValue="16" style={miniInputStyle} />
          <div style={miniLabelStyle}>Left</div>
        </div>
      </div>

      <div style={{ height: '16px' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   TEXT PANEL
   ═══════════════════════════════════════════════════ */

function TextPanel() {
  const theme = useThemeTokens()

  const addBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    paddingInline: '16px',
    paddingBlock: '12px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'start',
  }

  const addIconStyle: CSSProperties = {
    width: '36px',
    height: '36px',
    display: 'grid',
    placeItems: 'center',
    background: theme.colors.accent.subtle,
    borderRadius: '8px',
    color: theme.colors.accent.default,
  }

  const styleCardStyle = (size: string): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: '20px',
    background: theme.colors.surface.raised,
    border: `1px solid ${theme.colors.border.subtle}`,
    borderRadius: '8px',
    cursor: 'pointer',
  })

  const textStyles = [
    { name: 'H1', size: '36px', weight: 700 },
    { name: 'H2', size: '28px', weight: 700 },
    { name: 'H3', size: '22px', weight: 600 },
    { name: 'Body', size: '16px', weight: 400 },
  ]

  return (
    <div>
      <PanelHeader title="Text" />

      <button style={addBtnStyle}>
        <div style={addIconStyle}><Plus size={18} /></div>
        <div>
          <div style={{ fontSize: '13px', color: theme.colors.text.primary, fontWeight: 500 }}>Add Heading</div>
          <div style={{ fontSize: '11px', color: theme.colors.text.tertiary }}>Large title text</div>
        </div>
      </button>

      <button style={addBtnStyle}>
        <div style={addIconStyle}><Plus size={18} /></div>
        <div>
          <div style={{ fontSize: '13px', color: theme.colors.text.primary, fontWeight: 500 }}>Add Paragraph</div>
          <div style={{ fontSize: '11px', color: theme.colors.text.tertiary }}>Body text block</div>
        </div>
      </button>

      <SectionTitle>Text Styles</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', paddingInline: '16px', paddingBlockEnd: '16px' }}>
        {textStyles.map((ts) => (
          <button key={ts.name} style={styleCardStyle(ts.size)}>
            <span style={{ fontSize: ts.name === 'Body' ? '14px' : '18px', fontWeight: ts.weight, color: theme.colors.text.primary }}>{ts.name}</span>
            <span style={{ fontSize: '10px', color: theme.colors.text.tertiary, marginBlockStart: '4px' }}>{ts.size}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   VECTOR PANEL
   ═══════════════════════════════════════════════════ */

function VectorPanel() {
  const theme = useThemeTokens()

  return (
    <div>
      <PanelHeader title="Vector" />

      <SectionTitle>Shapes</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', paddingInline: '16px' }}>
        <GridItem icon={<Square size={20} color={theme.colors.text.secondary} />} label="Rectangle" />
        <GridItem icon={<Circle size={20} color={theme.colors.text.secondary} />} label="Ellipse" />
        <GridItem icon={<Minus size={20} color={theme.colors.text.secondary} />} label="Line" />
        <GridItem icon={<ArrowRight size={20} color={theme.colors.text.secondary} />} label="Arrow" />
      </div>

      <div style={{ height: '8px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', paddingInline: '16px', paddingBlockEnd: '16px' }}>
        <GridItem icon={<Pentagon size={20} color={theme.colors.text.secondary} />} label="Polygon" />
        <GridItem icon={<Star size={20} color={theme.colors.text.secondary} />} label="Star" />
        <GridItem icon={<PenTool size={20} color={theme.colors.text.secondary} />} label="Pen" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CMS PANEL
   ═══════════════════════════════════════════════════ */

function CmsPanel() {
  const theme = useThemeTokens()

  const collections = [
    { name: 'Blog Posts', count: 12 },
    { name: 'Products', count: 8 },
    { name: 'Team Members', count: 5 },
  ]

  return (
    <div>
      <PanelHeader title="CMS" />

      <SectionTitle>Collections</SectionTitle>
      {collections.map((col) => (
        <ListItem
          key={col.name}
          icon={<Database size={16} />}
          label={col.name}
          trailing={
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: theme.colors.text.tertiary }}>{col.count}</span>
              <ChevronRight size={14} style={{ color: theme.colors.text.tertiary }} />
            </div>
          }
        />
      ))}

      <div style={{ paddingInline: '16px', paddingBlock: '12px' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          height: '40px',
          background: 'transparent',
          border: `1px dashed ${theme.colors.border.default}`,
          borderRadius: '8px',
          color: theme.colors.text.secondary,
          fontSize: '13px',
          cursor: 'pointer',
        }}>
          <Plus size={16} />
          Create Collection
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   MEDIA PANEL
   ═══════════════════════════════════════════════════ */

function MediaPanel() {
  const theme = useThemeTokens()

  return (
    <div>
      <PanelHeader title="Media" />

      <div style={{ paddingInline: '16px', paddingBlock: '12px' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          height: '48px',
          background: theme.colors.accent.subtle,
          border: 'none',
          borderRadius: '8px',
          color: theme.colors.accent.default,
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
        }}>
          <Upload size={18} />
          Upload Image or Video
        </button>
      </div>

      <SectionTitle>Recent Uploads</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        paddingInline: '16px',
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

      <SectionTitle>Stock Photos</SectionTitle>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginInline: '16px',
        paddingInline: '10px',
        height: '32px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid transparent',
        borderRadius: '6px',
        color: theme.colors.text.tertiary,
        fontSize: '12px',
        marginBlockEnd: '12px',
      }}>
        <Search size={14} />
        <span>Search Unsplash...</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        paddingInline: '16px',
        paddingBlockEnd: '16px',
      }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              aspectRatio: '4/3',
              background: theme.colors.surface.raised,
              borderRadius: '6px',
              border: `1px solid ${theme.colors.border.subtle}`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
