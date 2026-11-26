# Brooklyn House — exterior e sequência de chegada

Atualizado em 26/11/2026.

## 1. Localização correta

A Brooklyn House fica no lado do Brooklyn do East River. A Williamsburg Bridge cruza o rio até Manhattan. Manhattan aparece na margem oposta e no horizonte; não é o endereço da casa nem uma zona jogável nesta etapa.

A chegada do capítulo 5 de *A Pirâmide Vermelha* segue esta sequência: barco egípcio de fibras vegetais → passagem sob a Williamsburg Bridge → pequena doca no Brooklyn → pátio industrial com sucata e equipamento de obra → armazém de tijolos com grafites e janelas bloqueadas → mansão de cinco pavimentos sobre o telhado → escada metálica contornando a lateral → portal de madeira escura que sobe por gesto.

O barco é descrito como feito de fibras trançadas, com pequenas tochas na proa, leme/remo de direção e pequena cabana de esteiras. O piloto não fica visível.

## 2. Cânone, referência histórica e interpretação

**Canônico:** East River, Williamsburg Bridge, doca no lado do Brooklyn, terreno industrial com sucata e equipamentos de obra, armazém grafitado com janelas bloqueadas, mansão de cinco pavimentos no telhado, blocos de calcário, caixilhos de aço com hieróglifos, escada metálica que contorna a lateral e porta sem maçaneta/fechadura que sobe quando Carter faz um gesto.

**Referência histórica:** forma da Williamsburg Bridge, torres, treliças, cabos de suspensão, cais e armazéns de Williamsburg. As fotografias servem para proporção e atmosfera; não são usadas como texturas.

**Interpretação:** planta exata da doca, distância e desenho preciso do skyline, dimensões exatas do canal, detalhes não descritos do pátio e formato exato do barco. A escada em caracol é uma solução do projeto: o romance diz que a escada contorna a lateral do armazém, mas não determina que a planta seja helicoidal.

## 3. Referências visuais e dimensionais

- NYC DOT — fotografia oficial da Williamsburg Bridge sobre o East River: https://www.nyc.gov/html/dot/images/infrastructure/williamsburg-bridge.jpg. Referência direta para silhueta das torres, cabos, tabuleiro e distância visual entre as margens; não foi importada como textura.
- NYC DOT — Williamsburg Bridge: https://www.nyc.gov/html/dot/html/infrastructure/williamsburg-bridge.shtml. Medidas oficiais de referência: comprimento total 7.308 ft, vão principal 1.600 ft, clearance central 135 ft, torres de 310 ft e quatro cabos principais.
- NYC Department of Records and Information Services — fotografias históricas da ponte: https://www.archives.nyc/blog/tag/Williamsburg%2BBridge.
- Poly Haven Red Brick (CC0): https://polyhaven.com/a/red_brick. Referência candidata para o futuro passe PBR do armazém; os mapas ainda não estão integrados no runtime.
- Poly Haven Brick Wall 001 (CC0): https://polyhaven.com/a/brick_wall_001. Alternativa avaliada, não integrada.
- Poly Haven Broken Brick Wall (CC0): https://polyhaven.com/a/broken_brick_wall. Referência para danos localizados, não integrada.
- Disney Books — edição em quadrinhos de *The Red Pyramid*: https://books.disney.com/book/the-red-pyramid-the-graphic-novel/. A edição ilustrada foi confirmada, mas não foi encontrado um painel exterior público e verificável da Brooklyn House; o romance permanece a fonte primária desta sequência.

Kits de cidade low-poly foram rejeitados para peças hero próximas porque conflitam com o acabamento do restante do projeto. Um galpão moderno de chapa metálica também foi rejeitado porque não corresponde ao armazém de tijolos grafitado descrito no livro. Nenhum modelo de ponte/galpão foi escolhido como asset hero; essas geometrias são originais.

## 4. Fichas de produção dos elementos externos

