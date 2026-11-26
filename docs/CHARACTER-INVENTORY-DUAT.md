# Carter — inventário, objetos do Duat e preparação para magia

Data: 26/11/2026
Status: **doze objetos, portal no espaço do tórax, clipe use_press e bloqueio de movimento integrados; pose de palma atravessando e QA visual pendentes**

## 1. Princípio de desenvolvimento

O sistema será reutilizável por qualquer personagem mago. Nesta etapa, apenas Carter Kane recebe a primeira implementação. A lógica não deve depender do nome Carter: cada personagem futuro poderá fornecer seu próprio rig, sockets, catálogo de objetos, animações e afinidades mágicas.

A fábrica `createCharacter()` já aceita `characterSource` e `characterName`; `attachCarterAccessories: false` permite usar o mesmo conjunto de animações sem aplicar a bolsa e o medalhão exclusivos de Carter. O inventário recebe candidatos de osso da mão e uma posição de fallback, para adaptar o socket ao rig de cada novo personagem.

Desktop e mobile usam a mesma cena, o mesmo personagem, os mesmos objetos e o mesmo estado de inventário. Só a interface e os controles de entrada podem variar.

## 2. Base canônica — ferramentas e materiais

O *As Crônicas dos Kane: Guia de Sobrevivência* descreve uma pequena caixa de magia que o mago mantém consigo. O conteúdo varia por preferência e pode incluir:

- papiros;
- cálamo / caneta;
- tinta;
- cera para criar shabtis;
- amuletos de proteção;
- paleta de escriba;
- cordão marrom;
- estátua de gato em ébano.

O guia explica que um mago treinado pode guardar essa caixa no Duat e acessá-la quando necessário. Também descreve o cajado como ferramenta para controlar elementos, invocar espíritos e conjurar chamas, além de servir em combate; o khopesh é uma espada curva egípcia usada para desarmar o oponente; e shabtis são pequenas figuras que podem despertar ao chamado do mestre.

Referência: Rick Riordan, *The Kane Chronicles Survival Guide*, seção “Hieroglyphs, Symbols & Commands”, páginas impressas 68–70 (feitiços, regras de escrita e símbolos) e seção “Artifacts of Power”, página impressa 131 (caixa de magia e Duat), conforme a edição consultada.

## 3. Catálogo inicial de objetos de Carter

| ID | Objeto | Função / estado | Base |
|---|---|---|---|
| `staff` | Cajado mágico | Ferramenta mágica e arma; empunhado na mão direita | Canônico; modelo procedural integrado |
| `khopesh` | Khopesh | Arma corpo a corpo; empunhada na mão direita | Canônico; modelo procedural integrado |
| `wax_shabti` | Shabti de cera | Miniatura transportável; futura invocação por magia | Canônico como objeto criado em cera; primeira geometria procedural integrada |
| `papyrus` | Papiro | Suporte para escrever/desenhar feitiços | Canônico; primeira geometria/textura procedural integrada; escrita mágica real pendente |
| `reed_pen` | Cálamo | Ferramenta de escrita e desenho mágico | Canônico; primeira geometria procedural integrada |
| `ink` | Tinta e recipiente | Consumível/ferramenta para inscrições | Canônico; primeiro recipiente procedural integrado |
| `protective_amulet` | Amuleto de proteção | Artefato transportável; efeito será configurado depois | Amuleto protetor é canônico; uso do wedjat como desenho é interpretação visual; primeira geometria integrada |
| `magic_box` | Caixa de magia | Recipiente físico que reúne os instrumentos; também pode ser guardado no Duat | Canônico; primeira geometria procedural integrada; abertura/compartimentos pendentes |
| `wax_lump` | Cera branca | Material para criar/ajustar shabtis | Canônico; modelo procedural inicial |
| `scribe_palette` | Paleta de escriba | Suporte de pigmentos para escrita | Canônico; modelo procedural inicial |
| `brown_twine` | Cordão marrom | Material para amarrar/organizar objetos | Canônico como conteúdo da caixa de Julius; modelo procedural inicial |
| `ebony_cat` | Estátua de gato em ébano | Pequeno objeto guardado na caixa | Canônico como objeto descrito no kit de Julius; modelo procedural inicial |

## 3.1 Referências visuais e decisão de assets

