import { useState, type CSSProperties, type FC } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { SPACING } from '@aircraft/design-tokens';
import { cssTransition } from '@aircraft/design-tokens';
import { TEXT_STYLES } from '@aircraft/design-tokens';
import { ScrollArea } from '@aircraft/ui';
import { Button } from '@aircraft/ui';
import { ColorSwatch } from '@aircraft/ui';
import { Tooltip } from '@aircraft/ui';

export type BrandColor = {
  id: string;
  name: string;
  hex: string;
  role?: 'primary' | 'secondary' | 'accent' | 'neutral';
};

export type BrandFont = {
  id: string;
  name: string;
  family: string;
  weights: number[];
  role?: 'heading' | 'body' | 'mono';
};

export type BrandLogo = {
  id: string;
  name: string;
  url: string;
  variant: 'primary' | 'mark' | 'wordmark' | 'dark' | 'light';
};

export type BrandPanelProps = {
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: BrandLogo[];
  onApplyColor: (color: BrandColor) => void;
  onApplyFont: (font: BrandFont) => void;
  onInsertLogo: (logo: BrandLogo) => void;
  onEditBrand: () => void;
  className?: string;
  style?: CSSProperties;
};

const Section: FC<{ title: string; defaultOpen?: boolean; children: React.ReactNode }> = ({
  title, defaultOpen = true, children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const theme = useThemeTokens();
  return (
    <div style={{ borderBlockEnd: `1px solid ${theme.colors.border.subtle}` }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        inlineSize: '100%', padding: `${SPACING[2]}px ${SPACING[3]}px`, border: 'none',
        background: 'transparent', cursor: 'pointer', color: theme.colors.text.primary,
        ...TEXT_STYLES.label, transition: cssTransition('background', 'normal', 'easeInOut'),
      }}>
        <span>{title}</span>
        <span style={{ display: 'inline-block', transition: cssTransition('transform', 'normal', 'easeInOut'), transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▸</span>
      </button>
      {open && <div style={{ padding: `0 ${SPACING[3]}px ${SPACING[3]}px` }}>{children}</div>}
    </div>
  );
};

export const BrandPanel: FC<BrandPanelProps> = ({
  colors, fonts, logos, onApplyColor, onApplyFont, onInsertLogo, onEditBrand, className, style,
}) => {
  const theme = useThemeTokens();

  if (!colors.length && !fonts.length && !logos.length) {
    return (
      <div className={className} style={{ background: theme.colors.surface.default, border: `1px solid ${theme.colors.border.subtle}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: SPACING[4], gap: SPACING[2], ...style }}>
        <span style={{ fontSize: 13, color: theme.colors.text.tertiary }}>No brand kit configured</span>
        <Button variant="secondary" onClick={onEditBrand}>Set up brand</Button>
      </div>
    );
  }

  return (
    <div className={className} style={{ background: theme.colors.surface.default, border: `1px solid ${theme.colors.border.subtle}`, display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ padding: `${SPACING[2]}px ${SPACING[3]}px`, display: 'flex', alignItems: 'center', borderBlockEnd: `1px solid ${theme.colors.border.subtle}` }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brand</span>
      </div>
      <ScrollArea style={{ flex: 1, minBlockSize: 0 }}>
        <Section title="Colors">
          {colors.length === 0 ? <span style={{ fontSize: 12, color: theme.colors.text.tertiary }}>No colors</span> : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING[2] }}>
              {colors.map((c) => (
                <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACING[1], cursor: 'pointer' }} onClick={() => onApplyColor(c)}>
                  <Tooltip content={c.hex}>
                    <ColorSwatch color={c.hex} size={32} />
                  </Tooltip>
                  {c.role && <span style={{ fontSize: 10, color: theme.colors.text.tertiary, textTransform: 'capitalize' }}>{c.role}</span>}
                </div>
              ))}
            </div>
          )}
        </Section>
        <Section title="Fonts">
          {fonts.length === 0 ? <span style={{ fontSize: 12, color: theme.colors.text.tertiary }}>No fonts</span> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING[2] }}>
              {fonts.map((f) => (
                <div key={f.id} onClick={() => onApplyFont(f)} style={{ background: theme.colors.surface.raised, borderRadius: theme.radii.md, padding: SPACING[2], cursor: 'pointer', transition: cssTransition('background', 'normal', 'easeInOut') }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[1], marginBlockEnd: SPACING[1] }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text.primary }}>{f.name}</span>
                    {f.role && <span style={{ ...TEXT_STYLES.caption, color: theme.colors.accent.default, background: theme.colors.accent.subtle, borderRadius: theme.radii.sm, padding: `0 ${SPACING[1]}px` }}>{f.role}</span>}
                  </div>
                  <div style={{ fontFamily: f.family, fontSize: 20, color: theme.colors.text.primary, lineHeight: 1.3 }}>Aa Bb Cc 123</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING[1], marginBlockStart: SPACING[1] }}>
                    {f.weights.map((w) => <span key={w} style={{ fontSize: 10, color: theme.colors.text.tertiary, background: theme.colors.surface.default, borderRadius: theme.radii.sm, padding: `1px ${SPACING[1]}px` }}>{w}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
        <Section title="Logos">
          {logos.length === 0 ? <span style={{ fontSize: 12, color: theme.colors.text.tertiary }}>No logos</span> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: SPACING[2] }}>
              {logos.map((l) => (
                <div key={l.id} onClick={() => onInsertLogo(l)} style={{ background: theme.colors.surface.raised, borderRadius: theme.radii.md, overflow: 'hidden', cursor: 'pointer', transition: cssTransition('box-shadow', 'normal', 'easeInOut') }}>
                  <img src={l.url} alt={l.name} style={{ display: 'block', inlineSize: '100%', blockSize: 64, objectFit: 'contain', padding: SPACING[2] }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div style={{ padding: `4px ${SPACING[2]}px ${SPACING[1]}px`, ...TEXT_STYLES.caption, color: theme.colors.text.secondary }}>{l.variant}</div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </ScrollArea>
      <div style={{ padding: SPACING[3], borderBlockStart: `1px solid ${theme.colors.border.subtle}` }}>
        <Button variant="secondary" onClick={onEditBrand} style={{ inlineSize: '100%' }}>Edit Brand</Button>
      </div>
    </div>
  );
};
