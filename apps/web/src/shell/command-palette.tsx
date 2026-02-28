import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'
import { Z_INDEX } from '@brimair/design-tokens'
import { cssTransition } from '@brimair/design-tokens'

export type CommandItem = {
  id: string; label: string; icon?: ReactNode
  shortcut?: string; section?: string; onSelect: () => void
}

export type CommandPaletteProps = {
  onClose: () => void
  commands?: CommandItem[]
  className?: string
  style?: CSSProperties
}

export function CommandPalette({
  onClose, commands = [], className, style,
}: CommandPaletteProps) {
  const theme = useThemeTokens()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const filtered = useMemo(
    () => commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query],
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[activeIndex]) { filtered[activeIndex].onSelect(); onClose() }
  }, [filtered, activeIndex, onClose])

  return createPortal(
    <div style=
      position: 'fixed', inset: 0, zIndex: Z_INDEX.modal,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '20vh',
     onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style=
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
       />
      <div className={className} style={{
        position: 'relative', width: '100%', maxWidth: '560px',
        background: 'rgba(28,28,28,0.85)', backdropFilter: 'blur(20px)',
        borderRadius: '12px', border: `1px solid ${theme.colors.border.subtle}`,
        boxShadow: theme.shadows.xl, overflow: 'hidden',
        ...style,
      }} onKeyDown={handleKeyDown}>
        <div style={{ paddingInline: theme.spacing[4], paddingBlock: theme.spacing[3],
          borderBlockEnd: `1px solid ${theme.colors.border.subtle}`,
        }}>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Type a command…"
            style=
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              fontSize: theme.textStyles.body.fontSize, color: theme.colors.text.primary,
             />
        </div>
        <div style= maxHeight: '320px', overflow: 'auto', paddingBlock: theme.spacing[1] >
          {filtered.map((cmd, i) => (
            <div key={cmd.id}
              onClick={() => { cmd.onSelect(); onClose() }}
              style=
                display: 'flex', alignItems: 'center', gap: theme.spacing[2],
                paddingInline: theme.spacing[4], paddingBlock: theme.spacing[2],
                cursor: 'pointer',
                background: i === activeIndex ? theme.colors.accent.subtle : 'transparent',
                color: theme.colors.text.primary,
              >
              {cmd.icon && <span>{cmd.icon}</span>}
              <span style= flex: 1 >{cmd.label}</span>
              {cmd.shortcut && (
                <span style=
                  fontSize: theme.textStyles.caption.fontSize,
                  color: theme.colors.text.tertiary,
                  background: 'rgba(255,255,255,0.08)', borderRadius: '4px',
                  paddingInline: '6px', paddingBlock: '2px',
                >{cmd.shortcut}</span>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style=
              paddingInline: theme.spacing[4], paddingBlock: theme.spacing[3],
              color: theme.colors.text.tertiary, textAlign: 'center',
            >No commands found</div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
