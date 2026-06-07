import { Link } from "wouter";

export default function NotFoundPage() {
  return (
    <main className="container" style={{ padding: "64px 0" }}>
      <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>404</h1>
      <p style={{ color: "var(--muted)", marginBottom: "24px" }}>Page not found.</p>
      <Link href="/" style={{ border: "1px solid var(--border)", padding: "12px 18px", borderRadius: "12px" }}>
        Go home
      </Link>
    </main>
  );
}
