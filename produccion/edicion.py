#!/usr/bin/env python3
"""
Cut the plates the Edition needs, from her own files only.

Same discipline as placas.py: originals are never written to, and every crop
says where it came from and why, because _shared/engineering/edicion-plan.md is
built on measured numbers and a silent re-crop would invalidate it.

The hero is a retablo built entirely from her four painted portraits. No museum
art enters it. Public-domain art is used exactly once on the whole page, in
chapter III, and that plate is already cut in public/cine/a3-ingres.avif.
"""
from __future__ import annotations
import os
import numpy as np
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ILUS = os.path.join(RAIZ, 'produccion', 'fuentes', 'drive', '03-ilustraciones')
OUT = os.path.join(RAIZ, 'public', 'edicion')
os.makedirs(OUT, exist_ok=True)


def guardar(im, nombre, ancho=None, q=64):
    if ancho and im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    p = os.path.join(OUT, nombre + '.avif')
    im.save(p, quality=q)
    print(f'  {nombre:22s} {im.width}x{im.height}  {os.path.getsize(p)//1024} KB')
    return im


def fondo(im):
    """The flat ground colour, taken from the four corners.

    Measured: every one of these files is genuinely flat at the edges, so the
    median of the corners is the ground and extending it invents nothing. This
    is what makes the panels bleed without upscaling anything.
    """
    a = np.asarray(im.convert('RGB')).astype(np.int16)
    c = np.array([a[0, 0], a[0, -1], a[-1, 0], a[-1, -1]])
    return tuple(int(v) for v in np.median(c, axis=0))


def caja(im, tol=28):
    """Bounding box of the subject: everything far enough from the ground."""
    a = np.asarray(im.convert('RGB')).astype(np.int16)
    d = np.abs(a - np.array(fondo(im))).sum(axis=2)
    m = d > tol
    cols = np.where(m.any(axis=0))[0]
    rows = np.where(m.any(axis=1))[0]
    return int(cols.min()), int(rows.min()), int(cols.max()), int(rows.max())


def panel(archivo, pw, ph, ocupa=0.86, anclaje=0.5):
    """One retablo panel: her portrait whole, on its own ground extended to fill.

    NOTHING IS CROPPED. The plan's law is that her illustrations are never cut
    to a card aspect, and the measurements are why it has to be honoured by
    scale instead: three of the four figures already fill 85-91% of their frame,
    so narrowing a panel by cropping would take the shoulders off three of her
    four paintings.

    A polyptych's side panels hold smaller figures than its centre anyway, so
    scale does the work a crop would have done, and does it honestly -- the cell
    shrinks, the ground grows, which is the rule already applied to Isabella and
    the lobo cover at 1x.

    The fit is driven by the SUBJECT, not the file. Fitting the file to the panel
    height overflows a narrow wing by 2.5x and the clamp then slices the face off
    at the panel edge, which is what the first render did. `ocupa` is the
    fraction of the panel width her figure is to occupy.
    """
    src = Image.open(os.path.join(ILUS, archivo)).convert('RGB')
    g = fondo(src)
    x0, y0, x1, y1 = caja(src)
    sw, sh = x1 - x0, y1 - y0

    lienzo = Image.new('RGB', (pw, ph), g)

    # Fit the subject inside the panel on BOTH axes. Scaling by width alone
    # leaves a tall subject short in a tall panel -- A6's elongated neck runs
    # 0.85:1 and came out floating in the upper third of its wing.
    f = min((pw * ocupa) / sw, (ph * ocupa) / sh)
    w, h = max(1, round(src.width * f)), max(1, round(src.height * f))
    obra = src.resize((w, h), Image.LANCZOS)

    # Horizontal: centre the subject in the panel at `anclaje`.
    px = round(pw * anclaje - ((x0 + x1) / 2) * f)

    # Vertical: a figure that runs off the bottom of its own file is a figure
    # standing on the panel floor, so keep it there -- bottom-align it and let it
    # bleed. Floating it mid-panel (what the first render did) reads as a
    # photograph cut out and dropped in, which is the one thing an altarpiece
    # panel must not look like. A9 touches no edge, so it is centred.
    if y1 >= src.height - 6:
        py = ph - h
    else:
        py = round((ph - h) / 2 + ph * 0.04)

    lienzo.paste(obra, (px, py))
    return lienzo


print('EL RETABLO — four panels, her work only')

# A3 is the dominant centre: it is the ONLY file with real side margin (subject
# spans 58% of the frame against 82-87% for the others), so it is the one that
# can carry a wide panel without either cropping or floating in dead ground.
# It is also the copper hair, which is the plane that keeps moving through the
# fold, and it is already cut as an alpha plane in public/cine/a4-pelo-plano.avif.
# Panel heights STEP, the way a real retablo's do: the centre rises, the wings
# sit lower and shorter. This is not decoration -- it is the only geometry that
# fits her work. Her portraits are square-ish head-and-shoulders, so a panel at
# 1:3.5 can hold one only by cropping it or shrinking it to a stamp, which is
# exactly what the two previous renders did. A wing at roughly 3:4 holds a whole
# portrait at a readable size, and the stepped silhouette is what makes the
# thing read as an altarpiece rather than four slats.
W, H = 1680, 1050
# Each panel's aspect is set from its own subject's aspect, measured, so the
# figure fills it without crop and without floating:
#   A7 subject 2610x2894 -> 1.11 h/w     A3 1753x2950 -> 1.68
#   A6 2559x2999 -> 1.17                 A9 1682x1971 -> 1.17
PANELES = [
    # file,                    x    y    w    h  ocupa anch  ground   role
    ('Untitled_Artwork 7.png',  60, 300, 360, 470, 0.96, 0.50),  # #FFFFFE outer wing
    ('Untitled_Artwork 3.png', 450,  40, 580, 1010, 0.90, 0.44),  # #888866 CENTRE
    ('Untitled_Artwork 6.png', 1062, 250, 310, 400, 0.92, 0.50),  # #B7BEBE wing
    ('Untitled_Artwork 9.png', 1400, 390, 240, 300, 0.94, 0.50),  # #CFB5AF outer wing
]

