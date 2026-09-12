# MASTER REBUILD BRIEF

Recreate the **Shopify Editions Winter ’26 — Renaissance** experience as a highly polished, cinematic, scroll-driven editorial/product website.

This is **not** a conventional landing page. Do not simplify it into stacked hero + cards. The entire experience must feel like a continuous digital exhibition in which:

* a persistent cinematic world exists behind the content;
* scroll position behaves like a timeline;
* 3D scenes evolve as the user travels through chapters;
* the desktop navigation becomes part of the composition;
* product UI demonstrations animate independently inside editorial cards;
* dark cinematic chapters cut into bright editorial product grids;
* motion is restrained, elegant, technically precise, and never “template-like.”

The page should feel closer to an interactive museum exhibition / digital art catalogue than a SaaS marketing site.

---

# 1. NON-NEGOTIABLE EXPERIENCE PRINCIPLES

## 1.1 The page must feel continuous

Never make each section look like an independent rectangular webpage module.

The user should perceive one long journey.

When moving from one chapter to the next:

1. the existing cinematic scene finishes its motion;
2. text begins to leave;
3. environmental elements move or fade;
4. the background transitions;
5. the next visual world becomes visible;
6. the next chapter title enters;
7. the sidebar updates its active state.

Avoid abrupt browser-style section cuts unless the design intentionally transitions from a dark cinematic scene to a white editorial content area.

---

## 1.2 Scroll is the master timeline

Use smooth scrolling.

Recommended architecture:

* Lenis or equivalent for smooth scroll;
* GSAP ScrollTrigger or Motion for DOM timelines;
* Theatre.js + Three.js / React Three Fiber for 3D sequencing;
* Rive for interface demonstrations;
* IntersectionObserver for lightweight card/media activation.

Do **not** create a page where animations merely trigger once on viewport entry.

For all major cinematic moments, animation progress should be directly tied to scroll progress.

The user must be able to:

* scroll slowly and inspect intermediate states;
* stop halfway through an animation;
* reverse scroll and reverse the animation;
* move quickly without breaking the sequence.

Use scrubbed timelines.

---

# 2. DESKTOP PAGE GEOMETRY

Maximum content canvas: approximately **1680px**.

On large desktop screens:

* left narrative/navigation rail = approximately **20%**;
* main storytelling content = approximately **80%**;
* left rail maximum width ≈ **336–340px**;
* main content aligns cleanly to the remaining width.

The cinematic background can fill the viewport, but important 3D compositions should respect this 20/80 relationship so foreground subjects do not fight with the navigation.

The left sidebar should behave like part of the art direction, not like a conventional dashboard sidebar.

---

# 3. MOBILE GEOMETRY

Below the large breakpoint:

* remove the persistent 20% sidebar;
* main content becomes full width;
* header height becomes approximately 60px;
* use a hamburger menu;
* cinematic intro areas become shorter;
* use approximately 70svh minimum chapter intro height instead of the ≈140svh desktop treatment;
* use optimized portrait/fallback imagery when full 3D is too expensive;
* replace complex desktop card constellations with horizontal snap carousels where appropriate.

Do not simply scale down the desktop design.

Mobile should feel deliberately recomposed.

---

# 4. TYPOGRAPHIC LANGUAGE

Primary type direction:

* modern grotesque resembling **PP Neue Montreal**;
* compact spacing;
* strong bold editorial headlines;
* neutral body typography;
* tiny technical/footer copy;
* occasional Renaissance/editorial accent typography.

Hero/chapter headings should be oversized and architectural.

The “Renaissance” visual identity should contrast conventional sans-serif letterforms with a more expressive treatment around the letters **AI**, visually reinforcing “RenAIssance.”

Headlines should usually occupy relatively little text but a very large physical area.

Avoid centered generic SaaS typography.

---

# 5. COLOR SYSTEM

Use two principal worlds.

## Dark cinematic world

Near-black / blue-black / charcoal background.

Text:

* warm white;
* pale grey;
* muted cool grey.

3D imagery supplies color.

## Light editorial world

Warm off-white / pale grey background.

Text:

* nearly black;
* grey supporting text.

Transitions between dark and light must feel intentional.

The global header and desktop sidebar must automatically switch foreground color according to the underlying content.

Implement something equivalent to:

`data-nav-theme="dark"`

and

`data-nav-theme="light"`

Do not fake this with a fixed white navigation.

---

# 6. GLOBAL HEADER

Header is fixed at the top of the viewport and above almost everything.

Desktop height ≈ 50px.

Mobile height ≈ 60px.

Content:

Left:

* Shopify icon;
* “Shopify Editions”;
* secondary edition label “Winter ’26”.

Middle:

* Editions dropdown;
* Search.

Right:

* Shopify.com;
* primary “Start for free” pill.

Mobile:

* brand/edition label;
* CTA;
* hamburger.

---

# 7. HEADER INITIAL LOAD ANIMATION

On first page render, desktop navigation items should begin:

* translated vertically upward by approximately their own height;
* opacity 0.

Then animate downward into position while becoming opaque.

Use an ease-out cubic curve.

Use the source stagger:

* brand: ~500ms delay;
* Editions: ~540ms;
* Search: ~580ms;
* Shopify.com: ~620ms;
* Start for free: ~660ms.

Each item should feel as if the interface is dropping softly into place.

Do not bounce.

Duration target: ~450–650ms.

---

# 8. HEADER BACKGROUND BEHAVIOR

Header initially floats transparently over cinematic content.

As readability requires, introduce a very subtle top gradient.

Dark theme:
black → transparent.

Light theme:
light grey → transparent.

Gradient opacity should transition over approximately **300ms**.

Never use an obvious solid navbar unless scroll state requires one.

---

# 9. EDITIONS DROPDOWN

Desktop:

When the user clicks “Editions”:

