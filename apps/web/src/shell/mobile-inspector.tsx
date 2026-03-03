/**
 * Mobile Inspector — Bottom Sheet when element is selected
 * @package apps/web
 */

import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Move,
  Palette,
  PenTool,
  Sparkles,
  Trash2,
  Copy,
  MoreHorizontal,
  Lock,
  Unlock,
} from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type InspectorTab = 'position' | 'fill' | 'stroke' | 'effects'

export type MobileInspectorProps = {
  elementType?: 'rectangle' | 'ellipse' | 'text' | 'frame' | 'image'
  onDelete?: () => void
  onDuplicate?: () => void
  onMore?: () => void
  className?: string
  style?: CSSProperties
}

export function MobileInspector({
  elementType = 'rectangle',
  onDelete,
  onDuplicate,
  onMore,
  className,
  style,
}: MobileInspectorProps) {
  const theme = useThemeTokens()
  const [activeTab, setActiveTab] = useState<InspectorTab>('position')
  const [locked, setLocked] = useState(false)

  const tabs: { id: InspectorTab; label: string; icon: typeof Move }[] = [
    { id: 'position', label: 'Position', icon: Move },
    { id: 'fill', label: 'Fill', icon: Palette },
    { id: 'stroke', label: 'Stroke', icon: PenTool },
    { id: 'effects', label: 'Effects', icon: Sparkles },
  ]

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    ...style,
  }

  const tabBarStyle: CSSProperties = {
    display: 'flex',
    gap: '4px',
    paddingInline: '12px',
    paddingBlock: '8px',
    borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  }

  const tabStyle = (isActive: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingInline: '12px',
    paddingBlock: '6px',
    background: isActive ? theme.colors.accent.subtle : 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: isActive ? theme.colors.accent.default : theme.colors.text.secondary,
    fontSize: '12px',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'background 0.1s ease, color 0.1s ease',
  })

  const contentStyle: CSSProperties = {
    padding: '12px 16px',
  }

  const inputRowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBlockEnd: '8px',
  }

  const inputGroupStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  }

  const labelStyle: CSSProperties = {
    fontSize: '10px',
    fontWeight: 500,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  }

  const inputStyle: CSSProperties = {
    height: '32px',
    paddingInline: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid transparent',
    borderRadius: '6px',
    color: theme.colors.text.primary,
    fontSize: '13px',
    outline: 'none',
  }

  const actionsStyle: CSSProperties = {
    display: 'flex',
    gap: '8px',
    paddingInline: '16px',
    paddingBlock: '12px',
    borderBlockStart: `1px solid ${theme.colors.border.subtle}`,
  }

  const actionBtnStyle = (variant: 'danger' | 'default'): CSSProperties => ({
    flex: 1,
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: variant === 'danger' ? theme.colors.destructive.subtle : theme.colors.surface.raised,
    border: `1px solid ${variant === 'danger' ? 'transparent' : theme.colors.border.subtle}`,
    borderRadius: '8px',
    color: variant === 'danger' ? theme.colors.destructive.default : theme.colors.text.primary,
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
  })

  const moreBtnStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    display: 'grid',
    placeItems: 'center',
    background: theme.colors.surface.raised,
    border: `1px solid ${theme.colors.border.subtle}`,
    borderRadius: '8px',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    flexShrink: 0,
  }

  const colorSwatchStyle: CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: `1px solid ${theme.colors.border.subtle}`,
    cursor: 'pointer',
    flexShrink: 0,
  }

  return (
    <div className={className} style={containerStyle}>
      {/* Tabs */}
      <div style={tabBarStyle}>
        {tabs.map((tab) => {
          const IconComp = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={tabStyle(activeTab === tab.id)}
            >
              <IconComp size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {activeTab === 'position' && (
          <>
            <div style={inputRowStyle}>
              <div style={inputGroupStyle}>
                <span style={labelStyle}>X</span>
                <input type="text" defaultValue="120" style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <span style={labelStyle}>Y</span>
                <input type="text" defaultValue="80" style={inputStyle} />
              </div>
            </div>
            <div style={inputRowStyle}>
              <div style={inputGroupStyle}>
                <span style={labelStyle}>W</span>
                <input type="text" defaultValue="200" style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <span style={labelStyle}>H</span>
                <input type="text" defaultValue="150" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ ...inputGroupStyle, flex: 1 }}>
                <span style={labelStyle}>Rotation</span>
                <input type="text" defaultValue="0°" style={inputStyle} />
              </div>
              <button
                onClick={() => setLocked(!locked)}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  border: 'none',
                  borderRadius: '6px',
                  color: theme.colors.text.secondary,
                  cursor: 'pointer',
                }}
              >
                {locked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
            </div>
          </>
        )}

        {activeTab === 'fill' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ ...colorSwatchStyle, background: theme.colors.accent.default }} />
            <div style={{ ...inputGroupStyle, flex: 1 }}>
              <input type="text" defaultValue="#2F7DF6" style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
            <div style={{ ...inputGroupStyle, width: '60px' }}>
              <input type="text" defaultValue="100%" style={inputStyle} />
            </div>
          </div>
        )}

        {activeTab === 'stroke' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ ...colorSwatchStyle, background: 'transparent', borderWidth: '2px' }} />
            <div style={{ ...inputGroupStyle, flex: 1 }}>
              <input type="text" defaultValue="None" style={inputStyle} />
            </div>
            <div style={{ ...inputGroupStyle, width: '60px' }}>
              <input type="text" defaultValue="1px" style={inputStyle} />
            </div>
          </div>
        )}

        {activeTab === 'effects' && (
          <div style={{ color: theme.colors.text.tertiary, fontSize: '12px', textAlign: 'center', paddingBlock: '20px' }}>
            No effects applied. Tap + to add shadow, blur, or filter.
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={actionsStyle}>
        <button onClick={onDelete} style={actionBtnStyle('danger')}>
          <Trash2 size={14} />
          Delete
        </button>
        <button onClick={onDuplicate} style={actionBtnStyle('default')}>
          <Copy size={14} />
          Duplicate
        </button>
        <button onClick={onMore} style={moreBtnStyle}>
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}