- **Shabti:** a ficha “Ushabti figures”, do projeto Virtual Museums of Małopolska, aparece como modelo 3D CC0 via Sketchfab/Artheon. Foi estudada como referência de silhueta e pose mumiforme, mas não importada: o modelo histórico é uma peça arqueológica de material diferente, enquanto o item de Carter precisa comunicar cera moldada. Fonte: https://www.artheonmuseum.org/artwork/ushabti-figures-cf0631
- **Papiro:** o fragmento do Livro dos Mortos de Henuttawy, catalogado pelo British Museum, serve como referência de proporção e pigmento: https://www.britishmuseum.org/collection/object/Y_EA10018-1
- **Instrumentos de escriba:** a paleta de madeira EA12786, também catalogada pelo British Museum, ajuda a orientar a leitura de tinta, pigmentos e cálamos: https://www.britishmuseum.org/collection/object/Y_EA12786

Os links do British Museum são referências de estudo, não arquivos importados. Nenhum GLB externo foi incorporado nesta primeira rodada: caixa, papiro, cálamo, tinta, amuleto, shabti, cera, paleta, cordão e gato foram montados como geometria procedural em Three.js. A forma atual é uma primeira versão técnica; escala, acabamento e leitura precisam de QA visual antes de aprovação.

Os doze itens acima já têm IDs estáveis e modelos 3D iniciais no catálogo de `src/inventory.js`. A primeira rodada é procedural e ainda precisa de inspeção no navegador para aprovar escala, orientação, leitura de material e encaixe na mão. O papiro usa marcas gráficas abstratas, não hieróglifos nem palavras mágicas definitivas; a caixa ainda não abre e o amuleto não possui efeito mágico.

## 4. Estados do inventário

Cada item precisa ter um ID estável e um estado explícito:

- `IN_DUAT`: guardado na dimensão; não aparece preso ao personagem.
- `RETRIEVING`: o portal está aberto e o objeto atravessa para a mão.
- `IN_HAND`: o objeto está visível no socket apropriado.
- `STORING`: o objeto retorna pelo portal.
- `WORLD`: objeto colocado no cenário, caso uma interação futura permita deixá-lo no chão ou numa superfície.

Regras:

1. Um item não pode estar duplicado no Duat e na mão ao mesmo tempo.
2. Só um objeto ocupa o socket principal da mão direita por vez; acessórios e objetos de duas mãos poderão declarar sockets próprios.
3. Trocar de objeto recolhe o anterior antes de concluir a retirada do próximo.
4. O portal é um efeito genérico do inventário, independente do objeto recuperado.
5. A aparência, escala e ponto de fixação são definidos por item; o fluxo de guardar/retirar é compartilhado.
6. A interface apenas seleciona o objeto. A ação diegética é feita no mundo 3D: abertura do portal, aproximação da mão e passagem do objeto.

## 5. Abertura do Duat — sequência visual

A sequência pretendida para retirar um objeto é:

1. Carter orienta o braço e aproxima a mão de um ponto no ar.
2. Uma superfície oval translúcida se abre no ar à frente do tórax, no ponto em que a mão direita vai alcançar, como uma membrana entre o mundo físico e o Duat.
3. A borda recebe luz azul-dourada e sinais hieroglíficos breves; o interior apresenta profundidade e distorção, não deve parecer um menu plano.
4. A mão atravessa a abertura.
5. O objeto surge parcialmente na membrana, é puxado para fora e se encaixa no socket da mão direita.
6. A abertura se fecha e os sinais desaparecem.

Para guardar, a sequência acontece ao contrário. **Já está implementado:** portal oval procedural ancorado em Spine2/Spine1/Chest/Spine; clipe Ara `use_press` de 1,65 s; transição de escala/posição sincronizada com o contato da mão por volta de 0,88 s; e retorno ao estado guardado. O controlador bloqueia movimento, salto e joystick durante a ação. **Pendente:** refinar a pose para a palma inteira atravessar a membrana (o clipe existente estende o indicador como se tocasse um ponto), ajustar a orientação e a posição real do portal após inspeção do rig e revisar o timing visual. O rig aprovado do Carter não será substituído.

## 6. Arquitetura técnica

- `src/inventory.js`: catálogo e estados dos itens, sockets configuráveis por `handBoneCandidates`/`fallbackSocketPosition`, retirada/armazenamento e efeito visual do portal.
- `src/character.js`: fornece rig, sockets e API de ações; não deve conter regras específicas de cada feitiço.
- `src/magic-system.js` (etapa futura): catálogo de feitiços, requisitos, animação, gesto, hieróglifo, custo/limite e efeito.
- `src/training-room.js` (etapa futura): expõe alvos/objetos com capacidades de reação, sem codificar os feitiços dentro de cada objeto.
- `src/main.js`: conecta entrada, personagem, inventário, magia, alvos e mensagens.

