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
- A escala atual no salão é 0,78; a largura final aproximada no eixo longo é 2,13 m. O modelo é um asset real, não uma geometria procedural que imita um sofá.

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
- O modelo escaneado não foi importado. A escultura figurativa no jogo é geometria original: corpo humano, pernas, kilt shendyt com pregas, faixa diagonal, colar largo, cabeça e bico de íbis, papiro aberto e estilete de escriba.
- A estátua mantém albedo negro original e recebe mapas PBR CC0 de normal/roughness para conservar os reflexos e reforçar o micro-relevo.
- O vetor `assets/decor/per-ankh.svg` é original do projeto e representa visualmente a composição dos sinais de casa (O1) e vida/ankh (S34). Não é apresentado como transcrição epigráfica atestada.

### Iconografia decorativa — Game-icons (CC BY 3.0)

- Repositório: https://github.com/game-icons/icons.
- A documentação de contribuição do repositório informa que a maioria dos ícones é CC BY 3.0; os autores individuais são preservados. Os sete ícones aqui selecionados são tratados como CC BY 3.0.
- Autores e fontes: Delapouite — `eye-of-horus.svg`, `harp.svg`, `drum.svg`, `flute.svg`; Lorc — `spears.svg`, `crossed-chains.svg`, `padlock.svg`.
- Os ficheiros adaptados estão em `assets/decor/game-icons/`: foi removido o fundo preto e os glifos foram recoloridos em dourado. São decals SVG, não modelos 3D.
- A atribuição por autor, ligações aos SVGs originais e descrição das alterações ficam em `assets/decor/README.md`.

### Portas, instrumentos e interação no Grande Salão

- A porta dupla, moldura, correntes e seis cadeados são geometria original sob medida. O Eye of Horus, crossed chains e padlock usam SVGs Game-icons CC BY 3.0; o conjunto tem collider e interação de inspeção que informa o estado trancado. A mecânica de destrancar ainda não foi implementada.
- Harpas, tambores, lanças e khopeshes são geometria original com walnut PBR CC0 e metais locais. Foram mantidos porque nenhum GLB de instrumento egípcio de alta qualidade, estilo compatível e licença comprovada foi encontrado nesta pesquisa. Os SVGs Game-icons servem apenas como identificação visual nas placas.
- A flauta é uma peça complementar original, com collider e prompt de inspeção; os sinais de flauta vêm do SVG CC BY 3.0.
- A parede envidraçada usa Three.js `MeshPhysicalMaterial` e moldura de bronze original. Os painéis têm colisores para impedir atravessamento.
- Os sofás usam o GLB Poly Haven Sofa 03 CC0 em escala 0,78. Collider e inspeção estão integrados; sentar/levantar continua como interação futura.

### Geometria original do ambiente
- Tapete de escamas de serpente, mesa baixa, colunas de lótus, capitéis, escadarias, corrimãos e painéis de relevo são construções próprias para encaixar na arquitetura do Grande Salão.
- Instrumentos e armas de parede — harpas arqueadas, tambores de pele, lanças e khopeshes — são geometrias originais sob medida porque não foi encontrado um pack high-detail com licença verificada e estilo compatível. Recebem nogueira PBR CC0 e bronze próprio; não são creditadas como modelos Poly Haven.
- O seu uso de materiais PBR abertos não significa que a geometria seja de Poly Haven/ambientCG. Outras peças secundárias continuam listadas como lacunas na matriz asset-first.

## Ferramentas e motor

**Three.js** — https://github.com/mrdoob/three.js — MIT. A versão usada é 0.165.0.
- GLTFLoader e MeshoptDecoder carregam o GLB Sofa 03 comprimido.
- O EffectComposer, SSAO e UnrealBloomPass compõem o lookdev compartilhado; perfis de qualidade são diferenciados por dispositivo, sem criar cenas diferentes.

## Movimento — referências futuras

- Mesh2Motion: https://github.com/Mesh2Motion/mesh2motion-app — ferramenta aberta para rigging/retarget de GLB; ainda não integrada.
- Quaternius Universal Animation Library: https://quaternius.itch.io/universal-animation-library — clips CC0, possível fonte futura; não integrada.

