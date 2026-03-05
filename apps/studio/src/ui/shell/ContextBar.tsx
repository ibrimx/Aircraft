import React from 'react'

/**
 * Context bar above bottom pill.
 *
 * R1 ✅ Single source of truth: بيقرأ activeTool من EditorShell.
 * R2 ✅ Tokens only: styling via CSS vars.
 * R3 ✅ Pure: مفيش effects.
 * R4 ✅ Performance: pointerEvents none (UI hint فقط).
 */

export type ToolId = 'select' | 'text' | 'shape' | 'layers' | 'action'

export type ContextBarProps = {
  activeTool: ToolId
  rightHint?: string
}

function toolLabel(tool: ToolId) {
  switch (tool) {
    case 'text':
      return 'Text Tool'
    case 'shape':
      return 'Shape Tool'
    case 'layers':
      return 'Layers'
    case 'action':
      return 'Action'
    case 'select':
    default:
      return 'Select Tool'
  }
}

function toolHint(tool: ToolId) {
  switch (tool) {
    case 'text':
      return 'Tap/click to place text • Enter to commit'
    case 'shape':
      return 'Tap/click to place shape'
    case 'layers':
      return 'Manage layers'
    case 'action':
      return 'Assets • Fonts • Plugins'
    case 'select':
    default:
      return 'Ready'
  }
}

export function ContextBar({ activeTool, rightHint }: ContextBarProps) {
  const left = toolLabel(activeTool)
  const right = rightHint ?? toolHint(activeTool)

  return (
    <div style={styles.wrap} aria-label="Context bar">
      <div style={styles.pill}>
        <span style={styles.left}>{left}</span>
        <span style={styles.sep} />
        <span style={styles.right}>{right}</span>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 74,
    display: 'flex',
    justifyContent: 'space-between',
    pointerEvents: 'none', // R4 ✅
    zIndex: 45,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 999,
    border: '1px solid var(--stroke-2)', // R2 ✅
    background: 'var(--surface-0)', // R2 ✅
    boxShadow: 'var(--shadow-1)', // R2 ✅
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  left: { color: 'var(--text-1)', fontSize: 12, fontWeight: 800 }, // R2 ✅
  right: { color: 'var(--text-2)', fontSize: 12, fontWeight: 700 }, // R2 ✅
  sep: { width: 1, height: 14, background: 'var(--stroke-2)' }, // R2 ✅
}
