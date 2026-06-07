import { createClient } from "@/lib/supabase/server";
import { createGoal, toggleGoalActive, updateGoal } from "./actions";

type Goal = {
  id: string;
  name: string | null;
  slug: string | null;
  short_description: string | null;
  position: number | null;
  is_active: boolean | null;
  created_at: string | null;
};

export default async function AdminGoalsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("goals")
    .select("id, name, slug, short_description, position, is_active, created_at")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const goals = (data ?? []) as Goal[];

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: 24 }}>
      <section style={{ display: "grid", gap: 8 }}>
        <p style={{ color: "var(--muted)" }}>Admin</p>
        <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Goals</h1>
        <p style={{ color: "var(--muted)", maxWidth: 720 }}>
          Manage studio goals using the existing Supabase goals table.
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
          <h2 style={{ fontSize: 24 }}>Create goal</h2>
          <p style={{ color: "var(--muted)" }}>
            Add a goal with name, slug, description, position, and active status.
          </p>
        </div>

        <form action={createGoal} style={{ display: "grid", gap: 12 }}>
          <label style={labelStyle}>
            <span>Name</span>
            <input name="name" required placeholder="Lead generation" style={fieldStyle} />
          </label>

          <label style={labelStyle}>
            <span>Slug</span>
            <input name="slug" required placeholder="lead-generation" style={fieldStyle} />
          </label>

          <label style={labelStyle}>
            <span>Short description</span>
            <textarea
              name="short_description"
              placeholder="Generate more qualified leads for your business."
              rows={4}
              style={{ ...fieldStyle, resize: "vertical" }}
            />
          </label>

          <label style={labelStyle}>
            <span>Position</span>
            <input name="position" type="number" defaultValue="0" style={fieldStyle} />
          </label>

          <label style={checkStyle}>
            <input name="is_active" type="checkbox" defaultChecked />
            <span>Active</span>
          </label>

          <button type="submit" style={primaryButtonStyle}>
            Create goal
          </button>
        </form>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <h2 style={{ fontSize: 24 }}>Existing goals</h2>
          <p style={{ color: "var(--muted)" }}>
            Edit current goal records without changing the working studio system.
          </p>
        </div>

        {goals.length === 0 ? (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 16,
            }}
          >
            No goals found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {goals.map((goal) => (
              <article
                key={goal.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 16,
                  display: "grid",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "grid", gap: 4 }}>
                    <strong style={{ fontSize: 18 }}>{goal.name || "Untitled goal"}</strong>
                    <span style={{ color: "var(--muted)", fontSize: 14 }}>
                      Slug: {goal.slug || "missing-slug"}
                    </span>
                    <span style={{ color: "var(--muted)", fontSize: 14 }}>
                      Position: {goal.position ?? 0}
                    </span>
                    <span style={{ color: "var(--muted)", fontSize: 13 }}>
                      {goal.created_at ? new Date(goal.created_at).toLocaleString() : ""}
                    </span>
                  </div>

                  <form action={toggleGoalActive}>
                    <input type="hidden" name="id" value={goal.id} />
                    <input
                      type="hidden"
                      name="current"
                      value={goal.is_active ? "true" : "false"}
                    />
                    <button type="submit" style={secondaryButtonStyle}>
                      {goal.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </div>

                <form action={updateGoal} style={{ display: "grid", gap: 12 }}>
                  <input type="hidden" name="id" value={goal.id} />

                  <label style={labelStyle}>
                    <span>Name</span>
                    <input
                      name="name"
                      required
                      defaultValue={goal.name ?? ""}
                      style={fieldStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    <span>Slug</span>
                    <input
                      name="slug"
                      required
                      defaultValue={goal.slug ?? ""}
                      style={fieldStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    <span>Short description</span>
                    <textarea
                      name="short_description"
                      defaultValue={goal.short_description ?? ""}
                      rows={4}
                      style={{ ...fieldStyle, resize: "vertical" }}
                    />
                  </label>

                  <label style={labelStyle}>
                    <span>Position</span>
                    <input
                      name="position"
                      type="number"
                      defaultValue={goal.position ?? 0}
                      style={fieldStyle}
                    />
                  </label>

                  <label style={checkStyle}>
                    <input
                      name="is_active"
                      type="checkbox"
                      defaultChecked={Boolean(goal.is_active)}
                    />
                    <span>Active</span>
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

const checkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
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

const secondaryButtonStyle: React.CSSProperties = {
  width: "fit-content",
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "inherit",
  fontWeight: 600,
};
