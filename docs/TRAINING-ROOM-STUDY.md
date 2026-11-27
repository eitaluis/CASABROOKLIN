# Sala de Treinamento — estudo, reconstrução e interações

Data: 27/11/2026  
Projeto: CASABROOKLIN  
Status: **correção de implantação e cesta integrada no código; inspeção visual e QA em navegador desktop/mobile ainda pendentes**

## 1. Evidência narrativa e grau de certeza

A Brooklyn House é apresentada oficialmente pela Disney como local onde jovens magos aprendem a usar seus poderes. O material complementar *Brooklyn House Magician's Manual* é descrito pela editora como manual de treinamento, com quizzes, histórias e conteúdo sobre divindades, criaturas e o Duat: https://books.disney.com/book/brooklyn-house-magicians-manual/

A descrição detalhada da sala de treinamento foi consultada em referência secundária do universo Kane Chronicles: https://riordan.fandom.com/wiki/Brooklyn_House. Ela descreve a sala no segundo andar, aproximadamente do tamanho de uma quadra de basquete, com piso de madeira, teto abobadado pintado com cenas do Egito Antigo e estátuas de divindades ao longo das paredes. Nas linhas de fundo, estátuas de Rá com cabeça de falcão e discos solares ocos funcionam como cestas. A sequência de aula em *The Throne of Fire* também mostra quatro pequenas estatuetas shabti que se transformam em guerreiros armados; o texto explora diferentes soluções para a prova: um hieróglifo que faz o guerreiro errar e bater na parede e uma bola de basquete arremessada contra a cabeça do shabti.

A página oficial de *The Throne of Fire* também descreve a Brooklyn House como um campo de treinamento para jovens magos: https://books.disney.com/book/the-throne-of-fire/. A mesma referência secundária associa as aulas de Carter ao exercício *Magic Problem-Solving 101*, apelidado pelos alunos de “Whatever Works”, no qual os iniciados precisam enfrentar um guerreiro shabti de barro.

A Disney também lista oficialmente *The Throne of Fire: The Graphic Novel* como parte do universo Kane Chronicles: https://books.disney.com/kane-chronicals/. A busca visual realizada nesta etapa não localizou um painel oficial inequívoco da sala de treinamento. Uma imagem pública identificada como “Great Room” não foi reutilizada como referência da quadra, para evitar confundir dois espaços.

### Elementos a preservar como descrição narrativa

- Sala no segundo andar, com escala de quadra de basquete.
- Piso de madeira.
- Teto abobadado com pinturas do Egito Antigo.
- Estátuas de divindades nas paredes.
- Estátuas de Rá com cabeça de falcão projetando-se das paredes das linhas de fundo, posicionadas cerca de dez pés acima do piso.
- Coroas em forma de disco solar vazadas para funcionar como cestas.
- Espaço usado para basquete e para treinamento dos magos.
- Exercício de resolução de problemas mágicos com guerreiro shabti de barro.

### Decisões interpretativas desta reconstrução

- A localização como ala a oeste do Grande Salão, o portal e a passarela de conexão são escolhas de level design para a planta 3D atual, não uma planta oficial publicada.
- O programa exato dos afrescos, nervuras de bronze, frisos, arandelas e acabamento de pedra foi criado para completar a arquitetura sem afirmar que cada motivo é descrito no romance.
- A seleção de bustos — Anúbis, Sekhmet, Hórus, Ísis e Bastet — é uma escolha artística, não uma lista confirmada de estátuas do livro.
- A descrição textual confirma a cabeça de falcão, a implantação mural elevada e o disco solar oco usado como cesta. O corpo antropomórfico sentado, o nemes, o trono dorsal, os detalhes de bronze e o diâmetro jogável do vão são decisões de reconstrução iconográfica, apoiadas em referências históricas e de produção.
- O hieróglifo SA-PER (errar) e a solução da bola contra a cabeça do shabti são soluções narrativas do romance; os comandos, colisões, distâncias, tempos, vitalidade e efeitos de gameplay são adaptações interativas.
- O quadro de treino de precisão, os três alvos circulares e os projéteis mágicos são complementos autorais, inspirados na formação dos iniciados.
- A aparência em faiança azul-esverdeada dos shabtis usa referência histórica de ushabtis vitrificados; a escala inicial de cerca de 19 cm e o corpo articulado em runtime são decisões de reconstrução.
- As dimensões regulamentares da quadra e da cesta são referências arquitetônicas modernas, não medidas publicadas como canônicas no romance.

