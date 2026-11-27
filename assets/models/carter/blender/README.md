# Carter — Blender accessory source

This folder contains an editable Blender-side look-development generator for Carter's satchel, crossbody strap and neck medallion.

## Run

1. Open Blender 3.6 or newer.
2. Open the Scripting workspace.
3. Load create_carter_accessories.py and press Run Script.
4. Inspect the collection CARTER_ACCESSORIES_SOURCE against the Ara Carter model.
5. Save the scene as a .blend only after checking front, side, back and three-quarter views.

The script creates editable mesh and curve objects. It does not download the approved Innerscene GLB, modify the Ara body, or bind the source objects to the game rig. Treat it as a Blender look-dev aid, not as a runtime export.

## Coordinate convention

- Units: metres.
- Up: +Y.
- Carter faces: +Z.
- Feet / ground plane: Y = 0.
- Carter's anatomical right hip: -X.
- Runtime target point for the bag surface fit: near (-0.205, 0.656, -0.085) m for a 1.75 m Carter; the runtime refines this by raycasting against the deformed skinned mesh.
- Bag broad panel faces the anatomical right side; its location is posterior/lateral, not over the front of the abdomen.
- Body target dimensions: approximately 0.202 × 0.158 × 0.076 m (width × height × depth), corresponding to 0.88 scale of the Innerscene body dimensions 0.230 × 0.180 × 0.086 m.
- The body uses a soft tapered outline, rounded bevels, a flexible dark flap, a discreet pocket, fine stitching and restrained brass snaps.
- Strap width: 0.022 m. It crosses from the left shoulder diagonally over the chest, rounds the right flank and connects to the upper-rear ring of the satchel.
- The approved gold medallion remains unchanged; the chain should sit close to the shirt and the medallion should rest against the upper chest.

## Runtime relationship

The game uses src/character-accessories.js. The current runtime revision builds accessories in Carter model-local coordinates and only then reparents each root to its anatomical bone with Object3D.attach(), preserving the neutral rest pose.

- Bag root: Hips.
- Upper strap section: Spine2, falling back to Spine1.
- Lower strap section: Hips.
- Necklace and medallion: upper thoracic bone (Spine2 / Spine1).
- Strap and necklace control points are projected onto the deformed SkinnedMesh with raycasting. Surface normals are derived from the deformed triangle vertices, not from guessed world offsets.
- The same src/character.js module is used by desktop, mobile and character-preview.html. Only input/UI behavior differs.

## Important asset provenance

The user explicitly approved the Innerscene Crossbody Bag as the body reference and the rebuilt strap direction. Its source page declares CC0 and describes a 230 × 86 × 180 mm cognac leather body. The original GLB is **not yet imported**: the provider's download redirects to files.innerscene.com, which was not accessible to the current working tools. Therefore the live bag body remains a procedural interim shape matching the approved size/silhouette target; it is not the original Innerscene mesh. Do not describe it as an imported GLB.

Once the GLB bytes become available, inspect its nodes, meshes, transforms, materials and connected components before removing only its original loose strap and substituting the fitted Carter strap. Do not guess the imported hierarchy and do not replace the approved Ara body, face, hair or rig.

## Art direction

- Cognac leather, dark flexible flap, rounded/tapered body, discreet pocket, restrained stitching and small aged-brass hardware.
- Compact posterior side-satchel silhouette; avoid a hard rectangular radio/box appearance.
- The Ara share still uses carry: 'none'. The dark shoulder object visible in the earlier screenshot has not yet been identified in the Ara hierarchy; do not remove unrelated meshes by approximation.
- The approved gold medallion design remains intact. The chain and pendant are now fitted to the deformed shirt surface at runtime instead of using a fixed 4.5 cm offset.
- Keep geometry, bevels and hardware legible at mobile viewing size without enlarging the accessory silhouette.

## QA status

Code and cache-busting imports are integrated. Static JavaScript syntax has been checked. The preview/game still needs a real browser inspection in front, side, back and three-quarter views, followed by idle, walk, run, turn, jump and hit checks on desktop and landscape mobile. Do not mark the accessories visually approved before that review.

See docs/CHARACTER.md and docs/CARTER-ACCESSORIES-REFERENCE-STUDY.md for the project decisions and remaining checks.
