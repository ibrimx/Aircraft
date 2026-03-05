import React from 'react'

/**
 * Bottom pill toolbar
 *
 * R3 ✅ Small + pure: مفيش state داخلي، مجرد props.
 * R2 ✅ Tokens only: styling يعتمد على tokens (var(--...)).
 * R5 ✅ A11y: buttons + aria-pressed.
 * R4 ✅ Performance: wrapper pointerEvents none لتجنب hit-testing خارج الأزرار.
 */

export type ToolId = 'select' | 'text' | 'shape' | 'layers' | 'action'

export type BottomPillProps = {
  activeTool: ToolId // R1 ✅ مصدر واحد: EditorShell هو اللي يمرر activeTool
  onSelectTool: (tool: ToolId) => void // R1 ✅ تغيير الأداة يتم عبر callback واحد
}

export function BottomPill({ activeTool, onSelectTool }: BottomPillProps) {
  return (
    <div style={styles.wrap} aria-label="Bottom toolbar">
      <div style={styles.pill}>
        <ToolButton
          label="Select"
          active={activeTool === 'select'}
          onClick={() => onSelectTool('select')}
        />
        <ToolButton
          label="Text"
          active={activeTool === 'text'}
          onClick={() => onSelectTool('text')}
        />
        <ToolButton
          label="Shape"
          active={activeTool === 'shape'}
          onClick={() => onSelectTool('shape')}
        />
        <ToolButton
          label="Layers"
          active={activeTool === 'layers'}
          onClick={() => onSelectTool('layers')}
        />
        <ToolButton
          label="Action"
          active={activeTool === 'action'}
          onClick={() => onSelectTool('action')}
        />
      </div>
    </div>
  )
}

function ToolButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active} // R5 ✅
      style={{
        ...styles.btn,
        ...(active ? styles.btnActive : styles.btnIdle),
      }}
    >
      {label}
    </button>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none', // R4 ✅
    zIndex: 50,
  },
  pill: {
    pointerEvents: 'auto', // R4 ✅ only the pill receives pointer input
    display: 'flex',
    gap: 8,
    padding: 8,
    borderRadius: 999,
    border: '1px solid var(--stroke-2)', // R2 ✅
    background: 'var(--surface-1)', // R2 ✅
    boxShadow: 'var(--shadow-2)', // R2 ✅
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
  },
  btn: {
    border: '1px solid transparent',
    borderRadius: 999,
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    transition:
      'transform 120ms ease, background 120ms ease, border-color 120ms ease, color 120ms ease',
    userSelect: 'none',
    lineHeight: 1,
  },
  btnIdle: {
    color: 'var(--text-2)', // R2 ✅
    background: 'transparent',
  },
  btnActive: {
    color: 'var(--text-1)', // R2 ✅
    background: 'var(--accent-1)', // R2 ✅
    borderColor: 'var(--accent-2)', // R2 ✅
    transform: 'translateY(-1px)',
  },
}
