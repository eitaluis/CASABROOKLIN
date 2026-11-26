# HA-DI VFX — local CC0 sprites

The HA-DI spell uses five sprites from the **Kenney Particle Pack**:

| Local file | Source sprite | Runtime use |
|---|---|---|
| `kenney-magic-01.png.b64` | `magic_01.png` | Additive energy core / warm glow |
| `kenney-smoke-03.png.b64` | `smoke_03.png` | Expanding dust and smoke puffs |
| `kenney-circle-03.png.b64` | `circle_03.png` | Expanding floor sigil |
| `kenney-spark-07.png.b64` | `spark_07.png` | Gold impact sparks |
| `kenney-slash-02.png.b64` | `slash_02.png` | Luminous cutting arc |

- Original pack: https://kenney.nl/assets/particle-pack
- Author: Kenney
- License: CC0 1.0 (public domain dedication): https://creativecommons.org/publicdomain/zero/1.0/
- Original asset page: https://kenney.nl/assets/particle-pack
- Upstream repository mirror: https://github.com/Calinou/kenney-particle-pack (CC0 license text is retained in `LICENSE-KENNEY-PARTICLE-PACK.txt`)
- File extraction mirror used for this import: https://github.com/Mrice90/TubaExperiment/tree/strip/zeus-poseidon-desktop/game-gui/src/main/resources/vfx/kenney-particle-pack

## Why the files end in .b64

The PNG binaries are stored as Base64 text to keep the asset ingestion path compatible with the repository file connector. At runtime, `src/magic-system.js` fetches the text from the same origin, decodes it into a data URL and creates a Three.js `Texture`. No CDN or third-party runtime package is required. If a sprite cannot load, the spell falls back to generated Canvas textures and remains functional.

The VFX composition, timing, particle motion, materials, ring geometry, rays and integration with the Shabti impact are original CASABROOKLIN code. The Kenney sprites are the only third-party images imported by this iteration.
