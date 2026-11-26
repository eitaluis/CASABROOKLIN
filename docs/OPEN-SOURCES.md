# Fontes abertas e proveniência

## Regra geral

Todo novo objeto ou espaço deve seguir [ASSET-FIRST-ROOM-BUILDING.md](ASSET-FIRST-ROOM-BUILDING.md). Fontes e licenças são verificadas por asset individual; um repositório que hospeda um ficheiro não substitui a licença original do autor. A proveniência atual e os ficheiros locais ficam em assets/manifest.json.

## Personagem Carter — runtime híbrido

**Ara 3D Gen** — https://github.com/olatunde85/3d-gen — pacote JavaScript MIT; os dados de personagem usam MakeHuman CC0 e os clips de captura de movimento vêm da base CMU, livres para uso comercial conforme a licença/documentação do projeto.
- O corpo, rosto, cabelo, rig e clips principais preservam o Carter aprovado no share salvo do Ara.
- src/character.js carrega idle, walk, run e a sequência de salto, além de consultar ANIMATIONS para selecionar ações cinematográficas disponíveis (look_around, talk_gestures, wave, point e bow).
- src/character.js sobrescreve o item carregado do share Ara com `carry: 'none'`, removendo a mochila original.
- src/character-accessories.js acrescenta geometria original do projeto: bolsa de couro conhaque menor, arredondada e virada para a lateral/posterior do quadril direito; alça cruza o peito e contorna o flanco. A bolsa segue Hips; alça e colar seguem o alto do tronco. O medalhão foi recuado para assentar sobre a camisa. Não utiliza GLB de terceiro.
- assets/models/carter/blender/create_carter_accessories.py é a fonte editável de lookdev no Blender; ainda não é um .blend nem um asset carregado em runtime.
- src/main.js direciona o olhar para o objeto examinado por E/INTERAGIR.
- src/third-person.js suaviza aceleração, curvas, inclinação e câmera; o mesmo controlador e os mesmos assets são usados no desktop e mobile.
- Os estudos Quaternius e o protótipo procedural anterior foram rejeitados; não fazem parte do runtime.

## Grande Salão — modelos e efeitos

### Sofa 03 — Poly Haven
- Página original: https://polyhaven.com/a/sofa_03
- Autor: Fran Calvente.
- Licença: CC0-1.0.
- Dimensões nativas catalogadas: 2,731 × 0,925 × 1,118 m.
- 8.004 triângulos, dois materiais PBR; o GLB local inclui mapas de base color, normal e roughness.
- Ficheiro: assets/models/polyhaven-sofa-03.glb. O carregamento utiliza GLTFLoader e MeshoptDecoder do Three.js.
- A escala atual no salão é 0,72; a largura final aproximada no eixo longo é 1,97 m. O código normaliza o pivot pela bounding box e mantém um fallback proporcional se o GLB falhar. O modelo é um asset real, não uma geometria procedural que imita um sofá.

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
- Os sofás usam o GLB Poly Haven Sofa 03 CC0 em escala 0,72. Collider e inspeção estão integrados; sentar/levantar continua como interação futura.

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



### Televisão de plasma
- As páginas Poly Haven Television 01 (Gabriel Radić) e Television 02 (Benny Weimer) foram verificadas como assets CC0, mas ambas são televisores CRT antigos e não correspondem à televisão de plasma descrita no livro.
- Mantivemos uma geometria original de tela plana, com vidro físico refletivo, moldura metálica e toggle de energia integrado à inspeção por proximidade. Os modelos CRT não foram baixados/importados.
- Fontes avaliadas: https://polyhaven.com/a/Television_01 e https://polyhaven.com/a/television_02.


## Estudo visual/técnico — água do East River

