# Fontes abertas e proveniência

## Regra geral

Todo novo objeto ou espaço deve seguir [ASSET-FIRST-ROOM-BUILDING.md](ASSET-FIRST-ROOM-BUILDING.md). Fontes e licenças são verificadas por asset individual; um repositório que hospeda um ficheiro não substitui a licença original do autor. A proveniência atual e os ficheiros locais ficam em assets/manifest.json.

## Personagem Carter — runtime híbrido

**Ara 3D Gen** — https://github.com/olatunde85/3d-gen — pacote JavaScript MIT; os dados de personagem usam MakeHuman CC0 e os clips de captura de movimento vêm da base CMU, livres para uso comercial conforme a licença/documentação do projeto.
- O corpo, rosto, cabelo, rig e clips principais preservam o Carter aprovado no share salvo do Ara.
- src/character.js carrega idle, walk, run e a sequência de salto, além de consultar ANIMATIONS para selecionar ações cinematográficas disponíveis (look_around, talk_gestures, wave, point e bow). O clipe Ara Point serve como base do gesto HA-DI; a extensão do dedo médio é uma adaptação procedural original do projeto.
- src/character.js sobrescreve o item carregado do share Ara com `carry: 'none'`, removendo a mochila original.
- Em 27/11/2026, `src/character-accessories.js` recebeu uma revisão estrutural: bolsa no Hips, trecho superior da alça no Spine2/Spine1, trecho inferior no Hips e corrente/medalhão no osso torácico. A faixa e a corrente usam raycast no SkinnedMesh deformado para encontrar a superfície da camisa/corpo. As dimensões-alvo da bolsa são 202 × 158 × 76 mm e a largura da alça é 22 mm.
- A revisão acima usa geometria procedural provisória de autoria do projeto. Ela **não é o GLB Innerscene** e ainda não foi visualmente validada em navegador.
- Candidato visual aprovado para a bolsa-base: Innerscene Crossbody Bag, GLB CC0, corpo 230 × 86 × 180 mm. A alça original fica caída no chão e precisa ser substituída. O endpoint de download redirecionou para `files.innerscene.com`, host inacessível às ferramentas desta sessão; o arquivo não foi baixado nem importado.
- O estudo, as fontes oficiais e a distinção entre cânone e interpretação estão em `docs/CARTER-ACCESSORIES-REFERENCE-STUDY.md`. Não chamar a geometria provisória de asset Innerscene nem afirmar que o GLB está integrado.
- A peça preta visível no ombro no screenshot não é criada por `src/character-accessories.js`; sua origem no share Ara ainda precisa ser localizada antes de removê-la. Não apagar peças do personagem-base por aproximação.
- O módulo procedural atual não utiliza GLB de terceiro; nenhuma bolsa nova foi integrada.
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


### HA-DI — correção de desempenho e animação (27/11/2026)

- **Ara 3D Gen — catálogo de animações:** https://github.com/olatunde85/3d-gen/blob/main/docs/animations.md. A categoria Shooter documenta `throw_grenade` com duração de 2,2 s e liberação do objeto em 0,82 s. O HA-DI reutiliza o movimento de corpo inteiro como gesto de lançamento, sem exibir a granada.
- **Ara 3D Gen — API de personagens:** https://github.com/olatunde85/3d-gen/blob/main/docs/library.md. A aplicação solicita somente os clips necessários; `throw_grenade` é adicionado à lista filtrada pelo catálogo exportado `ANIMATIONS`, em vez de carregar os 261 clips.
- **Origem e licença dos movimentos:** o README upstream identifica os dados de movimento como gravações retargetadas da CMU Motion Capture Database e documenta as condições de uso comercial e de não revenda isolada.
- **Three.js 0.165:** VFX de HA-DI reorganizados em pools persistentes, com três `InstancedMesh` para raios/faíscas/fumaça. Não foi incluída dependência adicional.
- **Pré-compilação:** os shaders dos materiais do feitiço são preparados via `WebGLRenderer.compileAsync` antes de liberar o jogo, reduzindo o trabalho no primeiro disparo.


