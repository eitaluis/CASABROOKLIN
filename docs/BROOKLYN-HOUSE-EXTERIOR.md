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

**Williamsburg Bridge:** a ponte cruza o East River acima do corredor do barco. O texto diz que a embarcação passa sob a ponte e depois para junto à doca no lado do Brooklyn; não descreve a ponte como cobertura sobre a mansão. A estrutura foi agrupada e afastada da projeção do telhado, permanecendo alinhada sobre a água. O barco fica sob o vão, próximo ao extremo do cais.

**QA ainda necessário:** validar ângulo de aproximação, escala aparente, passagem do barco sob o tabuleiro, distância visual entre ponte e armazém, subida da escada e entrada no portal nas versões desktop e mobile.