## 2. Escala e implantação

- Sala: aproximadamente **20,4 × 32,3 m** de piso.
- Quadra marcada: **15 × 28 m**, de acordo com a dimensão de jogo indicada no Artigo 2 das Official Basketball Rules 2026 da FIBA.
- A FIBA 2026 indica ainda uma faixa desobstruída de pelo menos 2 m ao redor da área de jogo, produzindo um piso mínimo de 19 × 32 m. A sala construída deixa margens um pouco maiores em parte do perímetro para circulação e para os elementos decorativos.
- Implantação das efígies: a base de cada conjunto mural fica a **3,05 m acima do piso**, interpretando a indicação narrativa de dez pés. O disco solar vazado fica no topo da escultura; com a escala atual do modelo (0,78), o centro da abertura está a aproximadamente **6,00 m acima do piso**. O vão livre tem 45 cm de diâmetro como adaptação de gameplay para a bola de 24 cm — não é uma medida fornecida pelo romance.
- Piso da sala: nível 16,875 m no sistema vertical atual do modelo.
- Ligação: passagem física a partir da primeira galeria do Grande Salão, com passarela, portal de portas duplas e troca de zona ao cruzar o vão.

Referências técnicas:
- FIBA — Official Basketball Rules 2026, Artigo 2 (quadra e faixa livre): https://www.nz.basketball/wp-content/uploads/2026/07/documents-corporate-fiba-official-rules-2026-v1-1.pdf
- FIBA — confirmação de entrada em vigor das regras 2026 em 1º de outubro: https://about.fiba.basketball/en/news/fiba-official-basketball-rules-2026-to-take-effect-october-1
- Página oficial de downloads da FIBA: https://about.fiba.basketball/en/services/resource-hub/downloads

## 3. Assets construídos

O módulo `src/training-room.js` cria a sala como um passe independente do mundo principal.

| Asset | Construção / função | Estado |
|---|---|---|
| Piso de madeira | Tábuas esportivas de carvalho/nogueira em tom mel, mapa de cor procedural, micro-relevo PBR local, roughness, verniz leve e moldura perimetral | Refinado no código; QA visual pendente |
| Marcações da quadra | Linhas perimetrais, centrais, círculo e garrafões | Implementado |
| Abóbada | Malha curva segmentada, afresco panorâmico original e nervuras de bronze | Implementado |
| Paredes e frisos | Reboco mineral bege-creme PBR, paredes de fundo em calcário quente, cornijas e relevos afastados das faces para evitar superfícies coplanares | Corrigida a geometria sobreposta; QA visual pendente |
| Arandelas | Suporte de bronze, aplique de lótus, taça de óleo, pavio, chama animada e luz quente | Refinado no código |
| Relevos de divindades | Alto-relevos em placas arqueadas, com anatomia humana, cabeças animais específicas, nemes, shendyt, pigmentos e molduras; seleção artística não canônica | Reposicionados para fora da espessura das paredes |
| Efígies de Rá | Escultura antropomórfica sentada em diorito escuro, cabeça falconiforme, nemes azul e dourado, trono dorsal e disco solar vazado integrado à cesta | Fixadas às paredes de fundo a 3,05 m do piso; abertura funcional e pontuação alinhadas ao disco; QA visual pendente |
| Bola de basquete | Esfera de couro com 24 cm de diâmetro, canais, gravidade, quique, assistência de mira para cestas e shabtis | Redimensionada e integrada |
| Placar | Textura de canvas atualizada por pontuação | Implementado |
| Quatro shabtis | Miniaturas mumiiformes de faiança azul-esverdeada com textura mineral, rosto estreito, barba postiça, nemes estriado, uraeus, braços cruzados, pilar dorsal e inscrição; ao despertar abrem os braços e revelam pernas, khopesh e escudo | Reconstruídos; movimento limitado à área útil da quadra; QA visual/combate pendente |
| Alvos mágicos | Três alvos com resposta visual ao acerto | Implementado |
| Quadros de instrução | Quadro da prática de alvos e quadro “Whatever Works” | Implementado |
| Portas duplas | Folhas articuladas que abrem e fecham por interação | Implementado |
| Passarela e portal | Conexão física com a galeria, colisões e troca de zona | Implementado |