Initial menu state:

* invisible;
* opacity 0;
* slightly translated upward.

Open state:

* visible;
* opacity 1;
* translate Y → 0.

Duration: approximately **300ms**.

Animate:

* opacity;
* visibility;
* translation.

Menu:

* compact white floating panel;
* rounded corners;
* subtle shadow;
* edition thumbnail;
* edition name;
* subtitle/theme.

Rows gain a subtle grey background on hover.

Mobile version behaves as a bottom-positioned sheet rather than a tiny desktop popover.

---

# 10. SEARCH INTERACTION

Desktop search should not appear as a new unrelated modal.

Instead, the search field slides horizontally into the navigation system.

Closed desktop state:
`translateX(-101%)`.

Open:
`translateX(0)`.

Duration:
approximately **200ms**.

Ease:
standard ease-out.

Mobile:

search interface begins below the viewport / container using `translateY(100%)`.

On activation it slides vertically upward.

The background becomes light.

Input gains focus immediately.

Clear button fades in only when input contains text.

Do not use page reload behavior.

---

# 11. MOBILE MENU

The mobile menu should unfold using layout animation rather than simple `display:block`.

Closed:
`grid-template-rows: 0fr`.

Open:
`grid-template-rows: 1fr`.

Duration:
~300ms.

Ease:
ease-out.

Content opacity transitions simultaneously.

Menu fills the available viewport below the 60px header.

Chapter links are:

Sidekick
Agentic
Online
Retail
Marketing
Checkout
Operations
Shop app
B2B
Finance
Shipping
Developer

Each is a large, bold row with thin translucent separators.

---

# 12. HERO — GENERAL CONCEPT

The opening must immediately communicate:

**“A Renaissance of commerce.”**

Visual vocabulary:

* Renaissance painting;
* dark gallery atmosphere;
* classical composition;
* modern commerce objects;
* Da Vinci construction lines;
* golden-ratio geometry;
* precise drafting marks;
* contemporary typography.

Do not create a generic gradient hero.

The composition should look intentionally surreal: old-master visual language colliding with contemporary commerce.

---

# 13. HERO TECHNICAL STRUCTURE

Allocate roughly **150svh** of scroll distance for the hero cinematic timeline on desktop.

Treat this as a scroll-animation stage.

Recommended setup:

```text
<section class="hero-scroll-stage" style="height:150svh">
    <div class="hero-sticky-viewport">
        3D canvas
        Renaissance artwork
        title
        geometric line system
    </div>
</section>
```

The viewport itself remains pinned/sticky while the 150svh container supplies animation progress.

Map:

0 → 1 scroll progress

to

hero Theatre/GSAP timeline.

---

# 14. HERO — FIRST PAINT

At time 0:

* screen is visually dark;
* main composition already exists but feels partially obscured;
* Renaissance scene is visible;
* geometric construction marks are extremely faint;
* wordmark is not yet fully established;
* navigation begins entering after roughly half a second.

Avoid a spinner if assets arrive quickly.

If loading is necessary, integrate loading into the construction-line animation.

---

# 15. DA VINCI GEOMETRY SYSTEM

Overlay a full-viewport SVG drawing system.

Include:

* central horizontal line;
* central vertical line;
* golden-section vertical divisions;
* golden-section horizontal divisions;
* diagonals corner-to-corner;
* auxiliary golden diagonals;
* spiral construction segments;
* multiple circular arcs;
* corner circles;
* central circles;
* frame/border rectangle.

Use 1px hairlines.

Initial opacity:
very low.

Animate the paths through stroke drawing:

```css
stroke-dasharray: 1;
stroke-dashoffset: 1;
```

then animate dashoffset → 0.

Use different delays for different geometry groups so it feels hand-constructed rather than appearing simultaneously.

Suggested sequence:

0–15% hero progress:
outer frame begins.

10–30%:
major vertical/horizontal divisions draw.

20–45%:
diagonals appear.

30–60%:
circles and spiral segments draw.

Never make it look like a glowing sci-fi HUD.

This must feel like architectural drafting ink.

---

# 16. HERO TITLE

Display:

“The Renaissance Edition”

Large enough to behave like imagery.

Treat the title as custom vector artwork rather than a normal centered H1.

Use separate word groups so parts can animate independently.

Recommended grouping:

* THE
* REN
* AI
* SSANCE
* EDITION

Give “AI” a distinct expressive/italic treatment.

Entrance:

* opacity increases;
* tiny scale increase from roughly 0.96 → 1;
* individual title groups can arrive with 40–80ms offsets.

Keep the movement quiet.

---

# 17. HERO → SIDEBAR MORPH

This is one of the defining transitions.

On desktop, the hero identity should evolve into the persistent left navigation object.

As the user begins scrolling:

1. the giant hero title begins reducing in scale;
2. the visual center migrates toward the left fifth of the viewport;
3. the full-screen Da Vinci grid remains temporarily visible;
4. a rectangular Renaissance proportion frame becomes the sidebar boundary;
5. the title settles inside this 340×464-style navigation frame;
6. chapter links become legible;
7. the geometry outside the sidebar fades;
8. the sidebar remains fixed while the main 80% column becomes the storytelling surface.

Do not cut from hero to sidebar.

The user should subconsciously understand that the opening artwork has transformed into the navigation system.

Suggested scrub window:
hero progress 35% → 90%.

---

# 18. DESKTOP STORY SIDEBAR

Fixed from the beginning of the chapter experience.

Width:
20%.

Navigation composition centered vertically inside a roughly **340:464** frame.

Elements:

top:
custom Renaissance title.

middle/lower:
“A new world of commerce. 150+ product updates.”

then chapter list:
12 chapter links.

Bottom outside/under composition:

* © Shopify Inc
* Terms
* Privacy

The sidebar should feel editorial and sparse.

