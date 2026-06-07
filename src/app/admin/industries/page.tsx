import { createClient } from "@/lib/supabase/server";
import { createIndustry, updateIndustry } from "./actions";

type Industry = {
  id: string;
  slug: string | null;
  name: string | null;
  created_at: string | null;
};

export default async function AdminIndustriesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("industries")
    .select("id, slug, name, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const industries = (data ?? []) as Industry[];

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Industries</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>
          Manage industry records using only safe existing fields.
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
          <h2 style={{ fontSize: 24 }}>Create industry</h2>
          <p style={{ color: "var(--muted)" }}>
            Add a new industry with only name and slug.
          </p>
        </div>

        <form action={createIndustry} style={{ display: "grid", gap: 12 }}>
          <label style={labelStyle}>
            <span>Name</span>
            <input name="name" required placeholder="SaaS" style={fieldStyle} />
          </label>

          <label style={labelStyle}>
            <span>Slug</span>
            <input name="slug" required placeholder="saas" style={fieldStyle} />
          </label>

          <button type="submit" style={primaryButtonStyle}>
            Create industry
          </button>
        </form>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={{ fontSize: 24 }}>Existing industries</h2>
          <p style={{ color: "var(--muted)" }}>
            Edit current industry records safely.
          </p>
        </div>

        {industries.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 16,
            }}
          >
            No industries found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {industries.map((industry) => (
              <article
                key={industry.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 16,
                  display: "grid",
                  gap: 14,
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: 18 }}>{industry.name || "Untitled industry"}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>
                    Slug: {industry.slug || "missing-slug"}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>
                    {industry.created_at ? new Date(industry.created_at).toLocaleString() : ""}
                  </span>
                </div>

                <form action={updateIndustry} style={{ display: "grid", gap: 12 }}>
                  <input type="hidden" name="id" value={industry.id} />

                  <label style={labelStyle}>
                    <span>Name</span>
                    <input
                      name="name"
                      required
                      defaultValue={industry.name ?? ""}
                      style={fieldStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    <span>Slug</span>
                    <input
                      name="slug"
                      required
                      defaultValue={industry.slug ?? ""}
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
