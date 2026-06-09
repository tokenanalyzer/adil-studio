"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────────── */
type Goal          = { id:string; name:string; slug:string; short_description:string };
type Industry      = { id:string; name:string; slug:string; short_description:string };
type Variant       = {
  id:string; slug:string;
  hero_kicker:string|null; hero_heading:string; hero_subheading:string|null;
  primary_cta_label:string|null; primary_cta_href:string|null;
  secondary_cta_label:string|null; secondary_cta_href:string|null;
  goals:{ slug:string }|null; industries:{ slug:string }|null;
};
type Service       = { id:string; title:string; slug:string; summary:string|null; icon:string|null };
type PortfolioItem = { id:string; title:string; slug:string; summary:string|null; cover_image_url:string|null };
type SiteSettings  = { site_name:string; site_tagline:string; contact_email:string; contact_whatsapp:string } | null;
type Props = { goals:Goal[]; industries:Industry[]; variants:Variant[]; services:Service[]; portfolio:PortfolioItem[]; settings:SiteSettings };

/* ─── Shapeshifter Theme System ──────────────────────────────────── */
const GOAL_THEMES: Record<string, {
  accent: string; glow: string; dim: string; orbColor: string; orbColor2: string; label: string;
}> = {
  "get-clients":    { accent:"#3b82f6", glow:"rgba(59,130,246,0.20)",  dim:"rgba(59,130,246,0.09)",  orbColor:"rgba(59,130,246,0.18)",  orbColor2:"rgba(96,165,250,0.10)",  label:"Electric Blue"  },
  "build-brand":    { accent:"#8b5cf6", glow:"rgba(139,92,246,0.20)",  dim:"rgba(139,92,246,0.09)",  orbColor:"rgba(139,92,246,0.18)",  orbColor2:"rgba(167,139,250,0.10)", label:"Royal Violet"   },
  "launch-product": { accent:"#f59e0b", glow:"rgba(245,158,11,0.20)",  dim:"rgba(245,158,11,0.09)",  orbColor:"rgba(245,158,11,0.18)",  orbColor2:"rgba(252,211,77,0.10)",  label:"Amber Fire"     },
  "show-portfolio": { accent:"#10b981", glow:"rgba(16,185,129,0.20)",  dim:"rgba(16,185,129,0.09)",  orbColor:"rgba(16,185,129,0.18)",  orbColor2:"rgba(52,211,153,0.10)",  label:"Emerald Craft"  },
};

const INDUSTRY_MODS: Record<string, {
  weight: number; letterSpacing: string; serviceStyle: "numbered"|"icon";
  heroScale: string; gridCols: string;
}> = {
  "creator":        { weight:900, letterSpacing:"-0.04em", serviceStyle:"icon",     heroScale:"1.0",  gridCols:"repeat(2,1fr)" },
  "startup":        { weight:800, letterSpacing:"-0.035em", serviceStyle:"numbered", heroScale:"0.98", gridCols:"repeat(3,1fr)" },
  "agency":         { weight:700, letterSpacing:"-0.025em", serviceStyle:"numbered", heroScale:"0.96", gridCols:"repeat(3,1fr)" },
  "local-business": { weight:800, letterSpacing:"-0.025em", serviceStyle:"icon",     heroScale:"0.97", gridCols:"repeat(2,1fr)" },
};

const TICKER_ITEMS = [
  "Website Design","Brand Identity","Launch Campaigns","Portfolio Curation",
  "SEO & Performance","Automation","UX Engineering","Conversion Systems",
  "Design Systems","Growth Engineering","Digital Presence","Creative Strategy",
];