Use large chapter names and very little visual decoration besides geometric framing.

---

# 19. SIDEBAR ACTIVE STATE

As a chapter enters its active range:

* corresponding sidebar link becomes dominant;
* non-active links slightly reduce contrast;
* color automatically adapts to underlying scene;
* active state transition duration ≈300ms.

Do not use a large filled pill.

A slight opacity/weight shift is enough.

Anchor links should smooth-scroll to the beginning of their chapter.

---

# 20. CINEMATIC BACKGROUND SYSTEM

There are 13 conceptual background scenes:

Hero + 12 chapters.

Each chapter should have:

* its own Theatre.js timeline;
* GLB foreground model(s);
* compressed KTX2 texture/background where appropriate;
* fallback JPG/optimized image;
* portrait/mobile fallback.

Recommended rendering architecture:

ONE persistent fixed WebGL canvas.

Do not destroy/recreate WebGL for every chapter.

Instead:

* preload nearby chapter scenes;
* activate current scene;
* crossfade scenes;
* unload distant heavy assets if needed.

---

# 21. 3D SCENE TRANSITION RULE

Every chapter transition follows this cinematic grammar:

### Enter

Incoming objects begin:

* slightly farther from camera;
* subtly offset;
* lower opacity if using transparent material;
* or outside the camera framing.

As chapter progress reaches 15–25%:

* camera settles;
* subject moves into intended framing;
* title becomes fully readable.

### Middle

Between ~25–70%:

* scene is calm;
* only tiny ambient movement;
* product can be studied.

### Exit

At ~70–100%:

* camera drifts;
* foreground object leaves frame;
* depth separation increases;
* environmental background loses dominance;
* next scene can begin loading/crossfading.

Avoid spinny “3D showcase” animation.

Movement should resemble art-direction photography performed with a virtual camera.

---

# 22. CAMERA MOTION LANGUAGE

Use mostly:

* dolly;
* truck;
* gentle pedestal;
* very mild orbit;
* controlled FOV adjustment.

Avoid full rotations.

Typical scroll-driven range:

```text
camera position delta: 5–15% of scene scale
camera rotation delta: 1–6°
foreground parallax: 10–30%
background parallax: 2–8%
```

Use cinematic easing even though timeline is scrubbed by scroll.

---

# 23. CHAPTER INTRO TEMPLATE

Every major chapter begins with a large cinematic intro.

Desktop:
minimum height ≈ **140svh**.

Mobile:
minimum ≈ **70svh**.

Main content remains in the right 80% on desktop.

Chapter H2:
very large.

Supporting sentence:
short and editorial.

Use dark/white text for all chapter intros except the Developer chapter, which shifts into the light visual world.

The H2 itself uses an opacity transition around **300ms** when hiding/showing during state changes.

---

# 24. CHAPTER 1 — SIDEKICK

## Intro

Large title:

SIDEKICK

Supporting line conveys:
AI-powered Shopify expert / business collaborator.

Background:
dark cinematic Sidekick 3D scene.

The scene should feel layered:

* hero foreground object;
* smaller interface/computing elements;
* star/environment background;
* subtle depth.

Do not immediately reveal the white card grid.

Let the dark chapter breathe.

---

# 25. SIDEKICK — INTRO VIDEO

The first major content beat after the chapter intro is a large video media block.

On entering its viewport:

* media wrapper reveals;
* opacity 0 → 1;
* optional translateY 20–30px → 0;
* optional scale 0.98 → 1;
* duration 600–800ms.

The entire media area is clickable.

Center a restrained “Play Video” affordance.

On hover:

* play affordance gains emphasis;
* image should not dramatically zoom.

---

# 26. VIDEO MODAL

Opening video uses a full-screen overlay.

Overlay:

* fixed;
* entire viewport;
* very high z-index;
* near-black background.

Transition:

1. clicked media can optionally use a shared-element/view-transition effect;
2. backdrop fades 0 → 1 over ~250–350ms;
3. video panel scales from 0.97 → 1 and fades in;
4. playback begins when transition ends.

Close:
reverse.

Close button must remain keyboard reachable.

Escape closes the modal.

Lock background scrolling while open.

---

# 27. SIDEKICK — “INSIGHTS, PROACTIVELY DELIVERED”

Transition from cinematic scene into light editorial content.

The cut should feel like moving from “brand atmosphere” into “product proof.”

Background changes to warm light.

Navigation switches to dark text.

Section heading enters first.

Then feature:
“Smart suggestions”.

Use embedded Rive/UI motion.

Rive should not autoplay forever offscreen.

Start when media becomes viewable.

Pause when sufficiently outside viewport.

---

# 28. GENERIC MEDIA REVEAL

Many page media elements use a shared reveal system.

Create reusable class:

`.animate-show-media`

Initial:

* opacity 0;
* transform translateY(24px) scale(0.985);
* optional clip-path inset(3% 0 3% 0).

In view:

* opacity 1;
* transform none;
* clip-path none.

Recommended:
700ms,
cubic-bezier(0.22, 1, 0.36, 1).

Stagger copy before media by ~80–140ms.

---

# 29. SIDEKICK — CUSTOM APP GENERATION CONSTELLATION

This interaction deserves special treatment.

Desktop contains five floating prompt/application cards arranged like a loose cloud.

They should NOT enter at full size.

Source initial states indicate cards begin at approximately half of their intended base scale with opacity zero.

Final intended visual scales vary approximately:

* card 1: 0.80
* card 2: 0.65
* card 3: 0.75
* card 4: 0.80
* card 5 / primary card: 1.00

Initial rendered scales can begin around:

* .40
* .325
* .375
* .40
* .50

respectively.

Scroll reveal:

0–20%:
all cards hidden.

20–45%:
cards begin expanding outward from their individual origins.

