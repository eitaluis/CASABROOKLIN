# CASABROOKLIN — padrão asset-first para construção de espaços

Status: **padrão obrigatório para todo novo espaço, ambiente, interior ou área externa.**

## Princípio

Todo espaço começa pela compreensão do lugar descrito no livro e por uma pesquisa de assets de código aberto. Não começar enchendo o ambiente com caixas, cilindros ou materiais de cor lisa. Geometria procedural continua permitida para arquitetura exclusiva, encaixes, relevos e peças que não tenham asset adequado, mas precisa usar referências de materiais e acabamento de qualidade e passar por revisão de proporção.

**Cada peça visível do ambiente precisa de uma ficha de produção**, sem exceção para os detalhes pequenos. Isso inclui arquitetura, mobiliário, esculturas, ferragens, adornos, instrumentos, armas, luzes, partículas, superfícies, texturas, portas, janelas, vegetação e qualquer elemento interativo. Um conjunto pode agrupar peças repetidas (por exemplo, os balaústres de uma galeria), mas a ficha deve identificar todos os componentes e onde são usados. Cada ficha cobre cinco frentes:

1. **Objeto/forma:** GLB/glTF/FBX/Blend ou geometria original sob medida; silhueta, proporções, pivô, escala e fidelidade à referência textual.
2. **Material/visual:** albedo/base color, normal, roughness, metallic, AO e UVs sempre que disponíveis. Anotar resolução e escala física de repetição.
3. **Luz/reflexo:** interação com iluminação da sala, emissive quando necessário, sombras, transparência, bloom/reflexos e legibilidade no ambiente.
4. **Interação com personagem:** collider, superfície caminhável, proximidade, inspeção, uso, assento, acionamento, animação ou perigo conforme o objeto.
5. **Desempenho/licença:** licença e autor confirmados, tamanho e triângulos, compressão/LOD, custo de textura e perfil desktop/mobile.

## Fluxo obrigatório

**Skill operacional do projeto:** consulte sempre o [SKILL.md — pesquisa visual e aprovação de assets](../SKILL.md). Este fluxo vale para o projeto Brooklyn inteiro, incluindo personagens, roupas, acessórios, objetos, salas, texturas, luzes, efeitos, feitiços, animações, combate e interações — não apenas para ambientes.

### Fase 00 — aprovação visual (bloqueio antes da implementação)
- [ ] Depois de compreender o pedido, pesquisar a descrição nas passagens do(s) livro(s) e registrar o que é canônico e o que o texto não especifica.
- [ ] Buscar ilustrações oficiais do autor/editora e material de ilustradores creditados; separar essas fontes de fan art e referências históricas.
- [ ] Buscar assets 3D/código/texturas reais em repositórios e páginas dos autores; conferir preview, licença, formato, medidas, hierarquia, pivôs/rig, texturas e compatibilidade Three.js/mobile.
- [ ] Preparar um painel visual no chat com as imagens/visualizadores de cada referência e candidato, diferenças, vantagens, limitações e recomendação.
- [ ] Aguardar aprovação explícita do usuário. Não baixar, alterar, criar nem integrar o novo visual/asset antes dessa aprovação.
- [ ] Se nenhum asset servir, apresentar uma proposta de geometria original com referências visuais antes de modelar.

### Fase 01 — leitura e intenção
- [ ] Ler as passagens do livro relacionadas ao cômodo, não apenas uma frase isolada.
- [ ] Criar lista de elementos canônicos, referências históricas e detalhes interpretativos.
- [ ] Definir uso do espaço: circulação, permanência, contemplação, exposição, combate, leitura, descanso etc.
- [ ] Identificar o que o Carter precisa alcançar, tocar, atravessar, inspecionar ou usar.
- [ ] Marcar o que é obrigatório para comunicar o espaço e o que é preenchimento opcional.

### Fase 02 — pesquisa de assets
- [ ] Pesquisar primeiro GitHub e repositórios open-source, incluindo GLB/glTF, texturas PBR, shaders, rigs, controllers, colisões e interações.
- [ ] Consultar também as páginas originais do autor/provedor para verificar conteúdo e licença. O facto de um ficheiro aparecer num repositório de terceiros não prova, por si só, a licença.
- [ ] Verificar preview do modelo, dimensões reais, orientação frontal, origem/pivô, UVs, materiais, texturas e triângulos.
- [ ] Preferir assets CC0/MIT ou outra licença explicitamente compatível. Preservar aviso e créditos exigidos.
- [ ] Não selecionar um asset só por ser gratuito: rejeitar linguagem low-poly/blocada que entre em conflito com a direção visual do projeto.
- [ ] Quando não houver asset adequado, registar a lacuna e criar uma peça original de qualidade superior, baseada em referências visuais e materiais abertos.
- [ ] Preparar uma ficha por objeto antes de integrar. Para objetos hero, criar preview isolado e comparar alternativas.
- [ ] Se um asset adequado não existir, registrar a pesquisa, as alternativas rejeitadas e a razão para criar geometria própria. A criação própria também precisa de referência de forma e material; nunca virar um bloco/cilindro placeholder apresentado como versão final.

