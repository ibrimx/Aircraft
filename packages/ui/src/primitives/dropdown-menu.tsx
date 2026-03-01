// P32
import { useState, useRef, useEffect } from 'react'
import type { ReactElement, ReactNode, CSSProperties } from 'react'
import { useThemeTokens, Z_INDEX, cssTransition } from '@aircraft/design-tokens'

export type MenuItemType = 'default' | 'destructive'

export type MenuItem = {
  id: string; label: string; icon?: ReactNode
  type?: MenuItemType; disabled?: boolean
  shortcut?: string; onClick: () => void
}

export type MenuSeparator = { id: string; separator: true }
export type MenuEntry = MenuItem | MenuSeparator

export function isSeparator(entry: MenuEntry): entry is MenuSeparator {
  return 'separator' in entry && entry.separator === true
}

export type DropdownMenuProps = {
  items: MenuEntry[]
  trigger: ReactElement
  placement?: 'bottom-start' | 'bottom-end'
  className?: string
  style?: CSSProperties
}

export function DropdownMenu({
  items, trigger, placement = 'bottom-start', className, style,
}: DropdownMenuProps) {
  const theme = useThemeTokens()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const wrapperStyle: CSSProperties = { position: 'relative', ...style }

  const separatorStyle: CSSProperties = {
    height: '1px',
    background: theme.colors.border.subtle,
    marginBlock: '4px',
  }

  return (
    <div ref={ref} className={className} style={wrapperStyle}>
      <div onClick={() => setOpen((p) => !p)}>{trigger}</div>
      {open && (
        <div role="menu" style={{
          position: 'absolute',
          ...(placement === 'bottom-end'
            ? { insetInlineEnd: 0, top: '100%' }
            : { insetInlineStart: 0, top: '100%' }),
          marginBlockStart: '4px', minWidth: '180px',
          background: theme.colors.surface.raised,
          border: `1px solid ${theme.colors.border.subtle}`,
          borderRadius: theme.radius.md,
          boxShadow: theme.shadows.lg,
          zIndex: Z_INDEX.dropdown,
          paddingBlock: '4px', overflow: 'hidden',
        }}>
          {items.map((entry) =>
            isSeparator(entry)
              ? <div key={entry.id} style={separatorStyle} />
              : <MenuItemRow key={entry.id} item={entry} theme={theme}
                  onSelect={() => { entry.onClick(); setOpen(false) }} />
          )}
        </div>
      )}
    </div>
  )
}

export function MenuItemRow({ item, theme, onSelect }: {
  item: MenuItem; theme: ReturnType<typeof useThemeTokens>; onSelect: () => void
}) {
  const isDestructive = item.type === 'destructive'

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBlock: '6px',
    paddingInline: '12px',
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    opacity: item.disabled ? 0.4 : 1,
    color: isDestructive ? theme.colors.destructive.default : theme.colors.text.primary,
    fontSize: theme.textStyles.body.fontSize,
    fontFamily: theme.fontFamily.sans,
    minHeight: '36px',
    transition: cssTransition('background', 'fast', 'easeInOut'),
  }

  const iconStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    width: '16px',
    height: '16px',
  }

  const labelStyle: CSSProperties = { flex: 1 }

  const shortcutStyle: CSSProperties = {
    marginInlineStart: 'auto',
    fontSize: '11px',
    color: theme.colors.text.tertiary,
    fontFamily: theme.fontFamily.mono,
  }

  return (
    <div
      role="menuitem" tabIndex={item.disabled ? -1 : 0}
      onClick={() => { if (!item.disabled) onSelect() }}
      onKeyDown={(e) => { if (e.key === 'Enter' && !item.disabled) onSelect() }}
      style={rowStyle}
    >
      {item.icon && <span style={iconStyle}>{item.icon}</span>}
      <span style={labelStyle}>{item.label}</span>
      {item.shortcut && <span style={shortcutStyle}>{item.shortcut}</span>}
    </div>
  )
}
