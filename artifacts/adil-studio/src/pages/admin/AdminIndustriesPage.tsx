import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Industry = {
  id: string;
  slug: string | null;
  name: string | null;
  short_description: string | null;
  position: number | null;
  is_active: boolean | null;
  created_at: string | null;
};

const labelStyle: React.CSSProperties = { display: "grid", gap: 6 };
const fieldStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border)", background: "transparent", color: "inherit" };
const checkStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 };
const primaryBtn: React.CSSProperties = { width: "fit-content", padding: "14px 18px", borderRadius: 14, border: "1px solid var(--border)", background: "#fff", color: "#000", fontWeight: 700, cursor: "pointer" };
const secondaryBtn: React.CSSProperties = { width: "fit-content", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "inherit", fontWeight: 600, cursor: "pointer" };

export default function AdminIndustriesPage() {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.from("industries").select("id, slug, name, short_description, position, is_active, created_at").order("position", { ascending: true }).order("created_at", { ascending: true });
    if (error) { setError(error.message); } else { setItems((data ?? []) as Industry[]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("industries").insert({
      name: String(fd.get("name") || "").trim(),
      slug: String(fd.get("slug") || "").trim(),
      short_description: String(fd.get("short_description") || "").trim() || null,
      position: Number(fd.get("position") || 0),
      is_active: fd.get("is_active") === "on",
    });
    if (error) { alert(error.message); return; }
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const id = String(fd.get("id"));
    const { error } = await supabase.from("industries").update({
      name: String(fd.get("name") || "").trim(),
      slug: String(fd.get("slug") || "").trim(),
      short_description: String(fd.get("short_description") || "").trim() || null,
      position: Number(fd.get("position") || 0),
      is_active: fd.get("is_active") === "on",
    }).eq("id", id);
    if (error) { alert(error.message); return; }
    load();
  }

  async function handleToggle(id: string, current: boolean) {
    const { error } = await supabase.from("industries").update({ is_active: !current }).eq("id", id);
    if (error) { alert(error.message); return; }
    load();
  }

  if (loading) return <main className="container" style={{ padding: "64px 0" }}><p style={{ color: "var(--muted)" }}>Loading...</p></main>;
  if (error) return <main className="container" style={{ padding: "64px 0" }}><p style={{ color: "#f87171" }}>{error}</p></main>;

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Industries</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>Manage studio industries using the existing Supabase industries table.</p>
      </section>

      <section style={{ border: "1px solid var(--border)", borderRadius: 20, padding: 16, display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={{ fontSize: 24 }}>Create industry</h2>
        </div>
        <form onSubmit={handleCreate} style={{ display: "grid", gap: 12 }}>
          <label style={labelStyle}><span>Name</span><input name="name" required placeholder="Technology" style={fieldStyle} /></label>
          <label style={labelStyle}><span>Slug</span><input name="slug" required placeholder="technology" style={fieldStyle} /></label>
          <label style={labelStyle}><span>Short description</span><textarea name="short_description" rows={4} style={{ ...fieldStyle, resize: "vertical" }} /></label>
          <label style={labelStyle}><span>Position</span><input name="position" type="number" defaultValue="0" style={fieldStyle} /></label>
          <label style={checkStyle}><input name="is_active" type="checkbox" defaultChecked /><span>Active</span></label>
          <button type="submit" style={primaryBtn}>Create industry</button>
        </form>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ fontSize: 24 }}>Existing industries</h2>
        {items.length === 0 ? (
          <div style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 16 }}>No industries found.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map(item => (
              <article key={item.id} style={{ border: "1px solid var(--border)", borderRadius: 18, padding: 16, display: "grid", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong style={{ fontSize: 18 }}>{item.name || "Untitled"}</strong>
                    <span style={{ color: "var(--muted)", fontSize: 14 }}>Slug: {item.slug || "missing-slug"}</span>
                    <span style={{ color: "var(--muted)", fontSize: 13 }}>{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</span>
                  </div>
                  <button onClick={() => handleToggle(item.id, Boolean(item.is_active))} style={secondaryBtn}>
                    {item.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
                <form onSubmit={handleUpdate} style={{ display: "grid", gap: 12 }}>
                  <input type="hidden" name="id" value={item.id} />
                  <label style={labelStyle}><span>Name</span><input name="name" required defaultValue={item.name ?? ""} style={fieldStyle} /></label>
                  <label style={labelStyle}><span>Slug</span><input name="slug" required defaultValue={item.slug ?? ""} style={fieldStyle} /></label>
                  <label style={labelStyle}><span>Short description</span><textarea name="short_description" defaultValue={item.short_description ?? ""} rows={4} style={{ ...fieldStyle, resize: "vertical" }} /></label>
                  <label style={labelStyle}><span>Position</span><input name="position" type="number" defaultValue={item.position ?? 0} style={fieldStyle} /></label>
                  <label style={checkStyle}><input name="is_active" type="checkbox" defaultChecked={Boolean(item.is_active)} /><span>Active</span></label>
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
