---
name: casabrooklin-visual-research-and-asset-approval
description: Use before every requested visible/gameplay change to the Brooklyn House project: characters, objects, rooms, props, textures, effects, spells, animation, interactions, or visual polish. Research the books and official artwork, find usable visual references and real 3D/code assets, show the user a visual comparison, and wait for explicit approval before integration.
---

# CASABROOKLIN — Visual research, asset discovery and approval workflow

## Scope

This skill applies to the entire Brooklyn House / Projeto Brooklyn reconstruction of *The Kane Chronicles*, not only to room construction. Use it before any requested change involving a visible or player-facing element: character design, accessories, clothing, objects, furniture, architecture, textures, lighting, particles, spells, animation, combat choreography, interactables, UI that represents an in-world object, and visual corrections.

For a strictly technical change that has no visual or narrative subject (for example a JavaScript exception with no design impact), inspect the affected code and state briefly why book/art/asset research is not applicable. Do not invent visual research just to fill a checklist.

## Non-negotiable approval gate

**Do not download, modify, integrate, replace, or commit a new visual asset or new visual design before the user has seen the visual options and explicitly approved a direction.**

The workflow is staged:

1. Research the source material.
2. Research official art and other visual references.
3. Search for usable assets and verify their provenance, license and technical suitability.
4. Present the actual images/previews, comparisons, links, differences and a recommended direction in the conversation.
5. Stop and wait for explicit approval (for example: “aprovado o 2”, “pode usar esse asset” or a requested correction).
6. Only after approval, download/create/adapt and integrate the selected asset.
7. Verify the result in the shared runtime on desktop and mobile, then document it.

A question, discussion, reference upload or request to “research” is not approval. Silence is not approval. If no candidate is suitable, present an original-design proposal with visual references before modeling it.

## 1. Read the books first

- Search the relevant book(s), chapter(s), official excerpts, publisher/author materials and any supplied source files.
- Search the complete relevant passage, not only a keyword snippet. Check earlier/later mentions when the object or place appears more than once.
- Record the exact book, chapter/page when available, and a short source-grounded description of shape, material, color, scale, use, motion and context.
- Separate findings into:
  - **Canônico textual:** directly stated in a novel or official text.
  - **Canônico visual/editorial:** present in official publisher/author/authorized illustrator artwork.
  - **Referência histórica:** real-world historical object, architecture, material or technique used to resolve missing detail.
  - **Referência artística/fan art:** useful for visual interpretation, but never label it official or canonical.
  - **Interpretação de produção:** new design decisions required where the source is silent.
- Do not transfer the description of one character's object to another character. For example, a satchel handed to Sadie is not proof that Carter's bag is identical.
- Do not claim a specific construction, material, color or dimension is canon unless the source supports it.
- Quote only short passages; prefer accurate paraphrase and citations.

## 2. Research official visual references

Search in this order where available:

1. Rick Riordan's official site and official character/series/resource pages.
2. Disney Books / official publisher pages, book art, event kits, graphic novels and official press kits.
3. Official illustrators and designers credited for the relevant book/graphic novel; inspect their portfolios and process pages.
4. Museum collections, archives, conservation records and historical object catalogues for real-world analogues.
5. Other artists, fan illustrations and community references, clearly labelled as unofficial.

For every reference, state what it supports (silhouette, costume, strap routing, materials, proportions, pose, ornament, light, etc.) and what it does not prove. Never call a fan-art image “official”.

## 3. Search for real assets before building from scratch

Search relevant sources such as GitHub, Poly Haven, ambientCG, Sketchfab, Blender/OpenGameArt, CC0 libraries, official Three.js examples and other reputable 3D repositories.

For each candidate, check and record:

