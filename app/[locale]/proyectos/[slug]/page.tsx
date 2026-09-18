import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
// Locale-aware Link: the plain next/link one drops the locale, so an English
// visitor clicking through landed back in Spanish.
import { Link } from "@/lib/i18n/navigation";
import { notFound } from "next/navigation";
import { CASE_STUDY_SLUGS } from "@/lib/case-studies";
import { type Locale } from "@/lib/i18n/config";
import { routing } from "@/lib/i18n/routing";
import { localePath } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/site";
import { shareImage } from "@/lib/og/card";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ArrowLeft } from "lucide-react";
import vibe from "@/public/images/vibe.png";
import voluntee from "@/public/images/voluntee.png";
import kazaarDionysos from "@/public/images/kazaar/Dionysos.jpg";
import kazaarLogo from "@/public/images/kazaar/Kazaar Logo.svg";
import kazaarPdp from "@/public/images/kazaar/pdp-redesign.jpg";
import kazaarPdpSale from "@/public/images/kazaar/pdp-redesign-sale.jpg";
import kazaarEmail from "@/public/images/kazaar/email-design.png";
import kazaarAdOne from "@/public/images/kazaar/ad-01.png";
import kazaarAdFive from "@/public/images/kazaar/ad-05.png";
import catchLoading from "@/public/assets/catchApp/loading.png";
import catchOnboardingFriends from "@/public/assets/catchApp/Onboarding 2.png";
import catchOnboardingStreaks from "@/public/assets/catchApp/Onboarding 2-1.png";
import catchOnboardingPromise from "@/public/assets/catchApp/Onboarding 3.png";
import catchLogin from "@/public/assets/catchApp/login.png";
import catchSignUp from "@/public/assets/catchApp/sign up.png";
import catchHome from "@/public/assets/catchApp/Home.png";
import catchCreate from "@/public/assets/catchApp/create new.png";
import catchPlan from "@/public/assets/catchApp/Dentro del Plan.png";
import catchPlanRide from "@/public/assets/catchApp/Dentro del Plan-1.png";
import catchMap from "@/public/assets/catchApp/Map.png";
import catchChats from "@/public/assets/catchApp/Lista de chats.png";
import catchProfile from "@/public/assets/catchApp/Profile.png";
import vibeWelcome from "@/public/assets/vibe/iPhone 15 Pro - White-1.png";
import vibeBasics from "@/public/assets/vibe/iPhone 15 Pro - White flatten (1).png";
import vibeCycleSetup from "@/public/assets/vibe/iPhone 15 Pro - White (1).png";
import vibeFeatures from "@/public/assets/vibe/iPhone 15 Pro - White flatten.png";
import vibePrivacy from "@/public/assets/vibe/iPhone 15 Pro - White.png";
import vibeCycle from "@/public/assets/vibe/iPhone 15 Pro - White flatten-4.png";
import vibeAgenda from "@/public/assets/vibe/iPhone 15 Pro - White flatten-1.png";
import vibeCheckIn from "@/public/assets/vibe/iPhone 15 Pro - White flatten-3.png";
import vibeProfile from "@/public/assets/vibe/iPhone 15 Pro - White flatten-2.png";
import volunteeWelcome from "@/public/assets/voluntee/inicio.png";
import volunteeOnboardingOne from "@/public/assets/voluntee/onboarding 1.png";
import volunteeOnboardingTwo from "@/public/assets/voluntee/onboarding2.png";
import volunteeOnboardingThree from "@/public/assets/voluntee/onboarding 3.png";
import volunteeOnboardingFour from "@/public/assets/voluntee/onbiarding 4.png";
import volunteeOnboardingFive from "@/public/assets/voluntee/onboarding 5.png";
import volunteeSession from "@/public/assets/voluntee/inicio sesion.png";
import volunteeLogin from "@/public/assets/voluntee/login.png";
import volunteeSignUp from "@/public/assets/voluntee/sign in.png";
import volunteeList from "@/public/assets/voluntee/voluntariados menu.png";
import volunteeFilters from "@/public/assets/voluntee/filtros.png";
import volunteeDetails from "@/public/assets/voluntee/entidad descripcion.png";
import volunteeSaved from "@/public/assets/voluntee/guardados menu.png";
import volunteeHistory from "@/public/assets/voluntee/historial menu.png";
import volunteeChat from "@/public/assets/voluntee/chat.png";
import volunteeProfile from "@/public/assets/voluntee/Perfil.png";

type CampaignAd = {
  label: string;
  alt: string;
} & (
  | { kind: "image"; image: StaticImageData }
  | { kind: "video"; src: string }
);

