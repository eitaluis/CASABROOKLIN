# Fontes abertas e proveniência

## Regra geral

Todo novo objeto ou espaço deve seguir [ASSET-FIRST-ROOM-BUILDING.md](ASSET-FIRST-ROOM-BUILDING.md). Fontes e licenças são verificadas por asset individual; um repositório que hospeda um ficheiro não substitui a licença original do autor. A proveniência atual e os ficheiros locais ficam em assets/manifest.json.

## Personagem Carter — runtime híbrido

**Ara 3D Gen** — https://github.com/olatunde85/3d-gen — pacote JavaScript MIT; os dados de personagem usam MakeHuman CC0 e os clips de captura de movimento vêm da base CMU, livres para uso comercial conforme a licença/documentação do projeto.
- O corpo, rosto, cabelo, rig e clips principais preservam o Carter aprovado no share salvo do Ara.
- src/character.js carrega idle, walk, run e a sequência de salto, além de consultar ANIMATIONS para selecionar ações cinematográficas disponíveis (look_around, talk_gestures, wave, point e bow). O clipe Ara Point serve como base do gesto HA-DI; a extensão do dedo médio é uma adaptação procedural original do projeto.
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

### Referências históricas de escultura (somente pesquisa visual)

- The Metropolitan Museum of Art — [Statuette of Re-Harakhty](https://www.metmuseum.org/art/collection/search/551042): referência iconográfica para a figura de cabeça de falcão e disco solar.
- The Metropolitan Museum of Art — [Head of an anthropomorphic falcon god](https://www.metmuseum.org/art/collection/search/549699): referência para crânio, bico e nemes estriado.
- The Metropolitan Museum of Art — [Stela with man offering to Re-Harakhty](https://www.metmuseum.org/art/collection/search/553249): referência para a representação sentada em trono de bloco, cabeça de falcão, disco solar com uraeus e peruca tripartida.
- Sir John Soane's Museum — [Ushabti figure A47](https://collections.soane.org/object-a47): referência de pequena escala e faiança azul vitrificada.
- National Gallery of Victoria — [Ushabti figure, 44-D1](https://www.ngv.vic.gov.au/explore/collection/work/1388/): referência especialmente próxima para plinto, pilar dorsal, peruca estriada, barba postiça trançada, braços cruzados e coluna hieroglífica.
- Smarthistory — [Meet an Ushabti](https://smarthistory.org/ushabti-ancient-egyptian-afterlife/): referência para silhueta mumiiforme, braços cruzados e faiança azul-esverdeada.
- Australian Museum — [Shabti](https://australian.museum/learn/cultures/museum-archives/egyptian-collection/shabti/): consulta complementar sobre atributos e iconografia de ushabtis.
- Art Institute of Chicago — [About Shabtis and Ushabtis](https://www.artic.edu/articles/1012/about-shabtis-and-ushabtis): referência para variação de forma e atributos dos shabtis.

Essas páginas foram usadas como referência de pesquisa. Nenhuma digitalização, fotografia ou malha 3D desses acervos foi importada para o runtime. A geometria de Rá, dos shabtis e dos relevos é original do projeto; não há licença de terceiros atribuída a esses modelos. A pose mumiiforme, o plinto, o pilar dorsal, a peruca e a barba pertencem à referência histórica dos ushabtis; espada e escudo surgem apenas na transformação ficcional do guerreiro de treinamento descrito em The Throne of Fire.

### Texturas PBR locais

- [Poly Haven Walnut Veneer 02](https://polyhaven.com/a/walnut_veneer_02) — CC0-1.0. Os mapas locais de normal e roughness em `assets/textures/wood-walnut/` são usados no piso de madeira; a cor das tábuas e as juntas continuam num mapa procedural criado para a quadra.
- [Poly Haven Beige Wall 001](https://polyhaven.com/a/beige_wall_001) — CC0-1.0. Os mapas locais de cor, normal e roughness em `assets/textures/plaster-smooth-beige/` são usados nas paredes como reboco mineral bege-creme. A alvenaria procedural de calcário é mantida como fallback caso o carregamento do mapa de cor falhe.
- [ambientCG Wood Floor 001](https://ambientcg.com/view?id=WoodFloor001) — CC0-1.0; referência visual avaliada, mas não carregada no runtime.

### Assets e interações da sala

- Piso: tábuas cor de mel, junta e veio procedural, roughness/normal PBR local, acabamento de verniz leve, moldura de nogueira e filetes de bronze.
- Paredes: reboco mineral bege-creme com PBR local, paredes de fundo em calcário quente, fallback procedural de calcário, rodapés, cornijas e pilastras. As fachadas que atravessavam o cômodo são ocultadas; a parede leste com portal é reconstruída uma única vez. Os acabamentos foram afastados dos planos de alvenaria para reduzir z-fighting.
- Arandelas: suporte de bronze, motivo de lótus, taça de óleo, pavio e chama emissiva com luz quente.
- Efígies de Rá: figuras sentadas reconstruídas em perfis escultóricos contínuos, com diorito escuro, pernas, kilt, braços, colar, cabeça de falcão, bico, olhos, nemes, uraeus e disco solar vertical. O aro interno tem 45 cm de abertura e borda superior a 3,05 m. A pontuação verifica a passagem da bola pelo plano vertical.
- Bola: 24 cm de diâmetro, pega e arremessa por proximidade; o lançamento pode receber assistência para a cesta ou para a cabeça de um shabti ativo.
- Shabtis: estatuetas mumiiformes de faiança azul-esverdeada, com rosto, barba postiça, nemes estriado, uraeus, braços cruzados, pilar dorsal e inscrição. Ao despertar, abrem os braços e revelam as pernas, a espada curva e o escudo; a IA fica limitada à área útil central para não atravessar os relevos nem os muros.
- SA-PER: ao interagir com um shabti ativo, Carter pode fazê-lo errar e correr até a parede, reproduzindo a solução hieroglífica descrita na aula do romance.
- Quadro Magic Problem-Solving 101 / Whatever Works: informa os comandos de início, combate, SA-PER e basquete. Avisos contextuais aparecem perto de objetos interativos e adaptam as instruções aos controles de toque.
- Relevos laterais: placas arqueadas de alto-relevo, com cabeça e atributos iconográficos específicos; foram afastadas da espessura dos muros para evitar que apareçam embutidas na alvenaria.
- Alvos de magia, placar e portas duplas permanecem como interações da reconstrução; o treino de precisão com projéteis mágicos é um complemento de gameplay, não uma mecânica apresentada como canônica.
- A revisão removeu caixas arquitetônicas duplicadas e ajustou a área de navegação dos shabtis. A validação visual final ainda depende de navegador real.

A documentação separa elementos narrativos confirmados, referências históricas de material/iconografia e interpretações de level design. A revisão no código não equivale a aprovação visual: é obrigatório conferir escala, iluminação, mapas UV, sombras, colisões e FPS em navegador real no desktop e em celular paisagem.



## Magia HA-DI — pesquisa e proveniência (26/11/2026)

### Fonte canônica
- Rick Riordan, The Red Pyramid, p. 87 na edição consultada: https://www.jkmedina.com/uploads/1/3/2/3/13236122/rick_riordan_-_kane_chronicles_1_-_the_red_pyramid.pdf — Sadie aponta com dois dedos e o polegar; os hieróglifos dourados aparecem sobre o cadeado e a porta explode. A execução por Carter no jogo é uma adaptação de gameplay.
- Frances Foster, “Shabti Robots and Hieroglyphic Spells: Rick Riordan’s Egyptians”: https://api.repository.cam.ac.uk/server/api/core/bitstreams/b07e467d-c970-425f-a484-64a37605f589/content — identifica a grafia ḥḏ como 𓉔𓆓 e discute a ligação entre palavra, inscrição e ação.
- Gardiner sign list: https://www.egyptianhieroglyphs.net/gardiners-sign-list/ — referência de sinais para validação epigráfica.

### Referências técnicas avaliadas
- **ThreeJS VFX** — https://github.com/majidmanzarpour/threejs-vfx — MIT. Estudo de técnicas de partículas, shaders e efeitos procedurais de magia. Nenhum código, textura ou asset foi copiado para o runtime.
- **Ara 3D Gen** — https://github.com/olatunde85/3d-gen — MIT para o código do pacote; dados e clips seguem as licenças próprias documentadas pelo projeto. O runtime já utilizado pela CASABROOKLIN fornece o clipe Point como base corporal; a adaptação de dois dedos é código original em src/character.js.
- **Noto Sans Egyptian Hieroglyphs** — https://github.com/notofonts/egyptian-hieroglyphs — SIL OFL 1.1. A família é carregada via Google Fonts CSS para renderizar 𓉔𓆓 no Canvas; a fonte não foi copiada para o repositório.
- **Three.js** — https://github.com/mrdoob/three.js — MIT, versão 0.165.0 já fixada no projeto. Na primeira iteração, hieróglifo, pulso dourado, anéis, impacto e fragmentos eram inteiramente procedurais. A segunda iteração adicionou somente sprites CC0 do Kenney; os sistemas de movimento, materiais e composição continuam em código original, sem biblioteca de partículas adicional.

### Limites da primeira implementação
- HA-DI atinge somente Shabtis despertos na Sala de Treinamento, conforme a decisão de gameplay do usuário.
- A inscrição é a sequência Unicode 𓉔𓆓. Noto Sans Egyptian Hieroglyphs é solicitado como primeira fonte no Canvas, mas ainda não foi empacotado localmente; verificar cobertura em cada navegador antes de considerar o glifo aprovado.
- A fragmentação usa as malhas do Shabti existente e lascas geométricas originais. Não foi importado modelo histórico de ushabti nem asset de fragmentação de terceiros.


### Segunda iteração visual do HA-DI (26/11/2026)

- **Kenney Particle Pack** — https://kenney.nl/assets/particle-pack — CC0 1.0. Sprites originais magic_01, smoke_03, circle_03, spark_07 e slash_02 foram armazenados em `assets/vfx/` (PNG codificado em Base64) e decodificados no navegador. Uso: halo/energia, fumaça, círculo mágico, faíscas e corte luminoso. O arquivo `assets/vfx/README.md` documenta os nomes locais e a conversão.
- **Kenney Smoke Particles** — https://kenney.nl/assets/smoke-particles — CC0 1.0. Referência visual complementar para a camada de fumaça/poeira da explosão; o sprite runtime de fumaça é o `smoke_03` do Particle Pack.
- **three.quarks** — https://github.com/Alchemist0823/three.quarks — MIT. Estudo de lifetime e emissão de partículas, trilhas e fumaça. Não incluído como dependência runtime; os efeitos atuais usam sprites Three.js leves e código original.
- **ThreeJS VFX** — https://github.com/majidmanzarpour/threejs-vfx — MIT. Estudo de efeitos procedurais em camadas, shaders e expansões de impacto. Nenhum código do repositório foi copiado.
- **three-procedural-locomotion** — https://github.com/PabloMesquida/three-procedural-locomotion — MIT. Referência para pose procedural, flexão de pernas, quadril e tronco; não importado para runtime.
- **Ara 3D Gen** — https://github.com/olatunde85/3d-gen — referência ao esqueleto e ao clipe Point já utilizados no personagem. A pose de ataque é composta por offsets locais originais sobre o clip.

As fontes externas são registradas separadamente do código de integração. Só os cinco sprites Kenney CC0 são assets de terceiros carregados no runtime; os materiais, geometrias complementares, animação do efeito, parâmetros de fade e composição corporal são código original CASABROOKLIN.


### Referências museológicas — sala de treinamento (26/11/2026)

- **Ra-Horakhty AA-016 — ArchaeoArchive / Omar Atabany:** https://archaeoarchive.com/view/ra-horakhty — scan fotogramétrico de objeto em granodiorito fotografado no National Museum of Egyptian Civilization, 56 fotos-fonte, 46.826 faces, textura 4K; downloads GLB, STL, PLY, 3MF e OBJ. Licença declarada CC BY 4.0. A identificação histórica e proveniência seguem o registro da etiqueta de galeria; número de inventário do museu e escala real ainda não confirmados no próprio registro. **Candidato real para a efígie de Rá; não importado ainda.**
- **Wikimedia Commons — STL do Ra-Horakhty de Tanis:** https://commons.wikimedia.org/wiki/File:Statue_of_Ra-Horakhty,_3D_photogrammetry_scan_(STL).stl — versão sem textura, CC BY-SA 4.0; usar apenas se a obrigação ShareAlike for compatível com a distribuição do projeto. Preferir o GLB AA-016 sob CC BY 4.0.
- **The Metropolitan Museum of Art — Statuette of Re-Harakhty:** https://www.metmuseum.org/art/collection/search/551042 — faiança ptolemaica, 332–30 BCE; deus com cabeça de falcão, disco solar simples e postura sentada. Referência iconográfica/visual, não scan 3D aberto.
- **The Metropolitan Museum of Art — Head of an anthropomorphic falcon god:** https://www.metmuseum.org/art/collection/search/549699 — diorito, New Kingdom–Late Period; cabeça, peruca estriada e encaixe superior para ornamento solar perdido. Referência específica para cabeça e escala do disco.
- **Global Egyptian Museum — SR 341:** https://www.globalegyptianmuseum.org/record.aspx?id=14804 — Re-Horakhty sentado em trono baixo, peruca tripartida, peitoral, shendyt, mão com ankh; granodiorito/granito cinza polido. Referência para pose sentada.
- **Kelsey Museum / University of Michigan — Ushabti Figurine 0000.00.4645:** https://diskoproject.kelsey.lsa.umich.edu/object/ushabti/ — faiança azul-esverdeada, 13,5 cm, com barba, toucado e inscrição; página fornece STL para download.
- **Liverpool World Museum / Virtual Cuneiform — 3D Interactive Shabti:** https://virtualcuneiform.org/shabtiModels.html — modelo em point cloud/mesh e downloads PLY/STL em duas resoluções.
- **Factum Foundation — Recording fragments from the Tomb of Seti I:** https://factumfoundation.org/our-projects/digitisation/the-theban-necropolis-preservation-initiative/the-tomb-of-seti-i/recording-fragments-from-the-tomb-of-seti/ — documentação fotogramétrica de dois ushabtis do túmulo de Seti I, mostrando a diferença entre faiança azul original e superfície 3D.
- Nenhum dos modelos de Rá ou shabti acima foi adicionado ao runtime nesta iteração; os links foram registrados para escolha e verificação de escala/pose antes da integração.


### Iteração escultórica da sala de treinamento — 27/11/2026

**Shabtis para os nichos**

- **Virtual Museums of Małopolska / Artheon — Ushabti figures, MAK/AS/2206 e MAK/AS/2207:** https://www.artheonmuseum.org/artwork/ushabti-figures-cf0631 — scan 3D creditado ao projeto Virtual Museums of Małopolska, CC0 (domínio público), disponibilizado via Sketchfab. Referência para forma mumiforme, posição dos braços, toucado e proporções de estatuetas funerárias.
- **The Watt Institution — Shabti figure, cat. 1987.317:** https://sketchfab.com/3d-models/shabti-figure-8161d0bfc36348ecaa5a59fcb38e8644 — scan 3D de composição vítrea azul-esverdeada, inscrição frontal e bolsa de sementes no verso; licença CC BY. Referência secundária para pátina e detalhe de superfície.
- **Virtual Cuneiform / World Museum Liverpool — Shabti:** https://virtualcuneiform.org/shabtiModels.html — modelo fototexturizado de um shabti histórico, com point cloud/mesh e versões PLY/STL; referência para a leitura da superfície escaneada.
- **Smarthistory — Ushabti:** https://smarthistory.org/ushabti/ — referência de iconografia funerária, braços cruzados, ferramentas agrícolas e inscrição.

**Rá / Re-Horakhty**

- **The Metropolitan Museum of Art — Statuette of Re-Harakhty:** https://www.metmuseum.org/art/collection/search/551042 — figura sentada com cabeça de falcão e disco solar; referência para a relação espacial entre cabeça e disco.
- **The Metropolitan Museum of Art — Head of an anthropomorphic falcon god:** https://www.metmuseum.org/art/collection/search/549699 — cabeça em diorito com peruca estriada; referência para volume de crânio, olhos e encaixe do ornamento solar.
- **ArchaeoArchive — Ra-Horakhty AA-016:** https://archaeoarchive.com/view/ra-horakhty — scan fotogramétrico com versões texturizadas e sem textura. O registro indica disponibilização CC BY 4.0 após publicação; a versão STL no Wikimedia Commons tem licença CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Statue_of_Ra-Horakhty,_3D_photogrammetry_scan_(STL).stl.

**Implementação:** nesta iteração, os scans acima foram usados como referência, não distribuídos dentro do repositório. A cabeça de Rá, disco solar, aro funcional, nichos e modelos decorativos de shabti são geometrias originais implementadas no Three.js. Isso evita atribuir procedência arqueológica falsa a uma reconstrução procedural.

## Ala residencial — mobiliário e props adicionais

### 3DAssets.dev — CC0 1.0

- **Minibar cabinet (Hotel and Resort Operations):** https://3dassets.dev/assets/hotel-and-resort-operations-minibar-cabinet-601f19a1 — GLB CC0, 0,64 × 0,89 × 0,591 m, 960 triângulos, clips open e close, carregado pelo CDN com GLTFLoader.
- **Guest room armchair (Hotel and Resort Operations):** https://3dassets.dev/assets/hotel-and-resort-operations-guest-armchair-bb3c4e37 — GLB CC0, 0,745 × 0,83 × 0,72 m, 2.320 triângulos, carregado pelo CDN com GLTFLoader.
- O provedor declara estes GLBs self-contained, CORS habilitado, texturas WebP embutidas e nenhuma necessidade de Draco, Meshopt ou KTX2: https://3dassets.dev/docs.
- Os modelos são AI-assisted de acordo com as fichas públicas. Foram usados como props secundários depois de conferir licença, dimensão e compatibilidade; não substituem a geometria autoral dos objetos hero.

### Candidatos avaliados, não carregados

- Innerscene TATAMI — Low Platform Bed: https://www.innerscene.com/tools/library/3d-parts/tatami-low-platform-bed-3e8a3cb6 — modelo original CC0, 1,95 × 2,28 × 0,57 m, cerca de 22k triângulos, materiais PBR embutidos. Candidato de cama; o GLB ainda requer teste de carregamento/CORS e comparação visual antes da substituição.
- 3DAssets.dev King bed with upholstered headboard: https://3dassets.dev/assets/hotel-and-resort-operations-bed-king-upholstered-819ff50d — CC0, 6.194 triângulos, mas com cabeceira estofada comum. Avaliado e rejeitado para a cama principal por não substituir o apoio de cabeça egípcio descrito no romance.
- 3DAssets.dev Guest Room with En-Suite: https://3dassets.dev/assets/hotel-and-resort-operations-guest-room-w-0766f7ed — CC0, ~36k triângulos, AI-generated. Usado apenas para leitura de composição/escala, não importado como quarto completo.
