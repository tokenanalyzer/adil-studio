import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { supabase } from "@/lib/supabase";

type BlockItem = { label?: string; value?: string; title?: string; text?: string; };
type Block = { id: string; block_key: string; block_type: string; label?: string; content?: { items?: BlockItem[] }; };

type Variant = {
  id: string;
  hero_kicker: string | null;
  hero_heading: string | null;
  hero_subheading: string | null;
};

function StatsBlock({ block }: { block: Block }) {
  const items = block.content?.items ?? [];
  return (
    <section style={{ display: "grid", gap: "12px" }}>
      <h2 style={{ fontSize: "24px" }}>{block.label}</h2>
      <div style={{ display: "grid", gap: "12px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "16px", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "6px" }}>{item.label}</div>
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
        {items.map((item, i) => (
          <div key={i} style={{ padding: "18px", border: "1px solid var(--border)", borderRadius: "16px" }}>
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
        {items.map((item, i) => (
          <div key={i} style={{ padding: "18px", border: "1px solid var(--border)", borderRadius: "16px" }}>
            <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "6px" }}>Step {i + 1}</div>
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
    <section style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "16px" }}>
      <strong>{block.label || block.block_key}</strong>
    </section>
  );
}

export default function StudioVariantPage() {
  const params = useParams<{ goal: string; industry: string }>();
  const [variant, setVariant] = useState<Variant | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: variantData, error: variantError } = await supabase
        .from("studio_variants")
        .select("id, hero_kicker, hero_heading, hero_subheading, goals!inner(slug), industries!inner(slug)")
        .eq("is_published", true)
        .eq("goals.slug", params.goal)
        .eq("industries.slug", params.industry)
        .maybeSingle();

      if (variantError || !variantData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setVariant(variantData as unknown as Variant);

      const { data: blocksData } = await supabase
        .from("content_blocks")
        .select("*")
        .eq("variant_id", variantData.id)
        .eq("is_enabled", true)
        .order("position", { ascending: true });

      setBlocks((blocksData ?? []) as Block[]);
      setLoading(false);
    }
    load();
  }, [params.goal, params.industry]);

  if (loading) return <main className="container" style={{ padding: "64px 0" }}><p style={{ color: "var(--muted)" }}>Loading...</p></main>;
  if (notFound) return <main className="container" style={{ padding: "64px 0" }}><h1>404 — Variant not found</h1></main>;
  if (!variant) return null;

  return (
    <main className="container" style={{ padding: "64px 0", display: "grid", gap: "24px" }}>
      <section style={{ display: "grid", gap: "12px" }}>
        <p style={{ color: "var(--muted)" }}>{variant.hero_kicker}</p>
        <h1 style={{ fontSize: "42px", marginBottom: "4px" }}>{variant.hero_heading}</h1>
        <p style={{ color: "var(--muted)", maxWidth: "760px" }}>{variant.hero_subheading}</p>
      </section>

      {blocks.length === 0 ? (
        <div style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "16px" }}>
          <strong>No content blocks yet.</strong>
        </div>
      ) : (
        blocks.map(block => <RenderBlock key={block.id} block={block} />)
      )}
    </main>
  );
}
