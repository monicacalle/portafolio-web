import Image, { type StaticImageData } from "next/image";
// Locale-aware Link: the plain next/link one drops the locale, so an English
// visitor clicking through landed back in Spanish.
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";
import { SplitText } from "./split-text";
import { Magnetic } from "./magnetic";
import { Marquee } from "./marquee";
import { Footer } from "./footer";
import { PERSON } from "@/lib/site";
import { GRAFICO_ROUTE } from "@/lib/case-studies";
import about from "@/public/images/about.png";
import vibe from "@/public/images/vibe.png";
import voluntee from "@/public/images/voluntee.png";
import raiz from "@/public/images/mockupraiz.png";
import isa from "@/public/images/mockupisa.png";
import grafico from "@/public/images/portafolioabierto.png";
import luxeestate from "@/public/images/luxeestate.png";
import selvatica from "@/public/assets/selvaticamockup.webp";

/* =========================================================================
   About
   ========================================================================= */
export function About() {
  const t = useTranslations("about");
  return (
    <section id="about" className="section about shell">
      <Reveal as="p" className="eyebrow">
        {t("eyebrow")}
      </Reveal>
      <div className="about__grid">
        <div className="about__copy">
          <Reveal as="h2" className="about__title" delay={60}>
            {t.rich("title", { name: (chunks) => <span>{chunks}</span> })}
          </Reveal>
          <Reveal as="p" delay={120}>
            {t("p1")}
          </Reveal>
          <Reveal as="p" delay={180}>
            {t("p2")}
          </Reveal>
          <Reveal as="p" delay={240}>
            {t("p3")}
          </Reveal>
          <Reveal className="about__actions" delay={300}>
            <Magnetic strength={0.5}>
              <a
                className="btn btn--solid"
                // The CV is a real file at a real URL, so a reviewer can open
                // it, save it, or send it on. It used to point at #curriculum,
                // which meant the button labelled "open my CV" produced no CV.
                // Opens in a tab rather than forcing a download: the label says
                // "abrir", and a recruiter reading it now is the point.
                href={t("cvHref")}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={t("cvCursor")}
              >
                {t("ctaCv")}
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a className="btn btn--ghost" href="#projects">
                {t("ctaProjects")}
              </a>
            </Magnetic>
          </Reveal>
        </div>
        <Reveal className="about__media" delay={140}>
          <Image
            src={about}
            alt={t("imageAlt")}
            sizes="(max-width: 900px) 80vw, 26rem"
            placeholder="blur"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================================
   Skills
   ========================================================================= */
type SkillItem = {
  kicker: string;
  title: string;
  body: string;
  tags: string[];
};

export function Skills() {
  const t = useTranslations("skills");
  const items = t.raw("items") as SkillItem[];
  return (
    <section id="skills" className="section skills shell">
      <div className="section__head">
        <Reveal as="p" className="eyebrow">
          {t("eyebrow")}
        </Reveal>
        <SplitText as="h2" className="section__title" text={t("title")} />
        <Reveal as="p" className="section__lead" delay={120}>
          {t("lead")}
        </Reveal>
      </div>
      <div className="skills__grid">
        {items.map((s, i) => (
          <Reveal key={s.title} className="skill" delay={i * 90}>
            <span className="skill__index">0{i + 1}</span>
            <p className="skill__kicker">{s.kicker}</p>
            <h3 className="skill__title">{s.title}</h3>
            <p className="skill__body">{s.body}</p>
            <ul className="skill__tags">
              {s.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   Services marquee (kinetic band)
   ========================================================================= */
export function ServicesMarquee() {
  const t = useTranslations("services");
  return <Marquee items={t.raw("items") as string[]} />;
}

/* =========================================================================
   Curriculum
   ========================================================================= */
type CvItem = { when: string; title: string; place: string; body: string };

function Timeline({ heading, items }: { heading: string; items: CvItem[] }) {
  return (
    <div className="cv__col">
      <Reveal as="h3" className="cv__heading">
        {heading}
      </Reveal>
      <div className="cv__track">
        {items.map((it, i) => (
          <Reveal key={it.title} className="cv__item" delay={i * 90}>
            <span className="cv__when">{it.when}</span>
            <h4 className="cv__role">{it.title}</h4>
            <p className="cv__place">{it.place}</p>
            <p className="cv__body">{it.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function Curriculum() {
  const t = useTranslations("curriculum");
  // The CV path is locale-dependent and lives once, in the about namespace,
  // where the other CV button already reads it. Copying it into curriculum
  // would give the site two places to change when the file is renamed, and
  // one of them would be missed.
  const about = useTranslations("about");
  return (
    <section id="curriculum" className="section cv shell">
      <div className="section__head">
        <Reveal as="p" className="eyebrow">
          {t("eyebrow")}
        </Reveal>
        <SplitText as="h2" className="section__title" text={t("title")} />
      </div>
      <div className="cv__grid">
        <Timeline
          heading={t("educationHeading")}
          items={t.raw("education") as CvItem[]}
        />
        <Timeline
          heading={t("workHeading")}
          items={t.raw("work") as CvItem[]}
        />
      </div>
      {/* Someone who has just read the whole timeline is the likeliest person
          on the page to want the document, and until now the only link to it
          was a button in the section above, already scrolled past. Opens in a
          tab rather than downloading, matching that button. */}
      <Reveal className="cv__actions" delay={120}>
        <Magnetic strength={0.5}>
          <a
            className="btn btn--ghost"
            href={about("cvHref")}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor={t("cvCursor")}
          >
            {t("ctaCv")}
          </a>
        </Magnetic>
      </Reveal>
    </section>
  );
}

/* =========================================================================
   Projects
   ========================================================================= */
// Case-study PDFs are self-hosted under /public/assets. They are NOT
// screen-optimised, whatever an earlier comment here claimed: vibe is 23 MB and
// voluntee is 20 MB, which is 20s on good 4G and a minute or more on a weak
// one. The bulk is 7.5 MB of Form XObjects plus 5 MB of JPEG, so Ghostscript
// /ebook achieves nothing; it needs a re-export from the source document. Until
// that happens the labels carry the size, so nobody starts the download blind.
// Those sizes live in the `projects` messages, per item, because Spanish
// writes 2,6 MB and English 2.6 MB. Still hand-kept: replacing a PDF in
// public/assets means updating both message files.
const PDF_HOST = "/assets";

// Structural (non-copy) data — images, links, layout. Copy (label/blurb/title/
// tag/action) comes from the `projects` messages, matched by index.
// `internal` points to an on-site case study; when set the card navigates
// there (client-side) instead of opening the raw PDF in a new tab.
const PROJECT_MEDIA: {
  items: {
    img: StaticImageData;
    href: string;
    internal?: string;
    code?: string;
    wide?: boolean;
  }[];
}[] = [
  {
    items: [
      {
        img: vibe,
        href: `${PDF_HOST}/vibe-app-memoria.pdf`,
        internal: "/proyectos/vibe",
      },
      {
        img: voluntee,
        href: `${PDF_HOST}/voluntee-app-slides.pdf`,
        internal: "/proyectos/voluntee",
      },
    ],
  },
  {
    items: [
      { img: raiz, href: "https://estudio-raiz.webflow.io/", wide: true },
      { img: isa, href: "https://experiencia.monicacalle.es/", wide: true },
      {
        img: luxeestate,
        href: "https://luxeestate-jgcq.vercel.app/",
        wide: true,
      },
      {
        img: selvatica,
        href: "https://selvatica-sigma.vercel.app/",
        wide: true,
      },
    ],
  },
  {
    items: [
      {
        img: grafico,
        href: `${PDF_HOST}/portafolio-grafico.pdf`,
        // Links to the page rather than opening the reader here: a modal
        // changes no route, so there was nothing to send or index.
        internal: GRAFICO_ROUTE,
        wide: true,
      },
    ],
  },
];

type ProjectGroup = {
  n: string;
  label: string;
  blurb: string;
  // `size` is present only on the items that link a PDF.
  items: { title: string; tag: string; action: string; size?: string }[];
};


export function Projects() {
  const t = useTranslations("projects");
  const groups = t.raw("groups") as ProjectGroup[];
  const codeLabel = t("codeLabel");
  const pdfLabel = t("pdfLabel");
  const pdfSize = (size: string) => t("pdfSize", { label: pdfLabel, size });
  const cardCursor = t("cardCursor");

  return (
    <section id="projects" className="section projects shell">
      <div className="section__head">
        <Reveal as="p" className="eyebrow">
          {t("eyebrow")}
        </Reveal>
        <SplitText as="h2" className="section__title" text={t("title")} />
      </div>

      {groups.map((g, gi) => {
        const media = PROJECT_MEDIA[gi];
        return (
          <div key={g.n} className="pgroup">
            <div className="pgroup__head">
              <Reveal as="span" className="pgroup__n serif">
                {g.n}
              </Reveal>
              <div>
                <Reveal as="h3" className="pgroup__label" delay={60}>
                  {g.label}
                </Reveal>
                <Reveal as="p" className="pgroup__blurb" delay={120}>
                  {g.blurb}
                </Reveal>
              </div>
            </div>
            <div className="pgroup__grid">
              {g.items.map((p, i) => {
                const m = media.items[i];
                const href = m.internal ?? m.href;
                // Every self-hosted PDF gets its own visible, copyable link.
                // Without this the file is reachable only by opening a modal
                // (the graphic portfolio) or not at all (the two case-study
                // decks, whose cards navigate to the on-site study instead),
                // so the URL exists but nobody can find or share it.
                const pdf = m.href.endsWith(".pdf") ? m.href : null;
                // External links (PDFs, live sites) open in a new tab; internal
                // case-study links navigate in place via next/link.
                const linkAttrs = m.internal
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" };
                
                const renderMedia = () => {
                  const props = {
                    className: "card__media cursor-pointer",
                    "data-cursor": cardCursor,
                    "data-title": p.title,
                    "aria-label": `${p.action}: ${p.title}`
                  };
                  
                  const img = (
                    <Image
                      src={m.img}
                      alt={p.title}
                      sizes="(max-width: 800px) 100vw, 40rem"
                      placeholder="blur"
                    />
                  );
                  const Tag = m.internal ? Link : "a";
                  return <Tag href={href} {...linkAttrs} {...props}>{img}</Tag>;
                };

                const renderAction = () => {
                  const props = { className: "card__link cursor-pointer" };
                  const Tag = m.internal ? Link : "a";
                  return <Tag href={href} {...linkAttrs} {...props}>{p.action}</Tag>;
                };
                
                const content = (
                  <Reveal
                    key={p.title}
                    className={`card ${m.wide ? "card--wide" : ""} ${gi === 1 ? `card--folder card--folder-${i}` : ""}`}
                    delay={i * 90}
                  >
                    {renderMedia()}
                    <div className="card__meta">
                      <div className="card__info">
                        <h4 className="card__title">{p.title}</h4>
                        <p className="card__tag">{p.tag}</p>
                      </div>
                      <div className="card__links">
                        {renderAction()}
                        {m.code && (
                          <a
                            className="card__link card__link--muted"
                            href={m.code}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {codeLabel}
                          </a>
                        )}
                        {pdf && (
                          <a
                            className="card__link card__link--muted"
                            href={pdf}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${pdfLabel}: ${p.title}`}
                          >
                            {p.size ? pdfSize(p.size) : pdfLabel}
                          </a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
                return content;
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* =========================================================================
   Contact + Footer
   ========================================================================= */
export function Contact() {
  const t = useTranslations("contact");
  const tags = t.raw("tags") as string[];

  return (
    <section id="contact" className="section contact">
      <div className="shell contact__inner">
        <Reveal as="p" className="eyebrow eyebrow--light">
          {t("eyebrow")}
        </Reveal>
        <Reveal as="h2" className="contact__title" delay={60}>
          {t.rich("title", { br: () => <br /> })}
        </Reveal>
        <Reveal as="p" className="contact__lead" delay={120}>
          {t("lead")}
        </Reveal>
        <Reveal delay={180}>
          <Magnetic strength={0.25}>
            <a
              className="contact__mail"
              href="mailto:monicacalle369@gmail.com"
              data-cursor={t("mailCursor")}
            >
              monicacalle369@gmail.com
            </a>
          </Magnetic>
        </Reveal>
        {/* The URL was only in the JSON-LD sameAs, so Google could see her
            LinkedIn and a visitor could not. Both CVs link it; the site was
            the least connected artefact she hands out. */}
        <Reveal delay={210}>
          <a
            className="contact__link"
            href={PERSON.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            // Not mailCursor: this link is not an email, and the cursor read
            // "Escríbeme" over it.
            data-cursor={t("linkedinCursor")}
          >
            {t("linkedin")}
          </a>
        </Reveal>
        <Reveal className="contact__tags" delay={240}>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </Reveal>
      </div>

      <Footer />
    </section>
  );
}