### HA-DI — fighting stance + point (27/11/2026)

- **Ara 3D Gen — Fighting stance:** https://github.com/olatunde85/3d-gen/blob/main/src/core/anim/clips/combat.ts. ID real `fight_idle`, duração 2 s, loop. A definição oficial põe o pé esquerdo à frente, joelhos suaves, tronco com leve rotação e guarda com punhos à altura do queixo.
- **Ara 3D Gen — Point:** https://github.com/olatunde85/3d-gen/blob/main/src/core/anim/clips/emotes.ts. ID `point`, duração 1,4 s. O gesto estende o indicador direito durante 0,5 s e mantém o apontamento até o fim.
- **Composição:** captura local dos ossos do braço esquerdo durante `fight_idle`; transição de ação para `point` mantém a guarda esquerda enquanto a camada de corpo reconstrói a base de combate no rig do Carter. A sequência usa o mesmo game rig Ara; nenhum novo rig ou dependência é carregado.
- **Alternativa externa verificada:** https://github.com/Kinemiq/free-game-animations — 35 clips humanoides CC0 1.0 (GLB/FBX), derivados da Universal Animation Library de Quaternius. Não importada porque o Ara já oferece os movimentos necessários no próprio esqueleto.
- **HA-DI:** o projétil foi removido. O método `trainingRoom.applyHaDi` e a explosão são disparados diretamente no Shabti aos 0,82 s, sincronizados com a extensão do Point.


### Scans arqueológicos integrados à sala de treinamento — 27/11/2026

Os seguintes modelos foram integrados no runtime por GLTFLoader, com URL do mirror fixada ao commit `502f84adbc9a71d1434e7cc5ab61422bfd92c781` do projeto público `storystage/backstage-assets`. Os arquivos desse mirror são cópias preparadas/otimizadas, não os downloads originais sem alteração. O README do mirror registra o autor, a página de origem, a licença e a redução de polígonos. A CASABROOKLIN mantém a atribuição abaixo e não reivindica autoria dos scans.

| Asset no runtime | Objeto / instituição | Licença | Uso |
|---|---|---|---|
| `bronze-horus.glb` | Bronze Statue of the god Horus — The Hunt Museum, Sketchfab por The Hunt Museum; modelo original de 230.817 reduzido a 7.997 triângulos | CC0 | Estátua divina em nicho lateral |
| `horus-falcon.glb` | Horus, c. 2000–1570 BCE — Minneapolis Institute of Art, Sketchfab por artsmia; 64.556 reduzido a 8.000 triângulos | CC0 | Estátua/figura divina em nicho lateral |
| `thoth-baboon.glb` | Limestone Statue of god Thoth as a Baboon — The Hunt Museum, Sketchfab por The Hunt Museum; 178.180 reduzido a 7.863 triângulos | CC0 | Estátua divina em nicho lateral |
| `shabti-of-ramose.glb` | Shabti of Ramose — Fitzwilliam Museum, Sketchfab por Fitzwilliam Museum; 180.000 reduzido a 7.998 triângulos | CC BY 4.0 | Forma de estatueta dos quatro shabtis interativos |

**Páginas de origem e proveniência**
- Bronze Horus: https://sketchfab.com/3d-models/bronze-statue-of-the-god-horus-84542ab14ce84929b44266f1c98fae07 — The Hunt Museum, CC0.
- Horus falcon: https://sketchfab.com/3d-models/horus-c-2000-1570-bce-839a29d2f176467991d6f5f2ccb6a410 — Minneapolis Institute of Art, CC0.
- Thoth baboon: https://sketchfab.com/3d-models/limestone-statue-of-god-thoth-as-a-baboon-ea511ed3b3b343da892b64656d0d5c21 — The Hunt Museum, CC0.
- Shabti of Ramose: https://sketchfab.com/3d-models/shabti-of-ramose-37128a12fc4d4c5e842a872f4085664d — Fitzwilliam Museum, CC BY 4.0.