As peças tridimensionais principais continuam como geometria original sob medida em Three.js. A escultura de Rá usa perfis contínuos e materiais de diorito polido, em lugar de uma composição de esferas; os shabtis são novas esculturas mumiiformes de faiança e os relevos laterais foram esculpidos com atributos animais distintos. Nenhum scan ou modelo externo foi importado: as fontes históricas são referências de silhueta e material, não assets runtime. As tábuas mantêm mapa de cor/juntas próprios e recebem mapas PBR locais CC0 de normal/roughness da coleção Poly Haven Walnut Veneer 02 (assets/textures/wood-walnut). As paredes usam mapas locais de cor/normal/roughness de Poly Haven Beige Wall 001 (assets/textures/plaster-smooth-beige), com alvenaria de calcário procedural como fallback. A referência Wood Floor 001 do ambientCG continua apenas como referência de aparência: https://ambientcg.com/view?id=WoodFloor001.

## 3A. Correção de interseções e revisão escultórica (26/11/2026)

- A cintilação vinha de superfícies arquitetônicas sobrepostas: a fachada da mansão e a lateral do Grande Salão eram recortadas/reconstruídas para a passagem da sala, mas permaneciam visíveis ou ganhavam um segundo conjunto de caixas. As fachadas que atravessavam o volume da sala agora são ocultadas e a parede leste é reconstruída uma única vez, com o vão do portal.
- As paredes norte/sul usam um material de calcário quente separado do restante do reboco. Frisos, rodapés, cornijas, placas e letreiros foram afastados dos planos da alvenaria para reduzir z-fighting.
- As placas de divindades foram movidas para dentro do ambiente, fora da espessura física dos muros.
- Na revisão de 26/11, as efígies foram remodeladas como esculturas sentadas de diorito escuro. A implantação antiga, com pedestal no piso e aro separado, foi substituída pela revisão de 27/11 descrita na seção 3B.
- Os shabtis agora começam como estatuetas mumiiformes de faiança, com rosto, barba postiça, nemes estriado, uraeus, braços cruzados, pilar dorsal e inscrição. Ao despertar, os braços se abrem e as pernas aparecem, deixando espada curva e escudo em postura de combate.
- A IA usa uma área segura central e colisores proporcionais à forma desperta. As faixas de decoração junto às paredes e às efígies de Rá não fazem parte do percurso de perseguição.
- A bola de basquete não foi alterada nesta revisão, conforme a avaliação do usuário.

**Validação desta revisão:** o módulo da sala e o motor principal passaram por verificação estática de sintaxe. A aprovação visual, a verificação real do z-fighting, sombras e colisões ainda depende de inspeção no navegador, no desktop e no celular em paisagem.

## 4. Interações e controles

### Basquete

1. Aproxime-se da bola. O aviso contextual aparece na tela; pressione **E** (desktop) ou **INTERAGIR** (mobile) para pegá-la.
2. Pressione **E / INTERAGIR** novamente para arremessar na direção da câmera. Mire no disco solar de Rá para receber assistência de arco.
3. A bola tem 24 cm de diâmetro, gravidade, quique e desaceleração simplificados.
4. Ao atravessar a abertura da cesta, o placar registra uma cesta. Durante *Whatever Works*, também é possível mirar na cabeça de um shabti desperto e derrubá-lo, como na solução de basquete descrita no romance.

### Prática de mira mágica

1. Aproxime-se do quadro de alvos e pressione **E / INTERAGIR** para iniciar ou encerrar a atividade.
2. Equipe o cajado pelo inventário (**I** no desktop ou **MOCHILA** no mobile).
3. Pressione **F / USAR** para lançar um orbe mágico.
4. Acerte os três alvos e acompanhe a contagem no placar.

Esta atividade é um complemento autoral de gameplay, não uma mecânica descrita literalmente no livro.

### “Whatever Works” — guerreiro shabti

1. Aproxime-se do quadro *Magic Problem-Solving 101* — o próprio quadro agora lista os comandos — e pressione **E / INTERAGIR** (ou o botão móvel **INTERAGIR**).
2. As quatro miniaturas de faiança em torno da quadra entram numa coluna de luz e crescem até a escala de guerreiros, revelando nemes, espada curva e escudo. A transformação usa easing, brilho e animação articulada.
3. Para combater, aproxime-se de um shabti e equipe o cajado ou o khopesh no inventário (**I / MOCHILA**). Pressione **F / USAR** (ou **USAR** no mobile) quando estiver perto e voltado para ele. Cada guerreiro exige dois golpes.
4. Para usar a solução SA-PER, aproxime-se de um shabti ativo e pressione **E / INTERAGIR**. A figura cambaleia, corre na direção da parede e se desfaz ao bater nela.
5. Para usar a solução da bola, pegue-a com **E / INTERAGIR**, aponte a câmera para a cabeça de um shabti ativo e pressione novamente. O arremesso recebe assistência de mira e pode derrubar o guerreiro.
6. Quando derrotado, o shabti encolhe e retorna ao ponto original. O quadro reinicia a prova.

