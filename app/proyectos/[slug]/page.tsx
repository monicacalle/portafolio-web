import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ArrowLeft } from "lucide-react";
import vibe from "@/public/images/vibe.png";
import voluntee from "@/public/images/voluntee.png";

// Structural (non-copy) data per case study — image + full-deck PDF.
const MEDIA: Record<string, { image: StaticImageData; pdf: string }> = {
  vibe: { image: vibe, pdf: "/assets/vibe-app-memoria.pdf" },
  voluntee: { image: voluntee, pdf: "/assets/voluntee-app-slides.pdf" },
};

// Only case studies that have written content are pre-rendered; others 404.
export function generateStaticParams() {
  return [{ slug: "vibe" }, { slug: "voluntee" }];
}

type CaseStudy = {
  title: string;
  tagline: string;
  meta: { role: string; year: string; type: string; platform: string };
  overview: { product: string; role: string; audience: string; challenge: string; limitations: string };
  sections: { heading: string; body: string }[];
  stats?: { value: string; label: string }[];
};

async function loadCase(slug: string) {
  const t = await getTranslations("caseStudies");
  // next-intl's server translator types `.raw()` against inferred message keys,
  // which the arrays in this namespace confuse — read it through a string accessor.
  const raw = t.raw as (key: string) => unknown;
  const items = raw("items") as Record<string, CaseStudy>;
  const cs = items?.[slug];
  const media = MEDIA[slug];
  if (!cs || !media) return null;
  return { cs, media, ui: raw("ui") as CaseStudyUi };
}

type CaseStudyUi = {
  back: string;
  eyebrow: string;
  overview: Record<keyof CaseStudy["overview"], string>;
  meta: Record<keyof CaseStudy["meta"], string>;
  cta: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadCase(slug);
  if (!data) return {};
  const { cs } = data;
  return {
    title: `${cs.title} — ${cs.tagline}`,
    description: cs.overview.product,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadCase(slug);
  if (!data) notFound();
  const { cs, media, ui } = data;

  const overviewRows = (["product", "role", "audience", "challenge", "limitations"] as const).map(
    (key) => ({ label: ui.overview[key], value: cs.overview[key] }),
  );
  const metaRows = (["role", "year", "type", "platform"] as const).map((key) => ({
    label: ui.meta[key],
    value: cs.meta[key],
  }));

  return (
    <>
      <Header />
      <main className="cs">
        <div className="cs__shell shell">
          <Link className="cs__back" href="/#projects" data-cursor="←">
            <ArrowLeft className="cs__back-icon" size={14} />
            {ui.back}
          </Link>

          <header className="cs__head">
            <p className="eyebrow">{ui.eyebrow}</p>
            <h1 className="cs__title serif">{cs.title}</h1>
            <p className="cs__tagline">{cs.tagline}</p>
          </header>

          <dl className="cs__meta">
            {metaRows.map((m) => (
              <div key={m.label} className="cs__meta-item">
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="cs__hero">
            <Image src={media.image} alt={cs.title} sizes="(max-width: 900px) 100vw, 72rem" placeholder="blur" priority />
          </div>

          <dl className="cs__overview">
            {overviewRows.map((row) => (
              <div key={row.label} className="cs__overview-item">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          {cs.stats && cs.stats.length > 0 && (
            <div className="cs__stats">
              {cs.stats.map((s) => (
                <div key={s.label} className="cs__stat">
                  <span className="cs__stat-value serif">{s.value}</span>
                  <span className="cs__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="cs__body">
            {cs.sections.map((sec) => (
              <section key={sec.heading} className="cs__section">
                <h2 className="cs__section-title">{sec.heading}</h2>
                <p className="cs__section-body">{sec.body}</p>
              </section>
            ))}
          </div>

          <div className="cs__foot">
            <Link className="cs__back cs__back--foot" href="/#projects">
              <ArrowLeft className="cs__back-icon" size={14} />
              {ui.back}
            </Link>
            <a className="btn btn--solid" href={media.pdf} target="_blank" rel="noopener noreferrer" data-cursor="PDF">
              {ui.cta}
            </a>
          </div>
        </div>
      </main>
      <div className="contact" style={{ overflow: "hidden" }}>
        <Footer />
      </div>
    </>
  );
}
