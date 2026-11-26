# Blender 3.6+ / 4.x
# Carter Kane — authorial satchel + medallion blockout
#
# Coordinate convention: metres, Y up, character facing +Z, feet at Y=0.
# Anatomical right hip is -X when the character faces +Z.
# Run with: Blender > Scripting > Open > Run Script.
# This creates editable objects; it does not replace or modify the Ara body/rig.

import bpy
import math
from mathutils import Vector

HEIGHT = 1.75
UNIT = HEIGHT / 1.75
COLLECTION_NAME = "CARTER_ACCESSORIES_SOURCE"
ROOT_NAME = "Carter_Accessories_Anchor"

def srgb_channel_to_linear(value):
    value = value / 255.0
    if value <= 0.04045:
        return value / 12.92
    return ((value + 0.055) / 1.055) ** 2.4

def hex_color(value):
    value = value.lstrip("#")
    return tuple(srgb_channel_to_linear(int(value[i:i+2], 16)) for i in (0, 2, 4)) + (1.0,)

def make_material(name, color, roughness=0.8, metallic=0.0):
    material = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    material.diffuse_color = hex_color(color)
    material.use_nodes = True
    shader = material.node_tree.nodes.get("Principled BSDF")
    if shader:
        shader.inputs["Base Color"].default_value = material.diffuse_color
        shader.inputs["Roughness"].default_value = roughness
        shader.inputs["Metallic"].default_value = metallic
    return material

def assign_material(obj, material):
    if obj.data and hasattr(obj.data, "materials"):
        obj.data.materials.clear()
        obj.data.materials.append(material)

def rounded_box(name, dimensions, location, material, bevel=0.008):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel_mod = obj.modifiers.new("Soft leather edges", "BEVEL")
    bevel_mod.width = bevel
    bevel_mod.segments = 3
    bevel_mod.limit_method = "ANGLE"
    normal_mod = obj.modifiers.new("Weighted corner normals", "WEIGHTED_NORMAL")
    assign_material(obj, material)
    return obj

def make_curve(name, points, material, bevel_depth=0.002, resolution=3, cyclic=False):
    curve_data = bpy.data.curves.new(name + "_Curve", "CURVE")
    curve_data.dimensions = "3D"
    curve_data.resolution_u = 20
    curve_data.bevel_depth = bevel_depth
    curve_data.bevel_resolution = resolution
    spline = curve_data.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for i, point in enumerate(points):
        spline.points[i].co = (point[0], point[1], point[2], 1.0)
    spline.use_cyclic_u = cyclic
    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(obj)
    assign_material(obj, material)
    return obj

