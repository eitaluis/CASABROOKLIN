# Carter — Blender accessory source

This folder contains an editable Blender-side source generator for the satchel, crossbody strap and neck medallion.

## Run

1. Open Blender 3.6 or newer.
2. Open the Scripting workspace.
3. Load create_carter_accessories.py and press Run Script.
4. Inspect the collection CARTER_ACCESSORIES_SOURCE.
5. Save the scene as a .blend file after confirming the accessory placement against the current Carter model.

The script creates editable mesh and curve objects with materials, bevels and grouped hierarchy. It does not download external assets, modify the Ara body, or change the existing game rig.

## Coordinate convention

- Units: metres.
- Up: +Y.
- Carter faces: +Z.
- Feet / ground plane: Y = 0.
- Carter's anatomical right hip: -X.
- Bag centre: approximately (-0.245, 0.656, -0.135) metres for a 1.75 m character.
- Bag broad panel: rotated -90° around Y so it faces the character's anatomical right side; the bag sits on the posterior/right pelvis rather than the front of the abdomen.
- Bag dimensions: approximately 0.305 × 0.245 × 0.092 m before bevels, about 15% smaller than the first pass.
- The body uses the same tapered eight-point outline and soft bevel as the Three.js runtime; its thickness is extruded from the bag pivot so both sources share the same rest pose.
- The side-facing flap and rounded pocket overlap the bag surface; two small brass snaps sit on the pocket, and a separate brass ring aligns to the strap endpoint at the upper-rear corner.
- Strap: crosses the chest, wraps the right flank and attaches to the upper-rear corner of the satchel; the small brass anchor ring is aligned to the strap endpoint.
- Medallion: centred on the front of the upper chest.

## Runtime relationship

The game currently creates lightweight procedural geometry in `src/character-accessories.js`; it is not using a downloaded GLB for the satchel. The attached user screenshot on 27/11/2026 shows that the current runtime fit is visually incorrect (floating bag/strap/necklace), so treat this generator and the runtime geometry as unapproved prototypes.

The current runtime attaches the bag and strap roots to Hips and the necklace root to an upper-chest bone. The older Blender generator still contains separate bag/strap/necklace anchors and must be reconciled after the user approves a new visual direction. Do not assume the old Spine2 strap anchor matches the runtime.

The visual direction and composition for the Innerscene satchel body + newly rebuilt strap were explicitly approved on 27/11/2026. The actual GLB bytes are not available in the current working session because the provider's download redirects to an inaccessible file host. Do not substitute the procedural prototype or guess the imported mesh hierarchy. Once `crossbody-bag.glb` is supplied locally, inspect its nodes, meshes, transforms and materials before removing only its original loose strap and creating the Carter-fitted strap.

Do not export the body or replace the approved Ara character from this script.

## Art direction

- Cognac leather, dark flexible flap, rounded/tapered body, discreet pocket, restrained stitching and small aged-brass hardware.
- Compact posterior side-satchel silhouette; avoid a hard rectangular radio/box appearance.
- Remove the Ara backpack: runtime creation explicitly uses `carry: 'none'`.
- Gold neck medallion; its approved design remains unchanged. Move the chain and pendant approximately 4.5 cm toward the torso so they rest against the shirt instead of floating.
- Keep geometry, bevels and hardware readable at mobile viewing size without increasing the accessory silhouette excessively.

See docs/CHARACTER.md for the approved hybrid pipeline and remaining visual QA.