O crescimento das miniaturas, os guerreiros com espada/escudo, SA-PER e a solução da bola são inspirados diretamente na aula de *The Throne of Fire*. As velocidades, pontos de vida, distância de acerto, invulnerabilidade e as respostas de colisão são regras de jogo autorais. Os guerreiros se aproximam, preparam o golpe, atacam e recuperam a postura; Carter tem cinco pontos de vitalidade. Um aviso contextual junto ao objeto mostra qual botão usar, com texto adaptado ao mobile. A validação visual, das colisões e do equilíbrio ainda precisa ser feita num navegador real.

### Portas e inspeção

- O aviso contextual aparece quando Carter chega perto de um objeto interativo. No desktop mostra **E / INTERAGIR** e **F / USAR**; em mobile mostra os rótulos dos botões de toque.
- A porta dupla do portal abre e fecha por **E / INTERAGIR**.
- As efígies, relevos, afrescos e objetos podem ser examinados por proximidade.
- A lista de áreas inclui a Sala de Treinamento como acesso rápido e o atalho **5** também a seleciona.

## 5. Integração técnica e paridade

- A cena é construída a partir do módulo `src/training-room.js`.
- O controlador comum recebe as plataformas caminháveis e a lista de portais de transição.
- `src/inventory.js` notifica o módulo ao usar o item equipado, preservando o mesmo inventário do Grande Salão.
- O botão móvel de interação e de uso do inventário aciona as mesmas callbacks de desktop.
- `mobile.html` redireciona para `index.html`; as duas experiências usam o mesmo cenário e lógica, com controles adequados ao dispositivo.

## 6. Checklist de validação

### Implementado no código
- [x] Módulo da sala e assets originais.
- [x] Integração da sala ao mundo e à navegação.
- [x] Portal físico e transição entre Grande Salão e treinamento.
- [x] Interação da bola, cesta e placar.
- [x] Prática de alvos com projéteis mágicos.
- [x] Quatro miniaturas shabti com transformação animada e retorno à forma pequena.
- [x] Braços/pernas articulados durante aproximação, preparação e golpe.
- [x] Solução SA-PER com corrida e colisão contra a parede.
- [x] Arremesso de basquete capaz de acertar a cabeça do shabti.
- [x] Avisos contextuais de interação desktop/mobile.
- [x] Portas interativas.
- [x] Controles compartilhados desktop/mobile.
- [x] Medidas da quadra atualizadas para 15 × 28 m.

### Ainda não testado em navegador real
- [ ] Validar o primeiro acesso pela galeria do Grande Salão e atravessar o portal sem teleporte.
- [ ] Conferir se a câmera enquadra a quadra, as cestas de Rá e a abóbada de forma convincente.
- [ ] Testar pegar/arremessar a bola, assistência de arco, passagem descendente pelo aro e pontuação.
- [ ] Testar a prática de alvos, o cajado e a resposta visual ao acertar.
- [ ] Testar os quatro shabtis com cajado e khopesh, inclusive coluna de luz, crescimento, animação dos membros, SA-PER, bola na cabeça e retorno à forma de estatueta.
- [x] IA básica dos quatro shabtis: aproximação de Carter, preparação do golpe, ataque, recuperação e recuo em caso de derrota.
- [x] Vitalidade do jogador com cinco pontos, invulnerabilidade temporária e encerramento/reinício da prova ao esgotar a energia.
- [ ] Testar perseguição, distância de ataque, colisões móveis, golpes e telemetria da HUD em navegador real.
- [ ] Testar abrir/fechar o portal e garantir que as colisões acompanhem o estado das portas.
- [ ] Testar toque, joystick, inventário e interação em celular paisagem.
- [ ] Medir FPS, memória e temperatura no mobile.
- [ ] Revisar escala dos relevos, guerreiros, bola de 24 cm, disco solar, abertura da cesta e estátuas de Rá em relação ao Carter.
- [ ] Comparar o calcário/reboco PBR e o piso de madeira em luz real de jogo; conferir repetição, escala UV, brilho e sombras.

