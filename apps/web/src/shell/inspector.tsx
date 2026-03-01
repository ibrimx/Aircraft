import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'

export type InspectorProps = {
  open: boolean
  onClose: () => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Inspector({
  open, onClose, children, className, style,
}: InspectorProps) {
  const theme = useThemeTokens()

  const asideStyle: CSSProperties = {
    width: open ? '280px' : '0px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.surface.default,
    borderInlineStart: open ? `1px solid ${theme.colors.border.subtle}` : 'none',
    transition: cssTransition('width', 'slow', 'easeInOut'),
    overflow: 'hidden',
    height: '100%',
    ...style,
  }

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: theme.spacing[3],
    paddingBlock: theme.spacing[2],
    borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
    flexShrink: 0,
  }

  const titleStyle: CSSProperties = { fontWeight: 600, color: theme.colors.text.primary }

  const closeBtnStyle: CSSProperties = {
    width: '28px',
    height: '28px',
    display: 'grid',
    placeItems: 'center',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: theme.colors.text.secondary,
    borderRadius: '6px',
  }

  const bodyStyle: CSSProperties = {
    flex: 1,
    overflow: 'auto',
    paddingInline: theme.spacing[3],
    paddingBlock: theme.spacing[2],
  }

  return (
    <aside className={className} style={asideStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>Inspector</span>
        <button onClick={onClose} aria-label="Close inspector" style={closeBtnStyle}>
          ✕
        </button>
      </div>
      <div style={bodyStyle}>
        {children}
      </div>
    </aside>
  )
}
