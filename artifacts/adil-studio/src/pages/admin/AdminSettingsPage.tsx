import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Setting = { id: string; key: string | null; value: string | null; created_at: string | null; };

const labelStyle: React.CSSProperties = { display: "grid", gap: 6 };
const fieldStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border)", background: "transparent", color: "inherit" };
const textareaStyle: React.CSSProperties = { ...fieldStyle, resize: "vertical" };
const primaryBtn: React.CSSProperties = { width: "fit-content", padding: "14px 18px", borderRadius: 14, border: "1px solid var(--border)", background: "#fff", color: "#000", fontWeight: 700, cursor: "pointer" };

export default function AdminSettingsPage() {
  const [items, setItems] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.from("settings").select("id, key, value, created_at").order("created_at", { ascending: true });
    if (error) { setError(error.message); } else { setItems((data ?? []) as Setting[]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("settings").update({ key: String(fd.get("key") || "").trim(), value: String(fd.get("value") || "").trim() || null }).eq("id", String(fd.get("id")));
    if (error) { alert(error.message); return; }
    load();
  }

  if (loading) return <main className="container" style={{ padding: "64px 0" }}><p style={{ color: "var(--muted)" }}>Loading...</p></main>;
  if (error) return <main className="container" style={{ padding: "64px 0" }}><p style={{ color: "#f87171" }}>{error}</p></main>;

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Settings</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>Update existing settings using safe existing fields only.</p>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ fontSize: 24 }}>Existing settings</h2>
        {items.length === 0 ? <div style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 16 }}>No settings found.</div> : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map(item => (
              <article key={item.id} style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 16, display: "grid", gap: 14 }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: 18 }}>{item.key || "Untitled setting"}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>Value: {item.value || ""}</span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</span>
                </div>
                <form onSubmit={handleUpdate} style={{ display: "grid", gap: 12 }}>
                  <input type="hidden" name="id" value={item.id} />
                  <label style={labelStyle}><span>Key</span><input name="key" required defaultValue={item.key ?? ""} style={fieldStyle} /></label>
                  <label style={labelStyle}><span>Value</span><textarea name="value" defaultValue={item.value ?? ""} style={textareaStyle} rows={4} /></label>
                  <button type="submit" style={primaryBtn}>Save setting</button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
