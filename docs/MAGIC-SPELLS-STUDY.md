
# Magia egípcia — estudo canônico e plano de implementação

Data: 26/11/2026  
Projeto: CASABROOKLIN  
Status: **primeiro levantamento canônico concluído; implementação dos feitiços ainda não iniciada**

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

O lançamento deve funcionar em qualquer zona explorável. Um alvo compatível no Grande Salão, biblioteca ou exterior deve reagir sem depender de estar na Sala de Treinamento.

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

## 10. Próxima ordem de produção

A ordem de produção permanece:
1. finalizar e validar visualmente os objetos do Duat (escala, materiais, orientação e mão);
2. preparar o manequim arcano e as capacidades dos alvos;
3. implementar o sistema de conjuração reutilizável;
4. criar/selecionar animações específicas dos feitiços;
5. ligar hieróglifos, palavras e efeitos ao catálogo;
6. fazer a Sala de Treinamento demonstrar os efeitos;
7. testar os mesmos feitiços fora da sala, no desktop e no mobile.

**Os feitiços ainda não foram implementados.** Esta ficha fixa a pesquisa canônica e a arquitetura para evitar programar efeitos ou palavras incorretos antes de validar os objetos e as animações.

## Referências

- Rick Riordan, `The Kane Chronicles Survival Guide`, “Hieroglyphs, Symbols & Commands”, pp. 68–70; “Artifacts of Power”, p. 131. Página oficial do livro: https://rickriordan.com/book/survival-guide/ . Cópia de consulta usada para confirmar texto/paginação: https://www.scribd.com/document/514868471/Riordan-Rick-The-Kane-Chronicles-Survival-Guide-Disney-Book-Group
- Rick Riordan, `The Throne of Fire: The Kane Chronicles, Book 2`, trecho sobre mover uma estátua por levitação: https://www.bookreporter.com/reviews/the-throne-of-fire-the-kane-chronicles-book-2/excerpt
- Disney Hyperion, `The Kane Chronicles Egyptian Celebration Kit`, “Carter Says!”, p. 13: https://rickriordan.com/wp-content/uploads/2016/04/Kane-Chronicles-Celebration-Kit.pdf
- Frances Foster, “Shabti Robots and Hieroglyphic Spells: Rick Riordan’s Egyptians”, análise de HI-NEHM/HA-DI e da relação entre palavra, hieróglifo e ação: https://api.repository.cam.ac.uk/server/api/core/bitstreams/b07e467d-c970-425f-a484-64a37605f589/content
- Rick Riordan, `The Serpent’s Shadow`, cena de HA-WI contra Bloodstained Blade (p. 337 na edição consultada): https://fliphtml5.com/znbfq/ihwj/03_-_The_Serpent%26%2339%3Bs_Shadow/
- Ara 3D Gen, catálogo de animações/interações (referência técnica, não fonte de cânone): https://github.com/olatunde85/3d-gen/blob/main/docs/animations.md
