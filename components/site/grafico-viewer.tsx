"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import dynamic from "next/dynamic";

// Client-only: pdfjs-dist reads DOMMatrix at module evaluation, so pulling it
// into this page's server render threw "DOMMatrix is not defined" and returned
// a 500. The homepage never hit this because the reader is only imported from a
// component that was already client-rendered by the time it evaluated.
const PdfViewer = dynamic(
  () => import("@/components/site/pdf-viewer").then((m) => m.PdfViewer),
  { ssr: false },
);
import { GRAFICO_PDF } from "@/lib/case-studies";

/*
  The flipbook, on a page that has its own URL.

  The reader itself is unchanged. What changed is where it lives: it used to be
  reachable only from a card on the homepage, so opening it changed no route and
  there was nothing to send anyone. Now the page is the address and this is the
  presentation layer on it.
*/
export function GraficoViewer() {
  const t = useTranslations("grafico");

  return (
    <Dialog>
      <DialogTrigger render={<button type="button" className="btn btn--ghost" />}>
        {t("open")}
      </DialogTrigger>
      <DialogContent
        aria-label={t("title")}
        className="!max-w-[95vw] md:!max-w-[75vw] w-[95vw] md:w-[75vw] h-[95vh] md:h-[85vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center"
        showCloseButton={false}
      >
        <PdfViewer url={GRAFICO_PDF} />
      </DialogContent>
    </Dialog>
  );
}
