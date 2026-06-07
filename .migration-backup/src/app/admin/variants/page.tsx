import { createClient } from "@/lib/supabase/server";
import { createVariant, updateVariant } from "./actions";

type Variant = {
  id: string;
  slug: string | null;
  hero_heading: string | null;
  created_at: string | null;
};

type Goal = {
  id: string;
  name: string;
};

type Industry = {
  id: string;
  name: string;
};

export default async function AdminVariantsPage() {
  const supabase = await createClient();

  const [variantsResult, goalsResult, industriesResult] = await Promise.all([
    supabase
      .from("studio_variants")
      .select("id, slug, hero_heading, created_at")
      .order("created_at", { ascending: true }),
    supabase
      .from("goals")
      .select("id, name")
      .eq("is_active", true)
      .order("position", { ascending: true }),
    supabase
      .from("industries")
      .select("id, name")
      .eq("is_active", true)
      .order("position", { ascending: true }),
  ]);

  if (variantsResult.error) throw new Error(variantsResult.error.message);
  if (goalsResult.error) throw new Error(goalsResult.error.message);
  if (industriesResult.error) throw new Error(industriesResult.error.message);

  const variants = (variantsResult.data ?? []) as Variant[];
  const goals = (goalsResult.data ?? []) as Goal[];
  const industries = (industriesResult.data ?? []) as Industry[];

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Variants</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>
          Manage studio variants. Each variant maps a goal and industry to a unique page experience.
        </p>
      </section>

      <section
        style={{
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 16,
          display: "grid",
          gap: 14,
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={{ fontSize: 24 }}>Create variant</h2>
          <p style={{ color: "var(--muted)" }}>
            Add a new variant by selecting a goal, industry, and providing a hero heading and slug.
          </p>
        </div>

        <form action={createVariant} style={{ display: "grid", gap: 12 }}>
          <label style={labelStyle}>
            <span>Goal</span>
            <select name="goal_id" required style={fieldStyle}>
              <option value="">Select a goal…</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            <span>Industry</span>
            <select name="industry_id" required style={fieldStyle}>
              <option value="">Select an industry…</option>
              {industries.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            <span>Hero Heading</span>
            <input name="hero_heading" required placeholder="A site built to convert attention into leads." style={fieldStyle} />
          </label>

          <label style={labelStyle}>
            <span>Slug</span>
            <input name="slug" required placeholder="get-clients-startup" style={fieldStyle} />
          </label>

          <button type="submit" style={primaryButtonStyle}>
            Create variant
          </button>
        </form>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={{ fontSize: 24 }}>Existing variants</h2>
          <p style={{ color: "var(--muted)" }}>
            Edit the slug and hero heading of existing variants.
          </p>
        </div>

        {variants.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 16,
            }}
          >
            No variants found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {variants.map((variant) => (
              <article
                key={variant.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 16,
                  display: "grid",
                  gap: 14,
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: 18 }}>{variant.hero_heading || "Untitled variant"}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>
                    Slug: {variant.slug || "missing-slug"}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>
                    {variant.created_at ? new Date(variant.created_at).toLocaleString() : ""}
                  </span>
                </div>

                <form action={updateVariant} style={{ display: "grid", gap: 12 }}>
                  <input type="hidden" name="id" value={variant.id} />

                  <label style={labelStyle}>
                    <span>Hero Heading</span>
                    <input
                      name="hero_heading"
                      required
                      defaultValue={variant.hero_heading ?? ""}
                      style={fieldStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    <span>Slug</span>
                    <input
                      name="slug"
                      required
                      defaultValue={variant.slug ?? ""}
                      style={fieldStyle}
                    />
                  </label>

                  <button type="submit" style={primaryButtonStyle}>
                    Save changes
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "inherit",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "fit-content",
  padding: "14px 18px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "#fff",
  color: "#000",
  fontWeight: 700,
};
