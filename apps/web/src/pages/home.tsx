import { type CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const css = (s: CSSProperties): CSSProperties => s;

function GlowBackground(): React.JSX.Element {
  return (
    <>
      {/* Base black */}
      <div
        aria-hidden="true"
        style={css({
          position: "absolute",
          inset: 0,
          background: "#000",
          zIndex: 0,
        })}
      />
      {/* Framer-like glows (subtle) */}
      <div
        aria-hidden="true"
        style={css({
          position: "absolute",
          inset: "-30%",
          background:
            "radial-gradient(600px 420px at 50% 18%, rgba(124, 58, 237, 0.22), transparent 60%), radial-gradient(520px 380px at 18% 35%, rgba(59, 130, 246, 0.18), transparent 62%), radial-gradient(560px 420px at 82% 40%, rgba(236, 72, 153, 0.10), transparent 62%)",
          filter: "blur(18px)",
          zIndex: 0,
          pointerEvents: "none",
        })}
      />
      {/* Light noise-ish overlay */}
      <div
        aria-hidden="true"
        style={css({
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), transparent 30%, rgba(255,255,255,0.03) 80%, transparent)",
          mixBlendMode: "overlay",
          opacity: 0.35,
          zIndex: 0,
          pointerEvents: "none",
        })}
      />
    </>
  );
}

function PillButton({
  children,
  href,
  variant,
}: {
  children: React.ReactNode;
  href: string;
  variant: "primary" | "secondary";
}): React.JSX.Element {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      style={css({
        textDecoration: "none",
      })}
    >
      <span
        role="button"
        style={css({
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 46,
          paddingInline: 22,
          borderRadius: 999,
          fontWeight: 750,
          fontSize: 14,
          letterSpacing: "-0.2px",
          cursor: "pointer",
          userSelect: "none",
          transition: "transform 140ms ease, filter 140ms ease, background 140ms ease",
          transform: "translateZ(0)",
          ...(isPrimary
            ? {
                background: "#fff",
                color: "#000",
                border: "1px solid rgba(255,255,255,0.18)",
              }
            : {
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(10px)",
              }),
        })}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLSpanElement).style.filter = "brightness(1.05)";
          (e.currentTarget as HTMLSpanElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLSpanElement).style.filter = "none";
          (e.currentTarget as HTMLSpanElement).style.transform = "translateY(0)";
        }}
      >
        {children}
      </span>
    </Link>
  );
}

