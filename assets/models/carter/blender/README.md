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
- Bag centre: approximately (-0.255, 0.656, 0.0525) metres for a 1.75 m character.
- Strap: from the left shoulder to the right hip.
- Medallion: centred on the front of the upper chest.

## Runtime relationship

The game currently creates the corresponding lightweight geometry in src/character-accessories.js and attaches it to the Ara Hips bone when available. The Blender generator is the editable look-development source for future refinement; it is not yet imported as a GLB in the game.

Before exporting a skinned accessory, inspect the Ara rig in Blender and parent the finished asset to the correct Hips bone while preserving its rest-pose placement. Do not export the body or replace the approved character from this script.

## Art direction

- Cognac leather, dark leather flap, restrained stitching and aged brass.
- Compact crossbody silhouette with no oversized tactical pouches.
- Gold neck medallion; the central relief is a first-pass visual motif and must be checked against the supplied Karen de la Vega illustration.
- Keep geometry, bevels and hardware readable at mobile viewing size without increasing the accessory silhouette excessively.

See docs/CHARACTER.md for the approved hybrid pipeline and remaining visual QA.