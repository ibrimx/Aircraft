import { type CSSProperties, useState, useCallback } from 'react'
import { Surface } from '@aircraft/ui/primitives/surface'
import { Input } from '@aircraft/ui/primitives/input'
import { Select, type SelectOption } from '@aircraft/ui/primitives/select'
import { Button } from '@aircraft/ui/primitives/button'
import { useThemeTokens } from '@aircraft/design-tokens/theme-provider'
import { SPACING } from '@aircraft/design-tokens/spacing'

export type InviteFormData = {
  email: string
  role: string
}

export type InviteFormProps = {
  roles: SelectOption[]
  onSubmit: (data: InviteFormData) => void
  onCancel: () => void
  submitting?: boolean
  error?: string
  className?: string
  style?: CSSProperties
}

export function InviteForm({ roles, onSubmit, onCancel, submitting = false, error, className, style }: InviteFormProps) {
  const theme = useThemeTokens()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  const isValid = email.includes('@') && role.length > 0

  const handleSubmit = useCallback(() => {
    if (isValid && !submitting) onSubmit({ email, role })
  }, [email, role, isValid, submitting, onSubmit])

  const fieldGap: CSSProperties = { marginBlockEnd: SPACING[3] }

  return (
    <Surface variant="raised" className={className} style={{ padding: SPACING[4], maxWidth: 400, width: '100%', ...style }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text.primary, margin: 0, marginBlockEnd: SPACING[4] }}>Send Invitation</h3>

      <div style={fieldGap}>
        <Input
          type="email"
          placeholder="colleague@company.com"
          value={email}
          onChange={setEmail}
          required
          aria-label="Email address"
        />
      </div>

      <div style={fieldGap}>
        {roles.length > 0 ? (
          <Select
            options={roles}
            value={role}
            onChange={setRole}
            placeholder="Select role"
            aria-label="Role"
          />
        ) : (
          <Select options={[]} value="" onChange={() => {}} disabled placeholder="No roles available" />
        )}
      </div>

      <p style={{ fontSize: 12, color: theme.text.secondary, marginBlockEnd: SPACING[4] }}>
        The invited person will receive an email with a join link
      </p>

      {error && (
        <p style={{ fontSize: 13, color: theme.destructive.default, marginBlockEnd: SPACING[3] }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: SPACING[2], justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!isValid || submitting}>
          {submitting ? 'Sending\u2026' : 'Send Invite'}
        </Button>
      </div>
    </Surface>
  )
}
