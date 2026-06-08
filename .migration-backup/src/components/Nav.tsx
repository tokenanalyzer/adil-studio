import Link from "next/link";

export default function Nav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid var(--border)",
        background: "rgba(5, 7, 11, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          Adil Studio
        </Link>
        <Link
          href="/contact"
          style={{
            background: "var(--primary)",
            color: "#fff",
            padding: "8px 20px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Start Project
        </Link>
      </div>
    </header>
  );
}
