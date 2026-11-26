# Sala de Treinamento — estudo, reconstrução e interações

Data: 26/11/2026  
Projeto: CASABROOKLIN  
Status: **primeira implementação integrada; revisão visual em navegador ainda pendente**

## 1. Evidência narrativa e grau de certeza

A Brooklyn House é apresentada oficialmente pela Disney como local onde jovens magos aprendem a usar seus poderes. O material complementar *Brooklyn House Magician's Manual* é descrito pela editora como manual de treinamento, com quizzes, histórias e conteúdo sobre divindades, criaturas e o Duat: https://books.disney.com/book/brooklyn-house-magicians-manual/

A descrição detalhada da sala de treinamento foi consultada em referência secundária do universo Kane Chronicles: https://riordan.fandom.com/wiki/Brooklyn_House. Ela descreve a sala no segundo andar, aproximadamente do tamanho de uma quadra de basquete, com piso de madeira, teto abobadado pintado com cenas do Egito Antigo e estátuas de divindades ao longo das paredes. Nas linhas de fundo, estátuas de Rá com cabeça de falcão e discos solares ocos funcionam como cestas.

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
- O quadro de prática de alvos, os três alvos circulares e os projéteis mágicos são interações originais inspiradas no treinamento mágico; não são apresentados como mecanismos canônicos.
- O guerreiro shabti é inspirado no exercício citado, enquanto seus quatro pontos de resistência, a animação de derrota e o sistema de combate são adaptações de gameplay.
- As dimensões regulamentares da quadra são usadas como referência arquitetônica moderna, não como informação textual do universo.

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
| Piso de madeira | Tábuas com variação de cor, juntas, veios e bump procedural | Implementado |
| Marcações da quadra | Linhas perimetrais, centrais, círculo e garrafões | Implementado |
| Abóbada | Malha curva segmentada, afresco panorâmico original e nervuras de bronze | Implementado |
| Frisos e pilastras | Calcário, bronze e detalhes egípcios | Implementado |
| Arandelas | Suportes, chamas emissivas e luz pontual quente | Implementado |
| Bustos de divindades | Conjuntos esculpidos para inspeção por proximidade | Implementado |
| Efígies de Rá | Cabeça de falcão, disco solar vazado e rede de cesta | Implementado |
| Bola de basquete | Malha esférica texturizada, costuras, gravidade e quique simplificados | Implementado |
| Placar | Textura de canvas atualizada por pontuação | Implementado |
| Guerreiro shabti | Figura de barro com equipamento cerimonial e estado de combate | Implementado |
| Alvos mágicos | Três alvos com resposta visual ao acerto | Implementado |
| Quadros de instrução | Quadro da prática de alvos e quadro “Whatever Works” | Implementado |
| Portas duplas | Folhas articuladas que abrem e fecham por interação | Implementado |
| Passarela e portal | Conexão física com a galeria, colisões e troca de zona | Implementado |

Não foi importado um pacote externo de modelos 3D para esta sala: as peças principais são geometria e materiais originais em Three.js. Isso evita misturar um pack low-poly com a direção cinematográfica híbrida já estabelecida. A textura Wood Floor 001 do ambientCG foi avaliada como candidata PBR CC0, mas **não** está integrada; o piso desta versão usa mapas procedurais próprios. Página da referência avaliada: https://ambientcg.com/view?id=WoodFloor001

## 4. Interações e controles

### Basquete

1. Aproxime-se da bola e pressione **E** (desktop) ou **INTERAGIR** (mobile) para pegá-la.
2. Pressione o mesmo botão novamente para arremessar na direção atual da câmera.
3. A bola recebe gravidade, quique e desaceleração simplificados.
4. Ao atravessar a região de um aro solar, o placar registra uma cesta.

### Prática de mira mágica

1. Aproxime-se do quadro de alvos e pressione **E / INTERAGIR** para iniciar ou encerrar a atividade.
2. Equipe o cajado pelo inventário (**I** no desktop ou **MOCHILA** no mobile).
3. Pressione **F / USAR** para lançar um orbe mágico.
4. Acerte os três alvos e acompanhe a contagem no placar.

Esta atividade é um complemento autoral de gameplay, não uma mecânica descrita literalmente no livro.

### “Whatever Works” — guerreiro shabti

1. Aproxime-se do quadro *Magic Problem-Solving 101* e pressione **E / INTERAGIR**.
2. O guerreiro shabti desperta.
3. Equipe o cajado ou o khopesh e use **F / USAR** quando estiver perto e voltado para ele.
4. Quatro acertos concluem a prova; o shabti desmorona visualmente e pode ser reativado no quadro.

A experiência adapta o exercício de resolução de problemas descrito pela referência narrativa secundária. Vida, golpes e animação são regras próprias do protótipo.

### Portas e inspeção

- A porta dupla do portal abre e fecha por **E / INTERAGIR**.
- As efígies e os afrescos podem ser examinados por proximidade.
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
- [x] Desafio do shabti.
- [x] Portas interativas.
- [x] Controles compartilhados desktop/mobile.
- [x] Medidas da quadra atualizadas para 15 × 28 m.

### Ainda não testado em navegador real
- [ ] Validar o primeiro acesso pela galeria do Grande Salão e atravessar o portal sem teleporte.
- [ ] Conferir se a câmera enquadra a quadra, as cestas de Rá e a abóbada de forma convincente.
- [ ] Testar pegar/arremessar a bola, colisão com a cesta e pontuação.
- [ ] Testar a prática de alvos, o cajado e a resposta visual ao acertar.
- [ ] Testar o shabti com cajado e khopesh, inclusive distância e direção dos golpes.
- [ ] Testar abrir/fechar o portal e garantir que as colisões acompanhem o estado das portas.
- [ ] Testar toque, joystick, inventário e interação em celular paisagem.
- [ ] Medir FPS, memória e temperatura no mobile.
- [ ] Revisar escala dos bustos, do guerreiro, da bola e das estátuas de Rá em relação ao Carter.

**Não marcar como concluído visualmente até a revisão real em navegador desktop e mobile.**