**Não marcar como concluído visualmente até a revisão real em navegador desktop e mobile.**

## 9. Preparação para alvos reativos da magia

A sala já contém dois conjuntos úteis para a futura camada de magia:

- **Quatro guerreiros shabti:** atualmente despertam, aproximam-se de Carter, atacam, recebem dano e retornam à forma de estatueta quando derrotados.
- **Três alvos circulares:** atualmente recebem os orbes da prática de mira e sinalizam visualmente o acerto.

Na próxima etapa, esses objetos devem deixar de responder apenas ao sistema de armas e passar a expor capacidades reutilizáveis. A magia consulta as capacidades do objeto atingido e executa a reação apropriada; o feitiço não deve conter código exclusivo para cada boneco.

| Alvo futuro / existente | Capacidades previstas | Reações visuais |
|---|---|---|
| Manequim arcano de treino (novo asset) | breakable, burnable, repairable, levitable, bindable, forceable | Rachar/desmontar, queimar, reconstruir, subir e flutuar, ficar preso por faixas de luz, receber impacto |
| Guerreiros shabti existentes | animated, breakable, bindable, forceable, repairable | Despertar, cambalear, ser imobilizado, desmontar em barro e recompor-se |
| Alvos circulares existentes | impactReceiver, glowable | Registrar acerto, emitir pulso e atualizar placar |
| Objetos comuns do mundo | Capacidades declaradas por objeto, quando fizer sentido | Reações limitadas ao material, massa e estado do objeto |

O manequim arcano será uma **interpretação de gameplay**, não um objeto confirmado no romance. Deve ser modelado como asset final, com materiais coerentes com a sala, articulações e peças separáveis; não será apresentado como um cilindro ou boneco placeholder.

**Levitação:** o efeito é explicitamente mencionado em *The Throne of Fire*: Sadie sugere lançar um feitiço de levitação sobre uma estátua grande para movê-la. O trecho não identifica a Divine Word usada. O efeito, portanto, é canônico, mas o nome do comando permanece sem transliteração confirmada; não inventar uma palavra.

A sala de treinamento serve para demonstrar os efeitos, mas a magia não ficará restrita a ela. Qualquer alvo no Grande Salão, biblioteca, exterior ou outra área poderá reagir quando declarar a capacidade correspondente.

O catálogo inicial e a separação entre feitiços canônicos, exemplos narrativos e adaptações de gameplay estão em [docs/MAGIC-SPELLS-STUDY.md](MAGIC-SPELLS-STUDY.md). A implementação de conjuração ainda não começou; a prioridade permanece validar os objetos do Duat antes de programar os feitiços.


### Correção das paredes atrás das efígies e revisão de assets (26/11/2026)

- As duas paredes de fundo receberam faces internas próprias em calcário, com material explicitamente opaco, dupla face e escrita de profundidade. A textura é clonada para não alterar o mapa usado nas outras paredes. Isso evita que as faces vistas da quadra fiquem cinzas ou pareçam transparentes.
- O ajuste foi aplicado em `src/training-room.js`; desktop e mobile continuam usando a mesma cena.
- A bola de basquete não foi modificada.
- A substituição dos cinco relevos laterais e das duas efígies de Rá permanece pendente da escolha visual. A implementação atual usa relevos procedurais interpretativos; não são scans arqueológicos nem shabtis autênticos. Não importar um modelo com licença/pose inadequada antes da escolha.

**Candidatos para Rá:** o scan fotogramétrico Ra-Horakhty AA-016, em granodiorito, está disponível em GLB/STL/PLY/3MF/OBJ sob CC BY 4.0: https://archaeoarchive.com/view/ra-horakhty. A pose do scan é em pé, portanto a substituição pode exigir reescalar e reorientar o objeto; não é a mesma pose sentada atual. Para a versão sentada, usar como referência iconográfica a estatueta de Re-Harakhty do Metropolitan Museum e a descrição da estátua SR 341 do Global Egyptian Museum.

**Candidatos para shabtis:** o Kelsey Museum oferece um STL de ushabti de faiança azul-esverdeada (13,5 cm) com corpo mumiforme, barba, toucado e inscrição; o projeto de Liverpool oferece um modelo interativo em point cloud/mesh; a Factum Foundation publicou digitalizações de dois ushabtis do túmulo de Seti I. Estes são objetos funerários pequenos, não estátuas monumentais de parede.