40–65%:
opacity approaches each card's intended hierarchy.

65–100%:
cards reach resting positions.

Use slight differing parallax rates.

Primary card:
scale 1,
opacity 1.

Peripheral cards:
smaller and/or partially transparent.

The result should feel like Sidekick is generating possibilities around the user.

---

# 30. SIDEKICK APP CARD HOVER

Interactive cloud card hover:

* active card moves forward;
* scale rises slightly, e.g. +4–7%;
* opacity → 1;
* surrounding cards lose 5–15% emphasis;
* card shadow increases;
* transition 250–350ms.

Do not dramatically rearrange the entire cloud.

Focus state should behave equivalently to hover.

---

# 31. MOBILE SIDEKICK APP CAROUSEL

Do not use the desktop floating constellation.

Use a horizontally scrollable carousel.

Properties:

* `overflow-x: scroll`;
* `scroll-snap-type: x mandatory`;
* each card: `scroll-snap-align:center`;
* card width ≈65vw on phones;
* ≈50% on larger tablet widths.

First and last items receive generous outer margins so they can center.

Active centered card:
opacity 1.

Inactive cards:
opacity approximately 0.7.

As snapping changes:
smoothly update active card and paired visual/Rive state.

---

# 32. SIDEKICK — COMPLEXITY / DESIGNS / PRODUCT CARDS

Use mixed grid layouts.

Featured product stories can span the full row.

Supporting media cards generally use:

* 2 × half-width;
* or 1/2 + two 1/4 units;
* or 3-column groups.

Each card has:

1. media;
2. small product title;
3. short body;
4. CTA.

Avoid heavy card borders.

Editorial spacing should be more important than decorative containers.

---

# 33. SIDEKICK — SKILLS EXPERIENCE

“Shortcuts for prompts” becomes a visually playful interactive interlude.

Desktop:
use a wide horizontal composition extending beyond the standard right column.

Individual Skill tags sit in a loose row/cloud.

Each tag contains:

* index;
* `/skill-name`;
* hidden/expandable explanatory popup;
* decorative emojis.

---

# 34. SKILL TAG MOTION

Skill tags use playful spring behavior.

For the tag itself:

```css
transition:
  transform 500ms cubic-bezier(0.34,1.56,0.64,1);
```

Nearby row positioning uses approximately:

```css
transition:
  transform 400ms cubic-bezier(0.34,1.56,0.64,1);
```

This is one of the few deliberately bouncy interactions on the website.

Use it sparingly here only.

Inactive tags can sit around opacity 0.5.

Focused/hovered tag:

* scale increases;
* opacity 1;
* surrounding tags shift horizontally to make space.

---

# 35. SKILL TAG POPUP

On activation:

* expand the popup using `grid-template-rows: 0fr → 1fr`;
* opacity 0 → 1;
* duration approximately 300ms;
* use an ease-out/back feel;
* tiny ~50ms delay is acceptable.

Popup anchors either above or below depending on available viewport room.

It must never overflow outside the visible page width.

---

# 36. SKILL EMOJI MOTION

Decorative emoji particles use deliberately varied values.

Randomize each instance:

delay:
~0.3–2.3s.

scale:
~0.6–1.2.

duration:
~1.2–2.4s.

Animate gentle rise/pop/fade.

The result should feel organically random.

Do not synchronize particles.

---

# 37. SIDEKICK END

After the dense Sidekick section:

reduce motion.

Allow whitespace.

Compact textual updates follow without requiring elaborate animations.

The transition to Agentic should progressively return the viewport to a dark cinematic state.

---

# 38. CHAPTER 2 — AGENTIC

Intro:
dark.

Title:
AGENTIC.

Supporting message:
selling directly through AI conversations.

3D environment should contain multiple visual layers:

* main foreground commerce object;
* architectural/window/environment background;
* animated book-like object;
* smaller props.

The scene should feel like the interface and physical Renaissance world are intermixing.

---

# 39. AGENTIC FEATURE

Primary feature:
“Shopify Agentic Storefronts.”

Keep this portion dark rather than immediately moving to white.

Feature enters with generous top padding.

Product copy and media should coexist with the cinematic scene.

Use a large, almost full-width media presentation.

---

# 40. AGENTIC VIDEO

Full-width or nearly full-width.

Reveal using `.animate-show-media`.

Click opens common full-screen video modal.

The visual should continue the dark chapter atmosphere.

After completion:
transition into a light separator/blank surface before Online.

This creates a deliberate visual reset.

---

# 41. CHAPTER 3 — ONLINE

Dark cinematic introduction.

Title:
ONLINE.

Supporting idea:
validate store changes / A-B testing / simulated shoppers.

Scene:
different world from Agentic.

Do not simply recolor the previous scene.

---

# 42. ONLINE — ROLLOUTS

The Rollouts story is a major custom interaction.

Use an oversized light editorial sequence.

Title:
“Test and time your launches with Rollouts.”

Give it approximately **25vh** breathing room before the content settles.

A dedicated canvas/media layer should fade in over approximately **700ms ease-in-out**.

Possible visualization:

* website version A;
* website version B;
* experiment controls;
* timing/launch states.

Scroll should reveal one state transitioning into another.

Avoid a basic static screenshot.

---

# 43. ONLINE — SIMGYM

Follow Rollouts with a major interactive product demonstration.

Use Rive or equivalent.

Animate simulated shoppers / evaluation states / UI results.

The media reveal should be synchronized to scroll entry.

Keep copy stable while the UI demonstration performs its sequence.

---

# 44. ONLINE — LIGHT PRODUCT GRID

Cut into a warm light background.

Show the remaining Online features in an editorial grid.

Prominent media features first:

* store-detail editing;
* mobile theme generation;
* WordPress selling.

Then transition into more compact textual updates.

Compact updates should still have:

* strong headline;
* short description;
* optional inline link;
* thin spacing rhythm.

Do not animate every text item independently with large motion.

A subtle group reveal is enough.

---

# 45. ONLINE — TINKER OUTRO

Online contains another dark cinematic insert near the end.

“Introducing Tinker.”

Give this block approximately 25vh top separation before entry.

Transition light → dark.

Animate media in.

Include “Play Video.”

This creates an unexpected second cinematic beat within one chapter.

Once finished, move into Retail.

---

# 46. CHAPTER 4 — RETAIL

Title:
RETAIL.

Dark 3D intro.

Visual concept:
POS hardware treated almost like a museum artifact.

The object should feel physical, weighty, engineered.

---

# 47. RETAIL — POS HUB THREE-PART STICKY STORY

This is one of the page's strongest scroll structures.

There are three sequential large narrative beats:

1. “Not your standard hub”
2. “Connections that never drop”
3. “The only hub with processing power”

Each story occupies approximately **165svh**.

Inside each:
a viewport-height content block is sticky.

Use approximately:

```css
position: sticky;
top: 110px;
min-height: 100svh;
```

The browser continues scrolling through the 165svh parent while the story remains pinned.

---

# 48. RETAIL STICKY SCENE MOTION

Use the SAME core 3D POS hardware composition through all three stories.

Do not reset the 3D scene every time.

Story 1:
hero product is shown as sculptural object.

During exit:
camera pushes closer / reframes connection surfaces.

Story 2:
hardware ports/connectivity become composition focus.

During exit:
environment shifts and product rotates only slightly.

Story 3:
processing / technical details become visual focus.

Use animated callouts or related icons.

The copy changes while the visual evolves.

The viewer should feel they are circling one artifact through three ideas.

---

# 49. RETAIL TECHNICAL BULLETS

Third POS story includes technical capability items.

Reveal them progressively as the user scrolls.

Use minimal line/icon animations.

Do not create floating neon labels.

The visual language remains industrial/editorial.

---

# 50. RETAIL → LIGHT GRID

After the sticky sequence ends:

release the sticky scene.

3D environment gently loses opacity.

Warm light background rises underneath or replaces it.

Show media cards for:

* compatible scanners;
* subscriptions;
* quick count;
* POS customization;
* same-day delivery.

Then compact product updates.

---

# 51. CHAPTER 5 — MARKETING

Dark intro.

Title:
MARKETING.

Message:
growth through a product network.

Feature scene should feel networked/distributed rather than hardware-focused.

---

# 52. MARKETING — PRODUCT NETWORK

Keep first featured story in dark mode.

Give it substantial vertical spacing.

Primary media:
large and cinematic.

Video interaction:
same shared modal system.

The featured product should visually communicate products surfacing across multiple merchant surfaces.

After featured story:
cut to light editorial background.

---

# 53. MARKETING LIGHT GRID

Use two-column media-heavy arrangement for first updates:

* Shop Campaigns expansion;
* SMS marketing;
* translated forms;
* segmentation search.

Then compact updates beneath.

Media cards reveal with the standard media reveal.

Text items should use no more than tiny upward/fade movement.

---

# 54. CHAPTER 6 — CHECKOUT

Dark intro.

Title:
CHECKOUT.

Message:
personalized checkout / more payment options.

The 3D scene should feel transactional but elegant.

Avoid clichéd credit card animation.

Use sculptural objects and interface fragments.

---

# 55. CHECKOUT LIGHT CONTENT

Transition directly from cinematic dark into light content.

First row:
two 50/50 media cards.

Prominent stories:

* personalized Shop button;
* checkout/accounts customization.

Remaining payment updates become compact text list.

Use high information density but generous gutters.

---

# 56. CHAPTER 7 — OPERATIONS

Dark intro.

Title:
OPERATIONS.

Message:
inventory, workflows, analytics.

Scene should feel analytical/mechanical.

Use globe/data/operations motifs.

Maintain Renaissance materiality rather than pure abstract charts.

---

# 57. OPERATIONS LIGHT GRID

First row:
three equal columns on desktop.

Approximately:
4/12 + 4/12 + 4/12.

Features:

* flexible transfers;
* mobile quick sale;
* Apple Watch metrics.

Reveal the three cards with slight stagger:
0ms,
80ms,
160ms.

Then show dense compact update list.

Do not continue the stagger for every small update.

---

# 58. CHAPTER 8 — SHOP APP

Dark cinematic intro.

Title:
SHOP APP.

Message:
high-intent shoppers / personalized purchasing.

Use a scene emphasizing mobile discovery and personalized merchandise.

---

# 59. SHOP APP GRID

After cinematic intro:
light background.

First feature row:
three equal cards.

Dynamic storefronts
Deals feed
Shoppable videos

Use 4/12 columns each on desktop.

Media inside each card can animate independently.

Next updates are text-first.

---

# 60. CHAPTER 9 — B2B

Dark intro.

Title:
B2B.

Message:
wholesale / global retailers / flexible payments.

Scene should feel geographic and commercial.

Use objects representing international trade rather than a literal spinning globe UI.

---

# 61. B2B LIGHT GRID

Initial media features use two columns.

Examples:

* Collective globally;
* ACH;
* supplier discovery;
* payment requests.

Use 6/12 width.

After these:
move into compact textual capability list.

No unnecessary 3D inside the white grid.

---

# 62. CHAPTER 10 — FINANCE

Dark intro.

Title:
FINANCE.

Message:
modern financial tools.

Cinematic visual can include financial object symbolism, but remain tactile and art-directed.

Avoid generic graphs flying around.

---

# 63. FINANCE GRID

Light area.

Featured arrangement may intentionally be asymmetrical.

Recommended:

* primary feature 6/12;
* two supporting cards 3/12 + 3/12.

This matches the editorial rhythm of the source.