**Mirror técnico**
- Repositório: https://github.com/storystage/backstage-assets/tree/502f84adbc9a71d1434e7cc5ab61422bfd92c781/models/sketchfab-history/Prop
- Auditoria de créditos/licenças: https://github.com/storystage/backstage-assets/blob/502f84adbc9a71d1434e7cc5ab61422bfd92c781/originals/sketchfab-history/README.md
- Base URL usada pelo GLTFLoader: `https://cdn.jsdelivr.net/gh/storystage/backstage-assets@502f84adbc9a71d1434e7cc5ab61422bfd92c781/models/sketchfab-history/Prop/`
- Os GLBs não foram copiados para o repositório CASABROOKLIN; carregam sob demanda pelo CDN. A cena mantém fallback procedural se uma requisição falhar.

**Referências de fidelidade adicionais**
- The Met, Statue of Horus as a falcon protecting King Nectanebo II (360–343 BCE), metagraywacke, 72 cm, Open Access/Public Domain: https://www.metmuseum.org/art/collection/search/544887. É uma referência museológica de altíssima relevância para escala monumental e para o tratamento escultórico do falcão; não foi importada para o runtime nesta iteração.
- The Met, nota pública de 26/02/2026 sobre mais de 100 modelos 3D em alta resolução e licença CC0 para a maioria: https://www.metmuseum.org/press-releases/3-d-models-announcement-2026.
- Artheon, índice de 358 scans egípcios sob licenças abertas, útil para futuras substituições por estátuas específicas de Ísis, Sekhmet e outras divindades: https://www.artheonmuseum.org/3d/culture/egyptian. Artheon é uma plataforma independente e credita as instituições de origem.

**Limites e notas**
- O scan de Shabti of Ramose é de madeira pintada e não de faiança azul; a referência direta à história descreve os guerreiros como cerâmica vitrificada. O scan fornece forma e detalhes escultóricos à miniatura, mas a superfície visual pode ser ajustada para sugerir o esmalte azulado da ficção sem alterar o scan-base, caso a leitura no jogo exija isso.
- Os scans de Horus/Thoth são peças de museu em pequena escala. O jogo normaliza os modelos para a composição da parede; a escala de exibição é uma decisão artística do cenário e não a escala arqueológica original.


### Scans adicionais para os expositores laterais (27/11/2026)

Estes três GLBs foram adicionados à cena a partir de versões otimizadas do projeto público Atrium Earth, fixadas ao commit `28aefba9209eab48535ee7a193bea310fde10f47`. A distribuição é feita pelo CDN jsDelivr a partir de arquivos publicados no repositório-fonte. Os originais e os metadados de proveniência são mantidos pelo projeto Atrium; as versões carregadas no jogo são derivados otimizados. As licenças declaradas nos registros são CC BY 4.0.

| Arquivo carregado | Objeto / proveniência | Licença e observações |
|---|---|---|
| `jackal-statuette-art-institute-chicago/preview.glb` | Statuette of a Jackal, Art Institute of Chicago, c. 664–525 BCE; cobre/ligas de cobre; accession 1920.252; H 9,5 × W 17,5 × D 5,1 cm. Modelo do Art Institute of Chicago, otimizado pelo Atrium. | CC BY 4.0. O registro permite a leitura como chacal associado a Anúbis ou Wepwawet; o projeto evita escolher uma identidade sem evidência mais específica. |
| `horus-falcon-british-museum/preview.glb` | Horus Falcon, British Museum, EA1226; Abu Qir, Egito; depois de 600 BCE; granodiorito com incrustações de marfim e betume; altura 45,8 cm. Modelo por jwexler, otimizado pelo Atrium. | CC BY 4.0. O registro de digitalização observa que a textura da cabeça tem baixo detalhe, embora o corpo e a base estejam completos. |
| `falcon-headed-sphinx-abu-simbel-british-museum/preview.glb` | Falcon-headed Sphinx from Abu Simbel, British Museum, EA13; 19ª Dinastia; arenito; modelo por artfletch, otimizado pelo Atrium. | CC BY 4.0. A dimensão física ainda não foi confirmada; a revisão da fonte relata a representação completa do objeto preservado em todas as faces. |