/* ─── Component ──────────────────────────────────────────────────── */
export default function HomeClient({ goals, industries, variants, services, portfolio, settings }: Props) {
  const [selectedGoal,     setSelectedGoal]     = useState(goals[0]?.slug     ?? "");
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0]?.slug ?? "");

  const theme      = GOAL_THEMES[selectedGoal]      ?? GOAL_THEMES["get-clients"];
  const industryMod = INDUSTRY_MODS[selectedIndustry] ?? INDUSTRY_MODS["startup"];

  /* Push accent to document so Nav also transitions */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent",      theme.accent);
    root.style.setProperty("--accent-glow", theme.glow);
    root.style.setProperty("--accent-dim",  theme.dim);
  }, [theme]);

  const variantsMap = useMemo(() => {
    const map: Record<string, Variant> = {};
    for (const v of variants) {
      const g = v.goals?.slug; const i = v.industries?.slug;
      if (g && i) map[`${g}--${i}`] = v;
    }
    return map;
  }, [variants]);

  const currentVariant = variantsMap[`${selectedGoal}--${selectedIndustry}`] ?? null;
  const currentGoal     = goals.find(g => g.slug === selectedGoal);
  const currentIndustry = industries.find(i => i.slug === selectedIndustry);

  const hero = currentVariant ? {
    kicker:       currentVariant.hero_kicker,
    heading:      currentVariant.hero_heading,
    subheading:   currentVariant.hero_subheading,
    primaryLabel: currentVariant.primary_cta_label ?? "Start Project",
    primaryHref:  currentVariant.primary_cta_href  ?? "/contact",
    secondaryLabel: currentVariant.secondary_cta_label,
    secondaryHref:  currentVariant.secondary_cta_href,
  } : {
    kicker:       currentGoal && currentIndustry ? `${currentGoal.name} · ${currentIndustry.name}` : null,
    heading:      settings?.site_tagline ?? "Build. Automate. Scale.",
    subheading:   "Goal-led. Industry-aware. We build digital presences that convert.",
    primaryLabel: "Start Project",
    primaryHref:  "/contact",
    secondaryLabel: null,
    secondaryHref:  null,
  };

  /* Unique key triggers CSS entrance animation on text */
  const heroKey = `${selectedGoal}--${selectedIndustry}`;

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ═══════════════════════════════════════════════════════════
          HERO — full viewport, morphing orb background
      ═══════════════════════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          padding: "100px 0 80px",
        }}
      >
        {/* Orb 1 — primary accent glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "min(680px, 80vw)",
            height: "min(680px, 80vw)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.orbColor} 0%, transparent 70%)`,
            filter: "blur(60px)",
            animation: "orb-pulse 10s ease-in-out infinite",
            transition: "background 0.7s ease",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Orb 2 — secondary soft glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "5%",
            left: "-8%",
            width: "min(500px, 60vw)",
            height: "min(500px, 60vw)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.orbColor2} 0%, transparent 70%)`,
            filter: "blur(80px)",
            animation: "orb-pulse-2 13s ease-in-out infinite",
            transition: "background 0.7s ease",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Grid overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            animation: "grid-fade 1.2s ease forwards",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>

          {/* ── Selector Bar ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "56px",
            }}
          >
            {/* Goal row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.10em",
                textTransform: "uppercase", color: "var(--muted)",
                minWidth: "52px",
              }}>
                Goal
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {goals.map(g => (
                  <button
                    key={g.slug}
                    onClick={() => setSelectedGoal(g.slug)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "100px",
                      border: selectedGoal === g.slug
                        ? `1px solid ${theme.accent}`
                        : "1px solid rgba(255,255,255,0.10)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      background: selectedGoal === g.slug ? theme.dim : "transparent",
                      color: selectedGoal === g.slug ? theme.accent : "var(--text-2)",
                      transition: "all 0.25s ease",
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Industry row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.10em",
                textTransform: "uppercase", color: "var(--muted)",
                minWidth: "52px",
              }}>
                For
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {industries.map(i => (
                  <button
                    key={i.slug}
                    onClick={() => setSelectedIndustry(i.slug)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "100px",
                      border: selectedIndustry === i.slug
                        ? `1px solid ${theme.accent}`
                        : "1px solid rgba(255,255,255,0.10)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      background: selectedIndustry === i.slug ? theme.dim : "transparent",
                      color: selectedIndustry === i.slug ? theme.accent : "var(--text-2)",
                      transition: "all 0.25s ease",
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {i.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Hero Content (keyed for animation) ── */}
          <div
            key={heroKey}
            style={{ animation: "hero-enter 0.55s cubic-bezier(0.22,1,0.36,1) forwards" }}
          >
            {hero.kicker && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "24px",
                  animation: "kicker-enter 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: theme.accent,
                    boxShadow: `0 0 10px ${theme.accent}`,
                    transition: "background 0.5s ease, box-shadow 0.5s ease",
                  }}
                />
                <span style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: theme.accent,
                  transition: "color 0.5s ease",
                }}>
                  {hero.kicker}
                </span>
              </div>
            )}

            <h1
              style={{
                fontSize: "clamp(44px, 7.5vw, 88px)",
                fontWeight: industryMod.weight,
                lineHeight: 1.0,
                letterSpacing: industryMod.letterSpacing,
                maxWidth: "900px",
                marginBottom: "24px",
                color: "var(--text)",
              }}
            >
              {hero.heading}
            </h1>

            {hero.subheading && (
              <p
                style={{
                  fontSize: "clamp(16px, 1.8vw, 19px)",
                  lineHeight: 1.65,
                  color: "var(--muted)",
                  maxWidth: "540px",
                  marginBottom: "40px",
                  fontWeight: 400,
                }}
              >
                {hero.subheading}
              </p>
            )}

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <Link
                href={hero.primaryHref}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: theme.accent,
                  color: "#fff",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "-0.01em",
                  transition: "background 0.5s ease, transform 0.15s ease",
                  boxShadow: `0 4px 24px ${theme.glow}`,
                }}
              >
                {hero.primaryLabel}
                <span style={{ opacity: 0.8 }}>→</span>
              </Link>
              {hero.secondaryLabel && hero.secondaryHref && (
                <Link
                  href={hero.secondaryHref}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "var(--text-2)",
                    padding: "14px 24px",
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "15px",
                  }}
                >
                  {hero.secondaryLabel}
                </Link>
              )}
            </div>
          </div>

          {/* ── Identity Badge ── */}
          <div
            style={{
              marginTop: "64px",
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "10px",
                border: `1px solid ${theme.glow}`,
                background: theme.dim,
                transition: "all 0.5s ease",
              }}
            >
              <span style={{
                width: "8px", height: "8px",
                borderRadius: "50%",
                background: theme.accent,
                boxShadow: `0 0 8px ${theme.accent}`,
                transition: "all 0.5s ease",
              }} />
              <span style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", color: theme.accent,
                transition: "color 0.5s ease",
              }}>
                {theme.label}
              </span>
            </div>
            <span style={{ color: "var(--muted)", fontSize: "12px" }}>
              Build · Automate · Scale
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARQUEE TICKER
      ═══════════════════════════════════════════════════════════ */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 0",
          overflow: "hidden",
          background: "var(--bg-2)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0",
            animation: "marquee 28s linear infinite",
            width: "max-content",
          }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "var(--muted)",
                padding: "0 24px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "24px",
              }}
            >
              {item}
              <span style={{
                display: "inline-block",
                width: "4px", height: "4px",
                borderRadius: "50%",
                background: theme.accent,
                transition: "background 0.5s ease",
              }} />
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════════════════════ */}
      {services.length > 0 && (
        <section style={{ padding: "100px 0" }}>
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "52px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <p style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.10em",
                  textTransform: "uppercase", color: theme.accent,
                  marginBottom: "8px",
                  transition: "color 0.5s ease",
                }}>
                  What we build
                </p>
                <h2 style={{
                  fontSize: "clamp(28px, 3.5vw, 40px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}>
                  Studio Services
                </h2>
              </div>
              <Link
                href="/contact"
                style={{
                  fontSize: "13px",
                  color: theme.accent,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  transition: "color 0.5s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Start a project →
              </Link>
            </div>

            {industryMod.serviceStyle === "numbered" ? (
              /* Numbered list style — Startup / Agency */
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {services.map((svc, idx) => (
                  <div
                    key={svc.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "56px 1fr auto",
                      alignItems: "center",
                      gap: "24px",
                      padding: "28px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: theme.accent,
                      letterSpacing: "0.04em",
                      transition: "color 0.5s ease",
                    }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p style={{
                        fontWeight: 700,
                        fontSize: "17px",
                        letterSpacing: "-0.02em",
                        marginBottom: "4px",
                      }}>
                        {svc.title}
                      </p>
                      {svc.summary && (
                        <p style={{
                          fontSize: "14px",
                          color: "var(--muted)",
                          lineHeight: 1.55,
                          maxWidth: "520px",
                        }}>
                          {svc.summary}
                        </p>
                      )}
                    </div>
                    {svc.icon && (
                      <span style={{ fontSize: "20px", opacity: 0.5 }}>{svc.icon}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Icon card style — Creator / Local Business */
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}
              >
                {services.map((svc, idx) => (
                  <div
                    key={svc.id}
                    style={{
                      padding: "28px",
                      borderRadius: "var(--radius)",
                      border: `1px solid rgba(255,255,255,0.07)`,
                      background: "var(--surface)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      transition: "border-color 0.3s ease",
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      {svc.icon && (
                        <span style={{ fontSize: "22px" }}>{svc.icon}</span>
                      )}
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: theme.accent,
                        letterSpacing: "0.08em",
                        transition: "color 0.5s ease",
                      }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                    }}>
                      {svc.title}
                    </p>
                    {svc.summary && (
                      <p style={{
                        fontSize: "13px",
                        color: "var(--muted)",
                        lineHeight: 1.6,
                        flexGrow: 1,
                      }}>
                        {svc.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          PORTFOLIO
      ═══════════════════════════════════════════════════════════ */}
      {portfolio.length > 0 && (
        <section
          style={{
            padding: "100px 0",
            background: "var(--bg-2)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="container">
            <div style={{ marginBottom: "48px" }}>
              <p style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.10em",
                textTransform: "uppercase", color: theme.accent,
                marginBottom: "8px",
                transition: "color 0.5s ease",
              }}>
                Selected work
              </p>
              <h2 style={{
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}>
                Portfolio
              </h2>
            </div>

            {/* Featured first item */}
            {portfolio[0] && (
              <div
                style={{
                  position: "relative",
                  height: "clamp(260px, 36vw, 440px)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  marginBottom: "16px",
                  background: portfolio[0].cover_image_url
                    ? undefined
                    : `linear-gradient(135deg, ${theme.orbColor} 0%, var(--surface) 60%)`,
                  border: "1px solid rgba(255,255,255,0.07)",
                  transition: "background 0.7s ease",
                }}
              >
                {portfolio[0].cover_image_url && (
                  <img
                    src={portfolio[0].cover_image_url}
                    alt={portfolio[0].title}
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  />
                )}
                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(4,6,13,0.92) 0%, rgba(4,6,13,0.3) 50%, transparent 100%)",
                  }}
                />
                {/* Content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    padding: "32px 36px",
                  }}
                >
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: theme.dim,
                    border: `1px solid ${theme.glow}`,
                    marginBottom: "12px",
                    transition: "all 0.5s ease",
                  }}>
                    <span style={{
                      fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em",
                      textTransform: "uppercase", color: theme.accent,
                      transition: "color 0.5s ease",
                    }}>
                      Featured
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: "clamp(22px, 3vw, 32px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    marginBottom: "8px",
                  }}>
                    {portfolio[0].title}
                  </h3>
                  {portfolio[0].summary && (
                    <p style={{
                      fontSize: "15px",
                      color: "rgba(240,244,255,0.70)",
                      maxWidth: "480px",
                      lineHeight: 1.5,
                    }}>
                      {portfolio[0].summary}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Remaining items */}
            {portfolio.length > 1 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}
              >
                {portfolio.slice(1).map(item => (
                  <div
                    key={item.id}
                    style={{
                      position: "relative",
                      height: "220px",
                      borderRadius: "var(--radius)",
                      overflow: "hidden",
                      background: item.cover_image_url
                        ? undefined
                        : `linear-gradient(135deg, ${theme.orbColor2} 0%, var(--surface) 70%)`,
                      border: "1px solid rgba(255,255,255,0.07)",
                      transition: "background 0.7s ease",
                    }}
                  >
                    {item.cover_image_url && (
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                      />
                    )}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(4,6,13,0.88) 0%, transparent 60%)",
                    }} />
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"20px 24px" }}>
                      <p style={{ fontWeight:700, fontSize:"16px", letterSpacing:"-0.02em", marginBottom:"4px" }}>
                        {item.title}
                      </p>
                      {item.summary && (
                        <p style={{ fontSize:"12px", color:"rgba(240,244,255,0.60)", lineHeight:1.4 }}>
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: "120px 0",
          position: "relative",
          overflow: "hidden",
          background: "var(--bg)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Orb behind CTA */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(700px, 90vw)",
            height: "min(400px, 60vw)",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${theme.orbColor} 0%, transparent 70%)`,
            filter: "blur(80px)",
            transition: "background 0.7s ease",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "100px",
              border: `1px solid ${theme.glow}`,
              background: theme.dim,
              marginBottom: "28px",
              transition: "all 0.5s ease",
            }}
          >
            <span style={{
              width: "6px", height: "6px",
              borderRadius: "50%",
              background: theme.accent,
              boxShadow: `0 0 8px ${theme.accent}`,
              transition: "all 0.5s ease",
            }} />
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
              textTransform: "uppercase", color: theme.accent,
              transition: "color 0.5s ease",
            }}>
              Ready to start?
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(36px, 5.5vw, 68px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.0,
              marginBottom: "20px",
              maxWidth: "720px",
              marginInline: "auto",
            }}
          >
            Let&apos;s build something the market hasn&apos;t seen yet.
          </h2>

          <p
            style={{
              fontSize: "17px",
              color: "var(--muted)",
              lineHeight: 1.6,
              maxWidth: "480px",
              marginInline: "auto",
              marginBottom: "40px",
            }}
          >
            Tell us your goal and industry. We&apos;ll show you exactly what we can build.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              style={{
                background: theme.accent,
                color: "#fff",
                padding: "16px 36px",
                borderRadius: "14px",
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "-0.01em",
                boxShadow: `0 8px 32px ${theme.glow}`,
                transition: "background 0.5s ease, box-shadow 0.5s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Start your project <span>→</span>
            </Link>
            {settings?.contact_whatsapp && settings.contact_whatsapp !== "+91XXXXXXXXXX" && (
              <a
                href={`https://wa.me/${settings.contact_whatsapp.replace(/\D/g,"")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text-2)",
                  padding: "16px 28px",
                  borderRadius: "14px",
                  fontWeight: 600,
                  fontSize: "15px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                WhatsApp us
              </a>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