- [mqnc/cheapwater](https://github.com/mqnc/cheapwater) — MIT. Referência de estudo para superfícies de água Three.js com normais animadas e baixo custo. **Não foi incorporado código, textura ou shader deste repositório**; a superfície da Brooklyn House usa um mapa de altura procedural original documentado em `src/exterior.js`.


## Biblioteca subterrânea — pesquisa de referências (26/11/2026)

### Referência oficial do universo
- Rick Riordan — página oficial da série: https://rickriordan.com/series/kane-chronicles/.
- A sinopse oficial de *The Throne of Fire* descreve Brooklyn House como centro de treinamento dos jovens magos. A página não fornece uma planta ou imagem oficial específica da biblioteca subterrânea; portanto, não deve ser usada como referência visual direta para a câmara.
- Disney Books — catálogo oficial de *The Kane Chronicles*: https://books.disney.com/kane-chronicals/. Confirma os títulos e materiais oficiais da série, mas não apresenta concept art da biblioteca.
- Diretriz: a arquitetura circular, cúpula de Nut, piso de Geb, distribuição dos nichos e organização dos shabtis continuam identificadas como reconstrução de level design, salvo confirmação textual mais específica. Fan art não é fonte canônica.

### Papiro aberto — candidato de estudo, não integrado
- Página do modelo: https://tevy.dev/models/open-parchment-scroll.
- GLB com 7.772 triângulos (LOD0), 986 KB, dimensões declaradas de 0,2 × 0,02 × 0,23 m e três níveis de detalhe.
- Licença declarada na página: CC0 1.0.
- A descrição informa que a folha contém glifos inventados e classifica o modelo em tags de fantasia/RPG/medieval. Por isso, não foi integrado como artefato egípcio. Pode ser avaliado futuramente apenas como referência de malha, com material e grafismo substituídos, após inspeção do GLB.

### Shabtis — referência de forma, não integrada
- Catálogo: https://www.artheonmuseum.org/artwork/ushabti-figures-cf0631.
- O catálogo identifica duas figuras do Archaeological Museum in Kraków, digitalizadas pelo projeto Virtual Museums of Małopolska, e declara CC0.
- A página original do modelo, a disponibilidade do arquivo, a topologia, as dimensões e a licença na fonte primária ainda precisam ser confirmadas. Não importar nem atribuir CC0 ao runtime até essa verificação.
- Uso atual: referência de pesquisa para proporção, pose mumiforme, ferramentas e acabamento de shabtis históricos; não substitui os quatro modelos existentes.


## Refinamento de escala do waterfront

- NYC DOT — Williamsburg Bridge: https://www.nyc.gov/html/dot/html/infrastructure/williamsburg-bridge.shtml. Referência oficial para comprimento total, vão principal, clearance de navegação, altura das torres e quatro cabos principais. Os dados orientam proporção; não foram importados modelos ou desenhos técnicos.
- NYC Department of Records and Information Services — arquivo fotográfico: https://www.archives.nyc/blog/tag/Williamsburg%2BBridge. Referência visual histórica para a estrutura de aço, as margens e o tecido industrial; nenhuma foto foi importada.
- Poly Haven Red Brick: https://polyhaven.com/a/red_brick — CC0, Rob Tuytel. Candidato para futuro passe PBR do armazém; não está carregado no runtime.
- Poly Haven Brick Wall 001: https://polyhaven.com/a/brick_wall_001 — CC0. Alternativa avaliada, não carregada.
- Poly Haven Broken Brick Wall: https://polyhaven.com/a/broken_brick_wall — CC0. Referência para danos localizados, não carregada.
- Kits de cidade low-poly e galpão contemporâneo em aço foram avaliados e rejeitados para as peças principais por incompatibilidade de linguagem visual e do edifício descrito no romance.
- O estudo detalhado e as fichas estão em docs/BROOKLYN-HOUSE-EXTERIOR.md. A geometria da ponte, skyline e barco é original; as páginas acima são referências, não assets runtime.


## Sala de Treinamento — revisão asset-first (26/11/2026)

**Geometria de produção própria — `src/training-room.js`.** Nenhum pacote de modelos externos foi importado para este espaço. As referências abaixo orientam silhueta, iconografia e material; não são modelos carregados no runtime.

### Referências de narrativa e iconografia

- Rick Riordan — [The Throne of Fire](https://books.disney.com/book/the-throne-of-fire/) (fonte narrativa primária). A sala usa piso de madeira, teto abobadado com arte egípcia, estátuas de divindades, cestas solares de Rá e a aula Magic Problem-Solving 101 / Whatever Works. A sequência dos shabtis apresenta quatro estatuetas que crescem em guerreiros com espada e escudo, a solução hieroglífica SA-PER e a solução da bola de basquete.
- [Brooklyn House — Riordan Wiki](https://riordan.fandom.com/wiki/Brooklyn_House) (fonte secundária para o resumo espacial e localização do cômodo).
- The Met — [Statuette of Re-Harakhty](https://www.metmuseum.org/art/collection/search/551042), Período Ptolemaico, faiança. A ficha identifica o deus de cabeça de falcão coroado com um disco solar simples; referência para a leitura visual de Rá. A estátua do jogo é uma composição original, não uma cópia do objeto.
- The Met — [Stela fragment depicting Pay adoring Re-Harakhty](https://www.metmuseum.org/art/collection/search/546627). Referência adicional para a figura falconiforme, kilt, disco solar e uraeus.
- Sir John Soane's Museum — [Ushabti figure A47](https://collections.soane.org/object-a47). A ficha documenta faiança com esmalte azul vivo, detalhes em relevo e pequena escala; referência de material/silhueta para as miniaturas shabti. O modelo do jogo é original e mais complexo porque se transforma em guerreiro.
- The Met — [Head of an anthropomorphic falcon god](https://www.metmuseum.org/art/collection/search/549699). Referência para a leitura do falcão antropomórfico, peruca estriada e possível disco solar.

### Texturas PBR locais

- [Poly Haven Walnut Veneer 02](https://polyhaven.com/a/walnut_veneer_02) — CC0-1.0. Os mapas locais de normal e roughness em `assets/textures/wood-walnut/` são usados no piso de madeira; a cor das tábuas e as juntas continuam num mapa procedural criado para a quadra.
- [Poly Haven Beige Wall 001](https://polyhaven.com/a/beige_wall_001) — CC0-1.0. Os mapas locais de cor, normal e roughness em `assets/textures/plaster-smooth-beige/` são usados nas paredes como reboco mineral bege-creme. A alvenaria procedural de calcário é mantida como fallback caso o carregamento do mapa de cor falhe.
- [ambientCG Wood Floor 001](https://ambientcg.com/view?id=WoodFloor001) — CC0-1.0; referência visual avaliada, mas não carregada no runtime.

### Assets e interações da sala

- Piso: tábuas cor de mel, junta e veio procedural, roughness/normal PBR local, acabamento de verniz leve, moldura de nogueira e filetes de bronze.
- Paredes: reboco mineral bege-creme com PBR local, fallback procedural de calcário, rodapés, cornijas, pilastras e frisos; não utilizar cinza liso como acabamento final.
- Arandelas: suporte de bronze, motivo de lótus, taça de óleo, pavio e chama emissiva com luz quente.
- Efígies de Rá: figura humana sentada com cabeça de falcão, bico, olhos, nemes, colar, kilt, trono e estela arqueada. O disco solar externo contém um aro esportivo vazado e rede; a borda superior do aro fica a 3,05 m do piso e a abertura livre foi dimensionada para 45 cm.
- Bola: 24 cm de diâmetro, pega e arremessa por proximidade; o lançamento pode receber assistência para a cesta ou para a cabeça de um shabti ativo.
- Shabtis: pequenas figuras mumiformes em faiança vitrificada, com nemes, hieróglifos, espada curva e escudo. Ao iniciar a aula, crescem dentro de uma coluna de luz e usam braços/pernas articulados na aproximação, preparação e golpe.
- SA-PER: ao interagir com um shabti ativo, Carter pode fazê-lo errar e correr até a parede, reproduzindo a solução hieroglífica descrita na aula do romance.
- Quadro Magic Problem-Solving 101 / Whatever Works: informa os comandos de início, combate, SA-PER e basquete. Avisos contextuais aparecem perto de objetos interativos e adaptam as instruções aos controles de toque.
- Alvos de magia, placar e portas duplas permanecem como interações da reconstrução; o treino de precisão com projéteis mágicos é um complemento de gameplay, não uma mecânica apresentada como canônica.

A documentação separa elementos narrativos confirmados, referências históricas de material/iconografia e interpretações de level design. A revisão no código não equivale a aprovação visual: é obrigatório conferir escala, iluminação, mapas UV, sombras, colisões e FPS em navegador real no desktop e em celular paisagem.

