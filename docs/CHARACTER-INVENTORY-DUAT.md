# Carter — inventário, objetos do Duat e preparação para magia

Data: 26/11/2026
Status (27/11/2026): **12 objetos; quarterstaff Polyfork aprovado e integrado via GLTFLoader/WeaponR, agora monocromático bege; khopesh Vinish.dev aprovado e carregado em escala compacta (aprox. 42 cm), com lâmina significativamente estreitada/afinada; QA visual em navegador pendente**

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

Referência: Rick Riordan, *The Kane Chronicles Survival Guide*, páginas impressas 16–17 (conteúdo da caixa de Julius), seção “Hieroglyphs, Symbols & Commands”, pp. 68–70 (feitiços e regras de escrita) e seção “Artifacts of Power”, p. 131 (caixa de magia e Duat), conforme a edição consultada.

## 3. Catálogo inicial de objetos de Carter

| ID | Objeto | Função / estado | Base |
|---|---|---|---|
| `staff` | Cajado mágico | Quarterstaff reto monocromático bege, sem ponteiras cinzas ou faixas coloridas; GLB Polyfork com materiais uniformizados em bege; preso à mão direita pelo eixo central | O livro estabelece a função ofensiva do cajado, mas não fixa a aparência exata do cajado de Carter; asset Polyfork aprovado pelo usuário e integrado |
| `khopesh` | Khopesh | Arma corpo a corpo; empunhada na mão direita | Canônico; GLB Vinish.dev aprovado, escala reduzida e lâmina estreita/fina |
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

**Cajado de Carter — direção aprovada:** foi selecionado o modelo **Monk's Quarterstaff**, de Polyfork / Lucas Martinic. A página do autor descreve um bastão de madeira de 1,8 m, ponteiras de ferro e duas faixas de tecido enroladas na empunhadura; 496 triângulos, 1 material, GLB de 57 KB. O usuário aprovou esta aparência. A geometria do asset é preservada; a produção uniformiza todos os materiais em bege monocromático, conforme correção solicitada e aprovada.

**Canon textual e limite:** em *A Pirâmide Vermelha*, Zia entrega a Carter um novo cajado e explica a função ofensiva do bastão; o texto não determina a cor, a madeira, as ponteiras, as faixas ou a medida exata do cajado pessoal de Carter. A forma Polyfork é, portanto, uma direção de arte escolhida e aprovada, não uma descrição literal do romance. O texto oficial de Rick Riordan descreve o khopesh de Carter como arma usada pela guarda pessoal do faraó: https://rickriordan.com/extra/meet-the-kane-family/

**Integração no runtime (27/11/2026):** o GLB é carregado pelo `GLTFLoader` diretamente da CDN oficial do autor. O modelo mantém 1,8 m e a geometria original; os materiais são uniformizados em bege monocromático. O Ara Rigging define o osso `WeaponR` no centro da mão fechada; o eixo `+Y` sai do topo do punho. Como o GLB nasce no chão e é vertical, a malha recebe deslocamento local de `Y = -0.9 m`, colocando a mão no centro do bastão e alinhando seu comprimento ao socket. A integração é compartilhada por jogo e preview desktop/mobile.

**Fallback:** se a CDN falhar, o inventário mantém uma haste local com ponteiras metálicas e duas faixas de tecido na região de pega. O fallback protege a funcionalidade, mas não substitui visualmente o GLB aprovado. O asset externo permanece uma dependência de rede; a página Polyfork permite hotlink comercial sem atribuição para uso direto.

## 3.2 Cajado Polyfork — ficha de integração aprovada (27/11/2026)

| Campo | Especificação |
|---|---|
| Asset | [Monk's Quarterstaff — Polyfork](https://polyfork.dev/asset/monk-s-quarterstaff-cbdadd) |
| Criador | Lucas Martinic / Polyfork |
| Arquivo | [GLB runtime](https://polyfork.dev/cdn/monk-s-quarterstaff-cbdadd.glb) |
| Medidas publicadas | 0,08 × 1,8 × 0,08 m; origem no chão; eixo longitudinal vertical |
| Malha | 496 triângulos; 1 material; 57 KB |
| Forma | Haste longa de madeira, ponteiras de ferro e duas faixas de tecido para empunhadura |
| Licença | Uso comercial e hotlink permitidos sem atribuição; CC BY 4.0 para redistribuição do mesh com crédito |
| Socket | Ara `WeaponR`, centro da mão fechada, eixo `+Y` do punho |
| Transformação | Escala original preservada; posição local `(0, -0.9, 0)` para centrar o modelo de 1,8 m no socket; rotação original preservada |
| Fallback | Haste de madeira, ponteiras metálicas e faixas de tecido criadas localmente |
| QA | Integração de código confirmada; encaixe visual no jogo ainda precisa de inspeção em navegador |

A ficha distingue o objeto canônico (cajado como ferramenta ofensiva) da forma Polyfork escolhida como asset de produção. O modelo não foi retintado, remodelado nem adornado depois da aprovação.
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

- [ ] Cada um dos doze objetos tem escala, orientação, origem e ponto de pega revisados no rig real.
- [ ] GLB Polyfork permanece centrado na mão via `WeaponR` durante idle, walk, run, turn, ataque e retorno ao repouso.\n- [ ] Cajado: 2,00 m (acima dos 1,75 m de referência do rig Ara), haste reta, ponta superior discretamente alargada e sem ornamentos; validar leitura visual em close e à distância.
- [ ] Objetos pequenos, planos e compridos usam poses de pega adequadas, sem parecerem presos à ponta dos dedos.
- [ ] Dedos e polegar fecham de forma convincente por clip de mão compatível com o rig.
- [ ] O objeto não atravessa mão, braço, tronco, pernas ou cenário durante a locomoção.
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


### Estado por componente — 27/11/2026

- **Cajado Polyfork:** asset aprovado; materiais uniformizados em bege na branch de correção; browser QA da empunhadura ainda pendente.
- **Khopesh:** GLB Vinish.dev aprovado carregado na branch de correção; escala compacta e lâmina afinada; QA visual no rig ainda pendente.
- **Locomoção e comando F:** código atual ainda não executa uma postura armada convincente; opções Ara/KinemIQ serão apresentadas antes da implementação.
- **Retirada do Duat:** efeito antigo ainda está na `main`; novas propostas visuais foram apresentadas para escolha antes de qualquer alteração.


## 4. Revisão de proporções e materiais — 28/11/2026

- **Cajado:** o GLB aprovado da Polyfork continua sendo a geometria principal. Os materiais são clonados no carregamento e uniformizados em bege claro (`#CDBB98`), sem mapas de cor, metalizado ou diferenças cromáticas entre haste, ponteiras e faixas. O fallback procedural usa a mesma cor.
- **Khopesh:** o GLB aprovado de Vinish.dev é carregado com o pivot `Sword` centralizado na empunhadura. Escala aplicada nos eixos locais do modelo: `0.70 × 0.40 × 0.22`, resultando em comprimento nominal aproximado de 42 cm, largura e espessura bastante reduzidas. O fallback também foi redesenhado em proporção menor e lâmina fina.
- A redução é uma interpretação visual solicitada para o Carter, não uma medida canônica do romance. O livro estabelece o khopesh como espada curva egípcia, mas não determina essas dimensões específicas.
- A mesma implementação é compartilhada por desktop e mobile. Verificação visual real no navegador e inspeção da pegada no rig Ara ainda pendentes.
