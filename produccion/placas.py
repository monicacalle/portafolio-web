#!/usr/bin/env python3
"""
Cut every plate the film needs, from her own files and one verified Met CC0.

Originals are never written to. Each plate says where it came from and why it is
cropped the way it is, because docs/CREATIVE_DIRECTION.md is built on measured
dimensions and a silent re-crop would invalidate it.
"""
from __future__ import annotations
import os
import numpy as np
from PIL import Image, ImageFilter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(RAIZ, 'produccion', 'fuentes', 'drive')
OUT = os.path.join(RAIZ, 'public', 'cine')
os.makedirs(OUT, exist_ok=True)


def guardar(im, nombre, ancho=None, q=62):
    if ancho and im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    p = os.path.join(OUT, nombre + '.avif')
    im.save(p, quality=q)
    print(f'  {nombre:16s} {im.width}x{im.height}  {os.path.getsize(p)//1024} KB')
    return im


def alfa_por_oscuridad(im, lo=0.10, hi=0.62):
    """Alpha from darkness, for a mark drawn dark on a light ground.

    Her Raiz logotype ships as oxblood on near-white, but on her own portfolio
    page (p-08) the mark is reversed out of walnut in ice blue. Keeping it as a
    silhouette lets CSS apply her colour instead of us baking in a wrong one.
    """
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    L = a[..., 0] * .2126 + a[..., 1] * .7152 + a[..., 2] * .0722
    al = np.clip((1 - L - lo) / (hi - lo), 0, 1)
    out = Image.new('RGBA', im.size, (255, 255, 255, 0))
    out.putalpha(Image.fromarray((al * 255).astype(np.uint8), 'L'))
    return out


print('ACT 2 — la recurrencia')
# The Esmeralda logotype keeps its own pine ground: the swash reads against it
# and the ground is one of the four measured project colours.
es = Image.open(os.path.join(D, '01-branding/vina-esmeralda/viña esmeralda.tif')).convert('RGB')
w, h = es.size
guardar(es.crop((int(w*0.03), int(h*0.10), int(w*0.40), int(h*0.50))), 'a2-esmeralda', 1100)

# Raiz as a silhouette, so the i-flick can be set in her ice blue on walnut.
rz = Image.open(os.path.join(D, '01-branding/estudio-raiz/RAIZ-LOGOVERSIONES_Mesa de trabajo 1 copia 13.jpg'))
w, h = rz.size
rz = rz.crop((int(w*0.30), int(h*0.33), int(w*0.78), int(h*0.72)))
guardar(alfa_por_oscuridad(rz), 'a2-raiz', 1000)

# Isabella is 596px wide at 1x and is NOT upscaled. The direction is explicit:
# the cell gets smaller, the ground gets larger.
guardar(Image.open(os.path.join(D, '01-branding/isabella-mendoza/i_m.png')).convert('RGBA'), 'a2-isabella', 596)

# Vibe, bezel removed: a device frame is a mockup tell and she has enough of them.
vb = Image.open(os.path.join(D, '04-apps/vibe-figma-2x/iPhone 15 Pro - White flatten.png')).convert('RGB')
w, h = vb.size
guardar(vb.crop((int(w*0.055), int(h*0.030), int(w*0.945), int(h*0.972))), 'a2-vibe', 760)

print('ACT 3 — la ley de cierre')
# Ingres, Madame Jacques-Louis Leblanc, 1823. Met 19.77.2, objectID 436703,
# isPublicDomain verified true against the Met API on 2026-09-12.
#
# Chosen over the Head of Christ the direction suggested. The act applies ONE
# lighting operation across four centuries, and that argument only lands if the
# subject is held constant -- so a woman's portrait with a direct gaze, which is
# what her L'Oreal payoff is. It also avoids pairing a devotional image with a
# cosmetics campaign, which would read as glib.
ing = Image.open(os.path.join(RAIZ, 'tmp/assets/renacimiento/436703-madame-jacques-louis-leblanc--françoise-ponc.jpg')).convert('RGB')
w, h = ing.size
guardar(ing.crop((int(w*0.20), int(h*0.02), int(w*0.86), int(h*0.46))), 'a3-ingres', 1200)

lo = Image.open(os.path.join(D, '02-campana/loreal/LOREAL FOTO.png')).convert('RGB')
w, h = lo.size
guardar(lo.crop((int(w*0.24), 0, int(w*0.76), h)), 'a3-loreal', 1100)

# 613px at 1x, not upscaled, same rule as Isabella.
guardar(Image.open(os.path.join(D, '02-campana/portada-libro/AAFF_caratulalibro_loboestepario.png')).convert('RGBA'), 'a3-lobo', 613)

print('ACT 4 — la quinta tinta')
pin = Image.open(os.path.join(RAIZ, 'tmp/assets/raw/Untitled_Artwork 3.png')).convert('RGB')
# Her painting entire, on its own sage-olive ground, face exactly as painted.
# ADN's "almost unmodelled face" was wrong -- 10 tonal bands over 405,350 skin
# pixels -- so nothing here is flattened.
guardar(pin, 'a4-pintura', 1500)

# The hair alone, as the one plane that moves (a 2% lateral offset). Everything
# else in the act is still.
a = np.asarray(pin).astype(np.float32)
B = np.median(a.reshape(-1, 3)[::37], axis=0)
d = np.linalg.norm(a - B, axis=-1)
COBRE = np.array([150, 74, 40], np.float32)
dc = np.linalg.norm(a - COBRE, axis=-1)
al = np.clip((d - 22) / 10.0, 0, 1) * np.clip((190 - dc) / 60.0, 0, 1)
alm = Image.fromarray((al * 255).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(1.1))
A = np.asarray(alm).astype(np.float32) / 255
F = np.clip((a - (1 - A[..., None]) * B) / np.maximum(A, 0.06)[..., None], 0, 255)
pelo = Image.fromarray(np.dstack([F, A * 255]).astype(np.uint8), 'RGBA')
pelo = pelo.crop(pelo.split()[3].point(lambda v: 255 if v > 10 else 0).getbbox())
guardar(pelo, 'a4-pelo-plano', 1200)

# Ceguera Digital on its NATIVE cream. Black ink on cream is ~20:1; on oxblood
# it would be 1.50:1 with every white fill becoming a hole and the ground
# flooding through her open contours.
guardar(Image.open(os.path.join(RAIZ, 'tmp/assets/raw/Untitled_Artwork 8.png')).convert('RGB'), 'a4-ceguera', 1400)

total = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT) if f.endswith('.avif'))
print(f'\ntotal avif in public/cine: {total/1e6:.2f} MB')
