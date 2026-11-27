# Quarto de Carter — estudo canônico e implementação

Status: primeira integração asset-first implementada em src/bedroom.js e conectada à cena compartilhada. Checagem estática de sintaxe concluída; inspeção visual em navegador desktop e mobile ainda pendente.

## Canônico textual — The Red Pyramid

- Carter e Sadie recebem quartos adjacentes no terceiro andar.
- O quarto de Carter tem uma cama king-size.
- O travesseiro convencional é substituído por um apoio de cabeça egípcio de marfim, semelhante aos vistos em tumbas, decorado com leões e hieróglifos.
- Há uma pequena kitchenette abastecida com ginger ale, Twix e Skittles.
- O quarto dispõe de televisão, computador e aparelho de som.
- Há um banheiro privativo abastecido com produtos de higiene usuais de Carter.
- Portas de vidro deslizantes dão acesso a um deck privado com vista para o porto de Nova York, Manhattan e a Estátua da Liberdade.
- Na chegada, as portas de vidro para o deck estão trancadas. Existe também uma porta de comunicação entre os quartos de Carter e Sadie, igualmente trancada naquela cena.

## Interpretação de produção

O romance não fixa planta cotada, dimensões, desenho do mobiliário, cor das paredes, materiais de piso, posição dos aparelhos, modelo da geladeira, configuração do banheiro, banheira ou acabamento do deck. Esses itens são decisões de reconstrução, não fatos canônicos.

## Referência histórica do apoio de cabeça

A ficha oficial do Grand Egyptian Museum para o objeto 270, Lions Headrest, descreve uma peça de marfim com base estreita e larga, pilar central representando o deus Shu ajoelhado e sustentando um apoio curvo, ladeado por dois leões agachados. O museu informa 18,2 cm de altura e 29,5 cm de comprimento. É uma referência histórica visual, não a identificação do objeto exato imaginado pelo romance.

Fonte: https://gem.eg/en/collection/artefacts/lions-headrest

Na implementação, o modelo procedural próprio usa marfim, dois leões, Shu central, arco superior curvo e marcas hieroglíficas. Shu segue a referência histórica; o livro confirma marfim, leões e hieróglifos, mas não especifica a figura central.

## Direção visual aprovada

Direção aprovada pelo usuário em 27/11/2026:

- Móveis e equipamentos com modelos modulares CC0 que combinem com o visual híbrido cinematográfico do CASABROOKLIN.
- Preferência por GLB/glTF e níveis de detalhe para proteger o orçamento mobile.
- Apoio de cabeça egípcio construído sob medida, separado da cama.
- Planta principal aberta, sem parede divisória central; banheiro em um canto com painéis translúcidos.
- Deck voltado ao East River, com portas de vidro deslizantes.
- Porta de comunicação com o quarto de Sadie representada como trancada.
- Mesma cena, meshes, objetos e interações no desktop e no mobile; apenas controles e UI podem diferir.

## Modelos CC0

Todos os modelos Tevy abaixo são publicados sob CC0 1.0. Os URLs são versionados e fixados; o carregador usa LOD1 no desktop e LOD2 no mobile.

| Objeto | Fonte / versão | LOD publicado |
|---|---|---:|
| Cama de casal | https://tevy.dev/models/double-bed · v1 | LOD0: 18.768 tris / 1,0 MB; LOD1: 4.848 tris / 286 KB; LOD2: 512 tris / 66 KB |
| Criado-mudo | https://tevy.dev/models/nightstand · v2 | LOD0: 1.376 tris / 592 KB; LOD1: 640 tris / 177 KB; LOD2: 260 tris / 54 KB |
| TV e console | https://tevy.dev/models/tv-stand · v2 | LOD0: 1.266 tris / 503 KB; LOD1: 554 tris / 142 KB; LOD2: 366 tris / 48 KB |
| Mesa e computador | https://tevy.dev/models/office-desk · v2 | LOD0: 9.722 tris / 395 KB; LOD1: 4.940 tris / 162 KB; LOD2: 1.238 tris / 54 KB |
| Módulo de pia kitchenette | https://tevy.dev/models/kitchen-base-unit-sink · v1 | LOD0: 2.442 tris / 857 KB; LOD1: 1.372 tris / 274 KB; LOD2: 404 tris / 85 KB |
| Gaveteiro kitchenette | https://tevy.dev/models/kitchen-base-unit-drawers · v1 | LOD0: 1.760 tris / 269 KB; LOD1: 1.344 tris / 106 KB; LOD2: 168 tris / 41 KB |
| Gabinete banheiro | https://tevy.dev/models/bathroom-vanity · v1 | LOD0: 4.232 tris / 245 KB; LOD1: 2.490 tris / 101 KB; LOD2: 1.060 tris / 44 KB |
| Banheira | https://tevy.dev/models/bathtub · v1 | LOD0: 6.350 tris / 236 KB; LOD1: 3.098 tris / 106 KB; LOD2: 1.400 tris / 45 KB |
| Vaso sanitário | https://tevy.dev/models/toilet · v1 | LODs disponíveis no catálogo; confirmar geometria na inspeção de navegador |
| Caixas acústicas | https://tevy.dev/models/bookshelf-speaker · v1 | LOD0: 9.444 tris / 682 KB cada; LOD1: 5.295 tris / 232 KB; LOD2: 1.234 tris / 72 KB |

