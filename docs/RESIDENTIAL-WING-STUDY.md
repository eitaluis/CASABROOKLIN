# CASABROOKLIN — estudo asset-first da ala residencial

Status: pesquisa de fontes concluída para a primeira implementação; inspeção visual em navegador desktop/mobile ainda pendente.

## 1. Leitura do cânone

### Quarto de Carter — A Pirâmide Vermelha

O quarto fica no terceiro andar da Brooklyn House. Carter recebe um quarto próprio, adjacente ao de Sadie, com:

- cama king-size;
- um **apoio de cabeça egípcio de marfim** (*ivory headrest*) decorado com leões e hieróglifos — não uma cabeceira estofada comum;
- banheiro privativo;
- kitchenette com bebidas e doces (ginger ale, Twix e Skittles);
- televisão, computador e aparelho de som de padrão moderno/alto desempenho;
- portas de vidro deslizantes para um deck/varanda com vista para o porto de Nova York, Manhattan e a Estátua da Liberdade. No primeiro livro, Carter percebe que as portas estão bloqueadas por uma força invisível.

A descrição literária estabelece o programa do quarto, mas não uma planta cotada, a disposição exata dos móveis, os materiais de cada parede, a forma do banheiro ou as dimensões do deck. Esses elementos são interpretação espacial e devem ser tratados como tal.

### Varanda e bacia de vidência — O Trono de Fogo

Em livro posterior, a varanda de Carter tem uma bacia de vidência feita por Walt: um recipiente baixo de bronze, descrito como um pires/saucer sobre um pedestal de pedra, utilizado com óleo para scrying. A bacia pertence à varanda, não ao banheiro nem à mesa de cabeceira.

### Circulação

O Grande Salão tem três níveis de galerias com fileiras de portas voltadas para o salão. O romance indica que a ala residencial fica no terceiro andar e que os quartos de Carter e Sadie são contíguos. Não fixa o desenho exato do corredor nem a posição de cada porta. Portanto:

- **Canônico:** acesso residencial no terceiro andar; quartos contíguos; Carter e Sadie em quartos adjacentes.
- **Interpretação:** a saída da galeria superior abre para um vestíbulo e um corredor curto que distribui os acessos aos dois quartos; uma porta interna permite a comunicação entre eles.
- **Interpretação:** posição, largura, revestimento, iluminação, marcenaria, posição do banheiro e kitchenette e dimensão/guarda-corpo do deck.

## 2. Referências visuais

### Apoio de cabeça de marfim

**Referência principal:** Grand Egyptian Museum, peça *Lions Headrest*, acervo GEM 270, Novo Império, XVIII dinastia. O objeto histórico tem base alongada, duas figuras de leão agachadas nas extremidades e a figura de Shu sustentando o apoio curvo. É a correspondência visual mais próxima da descrição literária.

- Página oficial: https://gem.eg/en/collection/artefacts/lions-headrest
- A imagem do museu é referência visual, não uma textura a ser copiada para o jogo.
- Não foi localizado um GLB gratuito com a composição exata (dois leões + Shu + apoio curvo). A peça será modelada especificamente para o jogo, com marfim envelhecido, pigmento discreto e hieróglifos apenas onde a referência permite.

### Quarto contemporâneo junto à água

A linguagem proposta é contemporânea, confortável e funcional, com madeira quente, tecidos claros, pedra bege e bronze escovado. Não transformar o quarto numa tumba egípcia: a identidade egípcia deve aparecer no apoio de cabeça, em pequenos objetos e em detalhes de marcenaria, enquanto os equipamentos e o conforto são modernos.

Referências de lookdev:
- Quarto contemporâneo com portas de vidro para a água: https://www.palmjebelali.ae/coral-villas/coral-collection/coral-living
- Quarto com madeira quente, cama baixa e vista para a água: https://www.redfin.com/CA/Tiburon/138-Rock-Hill-Dr-94920/home/90325451
- Banheiro de pedra bege, vidro sem moldura e metais escuros/bronze: https://installateur-spitzer.de/sanitaer/
- Banheiro em travertino e marcenaria de madeira: https://mosaicbros.com/blogs/news/large-format-travertine-tile-bathroom-ideas-for-luxury-homes-2026-design-guide

Estas imagens são referências de proporção, composição, iluminação e acabamento; não são assets 3D para redistribuir.

### Bacia de vidência

A forma da bacia deve ser baixa, larga e de bronze, apoiada num pedestal de pedra, em vez de uma taça alta de fantasia. Referências históricas de recipientes egípcios em bronze:
- Grand Egyptian Museum — Fluted Basin of Mesehti: https://gem.eg/en/collection/artefacts/fluted-basin-of-mesehti
- The Metropolitan Museum of Art — coleção de bacias/recipientes de bronze do Egito: https://www.metmuseum.org/art/collection

A peça do jogo será geometria original, dimensionada como objeto de uso em varanda, com superfície de óleo escura e animação de ondulação discreta. As bacias históricas são referência de material e perfil, não a alegação de que sejam o mesmo objeto narrativo.

## 3. Assets 3D selecionados e copiados para o projeto

