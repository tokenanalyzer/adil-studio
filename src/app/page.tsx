import Link from "next/link";
import { getActiveGoals, getActiveIndustries } from "@/lib/cms/public";

export default async function HomePage() {
  const goals = await getActiveGoals();
  const industries = await getActiveIndustries();

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: "32px" }}>
      <section>
        <p style={{ color: "var(--muted)", marginBottom: "12px" }}>Adil Studio V1</p>
        <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>Adaptive Digital Studio</h1>
        <p style={{ fontSize: "18px", color: "var(--muted)", maxWidth: "760px", marginBottom: "24px" }}>
          Goal-led, industry-aware website variants with admin-managed content, lead capture, and Adi AI support.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/contact" style={{ background: "var(--primary)", color: "#fff", padding: "12px 18px", borderRadius: "12px" }}>
            Start Project
          </Link>
          <Link href="/admin/login" style={{ border: "1px solid var(--border)", padding: "12px 18px", borderRadius: "12px" }}>
            Admin Login
          </Link>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>Goals</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {goals.map((goal: any) => (
            <div key={goal.id} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "16px" }}>
              <strong>{goal.name}</strong>
              <p style={{ color: "var(--muted)", marginTop: "6px" }}>{goal.short_description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>Industries</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {industries.map((industry: any) => (
            <div key={industry.id} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "16px" }}>
              <strong>{industry.name}</strong>
              <p style={{ color: "var(--muted)", marginTop: "6px" }}>{industry.short_description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
