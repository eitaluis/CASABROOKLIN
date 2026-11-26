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
- Strap: crosses the chest, wraps the right flank and attaches to the rear/right hip.
- Medallion: centred on the front of the upper chest.

## Runtime relationship

The game currently creates the corresponding lightweight geometry in src/character-accessories.js and attaches it to the Ara Hips bone when available. The Blender generator is the editable look-development source for future refinement; it is not yet imported as a GLB in the game.

The script creates three separate anchors: Carter_Bag_Hips_Anchor for the bag, Carter_Strap_Spine2_Anchor for the shoulder strap, and Carter_Necklace_Spine2_Anchor for the chain/medallion. When the Ara rig is present, parent the bag anchor to Hips and the strap/necklace anchors to Spine2 (or the nearest upper-chest bone), preserving rest-pose placement. Do not export the body or replace the approved character from this script.

## Art direction

- Cognac leather, dark flexible flap, rounded/tapered body, discreet pocket, restrained stitching and small aged-brass hardware.
- Compact posterior side-satchel silhouette; avoid a hard rectangular radio/box appearance.
- Remove the Ara backpack: runtime creation explicitly uses `carry: 'none'`.
- Gold neck medallion; its approved design remains unchanged. Move the chain and pendant approximately 4.5 cm toward the torso so they rest against the shirt instead of floating.
- Keep geometry, bevels and hardware readable at mobile viewing size without increasing the accessory silhouette excessively.

See docs/CHARACTER.md for the approved hybrid pipeline and remaining visual QA.