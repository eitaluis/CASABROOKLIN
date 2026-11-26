
# Magia egípcia — estudo canônico e plano de implementação

Data: 26/11/2026  
Projeto: CASABROOKLIN  
Status: **pesquisa canônica concluída; primeiro protótipo jogável HA-DI integrado ao código; QA visual desktop/mobile pendente**

## 1. Como ler esta ficha

Esta pesquisa separa:
- **Canônico:** palavra, significado ou efeito identificado nos livros/material oficial.
- **Exemplo narrativo:** uma situação específica descrita na série.
- **Adaptação de gameplay:** gesto, alcance, tempo, impacto, partículas, custo, cooldown e reação que criaremos para o jogo.

Os oito feitiços seguintes são apresentados pelo *Kane Chronicles Survival Guide* como favoritos dos magos. Não são uma lista completa de toda a magia que aparece na série.

## 2. Regras do sistema mágico nos livros

O *Kane Chronicles Survival Guide*, na seção “Hieroglyphs, Symbols & Commands”, páginas impressas 68–70, apresenta estas regras:

- Quando um mago **fala** um feitiço, hieróglifos azuis ou dourados aparecem no ar como se estivessem queimando e desaparecem pouco depois.
- Feitiços também podem ser escritos: o guia diz que qualquer idioma pode ser usado, mas que hieróglifos são a linguagem da magia.
- Os símbolos desenhados podem convocar o objeto ou criatura representado a partir de Ma’at. O guia recomenda papiro (ou papel) e um cálamo/estilete.
- Ao desenhar um ser vivo, o símbolo deve ficar incompleto: desenhar a criatura inteira pode trazê-la à vida.
- A magia pode ser muito poderosa e exige cautela.

Na seção “Artifacts of Power”, página impressa 131, o guia descreve a caixa de magia: o conteúdo varia conforme o dono e pode incluir papiro, estilete, tinta, cera para shabtis e amuletos. Um mago habilidoso pode guardar essa caixa no Duat e acessá-la quando necessário.

**Decisão visual para o jogo:** os hieróglifos serão uma inscrição tridimensional suspensa à frente de Carter, não um ícone de HUD. O brilho azul/dourado, a aparência breve de combustão e o desaparecimento vêm do guia. Bloom, faíscas, som, fumaça, distorção e intensidade serão escolhas de gameplay.

## 3. Oito feitiços favoritos

| Palavra | Significado no guia | Base canônica | Adaptação inicial proposta |
|---|---|---|---|
| **HI-NEHM** | “juntar”; também “consertar” | Reunir/reparar. Amos usa o comando para consertar um prato quebrado. | Atrair fragmentos e recompor objetos que declarem `repairable`. |
| **HA-TEP** | “estar em paz” | Comando associado à paz. | Acalmar uma criatura/espírito `calmable`. O efeito de pacificação é adaptação, não uma regra universal explicitada pelo guia. |
| **HA-DI** | “destruir” | Destrói. Sadie arrebenta uma porta trancada com o comando; a cena descreve uma explosão dramática. | Pulso de destruição. Um alvo `breakable` pode rachar, desmontar ou explodir conforme material e resistência. |
| **A’MAX** | “queimar” | Queima/produz fogo. | Chama ou rastro de fogo; reação apenas em alvos `burnable`. Não confundir com HA-DI: fogo e destruição são comandos diferentes. |
| **TAS** | “amarrar” ou “encasular” | Envolver/prender como um casulo. | Faixas/filamentos mágicos prendem um alvo `bindable` e limitam seu movimento temporariamente. |
| **N’DAH** | “proteger” | Proteção. | Escudo ao redor de Carter ou de um alvo; absorção/atenuação de impacto como regra de gameplay. |
| **HA-WI** | “golpear” | Ataque/impacto. Em `The Serpent’s Shadow`, Carter usa o comando e uma mão azul de energia atinge um inimigo, empurrando-o. | Punho/onda de força; impulso em alvos `forceable` ou `impactReceiver`. |
| **L’MUN** | “esconder” | Ocultar. | Tornar Carter ou um objeto `hideable` menos visível por um período, com efeito de ocultação progressiva. |

### Exemplos específicos dos romances