type ShowcaseMedia =
  | {
      kind: "documents";
      items: {
        image: StaticImageData;
        href: string;
        label: string;
        alt: string;
      }[];
    }
  | { kind: "image"; image: StaticImageData; href: string; alt: string }
  | { kind: "video"; src: string; label: string };

type CaseStudyMedia = {
  image: StaticImageData;
  logo?: StaticImageData;
  pdf?: string;
  ads?: CampaignAd[];
  showcase?: ShowcaseMedia[];
  heroScreens?: StaticImageData[];
  screens?: StaticImageData[];
};

// Structural (non-copy) data per case study.
const MEDIA: Record<string, CaseStudyMedia> = {
  vibe: {
    image: vibe,
    pdf: "/assets/vibe-app-memoria.pdf",
    heroScreens: [vibeWelcome, vibeCycle, vibeCheckIn],
    screens: [
      vibeWelcome,
      vibeBasics,
      vibeCycleSetup,
      vibeFeatures,
      vibePrivacy,
      vibeCycle,
      vibeAgenda,
      vibeCheckIn,
      vibeProfile,
    ],
  },
  voluntee: {
    image: voluntee,
    pdf: "/assets/voluntee-app-slides.pdf",
    heroScreens: [volunteeOnboardingOne, volunteeList, volunteeProfile],
    screens: [
      volunteeWelcome,
      volunteeOnboardingOne,
      volunteeOnboardingTwo,
      volunteeOnboardingThree,
      volunteeOnboardingFour,
      volunteeOnboardingFive,
      volunteeSession,
      volunteeLogin,
      volunteeSignUp,
      volunteeList,
      volunteeFilters,
      volunteeDetails,
      volunteeSaved,
      volunteeHistory,
      volunteeChat,
      volunteeProfile,
    ],
  },
  "kazaar-fragrances": {
    image: kazaarDionysos,
    logo: kazaarLogo,
    showcase: [
      {
        kind: "documents",
        items: [
          {
            image: kazaarPdp,
            href: "/assets/kazaar/pdp-redesign.pdf",
            label: "PDP Redesign",
            alt: "Prototipo mobile PDP de Kazaar Fragrances",
          },
          {
            image: kazaarPdpSale,
            href: "/assets/kazaar/pdp-redesign-sale.pdf",
            label: "PDP Sale Version",
            alt: "Prototipo mobile PDP de Kazaar Fragrances con promoción",
          },
        ],
      },
      {
        kind: "image",
        image: kazaarEmail,
        href: "/assets/kazaar/educational-email.pdf",
        alt: "Diseño de email educativo de Kazaar Fragrances",
      },
      {
        kind: "video",
        src: "/images/kazaar/logo-motion.mp4",
        label: "Kazaar — Motion logo",
      },
    ],
    ads: [
      {
        kind: "image",
        label: "Ad 01 · Organic",
        alt: "Anuncio estático Organic de Kazaar Fragrances",
        image: kazaarAdOne,
      },
      {
        kind: "video",
        label: "Ad 02 · Price",
        alt: "Anuncio en movimiento Price de Kazaar Fragrances",
        src: "/images/kazaar/ad-02.mp4",
      },
      {
        kind: "video",
        label: "Ad 03 · Story",
        alt: "Anuncio en movimiento Story de Kazaar Fragrances",
        src: "/images/kazaar/ad-03.mp4",
      },
      {
        kind: "video",
        label: "Ad 04 · Oil %",
        alt: "Anuncio en movimiento Oil de Kazaar Fragrances",
        src: "/images/kazaar/ad-04.mp4",
      },
      {
        kind: "image",
        label: "Ad 05 · Entry offer",
        alt: "Anuncio estático Entry offer de Kazaar Fragrances",
        image: kazaarAdFive,
      },
    ],
  },
  catchapp: {
    image: catchLoading,
    heroScreens: [catchOnboardingPromise, catchHome, catchProfile],
    screens: [
      catchLoading,
      catchOnboardingFriends,
      catchOnboardingStreaks,
      catchOnboardingPromise,
      catchLogin,
      catchSignUp,
      catchHome,
      catchCreate,
      catchPlan,
      catchPlanRide,
      catchMap,
      catchChats,
      catchProfile,
    ],
  },
};