A avaliação visual e a escolha entre (A) shabtis em nichos e (B) relevos arquitetônicos egípcios devem acontecer antes de remover os relevos existentes.


### Reconstrução escultórica e nichos com shabtis (27/11/2026)

- Os cinco bustos laterais procedurais foram removidos. No lugar, a sala recebeu cinco nichos de calcário com shabtis mumiformes em faiança azul-esverdeada, toucado nemes, barba postiça e coluna de inscrição. Os exemplares de parede são decorativos; os quatro shabtis da quadra continuam sendo os únicos agentes interativos.
- A composição de nicho foi dimensionada para não invadir a área segura de navegação e combate. As miniaturas decorativas não geram colisão nem participam da IA.
- A efígie de Rá foi revista a partir das referências do Metropolitan Museum e do scan de Re-Horakhty: cabeça de falcão em diorito escuro, bico curvo, olhos incisos, nemes de pedra e disco solar maciço elevado. O aro de basquete foi separado do disco solar e projetado à frente do corpo com suportes próprios; a lógica da cesta aponta para a nova posição do aro.
- A máscara de profundidade invisível da casca externa da mansão agora é desativada ao entrar no interior e reativada ao retornar à margem. Isso corrige o conflito de profundidade que podia encobrir paredes internas com a máscara externa sem cor.
- A correção de opacidade das duas paredes de fundo permanece ativa. Desktop e mobile compartilham o mesmo módulo, cenário e cache revisionado.
- A bola de basquete e seu raio de colisão não foram modificados nesta iteração.
- **Limite de integração dos scans:** os escaneamentos de Re-Horakhty e shabti foram usados como referência iconográfica e de proporção; os arquivos binários não foram incorporados ao runtime nesta passagem. As geometrias implementadas são modelos procedurais originais da CASABROOKLIN, não scans apresentados como originais arqueológicos.
- **QA:** validação de sintaxe dos módulos passou. Ainda é necessária inspeção visual em navegador para conferir proporção, posição do aro e encaixe dos nichos no interior.


### Ajuste de proporção dos nichos (27/11/2026)

- Os cinco nichos de shabti foram compactados para corresponder à escala de uma estatueta mumiforme, com moldura de calcário, fundo escurecido, ombreiras, arco superior e plinto. As figuras foram ampliadas ligeiramente dentro dos nichos para manter legibilidade sem se tornarem estátuas humanas.
- As cinco figuras de nicho continuam decorativas e sem colisão. Os quatro shabtis do centro da quadra mantêm a mecânica de despertar e combate.
- A cena usa a mesma implementação em desktop e mobile. Cache do módulo de treinamento atualizado para `ra-shabti-niches-20261127b`.


### Revisão de fidelidade: estátuas divinas, shabtis e quadro da aula (27/11/2026)

**Separação correta dos elementos do romance**

- A descrição da sala em *The Throne of Fire* menciona estátuas de deuses ao longo das paredes e, nas paredes de fundo da quadra, figuras de Rá com cabeça de falcão; os discos solares vazados formam as cestas.
- Carter retira quatro estatuetas shabti de sua bolsa e as posiciona em diferentes cantos da sala. São estas quatro peças que crescem e se tornam guerreiros de cerâmica vitrificada armados com espadas e escudos.
- Portanto, as miniaturas shabti não pertencem aos nichos das paredes. Os cinco nichos laterais agora são expositores de esculturas divinas digitalizadas; as quatro miniaturas no piso da quadra são os shabtis usados na aula.
- O scan do Shabti de Ramose (Fitzwilliam Museum) é usado apenas na forma de estatueta. Durante o despertar/combate, uma forma procedural independente mantém a transformação e os movimentos de guerreiro já implementados.

**Quadro e alvos**

- O romance estabelece a aula “Magic Problem-Solving 101”, apelidada pelos alunos de “Whatever Works”, e descreve os exercícios com os quatro shabtis. Não descreve literalmente um quadro-negro, bandeja de giz ou três alvos circulares fixos.
- O quadro-negro com moldura, superfície verde, bandeja, giz e apagador é uma adaptação cenográfica para tornar a interação da aula visível e acessível. O painel de treino de magia também é uma adaptação de gameplay.
- O quadro foi reposicionado e reconstruído com a placa de madeira orientada paralelamente à parede; a dimensão de profundidade foi corrigida para não atravessar a sala nem bloquear o texto.

**Assets ativos**

