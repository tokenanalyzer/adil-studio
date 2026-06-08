type FooterProps = {
  siteName?: string | null;
  siteTagline?: string | null;
  contactEmail?: string | null;
};

export default function Footer({
  siteName = "Adil Studio",
  siteTagline = "Adaptive Digital Studio",
  contactEmail,
}: FooterProps) {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "32px 0",
        marginTop: "80px",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          color: "var(--muted)",
          fontSize: "13px",
        }}
      >
        <span>
          © {new Date().getFullYear()} {siteName}
        </span>
        <span>{siteTagline}</span>
        {contactEmail && (
          <a
            href={`mailto:${contactEmail}`}
            style={{ color: "var(--muted)" }}
          >
            {contactEmail}
          </a>
        )}
      </div>
    </footer>
  );
}