- **HI-NEHM:** Amos repara um prato quebrado em `The Red Pyramid`, p. 74.
- **HA-DI:** Sadie destrói uma porta trancada em `The Red Pyramid`, p. 87. A cena descreve a porta explodindo dramaticamente; é uma referência boa para o boneco de treino se despedaçar, mas a intensidade deve depender do alvo.
- **HA-WI:** Carter projeta uma mão azul de energia contra Bloodstained Blade em `The Serpent’s Shadow`, p. 337 na edição consultada. É a referência narrativa mais clara para ataque com gesto do punho.

A análise de Frances Foster confirma a ligação entre palavra falada, hieróglifo luminoso e ação. O artigo destaca HI-NEHM e HA-DI e remete às passagens de *The Red Pyramid* acima.

## 4. Outros comandos em material oficial de apoio

O `Kane Chronicles Egyptian Celebration Kit`, publicado por Disney Hyperion, lista outros comandos usados por Carter e Sadie:

| Palavra | Significado publicado | Possível função no jogo |
|---|---|---|
| **HEH-SIEH** | “voltar” / “retroceder” | Recuar um alvo ou reverter movimento, depois de confirmar o contexto narrativo. |
| **HEQAT** | Invocar um cajado | Chamar o cajado para a mão. Pode coexistir com o inventário do Duat, mas precisamos definir qual é o método de Carter. |
| **W’PEH** | “abrir” | Abrir porta, fechadura ou recipiente compatível. |

O kit chama esses itens de “Egyptian commands”; não os apresenta como lista exaustiva. Eles ficam catalogados separadamente dos oito favoritos do guia.

### Outros comandos no glossário de The Serpent’s Shadow

O glossário do terceiro romance, páginas impressas 488–489 na edição consultada, registra também:

| Palavra / expressão | Significado no glossário | Possível uso a investigar |
|---|---|---|
| **DROWAH** | “Boundary” / limite | Marcar limite ou criar uma fronteira mágica |
| **FAH** | “Release” / libertar | Soltar uma contenção ou liberar algo |
| **HAPI, U-HA EY PWAH** | “Hapi, arise and attack” | Invocar/ordenar ataque associado a Hapi |
| **ISFET** | “Chaos” / caos | Conceito ou comando ligado ao caos; não atribuir um efeito sem localizar a cena |
| **MA’AT** | “Restore order” / restaurar a ordem | Magia avançada de restauração da ordem contra o caos |
| **MAW** | “Water” / água | Comando relacionado à água |
| **MED-WAH** | “Speak” / falar | Comando de fala |
| **SA-HEI** | “Bring down” / derrubar | Trazer algo abaixo ou derrubar |
| **SE-KEBEB** | “Make cold” / esfriar | Produzir frio ou reduzir temperatura |

O glossário também repete HA-DI, HA-TEP, HA-WI, HI-NEHM, N’DAH e TAS com seus significados. Não é uma lista exaustiva: é o conjunto de comandos reunido no glossário do livro. Quando a cena não mostra o que o comando faz, não devemos completar a lacuna com um efeito inventado.

**MA’AT como exemplo avançado:** em *The Serpent’s Shadow*, Sadie pronuncia Ma’at para restaurar a ordem diante da magia do caos de Apophis. A análise de Frances Foster observa que ela precisa focar no hieróglifo e internalizar/realizar a ação, não apenas pronunciar uma palavra. Isso é uma boa referência para feitiços avançados que exigem gesto e concentração, mas a animação específica será adaptação.

## 5. Levitação — efeito canônico, palavra não identificada

A levitação é um efeito explicitamente mencionado em `The Throne of Fire`. Sadie sugere lançar um feitiço de levitação sobre uma estátua grande para movê-la. No trecho consultado, porém, não é pronunciada a Divine Word correspondente.

Portanto:
- podemos implementar levitação como efeito canônico;
- não devemos inventar uma palavra egípcia e atribuí-la ao livro;
- o identificador técnico pode ser `levitate`, mas `divineWord` deve permanecer `null` até aparecer uma passagem que identifique o comando;
- na sala de treinamento, um alvo pode subir, flutuar, girar e descer.

## 6. Como a conjuração deve acontecer no corpo

Os livros não estabelecem uma animação universal para todos os feitiços. Há ações narrativas específicas: Carter projeta o punho no HA-WI; outras magias usam cajado ou varinha. Cada gesto será uma **adaptação visual fundamentada**, não uma pose alegadamente canônica.

