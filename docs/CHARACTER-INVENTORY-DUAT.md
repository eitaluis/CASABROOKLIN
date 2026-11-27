# Carter — inventário, objetos do Duat e preparação para magia

Data: 26/11/2026
Status (27/11/2026): **doze objetos; cajado e khopesh com GLBs abertos carregados via GLTFLoader e fallbacks locais; empunhadura centrada; esfera de energia 3D presa à mão; custo de 2 pontos por retirada; ataques com clipes de corpo inteiro; QA visual real ainda pendente**

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
| `staff` | Cajado mágico | Haste reta, muito fina, bege-clara, com a mão no meio; ferramenta mágica e arma empunhada na mão direita | Canônico como ferramenta; cor, silhueta exata e 2,00 m são direção de arte, não medidas literais de Carter; GLB Polyfork recolorido + fallback |
| `khopesh` | Khopesh | Espada curva egípcia compacta, empunhada na mão direita, em plano frontal e com a lâmina erguida | Arma canônica; GLB Vinish.dev CC BY 4.0 adaptado; 57 cm como direção de escala apoiada por exemplar histórico, não por medida do Carter no romance |
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

**Cajado:** não foi localizada uma descrição textual completa nem uma ilustração editorial confirmada do cajado pessoal de Carter que fixe cor ou diâmetro. A decisão atual é uma haste reta, bege-clara, fina (aprox. 2,4 cm de diâmetro após retintura/escala), com 2,00 m de comprimento de arte. A mão fica no ponto médio geométrico. Isso é uma direção visual aprovada para este protótipo, não canon do livro. O asset-base é o GLB “Monk's Quarterstaff”, de Polyfork/Lucas Martinic (496 triângulos, 0,08 × 1,8 × 0,08 m); o modelo é escalado no eixo longitudinal, retintado e posicionado com origem de empunhadura no centro. Os detalhes de ferro/tecido do asset ficam discretos sob o acabamento bege.

**Khopesh:** o romance estabelece a arma como uma espada curva egípcia, mas não dá a medida do khopesh pessoal de Carter. Como referência arqueológica, o exemplar E1530 da *Journal of the Society for the Study of Egyptian Antiquities* mede 57,79 cm. O modelo GLB de Vinish.dev tem 60 cm, 10.868 triângulos e pivot no centro do punho; foi reduzido para aproximadamente 57 cm, afinado no eixo de espessura e girado para manter a lâmina erguida no plano frontal. A proporção de 57 cm é uma escolha de gameplay/art direction coerente com o exemplar histórico, não uma medida escrita de Carter.

**Referência editorial:** a página oficial Read Riordan publica arte suplementar de Carter e Zia; a imagem de Carter empunhando o khopesh orienta a leitura da arma. A arte é referência visual, não malha 3D nem arquivo de runtime. O cajado bege de Carter permanece uma adaptação de arte, sem imagem oficial conclusiva identificada.

Os outros dez itens mantêm os seus modelos procedurais por enquanto. O papiro usa marcas gráficas abstratas, não hieróglifos ou palavras mágicas definitivas; a caixa ainda não abre e o amuleto não possui efeito mágico.

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

## 5. Retirada do Duat — sequência visual

A sequência continua diegética: a interface apenas seleciona; o gesto acontece no corpo 3D.

1. Carter leva a mão direita ao ponto de contato junto ao tórax com o clipe Ara `use_press`.
2. Uma esfera translúcida e volumétrica aparece **na própria mão**, não como círculo plano à frente do braço.
3. A energia envolve a palma e os dedos por uma casca esférica com fresnel, duas correntes helicoidais em 3D, partículas Kenney e luz local.
4. O objeto sai do centro da esfera, cresce até a escala de uso e fica preso ao socket da mão.
5. A esfera some e Carter retoma a locomoção.

Guardar repete a lógica em sentido inverso. O efeito é filho do socket da mão direita, para acompanhar o gesto e permanecer sincronizado em desktop e mobile. A esfera é uma adaptação visual de gameplay; o livro descreve o acesso ao Duat, mas não estabelece esse shader ou uma esfera de energia como representação literal.

**Energia:** cada retirada do Duat custa 2 pontos da barra compartilhada de 100. Guardar um item não custa energia. Se a energia for insuficiente, a ação não começa e o inventário permanece no estado anterior.

**Implementação nesta branch:** clipe `use_press` de corpo inteiro; esfera 3D que envolve a mão; texturas de partículas `kenney-magic-01`, `kenney-smoke-03` e `kenney-spark-07` (CC0); custo conectado ao `playerVitals.energy`. A malha do Carter não é substituída. O ajuste exato de posição/escala no rig real ainda precisa de inspeção no navegador.

## 6. Arquitetura técnica

- `src/inventory.js`: catálogo e estados dos itens, sockets configuráveis por `handBoneCandidates`/`fallbackSocketPosition`, retirada/armazenamento e efeito visual do portal.
- `src/character.js`: fornece rig, sockets e API de ações; carrega `sword_thrust` e `sword_combo` do Ara para ataques de corpo inteiro, sem girar a arma isoladamente.
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

