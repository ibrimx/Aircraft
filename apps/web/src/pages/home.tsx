import { type JSX, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useBreakpoint, useAuth, useI18n } from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';
import { MarketingLayout } from '../layouts/marketing-layout';

const FEATURES = [
  { icon: '\u2728', key: 'ai' },
  { icon: '\ud83c\udfa8', key: 'design' },
  { icon: '\ud83d\udce6', key: 'cms' },
  { icon: '\ud83d\udc65', key: 'collaborate' },
] as const;

const SCALE_ITEMS = ['analytics', 'abTesting', 'seo'] as const;

function useScrollReveal(): (el: HTMLElement | null) => void {
  const obs = useRef<IntersectionObserver | null>(null);
  const noMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (noMotion) return;
    obs.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            obs.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    return () => obs.current?.disconnect();
  }, [noMotion]);

  return useCallback(
    (el: HTMLElement | null) => {
      if (!el || noMotion) return;
      Object.assign(el.style, {
        opacity: '0',
        transform: 'translateY(24px)',
        transition:
          'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)',
      });
      obs.current?.observe(el);
    },
    [noMotion],
  );
}

export function HomePage(): JSX.Element {
  const { isAuthenticated } = useAuth();
  const nav = useNavigate();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const { isMobile } = useBreakpoint();
  const reveal = useScrollReveal();

  useEffect(() => {
    if (isAuthenticated) nav('/dashboard', { replace: true });
  }, [isAuthenticated, nav]);

  return (
    <MarketingLayout>
      {/* Hero */}
      <section
        ref={reveal}
        style= paddingBlock: '120px 80px', textAlign: 'center', maxWidth: 800, marginInline: 'auto', position: 'relative' 
      >
        <div
          style= position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,153,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' 
        />
        <h1 style= fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: tk.text.primary >
          {t('home.heroTitle')}
        </h1>
        <p style= fontSize: '1.125rem', color: tk.text.secondary, maxWidth: 560, marginInline: 'auto', marginBlockStart: 16 >
          {t('home.heroSubtitle')}
        </p>
        <div style= display: 'flex', gap: 12, justifyContent: 'center', marginBlockStart: 40, flexWrap: 'wrap' >
          <Button variant="primary" size="lg">{t('home.ctaStart')}</Button>
          <Button variant="secondary" size="lg">{t('home.ctaAI')}</Button>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section ref={reveal} style= borderBlock: '1px solid rgba(255,255,255,0.06)', paddingBlock: 40, textAlign: 'center' >
        <p style= fontSize: '0.75rem', color: tk.text.tertiary, marginBlockEnd: 24 >{t('home.socialProof')}</p>
        <div style= display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              style= width: 120, height: 32, background: 'rgba(255,255,255,0.06)', borderRadius: 6, opacity: 0.4, filter: 'grayscale(1)', transition: 'opacity 200ms cubic-bezier(0.45,0,0.55,1), filter 200ms cubic-bezier(0.45,0,0.55,1)' 
            />
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section ref={reveal} style= paddingBlock: 80, maxWidth: 1100, marginInline: 'auto', paddingInline: 24 >
        <h2 style= fontSize: '2rem', fontWeight: 700, color: tk.text.primary, textAlign: 'center', marginBlockEnd: 48 >
          {t('home.featuresTitle')}
        </h2>
        <div style= display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 >
          {FEATURES.map((f, i) => (
            <div
              key={f.key}
              ref={reveal}
              style={{
                background: 'rgba(28,28,28,0.72)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 32,
                transition: 'transform 250ms cubic-bezier(0.16,1,0.3,1), box-shadow 250ms cubic-bezier(0.16,1,0.3,1)',
                animationDelay: `${i * 80}ms`,
              }}
            >
              <span style= fontSize: '2rem' >{f.icon}</span>
              <h3 style= fontSize: '1.25rem', fontWeight: 600, color: tk.text.primary, marginBlockStart: 12 >
                {t(`home.feature.${f.key}.title`)}
              </h3>
              <p style= fontSize: '0.875rem', color: tk.text.secondary, marginBlockStart: 8, lineHeight: 1.6 >
                {t(`home.feature.${f.key}.desc`)}
              </p>
              <span style= fontSize: '0.875rem', color: tk.accent.text, marginBlockStart: 16, display: 'inline-block' >
                {t('home.learnMore')}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section ref={reveal} style= maxWidth: 1100, marginInline: 'auto', paddingInline: 24, paddingBlockEnd: 80 >
        <div style= background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, boxShadow: '0 40px 80px rgba(0,0,0,0.4)', overflow: 'hidden' >
          <div style= height: 40, display: 'flex', alignItems: 'center', gap: 8, paddingInlineStart: 16  aria-hidden="true">
            <span style= width: 12, height: 12, borderRadius: '50%', background: '#FF5F57'  />
            <span style= width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E'  />
            <span style= width: 12, height: 12, borderRadius: '50%', background: '#28C840'  />
          </div>
          <img alt={t('home.showcaseAlt')} style= width: '100%', display: 'block'  />
        </div>
      </section>

      {/* Scale Section */}
      <section ref={reveal} style= paddingBlock: 80, maxWidth: 1100, marginInline: 'auto', paddingInline: 24 >
        <h2 style= fontSize: '2rem', fontWeight: 700, color: tk.text.primary, textAlign: 'center', marginBlockEnd: 64 >
          {t('home.scaleTitle')}
        </h2>
        {SCALE_ITEMS.map((key, i) => (
          <div
            key={key}
            ref={reveal}
            style=
              display: 'flex', flexDirection: isMobile ? 'column' : i % 2 === 0 ? 'row' : 'row-reverse',
              gap: 48, alignItems: 'center', marginBlockEnd: 64,
            
          >
            <div style= flex: 1 >
              <span style= fontSize: '0.75rem', fontWeight: 600, color: tk.accent.text, textTransform: 'uppercase', letterSpacing: '0.04em' >
                {t(`home.scale.${key}.badge`)}
              </span>
              <h3 style= fontSize: '1.5rem', fontWeight: 600, color: tk.text.primary, marginBlockStart: 12, lineHeight: 1.3 >
                {t(`home.scale.${key}.heading`)}
              </h3>
              <span style= fontSize: '0.875rem', color: tk.accent.text, marginBlockStart: 16, display: 'inline-block' >
                {t('home.learnMore')}
              </span>
            </div>
            <div style= flex: 1, height: 240, background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)'  />
          </div>
        ))}
      </section>

      {/* Final CTA */}
      <section
        ref={reveal}
        style= paddingBlock: 120, textAlign: 'center', background: 'linear-gradient(180deg, transparent, rgba(0,153,255,0.04) 50%, transparent)' 
      >
        <h2 style= fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: tk.text.primary, lineHeight: 1.1 >
          {t('home.ctaHeading')}
        </h2>
        <div style= display: 'flex', gap: 12, justifyContent: 'center', marginBlockStart: 40, flexWrap: 'wrap' >
          <Button variant="primary" size="lg">{t('home.ctaStart')}</Button>
          <Button variant="secondary" size="lg">{t('home.ctaAI')}</Button>
        </div>
      </section>
    </MarketingLayout>
  );
}