# A warm near-black, never blue-black: her work is warm and a cool ground would
# fight every one of the four grounds sitting on it.
retablo = Image.new('RGB', (W, H), (18, 15, 14))
for archivo, x, y, pw, ph, ocu, anc in PANELES:
    p = panel(archivo, pw, ph, ocu, anc)
    retablo.paste(p, (x, y))
    # THE CARD IS THE SAME COMPOSITION AT 2x, and the retablo keeps the 1x
    # paste so the hero plate is unchanged.
    #
    # §29's cloud renders these at 172-361 CSS px on a 1680 desktop and they
    # shipped at their panel size: 240px for Untitled_Artwork 9 against a 198px
    # box. At DPR 1 that is fine and on any retina display all four are
    # upscaled — the smallest of her four paintings by 1.65x, on the chapter
    # about her drawing. The panel geometry is unchanged; only the resolution
    # it is rendered at doubles.
    guardar(panel(archivo, pw * 2, ph * 2, ocu, anc),
            'panel-' + archivo.split()[-1].replace('.png', ''), pw * 2)

guardar(retablo, "hero-retablo", 1680, q=68)

# ------------------------------------------------------------------ LAMINAS
# §30 and §32's destination for the five constellation cards.
#
# §32 asks every editorial card for a title, a short body AND a CTA, and §30
# asks the cloud's cards for a focus state equivalent to their hover state.
# Both were half-built for the same reason: the cards had nowhere to go, so
# `:focus-within` could never fire and a CTA would have pointed at nothing.
#
# NOT the retablo panel, which is a composite: panel() above rescales the
# subject to 90-96% of an altarpiece aspect and puts it on a ground synthesised
# from the median of the source's four corners. This is her original file,
# reduced and nothing else, which is what makes the cards' own captions —
# "3000 × 3000 px", "2048 × 2732 px" — true of the thing that opens.
#
# The ten plate-wall cards get no destination and that is measured rather than
# assumed: six of their ten sources are 900px or smaller against a modal panel
# of min(92vw, 1400px), so "see it larger" would display them UP TO 1.56x
# upscaled — blurrier per pixel than the card it came from. A control making a
# claim the file cannot keep is the invention rule applied to an affordance.
# Here there is 7-11x of her own headroom behind every one of the five.
LAMINAS = [
    ('pelo-cobre', 'Untitled_Artwork 3.png'),
    ('panuelo',    'Untitled_Artwork 7.png'),
    ('modigliani', 'Untitled_Artwork 6.png'),
    ('nube',       'Untitled_Artwork 9.png'),
    ('ceguera',    'Untitled_Artwork 8.png'),
]

print('\nLAMINAS — the five drawings whole, for the card destinations')
for _slug, _archivo in LAMINAS:
    guardar(Image.open(os.path.join(ILUS, _archivo)).convert('RGB'),
            'lamina-' + _slug, 2000, q=58)

# The one anachronism, on its NATIVE cream. Measured: the sweater is #3060A0,
# so on a cobalt ground it would sit at 1.06:1 and the black contour would drop
# from 18.43:1 to 3.51:1. placas.py already reasoned this and chose cream; the
# figure is cut to alpha here so it can stand in front of the panels instead.
cg = Image.open(os.path.join(ILUS, 'Untitled_Artwork 8.png')).convert('RGB')
x0, y0, x1, y1 = caja(cg)
a = np.asarray(cg).astype(np.uint8)

# The cut has to be a flood fill from the border, NOT a colour-distance
# threshold. Her trousers, her face and her hands are the SAME cream as the
# ground, so thresholding punched holes straight through the figure and the
# near-black behind it showed through as black trousers. Only the ground that
# is actually connected to the edge is background.
d = np.abs(a.astype(np.int16) - np.array(fondo(cg))).sum(axis=2)
es_fondo = (d <= 18).astype(np.uint8) * 255

# Flood from a 1px border, which guarantees a seed on the outside whatever the
# figure touches. PIL's fill is fast enough here and needs no scipy.
from PIL import ImageDraw
# The pad must be the BACKGROUND value, not zero. Padding with 0 and filling
# from the corner spreads the fill through the figure instead of around it,
# which is how the first attempt produced an opaque white rectangle.
m = Image.new('L', (cg.width + 2, cg.height + 2), 255)
m.paste(Image.fromarray(es_fondo, 'L'), (1, 1))
ImageDraw.floodfill(m, (0, 0), 128, thresh=0)
fuera = np.asarray(m)[1:-1, 1:-1] == 128

al = np.where(fuera, 0, 255).astype(np.uint8)
rgba = Image.fromarray(np.dstack([a, al]), 'RGBA')
fig = guardar(rgba.crop((x0, y0, x1, y1)), 'ceguera-figura', 1100)

