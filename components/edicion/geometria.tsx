"use client";

/**
 * The Da Vinci geometry system — brief section 15.
 *
 * A full-viewport hairline drawing that constructs itself as the hero scrolls:
 * frame, then the golden divisions, then the diagonals, then the circles and
 * the spiral. Architectural drafting ink, explicitly NOT a glowing sci-fi HUD,
 * which is why it is one warm off-white at very low opacity with no blur, no
 * glow and no colour.
 *
 * WHAT IT MEASURES IS THE COMPOSITION, NOT HER PROCESS. An earlier plan had the
 * geometry resolving onto "her own construction lines" in Artwork 7. Those
 * marks were rendered and examined: they are an open jaw contour that runs past
 * the chin, a line down the chest, and two stray hair strands. Unfinished
 * inking, not construction geometry. Hairlines registering to them would read
 * as four unrelated squiggles, and the copy asserting it would be a claim about
 * her working method that she has never made. So the geometry draws the golden
 * divisions of the retablo itself, which is a true statement about the
 * composition on screen.
 *
 * Drawing uses pathLength="1", so stroke-dasharray: 1 is the whole path
 * whatever its real length, and one dashoffset expression works for every
 * element regardless of shape. Each group reads its own window of the hero's
 * --p, per the sequence in section 15, so it builds up in stages rather than
 * appearing at once.
 */
export function Geometria() {
  return (
    <svg
      className="edicion-geometria"
      viewBox="0 0 1000 625"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
    >
      {/* 0–15%: the frame. */}
      <g className="edicion-geometria__g" data-fase="marco">
        <rect x="40" y="26" width="920" height="573" pathLength="1" />
      </g>

      {/* 10–30%: centre lines and the golden divisions. 0.382 and 0.618 are
          1−1/φ and 1/φ; using both keeps the construction symmetrical. */}
      <g className="edicion-geometria__g" data-fase="divisiones">
        <line x1="40" y1="312.5" x2="960" y2="312.5" pathLength="1" />
        <line x1="500" y1="26" x2="500" y2="599" pathLength="1" />
        <line x1="391.4" y1="26" x2="391.4" y2="599" pathLength="1" />
        <line x1="608.6" y1="26" x2="608.6" y2="599" pathLength="1" />
        <line x1="40" y1="244.9" x2="960" y2="244.9" pathLength="1" />
        <line x1="40" y1="380.1" x2="960" y2="380.1" pathLength="1" />
      </g>

      {/* 20–45%: corner-to-corner, then the auxiliary golden diagonals. */}
      <g className="edicion-geometria__g" data-fase="diagonales">
        <line x1="40" y1="26" x2="960" y2="599" pathLength="1" />
        <line x1="960" y1="26" x2="40" y2="599" pathLength="1" />
        <line x1="391.4" y1="26" x2="960" y2="599" pathLength="1" />
        <line x1="608.6" y1="26" x2="40" y2="599" pathLength="1" />
        <line x1="40" y1="244.9" x2="960" y2="380.1" pathLength="1" />
      </g>

      {/* 30–60%: circles, arcs and the spiral construction. */}
      <g className="edicion-geometria__g" data-fase="circulos">
        <circle cx="500" cy="312.5" r="286.5" pathLength="1" />
        <circle cx="500" cy="312.5" r="177" pathLength="1" />
        <circle cx="391.4" cy="312.5" r="108.6" pathLength="1" />
        <circle cx="608.6" cy="312.5" r="108.6" pathLength="1" />
        <circle cx="40" cy="26" r="67.1" pathLength="1" />
        <circle cx="960" cy="599" r="67.1" pathLength="1" />
        {/* Quarter-arc spiral: each quarter turns in the next golden square. */}
        <path d="M40 599 A 573 573 0 0 1 613 26" pathLength="1" />
        <path d="M613 26 A 354 354 0 0 1 967 380" pathLength="1" />
        <path d="M967 380 A 219 219 0 0 1 748 599" pathLength="1" />
        <path d="M748 599 A 135 135 0 0 1 613 464" pathLength="1" />
      </g>
    </svg>
  );
}