- Direct source page and, where available, direct file/viewer link.
- Author/creator and exact license (CC0, MIT, CC BY, etc.); do not infer a license from a search thumbnail or mirror.
- File format (GLB/glTF/FBX/OBJ/Blend), file size, polygon/triangle count, real dimensions and axis/origin convention.
- Mesh hierarchy, separate parts, rig/skeleton, animations, UVs, material slots, texture resolution and dependencies.
- Three.js compatibility, required loaders/decoders, remote CORS/runtime availability, mobile cost and whether the asset can be stored locally.
- Required modifications to fit the book reference and the existing character/room.
- Any mismatch: proportions, era, style, logos, unwanted straps, loops, handles, unsupported materials or incompatible rig.

Reject unsuitable models even when they are free. A license must be checked at the original provider/source page. If the preview is not inspectable or the license is unclear, mark it **unverified** and do not integrate it.

## 4. Present a visual approval board in chat

Before implementation, provide a visual packet that includes:

- The relevant book-derived description, with canon/inference separated.
- Official illustration(s) or official references when found.
- The user's previously approved reference(s), correctly attributed.
- Historical/real-world visual references when useful.
- Actual previews of each candidate 3D model/texture/animation/asset, not only a text description.
- A comparison of scale, silhouette, materials, attachment, fit, style, technical compatibility and license.
- A short recommended direction and any trade-offs.
- A clear list of what would be changed and what would be preserved from prior approvals.

Use image cards/carousels or image groups so the user can inspect the objects. If a 3D viewer is available, include its link in addition to a still preview. If a source cannot provide a preview, say so and do not present a placeholder as if it were the asset.

**Wait for the user's explicit approval before moving to implementation.** If the user rejects all candidates, research again or propose an original design and show its visual reference board first.

## 5. Implement only the approved direction

After approval:

- Preserve approved character body, face, proportions and previously accepted design elements unless the user explicitly changes them.
- Use the approved asset as the starting point when technically suitable; customize it to the narrative, rather than generating a visually unrelated substitute.
- If building original geometry, match the approved silhouette/material references and real-world proportions. Avoid boxy placeholders, floating accessories and generic low-poly substitutes.
- For character accessories, inspect the model's actual rig hierarchy and coordinate axes. Use the correct bone/socket; derive placement from the rest pose and body surface, not guessed world coordinates.
- Straps, necklaces, bags, weapons and held objects must physically meet the body/hand, follow the relevant bones, and not hover, penetrate, stretch, detach or clip during idle, walk, run, turns, jumps, attacks and hit reactions.
- Keep the same scene, character, objects, gameplay and assets on desktop and mobile. Only input/UI adaptations may differ.
- Preserve the approved original Carter Ara base. Do not replace the face/body/rig to simplify accessory integration.
- Keep exact source/creator/license and modifications in `assets/manifest.json`, `docs/OPEN-SOURCES.md` and the appropriate study/reference document.
- Store local assets in the correct `assets/` folder; avoid hotlink-only production dependencies unless the user approved that deployment choice.

## 6. Visual QA and handoff

Review each integrated item at real character scale and in the actual gameplay camera:

- Front, back, left/right profile and both three-quarter angles.
- Neutral idle and any relevant movement/action clips.
- Correct attachment point, surface offset, gravity/drape, strap path, scale and collision.
- No floating, clipping, unwanted props, duplicate straps, geometry intersections or sudden jumps.
- Desktop and mobile landscape with the same content/runtime.
- Check load errors, console errors, performance and asset disposal.
- **GitHub Pages cache invalidation:** whenever a JavaScript module changes, bump the importing `?v=` token in `src/main.js`; whenever `src/main.js` changes, bump its script `?v=` token in `index.html`. Verify that both URLs point to the new revision before reporting the fix.
- Distinguish status precisely: **researched**, **visuals presented**, **approved**, **integrated**, **tested in browser**, **visually approved**. Never claim a later stage when only an earlier stage is complete.

## 7. Project record

For every approved integration:

- Add the selected source, author, license, file format, dimensions, technical changes and rationale to `assets/manifest.json`.
- Add canon vs inference, official visual references, rejected candidates and remaining QA to a relevant file in `docs/` or `assets/references/`.
- Update the existing asset-first matrix instead of creating duplicate, conflicting standards.
- Preserve the same workflow for future rooms, items, spells, movement, character accessories, combat effects and visual corrections.
