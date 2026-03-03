// apps/web/src/pages/home.tsx

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styles from './home.module.css';

export default function HomePage(): React.JSX.Element {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const mockupRotate = useTransform(scrollYProgress, [0, 1], [9, 12]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Animated Logo */}
        <motion.div
          className={styles.logoWrap}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.logo}>Aircraft</div>
        </motion.div>

        {/* Hero */}
        <motion.section
          ref={heroRef}
          className={styles.hero}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            أنشئ مواقع أفضل وتصميم صور ، بشكل أسرع
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Aircraft هو منشيء مواقع واستدويو تصميم صور ، نظام إدارة محتوي كامل ، وذكاء صناعي فريد
          </motion.p>

          <motion.div
            className={styles.ctaRow}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/login" className={styles.btnPrimary}>
                ابدأ الآن
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/features" className={styles.btnSecondary}>
                اكتشف المزيد
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Curved Mockup with Parallax */}
        <motion.section
          className={styles.mockWrap}
          aria-label="معاينة"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            y: mockupY,
            opacity: mockupOpacity,
          }}
        >
          <motion.div
            className={styles.mockPerspective}
            style={{
              rotateX: mockupRotate,
            }}
          >
            <motion.div
              className={styles.mockCard}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.mockTopBar}>
                <div className={styles.dots} aria-hidden="true">
                  <motion.span
                    className={styles.dot}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className={styles.dot}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.span
                    className={styles.dot}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  />
                </div>
              </div>

              <div className={styles.mockBody}>
                <div className={styles.mockGrid} aria-hidden="true" />

                <div className={styles.mockContent}>
                  <div className={styles.mockHeader}>
                    <motion.div
                      className={styles.mockPill}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      aria-hidden="true"
                    />
                    <div className={styles.mockActions} aria-hidden="true">
                      <motion.div
                        className={styles.mockChip}
                        whileHover={{ scale: 1.05 }}
                      />
                      <motion.div
                        className={styles.mockChip}
                        whileHover={{ scale: 1.05 }}
                      />
                    </div>
                  </div>

                  <div className={styles.mockMain}>
                    <motion.div
                      className={styles.mockPanel}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.mockPanelInner} aria-hidden="true" />
                    </motion.div>
                    <motion.div
                      className={styles.mockPanelTall}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.mockPanelInner} aria-hidden="true" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Features */}
        <section className={styles.features} aria-label="الميزات">
          <FeatureRow
            title="تصميم"
            description="صمم تخطيطات متجاوبة وأضف إليها الحيوية من خلال تأثيرات وتفاعلات ورسوم متحركة سلسة. ابنِ ما تتخيله تمامًا، بصريًا"
            delay={0.2}
          />
        </section>
      </div>
    </div>
  );
}

// Feature Row Component
function FeatureRow({
  title,
  description,
  delay = 0,
}: {
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={styles.featureRow}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.featureText}>
        <motion.h2
          className={styles.featureTitle}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.2 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className={styles.featureDesc}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delay + 0.3 }}
        >
          {description}
        </motion.p>
      </div>

      <motion.div
        className={styles.featureMock}
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.4 }}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        <div className={styles.featureMockTop}>
          <div className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>
        <div className={styles.featureMockBody}>
          <motion.div
            className={styles.featureMockOverlay}
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