Then compact financial updates.

Maintain calm presentation.

---

# 64. CHAPTER 11 — SHIPPING

Dark intro.

Title:
SHIPPING.

Message:
labels, carriers, speed.

Cinematic scene should introduce physical shipping/logistics artifacts.

Do not depict cartoon trucks.

---

# 65. SHIPPING GRID

Light section.

First row:
two major half-width media cards.

Then compact shipping updates.

Use the same information architecture as Checkout/B2B while varying media composition.

---

# 66. CHAPTER 12 — DEVELOPER

This chapter intentionally changes the visual grammar.

The chapter intro uses a **light navigation theme**.

Do not automatically render another dark intro.

Title:
DEVELOPER.

Message:
new way to build commerce with AI.

3D/environment should transition toward a brighter technical world.

This change signals that the user has entered the final chapter.

---

# 67. DEVELOPER — AGENTIC COMMERCE

Start with a full-width major story:

“Build commerce agents.”

Use a wide media demonstration.

This should feel like the chapter hero after the chapter intro.

Then provide two major media cards:

* Shopify Catalog;
* Checkout Kit.

---

# 68. DEVELOPER — SIDEKICK SUBSECTION

Introduce a subsection title.

Use two half-width cards:

* Sidekick recommendations;
* Sidekick extensions.

Then compact developer updates.

Maintain the same editorial system but allow slightly higher information density.

---

# 69. DEVELOPER — PLATFORM + TOOLS

Another prominent subsection.

Include one full-bleed video story:
“Build with full MCP support.”

Use standard video reveal + video modal.

Follow with media cards for:

* Admin Intents;
* bulk operations;
* metafields/metaobjects;
* Tangle;
* etc.

Finish with compact developer capability updates.

---

# 70. FINAL PAGE END

Do not add a generic giant CTA banner unless supplied content requires it.

The source experience ends naturally through its chapter/content architecture and persistent navigation/footer information.

The finish should feel editorial, not conversion-funnel-heavy.

---

# 71. PRODUCT CARD INTERACTION RULES

For every media/product card:

Default:

* no heavy shadow;
* no giant radius;
* minimal decorative UI;
* image/media does the visual work.

Hover:

* CTA underline or icon motion;
* tiny image scale only if needed: 1 → 1.015;
* duration ~300ms;
* no dramatic card lift.

Links must remain clearly interactive.

---

# 72. CTA ICON MOTION

Small CTA arrow/icon can use a “push out / pop in” interaction.

On hover:

1. existing arrow moves diagonally or horizontally out of icon container;
2. opacity → 0;
3. duplicate/new arrow enters from opposite side;
4. opacity → 1.

Total:
approximately 250–350ms.

The icon motion can be snappier than the card.

---

# 73. INLINE LINKS

Inline links use understated affordances.

Hover:
underline.

Tooltip-style supporting labels may fade in.

Do not convert every link into a pill.

---

# 74. “COMING SOON / GET NOTIFIED” PRODUCT MODAL

Some products can trigger a notification modal.

Desktop:

* fixed viewport overlay;
* dark translucent backdrop ≈90%;
* centered light panel.

Mobile:
full-width / bottom-sheet-like behavior.

Entrance:
backdrop fade 250ms;
panel translateY 16–30px → 0;
panel opacity 0 → 1;
optional scale 0.98 → 1.

Close reverses.

Escape support mandatory.

---

# 75. PRODUCT / MERCH MODAL

For merchandise/product interactions:

Desktop panel:
approximately 400px max width.

Position toward the right side of the viewport rather than dead center, preserving the editorial composition.

Mobile:
full-screen or bottom-sheet treatment.

Panel should animate independently from the dark backdrop.

---

# 76. ACCESSIBILITY “BACK TO NAVIGATION”

Include keyboard-accessible chapter escape controls.

Source behavior hides the button below the visible edge:

approximately:
`translateY(calc(100% + 2px))`.

On keyboard focus:
translate Y → 0.

Duration:
~200ms ease-out.

This is principally an accessibility affordance.

Do not turn it into a permanently floating visual button unless required on mobile.

---

# 77. SECTION CUT LANGUAGE

There are three types of transitions.

## A. Cinematic → cinematic

Example:
Agentic → Online.

Use overlapping environment/camera transition.

No hard white flash.

## B. Cinematic → editorial light

Use:
foreground visual recedes,
background brightness changes,
light surface rises or fades in,
text color changes.

Target perceptual duration:
400–800ms.

## C. Light editorial → dark cinematic

Example:
Online product grid → Tinker.

Dark background should gradually take over before the new scene becomes dominant.

Avoid instantaneous `background:black`.

---

# 78. DO NOT OVER-ANIMATE THE WHITE CONTENT

The white editorial sections are a breathing mechanism.

Most animation should be:

* media reveal;
* tiny copy reveal;
* interactive UI/Rive motion;
* hover states.

Do not scroll-scrub every sentence.

The contrast between cinematic chapters and calm product grids is essential.

---

# 79. RIVE BEHAVIOR

For Rive demonstrations:

load lazily.

When `data-viewable-component` is in view:

* initialize if needed;
* autoplay relevant state machine;
* keep transparent canvas correctly sized.

When far outside viewport:
pause.

When user returns:
continue or restart depending on demonstration intent.

Never let 20 Rive instances simultaneously consume GPU/CPU.

---

# 80. 3D PERFORMANCE

Use:

* Draco or Meshopt compression;
* KTX2 textures;
* glTF/GLB;
* adaptive DPR;
* progressive preloading.

DPR:
cap around 1.5–2 on high-density desktops.

On weak devices:
reduce DPR to 1.

Only current, previous, and next major scene should need high-priority resources.

---

# 81. FALLBACK STRATEGY

Every cinematic chapter must have a static fallback.

