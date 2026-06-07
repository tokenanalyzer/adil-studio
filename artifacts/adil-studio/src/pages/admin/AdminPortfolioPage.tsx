import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PortfolioItem = { id: string; slug: string | null; name: string | null; created_at: string | null; };

const labelStyle: React.CSSProperties = { display: "grid", gap: 6 };
const fieldStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border)", background: "transparent", color: "inherit" };
const primaryBtn: React.CSSProperties = { width: "fit-content", padding: "14px 18px", borderRadius: 14, border: "1px solid var(--border)", background: "#fff", color: "#000", fontWeight: 700, cursor: "pointer" };

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.from("portfolio").select("id, slug, name, created_at").order("created_at", { ascending: true });
    if (error) { setError(error.message); } else { setItems((data ?? []) as PortfolioItem[]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("portfolio").insert({ name: String(fd.get("name") || "").trim(), slug: String(fd.get("slug") || "").trim() });
    if (error) { alert(error.message); return; }
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("portfolio").update({ name: String(fd.get("name") || "").trim(), slug: String(fd.get("slug") || "").trim() }).eq("id", String(fd.get("id")));
    if (error) { alert(error.message); return; }
    load();
  }

  if (loading) return <main className="container" style={{ padding: "64px 0" }}><p style={{ color: "var(--muted)" }}>Loading...</p></main>;
  if (error) return <main className="container" style={{ padding: "64px 0" }}><p style={{ color: "#f87171" }}>{error}</p></main>;

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Portfolio</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>Manage portfolio records using only safe existing fields.</p>
      </section>

      <section style={{ border: "1px solid var(--border)", borderRadius: 20, padding: 16, display: "grid", gap: 14 }}>
        <h2 style={{ fontSize: 24 }}>Create portfolio item</h2>
        <form onSubmit={handleCreate} style={{ display: "grid", gap: 12 }}>
          <label style={labelStyle}><span>Name</span><input name="name" required placeholder="Case Study One" style={fieldStyle} /></label>
          <label style={labelStyle}><span>Slug</span><input name="slug" required placeholder="case-study-one" style={fieldStyle} /></label>
          <button type="submit" style={primaryBtn}>Create portfolio item</button>
        </form>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ fontSize: 24 }}>Existing portfolio items</h2>
        {items.length === 0 ? <div style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 16 }}>No portfolio items found.</div> : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map(item => (
              <article key={item.id} style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 16, display: "grid", gap: 14 }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: 18 }}>{item.name || "Untitled"}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>Slug: {item.slug || "missing-slug"}</span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</span>
                </div>
                <form onSubmit={handleUpdate} style={{ display: "grid", gap: 12 }}>
                  <input type="hidden" name="id" value={item.id} />
                  <label style={labelStyle}><span>Name</span><input name="name" required defaultValue={item.name ?? ""} style={fieldStyle} /></label>
                  <label style={labelStyle}><span>Slug</span><input name="slug" required defaultValue={item.slug ?? ""} style={fieldStyle} /></label>
                  <button type="submit" style={primaryBtn}>Save changes</button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
