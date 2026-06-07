import { submitLead } from "./submitLead";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const success = params?.success === "1";

  return (
    <main className="container" style={{ padding: "64px 0" }}>
      <div style={{ maxWidth: 720, display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ color: "var(--muted)" }}>Contact</p>
          <h1 style={{ fontSize: "42px", lineHeight: 1.1 }}>Tell us what you need</h1>
          <p style={{ color: "var(--muted)", maxWidth: 640 }}>
            Share your goal and business details. We will save this as a lead.
          </p>
        </div>

        {success ? (
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            Lead captured successfully.
          </div>
        ) : null}

        <form action={submitLead} style={{ display: "grid", gap: 14 }}>
          <input name="name" placeholder="Your name" required style={fieldStyle} />
          <input name="email" type="email" placeholder="Email address" style={fieldStyle} />
          <input name="phone" placeholder="Phone number" style={fieldStyle} />
          <input name="company" placeholder="Company / brand" style={fieldStyle} />
          <textarea
            name="message"
            placeholder="What are you trying to launch, fix, or grow?"
            rows={6}
            required
            style={{ ...fieldStyle, resize: "vertical" }}
          />
          <button type="submit" style={buttonStyle}>
            Submit inquiry
          </button>
        </form>
      </div>
    </main>
  );
}

const fieldStyle = {
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "inherit",
} satisfies React.CSSProperties;

const buttonStyle = {
  padding: "14px 18px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "#fff",
  color: "#000",
  fontWeight: 700,
  width: "fit-content",
} satisfies React.CSSProperties;