Use:

desktop:
landscape fallback.

mobile:
portrait fallback.

Fallback is not a broken state.

It must preserve:

* crop;
* color;
* title legibility;
* chapter transition.

If WebGL fails, the website should still feel intentionally designed.

---

# 82. WEBGL → FALLBACK CROSSFADE

If switching between fallback and active canvas:

canvas starts opacity 0.

When first stable frame is ready:
opacity 0 → 1 over approximately 700ms ease-in-out.

Then remove or hide fallback.

Never show a black flash.

---

# 83. SMOOTH SCROLL

Use Lenis-style interpolation.

Do not make scrolling excessively viscous.

Target:
responsive enough for product browsing but smooth enough for cinema.

Wheel input must not lag far behind.

Recommended conceptual values:
lerp around 0.08–0.12.

Honor anchor navigation correctly despite smooth scrolling.

---

# 84. SCROLL RESTORATION

If the user navigates away and returns:

restore scroll position when possible.

Do not always reset the long experience to zero.

If navigating by chapter hash:
initialize directly near the desired chapter without forcing the entire hero animation to replay.

---

# 85. RESPONSIVE CHAPTER INTRO

Desktop:
140svh minimum gives time for 3D choreography.

Tablet:
roughly 100–120svh.

Mobile:
70–90svh depending on content.

Mobile title should generally settle lower in the screen rather than being vertically centered.

This gives more space to imagery above.

---

# 86. MOBILE 3D STRATEGY

Prioritize stability over perfect equivalence.

For mobile:

* simplify 3D objects;
* use lower-resolution textures;
* reduce environmental layers;
* switch some scenes entirely to optimized static images;
* preserve DOM product animations;
* retain dark/light chapter transitions.

The experience should still feel cinematic.

---

# 87. MOTION REDUCTION

Respect:

`prefers-reduced-motion: reduce`.

In reduced mode:

* disable scroll-scrub object travel;
* show stable representative scene states;
* remove elastic overshoot;
* reduce large translate effects;
* keep simple 150–250ms fades;
* allow Rive only if motion is essential and non-distracting.

Content cannot depend on animation to become accessible.

---

# 88. Z-INDEX SYSTEM

Establish deliberate layers:

0:
scene/background.

10–20:
editorial media.

50–100:
sidebar / local navigation.

9999:
global header.

10000+:
merch/product overlays.

10004+:
video modal.

Never randomly increase z-index to fix bugs.

---

# 89. POINTER-EVENT ARCHITECTURE

Large decorative section wrappers can use:

`pointer-events:none`.

Explicit interactive children:
`pointer-events:auto`.

This prevents the fixed cinematic layer and decorative overlays from stealing clicks.

Use this pattern consistently.

---

# 90. PRELOADING STRATEGY

At initial load:

Priority 1:
hero visual,
hero scene,
fonts,
nav icon assets.

Priority 2:
Sidekick scene.

After hero becomes stable:
preload Agentic.

While Sidekick is active:
preload Online.

Continue one chapter ahead.

Rive assets should generally load when within ~1–2 viewport heights.

Do not download all 150+ product assets at initial render.

---

# 91. IMAGE LOADING

Above fold:
eager.

Below fold:
lazy.

Maintain explicit aspect ratios to prevent layout shift.

For media:
use responsive sources.

For decorative images:
no alt text.

For product demonstration images:
meaningful alt text.

---

# 92. PAGE STATE MACHINE

Think of the entire website as states:

```text
BOOT
↓
HERO_LOADING
↓
HERO_ACTIVE
↓
SIDEBAR_TRANSITION
↓
CHAPTER_SIDEKICK
↓
CHAPTER_AGENTIC
↓
CHAPTER_ONLINE
↓
CHAPTER_RETAIL
↓
CHAPTER_MARKETING
↓
CHAPTER_CHECKOUT
↓
CHAPTER_OPERATIONS
↓
CHAPTER_SHOP
↓
CHAPTER_B2B
↓
CHAPTER_FINANCE
↓
CHAPTER_SHIPPING
↓
CHAPTER_DEVELOPER
↓
END
```

Each chapter additionally contains:

```text
INTRO_ENTER
INTRO_ACTIVE
CONTENT_TRANSITION
EDITORIAL_ACTIVE
INTRO_EXIT
```

Special chapters override this:
Sidekick,
Online,
Retail,
Marketing,
Developer.

---

# 93. ACTIVE CHAPTER DETECTION

Do not determine active section merely when its top reaches the viewport.

Use a weighted center threshold.

Conceptually:

```javascript
active =
section whose narrative anchor is closest to
40–50% of viewport height
```

Update:

* sidebar state;
* nav theme;
* scene;
* URL hash if desired.

Avoid jitter around boundaries.

Use hysteresis/debounce.

---

# 94. 3D SCENE CROSSFADE

When changing cinematic scene:

incoming environment can preload at opacity 0.

Over roughly 400–700ms / corresponding scroll span:

outgoing:
opacity 1 → 0.

incoming:
opacity 0 → 1.

At midpoint:
both exist.

Use depth/camera motion to hide the technical crossfade.

Do not visually dissolve two unrelated objects directly over each other if it looks messy.

---

# 95. AMBIENT MOTION

When scroll stops:

allow extremely subtle looping motion where appropriate.

Examples:

* 1–2px equivalent camera float;
* slow suspended object movement;
* tiny lighting change.

Amplitude must be almost imperceptible.

The page must not feel alive in a distracting videogame sense.

---

# 96. LIGHTING

3D lighting should mimic editorial photography / museum display.

Use:

* soft key;
* broad fill;
* rim when necessary;
* subtle environment reflections.

Avoid saturated colored point lights unless they exist naturally in the artwork.

Objects need visible material texture.

---

# 97. VISUAL RHYTHM

