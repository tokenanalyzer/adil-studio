import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

type Goal = {
  id: string;
  name: string | null;
  slug: string | null;
  short_description: string | null;
};

type Industry = {
  id: string;
  name: string | null;
  slug: string | null;
  short_description: string | null;
};

export default function HomePage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [goalsRes, industriesRes] = await Promise.all([
        supabase.from("goals").select("*").eq("is_active", true).order("position", { ascending: true }),
        supabase.from("industries").select("*").eq("is_active", true).order("position", { ascending: true }),
      ]);
      setGoals((goalsRes.data ?? []) as Goal[]);
      setIndustries((industriesRes.data ?? []) as Industry[]);
      setLoading(false);
    }
    load();
  }, []);

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

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      ) : (
        <>
          <section>
            <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>Goals</h2>
            <div style={{ display: "grid", gap: "12px" }}>
              {goals.length === 0 ? (
                <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "16px", color: "var(--muted)" }}>
                  No goals configured yet.
                </div>
              ) : goals.map((goal) => (
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
              {industries.length === 0 ? (
                <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "16px", color: "var(--muted)" }}>
                  No industries configured yet.
                </div>
              ) : industries.map((industry) => (
                <div key={industry.id} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "16px" }}>
                  <strong>{industry.name}</strong>
                  <p style={{ color: "var(--muted)", marginTop: "6px" }}>{industry.short_description}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