# The complete static hero: the retablo with the anachronism standing in front
# of it, lower right. This file is BOTH the shipping hero for the static ticket
# and the permanent reduced-motion / WebGL-off fallback, so it has to be the
# whole composition and not just the panels. In the live DOM the figure is its
# own layer, because it has to move independently of the fold.
# She is cut by the bottom of the frame rather than floated inside it. A
# foreground figure that fits entirely within the composition reads as another
# panel; one the frame crops reads as standing in the room in front of it.
# Placed so her head clears the painted faces -- two faces overlapping at the
# same scale just muddles both.
fh = 690
f2 = fig.resize((round(fig.width * fh / fig.height), fh), Image.LANCZOS)
completo = retablo.copy()
completo.paste(f2, (1004, H - 590), f2)
guardar(completo, 'hero-retablo-completo', 1680, q=68)

print('\nGROUNDS (for the CSS custom properties)')
for f in ['Untitled_Artwork 3.png', 'Untitled_Artwork 6.png',
          'Untitled_Artwork 7.png', 'Untitled_Artwork 9.png',
          'Untitled_Artwork 8.png']:
    g = fondo(Image.open(os.path.join(ILUS, f)))
    print(f'  {f:26} #{g[0]:02X}{g[1]:02X}{g[2]:02X}')

# ---------------------------------------------------------------- PLANCHAS
# Chapter IV's product demonstrations.
#
# The brief names Rive for these (sections 79 and 105). Rive is out: exporting a
# .riv needs a paid plan, and the terms for a locally built one are documented
# nowhere -- an undocumented grant is not a grant. Its runtime is also 882kB
# gzip before any content, it bakes text out of messages/ and out of ghost, and
# it draws a blank rectangle with JS off.
#
# What replaces it is better than a rebuilt mock: her OWN full-length delivered
# screens, scrubbed through a phone-sized frame. The moving thing is her work.
#
# These are extracted rather than rebuilt for a specific reason. Every proposal
# wanted a four-phase Vibe state machine -- menstrual, folicular, ovulatoria,
# lutea -- but only FASE LUTEA exists at high fidelity in the 51-page memoria;
# the other three are medium-fidelity wireframes on one page. Building that demo
# would mean writing three phases of health advice about a real product she
# shipped, under her name. The same rule that governs chapter I forbids it.
import subprocess, glob, tempfile

