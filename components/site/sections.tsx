import Image, { type StaticImageData } from "next/image";
import { Reveal } from "./reveal";
import logo from "@/public/images/asset4.png";
import { SplitText } from "./split-text";
import { Magnetic } from "./magnetic";
import { Marquee } from "./marquee";
import about from "@/public/images/about.png";
import vibe from "@/public/images/vibe.png";
import voluntee from "@/public/images/voluntee.png";
import raiz from "@/public/images/mockupraiz.png";
import isa from "@/public/images/mockupisa.png";
import iphone from "@/public/images/iphone.webp";
import grafico from "@/public/images/portafolioabierto.png";

/* =========================================================================
   About
   ========================================================================= */
export function About() {
  return (
    <section id="about" className="section about shell">
      <Reveal as="p" className="eyebrow">
        Sobre mí
      </Reveal>
      <div className="about__grid">
        <div className="about__copy">
          <Reveal as="h2" className="about__title" delay={60}>
            Hola, soy <span>Mónica Calle.</span>
          </Reveal>
          <Reveal as="p" delay={120}>
            Soy diseñadora UX/UI y diseñadora gráfica con base en front-end
            development. Combino sensibilidad visual, pensamiento estratégico y
            conocimiento técnico para crear experiencias digitales claras,
            funcionales y con intención.
          </Reveal>
          <Reveal as="p" delay={180}>
            Mi perfil vive entre el diseño y el desarrollo, lo que me permite
            entender cada proyecto desde la idea inicial hasta su ejecución. Me
            interesa construir interfaces cuidadas, intuitivas y visualmente
            sólidas, donde cada decisión tenga un propósito y aporte valor a la
            experiencia del usuario.
          </Reveal>
          <Reveal as="p" delay={240}>
            Disfruto transformar ideas en productos digitales que conecten con
            las personas, resuelvan necesidades reales y dejen una impresión
            memorable.
          </Reveal>
          <Reveal className="about__actions" delay={300}>
            <Magnetic strength={0.5}>
              <a className="btn btn--solid" href="#curriculum" data-cursor="CV">
                Abrir mi CV
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a className="btn btn--ghost" href="#projects">
                Ver proyectos
              </a>
            </Magnetic>
          </Reveal>
        </div>
        <Reveal className="about__media" delay={140}>
          <Image src={about} alt="Mónica Calle" sizes="(max-width: 900px) 80vw, 26rem" placeholder="blur" />
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================================
   Skills
   ========================================================================= */
const SKILLS = [
  {
    kicker: "Desarrollo",
    title: "Construcción Front-End",
    body: "Creación de interfaces responsive con una estructura limpia, maquetación accesible y atención al detalle.",
    tags: ["HTML5", "CSS3", "JavaScript", "React", "Git"],
  },
  {
    kicker: "Plataformas",
    title: "CMS y No-Code",
    body: "Creación y mantenimiento de sitios web cuidados, con sistemas de contenido flexibles y flujos visuales eficientes.",
    tags: ["WordPress", "Webflow", "Edición de contenido", "Sistemas de diseño"],
  },
  {
    kicker: "Diseño",
    title: "Diseño UI y visual",
    body: "Transformación de ideas en direcciones visuales claras, wireframes, prototipos y recursos de interfaz alineados con la marca.",
    tags: ["Figma", "Adobe Illustrator", "Photoshop", "InDesign"],
  },
  {
    kicker: "Colaboración",
    title: "Fortalezas profesionales",
    body: "Trabajo con equipos y clientes a través de una comunicación clara, resolución de problemas, adaptabilidad y una mentalidad centrada en el usuario.",
    tags: ["Comunicación", "Trabajo en equipo", "Resolución de problemas", "Adaptabilidad"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="section skills shell">
      <div className="section__head">
        <Reveal as="p" className="eyebrow">
          Habilidades
        </Reveal>
        <SplitText as="h2" className="section__title" text="Herramientas, plataformas y fortalezas" />
        <Reveal as="p" className="section__lead" delay={120}>
          Una selección de lo que utilizo para diseñar y construir experiencias
          digitales con intención.
        </Reveal>
      </div>
      <div className="skills__grid">
        {SKILLS.map((s, i) => (
          <Reveal key={s.title} className="skill" delay={i * 90}>
            <span className="skill__index">0{i + 1}</span>
            <p className="skill__kicker">{s.kicker}</p>
            <h3 className="skill__title">{s.title}</h3>
            <p className="skill__body">{s.body}</p>
            <ul className="skill__tags">
              {s.tags.map((t) => (
                <li key={t}>{t}</li>
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
  return (
    <Marquee
      items={[
        "Diseño UX/UI",
        "Prototipado en Figma",
        "Front-End",
        "Branding",
        "Diseño Web",
        "WordPress",
      ]}
    />
  );
}

/* =========================================================================
   Curriculum
   ========================================================================= */
const EDU = [
  {
    when: "Actualidad",
    title: "Máster en Diseño Gráfico, UX/UI y Diseño Web",
    place: "CEI, Escuela de Diseño y Marketing · España",
    body: "Branding y sistemas de identidad visual, arquitectura de la información, prototipado y microinteracciones UX.",
  },
  {
    when: "2022 – 2023",
    title: "Desarrollo Full Stack",
    place: "4Geeks Academy · Chile",
    body: "Front-end con JavaScript (ES6+, React) y back-end con Python (Flask, APIs REST), construyendo y desplegando aplicaciones web.",
  },
  {
    when: "2010 – 2015",
    title: "Licenciatura en Lenguas Extranjeras",
    place: "Unidad Central del Valle · Colombia",
    body: "Enseñanza de inglés y francés, con base en lingüística, comunicación intercultural y metodologías pedagógicas.",
  },
];

const WORK = [
  {
    when: "Actualidad",
    title: "Desarrolladora UX/UI y WordPress",
    place: "Neerutech · España",
    body: "Uno el diseño visual con el rendimiento técnico. Llevo procesos de desarrollo de principio a fin, de la idea al prototipo en Figma y a la tienda WooCommerce funcionando, con migraciones sin tiempo de inactividad.",
  },
  {
    when: "2023",
    title: "Desarrolladora Front-End",
    place: "Enerlink · Chile",
    body: "Construí el sistema de notificaciones y preferencias de su aplicación web de medición inteligente, con actualizaciones en tiempo real y filtros configurables.",
  },
  {
    when: "2022 – 2023",
    title: "Asistente de docencia",
    place: "4Geeks Academy · Chile",
    body: "Acompañé a estudiantes en JavaScript y React, adaptando la explicación a la forma de razonar de cada persona.",
  },
];

function Timeline({ heading, items }: { heading: string; items: typeof EDU }) {
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
  return (
    <section id="curriculum" className="section cv shell">
      <div className="section__head">
        <Reveal as="p" className="eyebrow">
          Currículum
        </Reveal>
        <SplitText as="h2" className="section__title" text="Formación y experiencia" />
      </div>
      <div className="cv__grid">
        <Timeline heading="Formación" items={EDU} />
        <Timeline heading="Experiencia laboral" items={WORK} />
      </div>
    </section>
  );
}

/* =========================================================================
   Projects
   ========================================================================= */
// Case-study PDFs are self-hosted under /public/assets, compressed from the
// originals (which were 30–90 MB each) to a screen-friendly size.
const PDF_HOST = "/assets";

type Project = {
  title: string;
  tag: string;
  img: StaticImageData;
  href: string;
  action: string; // "Ver proyecto" / "Ver sitio"
  code?: string; // secondary GitHub link
  wide?: boolean;
};
const GROUPS: { n: string; label: string; blurb: string; items: Project[] }[] = [
  {
    n: "01",
    label: "Proyectos UX/UI",
    blurb:
      "Aplicaciones y conceptos digitales donde combino investigación, estructura y una dirección visual cuidada.",
    items: [
      {
        title: "Vibe App",
        tag: "UX/UI · App móvil · FemTech",
        img: vibe,
        href: `${PDF_HOST}/vibe-app-memoria.pdf`,
        action: "Ver proyecto",
      },
      {
        title: "Voluntee App",
        tag: "Investigación UX · Diseño de apps",
        img: voluntee,
        href: `${PDF_HOST}/voluntee-app-slides.pdf`,
        action: "Ver proyecto",
      },
    ],
  },
  {
    n: "02",
    label: "Sitios web que he creado",
    blurb:
      "Webs desarrolladas con WordPress, Webflow y front-end a medida, para unir marca, funcionalidad y detalle visual.",
    items: [
      {
        title: "Estudio Raíz",
        tag: "Webflow",
        img: raiz,
        href: "https://estudio-raiz.webflow.io/",
        action: "Ver sitio",
        wide: true,
      },
      {
        title: "Isabella Mendoza · Experiencia Capilar",
        tag: "WordPress",
        img: isa,
        href: "https://monicacalle.es/",
        action: "Ver sitio",
        wide: true,
      },
      {
        title: "iPhone 15 Clone",
        tag: "React · Tailwind · GSAP",
        img: iphone,
        href: "https://iphone15-page-clone.vercel.app/",
        action: "Ver sitio",
        code: "https://github.com/monicacalle/iphone15-page-clone",
      },
    ],
  },
  {
    n: "03",
    label: "Proyecto creativo",
    blurb:
      "Piezas de branding y campaña donde exploro una estética más editorial, expresiva y conceptual.",
    items: [
      {
        title: "Portafolio gráfico",
        tag: "Diseño gráfico · Dirección visual",
        img: grafico,
        href: `${PDF_HOST}/portafolio-grafico.pdf`,
        action: "Ver proyecto",
        wide: true,
      },
    ],
  },
];

export function Projects() {
  return (
    <section id="projects" className="section projects shell">
      <div className="section__head">
        <Reveal as="p" className="eyebrow">
          Proyectos
        </Reveal>
        <SplitText as="h2" className="section__title" text="En los que he trabajado" />
      </div>

      {GROUPS.map((g) => (
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
            {g.items.map((p, i) => (
              <Reveal
                key={p.title}
                className={`card ${p.wide ? "card--wide" : ""}`}
                delay={i * 90}
              >
                <a
                  className="card__media"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Ver"
                  aria-label={`${p.action}: ${p.title}`}
                >
                  <Image src={p.img} alt={p.title} sizes="(max-width: 800px) 100vw, 40rem" placeholder="blur" />
                </a>
                <div className="card__meta">
                  <div className="card__info">
                    <h4 className="card__title">{p.title}</h4>
                    <p className="card__tag">{p.tag}</p>
                  </div>
                  <div className="card__links">
                    <a className="card__link" href={p.href} target="_blank" rel="noopener noreferrer">
                      {p.action}
                    </a>
                    {p.code && (
                      <a className="card__link card__link--muted" href={p.code} target="_blank" rel="noopener noreferrer">
                        Código
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* =========================================================================
   Contact + Footer
   ========================================================================= */
export function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="shell contact__inner">
        <Reveal as="p" className="eyebrow eyebrow--light">
          Contacto
        </Reveal>
        <Reveal as="h2" className="contact__title" delay={60}>
          Creemos algo con
          <br />
          intención, juntos.
        </Reveal>
        <Reveal as="p" className="contact__lead" delay={120}>
          Si tienes un proyecto, una colaboración o una oportunidad en mente, me
          encantará saber de ti.
        </Reveal>
        <Reveal delay={180}>
          <Magnetic strength={0.25}>
            <a className="contact__mail" href="mailto:monicacalle369@gmail.com" data-cursor="Escríbeme">
              monicacalle369@gmail.com
            </a>
          </Magnetic>
        </Reveal>
        <Reveal className="contact__tags" delay={240}>
          <span>Diseño UX/UI</span>
          <span>Diseño gráfico</span>
          <span>Front-End</span>
          <span>WordPress</span>
        </Reveal>
      </div>

      <footer className="footer shell">
        <Image src={logo} alt="Logo de Mónica Calle" className="footer__logo" />
        <nav className="footer__links">
          <a href="#about">Sobre mí</a>
          <a href="#skills">Habilidades</a>
          <a href="#projects">Proyectos</a>
          <a href="#contact">Contacto</a>
        </nav>
        <p className="footer__fine">© 2026 Mónica Calle. Todos los derechos reservados.</p>
      </footer>
    </section>
  );
}
