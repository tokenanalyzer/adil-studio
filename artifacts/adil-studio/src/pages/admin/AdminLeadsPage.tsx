import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  status: string | null;
  created_at: string | null;
};

const statuses = ["new", "contacted", "qualified", "closed"];

function badgeColor(status: string | null) {
  switch (status) {
    case "closed": return { bg: "#d1fae5", text: "#065f46" };
    case "qualified": return { bg: "#dbeafe", text: "#1d4ed8" };
    case "contacted": return { bg: "#fef3c7", text: "#92400e" };
    default: return { bg: "#e5e7eb", text: "#374151" };
  }
}

function previewText(text: string | null) {
  if (!text) return "No notes";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 140 ? clean.slice(0, 140) + "..." : clean;
}

function LeadCard({ lead, onUpdate }: { lead: Lead; onUpdate: () => void }) {
  const colors = badgeColor(lead.status);

  async function handleStatusChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("leads").update({ status: String(fd.get("status")), updated_at: new Date().toISOString() }).eq("id", lead.id);
    if (error) { alert(error.message); return; }
    onUpdate();
  }

  return (
    <article style={{ padding: 16, borderRadius: 16, border: "1px solid var(--border)", display: "grid", gap: 10, opacity: lead.status === "closed" ? 0.78 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <strong>{lead.full_name || "Unnamed lead"}</strong>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>{lead.created_at ? new Date(lead.created_at).toLocaleString() : ""}</span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ padding: "6px 10px", borderRadius: 999, background: colors.bg, color: colors.text, fontSize: 13, fontWeight: 700 }}>
          {lead.status || "new"}
        </span>
      </div>
      {lead.email ? <div style={{ color: "var(--muted)", fontSize: 14 }}>{lead.email}</div> : null}
      {lead.phone ? <div style={{ color: "var(--muted)", fontSize: 14 }}>{lead.phone}</div> : null}
      <p title={lead.notes || ""} style={{ color: "var(--muted)", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {previewText(lead.notes)}
      </p>
      <form onSubmit={handleStatusChange} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input type="hidden" name="id" value={lead.id} />
        <select name="status" defaultValue={lead.status || "new"} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "inherit" }}>
          {statuses.map(s => <option key={s} value={s} style={{ color: "#000" }}>{s}</option>)}
        </select>
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "#fff", color: "#000", fontWeight: 700, cursor: "pointer" }}>Save</button>
      </form>
    </article>
  );
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.from("leads").select("id, full_name, email, phone, notes, status, created_at").order("created_at", { ascending: false });
    if (error) { setError(error.message); } else { setLeads((data ?? []) as Lead[]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <main className="container" style={{ padding: "64px 0" }}><p style={{ color: "var(--muted)" }}>Loading...</p></main>;
  if (error) return <main className="container" style={{ padding: "64px 0" }}><p style={{ color: "#f87171" }}>{error}</p></main>;

  const activeLeads = leads.filter(l => l.status !== "closed");
  const closedLeads = leads.filter(l => l.status === "closed");

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 28 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Leads</h1>
        <p style={{ color: "var(--muted)" }}>Active leads stay on top. Closed leads move to a separate section below.</p>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 24 }}>Active leads</h2>
          <span style={{ color: "var(--muted)" }}>{activeLeads.length}</span>
        </div>
        {activeLeads.length === 0 ? (
          <div style={{ padding: 16, borderRadius: 16, border: "1px solid var(--border)" }}>No active leads.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {activeLeads.map(lead => <LeadCard key={lead.id} lead={lead} onUpdate={load} />)}
          </div>
        )}
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 24 }}>Closed leads</h2>
          <span style={{ color: "var(--muted)" }}>{closedLeads.length}</span>
        </div>
        {closedLeads.length === 0 ? (
          <div style={{ padding: 16, borderRadius: 16, border: "1px solid var(--border)" }}>No closed leads.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {closedLeads.map(lead => <LeadCard key={lead.id} lead={lead} onUpdate={load} />)}
          </div>
        )}
      </section>
    </main>
  );
}