### Fonte principal — mobiliário original MIT

Repositório de origem: https://github.com/jamesEmerson112/NVIDIA-Crusoe-The-Recursive-Agents-Hackathon

- Licença: MIT. O texto integral foi preservado em assets/models/residential/LICENSE-MIT.txt.
- Proveniência: o repositório declara que os GLBs de mobiliário são geometrias originais e materiais produzidos no Blender pelo script frontend/scripts/generate-furniture.py; não são modelos baixados de terceiros.
- Unidades e eixos: metros, Y-up, pivô no centro da base; frente dos móveis orientada para +Z.
- Materiais: texturas PBR embutidas em GLB para os modelos texturizados; os modelos lisos (porcelana/metal/vidro) usam fatores PBR.
- Compatibilidade: GLB glTF 2.0 estático, sem Draco, Meshopt ou KTX2; pode ser carregado por GLTFLoader sem decoders adicionais.
- Os ficheiros selecionados foram copiados para assets/models/residential/ para que o jogo não dependa de um CDN de terceiros em tempo de execução.

| Objeto | Ficheiro local | Dimensões nativas (m) | Triângulos | Uso no quarto |
|---|---|---:|---:|---|
| Cama | bed.glb | 1,60 × 2,10 × 1,00 | 18.428 | Base da cama king; ajustar largura para escala aproximada de 1,9–2,0 m |
| Mesa de cabeceira | nightstand.glb | 0,50 × 0,40 × 0,55 | 4.456 | Par ao lado da cama |
| Escrivaninha | desk.glb | 1,20 × 0,60 × 0,75 | 3.372 | Estação do computador |
| Cadeira de escritório | desk-chair.glb | 0,60 × 0,60 × 1,00 | 6.212 | Assento da estação de trabalho |
| Luminária de mesa | table-lamp.glb | 0,30 × 0,30 × 0,45 | 2.984 | Luz de leitura, com toggle |
| Luminária de piso | floor-lamp.glb | 0,45 × 0,45 × 1,60 | 2.984 | Luz ambiente do quarto |
| Módulo de bancada | counter.glb | 0,60 × 0,62 × 0,92 | 3.560 | Repetir/ajustar para kitchenette |
| Refrigerador | fridge.glb | 0,70 × 0,72 × 1,85 | 1.224 | Refrigerador da kitchenette; escala ajustável |
| Ducha/box | shower.glb | 0,90 × 0,90 × 2,00 | 2.692 | Box do banheiro |
| Lavatório | sink.glb | 0,80 × 0,50 × 0,86 | 5.884 | Pia do banheiro |
| Vaso sanitário | toilet.glb | 0,40 × 0,70 × 0,78 | 4.072 | Banheiro privativo |
| Espelho | mirror.glb | 0,60 × 0,03 × 0,80 | 376 | Parede sobre o lavatório |
| Toalheiro | towel-rail.glb | 0,60 × 0,10 × 0,80 | 2.076 | Parede do banheiro |
| Armário | wardrobe.glb | 1,20 × 0,60 × 2,10 | 4.456 | Armazenamento do quarto |
| TV | tv.glb | 1,25 × 0,08 × 0,72 | 848 | Televisão moderna, com estado ligado/desligado |
| Console de TV | tv-console.glb | 1,80 × 0,40 × 0,50 | 5.352 | Móvel de apoio da televisão |

O repositório de origem também disponibiliza o gerador e o catálogo técnico em frontend/scripts/generate-furniture.py, frontend/static/models/catalog.json e frontend/static/models/CREDITS.md. As medidas e contagens acima vêm desse catálogo. O visual final de cada GLB ainda precisa de QA dentro do CASABROOKLIN, com Carter ao lado e materiais vistos em perspectiva de jogo.

### Peças autorais obrigatórias

| Objeto | Decisão | Motivo |
|---|---|---|
| Apoio de cabeça de marfim com leões e Shu | Geometria original de alta definição em Three.js/Blender | Nenhum GLB gratuito verificado corresponde à composição específica da referência GEM 270 |
| Computador/monitor e teclado | Geometria original e tela emissiva própria | Os candidatos de laptop encontrados são retro ou não têm licença/proveniência adequadas |
| Aparelho de som e caixas | Geometria original | Os modelos disponíveis não foram confirmados com estilo, licença e qualidade adequados |
| Snacks e embalagens | Geometria original leve + rótulos próprios | A descrição do livro especifica ginger ale, Twix e Skittles; não há necessidade de importar embalagens 3D de terceiros |
| Bacia de vidência e pedestal | Geometria original em bronze e pedra | Não foi localizado um modelo reutilizável fiel ao formato descrito no segundo livro |
| Portas de vidro, caixilhos, guarda-corpo e deck | Arquitetura original | Precisam encaixar precisamente na geometria e na colisão do corredor/varanda |

## 4. Texturas e materiais

Reutilizar, sem duplicar downloads, os conjuntos PBR locais já incluídos no CASABROOKLIN:

- assets/textures/wood-walnut/ — Poly Haven Walnut Veneer 02, CC0: marcenaria, console, guarnições e detalhes de madeira.
- assets/textures/plaster-smooth-beige/ — Poly Haven Beige Wall 001, CC0: paredes internas com acabamento mineral claro.
- assets/textures/tile-limestone-beige/ — ambientCG Tiles139, CC0: piso do banheiro e áreas molhadas.
- assets/textures/marble-white/ — ambientCG Marble012, CC0: pedra clara de bancada e pequenos detalhes.
- Roupa de cama e móveis importados usam os mapas embutidos nos GLBs MIT; não substituir por cores planas sem motivo.

Direção de acabamento: madeira nogueira/caramelo, calcário bege, linho marfim, bronze acetinado, vidro ligeiramente fumê e luz quente indireta. Evitar superfícies cinza genéricas, plástico brilhante e ornamentação egípcia repetida sem referência.

## 5. Pesquisas rejeitadas ou usadas apenas como referência

| Fonte/candidato | Licença/estado | Decisão |
|---|---|---|
| Poly Haven — Gothic Bed 01 | CC0; 18.741 triângulos; 1,49 × 2,04 × 1,53 m | Rejeitado como cama do Carter: estilo gótico, madeira escura e quatro postes não correspondem ao quarto moderno |
| 3DAssets.dev — Bedroom and Living Room Furniture | CC0; 55 GLBs, 4,5 MB; o próprio pack declara que os 55 modelos foram gerados com IA | Não usar como mobiliário hero; catálogo útil para comparação de escala, mas a estética/produção não é a direção escolhida |
| Mint — Double Bed With Headboard / Wooden Nightstand / Bathroom fixtures | GLB CC0, mas as páginas declaram geração por Mint Modeler; peças têm malha/material único em vários casos | Alternativa de reserva; não importar sem inspeção individual de malha, pivô e material |
| GitHub — RainyCreepThreeJS | Repositório Three.js com quarto interativo e vários GLBs, mas sem ficheiro de licença | Não copiar modelos nem código; apenas referência de fluxo de interação |
| Wildform — Headrest 3D Model | Pago/comercial | Rejeitado; a peça histórica GEM 270 será reconstruída |
| GLBs genéricos de headrest sem leões/Shu | Licença e correspondência variável | Não substituir o objeto narrativo por um apoio de cabeça genérico |

Fontes:
- Poly Haven e licença CC0: https://polyhaven.com/models e https://polyhaven.com/about-contact
- Gothic Bed 01: https://polyhaven.com/a/GothicBed_01
- 3DAssets.dev pack: https://3dassets.dev/packs/bedroom-and-living-room-furniture
- Mint: https://mint.gg/free-3d-models/category/furniture e https://mint.gg/free-3d-models/category/bathroom-home
- RainyCreepThreeJS: https://github.com/xkhaliil/RainyCreepThreeJS

## 6. Interações planejadas

| Elemento | Interação |
|---|---|
| Cama e headrest | E / INTERAGIR para inspecionar; headrest tem descrição e referência próprias |
| Luminárias | Ligar/desligar, com luz pontual e emissive coerentes |
| TV, computador e aparelho de som | Ligar/desligar; estado visual muda sem mudar de cena |
| Frigorífico/kitchenette | Abrir/inspecionar e recolher snack como ação de exploração |
| Banheiro | Ligar água da pia/ducha, inspecionar espelho e acessórios |
| Portas dos quartos | Abrir/fechar, remover/adicionar collider na mesma ação |
| Porta entre Carter e Sadie | Permitir passagem entre quartos contíguos |
| Portas de vidro da varanda | Permanecem bloqueadas inicialmente, como no primeiro livro; comunicar o selo sem permitir atravessar o vidro |
| Bacia de vidência | Foco futuro de interação no deck; animação de óleo/ondulação quando a varanda estiver acessível |

Todos os objetos interativos precisam de prompt visível em desktop e mobile, usar o mesmo array interactables e respeitar o filtro da zona. Os colliders devem cobrir a forma dos móveis sem bloquear o espaço útil de circulação.

## 7. QA obrigatório antes de aprovação

- [ ] Conferir escala dos GLBs com Carter (~1,78 m), orientação frontal e pivôs no piso.
- [ ] Verificar o GLB da cama: remover/atenuar a cabeceira comum se competir com o apoio egípcio; não esconder o headrest no colchão.
- [ ] Conferir geometria, leões e Shu do headrest em frontal, perfil e 3/4.
- [ ] Verificar PBR da roupa de cama, madeira, calcário, metais e vidro.
- [ ] Testar colisões nas quatro paredes, banheiro, móveis e portas.
- [ ] Fazer percurso físico Grande Salão → porta da galeria superior → vestíbulo → corredor residencial → quarto de Carter → quarto de Sadie → retorno.
- [ ] Verificar portas de vidro bloqueadas, sem atravessar parede/vidro.
- [ ] Testar todas as ações com E em desktop e INTERAGIR no mobile.
- [ ] Validar em navegador desktop e celular em paisagem; testar carregamento local dos GLBs, FPS e estabilidade.
- [ ] Marcar separadamente implementado, testado e aprovado visualmente.