Use a repeating pattern:

```text
CINEMATIC
→ PRODUCT PROOF
→ DENSE INFORMATION
→ BREATHING SPACE
→ NEXT CINEMATIC
```

This rhythm is more important than any single animation.

Never place cinematic scene after cinematic scene with no informational relief.

Never place five white grids in a row without a visual reset.

---

# 98. MICRO-TIMING SYSTEM

Use these timing families consistently:

50ms:
very small state response.

200ms:
search/input/button micro-interactions.

250–350ms:
hover and simple fades.

300ms:
menu/dropdown/theme transitions.

400ms:
springy positional changes.

500ms:
elastic Skill tag scale.

600–800ms:
major media reveals / canvas fades.

Scroll-scrub:
controlled by viewport progress rather than fixed duration.

Do not randomly choose animation durations.

---

# 99. EASING SYSTEM

Core ease:

```css
cubic-bezier(0.22,1,0.36,1)
```

for cinematic UI reveals.

Standard ease-out:
menus/search.

Spring/back:
only playful Sidekick Skill elements.

Source-inspired elastic curve:

```css
cubic-bezier(0.34,1.56,0.64,1)
```

Do not use bounce easing for general page content.

---

# 100. BUILD QUALITY REQUIREMENTS

The result is unacceptable if:

* it looks like a standard Tailwind landing page;
* 3D scenes only autoplay instead of responding to scroll;
* the desktop sidebar is missing;
* the hero does not transform into the navigation concept;
* dark/light theme changes are abrupt;
* every section uses the same grid;
* every card uses the same animation;
* mobile is only scaled desktop;
* scroll causes dropped frames;
* scenes flash while loading;
* chapter navigation breaks smooth-scroll state;
* content becomes inaccessible without JavaScript;
* reduced-motion mode is ignored.

---

# 101. REQUIRED DOM / ROUTE ANCHORS

Preserve these chapter anchors exactly:

```text
#sidekick
#agentic
#online
#retail
#marketing
#checkout
#operations
#shop-app
#b2b
#finance
#shipping
#developer
```

This keeps desktop sidebar, mobile navigation, deep linking, and history behavior consistent.

---

# 102. COMPONENT ARCHITECTURE

Recommended structure:

```text
<App>
  <GlobalHeader />

  <ExperienceShell>
    <SceneCanvas />
    <DavinciGeometry />

    <DesktopStorySidebar />

    <HeroScene />

    <MainContent>
      <SidekickChapter />
      <AgenticChapter />
      <OnlineChapter />
      <RetailChapter />
      <MarketingChapter />
      <CheckoutChapter />
      <OperationsChapter />
      <ShopChapter />
      <B2BChapter />
      <FinanceChapter />
      <ShippingChapter />
      <DeveloperChapter />
    </MainContent>
  </ExperienceShell>

  <ProductNotificationModal />
  <VideoModal />
  <MerchModal />
</App>
```

Reusable primitives:

```text
ChapterIntro
CinematicScene
EditorialSection
FeatureCard
MediaFeature
RiveMedia
VideoFeature
CompactUpdateList
StickyNarrative
SectionHeading
CTA
InlineLink
SkillTag
Modal
```

---

# 103. DATA-DRIVEN CONTENT

Do not hardcode 150 individual product modules manually inside page components.

Create data structures:

```javascript
{
  chapter: "online",
  theme: "dark",
  intro: {...},
  featuredStories: [...],
  mediaCards: [...],
  compactUpdates: [...]
}
```

Then render reusable layouts.

Allow a layout field:

```text
full
half
quarter
third
fullBleed
sticky
video
rive
compact
```

This makes it possible to reproduce the uneven editorial composition.

---

# 104. FINAL VISUAL TARGET

The finished page should evoke this emotional journey:

### Opening

“I have entered an artwork.”

### First scroll

“This artwork is becoming the interface.”

### Sidekick

“This product is alive and intelligent.”

### Middle chapters

“I am discovering a huge amount of information without feeling like I am reading documentation.”

### Retail

“I am inspecting a physical artifact in a gallery.”

### Later chapters

“The site keeps changing rhythm so I remain curious.”

### Developer

“The visual world brightens and becomes forward-looking.”

### End

“I have traveled through a complete Edition rather than scrolled through a landing page.”

That perception is the primary success criterion.

---

# 105. FINAL COMMAND TO THE CODING AI

Build this as a **production-quality interactive editorial website**, not a visual mockup.

Preserve:

* the 20/80 desktop composition;
* fixed story sidebar;
* 150svh hero timeline;
* approximately 140svh desktop cinematic chapter intros;
* 70svh+ mobile chapter intros;
* separate cinematic scenes;
* scroll-scrubbed animation;
* Renaissance geometry;
* dark/light theme switching;
* Rive product demonstrations;
* special Sidekick cloud/card interactions;
* elastic Skill tags;
* Retail's 165svh sticky triptych;
* large media reveals;
* responsive snap carousels;
* full-screen video modal;
* product notification modal;
* accessibility and reduced-motion behavior.

Use the supplied HTML as the source of truth for:

* exact copy;
* section order;
* links;
* images;
* IDs;
* product groups;
* CTAs.

Do not simplify interactions simply because they are difficult.

Where exact proprietary scene animation keyframes are unavailable, recreate their intent using scroll-controlled Theatre.js/GSAP timelines and the movement grammar defined above.

Before considering the build complete, test:

* 1440×900 desktop;
* 1680×1050 large desktop;
* 1024×768 tablet;
* 390×844 mobile;
* keyboard-only navigation;
* reduced-motion mode;
* slow network;
* WebGL disabled;
* rapid scroll;
* reverse scroll;
* direct navigation to every chapter hash.

The final experience should maintain **60fps wherever realistically possible** and should feel like one continuous cinematic publication.
