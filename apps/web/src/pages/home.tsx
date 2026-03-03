// apps/web/src/pages/home.tsx

import Link from 'next/link';
import styles from './home.module.css';

export default function HomePage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Logo (no navbar) */}
        <div className={styles.logoWrap}>
          <div className={styles.logo}>Aircraft</div>
        </div>

        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            أنشئ مواقع أفضل وتصميم صور ، بشكل أسرع
          </h1>

          <p className={styles.heroSub}>
            Aircraft هو منشيء مواقع واستدويو تصميم صور ، نظام إدارة محتوي كامل ، وذكاء صناعي فريد
          </p>

          <div className={styles.ctaRow}>
            <Link href="/login" className={styles.btnPrimary}>
              ابدأ الآن
            </Link>

            <Link href="/features" className={styles.btnSecondary}>
              اكتشف المزيد
            </Link>
          </div>
        </section>

        {/* Curved Mockup */}
        <section className={styles.mockWrap} aria-label="معاينة">
          <div className={styles.mockPerspective}>
            <div className={styles.mockCard}>
              <div className={styles.mockTopBar}>
                <div className={styles.dots} aria-hidden="true">
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>

              <div className={styles.mockBody}>
                <div className={styles.mockGrid} aria-hidden="true" />

                <div className={styles.mockContent}>
                  <div className={styles.mockHeader}>
                    <div className={styles.mockPill} aria-hidden="true" />
                    <div className={styles.mockActions} aria-hidden="true">
                      <div className={styles.mockChip} />
                      <div className={styles.mockChip} />
                    </div>
                  </div>

                  <div className={styles.mockMain}>
                    <div className={styles.mockPanel}>
                      <div className={styles.mockPanelInner} aria-hidden="true" />
                    </div>
                    <div className={styles.mockPanelTall}>
                      <div className={styles.mockPanelInner} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features (only 1 now: تصميم) */}
        <section className={styles.features} aria-label="الميزات">
          <div className={styles.featureRow}>
            <div className={styles.featureText}>
              <h2 className={styles.featureTitle}>تصميم</h2>
              <p className={styles.featureDesc}>
                صمم تخطيطات متجاوبة وأضف إليها الحيوية من خلال تأثيرات وتفاعلات ورسوم متحركة سلسة.
                ابنِ ما تتخيله تمامًا، بصريًا
              </p>
            </div>

            <div className={styles.featureMock} aria-hidden="true">
              <div className={styles.featureMockTop}>
                <div className={styles.dots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
              <div className={styles.featureMockBody}>
                <div className={styles.featureMockOverlay} />
              </div>
            </div>
          </div>

          {/* مكان محجوز لسيكشن 2 و 3 لاحقًا */}
        </section>
      </div>
    </div>
  );
}
