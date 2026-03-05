import React from 'react'

export function TopHeader({ title, statusRight }: { title: string; statusRight?: string }) {
  return (
    <div style={styles.wrap} aria-label="Top header">
      <div style={styles.title}>{title}</div>
      <div style={styles.status}>{statusRight ?? 'Ready'}</div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    background: 'linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,0))',
    borderBottom: '1px solid rgba(255,255,255,.06)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    zIndex: 60,
  },
  title: { color: 'var(--text-1)', fontWeight: 800, fontSize: 14 },
  status: { color: 'var(--text-2)', fontWeight: 700, fontSize: 12 },
}
