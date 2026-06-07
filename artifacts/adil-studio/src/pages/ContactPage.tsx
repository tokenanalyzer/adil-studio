import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

const fieldStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "inherit",
  width: "100%",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "#fff",
  color: "#000",
  fontWeight: 700,
  width: "fit-content",
  cursor: "pointer",
};

export default function ContactPage() {
  const [, setLocation] = useLocation();
  const [success, setSuccess] = useState(() => {
    return new URLSearchParams(window.location.search).get("success") === "1";
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const { error: dbError } = await supabase.from("leads").insert({
      full_name: name,
      email: email || null,
      phone: phone || null,
      company_name: company || null,
      notes: message,
      source: "contact_form",
      status: "new",
    });

    if (dbError) {
      setError(dbError.message);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setLocation("/contact?success=1");
  }

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
          <div style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border)", background: "rgba(255,255,255,0.04)" }}>
            Lead captured successfully.
          </div>
        ) : null}

        {error ? (
          <div style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(255,80,80,0.4)", background: "rgba(255,80,80,0.06)", color: "#f87171" }}>
            Error: {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
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
          <button type="submit" disabled={submitting} style={buttonStyle}>
            {submitting ? "Submitting..." : "Submit inquiry"}
          </button>
        </form>
      </div>
    </main>
  );
}
