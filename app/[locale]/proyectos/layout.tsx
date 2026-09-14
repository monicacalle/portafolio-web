import { Backdrop } from "@/components/site/backdrop";
import { Preloader } from "@/components/site/preloader";
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { NegativeReveal } from "@/components/site/negative-reveal";

/**
 * The original site's chrome, kept for the case-study routes and the flipbook.
 *
 * All five of these used to live in app/[locale]/layout.tsx and therefore ran on
 * every route. That stopped working when the homepage became the Edition: the
 * preloader holds a warm curtain over the page and LOCKS SCROLL until it clears,
 * so the Edition's first 150svh — the retablo, the whole reason the page opens
 * the way it does — sat underneath a counter racing to 100. The custom cursor
 * and the negative-reveal overlay fight the cinematic chapters in the same way.
 *
 * Moving them down here rather than deleting them is deliberate. The case
 * studies were designed around this chrome, they are the routes a recruiter
 * actually reads, and they are not in scope for this rebuild. They keep the
 * behaviour they were built with; the Edition brings its own.
 */
export default function ProyectosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Backdrop />
      <Preloader />
      <Cursor />
      <ScrollProgress />
      {children}
      <NegativeReveal />
    </>
  );
}
