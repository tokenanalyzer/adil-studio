export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <div className="container" style={{ padding: "32px 0" }}>
        <div style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
          <strong>Adil Studio Admin</strong>
        </div>
        {children}
      </div>
    </div>
  );
}
