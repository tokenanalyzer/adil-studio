"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────────── */
type Goal          = { id:string; name:string; slug:string; short_description:string };
type Industry      = { id:string; name:string; slug:string; short_description:string };
type Variant       = {
  id:string; slug:string;
  hero_kicker:string|null; hero_heading:string; hero_subheading:string|null;
  primary_cta_label:string|null; primary_cta_href:string|null;
  secondary_cta_label:string|null; secondary_cta_href:string|null;
  goals:{slug:string}|null; industries:{slug:string}|null;
};
type Service       = { id:string; title:string; slug:string; summary:string|null; icon:string|null };
type PortfolioItem = { id:string; title:string; slug:string; summary:string|null; cover_image_url:string|null };
type SiteSettings  = { site_name:string; site_tagline:string; contact_email:string; contact_whatsapp:string }|null;
type Props = { goals:Goal[]; industries:Industry[]; variants:Variant[]; services:Service[]; portfolio:PortfolioItem[]; settings:SiteSettings };

/* ─── Shapeshifter Theme System ──────────────────────────────────── */
const GOAL_THEMES: Record<string,{
  accent:string; glow:string; dim:string; orb1:string; orb2:string; label:string;
}> = {
  "get-clients":    { accent:"#3b82f6", glow:"rgba(59,130,246,.22)",  dim:"rgba(59,130,246,.09)",  orb1:"rgba(59,130,246,.17)",  orb2:"rgba(96,165,250,.09)",  label:"Electric Blue"  },
  "build-brand":    { accent:"#8b5cf6", glow:"rgba(139,92,246,.22)",  dim:"rgba(139,92,246,.09)",  orb1:"rgba(139,92,246,.17)",  orb2:"rgba(167,139,250,.09)", label:"Royal Violet"   },
  "launch-product": { accent:"#f59e0b", glow:"rgba(245,158,11,.22)",  dim:"rgba(245,158,11,.09)",  orb1:"rgba(245,158,11,.17)",  orb2:"rgba(252,211,77,.09)",  label:"Amber Fire"     },
  "show-portfolio": { accent:"#10b981", glow:"rgba(16,185,129,.22)",  dim:"rgba(16,185,129,.09)",  orb1:"rgba(16,185,129,.17)",  orb2:"rgba(52,211,153,.09)",  label:"Emerald Craft"  },
};

const INDUSTRY_MODS: Record<string,{
  weight:number; letter:string; scale:string;
}> = {
  "creator":        { weight:900, letter:"-0.04em",  scale:"1.04" },
  "startup":        { weight:800, letter:"-0.035em", scale:"1.0"  },
  "agency":         { weight:700, letter:"-0.025em", scale:"0.97" },
  "local-business": { weight:800, letter:"-0.025em", scale:"0.98" },
};

const TICKER = ["Website Design","Brand Identity","Launch Campaigns","Portfolio Curation",
  "SEO & Performance","Automation","UX Engineering","Conversion Systems",
  "Design Systems","Creative Strategy","Digital Presence","Growth Engineering"];

/* ─── Field / Button styles (shared across modals) ──────────────── */
const field: React.CSSProperties = {
  padding:"12px 16px", borderRadius:"10px",
  border:"1px solid rgba(255,255,255,0.10)",
  background:"rgba(255,255,255,0.04)",
  color:"var(--text)", fontSize:"15px", width:"100%",
  outline:"none",
};