def planchas():
    # (pdf, page, exact height, out name, note)
    #
    # The height is EXACT, not a minimum, and for Voluntee that matters. Page 41
    # holds two tall captures: 375x2085 and 375x1471. The taller one is the
    # obvious pick and it is the wrong one -- it still carries Lorem ipsum and a
    # card reading "Reorganizar algo, porque esto es un texto de prueba". Running
    # placeholder copy full-size and scrubbed on her portfolio would show
    # unfinished work as finished, which is worse than showing nothing. The
    # 1471px capture is the delivered Filtros Avanzados screen, complete.
    fuentes = [
        ('vibe-app-memoria.pdf',      43, 3012, 'plancha-vibe',     'AGENDA, full scroll'),
        ('voluntee-app-slides.pdf',   41, 1471, 'plancha-voluntee', 'Filtros avanzados'),
    ]
    orig = os.path.join(RAIZ, 'produccion', 'originales')
    for pdf, pagina, alto_exacto, nombre, nota in fuentes:
        ruta = os.path.join(orig, pdf)
        if not os.path.exists(ruta):
            print(f'  {nombre:20s} SKIP (source not on disk)')
            continue
        with tempfile.TemporaryDirectory() as tmp:
            subprocess.run(['pdfimages', '-f', str(pagina), '-l', str(pagina), '-png',
                            ruta, os.path.join(tmp, 'x')], check=True,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            mejor = None
            for f in sorted(glob.glob(os.path.join(tmp, '*.png'))):
                im = Image.open(f)
                # Tall and narrow: a scrolling capture, not a page illustration.
                if im.height == alto_exacto and im.height / im.width > 3:
                    mejor = im.copy()
                    break
            if mejor is None:
                print(f'  {nombre:20s} SKIP (no {alto_exacto}px capture on p{pagina})')
                continue
            # Not upscaled, ever -- the small-art law. 428px is her export width.
            guardar(mejor, nombre, None, q=58)
            print(f'  {"":20s} {nota}')

print('\nPLANCHAS — her delivered screens, for chapter IV')
planchas()


# ------------------------------------------------------------- LA SECUENCIA
# Chapter IV's state-to-state sequence — brief section 42.
#
# Section 42 asks for a scrubbed sequence in which "scroll should reveal one
# state transitioning into another", and says in as many words: "avoid a basic
# static screenshot." The planchas above pan down ONE screen; that is section
# 43's demonstration, not this one.
#
# THESE ARE FOUR REAL STATES OF VIBE, and the distinction from the four-phase
# state machine refused above matters. That one was refused because only `fase
# lutea` exists at high fidelity and building it would have meant WRITING three
# phases of health advice about a shipped product, under her name. Nothing is
# written here. These are four screens she delivered, at full fidelity, in the
# order the product itself puts them in:
#
#   1  Datos de tu ciclo   the two questions onboarding asks
#   2  Mi ciclo            what it computes from them: day 23, fase lutea
#   3  Check in            the daily record that corrects the prediction
#   4  Agenda              the week rewritten from the phase
#
# Screen 2 carries a button reading "Ver mi agenda / Optimiza tu semana por
# fase" and screen 3 reads "Tu actualizacion diaria nos ayudara a mejorar
# nuestras predicciones", so the loop between them is the product's own claim
# and not an edge invented here to make a sequence.
#
# The 2x export name is wishful: every file is 432x886, which is a 1x iPhone 15
# Pro. pdfimages confirms the memoria embeds the same mockups at 431x885, so
# 393px is the best resolution that exists and the frame is capped to suit.
SECUENCIA = [
    ('iPhone 15 Pro - White (1).png',         'estado-vibe-1', 'Datos de tu ciclo'),
    ('iPhone 15 Pro - White flatten-4.png',   'estado-vibe-2', 'Mi ciclo, dia 23'),
    ('iPhone 15 Pro - White flatten-3.png',   'estado-vibe-3', 'Check in diario'),
    ('iPhone 15 Pro - White flatten-1.png',   'estado-vibe-4', 'Agenda, fase lutea'),
]

# The screen rect inside the drawn device.
#
# MEASURED BY COLUMN, NOT BY A SINGLE ROW, and that distinction cost a render.
# Reading one row across the middle put the left edge at 19, which is an
# antialiased pixel on that row alone: column 19 is the black bezel for 745 of
# the 853 rows, and it shipped as a hard black hairline down the left edge of
# every state. What decides each edge here is the share of rows (or columns)
# on which a candidate line is bright, over the whole run, for all four files.
# 392x854 against the iPhone 15 Pro's own 393x852pt, so it checks out against
# the device the mockup claims to be.
PANTALLA = (20, 17, 412, 871)

# The device is kept OUT. The page's rule (see .edicion-plancha__marco) is that
# a drawn bezel around a screenshot is the oldest tell in a junior portfolio,
# and these four sit a screen above two planchas that already obey it.
#
# Cropping to the screen rect still leaves the arc of the device's own rounded
# screen in each corner, and the obvious answer -- mask the corners to the
# frame's white -- IS WRONG HERE, which is worth writing down because it was
# built that way first. The states transition by wiping one over another, so
# two of them are on screen side by side for the length of every transition,
# and a plate with rounded corners puts a white quarter-disc at the seam. The
# frame does the rounding; the plate must be a plain rectangle.
#
# So the corner is not masked, it is EXTENDED: every pixel outside the screen's
# rounded corner is replaced by the nearest pixel on the arc, projected
# radially. The corners of all four screens are her flat marble ground, so what
# the extension paints is the colour that was already there.
RADIO = 62


def secuencia():
    base = os.path.join(RAIZ, 'produccion', 'fuentes', 'drive', '04-apps',
                        'vibe-figma-2x')
    for archivo, nombre, nota in SECUENCIA:
        ruta = os.path.join(base, archivo)
        if not os.path.exists(ruta):
            print(f'  {nombre:22s} SKIP (source not on disk)')
            continue
        pant = np.asarray(Image.open(ruta).convert('RGB').crop(PANTALLA)).copy()
        h, w = pant.shape[:2]
        r = RADIO
        ys, xs = np.mgrid[0:r, 0:r]
        # Distance from the corner circle's centre, for the top-left quadrant.
        d = np.hypot(r - 1 - xs, r - 1 - ys)
        fuera = d > r - 1
        # The point on the arc that this pixel projects onto, in quadrant
        # coordinates. Clamped so a pixel exactly on the centre cannot divide
        # by zero.
        k = (r - 1) / np.maximum(d, 1e-6)
        px = np.rint((r - 1) - (r - 1 - xs) * k).astype(int)
        py = np.rint((r - 1) - (r - 1 - ys) * k).astype(int)
        px = np.clip(px, 0, r - 1)
        py = np.clip(py, 0, r - 1)
        for vol_y, vol_x in ((False, False), (False, True), (True, False), (True, True)):
            # One quadrant at a time, flipped into place, so the same maths
            # serves all four corners.
            cuad = pant[h - r:, :] if vol_y else pant[:r, :]
            cuad = cuad[:, w - r:] if vol_x else cuad[:, :r]
            trabajo = cuad[::-1] if vol_y else cuad
            trabajo = trabajo[:, ::-1] if vol_x else trabajo
            trabajo = trabajo.copy()
            trabajo[fuera] = trabajo[py[fuera], px[fuera]]
            trabajo = trabajo[:, ::-1] if vol_x else trabajo
            trabajo = trabajo[::-1] if vol_y else trabajo
            if vol_y and vol_x:
                pant[h - r:, w - r:] = trabajo
            elif vol_y:
                pant[h - r:, :r] = trabajo
            elif vol_x:
                pant[:r, w - r:] = trabajo
            else:
                pant[:r, :r] = trabajo
        guardar(Image.fromarray(pant), nombre, None, q=58)
        print(f'  {"":22s} {nota}')


print('\nLA SECUENCIA — four delivered states of Vibe, for chapter IV')
secuencia()


# ----------------------------------------------------------------- EL OFICIO
# Chapter VI's media — brief section 67.
#
# §67 asks the closing chapter to open with "a full-width major story" that
# "should feel like the chapter hero after the chapter intro", then "two major
# media cards". Chapter VI was text only: three lists and a mailto.
#
# The three plates below are the only things on this site that belong to the
# closing chapter and appear nowhere else on the page. Her portrait is the one
# photograph of the person the other five chapters are about, and the two
# documents are what a reader can actually take away — and neither had any
# visual presence at all. The graphic portfolio, 30 designed pages, was a text
# link; the CV was a link whose label said "open the full CV" and opened the
# graphic portfolio instead.
#
# The portrait is NOT the one on the portfolio's cover. Both are hers and both
# are in that document (the cover carries one, page 3 the other), so using the
# cover as a card and the cover's own portrait as the hero would have put the
# same photograph on screen twice.
OFICIO_DOCS = [
    ('assets/portafolio-grafico.pdf', 'oficio-doc-grafico', 'cover, 30 pages'),
    ('assets/cv-monica-calle-es.pdf', 'oficio-doc-cv-es', 'CV page 1, ES'),
    ('assets/cv-monica-calle-en.pdf', 'oficio-doc-cv-en', 'CV page 1, EN'),
]


def oficio():
    retrato = os.path.join(RAIZ, 'public', 'images', 'about.png')
    if os.path.exists(retrato):
        # Not cropped. The page's rule about her illustrations holds for a
        # photograph of her too: the layout fits the portrait, never the
        # reverse.
        guardar(Image.open(retrato).convert('RGB'), 'oficio-retrato', 900, q=62)
    else:
        print('  oficio-retrato         SKIP (source not on disk)')

    for rel, nombre, nota in OFICIO_DOCS:
        ruta = os.path.join(RAIZ, 'public', rel)
        if not os.path.exists(ruta):
            print(f'  {nombre:22s} SKIP (source not on disk)')
            continue
        with tempfile.TemporaryDirectory() as tmp:
            # 90dpi against A4's 595pt gives ~744px, which is the card's
            # delivery width. Rendered rather than extracted: these are
            # laid-out pages, not embedded photographs.
            subprocess.run(['pdftoppm', '-png', '-f', '1', '-l', '1', '-r', '90',
                            ruta, os.path.join(tmp, 'p')], check=True,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            paginas = sorted(glob.glob(os.path.join(tmp, '*.png')))
            if not paginas:
                print(f'  {nombre:22s} SKIP (pdftoppm produced nothing)')
                continue
            guardar(Image.open(paginas[0]).convert('RGB'), nombre, 744, q=62)
            print(f'  {"":22s} {nota}')


print('\nEL OFICIO — the closing chapter\'s portrait and documents')
oficio()


# ------------------------------------------------------- LA MARCA, SOBRE SU COLOR
# Chapter II's third card — brief section 32.
#
# §32 asks every editorial card for a title and a short description, and four
# of her branding pieces were on screen with neither. Naming them turned up a
# second problem: the Estudio Raíz wordmark (public/cine/a2-raiz.avif) is white
# on TRANSPARENT — 90% of its pixels have alpha 0 — so on the cream editorial
# ground it rendered as white type on off-white and read as an empty cell,
# while the other two marks sit on their own colour and read fine.
#
# #513329 is not a chosen colour. It is the median of the lower right quadrant
# of page 8 of her own printed portfolio, which is the Estudio Raíz spread, so
# the mark goes back on the ground she gave it.
RAIZ_SUELO = (0x51, 0x33, 0x29)


def marca_raiz():
    origen = os.path.join(RAIZ, 'public', 'cine', 'a2-raiz.avif')
    if not os.path.exists(origen):
        print('  marca-raiz             SKIP (source not on disk)')
        return
    marca = Image.open(origen).convert('RGBA')
    caja = marca.getbbox()
    if caja:
        marca = marca.crop(caja)
    # 900x640 is the aspect the other two cards in this row already use, so the
    # grid keeps its rhythm. 62% occupancy leaves the mark room to be a mark.
    ancho, alto = 900, 640
    f = min((ancho * 0.62) / marca.width, (alto * 0.62) / marca.height)
    marca = marca.resize((max(1, round(marca.width * f)), max(1, round(marca.height * f))),
                         Image.LANCZOS)
    lienzo = Image.new('RGB', (ancho, alto), RAIZ_SUELO)
    lienzo.paste(marca, ((ancho - marca.width) // 2, (alto - marca.height) // 2), marca)
    guardar(lienzo, 'marca-raiz', None, q=62)


print('\nLA MARCA, SOBRE SU COLOR — her wordmark back on her own ground')
marca_raiz()


# --------------------------------------------------- PLACAS DE CAPITULO, RETRATO
# Brief section 81's mobile fallback.
#
# "Every cinematic chapter must have a static fallback. Desktop: landscape
# fallback. Mobile: PORTRAIT fallback. It must preserve: crop; color; title
# legibility; chapter transition."
#
# The build had one landscape plate per chapter serving both orientations, with
# `object-fit: scale-down` letterboxing it into a phone. Measured on a 390x844
# viewport: chapters II and IV came out as a horizontal band of imagery floating
# in the chapter's ground with the 141px title straddling its lower edge, half
# on the photograph and half on the field -- which is the "title legibility"
# clause of the section failing on the plate meant to guarantee it.
#
# TWO TREATMENTS, CHOSEN BY WHAT THE PLATE IS, not applied uniformly:
#
#   extender  the field is flat ACROSS but graded down, so the plate's own top
#             and bottom rows are drawn out to fill. Nothing is cropped. This is
#             the retablo's own rule (see panel() above) applied to a plate.
#   plano     the ground is flat in every direction, measured: a corner spread
#             of 0.0. Drawing the edge rows out here SMEARS, because the rows
#             carry the subject's bleed even where the corners do not -- it
#             produced a streaked grey wash over chapter IV. The fill is the
#             corner colour.
#   recortar  the plate is a PHOTOGRAPH of a mockup, and reframing a photograph
#             is ordinary art direction rather than cutting her work. Anchored
#             on the subject, measured column-wise rather than guessed.
#
# Chapter I needs neither: /cine/pelo-cobre.avif is already 1150x3229, taller
# than 9:16, and fills a phone as it is.
RETRATO_W, RETRATO_H = 900, 1600

PLACAS_RETRATO = [
    # (origen bajo public/, salida, modo, anclaje x, anclaje y, nota)
    ('edicion/cap-marca.avif',   'cap-marca-retrato',   'recortar', 0.50, 0.48,
     'photograph of the Raiz site on a sofa; subject centred at x0.50 y0.48'),
    ('cine/a3-loreal.avif',      'cap-campana-retrato', 'extender', 0.50, 0.50,
     'her poster on its own red field; the poster is a designed artefact and is not cut'),
    ('edicion/cap-producto.avif', 'cap-producto-retrato', 'plano', 0.50, 0.50,
     'flat #0c0a0f at all four corners, corner spread 0.0, so the fill is that colour'),
    ('edicion/cap-impreso.avif', 'cap-impreso-retrato', 'recortar', 0.54, 0.49,
     'photograph of the open portfolio; spread anchored at x0.54 y0.49'),
]


def _estirar_bordes(obra, ancho, alto, y):
    """The plate at `y`, with its own top and bottom rows drawn out to fill.

    NOT a flat fill and not a resampled field: the extension starts from the
    exact pixels it continues, so there is no seam to see. A flat corner median
    banded visibly on the L'Oreal red, which is graded rather than flat, and a
    stretched low-res field banded too.
    """
    a = np.asarray(obra)
    lienzo = np.empty((alto, ancho, 3), dtype=a.dtype)
    if a.shape[1] != ancho:
        a = np.asarray(obra.resize((ancho, obra.height), Image.LANCZOS))
    fin = y + a.shape[0]
    lienzo[y:fin] = a
    if y > 0:
        lienzo[:y] = a[0]
    if fin < alto:
        lienzo[fin:] = a[-1]
    return Image.fromarray(lienzo)


def placas_retrato():
    for rel, nombre, modo, ax, ay, nota in PLACAS_RETRATO:
        ruta = os.path.join(RAIZ, 'public', rel)
        if not os.path.exists(ruta):
            print(f'  {nombre:22s} SKIP (source not on disk)')
            continue
        src = Image.open(ruta).convert('RGB')

        if modo in ('extender', 'plano'):
            # The plate whole, at the frame's width, with its own edge rows
            # drawn out above and below it. Nothing is cropped and nothing is
            # upscaled: the plate is only ever reduced to fit.
            f = min(RETRATO_W / src.width, 1.0)
            w, h = max(1, round(src.width * f)), max(1, round(src.height * f))
            obra = src.resize((w, h), Image.LANCZOS) if f < 1.0 else src
            y = min(max(0, round((RETRATO_H - h) * ay)), max(0, RETRATO_H - h))
            if modo == 'plano':
                lienzo = Image.new('RGB', (RETRATO_W, RETRATO_H), fondo(src))
                lienzo.paste(obra, (round((RETRATO_W - w) / 2), y))
            else:
                lienzo = _estirar_bordes(obra, RETRATO_W, RETRATO_H, y)
        else:
            # Cover the frame, then take the window the subject sits in.
            f = max(RETRATO_W / src.width, RETRATO_H / src.height)
            w, h = max(1, round(src.width * f)), max(1, round(src.height * f))
            grande = src.resize((w, h), Image.LANCZOS)
            x = min(max(0, round(w * ax - RETRATO_W / 2)), w - RETRATO_W)
            y = min(max(0, round(h * ay - RETRATO_H / 2)), h - RETRATO_H)
            lienzo = grande.crop((x, y, x + RETRATO_W, y + RETRATO_H))

        guardar(lienzo, nombre, None, q=60)
        print(f'  {"":22s} {modo} — {nota}')


print('\nPLACAS DE CAPITULO, RETRATO — section 81\'s mobile fallback')
placas_retrato()


# ------------------------------------------------------- PLACAS DE CAPITULO
# The chapter opening plates.
#
# These were being served as raw PNGs straight out of the old site: mockupraiz
# was 19.1 MB and portafolioabierto 2.2 MB, against ~450 KB for every other
# image on the page combined. main rendered them through next/image, which
# resized them; the Edition used a plain <img> and bypassed the optimiser, so
# the homepage shipped 21.35 MB. Cutting them here puts them under the same
# discipline as every other plate, and the pipeline refuses to upscale.
PLACAS_CAP = [
    ('images/mockupraiz.png',        'cap-marca',    1680),
    ('images/portafolioabierto.png', 'cap-impreso',  1680),
    # NOT images/iphone.webp. That file is a screenshot of Apple's iPhone
    # "Titanium" marketing page -- Apple logo, Store/Mac/iPhone/Support nav and
    # Apple's own campaign typography -- inherited from the old site. It was
    # chapter IV's ground on every phone, behind the live scene at 0.18, and
    # with WebGL off. A designer's portfolio published under her own name
    # cannot present another company's trademark and marketing artwork as its
    # own chapter ground. Chapter IV's plate is cut from her Vibe work below.
]

print('\nPLACAS DE CAPITULO — chapter opening plates')
for rel, nombre, ancho in PLACAS_CAP:
    ruta = os.path.join(RAIZ, 'public', rel)
    if not os.path.exists(ruta):
        print(f'  {nombre:20s} SKIP (missing)'); continue
    im = Image.open(ruta).convert('RGB')
    antes = os.path.getsize(ruta)
    despues = guardar(im, nombre, ancho, q=60)
    print(f'  {"":20s} {antes//1024} KB -> {os.path.getsize(os.path.join(OUT, nombre + ".avif"))//1024} KB')


# ------------------------------------------------------------- LA PELICULA
# The brief asks for video in four places -- section 25 (intro video), 26 (the
# full-screen modal), 40, and the must-ship list in 105 -- and names
# VideoFeature and VideoModal as components. Video needs no WebGL, no paid
# runtime and no dependency: it is an <video> tag and ffmpeg.
#
# There was no usable footage. The only clips in the repo belong to the
# dark-gallery direction that was measured and killed, and they are of a
# Caravaggio, not of her work. So the film is rendered here, from her own file.
#
# The shot: a slow push toward the figure on her Ceguera Digital poster. It is
# the one piece where a still cannot carry the point -- chapter III's copy says
# the drawing ended up at bus-shelter scale, and scale is the thing a moving
# camera shows and a fixed crop does not. Restrained, per section 22: one move,
# constant speed, no bounce, no cut.
import subprocess

def pelicula():
    src = os.path.join(RAIZ, 'produccion', 'fuentes', 'drive',
                       '02-campana', 'marquesina', 'marquesina.jpg')
    if not os.path.exists(src):
        print('  SKIP (marquesina not on disk)'); return

    Image.MAX_IMAGE_PIXELS = None
    im = Image.open(src).convert('RGB')
    # 5861x8757 is far more than a 1080p push needs, and zoompan on it is
    # pathologically slow. Downscale once, to a height that still exceeds the
    # tightest crop the move ever takes.
    alto = 2400
    im = im.resize((round(im.width * alto / im.height), alto), Image.LANCZOS)
    tmp_png = os.path.join(OUT, '_marquesina-tmp.png')
    im.save(tmp_png)

    W, H, FPS, SEGS = 1280, 720, 25, 9
    n = FPS * SEGS
    # Push from the whole poster to the figure's head. z goes 1 -> 2.1 linearly;
    # the centre drifts up so the move lands on the face rather than the middle.
    vf = (
        f"scale={W*3}:-2,"
        f"zoompan=z='1+0.55*on/{n}':"
        f"x='iw/2-(iw/zoom/2)':"
        f"y='ih*0.34-(ih/zoom/2)+ih*0.10*(1-on/{n})':"
        f"d={n}:s={W}x{H}:fps={FPS},"
        f"format=yuv420p"
    )
    base = os.path.join(OUT, 'campana-marquesina')
    for args, ext in [
        (['-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-movflags', '+faststart'], 'mp4'),
        (['-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-row-mt', '1'], 'webm'),
    ]:
        out = f'{base}.{ext}'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', tmp_png,
                        '-vf', vf, '-t', str(SEGS), '-an', *args, out], check=True)
        print(f'  campana-marquesina.{ext:4s}  {os.path.getsize(out)//1024} KB  {SEGS}s {W}x{H}')

    # The poster frame, for the video's poster attribute and the reduced-motion
    # fallback: whatever happens, a reader sees the work.
    guardar(im, 'campana-marquesina-poster', 1280, q=58)
    os.remove(tmp_png)

print('\nLA PELICULA — the Ceguera poster at street scale')
pelicula()


# ---------------------------------------------------------------- PLANOS 3D
# The depth planes for the persistent canvas (brief sections 20-22).
#
# The brief asks for GLB foreground models over KTX2 backgrounds. Her work is
# painted illustration, print and app screens -- there is no mesh to export, and
# inventing one would put geometry on the page that is not hers. So the
# foreground "models" are alpha-cut planes of her own artwork standing at real
# depths in the scene. The camera dollies and trucks through them per section
# 22, and because the separation is REAL depth rather than 2D offset, section
# 21's exit move ("depth separation increases") actually happens.
#
# Backgrounds are her own grounds, blurred and darkened: section 21 says the
# environmental background "loses dominance" on exit, which only reads if it was
# never competing with the foreground in the first place.
from PIL import ImageFilter, ImageEnhance

def _alfa_por_fondo(im, tol=20):
    """Alpha from a flood fill at the border. See the ceguera cut for why this
    is not a colour-distance threshold: interior areas that happen to match the
    ground are part of the subject, not holes."""
    from PIL import ImageDraw
    rgb = im.convert('RGB')
    d = np.abs(np.asarray(rgb).astype(np.int16) - np.array(fondo(rgb))).sum(axis=2)
    m = Image.new('L', (rgb.width + 2, rgb.height + 2), 255)
    m.paste(Image.fromarray(((d <= tol).astype(np.uint8) * 255), 'L'), (1, 1))
    ImageDraw.floodfill(m, (0, 0), 128, thresh=0)
    fuera = np.asarray(m)[1:-1, 1:-1] == 128
    out = np.dstack([np.asarray(rgb).astype(np.uint8),
                     np.where(fuera, 0, 255).astype(np.uint8)])
    return Image.fromarray(out, 'RGBA')


def _fondo_escena(im, ancho, desenfoque, oscurecer):
    """A background plate: blurred and darkened so it recedes."""
    im = im.convert('RGB')
    if im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    im = im.filter(ImageFilter.GaussianBlur(desenfoque))
    return ImageEnhance.Brightness(im).enhance(oscurecer)


print('\nPLANOS 3D — depth planes for the persistent canvas')

D = os.path.join(RAIZ, 'produccion', 'fuentes', 'drive')

# I ILUSTRACION. Foreground is the copper-hair plane already cut for the film;
# background is her sage-olive ground, softened.
_a3 = Image.open(os.path.join(ILUS, 'Untitled_Artwork 3.png'))
guardar(_alfa_por_fondo(_a3), 'plano-i-fg', 1200, q=58)
guardar(_fondo_escena(_a3, 1400, 26, 0.55), 'plano-i-bg', 1400, q=48)

# II MARCA. Foreground is the Raiz site photograph; background is her Esmeralda
# pine, blurred to a field.
_raiz = Image.open(os.path.join(RAIZ, 'public', 'images', 'mockupraiz.png'))
guardar(_raiz.convert('RGB'), 'plano-ii-fg', 1400, q=56)
_esm = Image.open(os.path.join(D, '01-branding/vina-esmeralda/Sunlit Courtyard View.png'))
guardar(_fondo_escena(_esm, 1400, 30, 0.5), 'plano-ii-bg', 1400, q=48)

# III CAMPANA. The marquesina itself as the environment: the chapter's claim is
# street scale, so the background IS the street.
Image.MAX_IMAGE_PIXELS = None
_marq = Image.open(os.path.join(D, '02-campana/marquesina/marquesina.jpg'))
guardar(_fondo_escena(_marq, 1400, 22, 0.42), 'plano-iii-bg', 1400, q=48)

# IV PRODUCTO. Her Vibe deck's own dark ground.
_vibe = Image.open(os.path.join(RAIZ, 'public', 'cine', 'a2-vibe.avif'))
guardar(_fondo_escena(_vibe, 1200, 28, 0.45), 'plano-iv-bg', 1200, q=48)

# V IMPRESO. Foreground is the open printed portfolio; background is the
# Plakatstil poster, her burnt orange.
_port = Image.open(os.path.join(RAIZ, 'public', 'images', 'portafolioabierto.png'))
guardar(_port.convert('RGB'), 'plano-v-fg', 1400, q=56)
_plak = Image.open(os.path.join(D, '02-campana/plakatstil/POSTER_ANVERSO.png'))
guardar(_fondo_escena(_plak, 1400, 26, 0.5), 'plano-v-bg', 1400, q=48)


# Chapter IV's ground, from her own Vibe deck rather than Apple's website.
#
# Blurred and darkened hard on purpose. It is an ENVIRONMENT, not a screen to
# read: section 46's own failure here was a 141px title landing on legible UI,
# and this build's rule is that no chapter plate may be lettering. At this blur
# her interface reads as colour and structure, which is what a ground is for.
_vibemock = Image.open(os.path.join(
    D, '04-apps/vibe-figma-2x/iPhone 15 Pro - White (1).png')).convert('RGB')
_amp = Image.new('RGB', (1280, 796), (20, 16, 25))
_esc = min(1280 / _vibemock.width, 796 / _vibemock.height) * 2.6
_big = _vibemock.resize((round(_vibemock.width * _esc), round(_vibemock.height * _esc)), Image.LANCZOS)
_amp.paste(_big, ((1280 - _big.width) // 2, (796 - _big.height) // 2))
guardar(ImageEnhance.Brightness(_amp.filter(ImageFilter.GaussianBlur(18))).enhance(0.62),
        'cap-producto', 1280, q=58)


# Chapter IV's scene planes: DETAILS of her screens, not the whole capture.
# A 141px chapter title over a full app screen lands on legible body copy, which
# breaks the same rule that took the wordmarks out from behind the titles.
for _src, _nombre, _caja in [
    ('plancha-vibe.avif',     'detalle-vibe',     (0.06, 0.02, 0.94, 0.20)),
    ('plancha-voluntee.avif', 'detalle-voluntee', (0.04, 0.06, 0.96, 0.34)),
]:
    _p = os.path.join(OUT, _src)
    if not os.path.exists(_p):
        print(f'  {_nombre:20s} SKIP'); continue
    _im = Image.open(_p).convert('RGB')
    _w, _h = _im.size
    _c = _im.crop((int(_w*_caja[0]), int(_h*_caja[1]), int(_w*_caja[2]), int(_h*_caja[3])))
    # Blurred to ABSTRACTION, not to softness. At 1.2px the labels were still
    # legible and a 141px chapter title was sitting on readable UI, which is the
    # same defect that took her wordmarks out from behind the other titles. At
    # this radius her interface reads as colour, rhythm and structure -- which is
    # what a chapter ground is for, and it is still recognisably her screen.
    _c = _c.filter(ImageFilter.GaussianBlur(_c.width * 0.02))
    guardar(ImageEnhance.Brightness(_c).enhance(0.66), _nombre, 900, q=52)


# ------------------------------------------------------------------ SRCSET
# Section 91 asks for proper image loading. Intrinsic width/height answers the
# reflow half; this answers the other half -- a 1680px plate was being
# downloaded whole by a 390px phone.
#
# Two extra widths per plate, not a ladder: these are AVIF at delivery size
# already, so the win is on the largest few files and a five-rung ladder would
# be more bytes in the repo than it saves on the wire.
print('\nSRCSET — narrow variants for the plates that are worth it')
_anchos = (640, 1024)
for _f in sorted(os.listdir(OUT)):
    if not _f.endswith('.avif') or '-w' in _f:
        continue
    # A lamina is fetched once, on an explicit open, at one size. At 29-89 kB
    # a narrow ladder adds more files to the repository than bytes it saves.
    if _f.startswith('lamina-'):
        continue
    _ruta = os.path.join(OUT, _f)
    _im = Image.open(_ruta)
    # Only worth it where a phone would otherwise pull something much larger.
    if _im.width <= 900:
        continue
    _base = _f[:-5]
    for _w in _anchos:
        if _w >= _im.width:
            continue
        _v = _im.resize((_w, round(_im.height * _w / _im.width)), Image.LANCZOS)
        _p = os.path.join(OUT, f'{_base}-w{_w}.avif')
        _v.save(_p, quality=54)
        print(f'  {_base}-w{_w:<5} {_w}x{_v.height}  {os.path.getsize(_p)//1024} KB')