def make_ribbon(name, points, width, material):
    half = width * 0.5
    vertices = []
    faces = []
    vectors = [Vector(p) for p in points]
    for i, point in enumerate(vectors):
        previous = vectors[max(0, i - 1)]
        following = vectors[min(len(vectors) - 1, i + 1)]
        tangent = (following - previous).normalized()
        side = Vector((-tangent.y, tangent.x, 0.0))
        if side.length < 0.0001:
            side = Vector((1.0, 0.0, 0.0))
        else:
            side.normalize()
        side *= half
        vertices.append(tuple(point - side))
        vertices.append(tuple(point + side))
        if i < len(vectors) - 1:
            a = i * 2
            faces.append((a, a + 1, a + 3, a + 2))
    mesh = bpy.data.meshes.new(name + "_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    solidify = obj.modifiers.new("Leather thickness", "SOLIDIFY")
    solidify.thickness = 0.0035 * UNIT
    bevel = obj.modifiers.new("Rounded strap edges", "BEVEL")
    bevel.width = 0.0018 * UNIT
    bevel.segments = 2
    obj.modifiers.new("Strap normals", "WEIGHTED_NORMAL")
    return obj

# Replace only this source collection when the script is run again.
old_collection = bpy.data.collections.get(COLLECTION_NAME)
if old_collection:
    for obj in list(old_collection.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    bpy.data.collections.remove(old_collection)

collection = bpy.data.collections.new(COLLECTION_NAME)
bpy.context.scene.collection.children.link(collection)

# Keep all created geometry grouped under a single, transform-neutral anchor.
root = bpy.data.objects.new(ROOT_NAME, None)
root.empty_display_type = "PLAIN_AXES"
root.empty_display_size = 0.12
collection.objects.link(root)

leather = make_material("Carter | Cognac leather", "#80502F", 0.84, 0.02)
leather_dark = make_material("Carter | Dark leather", "#593820", 0.88, 0.01)
leather_light = make_material("Carter | Leather highlights", "#98643C", 0.82, 0.02)
stitch = make_material("Carter | Saddle stitching", "#C9A477", 0.72, 0.0)
brass = make_material("Carter | Aged brass", "#B68A42", 0.32, 0.72)
brass_light = make_material("Carter | Polished brass", "#D7B56E", 0.28, 0.78)

def parent_keep_world(obj):
    world = obj.matrix_world.copy()
    obj.parent = root
    obj.matrix_world = world
    return obj

# Bag body. Its position is offset to the Carter's anatomical right (-X).
bag_width = 0.36 * UNIT
bag_height = 0.285 * UNIT
bag_depth = 0.105 * UNIT
bag_center = Vector((-0.255 * UNIT, 0.375 * HEIGHT, bag_depth * 0.5))

body = rounded_box(
    "Carter_Satchel_Body",
    (bag_width, bag_height, bag_depth),
    bag_center,
    leather,
    0.022 * UNIT
)
parent_keep_world(body)

flap = rounded_box(
    "Carter_Satchel_Flap",
    (bag_width * 0.94, bag_height * 0.40, 0.018 * UNIT),
    (bag_center.x, bag_center.y + bag_height * 0.285, bag_depth * 0.92 + 0.009 * UNIT),
    leather_dark,
    0.016 * UNIT
)
parent_keep_world(flap)

pocket = rounded_box(
    "Carter_Satchel_Front_Pocket",
    (bag_width * 0.62, bag_height * 0.30, 0.012 * UNIT),
    (bag_center.x, bag_center.y - bag_height * 0.205, bag_depth * 0.96 + 0.006 * UNIT),
    leather_light,
    0.009 * UNIT
)
parent_keep_world(pocket)

gusset = rounded_box(
    "Carter_Satchel_Right_Gusset",
    (0.018 * UNIT, 0.205 * UNIT, 0.082 * UNIT),
    (bag_center.x - bag_width * 0.47, bag_center.y - 0.005 * UNIT, bag_depth * 0.48),
    leather_dark,
    0.006 * UNIT
)
parent_keep_world(gusset)

seam = make_curve(
    "Carter_Pocket_Stitch",
    [
        (bag_center.x - bag_width * 0.25, bag_center.y - bag_height * 0.205, bag_depth * 1.12),
        (bag_center.x, bag_center.y - bag_height * 0.205, bag_depth * 1.12),
        (bag_center.x + bag_width * 0.25, bag_center.y - bag_height * 0.205, bag_depth * 1.12)
    ],
    stitch,
    0.0012 * UNIT,
    2
)
parent_keep_world(seam)

clasp = make_curve(
    "Carter_Satchel_Brass_Clasp",
    [
        (bag_center.x, bag_center.y + bag_height * 0.205, bag_depth * 1.13),
        (bag_center.x + 0.0001, bag_center.y + bag_height * 0.205, bag_depth * 1.13)
    ],
    brass_light,
    0.004 * UNIT,
    3
)
parent_keep_world(clasp)

# Diagonal strap: the illustration's left shoulder to the character's right hip.
strap_points = [
    (0.155 * UNIT, 0.835 * HEIGHT, 0.125 * UNIT),
    (0.145 * UNIT, 0.765 * HEIGHT, 0.155 * UNIT),
    (0.075 * UNIT, 0.645 * HEIGHT, 0.170 * UNIT),
    (-0.075 * UNIT, 0.515 * HEIGHT, 0.160 * UNIT),
    (-0.235 * UNIT, 0.405 * HEIGHT, 0.145 * UNIT)
]
strap = make_ribbon("Carter_Crossbody_Strap", strap_points, 0.047 * UNIT, leather_dark)
parent_keep_world(strap)

# Fine edge seams along the strap.
for sign, suffix in [(-1, "L"), (1, "R")]:
    edge_points = []
    source = [Vector(point) for point in strap_points]
    for i, point in enumerate(source):
        previous = source[max(0, i - 1)]
        following = source[min(len(source) - 1, i + 1)]
        tangent = (following - previous).normalized()
        side = Vector((-tangent.y, tangent.x, 0.0))
        if side.length > 0.0001:
            side.normalize()
        edge_points.append(tuple(point + side * (0.015 * UNIT * sign) + Vector((0, 0, 0.002 * UNIT))))
    edge = make_curve("Carter_Strap_Stitch_" + suffix, edge_points, stitch, 0.0011 * UNIT, 2)
    parent_keep_world(edge)

adjuster = rounded_box(
    "Carter_Strap_Brass_Adjuster",
    (0.055 * UNIT, 0.025 * UNIT, 0.009 * UNIT),
    (0.132 * UNIT, 0.748 * HEIGHT, 0.173 * UNIT),
    brass,
    0.003 * UNIT
)
parent_keep_world(adjuster)

# Gold necklace and round medallion on the front of the chest.
necklace_points = [
    (-0.105 * UNIT, 0.86 * HEIGHT, 0.125 * UNIT),
    (-0.092 * UNIT, 0.795 * HEIGHT, 0.155 * UNIT),
    (-0.045 * UNIT, 0.735 * HEIGHT, 0.170 * UNIT),
    (0.0, 0.695 * HEIGHT, 0.175 * UNIT),
    (0.045 * UNIT, 0.735 * HEIGHT, 0.170 * UNIT),
    (0.092 * UNIT, 0.795 * HEIGHT, 0.155 * UNIT),
    (0.105 * UNIT, 0.86 * HEIGHT, 0.125 * UNIT)
]
chain = make_curve("Carter_Medallion_Chain", necklace_points, brass_light, 0.0032 * UNIT, 4)
parent_keep_world(chain)

pendant_location = (0.0, 0.695 * HEIGHT, 0.182 * UNIT)
bpy.ops.mesh.primitive_cylinder_add(
    vertices=48,
    radius=0.032 * UNIT,
    depth=0.008 * UNIT,
    location=pendant_location,
    rotation=(math.pi / 2.0, 0.0, 0.0)
)
medallion = bpy.context.object
medallion.name = "Carter_Gold_Medallion"
assign_material(medallion, brass)
parent_keep_world(medallion)

bpy.ops.mesh.primitive_torus_add(
    major_radius=0.030 * UNIT,
    minor_radius=0.0025 * UNIT,
    major_segments=48,
    minor_segments=10,
    location=(0.0, pendant_location[1], pendant_location[2] + 0.005 * UNIT)
)
outer_rim = bpy.context.object
outer_rim.name = "Carter_Medallion_Outer_Rim"
assign_material(outer_rim, brass_light)
parent_keep_world(outer_rim)

bpy.ops.mesh.primitive_torus_add(
    major_radius=0.020 * UNIT,
    minor_radius=0.0012 * UNIT,
    major_segments=40,
    minor_segments=8,
    location=(0.0, pendant_location[1], pendant_location[2] + 0.006 * UNIT)
)
inner_rim = bpy.context.object
inner_rim.name = "Carter_Medallion_Inner_Rim"
assign_material(inner_rim, brass_light)
parent_keep_world(inner_rim)

# Simplified Egyptian relief; this is a first-pass art motif to be checked against the illustration.
bpy.ops.mesh.primitive_torus_add(
    major_radius=0.006 * UNIT,
    minor_radius=0.0015 * UNIT,
    major_segments=24,
    minor_segments=8,
    location=(0.0, pendant_location[1] + 0.006 * UNIT, pendant_location[2] + 0.009 * UNIT)
)
ankh_loop = bpy.context.object
ankh_loop.name = "Carter_Medallion_Relief_Loop"
assign_material(ankh_loop, brass_light)
parent_keep_world(ankh_loop)

stem = rounded_box(
    "Carter_Medallion_Relief_Stem",
    (0.003 * UNIT, 0.014 * UNIT, 0.002 * UNIT),
    (0.0, pendant_location[1] - 0.003 * UNIT, pendant_location[2] + 0.009 * UNIT),
    brass_light,
    0.001 * UNIT
)
parent_keep_world(stem)

bar = rounded_box(
    "Carter_Medallion_Relief_Bar",
    (0.010 * UNIT, 0.003 * UNIT, 0.002 * UNIT),
    (0.0, pendant_location[1] + 0.001 * UNIT, pendant_location[2] + 0.009 * UNIT),
    brass_light,
    0.001 * UNIT
)
parent_keep_world(bar)

# Put all objects into the dedicated collection and leave the accessory root selected.
for obj in list(bpy.context.scene.objects):
    if obj == root or obj.parent == root:
        for current_collection in list(obj.users_collection):
            current_collection.objects.unlink(obj)
        collection.objects.link(obj)

bpy.ops.object.select_all(action="DESELECT")
root.select_set(True)
bpy.context.view_layer.objects.active = root

print("Carter accessory source created. Inspect placement against the Ara model before binding to Hips or exporting.")
