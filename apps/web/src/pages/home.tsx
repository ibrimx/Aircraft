// apps/web/src/pages/home.tsx

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import styles from './home.module.css';

export default function HomePage(): React.JSX.Element {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.4]);

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Logo */}
        <motion.div
          className={styles.logoWrap}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className={styles.badgeDot} />
            <span>الآن مع الذكاء الاصطناعي</span>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            أنشئ مواقع أفضل
            <br />
            وتصميم صور، بشكل أسرع
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Aircraft هو منشئ مواقع واستوديو تصميم صور، نظام إدارة محتوى كامل، وذكاء اصطناعي فريد
          </motion.p>

          <motion.div
            className={styles.ctaRow}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/login" className={styles.btnPrimary}>
                ابدأ مجانًا
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/features" className={styles.btnSecondary}>
                شاهد العرض التوضيحي
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Multi-Image Mockup Carousel */}
        <motion.section
          className={styles.mockWrap}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ y: mockupY, opacity: mockupOpacity }}
        >
          <MockupCarousel />
        </motion.section>

        {/* Features Grid */}
        <section className={styles.featuresGrid}>
          <FeatureCard
            icon="✨"
            title="تصميم"
            description="صمم تخطيطات متجاوبة وأضف إليها الحيوية من خلال تأثيرات ورسوم متحركة سلسة"
            delay={0.1}
          />
          <FeatureCard
            icon="📝"
            title="نظام إدارة المحتوى"
            description="أضف محتوى ديناميكيًا وأدره بسهولة مع CMS قوي ومرن"
            delay={0.2}
          />
          <FeatureCard
            icon="🎨"
            title="استوديو الصور"
            description="حرر صورك وأضف تأثيرات احترافية مباشرة من المتصفح"
            delay={0.3}
          />
          <FeatureCard
            icon="🤖"
            title="ذكاء اصطناعي"
            description="اكتب محتوى، ولّد تصاميم، واحصل على اقتراحات ذكية بالذكاء الاصطناعي"
            delay={0.4}
          />
          <FeatureCard
            icon="⚡"
            title="أداء فائق"
            description="مواقع سريعة البرق مُحسّنة لمحركات البحث تلقائيًا"
            delay={0.5}
          />
          <FeatureCard
            icon="📱"
            title="متجاوب تمامًا"
            description="تصاميم تبدو مذهلة على جميع الأجهزة والشاشات"
            delay={0.6}
          />
        </section>

        {/* Start from Scratch */}
        <ScratchSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Final CTA */}
        <FinalCTA />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ========== Mockup Carousel Component ==========
function MockupCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', skipSnaps: false },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // صور الـ mockup (غيّرها بصورك الحقيقية)
  const mockupImages = [
    '/mockups/screenshot-1.png',
    '/mockups/screenshot-2.png',
    '/mockups/screenshot-3.png',
    '/mockups/screenshot-4.png',
  ];

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.emblaContainer}>
          {mockupImages.map((src, index) => (
            <div className={styles.emblaSlide} key={index}>
              <motion.div
                className={styles.mockCard}
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.4 }}
              >
                <div className={styles.mockTopBar}>
                  <div className={styles.dots}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                </div>
                <div className={styles.mockBody}>
                  {/* هنا حط الصورة */}
                  <img
                    src={src}
                    alt={`Screenshot ${index + 1}`}
                    className={styles.mockImage}
                    loading="lazy"
                  />
                  {/* Fallback: لو مفيش صور */}
                  <div className={styles.mockPlaceholder}>
                    <div className={styles.mockGrid} />
                    <div className={styles.mockContent}>
                      <div className={styles.mockHeader}>
                        <div className={styles.mockPill} />
                      </div>
                      <div className={styles.mockMain}>
                        <div className={styles.mockPanel}>
                          <div className={styles.mockPanelInner} />
                        </div>
                        <div className={styles.mockPanelTall}>
                          <div className={styles.mockPanelInner} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className={styles.emblaDots}>
        {mockupImages.map((_, index) => (
          <button
            key={index}
            className={`${styles.emblaDot} ${index === selectedIndex ? styles.emblaDotActive : ''}`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ========== Feature Card Component ==========
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      className={styles.featureCard}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
    >
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{description}</p>
    </motion.div>
  );
}

// ========== Start from Scratch Section ==========
function ScratchSection() {
  return (
    <motion.section
      className={styles.scratchSection}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.scratchContent}>
        <motion.h2
          className={styles.scratchTitle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          ابدأ من الصفر
          <br />
          أو استخدم قوالب جاهزة
        </motion.h2>
        <motion.p
          className={styles.scratchDesc}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          أطلق العنان لإبداعك مع محرر مرئي قوي، أو ابدأ بقالب جاهز وخصصه بالكامل
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/templates" className={styles.btnPrimary}>
            تصفح القوالب →
          </Link>
        </motion.div>
      </div>
      <motion.div
        className={styles.scratchVisual}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className={styles.scratchGrid} />
      </motion.div>
    </motion.section>
  );
}

// ========== Testimonials ==========
function TestimonialsSection() {
  const testimonials = [
    {
      text: 'أداة رائعة! وفرت علينا أسابيع من العمل',
      author: 'أحمد محمد',
      role: 'مصمم UI/UX',
    },
    {
      text: 'الذكاء الاصطناعي فيها يختصر وقت كتابة المحتوى بنسبة 80%',
      author: 'سارة علي',
      role: 'مديرة محتوى',
    },
    {
      text: 'أفضل أداة استخدمتها لبناء المواقع على الإطلاق',
      author: 'خالد يوسف',
      role: 'مطور فرونت إند',
    },
  ];

  return (
    <section className={styles.testimonialsSection}>
      <motion.h2
        className={styles.testimonialsTitle}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        محبوب من قبل المصممين والمطورين
      </motion.h2>

      <div className={styles.testimonialsGrid}>
        {testimonials.map((item, i) => (
          <motion.div
            key={i}
            className={styles.testimonialCard}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ y: -6 }}
          >
            <p className={styles.testimonialText}>"{item.text}"</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>{item.author[0]}</div>
              <div>
                <div className={styles.testimonialName}>{item.author}</div>
                <div className={styles.testimonialRole}>{item.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ========== Final CTA ==========
function FinalCTA() {
  return (
    <motion.section
      className={styles.finalCTA}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className={styles.finalCTATitle}>جاهز للبدء؟</h2>
      <p className={styles.finalCTADesc}>انضم إلى آلاف المصممين والمطورين اليوم</p>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link href="/login" className={styles.btnPrimary}>
          ابدأ مجانًا
        </Link>
      </motion.div>
    </motion.section>
  );
}

// ========== Footer ==========
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerLogo}>Aircraft</div>
            <p className={styles.footerTagline}>
              منشئ مواقع واستوديو تصميم صور
              <br />
              بإمكانيات لا محدودة
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>المنتج</h4>
            <Link href="/features">المميزات</Link>
            <Link href="/templates">القوالب</Link>
            <Link href="/pricing">الأسعار</Link>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>الشركة</h4>
            <Link href="/about">من نحن</Link>
            <Link href="/blog">المدونة</Link>
            <Link href="/contact">اتصل بنا</Link>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>الدعم</h4>
            <Link href="/help">المساعدة</Link>
            <Link href="/docs">التوثيق</Link>
            <Link href="/community">المجتمع</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2024 Aircraft. جميع الحقوق محفوظة.</p>
          <div className={styles.footerLinks}>
            <Link href="/privacy">الخصوصية</Link>
            <Link href="/terms">الشروط</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