**Páginas de origem**
- Jackal statuette — Art Institute of Chicago: https://www.artic.edu/artworks/78159/statuette-of-a-jackal. Modelo: https://sketchfab.com/3d-models/9aba58c860c7453c8bcea37dd614c288.
- Horus Falcon — British Museum EA1226: https://www.britishmuseum.org/collection/object/Y_EA1226. Modelo: https://sketchfab.com/3d-models/034dc69ab0a7412f97368607f378c037.
- Falcon-headed Sphinx — British Museum EA13: https://www.britishmuseum.org/collection/object/Y_EA13. Modelo: https://sketchfab.com/3d-models/0047be934a22442fa9ed9cc0a119acd2.

**Mirror e arquivos de runtime**
- Repositório de origem, commit fixado: https://github.com/never-nude/atrium.earth/tree/28aefba9209eab48535ee7a193bea310fde10f47/public/models/previews/egyptian
- Base URL no runtime: `https://cdn.jsdelivr.net/gh/never-nude/atrium.earth@28aefba9209eab48535ee7a193bea310fde10f47/public/models/previews/egyptian/`
- Os modelos permanecem hospedados no repositório-fonte e são carregados via CDN; não foram copiados para `assets/models/` nesta atualização.

### Referência GLSL para silhuetas sem contorno quadrado — HA-DI (27/11/2026)

- **ThreeJS VFX — https://github.com/majidmanzarpour/threejs-vfx — MIT.** O sistema de partículas do projeto usa silhuetas proceduralmente recortadas em GLSL (soft, smoke, streak, chip, ring), em vez de depender exclusivamente do alpha de sprites. Referência técnica para a máscara orgânica implementada em src/magic-system.js; nenhum código foi copiado e nenhuma dependência foi adicionada.
- No CASABROOKLIN, máscaras originais com ruído FBM são injetadas em map_fragment via Material.onBeforeCompile: núcleo/fumaça orgânicos, faíscas e corte afilados e sigilo anelar. As texturas Kenney CC0 continuam como detalhes internos e são protegidas pela máscara adicional.

### Sala de Treinamento — pesquisa específica da efígie de Rá (27/11/2026)