O Ara 3D Gen fornece `use_press` para alcançar o Duat e os clipes `sword_idle`, `sword_combo` e `sword_thrust` para combate. F aciona `sword_thrust` com o cajado e `sword_combo` com o khopesh; como a arma está presa ao osso/socket da mão, o objeto acompanha braço e tronco animados pelo mesmo clip. O movimento é de corpo inteiro, não uma rotação aplicada ao objeto.

Não fixar a magia a um botão ou a um tipo de dispositivo. Desktop e mobile chamam as mesmas ações lógicas; teclado, clique e controles táteis são apenas entradas diferentes.

## 9. Critérios de QA

- [ ] Cada um dos doze objetos tem escala, orientação, origem e ponto de pega revisados no rig real.
- [ ] Cajado bege-claro e fino (aprox. 2,00 m de direção de arte) fica preso exatamente pelo meio do comprimento; validar a mão no centro em frente, perfil e costas.
- [ ] Khopesh proporcional (aprox. 57 cm), lâmina fina, erguida e orientada no plano frontal do Carter; validar em frente, perfil e 3/4.
- [ ] Ao pressionar F com cajado, o corpo inteiro executa `sword_thrust`; com khopesh, executa `sword_combo`; a arma acompanha o osso da mão e não se move isoladamente.
- [ ] Cada retirada custa exatamente 2 pontos; guardar não consome energia; energia insuficiente cancela sem deixar controle bloqueado.
- [ ] A esfera de energia contém visualmente a mão e os dedos; não pode virar um anel/disco frontal; as partículas percorrem o volume 3D.
- [ ] GLBs externos carregam sem bloquear a inicialização; em falha de rede/CORS, os fallbacks mantêm os itens visíveis e funcionais.
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



## 11. Assets e créditos — 27/11/2026

### Cajado
- Asset: [Monk's Quarterstaff — Polyfork](https://polyfork.dev/asset/monk-s-quarterstaff-cbdadd), de Lucas Martinic.
- Arquivo realmente carregado: [GLB](https://polyfork.dev/cdn/monk-s-quarterstaff-cbdadd.glb), 496 triângulos, 57 KB, dimensões nativas 0,08 × 1,8 × 0,08 m.
- Licença: uso comercial permitido; a página indica CC BY 4.0 para redistribuição do mesh e dispensa atribuição para o simples uso/hotlink. Crédito preventivo mantido em `docs/OPEN-SOURCES.md`.
- Adaptação: largura/espessura reduzidas a 30%, comprimento ajustado a 2,00 m, materiais retintados para bege-claro e origem deslocada para que a mão segure o ponto médio. Fallback procedural fino permanece ativo se a CDN falhar.

### Khopesh
- Asset: [Khopesh — Vinish.dev](https://vinish.dev/free-3d-models/swords), GLB 297 KB, 10.868 triângulos, dimensões nativas 0,60 × 0,13 × 0,04 m.
- Arquivo realmente carregado: [GLB](https://vinish-models.pages.dev/swords/khopesh.glb).
- Licença: CC BY 4.0; crédito obrigatório, mantido em `docs/OPEN-SOURCES.md`.
- A página documenta o nó `Sword` com pivô no meio do punho e lâmina ao longo do eixo +X. A adaptação gira a lâmina para ficar erguida no plano frontal, mantém cerca de 57 cm de comprimento e reduz a espessura. Fallback procedural compacto permanece para falha de rede.

### Energia do Duat
- Texturas de partículas realmente usadas: Kenney Particle Pack — `kenney-magic-01`, `kenney-smoke-03` e `kenney-spark-07`; pacote oficial CC0, já armazenado em `assets/vfx/`.
- Esfera, shader fresnel, tubos helicoidais, distribuição de sprites e animação são implementação original do projeto em Three.js. O pacote CC0 fornece as texturas, não a malha volumétrica.

### Animações de ataque
- Ara 3D Gen: `sword_thrust` (avanço/estocada) para o cajado e `sword_combo` (três cortes) para o khopesh; carregados pelo catálogo filtrado `ANIMATIONS`.
- A documentação Ara informa que `sword_combo` e `sword_thrust` começam e terminam em `sword_idle`; os clipes são de corpo inteiro e compatíveis com o pipeline Three.js do projeto.

### Canon versus direção de arte
- Canon: cajado usado como ferramenta mágica e arma; khopesh é espada curva; Carter usa khopesh em combate.
- Histórico: um exemplar E1530 de khopesh da época do Novo Império mede 57,79 cm.
- Não canon: cor bege do cajado, sua medida exata de 2,00 m, diâmetro de 2,4 cm, esfera de energia, 2 pontos de energia, rotação do GLB e escolha dos modelos comerciais livres. São opções de direção de arte e mecânica do jogo.

### Validação pendente
A branch contém a integração e fallbacks, mas a aprovação final depende de executar o preview e o jogo real em navegador. Conferir mão no centro do cajado, tamanho do khopesh, plano da lâmina, sincronização F/arma, esfera envolvendo os dedos e custo de energia em desktop e mobile.
