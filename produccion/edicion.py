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
    guardar(p, 'panel-' + archivo.split()[-1].replace('.png', ''), pw)

guardar(retablo, "hero-retablo", 1680, q=68)

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
    ('images/iphone.webp',           'cap-producto', 1280),
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