| Elemento | Forma / escala | Material e luz | Interação / desempenho | Proveniência / estado |
|---|---|---|---|---|
| East River | Canal ampliado para criar distância entre as margens | Azul-ardósia, reflexo discreto, ondulações instanciadas e neblina | Fundo visual; não caminhável | Geometria/material originais; QA pendente |
| Williamsburg Bridge | Ponte suspensa longa, torres, quatro linhas de cabos, pendurais, treliças e tabuleiro | Aço escuro, metalness alto, roughness médio | Landmark distante; sem acesso nesta etapa | Geometria original calibrada por dados da NYC DOT; QA pendente |
| Manhattan distante | Cais baixo, armazéns e skyline em várias camadas | Cinza-azulado, janelas instanciadas e atmosfera | Apenas referência visual; não é área jogável | Geometria original interpretativa; QA mobile pendente |
| Barco de papiro | Casco estreito, trançados, banco, cobertura de esteiras, leme/remo e tochas na proa | Textura procedural de fibra vegetal, madeira escura e luz emissiva | Inspeção por proximidade; não embarcável nesta etapa | Geometria original a partir de atributos canônicos; implementado |
| Armazém industrial | Tijolo, portão de carga, janelas bloqueadas, pichações, tubulações, marquise, sucata, tambores e pallets | Tijolo, metal envelhecido, concreto e madeira | Colisores principais existentes | Geometria original; material procedural atual; PBR CC0 é etapa futura |
| Escada metálica | 78 degraus, raio aproximado de 2,05 m e subida até o patamar | Aço escuro e corrimãos | Cálculo de altura helicoidal conectado ao controlador; QA de percurso pendente | Geometria própria; forma exata interpretativa |
| Mansão sobre o armazém | Cinco pavimentos | Calcário, caixilhos de aço, hieróglifos e janelas escuras | Fachada e portal preservam sequência de chegada | Geometria original existente |
| Portal de madeira | Folha larga sem puxador, fechadura ou dobradiças aparentes; vão livre atrás da folha | Madeira escura com veio, ombreiras e lintel de calcário | E / INTERAGIR alterna subida e descida | Geometria/animação originais; QA de travessia pendente |
| Minimap | Brooklyn, doca, East River, ponte e Manhattan | Cartografia escura | Indicador acompanha Carter | Canvas original; mesmo sistema desktop/mobile |

## 5. Implementação no repositório

- `src/exterior.js`: rio ampliado, Williamsburg Bridge, margem distante de Manhattan, skyline, barco de papiro e interação da porta.
- `src/world.js`: armazém, mansão, doca, escada, passarela e abertura física do portal.
- `src/third-person.js`: interpolação de altura ao caminhar pela escada helicoidal.
- `src/main.js`: integração da cena exterior, superfícies caminháveis, minimap e atualização do portal/água.
- `index.html`: introdução com a sequência de chegada.

A geometria, o personagem e os controladores são compartilhados entre desktop e mobile. O Carter não foi redesenhado nesta etapa.

## 6. Validação ainda pendente

- [ ] Percorrer doca → base da escada → patamar → passarela → portal → Grande Salão.
- [ ] Subir e descer todas as voltas sem salto de altura, clipping ou queda.
- [ ] Testar abertura, fechamento e passagem pelo portal com E no desktop e INTERAGIR no mobile.
- [ ] Conferir escala da ponte, distância do skyline, neblina e câmera baixa/alta.
- [ ] Medir FPS, memória, temperatura e estabilidade em celular paisagem.
- [ ] Conferir o custo dos prédios e janelas instanciados no perfil mobile.
- [ ] Integrar mapas PBR locais de tijolo CC0 apenas depois de verificar licença, resolução, UV scale e color/normal/roughness.
- [ ] Não marcar o exterior como aprovado visualmente antes da inspeção em navegador real.


## Regra canônica de percepção exterior — 26/11/2026

A primeira leitura do local deve ser apenas um galpão/fábrica antigo na margem do Brooklyn: graffiti pesado, janelas fechadas com tábuas, pátio de sucata e equipamentos de construção. Carter e Sadie chegam pelo East River, passam sob a Williamsburg Bridge e param junto a uma pequena doca. Amos pede que olhem novamente para o telhado; então Carter percebe a mansão de cinco andares sobre o armazém. O texto também descreve a dificuldade de mantê-la visível quando se desvia o olhar. Referência: *The Red Pyramid*, capítulo 5, chegada ao Twenty-first Nome.