Geladeira: Innerscene Undercounter Fridge, CC0, GLB de 452 KB, dimensões nominais 0,598 × 0,548 × 0,820 m. Página: https://www.innerscene.com/tools/library/3d-parts/undercounter-fridge-bef8ea56. O código tenta carregar o GLB pelo host de arquivos; CORS/carga ainda não foram validados no navegador. Um modelo procedural proporcional permanece como fallback.

## Pipeline Three.js e fallbacks

- Tevy publica GLBs com geometria Meshopt e texturas KTX2. O projeto usa Three.js r165.0, GLTFLoader, MeshoptDecoder e KTX2Loader com o transcoder Basis da mesma versão.
- Documentação do fornecedor: https://tevy.dev/docs. Informa HTTPS, CORS aberto, versões fixadas e licença CC0.
- LOD1 é carregado no desktop; LOD2 em aparelhos touch. Os caminhos v1/v2 não acompanham atualizações futuras do catálogo.
- Os GLBs Tevy são carregados de seus provedores originais e não foram copiados para assets/models nesta etapa. A sala possui fallbacks locais de geometria caso a rede ou o carregador falhe.
- O carregamento remoto, texturas KTX2, orientação, escala, CORS, colisões e desempenho ainda precisam de QA em navegador real.

## Implementação

- src/bedroom.js constrói a suíte e as interações. src/world.js remove o bloco provisório residencial e mantém a zona no terceiro pavimento. src/main.js integra o módulo, atualiza as portas e mostra os prompts.
- O piso está na cota de jogo y=20,625, correspondente ao terceiro pavimento da sequência arquitetônica adotada.
- A planta principal é aberta, sem parede central. Paredes externas e teto fecham a sala; o banheiro fica em um canto, com painéis translúcidos.
- O deck prolonga o piso em direção ao East River e usa guarda-corpo de vidro e bronze. As portas panorâmicas começam trancadas; a primeira interação destranca e a segunda desliza as folhas.
- A porta de comunicação com Sadie está fechada e bloqueada, com mensagem contextual.
- O apoio de cabeça é uma peça independente apoiada sobre o colchão, não uma cabeceira.
- TV, computador, kitchenette, áudio, banheiro, apoio e portas possuem pontos E/INTERAGIR compartilhados.
- Ginger ale, Twix e Skittles são representados por embalagens próprias com rótulos desenhados localmente.
- A mesma cena é montada no desktop e no mobile.

## QA

- [x] Pesquisar a descrição do livro e separar canônico de interpretação.
- [x] Pesquisar referência histórica oficial do apoio de cabeça.
- [x] Selecionar modelos CC0 e versões fixadas.
- [x] Criar e conectar o módulo asset-first.
- [x] Remover a parede central e preservar a planta aberta.
- [x] Representar a porta de Sadie trancada.
- [x] Adicionar portas do deck com estado trancado/aberto.
- [x] Adicionar fallbacks locais e LOD desktop/mobile.
- [x] Checar sintaxe dos módulos alterados.
- [ ] Testar GLBs, CORS e KTX2 no GitHub Pages.
- [ ] Conferir escala/orientação com Carter na câmera de jogo.
- [ ] Testar passagem, colisores e portas em desktop.
- [ ] Testar os mesmos objetos e interações em celular paisagem.
- [ ] Avaliar desempenho e falhas de rede.
- [ ] Confirmar a vista real do deck para Manhattan e a Estátua da Liberdade.

Não marcar como visualmente aprovado antes dos testes de navegador.
