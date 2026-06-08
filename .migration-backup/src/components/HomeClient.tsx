"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Goal = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
};

type Industry = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
};

type Variant = {
  id: string;
  slug: string;
  hero_kicker: string | null;
  hero_heading: string;
  hero_subheading: string | null;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  goals: { slug: string } | null;
  industries: { slug: string } | null;
};

type Service = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  icon: string | null;
};

type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  cover_image_url: string | null;
};

type SiteSettings = {
  site_name: string;
  site_tagline: string;
  contact_email: string;
  contact_whatsapp: string;
} | null;

type Props = {
  goals: Goal[];
  industries: Industry[];
  variants: Variant[];
  services: Service[];
  portfolio: PortfolioItem[];
  settings: SiteSettings;
};

const pillBase: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: "100px",
  border: "1px solid var(--border)",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  background: "transparent",
  color: "var(--text)",
  transition: "all 0.15s ease",
  whiteSpace: "nowrap",
};

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: "var(--primary)",
  border: "1px solid var(--primary)",
  color: "#fff",
};

export default function HomeClient({
  goals,
  industries,
  variants,
  services,
  portfolio,
  settings,
}: Props) {
  const [selectedGoal, setSelectedGoal] = useState(goals[0]?.slug ?? "");
  const [selectedIndustry, setSelectedIndustry] = useState(
    industries[0]?.slug ?? ""
  );

  const variantsMap = useMemo(() => {
    const map: Record<string, Variant> = {};
    for (const v of variants) {
      const gSlug = v.goals?.slug;
      const iSlug = v.industries?.slug;
      if (gSlug && iSlug) {
        map[`${gSlug}--${iSlug}`] = v;
      }
    }
    return map;
  }, [variants]);

  const currentVariant =
    variantsMap[`${selectedGoal}--${selectedIndustry}`] ?? null;

  const currentGoal = goals.find((g) => g.slug === selectedGoal);
  const currentIndustry = industries.find((i) => i.slug === selectedIndustry);

  const hero = currentVariant
    ? {
        kicker: currentVariant.hero_kicker,
        heading: currentVariant.hero_heading,
        subheading: currentVariant.hero_subheading,
        primaryLabel: currentVariant.primary_cta_label ?? "Start Project",
        primaryHref: currentVariant.primary_cta_href ?? "/contact",
        secondaryLabel: currentVariant.secondary_cta_label,
        secondaryHref: currentVariant.secondary_cta_href,
      }
    : {
        kicker:
          currentGoal && currentIndustry
            ? `${currentGoal.name} · ${currentIndustry.name}`
            : null,
        heading: settings?.site_tagline ?? "Adaptive Digital Studio",
        subheading:
          "Goal-led. Industry-aware. We build digital presences that convert.",
        primaryLabel: "Start Project",
        primaryHref: "/contact",
        secondaryLabel: null,
        secondaryHref: null,
      };

  return (
    <main>
      {/* Selector Section */}
      <section
        style={{
          padding: "48px 0 0",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container" style={{ display: "grid", gap: "24px" }}>
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "12px",
              }}
            >
              What&apos;s your goal?
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {goals.map((goal) => (
                <button
                  key={goal.slug}
                  onClick={() => setSelectedGoal(goal.slug)}
                  style={
                    selectedGoal === goal.slug ? pillActive : pillBase
                  }
                >
                  {goal.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ paddingBottom: "40px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "12px",
              }}
            >
              Your industry?
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {industries.map((industry) => (
                <button
                  key={industry.slug}
                  onClick={() => setSelectedIndustry(industry.slug)}
                  style={
                    selectedIndustry === industry.slug
                      ? pillActive
                      : pillBase
                  }
                >
                  {industry.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section style={{ padding: "80px 0 96px" }}>
        <div className="container">
          {hero.kicker && (
            <p
              style={{
                display: "inline-block",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--primary)",
                background: "rgba(30, 94, 255, 0.1)",
                padding: "4px 12px",
                borderRadius: "100px",
                marginBottom: "20px",
              }}
            >
              {hero.kicker}
            </p>
          )}

          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "820px",
              marginBottom: "20px",
            }}
          >
            {hero.heading}
          </h1>

          {hero.subheading && (
            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.6,
                color: "var(--muted)",
                maxWidth: "580px",
                marginBottom: "36px",
              }}
            >
              {hero.subheading}
            </p>
          )}

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href={hero.primaryHref}
              style={{
                background: "var(--primary)",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                letterSpacing: "-0.01em",
              }}
            >
              {hero.primaryLabel}
            </Link>
            {hero.secondaryLabel && hero.secondaryHref && (
              <Link
                href={hero.secondaryHref}
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                {hero.secondaryLabel}
              </Link>
            )}
          </div>

          {!currentVariant && (
            <p
              style={{
                marginTop: "16px",
                fontSize: "13px",
                color: "var(--muted)",
              }}
            >
              Select a goal and industry above to see a tailored version of this page.
            </p>
          )}
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section
          style={{
            padding: "64px 0",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div className="container">
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "8px",
              }}
            >
              What we build
            </p>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "32px",
              }}
            >
              Services
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {services.map((service) => (
                <div
                  key={service.id}
                  style={{
                    padding: "24px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    background: "var(--surface)",
                  }}
                >
                  {service.icon && (
                    <p
                      style={{ fontSize: "24px", marginBottom: "12px" }}
                    >
                      {service.icon}
                    </p>
                  )}
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      letterSpacing: "-0.01em",
                      marginBottom: "8px",
                    }}
                  >
                    {service.title}
                  </p>
                  {service.summary && (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {service.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Section */}
      {portfolio.length > 0 && (
        <section
          style={{
            padding: "64px 0",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div className="container">
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "8px",
              }}
            >
              Selected work
            </p>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "32px",
              }}
            >
              Portfolio
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                    background: "var(--surface)",
                  }}
                >
                  {item.cover_image_url ? (
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "180px",
                        background: "var(--surface-2)",
                      }}
                    />
                  )}
                  <div style={{ padding: "20px" }}>
                    <p
                      style={{
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        marginBottom: "6px",
                      }}
                    >
                      {item.title}
                    </p>
                    {item.summary && (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.summary}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 0",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="container" style={{ maxWidth: "640px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "8px",
            }}
          >
            Ready to start?
          </p>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "12px",
              lineHeight: 1.1,
            }}
          >
            Let&apos;s build something together.
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "16px",
              lineHeight: 1.6,
              marginBottom: "28px",
            }}
          >
            Tell us your goal and industry. We&apos;ll show you exactly what we can
            build.
          </p>
          <Link
            href="/contact"
            style={{
              display: "inline-block",
              background: "var(--primary)",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: "-0.01em",
            }}
          >
            Start your project
          </Link>
        </div>
      </section>
    </main>
  );
}