Fluxo proposto:
1. **Preparação:** Carter para de caminhar e orienta tronco, cabeça e mão/instrumento.
2. **Gesto:** movimento corporal próprio daquele feitiço; não reutilizar a animação de retirada do Duat como se fosse conjuração.
3. **Palavra:** a palavra é pronunciada no instante do gesto (voz ou legenda opcional).
4. **Hieróglifo:** a inscrição azul ou dourada aparece no ar à frente do personagem e permanece legível por uma fração de segundo.
5. **Efeito:** a magia parte da inscrição/gesto e segue ao alvo ou área.
6. **Reação:** o alvo responde de acordo com suas capacidades declaradas.
7. **Recuperação:** Carter retorna à locomoção sem salto brusco de pose.

**Animações:** `use_press` é apenas a primeira ação de alcance criada para abrir o Duat. O clipe Ara estende o indicador como se tocasse um ponto à frente do tórax; não é a animação final de conjuração. Para os feitiços, vamos selecionar clipes Ara adequados e criar clips próprios/retargetados quando não houver gesto convincente. O movimento deve ser bloqueado durante a janela de conjuração no desktop e no mobile.

### Propostas de gesto para a primeira rodada (adaptação, não cânone)

| Feitiço | Gesto corporal a estudar | Direção do movimento |
|---|---|---|
| HI-NEHM | Mãos abertas aproximando e juntando fragmentos | Puxar para o centro e fechar as mãos no instante em que o objeto se recompõe |
| HA-TEP | Palma aberta voltada para o alvo, descendo devagar | Acalmar, sem gesto brusco; ombros relaxados |
| HA-DI | Braço armado e projeção súbita da mão para a frente | Impulso curto e forte, com recuperação controlada |
| A’MAX | Erguer o braço e desenhar um arco de liberação | A mão abre no ápice, como se liberasse uma chama |
| TAS | Desenhar um laço no ar com uma mão ou instrumento | Movimento circular que se fecha em direção ao alvo |
| N’DAH | Antebraços se fecham diante do tronco e se abrem | Criar uma barreira à frente do corpo ou do alvo protegido |
| HA-WI | Punho cerrado projetado para a frente | Golpe direto, coerente com a cena de Carter em *The Serpent’s Shadow* |
| L’MUN | Mão percorre o corpo/rosto e se fecha | Movimento de ocultar, acompanhado de desaparecimento gradual |
| Levitação | Palma voltada para cima e mão subindo | Elevar o alvo acompanhando a mão, sem associar palavra divina não identificada |

Esses gestos servem como brief de animação. Antes de selecionar clips Ara, precisamos testar se o movimento cabe no rig do Carter e se o objeto/hieróglifo fica visível na câmera de terceira pessoa. Se não houver clip convincente, a alternativa é criar um clip próprio ou retargetar um movimento compatível; não forçar `use_press` em todas as magias.

### Recarga e energia mágica

Em *The Serpent’s Shadow*, Carter explica que uma Divine Word não pode ser repetida logo depois de pronunciada: a espera pode durar vários minutos e, em alguns casos, horas. O mesmo trecho diz que palavras divinas consomem energia e que usar muitas em sequência pode esgotar o mago rapidamente; dominar um único hieróglifo pode levar anos.

**Regra de fidelidade:** o sistema precisa prever cooldown por Divine Word e um recurso de energia mágica. Os valores exatos de duração, custo e recuperação serão balanceamento de gameplay, não números canônicos. O cooldown deve ser por comando, não um bloqueio global que impeça usar toda a magia depois de lançar um único feitiço.

O exemplo de Carter também dá um efeito visual canônico para N’DAH: luz azul cintila ao redor da pessoa protegida. Isso sustenta a proposta de escudo, mantendo o formato/quantidade de dano absorvido como regra de jogo.

## 7. Arquitetura reutilizável

A magia será um sistema global, não uma função exclusiva da sala de treinamento:

- `src/magic-system.js` (etapa futura): catálogo de feitiços, requisitos, gesto, tempo do hieróglifo, alcance, custo/limite e execução.
- `src/character.js`: fornece rig, ações/gestos, sockets e API de olhar/pose; não guarda a lógica de HA-DI, A’MAX etc.
- `src/training-room.js`: fornece alvos e respostas específicas da sala, mas não define o significado do feitiço.
- `src/main.js`: conecta entrada, personagem, magia, alvo e feedback.
- Cada objeto/entidade do mundo expõe capacidades, por exemplo `breakable`, `burnable`, `repairable`, `levitable`, `bindable`, `calmable`, `hideable`, `forceable` e `impactReceiver`.

