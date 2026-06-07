import { createClient } from "@/lib/supabase/server";
import { createService, updateService } from "./actions";

type Service = {
  id: string;
  slug: string | null;
  name: string | null;
  created_at: string | null;
};

export default async function AdminServicesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("id, slug, name, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const services = (data ?? []) as Service[];

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Services</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>
          Manage service records using only safe existing fields.
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
          <h2 style={{ fontSize: 24 }}>Create service</h2>
          <p style={{ color: "var(--muted)" }}>
            Add a new service with only name and slug.
          </p>
        </div>

        <form action={createService} style={{ display: "grid", gap: 12 }}>
          <label style={labelStyle}>
            <span>Name</span>
            <input name="name" required placeholder="Web Design" style={fieldStyle} />
          </label>

          <label style={labelStyle}>
            <span>Slug</span>
            <input name="slug" required placeholder="web-design" style={fieldStyle} />
          </label>

          <button type="submit" style={primaryButtonStyle}>
            Create service
          </button>
        </form>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={{ fontSize: 24 }}>Existing services</h2>
          <p style={{ color: "var(--muted)" }}>
            Edit current service records safely.
          </p>
        </div>

        {services.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 16,
            }}
          >
            No services found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {services.map((service) => (
              <article
                key={service.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 16,
                  display: "grid",
                  gap: 14,
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: 18 }}>{service.name || "Untitled service"}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>
                    Slug: {service.slug || "missing-slug"}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>
                    {service.created_at ? new Date(service.created_at).toLocaleString() : ""}
                  </span>
                </div>

                <form action={updateService} style={{ display: "grid", gap: 12 }}>
                  <input type="hidden" name="id" value={service.id} />

                  <label style={labelStyle}>
                    <span>Name</span>
                    <input
                      name="name"
                      required
                      defaultValue={service.name ?? ""}
                      style={fieldStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    <span>Slug</span>
                    <input
                      name="slug"
                      required
                      defaultValue={service.slug ?? ""}
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
