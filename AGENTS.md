# Agent instructions — Projeto Brooklyn

Before starting any task in this repository, read [SKILL.md](SKILL.md) and follow it.

## Mandatory visual-work rules

- For every change with a visual or gameplay-facing subject (character, accessory, object, room, texture, light, spell, animation, combat effect, interaction or UI representation), research the book text first.
- Separate canon text, official publisher/author/illustrator art, historical references, fan art and production interpretation.
- Search for existing 3D/code/texture/animation assets and verify source, license, dimensions, formats, hierarchy, rig, Three.js compatibility and mobile cost.
- Show the user the real reference images/previews and asset comparisons in chat.
- Wait for explicit user approval before downloading, modeling, replacing, modifying or integrating a new visual asset or design.
- Do not treat a search result, a generated preview, silence or a prior unrelated approval as approval of a new asset.
- Preserve the approved Carter Ara base and previously approved design elements unless the user explicitly asks to change them.
- Desktop and mobile must share the same scene, character, geometry, assets and gameplay logic. Only input/UI adaptations may differ.
- Whenever a JavaScript module changes, update its import `?v=` cache token in `src/main.js`; when `src/main.js` changes, update the script `?v=` token in `index.html` as well. Verify both references before handoff so GitHub Pages cannot serve stale modules.
- Report the exact implementation and QA status. Never say browser-tested or visually approved unless an actual browser review was performed.

For purely technical changes with no visual/narrative subject, inspect the affected code and state why the book/art/asset research phase is not applicable.
