import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "./actions";

type SiteSettings = {
  id: string;
  site_name: string | null;
  site_tagline: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  default_theme_slug: string | null;
  updated_at: string | null;
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("id, site_name, site_tagline, contact_email, contact_whatsapp, default_theme_slug, updated_at")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const settings = data as SiteSettings | null;

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Settings</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>
          Update global site settings.
        </p>
      </section>

      {settings === null ? (
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 18,
            padding: 16,
          }}
        >
          No settings record found. Run the seed migration to create one.
        </div>
      ) : (
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
            <h2 style={{ fontSize: 24 }}>Site settings</h2>
            {settings.updated_at && (
              <p style={{ color: "var(--muted)", fontSize: 13 }}>
                Last updated: {new Date(settings.updated_at).toLocaleString()}
              </p>
            )}
          </div>

          <form action={updateSettings} style={{ display: "grid", gap: 12 }}>
            <input type="hidden" name="id" value={settings.id} />

            <label style={labelStyle}>
              <span>Site Name</span>
              <input
                name="site_name"
                required
                defaultValue={settings.site_name ?? ""}
                placeholder="Adil Studio"
                style={fieldStyle}
              />
            </label>

            <label style={labelStyle}>
              <span>Site Tagline</span>
              <input
                name="site_tagline"
                defaultValue={settings.site_tagline ?? ""}
                placeholder="Adaptive Digital Studio"
                style={fieldStyle}
              />
            </label>

            <label style={labelStyle}>
              <span>Contact Email</span>
              <input
                name="contact_email"
                type="email"
                defaultValue={settings.contact_email ?? ""}
                placeholder="hello@example.com"
                style={fieldStyle}
              />
            </label>

            <label style={labelStyle}>
              <span>Contact WhatsApp</span>
              <input
                name="contact_whatsapp"
                defaultValue={settings.contact_whatsapp ?? ""}
                placeholder="+91XXXXXXXXXX"
                style={fieldStyle}
              />
            </label>

            <label style={labelStyle}>
              <span>Default Theme Slug</span>
              <input
                name="default_theme_slug"
                defaultValue={settings.default_theme_slug ?? ""}
                placeholder="obsidian-neon"
                style={fieldStyle}
              />
            </label>

            <button type="submit" style={primaryButtonStyle}>
              Save settings
            </button>
          </form>
        </section>
      )}
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
