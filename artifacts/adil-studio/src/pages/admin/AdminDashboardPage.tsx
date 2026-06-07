import { Link } from "wouter";

const navLinks = [
  { href: "/admin/goals", label: "Goals" },
  { href: "/admin/industries", label: "Industries" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/variants", label: "Variants" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminDashboardPage() {
  return (
    <section>
      <h1 style={{ fontSize: "36px", marginBottom: "12px" }}>Admin Dashboard</h1>
      <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
        Founder, hero, goals, industries, themes, variants, services, portfolio, leads, and Adi modules will live here.
      </p>
      <div style={{ display: "grid", gap: "10px" }}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} style={{ display: "inline-block", padding: "12px 16px", border: "1px solid var(--border)", borderRadius: "12px", fontWeight: 600 }}>
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
