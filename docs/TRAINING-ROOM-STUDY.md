# Sala de Treinamento — estudo, reconstrução e interações

Data: 26/11/2026  
Projeto: CASABROOKLIN  
Status: **passe de refinamento asset-first integrado; aprovação visual e QA em navegador desktop/mobile ainda pendentes**

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
- Estátuas de Rá com cabeça de falcão nas linhas de fundo.
- Discos solares ocos funcionando como cestas.
- Espaço usado para basquete e para treinamento dos magos.
- Exercício de resolução de problemas mágicos com guerreiro shabti de barro.

### Decisões interpretativas desta reconstrução

- A localização como ala a oeste do Grande Salão, o portal e a passarela de conexão são escolhas de level design para a planta 3D atual, não uma planta oficial publicada.
- O programa exato dos afrescos, nervuras de bronze, frisos, arandelas e acabamento de pedra foi criado para completar a arquitetura sem afirmar que cada motivo é descrito no romance.
- A seleção de bustos — Anúbis, Sekhmet, Hórus, Ísis e Bastet — é uma escolha artística, não uma lista confirmada de estátuas do livro.
- A representação de Rá como figura humana sentada com cabeça de falcão, nemes e disco solar é uma reconstrução iconográfica; a forma da escultura, trono, estela arqueada e o aro esportivo adaptado são escolhas de modelagem.
- O hieróglifo SA-PER (errar) e a solução da bola contra a cabeça do shabti são soluções narrativas do romance; os comandos, colisões, distâncias, tempos, vitalidade e efeitos de gameplay são adaptações interativas.
- O quadro de treino de precisão, os três alvos circulares e os projéteis mágicos são complementos autorais, inspirados na formação dos iniciados.
- A aparência em faiança azul-esverdeada dos shabtis usa referência histórica de ushabtis vitrificados; a escala inicial de cerca de 19 cm e o corpo articulado em runtime são decisões de reconstrução.
- As dimensões regulamentares da quadra e da cesta são referências arquitetônicas modernas, não medidas publicadas como canônicas no romance.

## 2. Escala e implantação

- Sala: aproximadamente **20,4 × 32,3 m** de piso.
- Quadra marcada: **15 × 28 m**, de acordo com a dimensão de jogo indicada no Artigo 2 das Official Basketball Rules 2026 da FIBA.
- A FIBA 2026 indica ainda uma faixa desobstruída de pelo menos 2 m ao redor da área de jogo, produzindo um piso mínimo de 19 × 32 m. A sala construída deixa margens um pouco maiores em parte do perímetro para circulação e para os elementos decorativos.
- Altura do aro solar: **3,05 m acima do piso**, igual à altura da borda superior do aro indicada no documento de equipamentos das Official Basketball Rules 2026 da FIBA.
- Piso da sala: nível 16,875 m no sistema vertical atual do modelo.
- Ligação: passagem física a partir da primeira galeria do Grande Salão, com passarela, portal de portas duplas e troca de zona ao cruzar o vão.

Referências técnicas:
- FIBA — Official Basketball Rules 2026, Artigo 2 (quadra e faixa livre): https://www.nz.basketball/wp-content/uploads/2026/07/documents-corporate-fiba-official-rules-2026-v1-1.pdf
- FIBA — Official Basketball Rules 2026, Basketball Equipment (altura do aro a 3.050 mm): https://www.nz.basketball/wp-content/uploads/2026/07/documents-corporate-fiba-official-rules-2026-equipment-v1-0.pdf
- FIBA — confirmação de entrada em vigor das regras 2026 em 1º de outubro: https://about.fiba.basketball/en/news/fiba-official-basketball-rules-2026-to-take-effect-october-1
- Página oficial de downloads da FIBA: https://about.fiba.basketball/en/services/resource-hub/downloads

## 3. Assets construídos

O módulo `src/training-room.js` cria a sala como um passe independente do mundo principal.

| Asset | Construção / função | Estado |
|---|---|---|
| Piso de madeira | Tábuas esportivas de carvalho/nogueira em tom mel, mapa de cor procedural, micro-relevo PBR local, roughness, verniz leve e moldura perimetral | Refinado no código; QA visual pendente |
| Marcações da quadra | Linhas perimetrais, centrais, círculo e garrafões | Implementado |
| Abóbada | Malha curva segmentada, afresco panorâmico original e nervuras de bronze | Implementado |
| Paredes e frisos | Reboco mineral bege-creme com mapas locais PBR CC0, alvenaria de calcário procedural como fallback, rodapés, cornijas, pilastras e filetes de bronze | Refinado no código; QA visual pendente |
| Arandelas | Suporte de bronze, aplique de lótus, taça de óleo, pavio, chama animada e luz quente | Refinado no código |
| Relevos de divindades | Figuras de corpo inteiro em nichos rasos, com atributos animais, pigmentos e molduras de bronze; seleção artística não canônica | Refinado no código |
| Efígies de Rá | Figura humana sentada, cabeça de falcão com bico e olhos, nemes listrado, colar, kilt, trono e estela arqueada; disco solar vazado com rede adaptado como cesta | Reconstruído no código; QA visual pendente |
| Bola de basquete | Esfera de couro com 24 cm de diâmetro, canais, gravidade, quique, assistência de mira para cestas e shabtis | Redimensionada e integrada |
| Placar | Textura de canvas atualizada por pontuação | Implementado |
| Quatro shabtis | Miniaturas mumiformes em faiança vitrificada, nemes, inscrição, espada curva e escudo oval; crescimento animado, membros articulados, perseguição, golpes, SA-PER e reação à bola | Reconstruídos no código; QA de combate pendente |
| Alvos mágicos | Três alvos com resposta visual ao acerto | Implementado |
| Quadros de instrução | Quadro da prática de alvos e quadro “Whatever Works” | Implementado |
| Portas duplas | Folhas articuladas que abrem e fecham por interação | Implementado |
| Passarela e portal | Conexão física com a galeria, colisões e troca de zona | Implementado |

As peças tridimensionais principais continuam como geometria original sob medida em Three.js, evitando um pack low-poly incompatível com a direção cinematográfica híbrida. Nesta revisão, as tábuas mantêm mapa de cor e juntas próprios, mas recebem mapas PBR locais CC0 de normal/roughness da coleção Poly Haven Walnut Veneer 02 (`assets/textures/wood-walnut`). As paredes usam os mapas locais de cor/normal/roughness de Poly Haven Beige Wall 001 (`assets/textures/plaster-smooth-beige`), com uma textura procedural de alvenaria de calcário como fallback. A referência Wood Floor 001 do ambientCG continua apenas como referência de aparência, não como textura runtime: https://ambientcg.com/view?id=WoodFloor001.

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

**Levitação:** a lista de oito feitiços favoritos do *Guia de Sobrevivência* não inclui uma palavra identificada como “levitar”. O efeito pode ser testado no manequim, mas seu nome mágico só será associado ao cânone depois de localizar uma passagem específica nos romances ou no material oficial.

A sala de treinamento serve para demonstrar os efeitos, mas a magia não ficará restrita a ela. Qualquer alvo no Grande Salão, biblioteca, exterior ou outra área poderá reagir quando declarar a capacidade correspondente.
