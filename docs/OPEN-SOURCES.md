# Fontes abertas e proveniência

## Regra geral

Todo novo objeto ou espaço deve seguir [ASSET-FIRST-ROOM-BUILDING.md](ASSET-FIRST-ROOM-BUILDING.md). Fontes e licenças são verificadas por asset individual; um repositório que hospeda um ficheiro não substitui a licença original do autor. A proveniência atual e os ficheiros locais ficam em assets/manifest.json.

## Personagem Carter — runtime ativo

**Ara 3D Gen** — https://github.com/ara3d/ara3d — pacote JavaScript MIT.
- O runtime voltou à implementação compartilhada do Carter que já estava aprovada antes das tentativas de redesign.
- O código ativo em src/character.js utiliza o share salvo do Ara 3D Gen e os clips idle, walk, run e jump.
- Os estudos Quaternius e a tentativa de reconstrução procedural do Carter foram rejeitados e removidos do jogo.
- O controlador comum serve desktop e mobile.

## Grande Salão — modelos e efeitos

### Sofa 03 — Poly Haven
- Página original: https://polyhaven.com/a/sofa_03
- Autor: Fran Calvente.
- Licença: CC0-1.0.
- Dimensões nativas catalogadas: 2,731 × 0,925 × 1,118 m.
- 8.004 triângulos, dois materiais PBR; o GLB local inclui mapas de base color, normal e roughness.
- Ficheiro: assets/models/polyhaven-sofa-03.glb. O carregamento utiliza GLTFLoader e MeshoptDecoder do Three.js.
- A escala no salão é 0,84. O modelo é um asset real, não uma geometria procedural que imita um sofá.

### Fogo volumétrico — Housz
- Repositório: https://github.com/Housz/ThreeVolumetricFire
- Licença MIT. O aviso original está preservado em licenses/THREE-VOLUMETRIC-FIRE-MIT.txt.
- A classe fonte foi adaptada do shader WebGL para GLSL3/WebGL2 e vendorizada em src/vendor/volumetric-fire.js.
- As texturas nzw.png e firetex.png vêm do exemplo do repositório original e permanecem em assets/fire/.
- A cena combina o volume de fogo com lenha, brasas, faíscas e luzes pontuais locais.
- A adaptação deve continuar atribuída ao autor original e não deve remover o aviso MIT.

### Materiais PBR — Poly Haven e ambientCG

Todos os conjuntos listados abaixo são CC0-1.0 e estão empacotados localmente com mapas de cor, normal e roughness:
- Poly Haven Walnut Veneer 02 — https://polyhaven.com/a/walnut_veneer_02 — assets/textures/wood-walnut/.
- Poly Haven Beige Wall 001 — https://polyhaven.com/a/beige_wall_001 — assets/textures/plaster-smooth-beige/.
- ambientCG Tiles139 (calcário bege) — https://ambientcg.com/a/Tiles139 — assets/textures/tile-limestone-beige/.
- ambientCG Marble012 — https://ambientcg.com/a/Marble012 — assets/textures/marble-white/.
Os mapas estão locais para que a sala não dependa de downloads de textura em tempo de execução.

### Escultura de Thoth
- Referência histórica/visual: Thoth, c. 644 BCE–30 CE, Minneapolis Institute of Art, via Sketchfab: https://sketchfab.com/3d-models/thoth-c-644-bce-30-ce-394a94722862460e8cefab54b4bed7bf — referência CC0 identificada na página.
- O modelo escaneado não foi importado. A escultura figurativa no jogo é geometria original para preservar o corpo humano com cabeça de íbis, túnica, braços, papiro e cetro.
- A superfície escura mantém albedo original e recebe mapas reais de normal/roughness para conservar os reflexos.

### Geometria original do ambiente
- Tapete de escamas de serpente, mesa baixa, colunas de lótus, capitéis, escadarias, corrimãos e painéis de relevo são construções próprias para encaixar na arquitetura do Grande Salão.
- O seu uso de materiais PBR abertos não significa que a geometria seja de Poly Haven/ambientCG.
- Os elementos que ainda não têm um asset dedicado (instrumentos, armas expostas, peças secundárias) permanecem listados como lacunas na matriz asset-first.

## Ferramentas e motor

**Three.js** — https://github.com/mrdoob/three.js — MIT. A versão usada é 0.165.0.
- GLTFLoader e MeshoptDecoder carregam o GLB Sofa 03 comprimido.
- O EffectComposer, SSAO e UnrealBloomPass compõem o lookdev compartilhado; perfis de qualidade são diferenciados por dispositivo, sem criar cenas diferentes.

## Movimento — referências futuras

- Mesh2Motion: https://github.com/Mesh2Motion/mesh2motion-app — ferramenta aberta para rigging/retarget de GLB; ainda não integrada.
- Quaternius Universal Animation Library: https://quaternius.itch.io/universal-animation-library — clips CC0, possível fonte futura; não integrada.