Exemplo conceitual de dados para HA-DI (não é código executável ainda):

| Campo | Valor |
|---|---|
| `id` | `ha_di` |
| `divineWord` | `HA-DI` |
| `meaning` | `destroy` |
| `targetCapabilities` | `breakable` |
| `castAnimation` | gesto de projeção de energia a definir |
| `glyphColor` | azul ou dourado, escolha de apresentação |
| `effect` | pulso destrutivo, com resposta condicionada ao material/resistência |

A arquitetura final poderá permitir feitiços globais e alvos por capacidades. **Exceção deliberada do primeiro protótipo:** HA-DI só pode atingir guerreiros Shabti despertos na Sala de Treinamento; não destrói portas, móveis, personagens ou objetos em outras zonas. Essa restrição foi solicitada para validar a interação com o alvo antes de generalizar o sistema.

## 8. Alvos de demonstração na sala

Os quatro guerreiros shabti e os três alvos circulares já existentes são o primeiro conjunto de teste. Um manequim articulado arcano pode ser acrescentado como **interpretação de gameplay** para receber:

- HA-DI: rachar, desmontar ou explodir em fragmentos de barro;
- A’MAX: queimar apenas se o material for inflamável;
- HI-NEHM: juntar novamente os fragmentos;
- TAS: ser envolvido por faixas mágicas;
- N’DAH: receber um escudo protetor;
- HA-WI: receber o punho/onda de energia e ser empurrado;
- levitação: subir e flutuar, sem atribuir uma Divine Word inventada.

O shabti pode reagir de modo diferente do manequim: HA-TEP pode tentar acalmá-lo; TAS pode imobilizá-lo; HI-NEHM pode recompor partes quebradas. A resposta deve considerar tipo de entidade, estado e resistência.

## 9. Hieróglifos — cuidado com a forma escrita

A transliteração que aparece no guia (HI-NEHM, HA-DI etc.) é apresentada para que o leitor consiga pronunciar o comando. Isso não significa que a grafia em alfabeto latino seja a escrita hieroglífica correta.

A pesquisa acadêmica identifica os valores associados aos exemplos de `The Red Pyramid`:
- HI-NEHM / “join”: transliteração acadêmica `ẖnm`;
- HA-DI / “destroy”: transliteração acadêmica `ḥḏ`.

O artigo reproduz os sinais usando a fonte tipográfica empregada nos livros. Antes de criar SVGs ou glifos definitivos, precisamos comparar a página impressa/ilustrada e verificar direção, composição e proporção. Não usar emojis ou caracteres hieroglíficos aleatórios como substitutos de uma inscrição específica.

## 10. Protótipo jogável HA-DI — 26/11/2026

### Esfera 1 — Carter / gesto de conjuração
- A cena original de The Red Pyramid descreve Sadie apontando com dois dedos e o polegar, como uma arma imaginária. Carter usa o mesmo gesto no jogo como adaptação de gameplay, não como atribuição canônica de uma animação a ele.
- O protótipo usa o clipe Ara Point como base do braço estendido. O código espelha a cadeia de articulações do indicador para o dedo médio da mão direita, preservando o polegar do clipe; o movimento é bloqueado durante a conjuração.
- A pose deverá ser revisada visualmente no rig real do Carter. Se o clipe não produzir a silhueta exata, será substituído por uma animação retargetada própria.

### Esfera 2 — hieróglifo e efeito HA-DI
- Sequência correta publicada para ḥḏ: **𓉔𓆓** (O4 + I10), reproduzida no artigo de Frances Foster.
- A inscrição dourada aparece suspensa no espaço, diante da mão direita, vinculada à posição/orientação do osso RightHand; não é HUD.
- O hieróglifo recebe brilho aditivo, anel de energia e breve aparência de combustão. Um pulso dourado percorre a distância entre a mão e o alvo.
- O texto é desenhado em Canvas com a família Noto Sans Egyptian Hieroglyphs como primeira opção e fallbacks do sistema. A fonte ainda não foi empacotada localmente; verificar a cobertura de glifos nos navegadores desktop/mobile.

