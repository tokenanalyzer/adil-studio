import { Link } from "wouter";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/goals", label: "Goals" },
  { href: "/admin/industries", label: "Industries" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/variants", label: "Variants" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <div className="container" style={{ padding: "32px 0" }}>
        <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border)", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <strong>Adil Studio Admin</strong>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{ color: "var(--muted)", fontSize: 14 }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
