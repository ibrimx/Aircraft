/**
 * Toolbar — Framer 2025 Desktop Style
 * Now with Builder integration
 * @package apps/web
 */

'use client'

import { useState, type ReactNode, type CSSProperties } from 'react'
import {
  MousePointer2,
  Frame,
  Square,
  Circle,
  Type,
  Minus,
  PenTool,
  Hand,
  Undo2,
  Redo2,
  Play,
  Share2,
  Download,
  MoreHorizontal,
  Menu,
} from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { useBuilder } from '@aircraft/builder-engine'

export type ToolbarProps = {
  onToggleSidebar?: () => void
  onToggleInspector?: () => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

type ToolDef = {
  id: string
  icon: typeof MousePointer2
  label: string
  shortcut: string
}

const TOOLS: ToolDef[] = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'frame', icon: Frame, label: 'Frame', shortcut: 'F' },
  { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse', shortcut: 'O' },
  { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
  { id: 'line', icon: Minus, label: 'Line', shortcut: 'L' },
  { id: 'pen', icon: PenTool, label: 'Pen', shortcut: 'P' },
  { id: 'hand', icon: Hand, label: 'Hand', shortcut: 'H' },
]

export function Toolbar({
  onToggleSidebar,
  onToggleInspector,
  children,
  className,
  style,
}: ToolbarProps) {
  const theme = useThemeTokens()
  const builder = useBuilder()
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)

  const saveStatusLabel = builder.isDirty ? 'Unsaved' : 'Saved'
  const saveStatusColor = builder.isDirty ? theme.colors.warning.default : theme.colors.text.tertiary

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    paddingInline: '8px',
    background: theme.colors.surface.default,
    borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
    gap: '2px',
    flexShrink: 0,
    ...style,
  }

  const sectionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1px',
  }

  const logoStyle: CSSProperties = {
    width: '28px',
    height: '28px',
    display: 'grid',
    placeItems: 'center',
    background: theme.colors.accent.default,
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 700,
    marginInlineEnd: '6px',
    flexShrink: 0,
  }

  const sepStyle: CSSProperties = {
    width: '1px',
    height: '18px',
    background: theme.colors.border.subtle,
    marginInline: '4px',
    flexShrink: 0,
  }

  const toolBtnBase: CSSProperties = {
    width: '30px',
    height: '30px',
    display: 'grid',
    placeItems: 'center',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background 0.1s ease, color 0.1s ease',
    flexShrink: 0,
  }

  const toolBtnStyle = (id: string): CSSProperties => {
    const isActive = builder.activeTool === id
    const isHovered = hoveredBtn === id
    return {
      ...toolBtnBase,
      background: isActive
        ? theme.colors.accent.subtle
        : isHovered
          ? 'rgba(255,255,255,0.04)'
          : 'transparent',
      color: isActive
        ? theme.colors.accent.default
        : theme.colors.text.secondary,
    }
  }

  const centerStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minWidth: 0,
  }

  const projectStyle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: theme.colors.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  const statusStyle: CSSProperties = {
    fontSize: '10px',
    fontWeight: 500,
    color: saveStatusColor,
    background: 'rgba(255,255,255,0.04)',
    paddingInline: '6px',
    paddingBlock: '2px',
    borderRadius: '4px',
    flexShrink: 0,
  }

  const actionBtnStyle = (id: string): CSSProperties => ({
    ...toolBtnBase,
    background: hoveredBtn === id ? 'rgba(255,255,255,0.04)' : 'transparent',
    color: theme.colors.text.secondary,
  })

  const publishBtnStyle: CSSProperties = {
    height: '28px',
    paddingInline: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: theme.colors.accent.default,
    border: 'none',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.1s ease',
  }

  return (
    <header className={className} style={headerStyle}>
      {/* Left — Logo + Sidebar Toggle + Tools */}
      <div style={sectionStyle}>
        <div style={logoStyle}>A</div>

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            onPointerEnter={() => setHoveredBtn('sidebar')}
            onPointerLeave={() => setHoveredBtn(null)}
            aria-label="Toggle sidebar"
            style={actionBtnStyle('sidebar')}
          >
            <Menu size={16} />
          </button>
        )}

        <div style={sepStyle} />

        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => builder.setTool(tool.id)}
              onPointerEnter={() => setHoveredBtn(tool.id)}
              onPointerLeave={() => setHoveredBtn(null)}
              aria-label={tool.label}
              aria-pressed={builder.activeTool === tool.id}
              title={`${tool.label} (${tool.shortcut})`}
              style={toolBtnStyle(tool.id)}
            >
              <Icon size={16} />
            </button>
          )
        })}
      </div>

      {/* Center — Project Name + Save Status */}
      <div style={centerStyle}>
        <span style={projectStyle}>{builder.documentName}</span>
        <span style={statusStyle}>{saveStatusLabel}</span>
        {children}
      </div>

      {/* Right — Actions */}
      <div style={sectionStyle}>
        <button
          onClick={builder.undo}
          onPointerEnter={() => setHoveredBtn('undo')}
          onPointerLeave={() => setHoveredBtn(null)}
          aria-label="Undo"
          title="Undo (⌘Z)"
          disabled={!builder.canUndo}
          style={{
            ...actionBtnStyle('undo'),
            opacity: builder.canUndo ? 1 : 0.3,
          }}
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={builder.redo}
          onPointerEnter={() => setHoveredBtn('redo')}
          onPointerLeave={() => setHoveredBtn(null)}
          aria-label="Redo"
          title="Redo (⌘⇧Z)"
          disabled={!builder.canRedo}
          style={{
            ...actionBtnStyle('redo'),
            opacity: builder.canRedo ? 1 : 0.3,
          }}
        >
          <Redo2 size={16} />
        </button>

        <div style={sepStyle} />

        <button
          onClick={() => {}}
          onPointerEnter={() => setHoveredBtn('preview')}
          onPointerLeave={() => setHoveredBtn(null)}
          aria-label="Preview"
          title="Preview (⌘P)"
          style={actionBtnStyle('preview')}
        >
          <Play size={16} />
        </button>
        <button
          onClick={() => {}}
          onPointerEnter={() => setHoveredBtn('export')}
          onPointerLeave={() => setHoveredBtn(null)}
          aria-label="Export"
          title="Export"
          style={actionBtnStyle('export')}
        >
          <Download size={16} />
        </button>

        <div style={sepStyle} />

        <button
          onClick={() => builder.save()}
          style={publishBtnStyle}
        >
          <Share2 size={14} />
          Save
        </button>

        {onToggleInspector && (
          <>
            <div style={sepStyle} />
            <button
              onClick={onToggleInspector}
              onPointerEnter={() => setHoveredBtn('inspector')}
              onPointerLeave={() => setHoveredBtn(null)}
              aria-label="Toggle inspector"
              style={actionBtnStyle('inspector')}
            >
              <MoreHorizontal size={16} />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