### Esfera 3 — Shabti e consequência
- O feitiço procura somente um Shabti ativo, completamente desperto, na Sala de Treinamento.
- Requisitos de gameplay: distância entre **3,5 m e 12,5 m** e alinhamento frontal mínimo de **0,78** no produto escalar da direção de Carter com o alvo.
- Ao impacto, o Shabti desaparece como corpo inteiro e se divide em peças de faiança, com lascas adicionais de cerâmica e física simples de gravidade, rotação e ressalto.
- Os fragmentos permanecem no chão durante **10 segundos**; em seguida são removidos.
- O mesmo Shabti reaparece numa posição aleatória segura da quadra, em escala de miniatura, e repete a animação de despertar até voltar à forma de guerreiro e avançar contra Carter.
- O ciclo não consome a contagem dos quatro guerreiros da prova: HA-DI funciona como teste repetível do alvo, sem encerrar a atividade.

### Controles e arquivos
- Desktop: **G** para conjurar HA-DI.
- Mobile: botão **HA-DI**, exibido apenas durante a prova e habilitado quando há um Shabti válido à frente.
- src/magic-system.js: hieróglifo, gesto, pulso, impacto e temporização.
- src/character.js: socket da mão direita e adaptação dos dedos no clipe Point.
- src/training-room.js: seleção exclusiva do Shabti, fragmentação, permanência de 10 s e respawn aleatório.
- src/main.js + index.html: integração de entrada, HUD e botão touch.
- Desktop e mobile utilizam a mesma cena, personagem, lógica e VFX; apenas o controle é adaptado.

**Proveniência:** o repositório ThreeJS VFX foi estudado como referência de técnicas procedurais (MIT), mas nenhum código ou asset foi copiado para este protótipo. O efeito atual é código original da CASABROOKLIN em Three.js 0.165.0. A animação-base vem do runtime Ara 3D Gen já utilizado pelo projeto.

**QA ainda necessário no navegador:** confirmar que a mão direita e o hieróglifo se alinham corretamente em movimento real; verificar legibilidade do glifo nos dois dispositivos; testar alcance/frente, explosão, contato dos fragmentos com o piso, desaparecimento em 10 s e respawn repetido. A integração de código não equivale a uma aprovação visual final.

## 11. Próxima ordem de produção

A ordem de produção permanece:
1. finalizar e validar visualmente os objetos do Duat (escala, materiais, orientação e mão);
2. preparar o manequim arcano e as capacidades dos alvos;
3. implementar o sistema de conjuração reutilizável;
4. criar/selecionar animações específicas dos feitiços;
5. ligar hieróglifos, palavras e efeitos ao catálogo;
6. fazer a Sala de Treinamento demonstrar os efeitos;
7. testar os mesmos feitiços fora da sala, no desktop e no mobile.

**HA-DI é o primeiro protótipo integrado ao código.** Os outros feitiços continuam sem implementação. A ficha separa a descrição canônica da adaptação de gameplay e registra o QA visual ainda pendente para não confundir integração com validação final.

## Referências

- Rick Riordan, `The Kane Chronicles Survival Guide`, “Hieroglyphs, Symbols & Commands”, pp. 68–70; “Artifacts of Power”, p. 131. Página oficial do livro: https://rickriordan.com/book/survival-guide/ . Cópia de consulta usada para confirmar texto/paginação: https://www.scribd.com/document/514868471/Riordan-Rick-The-Kane-Chronicles-Survival-Guide-Disney-Book-Group
- Rick Riordan, `The Throne of Fire: The Kane Chronicles, Book 2`, trecho sobre mover uma estátua por levitação: https://www.bookreporter.com/reviews/the-throne-of-fire-the-kane-chronicles-book-2/excerpt
- Disney Hyperion, `The Kane Chronicles Egyptian Celebration Kit`, “Carter Says!”, p. 13: https://rickriordan.com/wp-content/uploads/2016/04/Kane-Chronicles-Celebration-Kit.pdf
- Frances Foster, “Shabti Robots and Hieroglyphic Spells: Rick Riordan’s Egyptians”, análise de HI-NEHM/HA-DI e da relação entre palavra, hieróglifo e ação: https://api.repository.cam.ac.uk/server/api/core/bitstreams/b07e467d-c970-425f-a484-64a37605f589/content
- Rick Riordan, `The Serpent’s Shadow`, cenas de HA-WI/N’DAH e cooldown de Divine Words (pp. 337–338), e glossário de comandos (pp. 488–489) na edição consultada: https://fliphtml5.com/znbfq/ihwj/03_-_The_Serpent%26%2339%3Bs_Shadow/
- Ara 3D Gen, catálogo de animações/interações (referência técnica, não fonte de cânone): https://github.com/olatunde85/3d-gen/blob/main/docs/animations.md