// The slugs that have written content. The list lives in lib/case-studies.ts so
// the sitemap cannot disagree with it.
//
// Note this does NOT pre-render anything today: reading the locale cookie in
// lib/i18n/request.ts opts every route out of static generation, so the build
// reports this route as Dynamic. generateStaticParams is kept because it is
// still the declaration of which slugs exist, and it would start pre-rendering
// the moment the locale stops coming from a cookie -- see MP-17.
// Restored. Removing this in 92ae560 traded one framework log line for four
// defects, verified by rebuilding both ways: an unknown slug went from a real
// 404 to a 38-byte empty <body> with no lang attribute, /proyectos/constructor
// went from 404 to an unauthenticated 500, and the route started emitting two
// contradictory robots metas. The NoFallbackError it logs is noise; a blank
// page is not.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_STUDY_SLUGS.map((slug) => ({ locale, slug })),
  );
}

type CaseStudy = {
  title: string;
  tagline: string;
  meta: { role: string; year: string; type: string; platform: string };
  overview: {
    product: string;
    role: string;
    audience: string;
    challenge: string;
    limitations: string;
  };
  sections: { heading: string; body: string }[];
  stats?: { value: string; label: string }[];
  showcase?: {
    eyebrow: string;
    title: string;
    description: string;
    format: string;
  }[];
  gallery?: { title: string; description: string; labels: string[] };
};

async function loadCase(slug: string) {
  const t = await getTranslations("caseStudies");
  // next-intl's server translator types `.raw()` against inferred message keys,
  // which the arrays in this namespace confuse — read it through a string accessor.
  const raw = t.raw as (key: string) => unknown;
  const items = raw("items") as Record<string, CaseStudy>;
  // hasOwn, not bracket access: items["constructor"] resolves up the prototype
  // chain to a function, which is truthy, so the guard below passed and the
  // render threw a 500. Belt and braces with dynamicParams above, because the
  // 500 must not come back if that flag is ever dropped again.
  const cs = Object.hasOwn(items, slug) ? items[slug] : undefined;
  const media = Object.hasOwn(MEDIA, slug) ? MEDIA[slug] : undefined;
  if (!cs || !media) return null;
  return { cs, media, ui: raw("ui") as CaseStudyUi };
}