**Regra para os ambientes em desenvolvimento:** Grande Salão, biblioteca subterrânea, sala de treinamento, quartos e demais anexos são espaços mágicos internos. Nenhum deles ganha torre, ala, volume, claraboia ou anexo exterior para anunciar sua existência. A fachada externa permanece uma única silhueta de galpão antigo na percepção comum. A mansão de calcário sobre o telhado e a escada metálica só se tornam perceptíveis após o comando de foco mágico na doca.

**Implementação:** fachada, porta e escada são mantidas no mundo como geometrias de oclusão sem escrita de cor, de modo que os ambientes internos continuem invisíveis do lado de fora. O ponto da doca ativa a troca gradual para os materiais reais e uma breve câmera de descoberta do telhado. A revelação é uma mudança de percepção, não uma animação de construção.

**Escada:** reposicionada para a lateral leste do armazém, fora de sua caixa de colisão. O último lance encontra um patamar e a passarela segue até o portal frontal. A escada e o caminho continuam invisíveis até a percepção mágica.

**Williamsburg Bridge:** a ponte cruza o East River acima do corredor de navegação. Carter e Sadie passam sob ela e depois atracam na pequena doca do lado do Brooklyn; o texto não a coloca sobre o telhado da casa. A estrutura foi afastada da projeção do telhado e conectada às margens por rampas. O barco agora fica ao lado do cais, depois de passar pelo vão.

**QA ainda necessário:** validar ângulo de aproximação, escala aparente, passagem do barco sob o tabuleiro, distância visual entre ponte e armazém, subida da escada e entrada no portal nas versões desktop e mobile.


## Regra reforçada: galpão externo, interiores mágicos

A silhueta externa deve permanecer a de um único galpão/fábrica industrial antigo. Nenhum cômodo construído dentro da Brooklyn House pode criar um volume visível do lado de fora: sem alas laterais, torres, claraboias, telhados extras, janelas novas ou anexos denunciando a biblioteca, o Grande Salão, os quartos ou a sala de treinamento.

A mansão de cinco pavimentos sobre o telhado é uma exceção narrativa, mas apenas depois do comando de percepção de Amos. Antes dele, a leitura visual é somente o galpão. Depois dele, a mansão e a escada lateral tornam-se perceptíveis. Os ambientes internos continuam ocultos mesmo após essa revelação e só aparecem quando o jogador cruza o portal.

**Implementação:** `mansionRevealGroup` contém apenas a camada externa mágica (mansão, escada e efeitos de revelação). `magicalInteriorGroup` reúne a arquitetura interna original, a biblioteca, o mobiliário, os ambientes laterais e as salas modulares, inclusive carregamentos assíncronos. O grupo começa invisível na doca, torna-se visível ao entrar em `hall`, `library`, `bedroom` ou `training`, e volta a ficar invisível ao sair para `dock`. O minimapa segue a mesma regra e não entrega a planta interna antes da entrada.

## Williamsburg Bridge — leitura correta da relação espacial

O capítulo 5 descreve Carter e Sadie navegando sob a Williamsburg Bridge e, em seguida, parando numa pequena doca do lado do Brooklyn. O texto não afirma que a ponte passa sobre o telhado da Brooklyn House. Portanto, a ponte deve atravessar o East River acima do canal de navegação, e a doca/armazém devem permanecer na margem do Brooklyn, fora da projeção do tabuleiro.

No layout do projeto, o tabuleiro permanece centrado em z=58, com largura de 25 unidades (z=45,5..70,5); o telhado da mansão ocupa aproximadamente z=-12,5..11,5. A ponte cruza a água e se conecta à terra por rampas longas, sem avançar sobre a projeção da casa. O barco fica atracado na lateral do píer, em x≈33,2, z≈29, após passar pelo vão. A sequência visual é: barco navega sob a Williamsburg Bridge → segue até a pequena doca do Brooklyn → fica amarrado ao píer → Carter vê o galpão → Amos chama atenção para o telhado.

**Cânone versus interpretação:** a passagem sob a ponte e a doca no Brooklyn são canônicas; a distância exata entre ponte, doca e armazém é uma decisão de composição e deve preservar essa relação sem inventar uma ponte sobre a casa.

