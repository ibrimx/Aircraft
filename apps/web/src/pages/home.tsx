import { type CSSProperties, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n, useBreakpoint, Button } from '@aircraft/ui';
import { useThemeTokens, Z_INDEX } from '@aircraft/design-tokens';

const css = (s: CSSProperties): CSSProperties => s;

function Reveal({ children }: { children: React.ReactNode }): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [prefersReduced]);

  return (
    <div ref={ref} style={css({ opacity: visible ? 1 : 0, transform: prefersReduced ? 'none' : visible ? 'none' : 'translateY(24px)', transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out' })}>
      {children}
    </div>
  );
}

export function HomePage(): React.JSX.Element {
  const { t } = useI18n();
  const tk = useThemeTokens();
  const bp = useBreakpoint();

  return (
    <div style={css({ color: tk.text.primary, background: tk.bg.canvas })}>
      <nav style={css({ position: 'fixed', insetBlockStart: 0, insetInline: 0, zIndex: Z_INDEX.sticky, display: 'flex', alignItems: 'center', justifyContent: 'space-between', blockSize: 64, paddingInline: 24, background: `${tk.bg.canvas}cc`, backdropFilter: 'blur(12px)' })}>
        <Link href="/" style={css({ color: tk.text.primary, textDecoration: 'none', fontWeight: 700, fontSize: 20 })}>{t('home.brand')}</Link>
        <div style={css({ display: 'flex', gap: 24, alignItems: 'center' })}>
          {!bp.isMobile && (
            <>
              <Link href="/features" style={css({ color: tk.text.secondary, textDecoration: 'none' })}>{t('home.nav.features')}</Link>
              <Link href="/pricing" style={css({ color: tk.text.secondary, textDecoration: 'none' })}>{t('home.nav.pricing')}</Link>
            </>
          )}
          <Link href="/login">
            <Button style={css({ background: tk.accent.default, color: tk.bg.canvas, minBlockSize: 44, paddingInline: 20, borderRadius: 8, border: 'none', cursor: 'pointer' })}>{t('home.nav.cta')}</Button>
          </Link>
        </div>
      </nav>

      <Reveal>
        <section style={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minBlockSize: '100vh', paddingBlockStart: 64, paddingInline: 24, textAlign: 'center', background: `radial-gradient(ellipse at 50% 0%, ${tk.accent.subtle} 0%, transparent 70%)` })}>
          <h1 style={css({ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, maxInlineSize: 800, marginBlockEnd: 16 })}>{t('home.hero.title')}</h1>
          <p style={css({ fontSize: 18, color: tk.text.secondary, maxInlineSize: 600, marginBlockEnd: 32 })}>{t('home.hero.subtitle')}</p>
          <div style={css({ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' })}>
            <Link href="/login">
              <Button style={css({ background: tk.accent.default, color: tk.bg.canvas, minBlockSize: 48, paddingInline: 32, borderRadius: 12, border: 'none', fontSize: 16, cursor: 'pointer' })}>{t('home.hero.cta1')}</Button>
            </Link>
            <Link href="/features">
              <Button style={css({ background: 'transparent', color: tk.text.primary, minBlockSize: 48, paddingInline: 32, borderRadius: 12, border: `1px solid ${tk.border.default}`, fontSize: 16, cursor: 'pointer' })}>{t('home.hero.cta2')}</Button>
            </Link>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section style={css({ paddingBlock: 48, paddingInline: 24, textAlign: 'center' })}>
          <p style={css({ color: tk.text.tertiary, marginBlockEnd: 24, fontSize: 14 })}>{t('home.social.title')}</p>
          <div style={css({ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' })}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={css({ inlineSize: 80, blockSize: 32, borderRadius: 4, background: tk.bg.surface, opacity: 0.6 })} aria-hidden="true" />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section style={css({ paddingBlock: 64, paddingInline: 24, maxInlineSize: 1100, marginInline: 'auto' })}>
          <h2 style={css({ textAlign: 'center', marginBlockEnd: 40, fontSize: 28, fontWeight: 700 })}>{t('home.features.title')}</h2>
          <div style={css({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 })}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={css({ background: tk.bg.surface, borderRadius: 16, paddingBlock: 32, paddingInline: 24, transition: 'filter 0.2s ease-in-out', animationDelay: `${i * 100}ms` })}>
                <h3 style={css({ fontSize: 18, fontWeight: 600, marginBlockEnd: 8 })}>{t(`home.features.card${i}.title`)}</h3>
                <p style={css({ color: tk.text.secondary, fontSize: 14 })}>{t(`home.features.card${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section style={css({ paddingBlock: 64, paddingInline: 24, display: 'flex', justifyContent: 'center' })}>
          <div style={css({ inlineSize: '100%', maxInlineSize: 900, borderRadius: 16, border: `1px solid ${tk.border.default}`, overflow: 'hidden', background: tk.bg.surface })}>
            <div style={css({ display: 'flex', alignItems: 'center', gap: 6, paddingBlock: 12, paddingInline: 16, background: tk.bg.default, borderBlockEnd: `1px solid ${tk.border.default}` })}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={css({ inlineSize: 12, blockSize: 12, borderRadius: '50%', background: tk.text.tertiary, opacity: 0.4 })} aria-hidden="true" />
              ))}
            </div>
            <div style={css({ blockSize: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tk.text.tertiary })}>{t('home.showcase.placeholder')}</div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section style={css({ paddingBlock: 64, paddingInline: 24, maxInlineSize: 1100, marginInline: 'auto' })}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={css({ display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', gap: 32, alignItems: 'center', marginBlockEnd: 48, flexWrap: 'wrap' })}>
              <div style={css({ flex: 1, minInlineSize: 260 })}>
                <h3 style={css({ fontSize: 22, fontWeight: 700, marginBlockEnd: 12 })}>{t(`home.scale.block${i}.title`)}</h3>
                <p style={css({ color: tk.text.secondary, fontSize: 15 })}>{t(`home.scale.block${i}.desc`)}</p>
              </div>
              <div style={css({ flex: 1, minInlineSize: 260, blockSize: 200, borderRadius: 16, background: tk.bg.surface })} aria-hidden="true" />
            </div>
          ))}
        </section>
      </Reveal>

      <Reveal>
        <section style={css({ paddingBlock: 80, paddingInline: 24, textAlign: 'center', background: `linear-gradient(180deg, transparent, ${tk.accent.subtle})` })}>
          <h2 style={css({ fontSize: 32, fontWeight: 800, marginBlockEnd: 16 })}>{t('home.finalCta.title')}</h2>
          <p style={css({ color: tk.text.secondary, marginBlockEnd: 32, maxInlineSize: 500, marginInline: 'auto' })}>{t('home.finalCta.desc')}</p>
          <Link href="/login">
            <Button style={css({ background: tk.accent.default, color: tk.bg.canvas, minBlockSize: 48, paddingInline: 32, borderRadius: 12, border: 'none', fontSize: 16, cursor: 'pointer' })}>{t('home.finalCta.cta')}</Button>
          </Link>
        </section>
      </Reveal>

      <footer style={css({ paddingBlock: 32, paddingInline: 24, textAlign: 'center', borderBlockStart: `1px solid ${tk.border.default}`, color: tk.text.tertiary, fontSize: 13 })}>
        <p>{t('home.footer.copy')}</p>
      </footer>
    </div>
  );
}