/* ════════════════════════════════════════════════════════════════════
   MODAL BASE — backdrop + escape key + body lock
════════════════════════════════════════════════════════════════════ */
function ModalBase({ onClose, children }: { onClose:()=>void; children:React.ReactNode }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div
      onClick={e => { if (e.target===e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0, zIndex:1000,
        background:"rgba(4,6,13,.85)", backdropFilter:"blur(16px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"20px", animation:"backdrop-enter .2s ease",
      }}
    >
      <div style={{ animation:"modal-enter .3s cubic-bezier(.22,1,.36,1)", width:"100%", maxWidth:"520px" }}>
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   INTAKE MODAL — real multi-step project inquiry form
════════════════════════════════════════════════════════════════════ */
function IntakeModal({
  isOpen, onClose, goal, industry, settings, theme,
}: {
  isOpen:boolean; onClose:()=>void;
  goal:string; industry:string;
  settings:SiteSettings;
  theme: typeof GOAL_THEMES[string];
}) {
  const [step, setStep]     = useState<"form"|"success">("form");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [notes, setNotes]   = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!isOpen) { setStep("form"); setName(""); setEmail(""); setNotes(""); } }, [isOpen]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    try {
      const body = new FormData();
      body.set("name",    name);
      body.set("email",   email);
      body.set("message", `Goal: ${goal}\nIndustry: ${industry}\n\n${notes}`);
      await fetch("/contact", { method:"POST", body });
    } catch {}
    setLoading(false);
    setStep("success");
  };

  if (!isOpen) return null;
  const goalLabel = goal.replace(/-/g," ").replace(/\b\w/g, l => l.toUpperCase());
  const indLabel  = industry.replace(/-/g," ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <ModalBase onClose={onClose}>
      <div style={{
        background:"#0a0f1e",
        border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:"20px",
        overflow:"hidden",
      }}>
        {/* Header */}
        <div style={{
          padding:"28px 28px 20px",
          borderBottom:"1px solid rgba(255,255,255,0.06)",
          display:"flex", alignItems:"flex-start", justifyContent:"space-between",
        }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
              <span style={{
                width:"6px", height:"6px", borderRadius:"50%",
                background:theme.accent,
                boxShadow:`0 0 8px ${theme.accent}`,
                display:"inline-block",
              }} />
              <span style={{
                fontSize:"10px", fontWeight:700, letterSpacing:"0.08em",
                textTransform:"uppercase", color:theme.accent,
              }}>
                {goalLabel} · {indLabel}
              </span>
            </div>
            <h3 style={{ fontSize:"22px", fontWeight:800, letterSpacing:"-0.03em" }}>
              {step==="success" ? "You're all set." : "Start your project"}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width:"32px", height:"32px", borderRadius:"8px",
              border:"1px solid rgba(255,255,255,0.10)",
              background:"rgba(255,255,255,0.04)",
              color:"var(--muted)", cursor:"pointer", fontSize:"16px",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:"24px 28px 28px" }}>
          {step==="success" ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{
                width:"56px", height:"56px", borderRadius:"50%",
                background:theme.dim, border:`1px solid ${theme.glow}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 20px", fontSize:"24px",
              }}>
                ✓
              </div>
              <p style={{ fontSize:"17px", fontWeight:600, marginBottom:"10px" }}>Inquiry received.</p>
              <p style={{ color:"var(--muted)", fontSize:"14px", lineHeight:1.6, marginBottom:"24px" }}>
                We&apos;ll review your brief and get back to you within 24 hours.
              </p>
              <button
                onClick={onClose}
                style={{
                  background:theme.accent, color:"#fff",
                  padding:"12px 28px", borderRadius:"10px",
                  fontWeight:700, fontSize:"14px", cursor:"pointer",
                  border:"none",
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display:"grid", gap:"14px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                <div>
                  <label style={{ fontSize:"12px", color:"var(--muted)", fontWeight:600, letterSpacing:"0.04em", display:"block", marginBottom:"6px" }}>
                    YOUR NAME *
                  </label>
                  <input
                    value={name} onChange={e=>setName(e.target.value)}
                    placeholder="Full name" required style={field}
                  />
                </div>
                <div>
                  <label style={{ fontSize:"12px", color:"var(--muted)", fontWeight:600, letterSpacing:"0.04em", display:"block", marginBottom:"6px" }}>
                    EMAIL *
                  </label>
                  <input
                    type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="you@example.com" required style={field}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize:"12px", color:"var(--muted)", fontWeight:600, letterSpacing:"0.04em", display:"block", marginBottom:"6px" }}>
                  TELL US ABOUT YOUR PROJECT
                </label>
                <textarea
                  value={notes} onChange={e=>setNotes(e.target.value)}
                  placeholder="What are you trying to build, launch, or grow?"
                  rows={4} style={{ ...field, resize:"vertical" }}
                />
              </div>
              <button
                type="submit" disabled={loading || !name || !email}
                style={{
                  background: (!name||!email) ? "rgba(255,255,255,0.06)" : theme.accent,
                  color: (!name||!email) ? "var(--muted)" : "#fff",
                  padding:"14px", borderRadius:"12px",
                  fontWeight:700, fontSize:"15px", cursor: (!name||!email) ? "not-allowed" : "pointer",
                  border:"none", letterSpacing:"-0.01em",
                  boxShadow: (!name||!email) ? "none" : `0 4px 20px ${theme.glow}`,
                  transition:"all .2s ease",
                }}
              >
                {loading ? "Sending…" : "Send Inquiry →"}
              </button>
              <p style={{ fontSize:"12px", color:"var(--muted)", textAlign:"center" }}>
                No commitment. We respond within 24 hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </ModalBase>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SERVICE DETAIL MODAL
════════════════════════════════════════════════════════════════════ */
function ServiceModal({
  service, onClose, onStartProject, theme,
}: {
  service:Service; onClose:()=>void; onStartProject:()=>void;
  theme: typeof GOAL_THEMES[string];
}) {
  return (
    <ModalBase onClose={onClose}>
      <div style={{
        background:"#0a0f1e", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:"20px", overflow:"hidden",
      }}>
        <div style={{
          padding:"28px", borderBottom:"1px solid rgba(255,255,255,0.06)",
          display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            {service.icon && (
              <span style={{
                fontSize:"28px", width:"52px", height:"52px",
                display:"flex", alignItems:"center", justifyContent:"center",
                background:theme.dim, borderRadius:"14px",
                border:`1px solid ${theme.glow}`,
              }}>
                {service.icon}
              </span>
            )}
            <div>
              <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:theme.accent, marginBottom:"4px" }}>
                Studio Service
              </p>
              <h3 style={{ fontSize:"22px", fontWeight:800, letterSpacing:"-0.03em" }}>
                {service.title}
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{
            width:"32px", height:"32px", borderRadius:"8px",
            border:"1px solid rgba(255,255,255,0.10)", background:"rgba(255,255,255,0.04)",
            color:"var(--muted)", cursor:"pointer", fontSize:"16px",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>✕</button>
        </div>
        <div style={{ padding:"24px 28px 28px", display:"grid", gap:"20px" }}>
          {service.summary && (
            <p style={{ fontSize:"15px", color:"var(--text-2)", lineHeight:1.7 }}>
              {service.summary}
            </p>
          )}
          <div style={{
            padding:"16px", borderRadius:"12px",
            background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--muted)", marginBottom:"12px" }}>
              What&apos;s typically included
            </p>
            <div style={{ display:"grid", gap:"8px" }}>
              {["Initial discovery & strategy session","Custom design & implementation","2 rounds of revisions","Final handoff + documentation","30-day post-launch support"].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ color:theme.accent, fontSize:"13px" }}>✓</span>
                  <span style={{ fontSize:"14px", color:"var(--text-2)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            <button
              onClick={() => { onClose(); onStartProject(); }}
              style={{
                flex:1, background:theme.accent, color:"#fff",
                padding:"13px", borderRadius:"12px",
                fontWeight:700, fontSize:"14px", cursor:"pointer",
                border:"none", boxShadow:`0 4px 20px ${theme.glow}`,
              }}
            >
              Start this service →
            </button>
            <button onClick={onClose} style={{
              padding:"13px 20px", borderRadius:"12px",
              border:"1px solid rgba(255,255,255,0.10)",
              background:"transparent", color:"var(--text-2)",
              cursor:"pointer", fontSize:"14px", fontWeight:600,
            }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CASE STUDY MODAL
════════════════════════════════════════════════════════════════════ */
function CaseStudyModal({
  item, onClose, onStartProject, theme,
}: {
  item:PortfolioItem; onClose:()=>void; onStartProject:()=>void;
  theme: typeof GOAL_THEMES[string];
}) {
  return (
    <ModalBase onClose={onClose}>
      <div style={{
        background:"#0a0f1e", border:"1px solid rgba(255,255,255,0.10)",
        borderRadius:"20px", overflow:"hidden", maxWidth:"600px", width:"100%",
      }}>
        {/* Cover */}
        <div style={{
          height:"220px", position:"relative",
          background: item.cover_image_url ? undefined : `linear-gradient(135deg, ${theme.orb1} 0%, #0a0f1e 70%)`,
        }}>
          {item.cover_image_url && (
            <img src={item.cover_image_url} alt={item.title}
              style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          )}
          <div style={{
            position:"absolute", inset:0,
            background:"linear-gradient(to top, rgba(10,15,30,.95) 0%, transparent 60%)",
          }} />
          <button onClick={onClose} style={{
            position:"absolute", top:"16px", right:"16px",
            width:"32px", height:"32px", borderRadius:"8px",
            border:"1px solid rgba(255,255,255,0.15)", background:"rgba(4,6,13,.6)",
            color:"var(--text)", cursor:"pointer", fontSize:"14px",
            display:"flex", alignItems:"center", justifyContent:"center",
            backdropFilter:"blur(8px)",
          }}>✕</button>
          <div style={{ position:"absolute", bottom:"16px", left:"24px" }}>
            <span style={{
              fontSize:"10px", fontWeight:700, letterSpacing:"0.08em",
              textTransform:"uppercase", color:theme.accent,
              background:theme.dim, border:`1px solid ${theme.glow}`,
              padding:"4px 10px", borderRadius:"6px",
            }}>
              Studio Work
            </span>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding:"24px 28px 28px", display:"grid", gap:"16px" }}>
          <h3 style={{ fontSize:"24px", fontWeight:800, letterSpacing:"-0.03em" }}>
            {item.title}
          </h3>
          {item.summary && (
            <p style={{ fontSize:"15px", color:"var(--text-2)", lineHeight:1.7 }}>
              {item.summary}
            </p>
          )}
          <div style={{
            display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px",
          }}>
            {[["Strategy","Discovery → Brief → System"],["Design","Brand → UX → Visual"],["Delivery","Build → Test → Launch"]].map(([t,d]) => (
              <div key={t} style={{
                padding:"12px", borderRadius:"10px",
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
              }}>
                <p style={{ fontSize:"10px", fontWeight:700, color:theme.accent, letterSpacing:"0.06em", marginBottom:"4px" }}>{t}</p>
                <p style={{ fontSize:"11px", color:"var(--muted)", lineHeight:1.4 }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            <button
              onClick={() => { onClose(); onStartProject(); }}
              style={{
                flex:1, background:theme.accent, color:"#fff",
                padding:"13px", borderRadius:"12px",
                fontWeight:700, fontSize:"14px", cursor:"pointer",
                border:"none", boxShadow:`0 4px 20px ${theme.glow}`,
              }}
            >
              Start a similar project →
            </button>
            <button onClick={onClose} style={{
              padding:"13px 20px", borderRadius:"12px",
              border:"1px solid rgba(255,255,255,0.10)",
              background:"transparent", color:"var(--text-2)",
              cursor:"pointer", fontSize:"14px", fontWeight:600,
            }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SHARED: SELECTOR BAR
════════════════════════════════════════════════════════════════════ */
function SelectorBar({ goals, industries, selectedGoal, setSelectedGoal, selectedIndustry, setSelectedIndustry, theme }: {
  goals:Goal[]; industries:Industry[];
  selectedGoal:string; setSelectedGoal:(s:string)=>void;
  selectedIndustry:string; setSelectedIndustry:(s:string)=>void;
  theme: typeof GOAL_THEMES[string];
}) {
  return (
    <div style={{
      position:"sticky", top:"58px", zIndex:100,
      background:"rgba(4,6,13,.90)", backdropFilter:"blur(20px)",
      borderBottom:"1px solid rgba(255,255,255,0.06)",
      padding:"14px 0",
    }}>
      <div className="container" style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:"var(--muted)", minWidth:"48px" }}>
            Goal
          </span>
          {goals.map(g => (
            <button key={g.slug} onClick={()=>setSelectedGoal(g.slug)} style={{
              padding:"6px 16px", borderRadius:"100px", cursor:"pointer",
              border: selectedGoal===g.slug ? `1.5px solid ${theme.accent}` : "1px solid rgba(255,255,255,0.09)",
              fontSize:"13px", fontWeight:600,
              background: selectedGoal===g.slug ? theme.dim : "transparent",
              color: selectedGoal===g.slug ? theme.accent : "var(--text-2)",
              transition:"all .2s ease", whiteSpace:"nowrap", letterSpacing:"-0.01em",
            }}>
              {g.name}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:"var(--muted)", minWidth:"48px" }}>
            For
          </span>
          {industries.map(i => (
            <button key={i.slug} onClick={()=>setSelectedIndustry(i.slug)} style={{
              padding:"6px 16px", borderRadius:"100px", cursor:"pointer",
              border: selectedIndustry===i.slug ? `1.5px solid ${theme.accent}` : "1px solid rgba(255,255,255,0.09)",
              fontSize:"13px", fontWeight:600,
              background: selectedIndustry===i.slug ? theme.dim : "transparent",
              color: selectedIndustry===i.slug ? theme.accent : "var(--text-2)",
              transition:"all .2s ease", whiteSpace:"nowrap", letterSpacing:"-0.01em",
            }}>
              {i.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SHARED: MARQUEE TICKER
════════════════════════════════════════════════════════════════════ */
function MarqueeTicker({ theme }: { theme: typeof GOAL_THEMES[string] }) {
  return (
    <div style={{
      borderTop:"1px solid rgba(255,255,255,0.05)",
      borderBottom:"1px solid rgba(255,255,255,0.05)",
      padding:"12px 0", overflow:"hidden", background:"var(--bg-2)",
    }}>
      <div style={{ display:"flex", animation:"marquee 26s linear infinite", width:"max-content" }}>
        {[...TICKER,...TICKER].map((item,i) => (
          <span key={i} style={{
            fontSize:"10px", fontWeight:700, letterSpacing:"0.12em",
            textTransform:"uppercase", color:"var(--muted)",
            padding:"0 20px", whiteSpace:"nowrap",
            display:"flex", alignItems:"center", gap:"20px",
          }}>
            {item}
            <span style={{
              width:"3px", height:"3px", borderRadius:"50%",
              background:theme.accent, display:"inline-block",
              transition:"background .5s ease",
            }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   GOAL LAYOUT 1 — GET CLIENTS
   Structure: Split-screen hero. Proof metrics. Results-framed services.
════════════════════════════════════════════════════════════════════ */
function GetClientsLayout({ hero, heroKey, theme, industryMod, services, portfolio, settings, onStartProject, onServiceClick, onPortfolioClick }: {
  hero:any; heroKey:string; theme:any; industryMod:any;
  services:Service[]; portfolio:PortfolioItem[]; settings:SiteSettings;
  onStartProject:()=>void; onServiceClick:(s:Service)=>void; onPortfolioClick:(p:PortfolioItem)=>void;
}) {
  const metrics = [
    { value:"47+",  label:"Clients Served" },
    { value:"3.2×", label:"Avg Revenue Lift" },
    { value:"30d",  label:"Time to Launch" },
  ];
  return (
    <>
      {/* ── HERO: Split-screen ── */}
      <section style={{ position:"relative", minHeight:"92vh", display:"flex", alignItems:"center", overflow:"hidden", padding:"80px 0" }}>
        {/* Orbs */}
        <div aria-hidden style={{ position:"absolute", top:"-5%", right:"-3%", width:"min(600px,70vw)", height:"min(600px,70vw)", borderRadius:"50%", background:`radial-gradient(circle,${theme.orb1} 0%,transparent 70%)`, filter:"blur(64px)", animation:"orb-pulse 10s ease-in-out infinite", pointerEvents:"none" }} />
        <div aria-hidden style={{ position:"absolute", bottom:"10%", left:"-5%", width:"min(400px,50vw)", height:"min(400px,50vw)", borderRadius:"50%", background:`radial-gradient(circle,${theme.orb2} 0%,transparent 70%)`, filter:"blur(80px)", animation:"orb-pulse-2 14s ease-in-out infinite", pointerEvents:"none" }} />
        {/* Grid */}
        <div aria-hidden style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)`, backgroundSize:"64px 64px", pointerEvents:"none", animation:"grid-fade 1.5s ease forwards" }} />

        <div className="container" style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center" }}>
          {/* Left */}
          <div key={heroKey} style={{ animation:"hero-enter .55s cubic-bezier(.22,1,.36,1) forwards" }}>
            {hero.kicker && (
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", marginBottom:"20px", animation:"kicker-enter .4s ease forwards" }}>
                <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:theme.accent, boxShadow:`0 0 10px ${theme.accent}`, animation:"pulse-dot 2s ease infinite" }} />
                <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:theme.accent }}>
                  {hero.kicker}
                </span>
              </div>
            )}
            <h1 style={{
              fontSize:`clamp(40px,5.5vw,72px)`,
              fontWeight:industryMod.weight, lineHeight:1.0,
              letterSpacing:industryMod.letter, marginBottom:"20px",
            }}>
              {hero.heading}
            </h1>
            {hero.subheading && (
              <p style={{ fontSize:"17px", lineHeight:1.65, color:"var(--muted)", maxWidth:"460px", marginBottom:"28px" }}>
                {hero.subheading}
              </p>
            )}
            {/* Metrics row */}
            <div style={{ display:"flex", gap:"24px", marginBottom:"36px", flexWrap:"wrap" }}>
              {metrics.map(m => (
                <div key={m.label}>
                  <p style={{ fontSize:"28px", fontWeight:900, letterSpacing:"-0.04em", color:theme.accent }}>{m.value}</p>
                  <p style={{ fontSize:"12px", color:"var(--muted)", letterSpacing:"0.02em" }}>{m.label}</p>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <button onClick={onStartProject} style={{
                background:theme.accent, color:"#fff", padding:"14px 28px", borderRadius:"12px",
                fontWeight:700, fontSize:"15px", cursor:"pointer", border:"none",
                boxShadow:`0 4px 24px ${theme.glow}`, display:"flex", alignItems:"center", gap:"8px",
              }}>
                {hero.primaryLabel} <span>→</span>
              </button>
              {hero.secondaryLabel && (
                <button onClick={onStartProject} style={{
                  border:"1px solid rgba(255,255,255,0.12)", background:"transparent",
                  color:"var(--text-2)", padding:"14px 24px", borderRadius:"12px",
                  fontWeight:600, fontSize:"14px", cursor:"pointer",
                }}>
                  {hero.secondaryLabel}
                </button>
              )}
            </div>
          </div>

          {/* Right — floating proof card */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
            <div style={{
              background:"var(--surface)", border:"1px solid rgba(255,255,255,0.09)",
              borderRadius:"20px", padding:"28px", maxWidth:"320px", width:"100%",
              boxShadow:`0 32px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,0.04)`,
              animation:"shimmer-badge 5s ease infinite",
            }}>
              <div style={{ display:"flex", gap:"4px", marginBottom:"16px" }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize:"16px" }}>★</span>)}
              </div>
              <p style={{ fontSize:"15px", lineHeight:1.6, marginBottom:"20px", fontWeight:500 }}>
                &ldquo;Within 6 weeks we had 3× more inbound inquiries. The site doesn&apos;t just look good — it converts.&rdquo;
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:theme.dim, border:`1px solid ${theme.glow}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:700, color:theme.accent }}>
                  M
                </div>
                <div>
                  <p style={{ fontSize:"13px", fontWeight:700 }}>Meridian Capital</p>
                  <p style={{ fontSize:"12px", color:"var(--muted)" }}>Financial Services</p>
                </div>
              </div>
              <div style={{
                marginTop:"16px", padding:"10px 14px", borderRadius:"10px",
                background:theme.dim, border:`1px solid ${theme.glow}`,
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}>
                <span style={{ fontSize:"12px", color:theme.accent, fontWeight:700 }}>↑ 312% organic traffic</span>
                <span style={{ fontSize:"10px", color:"var(--muted)" }}>90 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES: Outcome-framed ── */}
      {services.length > 0 && (
        <section style={{ padding:"100px 0", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="container">
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"48px", flexWrap:"wrap", gap:"16px" }}>
              <div>
                <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:theme.accent, marginBottom:"8px" }}>What you walk away with</p>
                <h2 style={{ fontSize:"clamp(26px,3vw,38px)", fontWeight:800, letterSpacing:"-0.03em" }}>Studio Services</h2>
              </div>
              <button onClick={onStartProject} style={{ fontSize:"13px", color:theme.accent, fontWeight:600, background:"transparent", border:"none", cursor:"pointer" }}>
                Start a project →
              </button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
              {services.map((svc,i) => (
                <button
                  key={svc.id}
                  onClick={()=>onServiceClick(svc)}
                  style={{
                    display:"grid", gridTemplateColumns:"48px 1fr 32px",
                    alignItems:"center", gap:"20px",
                    padding:"24px 0", borderBottom:"1px solid rgba(255,255,255,0.05)",
                    background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.05)",
                    cursor:"pointer", textAlign:"left", color:"inherit",
                    transition:"all .2s ease",
                  }}
                >
                  <span style={{ fontSize:"11px", fontWeight:800, color:theme.accent, letterSpacing:"0.04em" }}>
                    {String(i+1).padStart(2,"0")}
                  </span>
                  <div>
                    <p style={{ fontWeight:700, fontSize:"17px", letterSpacing:"-0.02em", marginBottom:"3px" }}>{svc.title}</p>
                    {svc.summary && <p style={{ fontSize:"13px", color:"var(--muted)", lineHeight:1.5 }}>{svc.summary.slice(0,90)}{svc.summary.length>90?"…":""}</p>}
                  </div>
                  <span style={{ fontSize:"16px", color:"var(--muted)", opacity:.5 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PORTFOLIO: Results showcase ── */}
      {portfolio.length > 0 && (
        <section style={{ padding:"100px 0", background:"var(--bg-2)", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div className="container">
            <div style={{ marginBottom:"48px" }}>
              <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:theme.accent, marginBottom:"8px" }}>Proven results</p>
              <h2 style={{ fontSize:"clamp(26px,3vw,38px)", fontWeight:800, letterSpacing:"-0.03em" }}>Client Work</h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"16px" }}>
              {portfolio.map(item => (
                <button key={item.id} onClick={()=>onPortfolioClick(item)} style={{
                  position:"relative", height:"260px", borderRadius:"18px", overflow:"hidden",
                  background: item.cover_image_url ? undefined : `linear-gradient(135deg,${theme.orb1} 0%,var(--surface) 65%)`,
                  border:"1px solid rgba(255,255,255,0.07)", cursor:"pointer",
                  textAlign:"left",
                }}>
                  {item.cover_image_url && <img src={item.cover_image_url} alt={item.title} style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
                  <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(4,6,13,.92) 0%,transparent 55%)" }} />
                  <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"20px 24px" }}>
                    <p style={{ fontWeight:700,fontSize:"16px",letterSpacing:"-0.02em",marginBottom:"4px" }}>{item.title}</p>
                    {item.summary && <p style={{ fontSize:"12px",color:"rgba(240,244,255,0.6)",lineHeight:1.4 }}>{item.summary.slice(0,60)}…</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection goal="get-clients" theme={theme} settings={settings} onStartProject={onStartProject} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   GOAL LAYOUT 2 — BUILD BRAND
   Structure: Editorial full-width hero. Identity disciplines. Brand grid.
════════════════════════════════════════════════════════════════════ */
function BuildBrandLayout({ hero, heroKey, theme, industryMod, services, portfolio, settings, onStartProject, onServiceClick, onPortfolioClick }: {
  hero:any; heroKey:string; theme:any; industryMod:any;
  services:Service[]; portfolio:PortfolioItem[]; settings:SiteSettings;
  onStartProject:()=>void; onServiceClick:(s:Service)=>void; onPortfolioClick:(p:PortfolioItem)=>void;
}) {
  const disciplines = ["Visual Identity","Brand Voice","Digital Systems","Motion & Experience"];
  return (
    <>
      {/* ── HERO: Editorial center-aligned ── */}
      <section style={{ position:"relative", minHeight:"92vh", display:"flex", alignItems:"center", overflow:"hidden", padding:"80px 0" }}>
        {/* Decorative huge letterform */}
        <div aria-hidden style={{
          position:"absolute", right:"-2%", top:"50%", transform:"translateY(-50%)",
          fontSize:"clamp(300px,40vw,520px)", fontWeight:900, letterSpacing:"-0.05em",
          color:theme.orb1, lineHeight:1, userSelect:"none", pointerEvents:"none",
          fontFamily:"inherit",
        }}>A</div>
        <div aria-hidden style={{ position:"absolute", top:"10%", left:"-4%", width:"min(500px,55vw)", height:"min(500px,55vw)", borderRadius:"50%", background:`radial-gradient(circle,${theme.orb2} 0%,transparent 70%)`, filter:"blur(90px)", animation:"orb-pulse-2 14s ease-in-out infinite", pointerEvents:"none" }} />

        <div className="container" style={{ position:"relative", zIndex:1, maxWidth:"760px" }}>
          <div key={heroKey} style={{ animation:"hero-enter .6s cubic-bezier(.22,1,.36,1) forwards" }}>
            {/* Discipline pills */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"28px", flexWrap:"wrap" }}>
              {disciplines.map(d => (
                <span key={d} style={{
                  padding:"6px 14px", borderRadius:"100px",
                  border:"1px solid rgba(255,255,255,0.10)",
                  fontSize:"12px", fontWeight:600, color:"var(--text-2)",
                  letterSpacing:"-0.01em",
                }}>
                  {d}
                </span>
              ))}
            </div>
            {hero.kicker && (
              <p style={{ fontSize:"12px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:theme.accent, marginBottom:"16px" }}>
                — {hero.kicker}
              </p>
            )}
            <h1 style={{
              fontSize:`clamp(44px,6.5vw,84px)`,
              fontWeight:industryMod.weight, lineHeight:.98,
              letterSpacing:industryMod.letter, marginBottom:"24px",
            }}>
              {hero.heading}
            </h1>
            {hero.subheading && (
              <p style={{ fontSize:"18px", lineHeight:1.6, color:"var(--muted)", maxWidth:"520px", marginBottom:"40px", fontWeight:400 }}>
                {hero.subheading}
              </p>
            )}
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center" }}>
              <button onClick={onStartProject} style={{
                background:theme.accent, color:"#fff", padding:"15px 32px", borderRadius:"12px",
                fontWeight:700, fontSize:"15px", cursor:"pointer", border:"none",
                boxShadow:`0 4px 24px ${theme.glow}`, letterSpacing:"-0.01em",
              }}>
                {hero.primaryLabel}
              </button>
              {portfolio.length > 0 && (
                <button onClick={()=>onPortfolioClick(portfolio[0])} style={{
                  border:"1px solid rgba(255,255,255,0.12)", background:"transparent",
                  color:"var(--text-2)", padding:"15px 24px", borderRadius:"12px",
                  fontWeight:600, fontSize:"14px", cursor:"pointer",
                }}>
                  See our work →
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES: Design disciplines grid ── */}
      {services.length > 0 && (
        <section style={{ padding:"100px 0", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="container">
            <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:"80px", alignItems:"start" }}>
              <div>
                <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:theme.accent, marginBottom:"12px" }}>
                  Our Disciplines
                </p>
                <h2 style={{ fontSize:"clamp(26px,3vw,38px)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:"16px" }}>
                  Craft-led Studio Services
                </h2>
                <p style={{ fontSize:"14px", color:"var(--muted)", lineHeight:1.7, marginBottom:"24px" }}>
                  Each engagement is a bespoke system. We don&apos;t use templates.
                </p>
                <button onClick={onStartProject} style={{
                  background:theme.accent, color:"#fff", padding:"12px 24px", borderRadius:"10px",
                  fontWeight:700, fontSize:"13px", cursor:"pointer", border:"none",
                  boxShadow:`0 4px 16px ${theme.glow}`,
                }}>
                  Start Brand Project →
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px" }}>
                {services.map((svc,i) => (
                  <button key={svc.id} onClick={()=>onServiceClick(svc)} style={{
                    padding:"24px", borderRadius:"16px",
                    border:"1px solid rgba(255,255,255,0.07)",
                    background:"var(--surface)", cursor:"pointer", textAlign:"left",
                    transition:"border-color .2s ease, transform .2s ease",
                    color:"inherit",
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                      {svc.icon && <span style={{ fontSize:"20px" }}>{svc.icon}</span>}
                      <span style={{ fontSize:"10px", fontWeight:700, color:theme.accent, letterSpacing:"0.08em" }}>
                        {String(i+1).padStart(2,"0")}
                      </span>
                    </div>
                    <p style={{ fontWeight:700, fontSize:"15px", letterSpacing:"-0.02em", marginBottom:"6px" }}>{svc.title}</p>
                    {svc.summary && <p style={{ fontSize:"12px", color:"var(--muted)", lineHeight:1.5 }}>{svc.summary.slice(0,80)}{svc.summary.length>80?"…":""}</p>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PORTFOLIO: Brand identity grid ── */}
      {portfolio.length > 0 && (
        <section style={{ padding:"100px 0", background:"var(--bg-2)", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div className="container">
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"48px", flexWrap:"wrap", gap:"16px" }}>
              <div>
                <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:theme.accent, marginBottom:"8px" }}>Selected identities</p>
                <h2 style={{ fontSize:"clamp(26px,3vw,38px)", fontWeight:800, letterSpacing:"-0.03em" }}>Brand Portfolio</h2>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"20px" }}>
              {portfolio.map((item,i) => (
                <button key={item.id} onClick={()=>onPortfolioClick(item)} style={{
                  borderRadius:"20px", overflow:"hidden", cursor:"pointer",
                  border:"1px solid rgba(255,255,255,0.07)",
                  background:"var(--surface)", textAlign:"left",
                  transition:"transform .2s ease",
                }}>
                  <div style={{
                    height:"200px", position:"relative",
                    background: item.cover_image_url ? undefined : `linear-gradient(${135+i*30}deg,${theme.orb1} 0%,var(--surface-2) 70%)`,
                  }}>
                    {item.cover_image_url && <img src={item.cover_image_url} alt={item.title} style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
                  </div>
                  {/* Color palette strip */}
                  <div style={{ display:"flex", height:"6px" }}>
                    {[theme.accent, theme.glow.replace(".22",".7"), "rgba(255,255,255,0.12)", theme.orb1.replace(".17",".5"), "var(--surface-2)"].map((c,j) => (
                      <div key={j} style={{ flex:1, background:c, transition:"background .5s ease" }} />
                    ))}
                  </div>
                  <div style={{ padding:"18px 22px" }}>
                    <p style={{ fontWeight:700, fontSize:"16px", letterSpacing:"-0.02em", marginBottom:"4px" }}>{item.title}</p>
                    {item.summary && <p style={{ fontSize:"12px", color:"var(--muted)" }}>{item.summary.slice(0,60)}…</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection goal="build-brand" theme={theme} settings={settings} onStartProject={onStartProject} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   GOAL LAYOUT 3 — LAUNCH PRODUCT
   Structure: Feature-checklist hero. Phase timeline. Launch grid.
════════════════════════════════════════════════════════════════════ */
function LaunchProductLayout({ hero, heroKey, theme, industryMod, services, portfolio, settings, onStartProject, onServiceClick, onPortfolioClick }: {
  hero:any; heroKey:string; theme:any; industryMod:any;
  services:Service[]; portfolio:PortfolioItem[]; settings:SiteSettings;
  onStartProject:()=>void; onServiceClick:(s:Service)=>void; onPortfolioClick:(p:PortfolioItem)=>void;
}) {
  const features = ["Market-ready in 4 weeks","Conversion-optimised UX","Full launch strategy included","Post-launch growth system"];
  return (
    <>
      {/* ── HERO: Feature-checklist + device frame ── */}
      <section style={{ position:"relative", minHeight:"92vh", display:"flex", alignItems:"center", overflow:"hidden", padding:"80px 0" }}>
        <div aria-hidden style={{ position:"absolute", top:"15%", right:"5%", width:"min(560px,60vw)", height:"min(560px,60vw)", borderRadius:"50%", background:`radial-gradient(circle,${theme.orb1} 0%,transparent 70%)`, filter:"blur(64px)", animation:"orb-pulse 9s ease-in-out infinite", pointerEvents:"none" }} />
        <div aria-hidden style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)`, backgroundSize:"64px 64px", pointerEvents:"none" }} />

        <div className="container" style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"60px", alignItems:"center" }}>
          {/* Left */}
          <div key={heroKey} style={{ animation:"hero-enter .55s cubic-bezier(.22,1,.36,1) forwards" }}>
            {/* Launch badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              padding:"7px 14px", borderRadius:"100px",
              background:theme.dim, border:`1px solid ${theme.glow}`,
              marginBottom:"24px",
              animation:"shimmer-badge 3s ease infinite",
            }}>
              <span style={{ fontSize:"14px" }}>🚀</span>
              <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:theme.accent }}>
                Launch Sequence Active
              </span>
            </div>
            {hero.kicker && (
              <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--muted)", marginBottom:"12px" }}>
                {hero.kicker}
              </p>
            )}
            <h1 style={{
              fontSize:`clamp(38px,5vw,68px)`,
              fontWeight:industryMod.weight, lineHeight:1.0,
              letterSpacing:industryMod.letter, marginBottom:"28px",
            }}>
              {hero.heading}
            </h1>
            {/* Feature list */}
            <div style={{ display:"grid", gap:"10px", marginBottom:"32px" }}>
              {features.map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <span style={{
                    width:"20px", height:"20px", borderRadius:"6px",
                    background:theme.dim, border:`1px solid ${theme.glow}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"11px", color:theme.accent, flexShrink:0,
                  }}>✓</span>
                  <span style={{ fontSize:"14px", color:"var(--text-2)", fontWeight:500 }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center" }}>
              <button onClick={onStartProject} style={{
                background:theme.accent, color:"#fff", padding:"14px 28px", borderRadius:"12px",
                fontWeight:700, fontSize:"15px", cursor:"pointer", border:"none",
                boxShadow:`0 4px 24px ${theme.glow}`, display:"flex", alignItems:"center", gap:"8px",
              }}>
                {hero.primaryLabel} <span>→</span>
              </button>
            </div>
            {/* Ships-in pill */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:"8px",
              marginTop:"20px", padding:"8px 16px", borderRadius:"100px",
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e", display:"inline-block", animation:"pulse-dot 1.5s ease infinite" }} />
              <span style={{ fontSize:"12px", color:"var(--text-2)", fontWeight:600 }}>Ships in ~30 days</span>
            </div>
          </div>

          {/* Right — CSS device frame */}
          <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
            <div style={{
              width:"280px", position:"relative",
              background:"var(--surface)", border:"1px solid rgba(255,255,255,0.10)",
              borderRadius:"24px", padding:"16px",
              boxShadow:`0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px ${theme.orb1}`,
            }}>
              {/* Screen header */}
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px" }}>
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#ef4444" }} />
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#f59e0b" }} />
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#22c55e" }} />
                <div style={{ flex:1, height:"24px", background:"rgba(255,255,255,0.04)", borderRadius:"6px", border:"1px solid rgba(255,255,255,0.06)" }} />
              </div>
              {/* Screen content (mock) */}
              <div style={{ display:"grid", gap:"10px" }}>
                <div style={{ height:"80px", borderRadius:"12px", background:`linear-gradient(135deg,${theme.orb1},${theme.orb2})` }} />
                <div style={{ height:"14px", borderRadius:"4px", background:"rgba(255,255,255,0.08)", width:"70%" }} />
                <div style={{ height:"10px", borderRadius:"4px", background:"rgba(255,255,255,0.05)", width:"90%" }} />
                <div style={{ height:"10px", borderRadius:"4px", background:"rgba(255,255,255,0.05)", width:"60%" }} />
                <div style={{ height:"36px", borderRadius:"8px", background:theme.accent, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:"11px", fontWeight:700, color:"#fff" }}>Your Product. Launched.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES: Launch phases ── */}
      {services.length > 0 && (
        <section style={{ padding:"100px 0", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="container">
            <div style={{ marginBottom:"52px" }}>
              <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:theme.accent, marginBottom:"8px" }}>
                The launch sequence
              </p>
              <h2 style={{ fontSize:"clamp(26px,3vw,38px)", fontWeight:800, letterSpacing:"-0.03em" }}>How we launch</h2>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
              {services.map((svc,i) => (
                <button key={svc.id} onClick={()=>onServiceClick(svc)} style={{
                  display:"grid", gridTemplateColumns:"64px 1fr 28px",
                  alignItems:"start", gap:"20px",
                  padding:"28px 0", borderBottom:"1px solid rgba(255,255,255,0.05)",
                  background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.05)",
                  cursor:"pointer", textAlign:"left", color:"inherit",
                }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"2px" }}>
                    <div style={{
                      width:"36px", height:"36px", borderRadius:"10px",
                      background:theme.dim, border:`1px solid ${theme.glow}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"13px", fontWeight:800, color:theme.accent,
                    }}>
                      {String(i+1).padStart(2,"0")}
                    </div>
                    {i < services.length-1 && (
                      <div style={{ width:"1px", flex:1, minHeight:"20px", background:`linear-gradient(${theme.accent},transparent)`, marginTop:"6px" }} />
                    )}
                  </div>
                  <div style={{ paddingBottom:"8px" }}>
                    <p style={{ fontWeight:700, fontSize:"18px", letterSpacing:"-0.02em", marginBottom:"6px" }}>{svc.title}</p>
                    {svc.summary && <p style={{ fontSize:"14px", color:"var(--muted)", lineHeight:1.6 }}>{svc.summary}</p>}
                  </div>
                  <span style={{ fontSize:"14px", color:"var(--muted)", opacity:.5, paddingTop:"4px" }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PORTFOLIO: Launched products ── */}
      {portfolio.length > 0 && (
        <section style={{ padding:"100px 0", background:"var(--bg-2)", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div className="container">
            <div style={{ marginBottom:"48px" }}>
              <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:theme.accent, marginBottom:"8px" }}>Already live</p>
              <h2 style={{ fontSize:"clamp(26px,3vw,38px)", fontWeight:800, letterSpacing:"-0.03em" }}>Launched Products</h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"16px" }}>
              {portfolio.map((item,i) => (
                <button key={item.id} onClick={()=>onPortfolioClick(item)} style={{
                  position:"relative", borderRadius:"18px", overflow:"hidden",
                  cursor:"pointer", textAlign:"left", border:"1px solid rgba(255,255,255,0.07)",
                  background:"var(--surface)",
                }}>
                  <div style={{
                    height:"180px", position:"relative",
                    background: item.cover_image_url ? undefined : `linear-gradient(${120+i*40}deg,${theme.orb1} 0%,var(--surface-2) 70%)`,
                  }}>
                    {item.cover_image_url && <img src={item.cover_image_url} alt={item.title} style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
                    <div style={{ position:"absolute",top:"12px",left:"12px" }}>
                      <span style={{
                        fontSize:"9px", fontWeight:800, letterSpacing:"0.10em",
                        textTransform:"uppercase", color:theme.accent,
                        background:theme.dim, border:`1px solid ${theme.glow}`,
                        padding:"4px 10px", borderRadius:"6px",
                      }}>
                        ✓ Launched
                      </span>
                    </div>
                  </div>
                  <div style={{ padding:"18px 22px" }}>
                    <p style={{ fontWeight:700, fontSize:"16px", letterSpacing:"-0.02em", marginBottom:"4px" }}>{item.title}</p>
                    {item.summary && <p style={{ fontSize:"12px", color:"var(--muted)", lineHeight:1.5 }}>{item.summary.slice(0,70)}…</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection goal="launch-product" theme={theme} settings={settings} onStartProject={onStartProject} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   GOAL LAYOUT 4 — SHOW PORTFOLIO
   Structure: Gallery-dominant hero. Craft capabilities. Masonry grid.
════════════════════════════════════════════════════════════════════ */
function ShowPortfolioLayout({ hero, heroKey, theme, industryMod, services, portfolio, settings, onStartProject, onServiceClick, onPortfolioClick }: {
  hero:any; heroKey:string; theme:any; industryMod:any;
  services:Service[]; portfolio:PortfolioItem[]; settings:SiteSettings;
  onStartProject:()=>void; onServiceClick:(s:Service)=>void; onPortfolioClick:(p:PortfolioItem)=>void;
}) {
  const firstItem = portfolio[0];
  return (
    <>
      {/* ── HERO: Full-bleed gallery ── */}
      <section style={{ position:"relative", minHeight:"92vh", overflow:"hidden" }}>
        {/* Full-bleed background */}
        <div style={{
          position:"absolute", inset:0,
          background: firstItem?.cover_image_url
            ? undefined
            : `linear-gradient(135deg, ${theme.orb1} 0%, #04060d 55%)`,
        }}>
          {firstItem?.cover_image_url && (
            <img src={firstItem.cover_image_url} alt={firstItem.title}
              style={{ width:"100%", height:"100%", objectFit:"cover", opacity:.4 }} />
          )}
        </div>
        {/* Dark overlay gradient */}
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to right, rgba(4,6,13,.95) 35%, rgba(4,6,13,.2) 100%), linear-gradient(to top, rgba(4,6,13,.8) 0%, transparent 50%)",
        }} />
        {/* Orb */}
        <div aria-hidden style={{ position:"absolute", top:"20%", right:"10%", width:"min(500px,55vw)", height:"min(500px,55vw)", borderRadius:"50%", background:`radial-gradient(circle,${theme.orb2} 0%,transparent 70%)`, filter:"blur(100px)", animation:"orb-pulse-2 15s ease-in-out infinite", pointerEvents:"none" }} />

        <div className="container" style={{ position:"relative", zIndex:1, height:"92vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", paddingBottom:"80px" }}>
          <div key={heroKey} style={{ animation:"hero-enter .6s cubic-bezier(.22,1,.36,1) forwards", maxWidth:"700px" }}>
            <div style={{ display:"flex", gap:"12px", marginBottom:"24px", flexWrap:"wrap" }}>
              <span style={{
                padding:"6px 14px", borderRadius:"100px",
                background:theme.dim, border:`1px solid ${theme.glow}`,
                fontSize:"11px", fontWeight:700, color:theme.accent,
                letterSpacing:"0.06em", textTransform:"uppercase",
              }}>
                Studio Work
              </span>
              <span style={{
                padding:"6px 14px", borderRadius:"100px",
                border:"1px solid rgba(255,255,255,0.10)",
                fontSize:"11px", fontWeight:600, color:"var(--text-2)",
              }}>
                Est. 2020
              </span>
            </div>
            {hero.kicker && (
              <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--muted)", marginBottom:"12px" }}>
                {hero.kicker}
              </p>
            )}
            <h1 style={{
              fontSize:`clamp(42px,6vw,80px)`,
              fontWeight:industryMod.weight, lineHeight:1.0,
              letterSpacing:industryMod.letter, marginBottom:"20px",
            }}>
              {hero.heading}
            </h1>
            {hero.subheading && (
              <p style={{ fontSize:"17px", lineHeight:1.65, color:"rgba(240,244,255,0.65)", maxWidth:"480px", marginBottom:"36px" }}>
                {hero.subheading}
              </p>
            )}
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <button onClick={()=>firstItem && onPortfolioClick(firstItem)} style={{
                background:"rgba(255,255,255,0.10)", backdropFilter:"blur(12px)",
                border:"1px solid rgba(255,255,255,0.20)", color:"var(--text)",
                padding:"14px 28px", borderRadius:"12px", fontWeight:700, fontSize:"15px", cursor:"pointer",
              }}>
                View featured work →
              </button>
              <button onClick={onStartProject} style={{
                background:theme.accent, color:"#fff", padding:"14px 28px", borderRadius:"12px",
                fontWeight:700, fontSize:"15px", cursor:"pointer", border:"none",
                boxShadow:`0 4px 24px ${theme.glow}`,
              }}>
                {hero.primaryLabel}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO: Magazine masonry grid (ALL items, equal prominence) ── */}
      {portfolio.length > 0 && (
        <section style={{ padding:"100px 0", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="container">
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"48px", flexWrap:"wrap", gap:"16px" }}>
              <div>
                <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:theme.accent, marginBottom:"8px" }}>Every project matters</p>
                <h2 style={{ fontSize:"clamp(26px,3vw,38px)", fontWeight:800, letterSpacing:"-0.03em" }}>All Work</h2>
              </div>
              <button onClick={onStartProject} style={{ fontSize:"13px", color:theme.accent, fontWeight:600, background:"transparent", border:"none", cursor:"pointer" }}>
                Commission a project →
              </button>
            </div>
            {/* Featured full-width */}
            {portfolio[0] && (
              <button onClick={()=>onPortfolioClick(portfolio[0])} style={{
                position:"relative", height:"clamp(280px,40vw,480px)", borderRadius:"22px", overflow:"hidden",
                width:"100%", marginBottom:"16px", cursor:"pointer",
                border:"1px solid rgba(255,255,255,0.07)",
                background: portfolio[0].cover_image_url ? undefined : `linear-gradient(135deg,${theme.orb1} 0%,var(--surface) 60%)`,
                textAlign:"left",
              }}>
                {portfolio[0].cover_image_url && <img src={portfolio[0].cover_image_url} alt={portfolio[0].title} style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
                <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(4,6,13,.9) 0%,transparent 55%)" }} />
                <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"36px 40px" }}>
                  <div style={{ display:"inline-flex",alignItems:"center",gap:"6px",padding:"4px 10px",borderRadius:"6px",background:theme.dim,border:`1px solid ${theme.glow}`,marginBottom:"12px" }}>
                    <span style={{ fontSize:"10px",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:theme.accent }}>Featured</span>
                  </div>
                  <h3 style={{ fontSize:"clamp(22px,3.5vw,40px)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:"8px" }}>{portfolio[0].title}</h3>
                  {portfolio[0].summary && <p style={{ fontSize:"15px",color:"rgba(240,244,255,0.65)",maxWidth:"480px" }}>{portfolio[0].summary}</p>}
                </div>
              </button>
            )}
            {/* Remaining grid */}
            {portfolio.length > 1 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"16px" }}>
                {portfolio.slice(1).map((item,i) => (
                  <button key={item.id} onClick={()=>onPortfolioClick(item)} style={{
                    position:"relative", height:"240px", borderRadius:"18px", overflow:"hidden",
                    cursor:"pointer", border:"1px solid rgba(255,255,255,0.07)", textAlign:"left",
                    background: item.cover_image_url ? undefined : `linear-gradient(${140+i*40}deg,${theme.orb2} 0%,var(--surface) 65%)`,
                  }}>
                    {item.cover_image_url && <img src={item.cover_image_url} alt={item.title} style={{ width:"100%",height:"100%",objectFit:"cover" }} />}
                    <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(4,6,13,.88) 0%,transparent 60%)" }} />
                    <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"18px 22px" }}>
                      <p style={{ fontWeight:700,fontSize:"16px",letterSpacing:"-0.02em",marginBottom:"4px" }}>{item.title}</p>
                      {item.summary && <p style={{ fontSize:"12px",color:"rgba(240,244,255,0.55)" }}>{item.summary.slice(0,55)}…</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SERVICES: Craft capabilities ── */}
      {services.length > 0 && (
        <section style={{ padding:"100px 0", background:"var(--bg-2)", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
          <div className="container">
            <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:"80px", alignItems:"start" }}>
              <div>
                <p style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:theme.accent, marginBottom:"12px" }}>Capabilities</p>
                <h2 style={{ fontSize:"clamp(26px,3vw,38px)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:"16px" }}>What we craft</h2>
                <p style={{ fontSize:"14px", color:"var(--muted)", lineHeight:1.7 }}>
                  Every project starts with understanding what you want to be known for.
                </p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
                {services.map((svc,i) => (
                  <button key={svc.id} onClick={()=>onServiceClick(svc)} style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"20px 0", borderBottom:"1px solid rgba(255,255,255,0.05)",
                    background:"transparent", border:"none", borderBottom:"1px solid rgba(255,255,255,0.05)",
                    cursor:"pointer", textAlign:"left", color:"inherit", gap:"16px",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
                      {svc.icon && <span style={{ fontSize:"18px" }}>{svc.icon}</span>}
                      <span style={{ fontWeight:600, fontSize:"16px", letterSpacing:"-0.02em" }}>{svc.title}</span>
                    </div>
                    <span style={{ fontSize:"14px", color:"var(--muted)", opacity:.5, flexShrink:0 }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <CTASection goal="show-portfolio" theme={theme} settings={settings} onStartProject={onStartProject} />
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SHARED: CTA SECTION — adapts copy per goal
════════════════════════════════════════════════════════════════════ */
const CTA_COPY: Record<string,{headline:string; sub:string; btn:string}> = {
  "get-clients":    { headline:"Ready to turn browsers into buyers?", sub:"Tell us about your business. We'll build a pipeline that works.", btn:"Book a Strategy Call" },
  "build-brand":    { headline:"Ready to build something the market remembers?", sub:"Every iconic brand starts with a single conversation.", btn:"Start Brand Project" },
  "launch-product": { headline:"Ready to ship something the market hasn't seen?", sub:"Share your vision. We'll turn it into a launched product.", btn:"Plan My Launch" },
  "show-portfolio": { headline:"Ready to commission something remarkable?", sub:"Every project in our portfolio started with a brief. Yours is next.", btn:"Commission a Project" },
};

function CTASection({ goal, theme, settings, onStartProject }: {
  goal:string; theme:any; settings:SiteSettings; onStartProject:()=>void;
}) {
  const copy = CTA_COPY[goal] ?? CTA_COPY["get-clients"];
  return (
    <section style={{ padding:"120px 0", position:"relative", overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
      <div aria-hidden style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"min(700px,90vw)", height:"min(400px,60vw)", borderRadius:"50%",
        background:`radial-gradient(ellipse,${theme.orb1} 0%,transparent 70%)`,
        filter:"blur(80px)", pointerEvents:"none",
      }} />
      <div className="container" style={{ position:"relative", zIndex:1, textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"7px 16px", borderRadius:"100px", border:`1px solid ${theme.glow}`, background:theme.dim, marginBottom:"28px" }}>
          <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:theme.accent, boxShadow:`0 0 8px ${theme.accent}`, display:"inline-block", animation:"pulse-dot 2s ease infinite" }} />
          <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:theme.accent }}>
            Let&apos;s work together
          </span>
        </div>
        <h2 style={{ fontSize:"clamp(34px,5vw,64px)", fontWeight:800, letterSpacing:"-0.035em", lineHeight:1.0, marginBottom:"20px", maxWidth:"700px", marginInline:"auto" }}>
          {copy.headline}
        </h2>
        <p style={{ fontSize:"17px", color:"var(--muted)", lineHeight:1.6, maxWidth:"440px", marginInline:"auto", marginBottom:"40px" }}>
          {copy.sub}
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:"12px", flexWrap:"wrap" }}>
          <button onClick={onStartProject} style={{
            background:theme.accent, color:"#fff", padding:"16px 36px", borderRadius:"14px",
            fontWeight:700, fontSize:"16px", cursor:"pointer", border:"none",
            boxShadow:`0 8px 32px ${theme.glow}`, letterSpacing:"-0.01em",
            display:"inline-flex", alignItems:"center", gap:"8px",
          }}>
            {copy.btn} <span>→</span>
          </button>
          {settings?.contact_whatsapp && !settings.contact_whatsapp.includes("XXXX") && (
            <a
              href={`https://wa.me/${settings.contact_whatsapp.replace(/\D/g,"")}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                border:"1px solid rgba(255,255,255,0.12)", color:"var(--text-2)",
                padding:"16px 28px", borderRadius:"14px", fontWeight:600, fontSize:"15px",
                display:"inline-flex", alignItems:"center", gap:"8px",
              }}
            >
              WhatsApp us
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN — HomeClient  (the Shapeshifter orchestrator)
════════════════════════════════════════════════════════════════════ */
export default function HomeClient({ goals, industries, variants, services, portfolio, settings }: Props) {
  const [selectedGoal,     setSelectedGoal]     = useState(goals[0]?.slug ?? "");
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0]?.slug ?? "");
  const [intakeOpen,       setIntakeOpen]        = useState(false);
  const [activeService,    setActiveService]     = useState<Service|null>(null);
  const [activePortfolio,  setActivePortfolio]   = useState<PortfolioItem|null>(null);

  const theme       = GOAL_THEMES[selectedGoal]      ?? GOAL_THEMES["get-clients"];
  const industryMod = INDUSTRY_MODS[selectedIndustry] ?? INDUSTRY_MODS["startup"];

  /* Push accent to :root so Nav and Footer also respond */
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent",      theme.accent);
    r.style.setProperty("--accent-glow", theme.glow);
    r.style.setProperty("--accent-dim",  theme.dim);
  }, [theme]);

  /* Listen for "open intake" events dispatched by Nav */
  useEffect(() => {
    const h = () => setIntakeOpen(true);
    window.addEventListener("adil:intake", h);
    return () => window.removeEventListener("adil:intake", h);
  }, []);

  /* Computed variant copy */
  const variantsMap = (() => {
    const m: Record<string,Variant> = {};
    for (const v of variants) {
      const g = v.goals?.slug, i = v.industries?.slug;
      if (g && i) m[`${g}--${i}`] = v;
    }
    return m;
  })();
  const cv = variantsMap[`${selectedGoal}--${selectedIndustry}`] ?? null;
  const goalObj = goals.find(g=>g.slug===selectedGoal);
  const indObj  = industries.find(i=>i.slug===selectedIndustry);

  const hero = cv ? {
    kicker:       cv.hero_kicker,
    heading:      cv.hero_heading,
    subheading:   cv.hero_subheading,
    primaryLabel: cv.primary_cta_label ?? "Start Project",
    primaryHref:  cv.primary_cta_href  ?? "/contact",
    secondaryLabel: cv.secondary_cta_label,
    secondaryHref:  cv.secondary_cta_href,
  } : {
    kicker:       goalObj && indObj ? `${goalObj.name} · ${indObj.name}` : null,
    heading:      settings?.site_tagline ?? "Build. Automate. Scale.",
    subheading:   "Goal-led. Industry-aware. We build digital presences that convert.",
    primaryLabel: "Start Project",
    primaryHref:  "/contact",
    secondaryLabel: null,
    secondaryHref:  null,
  };

  /* Key for text-level re-animation (industry changes) */
  const heroKey = `${selectedGoal}--${selectedIndustry}`;

  const openIntake      = useCallback(() => setIntakeOpen(true), []);
  const openService     = useCallback((s:Service)    => setActiveService(s), []);
  const openPortfolio   = useCallback((p:PortfolioItem) => setActivePortfolio(p), []);

  /* Shared layout props */
  const layoutProps = {
    hero, heroKey, theme, industryMod, services, portfolio, settings,
    onStartProject: openIntake, onServiceClick: openService, onPortfolioClick: openPortfolio,
  };

  return (
    <>
      {/* ── Sticky Selector Bar (stable — outside keyed div) ── */}
      <SelectorBar
        goals={goals} industries={industries}
        selectedGoal={selectedGoal}     setSelectedGoal={setSelectedGoal}
        selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry}
        theme={theme}
      />

      {/* ── Goal Layout (keyed — full remount + animation on goal change) ── */}
      <div key={selectedGoal} style={{ animation:"layout-enter .5s cubic-bezier(.22,1,.36,1) forwards" }}>
        <MarqueeTicker theme={theme} />

        {selectedGoal === "get-clients"    && <GetClientsLayout    {...layoutProps} />}
        {selectedGoal === "build-brand"    && <BuildBrandLayout    {...layoutProps} />}
        {selectedGoal === "launch-product" && <LaunchProductLayout {...layoutProps} />}
        {selectedGoal === "show-portfolio" && <ShowPortfolioLayout {...layoutProps} />}
      </div>

      {/* ── Modals (outside keyed div — stable mount) ── */}
      <IntakeModal
        isOpen={intakeOpen} onClose={()=>setIntakeOpen(false)}
        goal={selectedGoal} industry={selectedIndustry}
        settings={settings} theme={theme}
      />
      {activeService && (
        <ServiceModal
          service={activeService} onClose={()=>setActiveService(null)}
          onStartProject={openIntake} theme={theme}
        />
      )}
      {activePortfolio && (
        <CaseStudyModal
          item={activePortfolio} onClose={()=>setActivePortfolio(null)}
          onStartProject={openIntake} theme={theme}
        />
      )}
    </>
  );
}
