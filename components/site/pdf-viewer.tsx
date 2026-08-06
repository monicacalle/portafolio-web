"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Loader2, X, Maximize2, Minimize2 } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState(0);
  // spread = right page number (left page = spread - 1)
  const [spread, setSpread] = useState(1);
  const [pdfRatio, setPdfRatio] = useState(0); // width / height of a single pdf page
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Computed page size that fits inside the container without cropping
  const [pageW, setPageW] = useState(0);
  const [pageH, setPageH] = useState(0);

  // Flip animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [flipActive, setFlipActive] = useState(false);
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
  const [flipFrontPage, setFlipFrontPage] = useState(0); // page shown on front of flipping card
  const [flipBackPage, setFlipBackPage] = useState(0);   // page shown on back of flipping card

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const flipTimer1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipTimer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recalculate page size whenever container or PDF ratio changes
  const recalc = useCallback(() => {
    if (!innerRef.current || pdfRatio === 0) return;
    const rect = innerRef.current.getBoundingClientRect();
    // Padding: 80px top (for header badge), 48px sides, 64px bottom
    const availW = rect.width - 96;
    const availH = rect.height - 128; // 64px top + 64px bottom padding
    // Two pages side by side → each gets half the width
    const maxW = Math.floor(availW / 2);
    // Width constrained by height too
    const wFromH = Math.floor(availH * pdfRatio);
    const actualW = Math.min(maxW, wFromH);
    const actualH = Math.floor(actualW / pdfRatio);
    setPageW(actualW);
    setPageH(actualH);
  }, [pdfRatio]);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [recalc]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => () => {
    if (flipTimer1Ref.current) clearTimeout(flipTimer1Ref.current);
    if (flipTimer2Ref.current) clearTimeout(flipTimer2Ref.current);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onFirstPageLoad(page: any) {
    const vp = page.getViewport({ scale: 1.0 });
    setPdfRatio(vp.width / vp.height);
  }

  function goNext() {
    if (spread >= numPages || isAnimating) return;
    setFlipFrontPage(spread);       // front: current right page folds away
    setFlipBackPage(spread + 1);    // back: new left page appears as card lands
    setFlipDir("next");
    setIsAnimating(true);
    setFlipActive(true);

    // At the midpoint the card is edge-on — swap pages now (invisible moment)
    flipTimer1Ref.current = setTimeout(() => {
      setSpread(s => Math.min(s + 2, numPages));
    }, 375);

    // At end: hide the flip card
    flipTimer2Ref.current = setTimeout(() => {
      setFlipActive(false);
      setTimeout(() => setIsAnimating(false), 50);
    }, 800);
  }

  function goPrev() {
    if (spread <= 1 || isAnimating) return;
    setFlipFrontPage(spread - 1);   // front: current left page folds away
    setFlipBackPage(spread - 2);    // back: new right page appears as card lands
    setFlipDir("prev");
    setIsAnimating(true);
    setFlipActive(true);

    // Midpoint: swap pages while card is edge-on
    flipTimer1Ref.current = setTimeout(() => {
      setSpread(s => Math.max(s - 2, 1));
    }, 375);

    // End: hide flip card
    flipTimer2Ref.current = setTimeout(() => {
      setFlipActive(false);
      setTimeout(() => setIsAnimating(false), 50);
    }, 800);
  }

  const leftPage = spread - 1;   // 0 = blank (cover)
  const rightPage = spread;


  return (
    <div
      ref={containerRef}
      className="pdf-viewer-grain flex flex-col w-full h-full bg-[rgb(62,28,28)] rounded-xl shadow-2xl relative overflow-hidden"
      style={{ cursor: "default" }}
    >
      {/* Close */}
      <div className="absolute top-[13px] right-4 z-50">
        <DialogClose className="p-2.5 bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 rounded-full transition-colors">
          <X className="w-4 h-4" />
        </DialogClose>
      </div>

      {/* Pagination badge */}
      <div className="absolute top-[13px] left-4 z-50 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium flex items-center gap-2">
        <span>Portfolio gráfico y digital</span>
        <span className="opacity-50">|</span>
        <span>{spread} de {numPages || "--"} páginas</span>
      </div>

      {/* Book area */}
      <div ref={innerRef} className="flex-1 w-full flex items-center justify-center relative min-h-0 px-16 py-16">

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <Loader2 className="w-10 h-10 animate-spin text-white/50" />
          </div>
        )}

        <Document file={url} loading={null} onLoadSuccess={onDocumentLoadSuccess}>
          {/* Hidden probe page to get aspect ratio */}
          {pdfRatio === 0 && (
            <div className="absolute opacity-0 pointer-events-none" style={{ top: 0, left: 0, width: 1, height: 1, overflow: "hidden" }}>
              <Page
                pageNumber={1}
                width={400}
                onLoadSuccess={onFirstPageLoad}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          )}

          {!loading && pageW > 0 && pageH > 0 && (
            <div
              className="relative flex"
              style={{
                width: pageW * 2,
                height: pageH,
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* LEFT PAGE – always static */}
              <div
                className="overflow-hidden flex-shrink-0 bg-white"
                style={{ width: pageW, height: pageH, borderRight: "1px solid rgba(0,0,0,0.15)" }}
              >
                {leftPage >= 1 ? (
                  <Page
                    pageNumber={leftPage}
                    width={pageW}
                    height={pageH}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50" />
                )}
              </div>

              {/* RIGHT PAGE – always static */}
              <div
                className="overflow-hidden flex-shrink-0 bg-white"
                style={{ width: pageW, height: pageH }}
              >
                <Page
                  pageNumber={rightPage}
                  width={pageW}
                  height={pageH}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>

              {/* FLIP CARD — continuous 3D flip, front + back faces */}
              {flipActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    // Next: card sits at right slot; Prev: card sits at left slot
                    left: flipDir === "next" ? pageW : 0,
                    width: pageW,
                    height: pageH,
                    transformStyle: "preserve-3d",
                    transformOrigin: flipDir === "next" ? "left center" : "right center",
                    animation: `${flipDir === "next" ? "pageFlipNext" : "pageFlipPrev"} 750ms cubic-bezier(0.77, 0, 0.175, 1) forwards`,
                    zIndex: 30,
                  }}
                >
                  {/* Front face — page that folds away */}
                  <div
                    style={{
                      position: "absolute", top: 0, left: 0,
                      width: "100%", height: "100%",
                      backfaceVisibility: "hidden",
                      overflow: "hidden",
                    }}
                  >
                    {flipFrontPage > 0 && (
                      <Page pageNumber={flipFrontPage} width={pageW} height={pageH} renderTextLayer={false} renderAnnotationLayer={false} />
                    )}
                  </div>
                  {/* Back face — page that appears (pre-rotated 180° so it reads correctly) */}
                  <div
                    style={{
                      position: "absolute", top: 0, left: 0,
                      width: "100%", height: "100%",
                      backfaceVisibility: "hidden",
                      // Counter-rotate so text reads correctly when the card is flipped
                      transform: flipDir === "next" ? "rotateY(180deg)" : "rotateY(-180deg)",
                      overflow: "hidden",
                    }}
                  >
                    {flipBackPage >= 1 && flipBackPage <= numPages && (
                      <Page pageNumber={flipBackPage} width={pageW} height={pageH} renderTextLayer={false} renderAnnotationLayer={false} />
                    )}
                  </div>
                </div>
              )}

              {/* Spine shadow */}
              <div
                className="absolute top-0 pointer-events-none z-20"
                style={{
                  left: pageW - 4,
                  width: 8,
                  height: pageH,
                  background: "linear-gradient(to right, rgba(0,0,0,0.18), transparent 40%, transparent 60%, rgba(0,0,0,0.12))",
                }}
              />
            </div>
          )}
        </Document>

        {/* Prev arrow */}
        {numPages > 1 && (
          <button
            disabled={spread <= 1 || isAnimating}
            onClick={goPrev}
            className="absolute left-2 sm:left-4 z-30 p-4 bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 rounded-full shadow-lg disabled:opacity-20 transition-all"
            style={{ cursor: "pointer" }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next arrow */}
        {numPages > 1 && (
          <button
            disabled={spread >= numPages || isAnimating}
            onClick={goNext}
            className="absolute right-2 sm:right-4 z-30 p-4 bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 rounded-full shadow-lg disabled:opacity-20 transition-all"
            style={{ cursor: "pointer" }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-4 right-4 z-50 p-3 bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 rounded-full shadow-sm transition-colors"
        style={{ cursor: "pointer" }}
      >
        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
