# Warehouse brick PBR — source credits

All five local JPEG maps in this directory are from Poly Haven and are CC0 1.0. They are stored locally; the game does not hotlink to the source sites.

## Brick Wall 001
- Source: https://polyhaven.com/a/brick_wall_001
- Creators: Dimitrios Savva (photography), Rob Tuytel (processing)
- License: CC0 1.0 — https://polyhaven.com/license
- Scan dimensions: 3 × 3 m
- Resolution: 1K JPEG
- Local files:
  - brick-wall-diffuse.jpg — diffuse/albedo (sRGB)
  - brick-wall-normal.jpg — OpenGL tangent-space normal (linear)
  - brick-wall-roughness.jpg — roughness (linear)
- Acquisition mirror/reference: https://github.com/Mastercyril/destinys-world-playcanvas/tree/2a3ff78a71ad6881476e6882b4e65aa02a2978fd/public/assets/textures

## Broken Brick Wall
- Source: https://polyhaven.com/a/broken_brick_wall
- Creator: Amal Kumar
- License: CC0 1.0 — https://polyhaven.com/license
- Scan dimensions: 1.8 × 1.8 m
- Resolution: 1K JPEG
- Local files:
  - broken-brick-diffuse.jpg — diffuse/albedo (sRGB)
  - broken-brick-orm.jpg — packed AO / roughness / metallic; R=AO, G=roughness, B=metallic
- Acquisition mirror/reference: https://github.com/Easier87/Dreamcatcher3D/tree/df9e07cef3f6f140159ab6cdb2486649172ced0c/assets/broken_brick_wall_1k/textures
- The separate Broken Brick Wall normal map is not stored in this project. The four localized damage overlays reuse Brick Wall 001's OpenGL normal map at low strength (normalScale 0.22); this is a production approximation, not the original Broken Brick normal.

Attribution is not required by CC0, but the artists and source pages are credited here and in docs/OPEN-SOURCES.md and assets/manifest.json.