## Waterfront contínuo — revisão asset-first — 26/11/2026

O entorno passa a ser um cenário contínuo, e não uma ponte isolada sobre um plano de água: terreno urbano no Brooklyn, muro de cais interrompido no acesso ao píer principal, píeres de carga laterais, East River em largura constante, margem de Manhattan com galpões, ruas, fábricas de tijolo e skyline em camadas. A Williamsburg Bridge tem um tabuleiro compartilhado: as faixas rodoviárias ficam nas laterais e os trilhos do metrô correm no eixo central, entre elas; rampas de aproximação conectam a estrutura às duas margens. O corredor da rampa fica ao norte do galpão, afastado do telhado e do portal.

**Barco e chegada:** a posição visual e a interação agora coincidem: barco em x≈33,2, z≈29, ao lado do pequeno cais. O casco é formado por feixes arredondados de papiro, amarrações, esteiras e uma cabana arqueada contínua. A pequena figura na popa usa casaco e chapéu semelhantes aos de Amos, com o rosto quase oculto; não há vela nem motor. O romance fornece fibras vegetais trançadas, cabana de esteiras, tochas na proa e timoneiro; a geometria exata do casco e do abrigo é uma reconstrução visual.

**Escada e entrada:** a escada metálica lateral termina em um patamar superior reforçado. A passarela metálica com guarda-corpos segue do patamar até o portal central. O acesso inferior parte de uma plataforma no pátio; o jogador sobe pela lateral do galpão e atravessa a passarela até a porta que desliza para cima. Os degraus e corrimãos usam material opaco; o fade de revelação é transitório, não transparência permanente.

**Pesquisa de assets no GitHub:** a busca incluiu modelos de Williamsburg Bridge, skyline de Manhattan, fábricas/galpões, guindastes, píeres e barcos de papiro. O conjunto de ponte encontrado no repositório Landmarks foi avaliado, mas não substituiu a ponte do jogo: o projeto mantém a estrutura própria, que permite controlar vão, altura, treliça e rampas na escala do East River. Não foi encontrado um barco CC0 que reúna casco de papiro, cabana de esteiras, tochas e timoneiro com a aparência descrita; um barco genérico de madeira ou vela foi rejeitado. Também não foi encontrado um pacote de waterfront industrial que correspondesse ao Brooklyn do romance; cais, muros, fábricas, escadas de incêndio, tanques d'água, guindastes e ruas foram modelados como geometria original.

**Assets importados:** dois marcos distantes do skyline foram obtidos de https://github.com/alexwohlbruck/landmarks, ambos CC0-1.0: Chrysler Building (assets/models/manhattan-chrysler-building.glb) e Empire State Building (assets/models/manhattan-empire-state-building.glb). São usados apenas como silhuetas longínquas de Manhattan, não como edifícios jogáveis. O modelo de Williamsburg Bridge disponível na mesma coleção foi revisado e não foi usado. Os volumes próximos são originais, para evitar que um pacote low-poly genérico determine a aparência da Brooklyn House.

**Referências de contexto urbano:** a [NYC Landmarks Preservation Commission](https://s-media.nyc.gov/agencies/lpc/lp/0163.pdf) descreve o waterfront histórico de Williamsburg como área de docas, estaleiros, fundições, moinhos, refinarias e fábricas. O [plano municipal Greenpoint-Williamsburg](https://www.nyc.gov/assets/planning/download/pdf/plans/greenpoint-williamsburg/greenpointwill.pdf) documenta a relação entre grandes indústrias na orla e moradias nas ruas próximas. As dimensões e a composição de pistas/trilhos da ponte seguem a referência oficial do [NYC DOT](https://www.nyc.gov/html/dot/html/infrastructure/williamsburg-bridge.shtml). A cidade do outro lado é composição interpretativa do jogo; não é descrita em detalhe pelo capítulo.

**QA:** a estrutura comum do mundo é compartilhada entre desktop e mobile. Falta validar visualmente em navegador: ângulos 360°, passagem sob a ponte, leitura das rampas, colisão no cais, desempenho em celular e carregamento real dos dois GLBs.
