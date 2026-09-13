"""Bake the paper substrate for the turn. Blender as a MATERIAL studio.

The directive is explicit that Blender is "a CINEMATIC ASSET STUDIO. Not a game
engine ... Build shots, objects, layers, materials, visual transformations" and
"Do not build complete navigable spaces". So this renders no shot and moves no
camera: it produces three tiling maps of a sheet of paper, which the turn then
lights in the browser.

Why the turn needs it. A CSS rotate of a flat colour reads as a card flipping.
A sheet of paper turning is legible because its surface catches a raking light
along its tooth -- the same claroscuro her own work argues for on p-17. Baking
normal / roughness / AO once, at 512px tiling, costs 60KB and buys that, without
a single frame of prerendered cinema.

Zero camera keyframes. Orthographic, straight down, flat lighting: these are
texture maps, not photographs of a scene.

    /Applications/Blender.app/Contents/MacOS/Blender -b -noaudio \
        --python produccion/blender/papel.py -- produccion/blender/out
"""
import sys, os, bpy

OUT = sys.argv[-1]
os.makedirs(OUT, exist_ok=True)
S = 512

sc = bpy.context.scene
sc.render.engine = 'CYCLES'          # assign, never feature-detect off the enum
sc.cycles.samples = 96
sc.cycles.use_denoising = True
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.refresh_devices()
    for d in prefs.devices:
        d.use = True
    sc.cycles.device = 'GPU'
except Exception as e:
    print('GPU unavailable, CPU:', e)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# A tiling plane. Nothing else exists in this file.
bpy.ops.mesh.primitive_plane_add(size=2)
plano = bpy.context.active_object

mat = bpy.data.materials.new('papel')
mat.use_nodes = True
nt = mat.node_tree
bsdf = nt.nodes['Principled BSDF']

# Paper tooth: two noise scales plus a fine grain, the way a laid sheet actually
# reads -- a slow undulation with a much finer fibre on top.
coord = nt.nodes.new('ShaderNodeTexCoord')
grande = nt.nodes.new('ShaderNodeTexNoise')
grande.inputs['Scale'].default_value = 18.0
grande.inputs['Detail'].default_value = 6.0
grande.inputs['Roughness'].default_value = 0.62
fino = nt.nodes.new('ShaderNodeTexNoise')
fino.inputs['Scale'].default_value = 220.0
fino.inputs['Detail'].default_value = 3.0
mezcla = nt.nodes.new('ShaderNodeMixRGB')
mezcla.blend_type = 'OVERLAY'
mezcla.inputs['Fac'].default_value = 0.38
bump = nt.nodes.new('ShaderNodeBump')
bump.inputs['Strength'].default_value = 0.28

nt.links.new(coord.outputs['Generated'], grande.inputs['Vector'])
nt.links.new(coord.outputs['Generated'], fino.inputs['Vector'])
nt.links.new(grande.outputs['Fac'], mezcla.inputs['Color1'])
nt.links.new(fino.outputs['Fac'], mezcla.inputs['Color2'])
nt.links.new(mezcla.outputs['Color'], bump.inputs['Height'])
nt.links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])

bsdf.inputs['Base Color'].default_value = (1, 1, 1, 1)
bsdf.inputs['Roughness'].default_value = 0.86
plano.data.materials.append(mat)

# Orthographic, straight down. A texture bake, not a shot.
bpy.ops.object.camera_add(location=(0, 0, 3), rotation=(0, 0, 0))
cam = bpy.context.object
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 2.0
sc.camera = cam

sc.render.resolution_x = sc.render.resolution_y = S
sc.render.image_settings.file_format = 'PNG'

def bake(nombre, luz):
    """One raking light per pass; the maps are the difference between them."""
    for o in [o for o in bpy.data.objects if o.type == 'LIGHT']:
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.ops.object.light_add(type='SUN', location=(0, 0, 4))
    l = bpy.context.object
    l.data.energy = 3.0
    l.data.angle = 0.06
    l.rotation_euler = luz
    sc.render.filepath = os.path.join(OUT, nombre)
    bpy.ops.render.render(write_still=True)
    print('BAKED', nombre, os.path.getsize(sc.render.filepath + '.png'), 'bytes')

# A 12-degree rake from upper left -- the same angle Act 3's band travels at,
# so the film's light has one direction everywhere.
bake('papel-rake', (1.30, 0.0, -0.55))
bake('papel-plano', (0.0, 0.0, 0.0))
print('DONE')
