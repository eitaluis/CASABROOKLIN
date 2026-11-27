# Biblioteca subterrânea — estudo de assets e implementação

Atualizado em 27/11/2026. Este documento separa o que está descrito no romance, o que é interpretação de produção e o que foi efetivamente integrado ao runtime.

## 1. Hierarquia de fontes

**Fonte canônica principal:** *The Red Pyramid*, de Rick Riordan. A passagem da biblioteca descreve uma câmara circular escavada na rocha, uma descida de três andares, paredes/piso/teto pintados com figuras multicoloridas, Nut e Geb, cavidades redondas em padrão de colmeia com cilindros plásticos de papiro, quatro estatuetas humanas de cerâmica e uma mesa comprida de pedra com a bolsa de Julius.

**Fontes visuais oficiais complementares:**
- [Red Pyramid: The Graphic Novel — Disney Books](https://books.disney.com/book/red-pyramid-the-graphic-novel/), arte de Orpheus Collar.
- [James Firnhaber — ilustrações de The Brooklyn House Magician's Manual](https://www.jamesfirnhaber.com/black-and-white), incluindo estudos de Nut e Geb.
- [The Metropolitan Museum of Art — Open Access](https://www.metmuseum.org/about-the-met/policies-and-documents/open-access), referência de pintura e relevo em câmaras funerárias egípcias. As imagens Open Access identificadas na pesquisa são de domínio público/CC0; verificar a ficha individual antes de reutilizar qualquer imagem.

Não foi localizada uma prancha oficial pública que mostre a biblioteca inteira com planta e todos os objetos. A Graphic Novel e o Manual são referências oficiais para a linguagem visual, mas não substituem a passagem do romance na definição da arquitetura.

## 2. Canônico versus decisão de produção

| Elemento | Informação canônica | Decisão/limite desta reconstrução |
|---|---|---|
| Câmara | Circular, escavada na rocha e profunda como um poço | Raio e dimensões em metros são escala de jogo |
| Descida | Escada desce três andares | O livro não fixa que seja uma escada helicoidal; a forma atual continua sendo interpretação |
| Parede, piso e teto | Pintura multicolorida com deuses, pessoas e monstros | A organização em três registros de parede é composição visual |
| Nut | Céu azul estrelado e figura feminina celeste | A forma final da figura de Nut ainda está pendente |
| Geb | Corpo masculino verde/marrom, com paisagem, cidades e rio | A pintura figurativa completa de Geb ainda está pendente |
| Nichos | Cavidades redondas em padrão de colmeia | 48 unidades (16 × 3) são uma decisão de distribuição; o romance não determina essa contagem |
| Recipientes | Cilindros de plástico com papiro dentro, como tubos de transporte pneumático; inscrições em hieróglifos e inglês | A cápsula foi modelada sob medida porque não foi encontrado um modelo gratuito que corresponda à descrição |
| Estatuetas | Quatro figuras humanas de cerâmica, aproximadamente metade da altura humana, em pedestais; kilt, sandálias, cabelo preto angular e olhos com kohl; objetos distintos | A posição nos quatro pontos cardeais segue o texto; escala exata e pose são decisões de jogo |
| Mesa | Mesa comprida de pedra com a bolsa de trabalho de Julius | A silhueta dos apoios e a forma da bolsa são interpretação, sem inventar conteúdo adicional |
| Candelabros, colunas e estantes | Não são elementos centrais descritos para esta câmara | Elementos genéricos anteriores foram ocultados; não devem voltar como preenchimento automático |

## 3. Matriz asset-first por componente

### Parede escavada, pintura e nichos

**Referências:** paredes de calcário pintado com nichos arquitetônicos do acervo do Metropolitan Museum (incluindo a capela de Kaemsenu e a câmara de Perneb). Elas servem para a relação entre pintura, baixo-relevo, pigmento mineral e cavidade integrada à alvenaria; não são um modelo 3D pronto da biblioteca.

**Runtime:** painéis curvos segmentados, com abertura circular verdadeira na geometria, espessura, bisel e um túnel interno escuro. A parede rochosa original permanece como substrato entre os painéis. Cada painel recebe uma cena pictórica original em atlas determinístico, com figuras de perfil, pigmentos terrosos, azul, verde e ocre. O atlas é desenhado no runtime para não depender de uma imagem protegida de terceiros.

**Material:** mapa de calcário já carregado pelo projeto, roughness alta. A textura PBR [Sandstone Blocks 04 — Poly Haven](https://polyhaven.com/a/sandstone_blocks_04) (CC0) é uma alternativa documentada para uma próxima revisão do material rochoso; ainda não foi adicionada como arquivo independente nesta alteração.

### Cápsulas de papiro

**Referência de forma:** o texto descreve cilindros plásticos do tipo tubo de transporte pneumático. O kit [Modular Pipes Plastic 01 — Poly Haven](https://polyhaven.com/a/modular_pipes_plastic_01) (CC0) foi avaliado como doador de componentes, mas é um conjunto de tubulações industriais, não uma cápsula acabada. O asset [Plastic Container — Poly Haven](https://polyhaven.com/a/plastic_container) foi rejeitado porque é uma caixa retangular com tampa.

**Runtime:** cápsula original feita com corpo de polímero translúcido, tampas, anéis, etiqueta com hieróglifos e texto em inglês e um papiro enrolado visível no interior. A interação está ligada às 16 cápsulas do nível inferior: abrir revela parte do papiro e desloca a tampa; fechar guarda novamente o documento.

**Limitação registrada:** não foi encontrado um modelo gratuito pronto que reproduza a cápsula pneumática da descrição. Não apresentar tubulação industrial genérica ou recipiente retangular como se fosse o objeto canônico.

### Papiro

**Referência complementar:** [Ancient Scroll Map — Sketchfab](https://sketchfab.com/3d-models/ancient-scroll-map-1fb49d10ada34e889704348b77e350b5), por Evan16, CC BY. É uma referência de rolo parcialmente aberto, não o recipiente de armazenamento.

**Runtime:** rolo de papel inserido fisicamente no interior da cápsula e folha parcial que aparece ao interagir. O modelo externo não foi importado, pois a cápsula precisava ser construída em conjunto com o papiro.

### Quatro estatuetas de cerâmica

**Referências avaliadas:** scans de shabtis/ushabtis ajudam a observar cerâmica, esmalte, inscrições e pátina, mas as figuras mumiformes com braços cruzados não correspondem às quatro figuras humanas descritas no romance. Por isso, esses scans foram rejeitados como modelos finais. Não foi encontrado um asset gratuito que combine corpo humano, kilt, sandálias, corte de cabelo angular e kohl.

**Runtime:** quatro esculturas humanas originais em cerâmica esmaltada, com pedestal, pernas, sandálias, kilt, torso, cabeça, franja preta angular e delineado nos olhos. Cada uma tem objeto próprio:
1. Estilete e rolo de papiro.
2. Caixa pequena.
3. Cajado curto terminado em gancho.
4. Mãos vazias.

Não reutilizar os modelos mumiformes anteriores como substitutos destas estatuetas.

### Mesa e bolsa de Julius Kane

**Referência avaliada:** [Stone Altar — Sketchfab](https://sketchfab.com/3d-models/stone-altar-3d4f2edb18e4424cabb41b60aa160cb5), por TheoClarke, CC BY, como referência de desgaste e volume pétreo. Um scan de mesa com milhões de triângulos foi rejeitado para runtime por custo excessivo e por não corresponder exatamente à mesa longa descrita.

**Runtime:** tampo comprido de calcário com dois apoios maciços, filetes entalhados e uma bolsa de couro com alça e fivela. A forma da bolsa é interpretativa; o elemento canônico é sua presença sobre a mesa.

### Nut, Geb e escada

- [James Firnhaber — estudos de Nut e Geb](https://www.jamesfirnhaber.com/black-and-white) são as referências oficiais prioritárias para a forma das divindades. A textura atual de Nut e o mapa de Geb continuam provisórios e serão refeitos num passe próprio, incluindo a figura feminina de Nut e o corpo masculino de Geb.
- A escada helicoidal atual permanece como interpretação de gameplay. A referência [Roman Marble Stairs — Sketchfab](https://sketchfab.com/3d-models/roman-marble-stairs-3a26ffc0044a4ca4a41d244f2f528a5a), CC BY, foi avaliada como estudo de degraus de pedra, mas não representa por si só uma solução canônica para a descida de três andares.

## 4. O que foi integrado em 27/11/2026

- Painéis murais curvos com recortes circulares geométricos e profundidade real nos nichos.
- 48 nichos e 48 cápsulas plásticas translúcidas com papiro interno; 16 cápsulas inferiores com interação de abrir/fechar.
- Quatro estatuetas humanas de cerâmica substituindo as figuras mumiformes antigas; os objetos individuais agora diferem entre si.
- Mesa central de pedra substituindo a mesa de madeira, com bolsa de trabalho de Julius Kane.
- Remoção da colisão invisível das antigas estantes e inclusão de colisores para a parede circular, a mesa e as estatuetas.
- Módulo único src/library.js chamado pelo src/main.js; a mesma geometria e interação são usadas no desktop e no mobile.
- Atlas de pintura mural e etiqueta de cápsula compartilhados entre todos os painéis/recipientes, evitando clonar a mesma textura por objeto e reduzindo o uso de memória de GPU no mobile.

## 5. Validação ainda pendente

- [ ] Abrir a biblioteca no navegador desktop e conferir a orientação das normais, a leitura dos recortes, a profundidade das cápsulas e os encontros entre painéis.
- [ ] Repetir em celular em paisagem, verificando FPS, memória e transparência dos tubos.
- [ ] Confirmar que Carter alcança e interage com as 16 cápsulas inferiores sem atravessar a parede.
- [ ] Conferir se a mesa e as estatuetas não bloqueiam a circulação ao redor da escada.
- [ ] Refazer Nut e Geb com figuras humanas legíveis, não apenas padrões abstratos.
- [ ] Refinar a escada de três andares após teste de travessia e comparação de escala.

**Status:** implementação estrutural registrada; não significa aprovação visual. A inspeção real em desktop e mobile continua obrigatória.


## Atualização aprovada e integrada — biblioteca monumental (27/11/2026)

Esta seção substitui os números e o estado de implementação da primeira versão registrados acima. O estudo anterior documenta a pesquisa; a seção atual registra o build aprovado.

### Escala final do espaço

- **Diâmetro interno aproximado:** 31 m (raio de 15,5 m).
- **Altura total aproximada:** 15,9 m do piso ao ponto mais alto da abóbada. A parede cilíndrica sobe 10,4 m a partir do piso; a cúpula elíptica de Nut acrescenta aproximadamente 5,5 m.
- **Níveis:** a descida foi organizada em três lances curvos; a escadaria é uma interpretação de level design da descida de três andares, cuja forma exata não é fixada no romance.

### Parede pintada, escrita e cavidades

- O atlas mural original é gerado no runtime como uma textura única de 4096 × 2048, dividida em 24 × 8 cenas de pintura distintas, com figuras de perfil, criaturas e variação de pigmentos.
- As composições de sinais egípcios variam em sequência, orientação, densidade e cartuchos. A tipografia usa Noto Sans Egyptian Hieroglyphs (SIL OFL 1.1). As sequências são **ornamentação interpretativa**, não traduções ou transcrições literais de frases do romance.
- A parede usa um alpha map alinhado às UVs cilíndricas para abrir os furos visuais; cada cavidade tem túnel e fundo recuado, aro e uma cápsula pneumática com papiro.
- **4.800 cavidades/cápsulas** no total: 30 faixas verticais × 160 posições angulares, alternadas como colmeia. A abertura tem aproximadamente 34 cm de diâmetro no espaço do jogo; quantidade e dimensões são decisões de escala, não valores canônicos.
- 20 cápsulas da faixa inferior têm pontos de interação para abrir/fechar e revelar o papiro. As demais compõem visualmente o arquivo e não geram milhares de listeners separados.
- As peças repetidas usam InstancedMesh, geometrias e materiais compartilhados; atlas e mapas alpha são compartilhados para limitar draw calls e duplicação de texturas.

### Escadaria física

- A antiga hélice estreita foi removida.
- A nova escada tem **90 degraus largos**, divididos em três lances curvos de 30 degraus, dois patamares intermediários e áreas de entrada/saída.
- O caminho das alturas é exportado de src/library.js e consumido pelo solver walkableCurves do controlador em src/third-person.js. A geometria visível e a superfície caminhável derivam dos mesmos pontos.
- Corrimãos curvos e balaústres acompanham a trajetória. A escada é feita com geometria original Three.js; os modelos Tevy avaliados são referências de forma, não arquivos importados.

### Estatuetas e pedidos dos servos

As quatro estatuetas humanas de cerâmica permanecem diferentes dos guerreiros mumiformes da Sala de Treinamento. As tarefas jogáveis seguem dois acontecimentos específicos do romance:

1. **Figura de mãos vazias:** ao interagir, desperta, vai até a área de armazenamento, procura a cápsula com a versão em inglês e retorna; a folha recuperada aparece sobre a mesa.
2. **Figura com cajado em gancho:** ao interagir, sai do pedestal e retorna com uma representação simplificada da Paleta de Narmer.

A movimentação atual é **procedural** (deslocamento, oscilação e inclinação), não um clip de caminhada humanoide retargetado. O pacote KinemIQ CC0 (35 clips GLB/FBX num esqueleto de 66 ossos) foi avaliado, mas não importado: as estatuetas atuais são geometrias articuladas por componentes, sem skin weights/skeleton compatível. Para usar o pacote será necessário rigar ou reconstruir as estatuetas como malha skinned e então testar o retarget; não se deve fingir que o pack já está no runtime.

### Mesa de trabalho de Julius Kane

A mesa longa de pedra recebeu:
- bolsa de Julius com aba que abre/fecha;
- paleta de escriba e dois bolos de pigmento (preto e vermelho);
- três pincéis/estiletes de junco;
- pequeno recipiente de tinta;
- papiro aberto com linhas de escrita, dois rolos, cordão e pano de linho;
- apresentação da folha em inglês e da Paleta de Narmer quando os servos retornam.

A paleta, os pincéis e os demais acessórios são geometrias próprias inspiradas em objetos históricos; nenhum scan de museu foi copiado para o runtime.

### Geb e Nut — estado visual

As superfícies de piso e abóbada foram redimensionadas para a nova câmara e continuam compartilhadas entre desktop e mobile. **As pinturas figurativas finais de Geb e Nut não foram geradas nem integradas nesta etapa**, conforme a decisão explícita de deixar a geração de imagem para depois. As texturas cartográficas/estreladas existentes são provisórias e não representam o acabamento final aprovado.

### Assets, licenças e decisões de importação

- **Runtime criado para esta etapa:** geometria, atlas mural, texturas, alpha map, instâncias, animações de tarefa e mesa de trabalho são originais do projeto em src/library.js.
- **Materiais de pedra:** mapas PBR locais previamente registados, com fontes CC0 no manifest.
- **Hieróglifos:** Noto Sans Egyptian Hieroglyphs — SIL Open Font License 1.1; já presente no carregamento tipográfico do projeto, usada nas composições murais.
- **Escadas Tevy Dungeon Stone Stairs e Vault Stairs:** modelos GLB CC0 aprovados como referência visual/técnica, não importados porque a escada da biblioteca requer trajetória curva e solver próprios.
- **KinemIQ Free Game Animations:** pack CC0 aprovado para avaliação, mas não importado nesta etapa por incompatibilidade direta com as figuras procedurais sem rig.
- **Paleta de Narmer Sketchfab:** referência CC BY-NC-SA apenas; não integrada. A peça jogável é uma silhueta simplificada original.
- **Paleta de escriba do The Met:** referência histórica/Open Access; não foi importado um modelo 3D.

### QA e limites conhecidos

- [x] Sintaxe verificada nos módulos library.js, world.js, third-person.js, interior-details.js e main.js.
- [x] JSON do manifest verificado após a atualização.
- [x] Integração do caminho de escada, do ciclo de atualização das tarefas e da interação compartilhada verificada estaticamente.
- [ ] Testar a subida e descida reais de cada lance, os patamares e a colisão com Carter no navegador desktop.
- [ ] Repetir o teste em celular em paisagem, medir FPS/memória e observar transparência das cápsulas.
- [ ] Conferir visualmente o alinhamento das aberturas alpha, dos túneis e das cápsulas, além da leitura dos novos textos murais.
- [ ] Ajustar a câmera e circulação caso a mesa, as estatuetas ou a escada causem obstruções.
- [ ] Criar e integrar as pinturas finais figurativas de Geb e Nut em uma etapa posterior.

**Status real:** implementação no repositório + validação estática concluídas; QA em navegador e aprovação visual ainda pendentes.