### Fase 03 — composição e adaptação
- [ ] Fazer greybox apenas para testar escala e circulação; não a tratar como acabamento.
- [ ] Ajustar o asset ao ambiente: escala, orientação, pivô, materiais, textura, patina, ornamentos e contexto.
- [ ] Manter o mesmo sistema de coordenadas, personagem e geometria no desktop e mobile.
- [ ] Usar LOD/compressão e reduzir resolução no mobile apenas quando necessário; não remover detalhe visual gratuitamente.
- [ ] Criar collider coerente com a silhueta e o uso do objeto.
- [ ] Adicionar interação quando houver valor de jogo: inspeção, sentar, usar, abrir, subir, ler, recolher, acionar ou evitar.

### Fase 04 — validação
- [ ] Comparar com a referência textual e visual, frontal e em ângulos de jogo.
- [ ] Testar distância do personagem aos móveis e altura de assento/mesa.
- [ ] Testar colisão, passagem, escadas, interações e clipping.
- [ ] Testar em navegador real no desktop e em celular paisagem.
- [ ] Medir FPS, carregamento, memória, temperatura e estabilidade do mobile.
- [ ] Separar status **implementado**, **testado** e **aprovado visualmente**. Não declarar o espaço concluído enquanto a inspeção real estiver pendente.

## Matriz de assets — Grande Salão

O programa textual do Grande Salão em *A Pirâmide Vermelha* inclui pé-direito de quatro alturas, três níveis de galerias, colunas/vigas de cedro e pedra, instrumentos e armas egípcias expostos, lareira monumental com TV acima, dois grandes sofás de couro, tapete de pele de serpente de aproximadamente 12,2 × 4,6 m e estátua de Thoth em mármore negro (cerca de 9,1 m), com corpo humano, cabeça de íbis, kilt, faixa, colar, estilete e papiro aberto com o sinal Per Ankh. As portas duplas com o Olho de Hórus, correntes e cadeados e as paredes envidraçadas voltadas para o terraço também fazem parte da composição descrita. O terraço envidraçado, piscina, refeições e fogueira exterior são tratados como uma zona contígua.

