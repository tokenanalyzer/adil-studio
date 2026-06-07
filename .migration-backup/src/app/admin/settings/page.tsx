import { createClient } from "@/lib/supabase/server";
import { updateSetting } from "./actions";

type Setting = {
  id: string;
  key: string | null;
  value: string | null;
  created_at: string | null;
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings")
    .select("id, key, value, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const settings = (data ?? []) as Setting[];

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Settings</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>
          Update existing settings using safe existing fields only.
        </p>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={{ fontSize: 24 }}>Existing settings</h2>
          <p style={{ color: "var(--muted)" }}>
            Edit key and value pairs currently stored in the database.
          </p>
        </div>

        {settings.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 16,
            }}
          >
            No settings found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {settings.map((setting) => (
              <article
                key={setting.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 16,
                  display: "grid",
                  gap: 14,
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: 18 }}>{setting.key || "Untitled setting"}</strong>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>
                    Value: {setting.value || ""}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: 13 }}>
                    {setting.created_at ? new Date(setting.created_at).toLocaleString() : ""}
                  </span>
                </div>

                <form action={updateSetting} style={{ display: "grid", gap: 12 }}>
                  <input type="hidden" name="id" value={setting.id} />

                  <label style={labelStyle}>
                    <span>Key</span>
                    <input
                      name="key"
                      required
                      defaultValue={setting.key ?? ""}
                      style={fieldStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    <span>Value</span>
                    <textarea
                      name="value"
                      defaultValue={setting.value ?? ""}
                      style={textareaStyle}
                      rows={4}
                    />
                  </label>

                  <button type="submit" style={primaryButtonStyle}>
                    Save setting
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

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "inherit",
  resize: "vertical",
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
