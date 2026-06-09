import Link from "next/link";

export default function Nav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(4, 6, 13, 0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "58px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 800,
            fontSize: "15px",
            letterSpacing: "-0.03em",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "var(--accent, #3b82f6)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              transition: "background 0.5s ease",
            }}
          >
            AS
          </span>
          Adil Studio
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/contact"
            style={{
              background: "var(--accent, #3b82f6)",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              transition: "background 0.5s ease, opacity 0.2s ease",
            }}
          >
            Start Project →
          </Link>
        </nav>
      </div>
    </header>
  );
}
