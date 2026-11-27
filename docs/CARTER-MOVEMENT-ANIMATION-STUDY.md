# Carter Kane — corrida, salto e combate

Data da implementação: 27/11/2026  
Status: **os seis clipes selecionados pelo usuário foram baixados, retargetados para Ara, validados no pack e conectados ao runtime compartilhado. A inspeção visual final em navegador desktop e mobile ainda está pendente.**

## Decisão de movimento

A corrida agachada sugerida na pesquisa anterior foi rejeitada pelo usuário e não é mais usada. O jogo utiliza as duas corridas indicadas diretamente pelo usuário: o sprint normal sem objeto e o sprint com objeto. A locomoção é uma interpretação de gameplay, não uma afirmação sobre uma postura canônica descrita nos livros.

## Clipes aprovados e integrados

| Estado/ação | ID KinemIQ | Clip Ara no jogo | Duração | Uso |
|---|---|---|---:|---|
| Sprint sem objeto | [Run — sprint](https://kinemiq.app/animations/run-sprint/) | `carter-moves/sprint_loop` | 0,67 s | Loop de corrida normal quando não há arma equipada |
| Sprint com objeto | [Run — sprint with a shield](https://kinemiq.app/animations/run-sprint-with-a-shield/) | `carter-moves/sprint_shield_loop` | 0,67 s | Loop de corrida com objeto quando cajado ou khopesh está em mãos; o jogo não cria um escudo |
| Salto | [Jump — ninja double](https://kinemiq.app/animations/jump-ninja-double/) | `carter-moves/ninjajump_double` | 0,90 s | Impulso/ação aérea do salto |
| Aterrissagem | [Jump — landing](https://kinemiq.app/animations/jump-landing/) | `carter-moves/jump_land` | 1,27 s | Absorção da aterrissagem após contato físico |
| Combo desarmado | [Punch — combo of punches and kicks](https://kinemiq.app/animations/punch-combo-of-punches-and-kicks/) | `carter-moves/melee_combo` | 2,27 s | Ataque sem item equipado |
| Combo com arma | [Sword — heavy combo](https://kinemiq.app/animations/sword-heavy-combo/) | `carter-moves/sword_heavy_combo` | 4,33 s | Ataque com cajado ou khopesh |

Todos os seis arquivos são identificados nas respectivas fichas KinemIQ como **CC0-1.0**, provenientes da Universal Animation Library ou da Universal Animation Library 2 de Quaternius. As licenças e URLs individuais estão registradas em `assets/animations/carter-movement-source-credits.json`. A página geral de fontes explica que o catálogo KinemIQ também contém outros movimentos CC BY 3.0 e CC BY 4.0; essas licenças não se aplicam aos seis clipes selecionados aqui.

## Integração ao rig e ao controlador

- Os seis GLBs são convertidos num Ara content pack com ID `carter-moves`; os clipes passam a ser endereçados como `carter-moves/<clip>`.
- `src/character.js` carrega o pack e seleciona `sprint_loop` ou `sprint_shield_loop` conforme o inventário informa se o cajado/khopesh está equipado.
- A caminhada permanece no ciclo `walk`; o clip de sprint é usado no estado de corrida rápida. A física horizontal do jogador continua no controlador, com `rootMotion: false`.
- O salto inicia `ninjajump_double`, enquanto `src/third-person.js` calcula impulso, gravidade, altura e colisões. A pose final do clip se mantém até o contato real com o piso; nesse instante começa `jump_land`. O retorno ao idle/locomoção só ocorre quando a aterrissagem termina.
- A tecla **F** e o botão de ataque/uso do inventário no mobile chamam a mesma ação: sem arma equipada, `melee_combo`; com cajado ou khopesh, `sword_heavy_combo`.
- O cajado/khopesh permanece ligado ao osso da mão direita, para acompanhar a animação da mão em vez de usar root motion independente.
- Desktop e mobile compartilham o mesmo rig, clips, física e ações; mudam apenas teclado/mouse ou joystick/botões de toque.

## Proveniência e build

- Pack runtime: `assets/animations/carter-movement.ara-pack.json`.
- Créditos por clip: `assets/animations/carter-movement-source-credits.json`.
- Build reprodutível: `scripts/build-carter-motion-pack.mjs`.
- Validação Ara: `npx ara3d pack check assets/animations/carter-moves.ara-pack.json`, executada pelo workflow `.github/workflows/build-carter-motion-pack.yml`.
- Documentação Ara: [locomoção](https://ara3dgen.com/docs/library/), [animações](https://ara3dgen.com/docs/animations/) e [content packs](https://ara3dgen.com/docs/packs/).

## QA pendente — não presumir aprovação visual

A validação automática prova a estrutura e o retarget do pack, não a aparência do Carter no jogo. Ainda falta conferir no navegador real:

- Frente, costas, lateral e 3/4 da corrida com e sem objeto.
- Pés no chão, cadência do sprint, transição walk → sprint → idle e ausência de deslocamento duplicado.
- Posição/pegada do cajado e do khopesh na mão durante corrida, curvas e combo.
- Arco do salto em piso plano e escadas, contato do pé, clipping e recuperação após aterrissar.
- Desktop e celular em paisagem, incluindo a tecla F e o botão de ataque móvel.

Até essa inspeção, a implementação está integrada e a validação automatizada passou, mas o movimento não deve ser marcado como visualmente aprovado.