Os itens e as capacidades dos alvos devem ser definidos por dados. Assim, um feitiço poderá agir em qualquer objeto compatível no mundo, e a sala de treinamento apenas terá alvos que demonstram essas capacidades.

A pesquisa e o catálogo inicial dos feitiços agora estão em `docs/MAGIC-SPELLS-STUDY.md`. O documento separa a lista dos oito favoritos do guia, comandos adicionais do material oficial e efeitos como levitação que aparecem nos romances sem Divine Word identificada.

## 7. Preparação para a etapa de magia

O *Guia de Sobrevivência* descreve oito feitiços favoritos e a aparência da magia: hieróglifos azuis ou dourados brilham no ar por um instante antes de sumir. O catálogo de implementação será documentado em separado, com os nomes transliterados e os significados conferidos à edição consultada.

Os oito feitiços identificados são:

| Palavra | Significado |
|---|---|
| `HI-NEHM` | juntar / reparar |
| `HA-TEP` | ficar em paz |
| `HA-DI` | destruir |
| `A’MAX` | queimar |
| `TAS` | amarrar / envolver como casulo |
| `N’DAH` | proteger |
| `L’MUN` | esconder |
| `HA-WI` | atacar / golpear |

Fonte complementar para conferir a lista transliterada: material oficial de atividades publicado no site de Rick Riordan, “Kane Chronicles Celebration Kit” (atividade “Carter Says”). A edição portuguesa consultada mostra os significados e a aparência dos hieróglifos; alguns nomes aparecem como elementos gráficos na página.

Referências:

- https://rickriordan.com/book/survival-guide/
- https://rickriordan.com/wp-content/uploads/2016/04/Kane-Chronicles-Celebration-Kit.pdf
- https://padlet-uploads.storage.googleapis.com/631960996/0a4580bbfe1daab98e7b7aba4d621e13/Guia_de_Sobreviv_ncia___Rick_Riordan.pdf
- https://ara3dgen.com/docs/animations/

## 8. Animação e portabilidade

O Ara 3D Gen disponibiliza clipes de pegar objeto no chão, deixar objeto no chão e alcançar/pressionar com a mão direita. Esses clipes são bons pontos de partida, mas a retirada do Duat acontece no espaço do peito/mão, não no chão. A seleção final deve ser testada com o rig real; se necessário, será criado um pequeno clip próprio e empacotado para o Ara.

Não fixar a magia a um botão ou a um tipo de dispositivo. Desktop e mobile chamam as mesmas ações lógicas; teclado, clique e controles táteis são apenas entradas diferentes.

## 9. Critérios de QA

- [ ] Cajado, khopesh e shabti têm escala e orientação corretas na mão.
- [ ] O portal aparece na posição da mão, não no centro da tela nem no chão.
- [ ] O objeto não aparece duplicado durante a transição.
- [ ] Guardar e retirar repetidamente não deixa objetos órfãos nem sockets duplicados.
- [ ] A troca de cajado para khopesh recolhe o primeiro antes de mostrar o segundo.
- [ ] O personagem consegue guardar/retirar em qualquer zona explorável.
- [ ] Os objetos não atravessam o corpo e não deformam a mão durante walk, run, turn e idle.
- [ ] A mesma implementação funciona no desktop e no mobile em paisagem.
- [ ] A sala de treinamento reage aos objetos/alvos por capacidades, não por lógica exclusiva do botão.

Status de validação: implementação de código não equivale a aprovação visual; testes reais em navegador continuam obrigatórios.

## 10. Bancada de validação no preview

`character-preview.html` reutiliza `src/character.js` e `src/inventory.js` do jogo. A coluna “Inventário do Duat” permite retirar os doze itens, guardar o item ativo e observar o personagem em frente, perfil, costas e três-quartos. A ação `use_press` também pode ser acionada isoladamente no painel inferior.

A bancada ajuda a revisar escala, orientação, clipping, posição do portal e transição de mão. Ela não substitui o teste no mundo completo: colisões, iluminação real da casa, desempenho mobile e enquadramento em terceira pessoa ainda exigem inspeção no jogo.

