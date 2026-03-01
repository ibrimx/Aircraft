import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type ToolbarProps = {
  onToggleSidebar?: () => void
  onToggleInspector?: () => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Toolbar({
  onToggleSidebar, onToggleInspector, children, className, style,
}: ToolbarProps) {
  const theme = useThemeTokens()
  const toggleStyle: CSSProperties = {
    width: '44px', height: '44px', display: 'grid', placeItems: 'center',
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: theme.colors.text.primary, borderRadius: '8px',
  }
  const sectionStyle: CSSProperties = { display: 'flex', alignItems: 'center' }
  const headerStyle: CSSProperties = {
    display: 'flex', alignItems: 'center',
    height: '48px', paddingInline: theme.spacing[2],
    background: theme.colors.surface.default,
    borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
    gap: theme.spacing[1], flexShrink: 0,
    ...style,
  }
  const centerStyle: CSSProperties = {
    flex: 1, display: 'flex', justifyContent: 'center', gap: theme.spacing[1],
  }
  return (
    <header className={className} style={headerStyle}>
      <div style={sectionStyle}>
        {onToggleSidebar && (
          <button onClick={onToggleSidebar} aria-label="Toggle sidebar" style={toggleStyle}>☰</button>
        )}
      </div>
      <div style={centerStyle}>{children}</div>
      <div style={sectionStyle}>
        {onToggleInspector && (
          <button onClick={onToggleInspector} aria-label="Toggle inspector" style={toggleStyle}>⚙</button>
        )}
      </div>
    </header>
  )
}
