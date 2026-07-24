import LiquidCanvas from "./liquid-canvas";

/*
  Backdrop — the flowing wave field behind the whole page.

  A self-contained 2D <canvas> (see liquid-canvas.tsx) draws horizontal lines
  that flow like travelling sound waves and merge when they meet. Underneath sit
  soft warm blobs for depth. Non-interactive by design — nothing here reacts to
  the pointer.

  Sits at z-index -1 (see backdrop.css): above the cream body fill, behind every
  bit of content. All decorative, so aria-hidden and pointer-events: none.
*/
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden>
      <div className="backdrop__blobs" />
      <div className="backdrop__field">
        <LiquidCanvas />
      </div>
    </div>
  );
}