- Esculturas laterais: scans GLB do Hórus em bronze (The Hunt Museum), falcão de Hórus (Minneapolis Institute of Art) e Thoth como babuíno (The Hunt Museum).
- Shabtis: scan GLB do Shabti de Ramose (Fitzwilliam Museum), aplicado às miniaturas; a forma de guerreiro procedural continua em uso para combate.
- Os modelos são carregados com GLTFLoader de um mirror público com versão fixada por commit. As licenças e créditos são registradas em `docs/OPEN-SOURCES.md`. Se o CDN não responder, as formas procedurais de fallback mantêm a cena funcional.
- A correção não altera a bola de basquete.
- QA estático de sintaxe passou; ainda é necessária inspeção visual no navegador para verificar orientação, escala final e disponibilidade do CDN durante o carregamento.


### Diversificação das estátuas laterais com scans (27/11/2026)

- A sequência de cinco expositores foi diversificada para evitar repetições visuais: estatueta de chacal, Hórus em bronze, Thoth como babuíno, Hórus como falcão em pedra e esfinge com cabeça de falcão.
- As peças são scans de objetos de museu ou modelos diretamente associados aos objetos de coleção, e não esculturas procedurais feitas com cilindros. Os nichos de calcário continuam sendo molduras arquitetônicas próprias do cenário.
- O objeto de chacal é identificado apenas como **estatueta de chacal**: o registro do Art Institute of Chicago aponta associação possível a Anúbis ou Wepwawet, sem fixar uma identificação única.
- A posição de um expositor foi deslocada para longe do portal lateral; nenhum nicho deve ocupar o vão de entrada.
- O loader agora configura MeshoptDecoder, necessário para variantes GLB que usam compressão Meshopt.
- O conjunto mantém cinco expositores; os quatro shabtis da quadra continuam independentes e interativos.

 
## 3B. Revisão das efígies de Rá e da cesta solar (27/11/2026)

### Fonte narrativa e canon

Em The Throne of Fire, Carter descreve as efígies de Rá nas paredes das linhas de fundo: as estátuas têm cabeça de falcão, projetam-se da parede e ficam elevadas cerca de dez pés. As coroas em disco solar foram escavadas para que os próprios discos funcionassem como cestas de basquete. A narrativa não descreve um aro separado, uma tabela, uma rede ou um pedestal apoiado no piso; esses elementos não devem ser adicionados à reconstrução como se fossem canônicos.

### Referências históricas consultadas

