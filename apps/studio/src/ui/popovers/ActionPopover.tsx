import React from 'react'

/**
 * Action popover MVP (assets/fonts/plugins later)
 * R7 ✅ extensibility: placeholder menu
 */
export function ActionPopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div style={styles.wrap} role="dialog" aria-label="Action">
      <div style={styles.sheet}>
        <div style={styles.header}>
          <div style={styles.title}>Action</div>
          <button type="button" onClick={onClose} style={styles.close} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.item}>Assets (soon)</div>
          <div style={styles.item}>Fonts Manager (soon)</div>
          <div style={styles.item}>Plugins (soon)</div>
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
  body: { padding: 12, display: 'flex', flexDirection: 'column', gap: 10 },
  item: {
    padding: '12px 12px',
    borderRadius: 16,
    background: 'var(--surface-0)',
    border: '1px solid var(--stroke-2)',
    color: 'var(--text-1)',
    fontWeight: 800,
  },
}
