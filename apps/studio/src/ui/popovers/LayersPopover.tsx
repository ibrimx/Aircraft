import React from 'react'
import type { Doc } from '../../editor/state/doc'

/**
 * Layers popover MVP
 * R3 ✅ small & pure
 * R2 ✅ tokens only (assumes tokens.css)
 */
export function LayersPopover({ open, onClose, doc }: { open: boolean; onClose: () => void; doc: Doc }) {
  if (!open) return null

  return (
    <div style={styles.wrap} role="dialog" aria-label="Layers">
      <div style={styles.sheet}>
        <div style={styles.header}>
          <div style={styles.title}>Layers</div>
          <button type="button" onClick={onClose} style={styles.close} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={styles.list}>
          {doc.order.map((id) => {
            const n = doc.nodes[id]
            if (!n) return null
            return (
              <div key={id} style={styles.row}>
                <div style={styles.name}>{n.name}</div>
                <div style={styles.meta}>
                  <span style={styles.icon} title={n.visible ? 'Visible' : 'Hidden'}>
                    {n.visible ? '👁️' : '🚫'}
                  </span>
                  <span style={styles.icon} title={n.locked ? 'Locked' : 'Unlocked'}>
                    {n.locked ? '🔒' : '🔓'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { position: 'absolute', left: 14, right: 14, bottom: 92, display: 'flex', justifyContent: 'center', zIndex: 80 },
  sheet: {
    width: 'min(520px, 100%)',
    borderRadius: 22,
    border: '1px solid var(--stroke-2)',
    background: 'var(--surface-1)',
    boxShadow: 'var(--shadow-3)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    overflow: 'hidden',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 14px', borderBottom: '1px solid var(--stroke-2)' },
  title: { color: 'var(--text-1)', fontWeight: 900, fontSize: 16 },
  close: {
    color: 'var(--text-2)',
    background: 'transparent',
    border: '1px solid var(--stroke-2)',
    borderRadius: 12,
    padding: '6px 10px',
    cursor: 'pointer',
  },
  list: { padding: 12, display: 'flex', flexDirection: 'column', gap: 10 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 12px', borderRadius: 16, background: 'var(--surface-0)', border: '1px solid var(--stroke-2)' },
  name: { color: 'var(--text-1)', fontWeight: 800 },
  meta: { display: 'flex', gap: 10 },
  icon: { opacity: 0.9 },
}