- The Metropolitan Museum of Art — [Head of an anthropomorphic falcon god](https://www.metmuseum.org/art/collection/search/549699). Cabeça em diorito com peruca estriada; a ficha aponta que o encaixe superior pode ter sustentado um disco solar e identifica a figura como Re ou Re-Harakhty. Referência para a anatomia da cabeça, olho, bico, textura de pedra e encaixe do disco.
- RISD Museum — [Temple god / Seated Horus](https://risdmuseum.org/art-design/collection/temple-god-38207). Figura sentada de Horus em bronze escurecido, sobre trono de bloco. Referência complementar para pose frontal sentada e relação entre cabeça animal, tronco humano e trono; não é apresentada como uma escultura de Rá.
- A iconografia do nemes, do uraeus e do disco solar foi usada como referência histórica para completar detalhes não especificados na passagem da sala de treinamento. Esses detalhes continuam classificados como interpretação de produção.

### Busca de assets 3D e decisão

Foi avaliado o modelo [God Ra Art — Tomb Chaser 1](https://models.codelove.in/models/tomb-chaser-1-god-ra-art/), disponível também em [ToxSam/cc0-models-Polygonal-Mind](https://github.com/ToxSam/cc0-models-Polygonal-Mind/tree/main/projects/tomb-chaser-1). A ficha declara GLB/glTF 2.0, CC0 1.0, 34 KB, 1.650 triângulos, 1.365 vértices, 2 materiais, 3 texturas, altura de 2,68 m e malha estática sem rig. O preview apresenta olhos verdes, disco laranja e linguagem low-poly de personagem de jogo. **Rejeitado para integração** por incompatibilidade estética com a escultura monumental de diorito e por não fornecer a cesta oca integrada ao disco. O GLB não foi copiado para o projeto.

Decisão: preservar a geometria procedural original em src/training-room.js, usando perfis esculpidos, materiais de diorito, detalhes de lápis-lazúli e bronze. Isso mantém a compatibilidade com Three.js e evita acrescentar uma dependência externa ou um personagem low-poly à cena.

### Implementação

- Removidos o pedestal apoiado no piso e o aro separado com suportes laterais, aro suspenso e rede decorativa.
- As duas efígies foram reposicionadas nas paredes norte e sul, com painel dorsal encostado ao calcário, dois braços cantilever de bronze e fixações na faixa inferior da parede. A base do conjunto fica a 3,05 m do piso, como interpretação da indicação narrativa de dez pés.
- O crânio foi refeito com perfil alongado de falcão; o nemes recebeu superfície azul-lápis com estrias douradas. A composição mantém o tronco humano sentado, o kilt, os braços, o colar e o trono dorsal como interpretação iconográfica.
- O disco agora é formado por moldura anelar aberta. O aro funcional está integrado à abertura; não há face preenchida no centro, tabela ou rede convencional.
- A abertura útil tem 45 cm de diâmetro após a escala de 0,78. Como a bola de gameplay mede 24 cm, o teste aceita a passagem do centro dentro do raio livre restante (aprox. 10,5 cm).
- A referência de pontuação usa o centro real do disco solar transformado para coordenadas globais. A bola precisa cruzar o plano vertical da abertura na direção correta e passar dentro do vão livre. A assistência de arremesso continua mirando a mesma posição.
- Desktop e mobile continuam usando o mesmo módulo, geometria, transformações e lógica. Nenhuma bifurcação visual por dispositivo foi introduzida.

### QA pendente

- [x] Código atualizado no repositório.
- [x] Abertura da cesta e posição de pontuação derivadas do mesmo centro geométrico.
- [x] Duas efígies posicionadas simetricamente nas paredes de fundo.
- [ ] Abrir a sala em navegador desktop e confirmar que as estátuas estão visivelmente fixadas às paredes, sem atravessar o calcário.
- [ ] Conferir altura, enquadramento da câmera, escala e leitura da cabeça de falcão e do nemes.
- [ ] Testar arremesso nas duas direções, acerto pelo centro do disco e falha ao tocar a moldura.
- [ ] Repetir a validação no celular em paisagem e medir o impacto de desempenho.

**Não marcar como visualmente aprovado ou browser-tested até executar essas verificações no runtime real.**


## 3C. Fechamento das paredes de fundo e encaixe das efígies (27/11/2026)

### Esclarecimento do texto-fonte

A passagem de *The Throne of Fire* descreve as estátuas de Rá nas paredes das linhas de fundo, projetando-se para fora da parede e posicionadas cerca de dez pés acima do piso. Em seguida, Carter volta a se referir à estátua como algo que se projeta da parede, dez pés acima deles. Portanto, a leitura de que essas efígies ficam apoiadas no chão não corresponde a esse trecho do romance. O código mantém a implantação mural elevada; o problema corrigido aqui era a leitura de objeto mal encaixado na parede, não a altura descrita no livro.

Fonte textual consultada: https://anyflip.com/sbybe/zcnp/basic/51-100 (passagem da sala de treinamento e, logo adiante, a estátua de Rá que começa a desmoronar).

### Alterações no código

- Ajustada a profundidade das efígies para que o painel dorsal e os braços de sustentação encontrem o lado interno das paredes norte/sul. O conjunto agora projeta-se para dentro da quadra, sem parecer embutido nem ficar com uma folga visível atrás.
- Construídos dois frontões sólidos de calcário, com perfil amostrado da mesma curva semicircular usada pela abóbada. Cada frontão atravessa a espessura da parede de fundo e fecha o vazio triangular acima da linha de mola.
- O material dos frontões é explicitamente opaco, com faces duplas e escrita/teste de profundidade. As faces internas das paredes também recebem ordem de renderização controlada para manter a superfície de calcário visível pela câmera interna.
- O fechamento acompanha a curva do teto, para que o mar, o skyline e os prédios exteriores não apareçam por trás das estátuas ou acima da parede.

### Validação

- [x] src/training-room.js atualizado.
- [x] Verificação estática de sintaxe JavaScript aprovada.
- [ ] Confirmar no navegador desktop que os frontões fecham toda a vista exterior sem cobrir a abóbada.
- [ ] Confirmar no navegador que as efígies parecem apoiadas na parede, projetando-se para a quadra.
- [ ] Repetir inspeção em celular paisagem e testar a interação/arremesso nas duas extremidades.

**QA visual em navegador ainda pendente; não marcar como browser-tested ou aprovado visualmente antes da inspeção real.**