function FrameMockup({
  height,
  title,
}: {
  height: number;
  title: string;
}): React.JSX.Element {
  return (
    <div
      style={css({
        width: "100%",
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.12)",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
        boxShadow: "0 40px 120px rgba(0,0,0,0.75)",
        overflow: "hidden",
      })}
    >
      {/* top bar */}
      <div
        style={css({
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
        })}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        <div style={{ flex: 1 }} />
        <span
          style={css({
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
            paddingInline: 10,
            paddingBlock: 6,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
          })}
        >
          {title}
        </span>
      </div>

      {/* content */}
      <div
        style={css({
          height,
          display: "grid",
          placeItems: "center",
          position: "relative",
          background:
            "radial-gradient(700px 420px at 20% 30%, rgba(59,130,246,0.22), transparent 60%), radial-gradient(700px 420px at 80% 70%, rgba(124,58,237,0.22), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.0))",
        })}
      >
        {/* subtle grid */}
        <div
          aria-hidden="true"
          style={css({
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            opacity: 0.12,
            maskImage: "radial-gradient(circle at 50% 40%, black 0%, transparent 70%)",
          })}
        />

        {/* placeholder content */}
        <div
          style={css({
            position: "relative",
            width: "min(900px, 92%)",
            height: "min(280px, 78%)",
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
            padding: 18,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          })}
        >
          <div
            style={css({
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
            })}
          />
          <div
            style={css({
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
            })}
          />
          <div
            style={css({
              gridColumn: "1 / -1",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.035)",
            })}
          />
        </div>
      </div>
    </div>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <main
      dir="rtl"
      style={css({
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
      })}
    >
      <GlowBackground />

      <div
        style={css({
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1120,
          marginInline: "auto",
          paddingInline: 20,
          paddingBlock: 34,
        })}
      >
        {/* 1) Logo centered */}
        <header
          style={css({
            display: "flex",
            justifyContent: "center",
            paddingBlock: 10,
          })}
        >
          <div
            style={css({
              fontWeight: 900,
              letterSpacing: "-0.9px",
              fontSize: 20,
              color: "rgba(255,255,255,0.92)",
            })}
          >
            Aircraft
          </div>
        </header>

        {/* 2) Hero */}
        <section
          style={css({
            textAlign: "center",
            paddingBlockStart: 34,
            paddingBlockEnd: 36,
          })}
        >
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={css({
              margin: 0,
              fontSize: "clamp(2.2rem, 6vw, 4.6rem)",
              fontWeight: 950,
              lineHeight: 1.02,
              letterSpacing: "-1.6px",
              color: "#fff",
              maxWidth: 980,
              marginInline: "auto",
            })}
          >
            أنشئ مواقع أفضل وتصميم صور ، بشكل أسرع
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: "easeOut" }}
            style={css({
              marginTop: 18,
              marginBottom: 0,
              fontSize: 17,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.66)",
              maxWidth: 820,
              marginInline: "auto",
            })}
          >
            Aircraft هو منشيء مواقع واستدويو تصميم صور ، نظام إدارة محتوي كامل ، وذكاء صناعي فريد
          </motion.p>

          {/* 3) CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            style={css({
              marginTop: 26,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            })}
          >
            <PillButton href="/login" variant="primary">
              ابدأ الآن
            </PillButton>
            <PillButton href="/features" variant="secondary">
              اكتشف المزيد
            </PillButton>
          </motion.div>

          {/* 4) Frame mockup under buttons */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: "easeOut" }}
            style={css({
              marginTop: 46,
            })}
          >
            <FrameMockup height={420} title="معاينة" />
          </motion.div>
        </section>

        {/* Features - Only 1 section now: Design */}
        <section
          style={css({
            paddingBlock: 54,
          })}
        >
          <div
            style={css({
              display: "grid",
              gridTemplateColumns: "1.05fr 1.25fr",
              gap: 26,
              alignItems: "center",
            })}
          >
            {/* Text */}
            <div>
              <div
                style={css({
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  paddingInline: 12,
                  paddingBlock: 7,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 12,
                  marginBottom: 14,
                })}
              >
                ✦ الميزة الأولى
              </div>

              <h2
                style={css({
                  margin: 0,
                  fontSize: "clamp(1.55rem, 2.8vw, 2.1rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.9px",
                  color: "#fff",
                })}
              >
                تصميم
              </h2>

              <p
                style={css({
                  marginTop: 12,
                  marginBottom: 0,
                  fontSize: 15.5,
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,0.66)",
                  maxWidth: 520,
                })}
              >
                صمم تخطيطات متجاوبة وأضف إليها الحيوية من خلال تأثيرات وتفاعلات ورسوم متحركة سلسة. ابنِ ما تتخيله تمامًا، بصريًا
              </p>

              <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span
                  style={css({
                    fontSize: 12,
                    color: "rgba(255,255,255,0.62)",
                    paddingInline: 12,
                    paddingBlock: 7,
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.03)",
                  })}
                >
                  تفاعلات
                </span>
                <span
                  style={css({
                    fontSize: 12,
                    color: "rgba(255,255,255,0.62)",
                    paddingInline: 12,
                    paddingBlock: 7,
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.03)",
                  })}
                >
                  رسوم متحركة
                </span>
                <span
                  style={css({
                    fontSize: 12,
                    color: "rgba(255,255,255,0.62)",
                    paddingInline: 12,
                    paddingBlock: 7,
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.03)",
                  })}
                >
                  تخطيطات متجاوبة
                </span>
              </div>
            </div>

            {/* Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <FrameMockup height={340} title="تصميم — Preview" />
            </motion.div>
          </div>

          {/* responsive (simple) */}
          <style jsx>{`
            @media (max-width: 860px) {
              section > div {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </section>
      </div>
    </main>
  );
}
