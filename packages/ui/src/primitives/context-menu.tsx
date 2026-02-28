// P32
import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'
import { Z_INDEX } from '@brimair/design-tokens'
import { isSeparator, MenuItemRow } from './dropdown-menu'
import type { MenuEntry } from './dropdown-menu'

export type ContextMenuProps = {
  items: MenuEntry[]
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function ContextMenu({
  items, children, className, style,
}: ContextMenuProps) {
  const theme = useThemeTokens()
  const [state, setState] = useState<{ open: boolean; x: number; y: number }>({
    open: false, x: 0, y: 0,
  })

  const handleContext = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setState({ open: true, x: e.clientX, y: e.clientY })
  }, [])

  const close = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  useEffect(() => {
    if (!state.open) return
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [state.open, close])

  return (
    <>
      <div onContextMenu={handleContext} className={className} style={style}>
        {children}
      </div>
      {state.open && createPortal(
        <>
          <div style= position: 'fixed', inset: 0, zIndex: Z_INDEX.popover - 1 
            onClick={close} onContextMenu={(e) => { e.preventDefault(); close() }} />
          <div role="menu" style={{
            position: 'fixed', top: state.y, left: state.x,
            zIndex: Z_INDEX.popover, minWidth: '180px',
            background: theme.colors.surface.raised,
            border: `1px solid ${theme.colors.border.subtle}`,
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.lg,
            paddingBlock: '4px',
          }}>
            {items.map((entry) =>
              isSeparator(entry)
                ? <div key={entry.id} style=
                    height: '1px', background: theme.colors.border.subtle, marginBlock: '4px',
                   />
                : <MenuItemRow key={entry.id} item={entry} theme={theme}
                    onSelect={() => { entry.onClick(); close() }} />
            )}
          </div>
        </>,
        document.body,
      )}
    </>
  )
}