**Candidato 3D avaliado e rejeitado**
- Polygonal Mind / ToxSam — [God Ra Art, coleção Tomb Chaser 1](https://models.codelove.in/models/tomb-chaser-1-god-ra-art/); [arquivo no repositório CC0](https://github.com/ToxSam/cc0-models-Polygonal-Mind/tree/main/projects/tomb-chaser-1).
- A ficha da fonte declara GLB/glTF 2.0, CC0 1.0, 34 KB, 1.650 triângulos, 1.365 vértices, 2 materiais, 3 texturas, altura de 2,68 m e malha estática sem rig.
- Preview inspecionado: personagem low-poly com olhos verdes e disco laranja. Embora leve e compatível com GLTFLoader/Three.js, a linguagem visual não corresponde à escultura monumental de diorito e o modelo não contém a abertura-cesta integrada à coroa solar.
- **Status: rejeitado, não baixado e não integrado.** A geometria procedural em src/training-room.js foi preservada e remodelada para atender à descrição narrativa.

**Referências históricas para a forma**
- The Met — [Head of an anthropomorphic falcon god](https://www.metmuseum.org/art/collection/search/549699): cabeça em diorito, peruca estriada e encaixe superior que pode ter sustentado um disco solar; a instituição relaciona a peça a Re/Re-Harakhty. Referência visual para a cabeça e o encaixe, não um asset importado.
- RISD Museum — [Temple god / Seated Horus](https://risdmuseum.org/art-design/collection/temple-god-38207): bronze escurecido, figura sentada e trono de bloco. Referência de pose e relação cabeça/corpo/trono; a peça representa Horus, não Rá.
- Nenhuma malha, textura ou fotografia dos museus foi copiada para o runtime.


## Carter — quarterstaff Polyfork (27/11/2026)
- **Asset:** [Monk's Quarterstaff](https://polyfork.dev/asset/monk-s-quarterstaff-cbdadd), de Lucas Martinic / Polyfork.
- **Arquivo carregado:** https://polyfork.dev/cdn/monk-s-quarterstaff-cbdadd.glb
- **Formato e compatibilidade:** GLB/glTF 2.0; a página do autor fornece exemplo direto com `GLTFLoader` para Three.js; o asset é web-ready, sem texturas externas.
- **Dimensões e malha:** 0,08 × 1,8 × 0,08 m; origem no chão; eixo longitudinal vertical; 496 triângulos; 1 material; arquivo de 57 KB.
- **Visual:** haste de madeira, ponteiras de ferro e duas faixas de tecido para empunhadura. O runtime preserva o modelo e os materiais originais; sem retintura ou alteração de silhueta.
- **Licença:** Polyfork declara uso comercial/hotlink permitido sem atribuição para uso direto. A licença CC BY 4.0 aplica-se à redistribuição do mesh; neste momento o jogo usa o GLB diretamente da CDN do autor, sem redistribuir o ficheiro. Página/condições: https://polyfork.dev/asset/monk-s-quarterstaff-cbdadd
- **Adaptação de socket:** o Ara Rigging define `WeaponR` no centro da mão fechada, com eixo `+Y` saindo pelo topo do punho. A malha vertical e com origem no chão é deslocada em Y −0,9 m para que o centro do cajado coincida com esse socket. Referência técnica: https://ara3dgen.com/docs/rigging/
- **Fallback local:** em falha de CDN/CORS, o item mantém uma haste procedural de madeira com ponteiras de ferro e duas faixas de tecido. O fallback não é considerado substituto visual aprovado do GLB.
- **Estado:** runtime importado em `src/inventory.js`; jogo e `character-preview.html` usam o mesmo módulo. Inspeção visual da empunhadura no navegador ainda pendente.

## Grande Salão — Thoth, bancos curvos, escadaria e interações (27/11/2026)

### Texto-fonte e iconografia

- **Canônico textual:** *The Red Pyramid*, Rick Riordan, capítulo da primeira visita dos Kane à mansão. Thoth é a estátua central do Grande Salão: corpo humano, cabeça/pescoço longos de íbis, bico comprido, mármore negro, kilt, faixa, colar, estilete e pergaminho aberto com Per Ankh; escala aproximada de 30 pés (9,1 m).
- **Canônico visual/editorial:** *The Red Pyramid: The Graphic Novel*, Disney Books, arte de Orpheus Collar. A prancha “First Floor — The Great Room” foi usada para composição espacial e relação entre a estátua, galerias e mobiliário. Nenhum painel foi importado, recortado ou copiado para o runtime.
- **Referência histórica:** The Metropolitan Museum of Art, “Striding Thoth” (faiança, período ptolomaico, 332–30 BCE), Public Domain. Usado para a silhueta de corpo humano/cabeça de íbis e proporções iconográficas; não prova escala monumental, mármore negro ou os atributos exatos da estátua descrita no romance. https://www.metmuseum.org/art/collection/search/544092
- **Referência histórica CC0:** Minneapolis Institute of Art / Sketchfab, “Thoth c. 644 BCE–30 CE”, modelo de bronze com cabeça de íbis. Usado como comparação histórica; não importado. https://sketchfab.com/3d-models/thoth-c-644-bce-30-ce-394a94722862460e8cefab54b4bed7bf

### Asset de assentos curvos — aprovado e adaptado

- **Fonte:** Innerscene, “Curved Modular Seating, 3 Modules”. https://www.innerscene.com/tools/library/3d-parts/curved-modular-seating-3-modules-1f4a9531
- **Autor:** Innerscene (modelo original).
- **Licença declarada:** CC0-1.0.
- **Formato publicado:** GLB, 127 KB.
- **Dimensões publicadas:** aproximadamente 4,446 × 1,330 × 0,440 m.
- **Uso nesta versão:** referência aprovada de escala e linguagem modular curva. O arquivo GLB binário não pôde ser recuperado/inspecionado nesta sessão; não foi salvo em `assets/` nem carregado no runtime. A estrutura atual é geometria Three.js original, feita sob medida para a planta, os vãos de circulação e o pedestal existente. Portanto, não creditar o mesh original à Innerscene nem afirmar que o GLB foi importado.
- **Adaptação implementada:** dois bancos em arcos/crescentes laterais contínuos, estrutura em calcário, almofada de couro, encosto curvo estofado, apoios de braço e acabamentos de bronze. A face frontal e a face posterior permanecem abertas. Altura superior do assento: cerca de 0,485 m acima do piso principal.

### Escadaria monumental — Museum Grand Stair como referência aprovada

- **Fonte:** Tevy, “Museum Grand Stair”. https://tevy.dev/models/museum-grand-stair
- **Autor:** Tevy.
- **Licença declarada:** CC0-1.0.
- **Formato publicado:** GLB, com três LODs; LOD0 416 KB e cerca de 12.064 triângulos.
- **Dimensões publicadas:** aproximadamente 6,16 × 4,81 × 6,63 m; descrição do modelo indica 18 degraus e elevação de cerca de 3 m.
- **Uso nesta versão:** referência aprovada para linguagem construtiva, laterais de sustentação, degraus, corrimãos, balaústres e newels. O binário GLB não pôde ser recuperado e inspecionado nesta sessão; não foi guardado em `assets/` ou importado. O runtime usa geometria Three.js original adaptada às larguras, alturas e coordenadas dos três níveis existentes. A escadaria externa e os dados de rampas/patamares compartilhados não foram substituídos.
- **Adaptação implementada:** espelhos verticais, focinhos de degrau com bronze, paredes laterais contínuas de calcário, coroamento inclinado, corrimãos contínuos, balaústres torneados, newels e patamares. A geometria preserva o conjunto de rampas e superfícies caminháveis do controlador.

### Animação e interação de Carter

- **Runtime escolhido:** Ara 3D Gen, versão 0.18.1 já usada no projeto; o personagem Carter Ara aprovado foi preservado.
- **Clips requisitados:** `sit_down` e `sit_idle`, consultados na lista `ANIMATIONS` do Ara e incluídos apenas se presentes no catálogo carregado. O manual do Ara define Stand up como `sit_down` reproduzido em sentido inverso.
- **Ação de inspeção:** `look_around` para a estátua de Thoth, sem substituir o rig nem a malha de Carter.
- **Comportamento:** E/INTERAGIR posiciona Carter num ponto de assento, trava o movimento durante `sit_down` e mantém `sit_idle` em loop. A segunda interação reproduz `sit_down` em reverso, posiciona Carter na âncora externa e libera a locomoção. Se `sit_down` ou `sit_idle` não estiverem disponíveis, Carter volta à posição anterior e o jogo informa a indisponibilidade.
- **Alternativa pesquisada:** Quaternius Universal Animation Library, CC0-1.0, inclui animações humanoides de sentar/repousar/levantar. Não foi importada porque o Ara do projeto já oferece clips nativos retargetados para o rig ativo; evita-se introduzir uma dependência externa redundante de animações.
- **Licença dos clips Ara:** os dados de animação permanecem sujeitos aos termos upstream de Ara/CMU listados no bloco `ara3d-js` do manifest. Não redistribuímos clips.

### Estado desta integração

- **Implementado em código:** anatomia refinada de Thoth, dois bancos curvos contínuos, escadaria apoiada e detalhada, interação de assento/saída e inspeção da estátua.
- **Referência aprovada, mas GLB não importado:** Innerscene Curved Modular Seating e Tevy Museum Grand Stair. As geometrias de runtime são originais e não cópias binárias dos modelos.
- **QA pendente:** testar os clips no carregamento Ara real; conferir assento/altura/raiz, pose, alinhamento de pés e saída; subir e descer cada lance; verificar colisões, materiais, desempenho e paridade visual no navegador desktop e em celular paisagem.
