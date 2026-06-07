import { notFound } from "next/navigation";
import { getPublishedVariant, getVariantBlocks } from "@/lib/cms/public";

type PageProps = {
  params: Promise<{
    goal: string;
    industry: string;
  }>;
};

type BlockItem = {
  label?: string;
  value?: string;
  title?: string;
  text?: string;
};

type Block = {
  id: string;
  block_key: string;
  block_type: string;
  label?: string;
  content?: {
    items?: BlockItem[];
  };
};

function StatsBlock({ block }: { block: Block }) {
  const items = block.content?.items ?? [];

  return (
    <section style={{ display: "grid", gap: "12px" }}>
      <h2 style={{ fontSize: "24px" }}>{block.label}</h2>
      <div style={{ display: "grid", gap: "12px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "16px",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "6px" }}>
              {item.label}
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CardsBlock({ block }: { block: Block }) {
  const items = block.content?.items ?? [];

  return (
    <section style={{ display: "grid", gap: "12px" }}>
      <h2 style={{ fontSize: "24px" }}>{block.label}</h2>
      <div style={{ display: "grid", gap: "12px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "18px",
              border: "1px solid var(--border)",
              borderRadius: "16px",
            }}
          >
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{item.title}</h3>
            <p style={{ color: "var(--muted)" }}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StepsBlock({ block }: { block: Block }) {
  const items = block.content?.items ?? [];

  return (
    <section style={{ display: "grid", gap: "12px" }}>
      <h2 style={{ fontSize: "24px" }}>{block.label}</h2>
      <div style={{ display: "grid", gap: "12px" }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "18px",
              border: "1px solid var(--border)",
              borderRadius: "16px",
            }}
          >
            <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "6px" }}>
              Step {index + 1}
            </div>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{item.title}</h3>
            <p style={{ color: "var(--muted)" }}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RenderBlock({ block }: { block: Block }) {
  if (block.block_type === "stats") return <StatsBlock block={block} />;
  if (block.block_type === "cards") return <CardsBlock block={block} />;
  if (block.block_type === "steps") return <StepsBlock block={block} />;

  return (
    <section
      style={{
        padding: "20px",
        border: "1px solid var(--border)",
        borderRadius: "16px",
      }}
    >
      <strong>{block.label || block.block_key}</strong>
    </section>
  );
}

export default async function StudioVariantPage({ params }: PageProps) {
  const { goal, industry } = await params;
  const variant = await getPublishedVariant(goal, industry);

  if (!variant) notFound();

  const blocks = (await getVariantBlocks(variant.id)) as Block[];

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: "24px" }}>
      <section style={{ display: "grid", gap: "12px" }}>
        <p style={{ color: "var(--muted)" }}>{variant.hero_kicker}</p>
        <h1 style={{ fontSize: "42px", marginBottom: "4px" }}>{variant.hero_heading}</h1>
        <p style={{ color: "var(--muted)", maxWidth: "760px" }}>{variant.hero_subheading}</p>
      </section>

      {blocks.length === 0 ? (
        <div
          style={{
            padding: "20px",
            border: "1px solid var(--border)",
            borderRadius: "16px",
          }}
        >
          <strong>No content blocks yet.</strong>
        </div>
      ) : (
        blocks.map((block) => <RenderBlock key={block.id} block={block} />)
      )}
    </main>
  );
}