| Elemento | Asset/estudo escolhido | Material e visual | Interação prevista | Estado |
|---|---|---|---|---|
| Fogo | [Housz/ThreeVolumetricFire](https://github.com/Housz/ThreeVolumetricFire), MIT; classe local adaptada a GLSL3/WebGL2 e texturas de perfil/ruído | Volume 3D view-aligned; amostragem aumentada (0,024 desktop / 0,052 mobile; 66 segmentos desktop / 34 mobile), lenha, cama de brasas, faíscas e luz dinâmica | Inspeção por proximidade; luz afeta a leitura do espaço | Shader integrado e densidade aumentada; suavidade visual ainda precisa de QA em vários ângulos |
| Sofás (2) | [Poly Haven Sofa 03](https://polyhaven.com/a/sofa_03), Fran Calvente, CC0; GLB local; 2,731 × 0,925 × 1,118 m, 8.004 triângulos | Dois materiais e mapas PBR incorporados; escala 0,72 (largura aproximada 1,97 m); posicionamento corrigido pela caixa real da malha; fallback procedural proporcional permanece visível em caso de erro | Colliders e inspeção por proximidade; sentar/levantar é interação futura | GLB integrado com fallback validado; QA visual de escala/orientação pendente |
| Thoth | Escultura original sob medida; referências históricas do [Metropolitan Museum of Art](https://www.metmuseum.org/art/collection/search/544092) (Public Domain) e [Minneapolis Institute of Art](https://sketchfab.com/3d-models/thoth-c-644-bce-30-ce-394a94722862460e8cefab54b4bed7bf) (CC0) | Mármore negro com PBR; corpo humano, pernas, kilt shendyt, faixa diagonal, colar, papiro Per Ankh e estilete; revisão de cabeça/olhos, pescoço longo e bico de íbis curvos e afilados; escala preservada em cerca de 9,1 m | Collider e inspeção com gesto Ara `look_around` | Refinamento procedural integrado; modelos históricos são referências, não foram importados; QA visual pendente |
| Bancos curvos junto a Thoth | [Innerscene Curved Modular Seating — 3 Modules](https://www.innerscene.com/tools/library/3d-parts/curved-modular-seating-3-modules-1f4a9531), GLB 127 KB, 4,446 × 1,330 × 0,440 m, CC0-1.0; arquivo consultado como referência, não importado | Dois arcos/crescentes contínuos em calcário, couro e nogueira; assento a aproximadamente 0,485 m; encosto curvo, braços e filetes de bronze | Dois anchors específicos; `sit_down` → `sit_idle` → `stand_up` (ID nativo do Ara, gerado internamente como `reversed(SIT_DOWN)`); colisores segmentados e saída livre | Geometria Three.js original adaptada à planta. GLB de referência não foi recuperado/inspecionado nem integrado; browser QA pendente |
| Escadaria monumental | [Tevy Museum Grand Stair](https://tevy.dev/models/museum-grand-stair), GLB 416 KB/12.064 triângulos, 3 LODs, 6,16 × 4,81 × 6,63 m, CC0-1.0; referência aprovada, arquivo não importado | Calcário com paredes laterais contínuas, espelhos, focinhos de bronze, balaústres torneados, corrimãos contínuos e newels com finiais | Rampas e patamares existentes preservados no controlador comum; subir/descer por locomoção normal | Geometria própria adaptada às larguras/alturas existentes; QA de degraus e colisores pendente |
| Mesa baixa | Geometria original inspirada em [Round Coffee Table 01](https://polyhaven.com/a/coffee_table_round_01) e [Round Wooden Table 01](https://polyhaven.com/a/round_wooden_table_01) | Walnut PBR CC0, tampo de cerca de 1,5 m, bronze e medalhão solar | Collider e inspeção | Geometria redimensionada; validação visual pendente |
| Tapete | Superfície procedural original, conforme a descrição de pele de serpente | Escamas sobrepostas jade/terra/carvão, albedo + bump e borda de couro/bronze | Caminhável; não deve bloquear Carter | Implementado; conferir escala e leitura |
| Piso de calcário | [ambientCG Tiles139](https://ambientcg.com/a/Tiles139), CC0 | Color, normal e roughness maps locais | Superfície caminhável | PBR integrado |
| Paredes/colunas | Geometria arquitetónica sob medida; [Poly Haven Beige Wall 001](https://polyhaven.com/a/beige_wall_001), CC0 | Calcário com normal/roughness reais, caneluras, capitéis de lótus, veios e juntas | Colliders; galerias e escadas caminháveis | PBR integrado; detalhamento e QA pendentes |
| Madeira | [Poly Haven Walnut Veneer 02](https://polyhaven.com/a/walnut_veneer_02), CC0 | Color, normal e roughness locais | Usado nos móveis e acabamentos | PBR integrado |
| Mármore | [ambientCG Marble012](https://ambientcg.com/a/Marble012), CC0 | Normal/roughness sobre o albedo negro da estátua | Integrado na estátua | PBR integrado |
| Lustre/arandelas | Geometria original sob medida | Bronze, vidro âmbar, emissive e luz quente | Acionamento de luz futuro | Primeira camada existente; refino pendente |
| Galerias/escadas/portas dos quartos | Arquitetura sob medida, escadarias em zigue-zague e 18 portas de madeira repetidas nos três níveis; pedra/beige wall, walnut veneer e bronze PBR | Calcário com normal/roughness, caneluras, capitéis de lótus, juntas, portas entalhadas e ferragens em bronze | Altura progressiva, colliders de degraus/patamares e inspeção por proximidade das portas | Implementado; conferir subida e escala visual |
| Instrumentos/armas | Harpas arqueadas, tambores de pele, flautas, lanças e khopeshes construídos sob medida; nenhum pack high-detail com licença/estilo compatíveis foi selecionado. SVGs de identificação vêm de [game-icons/icons](https://github.com/game-icons/icons), CC BY 3.0, com autores Delapouite e Lorc | Walnut PBR CC0, bronze, pele e cordas; geometrias curvas de alta segmentação; placas SVG douradas com créditos em assets/decor/README.md | Colliders em harpas/tambores/flautas e inspeção por proximidade para instrumentos e armas | Geometria própria + vetores CC BY como identificação; validação visual/interativa pendente |
| Lareira/manto | Fogo Housz MIT; moldura de calcário esculpida sob medida com arco, pilastras, capitéis e manto arredondado; TV própria | PBR de pedra, bronze e madeira; shader volumétrico com amostragem aumentada, lenha e brasas | Collider e inspeção do conjunto; interação de acendimento é futura | Moldura e fogo refinados em código; QA visual pendente |
| TV de plasma | Moldura plana original sob medida, vidro físico refletivo e tela emissiva com estado ligado/desligado; Poly Haven Television 01/02 foram avaliadas, mas são CRT e não correspondem ao texto | Metal escuro, clearcoat, vidro e emissive azul discreto | Interação de alternar energia por E/INTERAGIR | Integrada; validar no browser |
| Portas duplas especiais | Geometria original em folhas de madeira, moldura de pedra; Eye of Horus, correntes e seis cadeados com SVGs Game-icons CC BY 3.0 | Nogueira PBR, ferragens de metal escuro/bronze | Collider bloqueia passagem; inspeção contextual informa que a porta permanece trancada | Implementada como porta trancada; ação de destrancar é futura |
| Paredes envidraçadas | Painéis e bandeira de vidro físicos com montantes/travessas de bronze | MeshPhysicalMaterial, transmissão e acabamento de bronze | Colliders evitam atravessar os painéis | Implementadas na parede posterior; validar vista para o terraço e transparência no browser |
| Estandartes/relevos | Textura e geometria local; Game-icons SVG para harp/drum/flute/spears/eye/chains/locks | Tecido dupla-face, cedro/bronze, relevos solares e placas de identificação | Inspeção contextual integrada nos objetos associados | Implementado; atribuição individual em assets/decor/README.md; QA visual pendente |

### Critérios de escala
- Sofá Poly Haven: largura física nativa de 2,731 m, importado com escala 0,72 (dimensão final aproximada de 1,97 m no eixo longo). Confirmar em perspectiva de jogo com a altura de Carter (~1,78 m).
- Mesa baixa: por volta de 1,45–1,55 m de diâmetro e 0,5–0,55 m de altura.
- Assento de sofá: alvo de 0,40–0,48 m acima do piso. Não criar animação de sentar sem clip ou controller confiável.
- Bancos curvos de Thoth: assento contínuo a aproximadamente 0,485 m, com encosto e braços; Carter deve alinhar os pés ao piso, ajustar a pelve ao assento e sair para uma âncora externa sem atravessar os colisores.
- Escadaria Museum Grand Stair: referência de 18 degraus e subida de 3 m; a adaptação do salão mantém os lances de 18 degraus e as alturas de patamar existentes, sem importar a malha GLB original.
- Tapete: dimensão canônica aproximada de 12,2 × 4,6 m; a superfície procedural de pele serpentina deve ser legível em vista oblíqua e não pode bloquear a navegação.
- Estátua: aproximadamente 9,1 m até à coroa; o kilt, a faixa, o papiro aberto e o estilete precisam ser legíveis, não escondidos em vista de terceira pessoa.

## Regra de crédito

Cada asset externo e cada conjunto de texturas precisa de registo individual em assets/manifest.json, incluindo fonte, licença, autor quando exigido, localização local e função. Nunca creditar geometria original ao fornecedor de textura nem afirmar que um modelo foi importado quando foi usado apenas como referência.


## Matriz de assets — Exterior da Brooklyn House

| Elemento | Asset/estudo escolhido | Material e visual | Interação prevista | Estado |
|---|---|---|---|---|
| East River — superfície | Shader/normal-map procedural original, com estudo técnico de mqnc/cheapwater (MIT), sem código externo incorporado | CanvasTexture periódica como bumpMap; superfície contínua de 560 unidades entre as margens, coloração azul-ardósia, ondas e neblina reduzida | Superfície visual sem collider; barco atracado junto ao píer do Brooklyn | Implementado; validar reflexo, escala das ondas e custo visual em desktop/mobile |
| Williamsburg Bridge | Geometria estrutural original no módulo exterior; proporções de referência histórica NYC DOT | Tabuleiro compartilhado com vias rodoviárias laterais e trilhos centrais do metrô, aço escuro, treliças instanciadas, cabos, pendurais e rampas nas duas margens | Marco visual sem colisão navegável nesta fase | Implementado; validação de silhueta, acesso e escala pendente |
| Barco de papiro | Módulo original src/papyrus-boat.js, construído de feixes curvos de fibras vegetais e amarrações | Cabana central com superfície contínua de esteiras, duas tochas na proa e timoneiro pequeno de casaco/chapéu na popa; sem vela ou motor | Atracado ao lado do píer; inspeção contextual no mesmo ponto visual | Implementado; QA visual e escala pendentes |
| Cais e doca | Geometria original no módulo world.js, com tábuas, estacas, cabeços, defensas e argolas | Madeira envelhecida, concreto gasto, aço oxidado e borracha | Caminhabilidade e colisões conforme as superfícies já registradas no mundo | Implementado; QA de circulação e clipping pendente |

**Nota de produção:** a água usa um mapa de altura procedural periódico, sem dependência de arquivo externo. A referência MIT foi estudada, mas nenhum código, textura ou shader de terceiros foi copiado. O mesmo material e a mesma geometria são usados em desktop e mobile; apenas repetição, anisotropia e intensidade do bump são ajustadas por perfil de dispositivo.


## Matriz de assets — Biblioteca subterrânea

A biblioteca é uma reconstrução interpretativa da câmara subterrânea da Casa Brooklyn. A distribuição em três faixas, os 48 nichos e os quatro shabtis são decisões atuais de composição do projeto; não devem ser apresentados como contagens canônicas do romance sem confirmação textual.

| Elemento | Forma/asset | Material e visual | Interação/personagem | Desempenho/licença | Estado |
|---|---|---|---|---|---|
| Câmara circular e parede rochosa | Arquitetura existente em `src/world.js`; geometria sob medida, sem pacote externo importado | Pedra/plaster existente; revisar normal, roughness, profundidade e leitura interna | Colisão arquitetônica e circulação no piso inferior | Geometria própria; compartilhada desktop/mobile | Implementado; QA visual pendente |
| Cúpula de Nut | Hemisfério interno original em `src/interior-details.js`; textura Canvas 1024×512 | Azul profundo, estrelas, constelações e traçado ornamental dourado; seed fixa para composição reproduzível | Elemento de contemplação; sem collider | Código original; textura gerada localmente, sem download/runtime externo | Implementado; QA visual pendente |
| Piso cartográfico de Geb | Disco original em `src/interior-details.js`; textura Canvas 1024×1024 | Verde-terra, manchas minerais, anéis e linhas radiais douradas | Superfície visual sobre o piso caminhável já existente | Código original; seed fixa | Implementado; QA visual pendente |
| Nichos e molduras (48) | Geometria própria repetida em três faixas; duas ombreiras, fundo, lintel e soleira por nicho | Pedra escurecida, cedro, bronze e papiros | 16 nichos inferiores permitem abrir/fechar visualmente um rolo e inspecionar a folha; os níveis superiores permanecem visuais | Código original; sem dependência externa | Implementado; interações inferiores adicionadas |
| Rolos de papiro | Cilindros e ponteiras originais, dois por nicho | Papiro, madeira e cordão; variação de posição controlada pela seed | Examinar os papiros da galeria inferior; leitura narrativa inicial | Código original | Implementado; leitura detalhada/coleção futura |
| Quatro shabtis | Figuras originais com pedestal, corpo mumiforme, cabeça, nemes, colar e ferramentas | Faiança azul/lápis-lazúli e ouro/bronze | Cada guardião tem ponto de inspeção contextual | Código original; geometria leve e compartilhada | Implementado; QA de alcance pendente |
| Mesa de leitura | Mesa/apoio e objetos originais | Papiro aberto, marcas de escrita e recipientes de óleo | Ponto de inspeção contextual no centro da câmara | Código original | Implementado; uso/coleção futuro |
| Placas hieroglíficas | Relevos originais repetidos nas transições da câmara | Bronze envelhecido | Elementos visuais; inspeção específica futura | Código original | Implementado; pesquisa iconográfica pendente |

### Decisões e lacunas da biblioteca
- A textura procedural da cúpula e do piso usa um gerador pseudoaleatório com seed fixa. Isso mantém a composição idêntica em recarregamentos e nos dois perfis de dispositivo.
- A interação é compartilhada pelo sistema já existente (E no desktop e botão INTERAGIR no mobile): os 16 papiros inferiores alternam entre rolo fechado e folha aberta, enquanto shabtis e mesa oferecem inspeção contextual. Os itens novos não criam um segundo controlador.
- Os textos de inspeção são descrições ambientais interpretativas, não transcrições do romance nem traduções de hieróglifos.
- Não foi introduzido um modelo 3D externo nesta etapa. As formas atuais são peças arquitetônicas específicas da câmara; antes de substituir shabtis, papiros ou relevos por assets externos, validar modelo, escala, orientação, materiais e licença individual conforme a fase 02.
- A validação de distância, colisão, iluminação, legibilidade e desempenho ainda depende de teste real no navegador desktop e em celular paisagem.


### Refinamento de escala e sequência de chegada — 26/11/2026

A matriz exterior anterior continua válida. Este complemento registra a expansão da escala geográfica e a sequência do barco até o portal, sem substituir a pesquisa de água procedural já documentada.

| Elemento | Complemento asset-first | Material / comportamento | Estado |
|---|---|---|---|
| East River e distância entre margens | Água com 560 unidades entre margens, terreno separado dos dois lados, paredões de cais e píeres secundários | Água azul/verde, horizonte com skyline e névoa leve, sem a antiga sobreposição do pátio sobre o rio | Implementado; validar escala, horizonte e custo em mobile |
| Williamsburg Bridge | Ponte suspensa com um tabuleiro compartilhado: pistas rodoviárias nas laterais e dois trilhos do metrô no centro; torres, cabos, treliças e rampas em ambas as margens, proporções orientadas pelo NYC DOT | Aço escuro e instâncias compartilhadas para reduzir draw calls | Geometria original; validar leitura, percurso e escala em desktop/mobile |
| Brooklyn e Manhattan | Terreno contínuo, docas, cais, depósitos, fábricas de tijolo, ruas, chaminés, tanques d'água, escadas de incêndio e skyline em camadas; dois marcos CC0 no horizonte | Paleta de tijolo, pedra, aço e vidro azul; neblina mais leve para preservar a leitura da outra margem | Geometria original próxima; Chrysler e Empire State importados como referências de escala ao longe |
| Barco egípcio | Casco de feixes arredondados de papiro, cabana de esteiras, duas tochas na proa e timoneiro pequeno com casaco/chapéu na popa | Fibras vegetais, cordas e trama de esteira; sem vela ou motor | Atracado junto à doca após passar sob a ponte; QA visual e escala pendentes |
| Portal | Vão livre com ombreiras e lintel, folha de madeira larga sem puxador ou fechadura | A folha sobe verticalmente quando Carter interage | Interação implementada; testar atravessamento físico |
| Percurso exterior | Escada metálica lateral em espiral, patamar superior reforçado e passarela com guarda-corpos até o portal central | Degraus e corrimãos em aço opaco, controlador de movimento compartilhado | Implementado no código; validar subida, aterrissagem e travessia até a porta em desktop/mobile |

**Fidelidade textual:** a escada que contorna a lateral do armazém é canônica; a forma helicoidal exata é uma interpretação do projeto. Manhattan é a margem oposta, não o local da Brooklyn House.


## Regra de silhueta exterior e espaço mágico interno — 26/11/2026

- [x] Separar a percepção externa da mansão (`mansionRevealGroup`) dos espaços internos.
- [x] Agrupar os interiores legados e modulares em `magicalInteriorGroup`, incluindo objetos carregados de forma assíncrona.
- [x] Manter o grupo interno invisível na doca; revelá-lo somente ao entrar em um ambiente da casa; ocultá-lo novamente ao sair para a doca.
- [x] Ajustar o minimapa para não mostrar o contorno da mansão antes da percepção nem a planta interna antes da entrada.
- [ ] Verificar em navegador desktop e mobile, de todos os ângulos externos, que nenhum anexo ou sala interna atravessa a silhueta do galpão.
- [ ] Verificar que as salas permanecem completas e interativas depois de entrar, inclusive portas, colisores, pisos, luzes e modelos GLB assíncronos.

A regra é estrutural, não cosmética: as salas podem ocupar coordenadas além da caixa física do armazém porque são espaços mágicos internos, mas sua renderização fica desligada enquanto o personagem está fora.

## Waterfront externo — busca asset-first e integração — 26/11/2026

A construção do entorno segue a mesma ordem usada para os interiores: pesquisar primeiro no GitHub, verificar licença e compatibilidade, integrar somente o que corresponda à cena e registrar também as opções recusadas. A busca foi feita por componente (ponte, barcos de papiro, galpões/fábricas, docas, guindastes e skyline de Nova York), em vez de escolher um pacote urbano genérico e adaptar a narrativa a ele.

| Elemento | Resultado da pesquisa GitHub | Decisão no CASABROOKLIN |
|---|---|---|
| Williamsburg Bridge | Foi localizado um GLB na coleção alexwohlbruck/landmarks; o repositório o classifica como CC0, mas o modelo está em estilo low-poly e com estado de revisão não validado | Não importar como ponte principal. Manter a geometria específica do projeto e refiná-la com pistas laterais, trilhos centrais no mesmo tabuleiro, cabos, treliças, rampas e medidas oficiais NYC DOT |
| Barco do East River | Os resultados eram barcos genéricos, de madeira ou com vela; nenhum modelo verificado reunia feixes de papiro, cabana de esteiras, tochas na proa e o timoneiro de casaco/chapéu | Rejeitar o genérico. Construir src/papyrus-boat.js com feixes curvos, cordas, trama de esteira, timoneiro e atracação ao píer |
| Fábricas, galpões e armazéns | Não foi encontrado um conjunto gratuito no GitHub com aparência e escala adequadas ao antigo waterfront industrial do Brooklyn descrito no romance | Modelagem original em src/waterfront-environment.js, com tijolo, vãos industriais, tanques d'água, chaminés, escadas de incêndio e depósitos |
| Docas, muros, píeres e guindastes | Os pacotes genéricos encontrados não representavam a pequena doca junto ao galpão e a cadeia de píeres industriais necessária | Geometria original integrada à margem, com abertura no muro do cais para a doca principal e píeres secundários |
| Skyline de Manhattan | Foram encontrados modelos GLB CC0-1.0 de Chrysler Building e Empire State Building na coleção Landmarks | Importados como marcos distantes, em assets/models/manhattan-chrysler-building.glb e assets/models/manhattan-empire-state-building.glb; a cidade próxima continua sendo geometria original para manter a composição sob controle |

**Fontes de contexto:** NYC Landmarks Preservation Commission — https://s-media.nyc.gov/agencies/lpc/lp/0163.pdf e NYC Department of City Planning — https://www.nyc.gov/assets/planning/download/pdf/plans/greenpoint-williamsburg/greenpointwill.pdf; proporções e seção da Williamsburg Bridge — NYC DOT https://www.nyc.gov/html/dot/html/infrastructure/williamsburg-bridge.shtml ajudam a orientar a leitura industrial da margem. O capítulo 5 de The Red Pyramid continua sendo a referência canônica para a chegada: passagem sob a ponte, pequena doca no Brooklyn, pátio de sucata/equipamentos, galpão grafitado, mansão perceptível no telhado e escada metálica lateral.

**Regra de qualidade:** não usar asset apenas porque é gratuito. Escala, orientação, silhueta, materiais, licença e coerência narrativa precisam ser verificados. A falta de um modelo pronto não autoriza preencher a cena com caixas cinzas; nesse caso, construir uma peça própria e registrar essa escolha.

- [x] Pesquisar assets GitHub para cada família de elementos do waterfront.
- [x] Importar apenas os dois marcos de skyline com licença CC0 verificada.
- [x] Registrar candidatos avaliados e recusados, bem como assets originais construídos.
- [x] Criar terreno e margens contínuas para Brooklyn, East River e Manhattan.
- [x] Conectar a Williamsburg Bridge ao tecido urbano com rampas de aproximação.
- [x] Reposicionar o barco junto à doca, após a travessia sob a ponte.
- [ ] Validar os GLBs e a composição em navegador desktop e mobile.


**Percurso de entrada confirmado no código:** o personagem chega ao pátio ao nível do solo, contorna a lateral leste do galpão até a escada metálica, sobe os lances em espiral até o patamar superior e atravessa a passarela com guarda-corpos até o portal central. A espiral é interpretação geométrica; a escada metálica externa é a informação do livro. O material da escada deve ser opaco depois que a revelação mágica termina.

## Waterfront externo — correção de continuidade — 27/11/2026

| Elemento | Diagnóstico observado | Correção aplicada | Estado de QA |
|---|---|---|---|
| Doca principal | Plataforma anterior muito larga e espessa; parecia um bloco elevado e escondia a leitura do galpão | Substituída por pequena doca de aproximadamente 10 × 8, com tábuas, longarinas, estacas, cabeços e argolas | Implementado; validar altura e colisão no navegador |
| Barco de papiro | Casco visualmente separado do píer e acima da leitura da superfície da água | Casco rebaixado até a linha d'água; passarela curta liga a embarcação à borda da doca; interação fica no ponto visual do barco | Implementado; validar embarque e escala |
| Williamsburg Bridge | Aproximação alinhada ao mesmo corredor do spawn; apoios cilíndricos pareciam colunas avulsas no enquadramento | Ponte e rampas deslocadas para o corredor `z≈140`; deck maciço com espessura e apoios retangulares de concreto com capitéis | Implementado; validar perspectiva completa |
| Margem do Brooklyn | Abertura do muro de cais muito grande e transição terra/água abrupta | Vão reduzido para a doca; enrocamento de pedra instanciado nos trechos laterais | Implementado; verificar se rochas, água e píer se encontram sem clipping |
| East River | Ondulações limitadas à área próxima da margem; restante do rio parecia plano | Ripples distribuídas pela superfície em uma única `InstancedMesh` | Implementado; medir desempenho mobile |
| Cidade e waterfront | Fábricas e píeres ocupavam a linha da nova aproximação | Alguns galpões, píeres secundários e guindaste foram reposicionados para liberar o corredor e manter o tecido industrial nos dois lados | Implementado; QA visual pendente |

**Critério asset-first:** a busca no GitHub não encontrou um asset de dock/píer que correspondesse à pequena doca do romance, nem uma rampa/ponte modular que pudesse ser colocada na escala do projeto sem perder controle de posição e seção transversal. Os modelos CC0 do Chrysler Building e Empire State Building continuam como marcos distantes de Manhattan. A doca, o enrocamento e os apoios são geometria própria, em vez de substituir a cena por assets genéricos.

- [x] Reduzir o píer e reconstruir sua superfície com tábuas individuais.
- [x] Alinhar barco, passarela de embarque e doca.
- [x] Mover o corredor da ponte para longe do spawn.
- [x] Dar espessura ao deck da aproximação e tornar os apoios estruturais legíveis.
- [x] Estreitar o vão da contenção e integrar pedras de enrocamento.
- [x] Distribuir ondulações por toda a superfície do rio.
- [ ] Verificar em navegador a continuidade visual do enquadramento de chegada em 360°.
- [ ] Testar colisão/embarque e FPS no celular.

## Skyline e fundo urbano — pesquisa asset-first — 27/11/2026

| Candidato / elemento | Fonte e licença | Decisão |
|---|---|---|
| Edifícios industriais e torres d'água | Kenney City Kit Industrial 2.0, CC0-1.0; 20 silhuetas de edifícios, 3 containers e uma torre d'água | Referência de tipologia para depósitos, galpões e rooftops; não domina a cena porque as silhuetas do pack são repetitivas e têm leitura low-poly em primeiro plano |
| Edifício residencial nova-iorquino pré-guerra | achrefelouafi/ProceduralBuildingsThreeJS, MIT; modelo NYC baseado em Blender Geometry Nodes, kit GLB, texturas e gerador TypeScript | Estudado como referência de fachada, cornijas, ACs, balcões e lojas; não importado como runtime porque depende de avaliador próprio de geometry nodes, shader graphs e assets adicionais |
| Chrysler Building e Empire State Building | alexwohlbruck/landmarks, CC0-1.0; GLBs já presentes no projeto | Mantidos como marcos 3D reais do skyline; reposicionados para o horizonte que aparece a partir da doca |
| Faixa de galpões, lofts e edifícios de transição | Geometria original em waterfront-environment.js | Construção instanciada com fachadas de tijolo, janelas, cornijas, lojas, escadas de incêndio, caixas d'água, chaminés e torres de vidro/calcário; cria três profundidades urbanas |
| Céu e nuvens | Gradiente e textura procedural original em CanvasTexture/Three.js | Abóbada atmosférica em gradiente, nuvens altas difusas, menor densidade de névoa; sem fotografia de céu ou imagem externa embutida |

**Base visual/histórica:** NYC DCP Greenpoint-Williamsburg descreve a mistura histórica de grandes fábricas, refinarias, estaleiros e moradias próximas. O estudo municipal de recursos visuais identifica o East River, os dois waterfronts, a Williamsburg Bridge e o skyline de Manhattan como um conjunto de vistas da área. Essa documentação orienta a sequência de profundidade, mas não determina a posição métrica exata das novas quadras.

- [x] Alinhar uma faixa de galpões ao eixo visual inicial da doca.
- [x] Acrescentar camada intermediária de lofts e edifícios residenciais.
- [x] Acrescentar skyline de alta verticalidade no horizonte distante.
- [x] Reposicionar os marcos CC0 já importados para o novo campo visual.
- [x] Adicionar gradiente de céu e nuvens suaves sem depender de imagens externas.
- [x] Reduzir a névoa para preservar a leitura da cidade ao longe.
- [ ] Validar a composição em 360° e o desempenho em mobile.

## Quarto de Carter — asset-first — 27/11/2026

| Elemento | Fonte / licença / decisão | Integração |
|---|---|---|
| Cama king-size | Tevy Double Bed v1, CC0-1.0, GLB | LOD1 desktop / LOD2 mobile; fallback local |
| Criado-mudo | Tevy Nightstand v2, CC0-1.0, GLB | LOD1 / LOD2; fallback local |
| TV e console | Tevy TV Stand v2, CC0-1.0, GLB | Tela separada recebe canvas interativo; fallback local |
| Computador | Tevy Office Desk v2, CC0-1.0, GLB | Monitor, teclado, mouse e luminária; fallback local |
| Kitchenette | Tevy Kitchen Sink Base Unit v1 e Drawers v1, CC0-1.0 | Módulos independentes; lanches com rótulos próprios |
| Geladeira | Innerscene Undercounter Fridge, CC0, GLB 452 KB, 0,598 × 0,548 × 0,820 m | URL direta tentada; CORS não validado; fallback proporcional |
| Banheiro | Tevy Bathroom Vanity v1, Bathtub v1 e Toilet v1, CC0-1.0 | Assets GLB com versão fixada e fallbacks locais |
| Sistema de som | Duas instâncias Tevy Bookshelf Speaker v1, CC0-1.0 | LOD1 / LOD2; fallback local |
| Apoio de cabeça | Geometria original em src/bedroom.js; referência histórica GEM #270 | Marfim, leões, Shu central e apoio curvo; Shu é interpretação histórica, não texto explícito do romance |
| Portas panorâmicas e deck | Geometria original Three.js | Portas deslizantes, estado trancado/aberto, deck com vidro e bronze |
| Porta de comunicação com Sadie | Geometria original Three.js | Fechada e trancada, com inspeção contextual |

### Carregamento

Tevy fornece GLB com geometria Meshopt e texturas KTX2. O carregador usa GLTFLoader, MeshoptDecoder e KTX2Loader do Three.js r165.0. URLs Tevy permanecem fixados em v1/v2 e usam LOD1 no desktop e LOD2 no mobile. Os modelos permanecem nos provedores originais; não foram copiados para o repositório. Fallbacks locais evitam que a suíte dependa de um único download remoto.

### QA

- [x] Remover blockout residencial e ligar src/bedroom.js.
- [x] Remover a parede central que obstruía a visão.
- [x] Acrescentar teto e acabamento arquitetônico.
- [x] Colocar o apoio de cabeça no colchão.
- [x] Adicionar kitchenette, tecnologia, som, banheiro e deck.
- [x] Adicionar interações compartilhadas desktop/mobile.
- [ ] Inspecionar GLBs, materiais e encaixes em navegador desktop.
- [ ] Inspecionar paridade, toque, FPS e carregamento em celular paisagem.
- [ ] Confirmar a vista para Manhattan e a Estátua da Liberdade no enquadramento real.


**Complemento do sistema de som:** src/bedroom.js também constrói um amplificador/receiver estéreo procedural original, com painel, controles e LED, posicionado entre as caixas acústicas. É uma solução de produção para representar o aparelho de som descrito no livro; não foi importado um asset externo de amplificador.