type CaseStudyUi = {
  back: string;
  eyebrow: string;
  overview: Record<keyof CaseStudy["overview"], string>;
  meta: Record<keyof CaseStudy["meta"], string>;
  cta: string;
  showcaseTitle: string;
  comingSoon: string;
  adsTitle: string;
  adsDescription: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const data = await loadCase(slug);
  if (!data) return {};
  const { cs } = data;
  const title = `${cs.title} — ${cs.tagline}`;
  const description = cs.overview.product;
  const path = localePath(locale, `/proyectos/${slug}`);
  const url = `${SITE_URL}${path}`;
  // Without these the page inherits the root layout's canonical ("/") and its
  // openGraph block, which had two consequences: Google consolidated every case
  // study into the homepage and dropped the URL, cancelling out the sitemap
  // entries; and pasting a case-study link anywhere rendered the homepage
  // title, description and image. These are the two pages a hiring manager is
  // most likely to be sent, so both mattered.
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        es: `/proyectos/${slug}`,
        en: `/en/proyectos/${slug}`,
        "x-default": `/proyectos/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: shareImage(locale, `/proyectos/${slug}`, cs.title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImage(locale, `/proyectos/${slug}`, cs.title),
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);
  const data = await loadCase(slug);
  if (!data) notFound();
  const { cs, media, ui } = data;
  const gallery = cs.gallery;

  const overviewRows = (
    ["product", "role", "audience", "challenge", "limitations"] as const
  ).map((key) => ({ label: ui.overview[key], value: cs.overview[key] }));
  const metaRows = (["role", "year", "type", "platform"] as const).map(
    (key) => ({
      label: ui.meta[key],
      value: cs.meta[key],
    }),
  );

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

          <div
            className={`cs__hero${media.logo ? " cs__hero--brand" : ""}${media.heroScreens ? ` cs__hero--screens cs__hero--${slug}` : ""}`}
          >
            {media.heroScreens ? (
              <div className="cs__hero-screen-stack">
                {media.heroScreens.map((screen, index) => (
                  <div
                    key={screen.src}
                    className={`cs__hero-screen cs__hero-screen--${index + 1}`}
                  >
                    <Image
                      src={screen}
                      alt={`${cs.title} — pantalla ${index + 1}`}
                      sizes="(max-width: 768px) 58vw, 22rem"
                      placeholder="blur"
                      priority
                    />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {media.logo && (
                  <div className="cs__hero-logo">
                    <Image
                      src={media.logo}
                      alt="Kazaar"
                      sizes="(max-width: 768px) 72vw, 30rem"
                      priority
                    />
                  </div>
                )}
                <div className={media.logo ? "cs__hero-photo" : undefined}>
                  <Image
                    src={media.image}
                    alt={cs.title}
                    sizes={
                      media.logo
                        ? "(max-width: 768px) 72vw, 20rem"
                        : "(max-width: 900px) 100vw, 72rem"
                    }
                    placeholder="blur"
                    priority
                  />
                </div>
              </>
            )}
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

          {gallery && media.screens && (
            <section
              className={`cs__screens cs__screens--${slug}`}
              aria-labelledby="screens-title"
            >
              <div className="cs__screens-head">
                <p className="eyebrow">{cs.title}</p>
                <h2 id="screens-title" className="cs__screens-title serif">
                  {gallery.title}
                </h2>
                <p>{gallery.description}</p>
              </div>
              <div className="cs__screens-grid">
                {media.screens.map((screen, index) => (
                  <figure key={screen.src} className="cs__screen">
                    <div className="cs__screen-media">
                      <Image
                        src={screen}
                        alt={`${cs.title} — ${gallery.labels[index] ?? `pantalla ${index + 1}`}`}
                        sizes="(max-width: 560px) 82vw, (max-width: 980px) 40vw, 23rem"
                        placeholder="blur"
                      />
                    </div>
                    <figcaption>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {gallery.labels[index]}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {cs.showcase && cs.showcase.length > 0 && (
            <section className="cs__showcase" aria-labelledby="showcase-title">
              <div className="cs__showcase-head">
                <p className="eyebrow">Kazaar Fragrances</p>
                <h2 id="showcase-title" className="cs__showcase-title serif">
                  {ui.showcaseTitle}
                </h2>
              </div>
              <div className="cs__showcase-grid">
                {cs.showcase.map((item, index) => {
                  const asset = media.showcase?.[index];
                  return (
                    <article key={item.title} className="cs__showcase-card">
                      {asset?.kind === "documents" && (
                        <div className="cs__showcase-documents">
                          {asset.items.map((document) => (
                            <a
                              key={document.href}
                              className="cs__showcase-document"
                              href={document.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="cs__showcase-scroll">
                                <Image
                                  src={document.image}
                                  alt={document.alt}
                                  sizes="(max-width: 768px) 82vw, 28rem"
                                />
                              </span>
                              <span className="cs__showcase-document-label">
                                {document.label} ↗
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                      {asset?.kind === "image" && (
                        <a
                          className="cs__showcase-document"
                          href={asset.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="cs__showcase-scroll cs__showcase-scroll--email">
                            <Image
                              src={asset.image}
                              alt={asset.alt}
                              sizes="(max-width: 768px) 82vw, 34rem"
                            />
                          </span>
                          <span className="cs__showcase-document-label">
                            PDF ↗
                          </span>
                        </a>
                      )}
                      {asset?.kind === "video" && (
                        <div className="cs__showcase-video">
                          <video
                            src={asset.src}
                            aria-label={asset.label}
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                            preload="metadata"
                          />
                        </div>
                      )}
                      <div className="cs__showcase-copy">
                        <p>{item.eyebrow}</p>
                        <h3>{item.title}</h3>
                        <span>{item.description}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {media.ads && media.ads.length > 0 && (
            <section className="cs__ads" aria-labelledby="ads-title">
              <div className="cs__ads-head">
                <h2 id="ads-title" className="cs__ads-title serif">
                  {ui.adsTitle}
                </h2>
                <p>{ui.adsDescription}</p>
              </div>
              <div className="cs__ads-grid">
                {media.ads.map((ad) => (
                  <figure key={ad.label} className="cs__ad">
                    <div className="cs__ad-media">
                      {ad.kind === "image" ? (
                        <Image
                          src={ad.image}
                          alt={ad.alt}
                          sizes="(max-width: 768px) 100vw, 34rem"
                          loading="eager"
                        />
                      ) : (
                        <video
                          src={ad.src}
                          aria-label={ad.alt}
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                          preload="metadata"
                        />
                      )}
                    </div>
                    <figcaption>{ad.label}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          <div className="cs__foot">
            <Link className="cs__back cs__back--foot" href="/#projects">
              <ArrowLeft className="cs__back-icon" size={14} />
              {ui.back}
            </Link>
            {media.pdf && (
              <a
                className="btn btn--solid"
                href={media.pdf}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="PDF"
              >
                {ui.cta}
              </a>
            )}
          </div>
        </div>
      </main>
      <div className="contact" style={{ overflow: "hidden" }}>
        <Footer />
      </div>
    </>
  );
}
