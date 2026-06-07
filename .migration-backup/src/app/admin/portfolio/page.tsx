import { createClient } from "@/lib/supabase/server";
import { createPortfolioItem, updatePortfolioItem } from "./actions";

type PortfolioItem = {
  id: string;
  slug: string | null;
  title: string | null;
  created_at: string | null;
};

export default async function AdminPortfolioPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_items")
    .select("id, slug, title, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []) as PortfolioItem[];

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Portfolio</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>
          Manage portfolio records.
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
          <h2 style={{ fontSize: 24 }}>Create portfolio item</h2>
          <p style={{ color: "var(--muted)" }}>
            Add a new portfolio item with a title and slug.
          </p>
        </div>

        <form action={createPortfolioItem} style={{ display: "grid", gap: 12 }}>
          <label style={labelStyle}>
            <span>Title</span>
            <input name="title" required placeholder="Case Study One" style={fieldStyle} />
          </label>

          <label style={labelStyle}>
            <span>Slug</span>
            <input name="slug" required placeholder="case-study-one" style={fieldStyle} />
          </label>

          <button type="submit" style={primaryButtonStyle}>
            Create portfolio item
          </button>
        </form>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={{ fontSize: 24 }}>Existing portfolio items</h2>
          <p style={{ color: "var(--muted)" }}>
            Edit current portfolio records.
          </p>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 16,
            }}
          >
            No portfolio items found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((item) => (
              <article
                key={item.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 16,
                  display: "grid",
                  gap: 14,
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: 18 }}>{item.title || "Untitled portfolio item"}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>
                    Slug: {item.slug || "missing-slug"}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>
                    {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                  </span>
                </div>

                <form action={updatePortfolioItem} style={{ display: "grid", gap: 12 }}>
                  <input type="hidden" name="id" value={item.id} />

                  <label style={labelStyle}>
                    <span>Title</span>
                    <input
                      name="title"
                      required
                      defaultValue={item.title ?? ""}
                      style={fieldStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    <span>Slug</span>
                    <input
                      name="slug"
                      required
                      defaultValue={item.slug ?? ""}
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
