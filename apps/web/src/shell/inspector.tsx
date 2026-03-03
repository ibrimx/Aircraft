/**
 * Inspector — Framer 2025 Desktop Style
 * @package apps/web
 */

import { useState, type ReactNode, type CSSProperties } from 'react'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Lock,
  Unlock,
  Plus,
  Eye,
  Trash2,
} from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type InspectorProps = {
  open: boolean
  onClose: () => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Inspector({ open, onClose, children, className, style }: InspectorProps) {
  const theme = useThemeTokens()

  const asideStyle: CSSProperties = {
    width: open ? '260px' : '0px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    background: theme.colors.surface.default,
    borderInlineStart: open ? `1px solid ${theme.colors.border.subtle}` : 'none',
    transition: 'width 0.2s ease-out',
    overflow: 'hidden',
    height: '100%',
    ...style,
  }

  const scrollStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  }

  return (
    <aside className={className} style={asideStyle}>
      <div style={scrollStyle}>
        <PositionSection theme={theme} />
        <Divider theme={theme} />
        <AlignmentSection theme={theme} />
        <Divider theme={theme} />
        <FillSection theme={theme} />
        <Divider theme={theme} />
        <StrokeSection theme={theme} />
        <Divider theme={theme} />
        <CornerRadiusSection theme={theme} />
        <Divider theme={theme} />
        <ShadowSection theme={theme} />
        <Divider theme={theme} />
        <EffectsSection theme={theme} />
      </div>
      {children}
    </aside>
  )
}

/* ─── Shared ─── */

function Section({ title, theme, action, children }: {
  title: string
  theme: any
  action?: { icon: typeof Plus; onClick: () => void }
  children: ReactNode
}) {
  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBlockEnd: '8px',
  }
  const titleStyle: CSSProperties = {
    fontSize: '10px',
    fontWeight: 600,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }
  const actionStyle: CSSProperties = {
    width: '20px',
    height: '20px',
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: theme.colors.text.secondary,
  }

  return (
    <div style={{ padding: '10px 12px' }}>
      <div style={headerStyle}>
        <span style={titleStyle}>{title}</span>
        {action && (
          <button onClick={action.onClick} style={actionStyle}>
            <action.icon size={12} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function Divider({ theme }: { theme: any }) {
  return <div style={{ height: '1px', background: theme.colors.border.subtle, marginInline: '12px' }} />
}

function InspectorInput({ label, value, theme, mono, style }: {
  label?: string
  value: string
  theme: any
  mono?: boolean
  style?: CSSProperties
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      {label && (
        <span style={{
          fontSize: '10px',
          fontWeight: 500,
          color: theme.colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {label}
        </span>
      )}
      <input
        type="text"
        defaultValue={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: '28px',
          paddingInline: '8px',
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${focused ? theme.colors.accent.default : 'transparent'}`,
          borderRadius: '4px',
          color: theme.colors.text.primary,
          fontSize: '12px',
          fontFamily: mono ? 'monospace' : 'inherit',
          outline: 'none',
          transition: 'border-color 0.1s ease',
        }}
      />
    </div>
  )
}

function SmallButton({ icon: Icon, label, theme, isActive, onClick }: {
  icon: typeof AlignLeft
  label: string
  theme: any
  isActive?: boolean
  onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-label={label}
      title={label}
      style={{
        width: '28px',
        height: '28px',
        display: 'grid',
        placeItems: 'center',
        background: isActive
          ? theme.colors.accent.subtle
          : hovered
            ? 'rgba(255,255,255,0.04)'
            : 'transparent',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        color: isActive ? theme.colors.accent.default : theme.colors.text.secondary,
        transition: 'background 0.08s ease',
      }}
    >
      <Icon size={14} />
    </button>
  )
}

/* ─── Sections ─── */

function PositionSection({ theme }: { theme: any }) {
  const [locked, setLocked] = useState(false)

  return (
    <Section title="Position" theme={theme}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <InspectorInput label="X" value="0" theme={theme} />
        <InspectorInput label="Y" value="0" theme={theme} />
        <InspectorInput label="W" value="200" theme={theme} />
        <InspectorInput label="H" value="150" theme={theme} />
      </div>
      <div style={{ display: 'flex', gap: '6px', marginBlockStart: '6px', alignItems: 'flex-end' }}>
        <InspectorInput label="Rotation" value="0°" theme={theme} style={{ flex: 1 }} />
        <button
          onClick={() => setLocked(!locked)}
          aria-label="Lock aspect ratio"
          style={{
            width: '28px',
            height: '28px',
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: theme.colors.text.secondary,
          }}
        >
          {locked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>
      </div>
    </Section>
  )
}

function AlignmentSection({ theme }: { theme: any }) {
  return (
    <Section title="Alignment" theme={theme}>
      <div style={{ display: 'flex', gap: '2px' }}>
        <SmallButton icon={AlignLeft} label="Align left" theme={theme} />
        <SmallButton icon={AlignCenter} label="Align center" theme={theme} />
        <SmallButton icon={AlignRight} label="Align right" theme={theme} />
        <div style={{ width: '1px', height: '20px', background: theme.colors.border.subtle, marginInline: '4px', alignSelf: 'center' }} />
        <SmallButton icon={AlignStartVertical} label="Align top" theme={theme} />
        <SmallButton icon={AlignCenterVertical} label="Align middle" theme={theme} />
        <SmallButton icon={AlignEndVertical} label="Align bottom" theme={theme} />
      </div>
    </Section>
  )
}

function FillSection({ theme }: { theme: any }) {
  return (
    <Section title="Fill" theme={theme} action={{ icon: Plus, onClick: () => {} }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '4px',
          background: theme.colors.accent.default,
          border: `1px solid ${theme.colors.border.subtle}`,
          cursor: 'pointer',
          flexShrink: 0,
        }} />
        <InspectorInput value="#2F7DF6" theme={theme} mono style={{ flex: 1 }} />
        <InspectorInput value="100" theme={theme} style={{ width: '48px' }} />
      </div>
    </Section>
  )
}

function StrokeSection({ theme }: { theme: any }) {
  return (
    <Section title="Stroke" theme={theme} action={{ icon: Plus, onClick: () => {} }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '4px',
          background: 'transparent',
          border: `2px solid ${theme.colors.border.default}`,
          cursor: 'pointer',
          flexShrink: 0,
        }} />
        <InspectorInput value="None" theme={theme} style={{ flex: 1 }} />
        <InspectorInput value="1" theme={theme} style={{ width: '48px' }} />
      </div>
    </Section>
  )
}

function CornerRadiusSection({ theme }: { theme: any }) {
  return (
    <Section title="Corner Radius" theme={theme}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
        <InspectorInput value="0" theme={theme} />
        <InspectorInput value="0" theme={theme} />
        <InspectorInput value="0" theme={theme} />
        <InspectorInput value="0" theme={theme} />
      </div>
    </Section>
  )
}

function ShadowSection({ theme }: { theme: any }) {
  return (
    <Section title="Shadow" theme={theme} action={{ icon: Plus, onClick: () => {} }}>
      <div style={{ color: theme.colors.text.tertiary, fontSize: '11px' }}>No shadow</div>
    </Section>
  )
}

function EffectsSection({ theme }: { theme: any }) {
  return (
    <Section title="Effects" theme={theme} action={{ icon: Plus, onClick: () => {} }}>
      <div style={{ color: theme.colors.text.tertiary, fontSize: '11px' }}>No effects</div>
    </Section>
  )
}
