# HA-DI — primeiro protótipo de magia

Data: 26/11/2026  
Projeto: CASABROOKLIN  
Status: segunda iteração integrada ao código; validação visual no navegador pendente.

## Objetivo

Construir a primeira habilidade completa em três esferas coordenadas: Carter, inscrição mágica e consequência sobre o Shabti. O protótipo é intencionalmente restrito aos guerreiros Shabti despertos da Sala de Treinamento.

## Referência canônica

Em The Red Pyramid, p. 87 na edição consultada, Sadie usa HA-DI para destruir uma porta trancada. Ela aponta com dois dedos e o polegar, como uma arma imaginária; hieróglifos dourados aparecem sobre o cadeado e a porta explode, quebrando correntes e lançando lascas de madeira.

A análise acadêmica de Frances Foster identifica a palavra como ḥḏ e reproduz a sequência de sinais 𓉔𓆓 (O4 + I10). A relação entre palavra falada, hieróglifo luminoso e ação é central para a representação da magia na série.

Fontes:
- Rick Riordan, The Red Pyramid, p. 87: https://www.jkmedina.com/uploads/1/3/2/3/13236122/rick_riordan_-_kane_chronicles_1_-_the_red_pyramid.pdf
- Frances Foster, Shabti Robots and Hieroglyphic Spells: https://api.repository.cam.ac.uk/server/api/core/bitstreams/b07e467d-c970-425f-a484-64a37605f589/content
- Gardiner sign list: https://www.egyptianhieroglyphs.net/gardiners-sign-list/

A personagem que executa a cena do livro é Sadie. O uso do mesmo gesto por Carter é uma adaptação de gameplay aprovada para este protótipo, não uma afirmação de que Carter executa exatamente a mesma ação nessa passagem.

## Esfera 1 — Carter / corpo e gesto

- Carter para de se deslocar e gira o tronco para o Shabti válido.
- O clipe Ara Point continua como base para estender o braço direito e preservar o gesto de dois dedos + polegar.
- A cabeça e o pescoço permanecem na orientação neutra vertical do rig durante a conjuração; o personagem não usa rastreamento visual para baixo em direção ao Shabti.
- Uma pose procedural complementar flexiona levemente quadris e joelhos, baixa discretamente a pelve, inclina o tronco poucos graus para a frente e abre o braço esquerdo para estabilizar a posição de ataque.
- A pose é aplicada como offset sobre o clip base e suavizada na entrada/saída, sem substituir a animação Point.
- A mão direita fornece o socket espacial para posicionar o hieróglifo.
- Os controles de movimento ficam bloqueados durante a janela de conjuração.
- A pose volta à locomoção sem deixar dedos, pernas ou tronco presos na posição de feitiço.

O clipe Point é uma base técnica disponível no Ara 3D Gen; não é apresentado como gesto canônico do livro. Caso a revisão visual mostre que a silhueta dos dedos ou o braço não correspondem à referência, criar/retargetar um clipe próprio.

## Esfera 2 — hieróglifo e energia

- Palavra: HA-DI.
- Transliteração: ḥḏ.
- Sequência de sinais: 𓉔𓆓.
- Cor: dourado.
- Posição: suspenso diante da mão direita, no espaço 3D; nunca como ícone de HUD.
- Escala: inscrição final aproximadamente 20% menor que a versão anterior, sem perder legibilidade.
- Brilho: halo radial mais forte, texto mais claro, três anéis concêntricos e luz pontual local pulsante.
- Animação: materialização rápida, brilho aditivo, anéis em rotação e desaparecimento breve.
- Efeito: pulso dourado percorre o espaço entre a mão e o alvo.

O texto é desenhado em Canvas com Noto Sans Egyptian Hieroglyphs como primeira opção de fonte e fallbacks do sistema. A fonte não está empacotada localmente neste primeiro protótipo; verificar a cobertura de glifos no Safari/iOS e nos navegadores desktop. Se algum dispositivo não renderizar 𓉔𓆓, substituir por SVG vetorial validado e versionado localmente.

## Esfera 3 — Shabti / explosão, fragmentos e retorno

O feitiço só pode selecionar:
- um dos guerreiros Shabti já despertos pela atividade Whatever Works;
- que esteja completamente formado;
- dentro da Sala de Treinamento;
- entre 3,5 m e 12,5 m de Carter;
- dentro de um cone frontal determinado pelo alinhamento da direção do personagem com a direção do alvo.

Não afeta miniaturas inativas, portas, outros objetos, inimigos de outras zonas ou qualquer outro tipo de entidade. Não é um feitiço de destruição global.

No impacto:
1. O corpo inteiro do Shabti é removido da cena.
2. Cabeça, braços, escudo, espada e demais peças visíveis são separados em fragmentos independentes; o tronco contínuo é substituído por lascas adicionais de faiança.
3. Os fragmentos recebem impulso, gravidade, rotação e ressalto simples até assentarem no piso.
4. Cada peça permanece visível por pelo menos 10 segundos contados a partir do impacto.
5. Depois dos 10 segundos, cada peça inicia um fade individual, com início e duração levemente variados; a opacidade cai gradualmente durante aproximadamente 1,5–2,2 segundos, evitando que tudo desapareça ao mesmo tempo.
6. Ao concluir o fade, fragmentos e materiais temporários são removidos.
7. O mesmo estado de Shabti é reposicionado em uma localização aleatória segura da quadra.
8. Após o fade completo, por volta de 13,1 segundos após o impacto, a miniatura reaparece em outra posição, cresce na coluna de invocação já existente e volta a avançar contra Carter.

O ciclo de HA-DI não reduz a contagem da prova: isso permite testar o feitiço repetidamente sem encerrar a atividade com o primeiro acerto.

## Controles

- Desktop: tecla G.
- Mobile: botão HA-DI dentro dos controles touch; aparece somente quando a prova está ativa e há um Shabti válido à frente.
- A lógica de seleção, conjuração, efeito e alvo é compartilhada entre desktop e mobile.

## Implementação

| Arquivo | Responsabilidade |
|---|---|
| src/magic-system.js | Inscrição, pose acionada, pulso, impacto e temporização |
| src/character.js | Socket da mão direita e pose adaptada dos dedos |
| src/training-room.js | Seleção exclusiva do Shabti, fragmentos, timer e respawn |
| src/main.js | Entrada G, integração do sistema e estado do botão |
| index.html | Botão HA-DI mobile |

## Repositórios e proveniência

- Ara 3D Gen — https://github.com/olatunde85/3d-gen — runtime de personagem e clipe Point; código MIT, dados MakeHuman CC0 e movimentos CMU sob os termos documentados pelo projeto.
- ThreeJS VFX — https://github.com/majidmanzarpour/threejs-vfx — MIT; estudado como referência de VFX procedural e organização de efeitos. Nenhum código ou asset foi copiado.
- Three.js — https://github.com/mrdoob/three.js — MIT; runtime 0.165.0 já utilizado pela CASABROOKLIN.

O sistema HA-DI atual foi escrito como código original do projeto, sem dependência runtime adicional e sem importar assets de terceiros.

## Checklist de QA

- [ ] Carter fica de frente para o Shabti e interrompe a locomoção.
- [ ] O braço direito aponta para o alvo; indicador e dedo médio ficam estendidos e o polegar permanece aberto.
- [ ] O hieróglifo 𓉔𓆓 aparece diante da mão, não no centro da câmera.
- [ ] O glifo é legível e dourado no desktop e no mobile.
- [ ] O pulso sai da mão e atinge o Shabti correto.
- [ ] Shabti fora do alcance ou fora do cone frontal não é atingido.
- [ ] HA-DI não afeta outros objetos nem funciona fora da Sala de Treinamento.
- [ ] O corpo se divide em várias peças de faiança que caem e assentam no piso.
- [ ] Os fragmentos permanecem visíveis durante 10 segundos completos.
- [ ] Fragmentos desaparecem e o Shabti reaparece em posição aleatória segura.
- [ ] O Shabti desperta novamente e volta a perseguir Carter.
- [ ] O ciclo pode ser repetido várias vezes.
- [ ] Desktop e mobile mantêm a mesma sequência e resultado.

A integração no GitHub confirma que o código e a documentação foram adicionados; os itens de QA acima só devem ser marcados após teste visual no navegador.


### Correção de desempenho e gesto de lançamento (27/11/2026)

- **Causa provável do engasgo:** a versão anterior criava dezenas de Mesh/Sprite, geometrias e materiais individuais no momento do impacto. Na primeira conjuração, isso também podia exigir compilação de novos shaders e envio de muitos objetos à GPU no mesmo frame.
- **Pool persistente:** projétil, núcleo, flash, casca, ondas, sigilo e corte agora são construídos uma vez e reutilizados. Os 18 raios, 46 faíscas e 9 puffs de fumaça usam três `THREE.InstancedMesh`, mantendo os elementos e a duração do impacto, mas reduzindo draw calls e evitando criar/destruir dezenas de objetos em cada disparo.
- **Pré-compilação:** `magicSystem.prepare(renderer)` prepara os materiais de HA-DI numa cena temporária antes de liberar os controles. As texturas preservam o fallback Canvas e podem ser substituídas pelos sprites Kenney sem reconstruir os materiais.
- **Hieróglifo:** removidos o halo circular e os três torus que cercavam o glifo. A inscrição 𓉔𓆓 permanece como único elemento luminoso diante da mão.
- **Movimento:** Carter passa a usar o clipe `throw_grenade` do Ara 3D Gen como gesto corporal de lançamento, sem equipar nem desenhar uma granada. O pulso é liberado em 0,82 s, sincronizado com o marco de liberação descrito para o clipe; o gesto dos dois dedos e a compensação de cabeça ereta continuam ativos.
- **Referência de animação:** https://github.com/olatunde85/3d-gen/blob/main/docs/animations.md — categoria Shooter, `Throw grenade`; clipe de 2,2 s, liberação em 0,82 s. A documentação upstream identifica a origem CMU Motion Capture e os respectivos termos de uso.
- **Compatibilidade:** a mesma implementação atende desktop e mobile; os controles e a cena continuam compartilhados, com apenas os ajustes de resolução já existentes no mobile.
- **Validação:** sintaxe dos módulos e estrutura do manifesto verificadas. A fluidez real, a leitura da pose no rig e o FPS ainda exigem conferência num navegador desktop e num celular em modo paisagem; não foi feita captura de gameplay nesta alteração.


### HA-DI — postura de combate e impacto direto (27/11/2026)

- **Referência de animação no próprio rig Ara:** `fight_idle` (Fighting stance, 2 s, loop) e `point` (Point, 1,4 s). A implementação oficial do Ara descreve a guarda com pé esquerdo à frente, joelhos flexionados, mãos à altura do queixo e o Point estendendo o indicador direito e mantendo o apontamento. Fontes: https://github.com/olatunde85/3d-gen/blob/main/src/core/anim/clips/combat.ts e https://github.com/olatunde85/3d-gen/blob/main/src/core/anim/clips/emotes.ts.
- **Sequência:** Carter entra em `fight_idle`; após 0,26 s, a mão direita transita para `point`. A pose da guarda esquerda é capturada do clip `fight_idle` e mantida enquanto o braço direito aponta; a postura das pernas, pés e tronco é mantida por uma camada procedural alinhada aos ângulos do clip de combate. O gesto de dois dedos continua aplicado após o Point.
- **Impacto:** removido o projétil dourado e a curva de deslocamento. A explosão reutilizável é acionada diretamente no Shabti a 0,82 s, depois da extensão máxima do apontamento. O efeito de impacto e as partículas instanciadas permanecem iguais.
- **Recuperação:** o gesto Point termina no seu tempo nativo de 1,4 s, e a locomoção compartilhada é retomada ao fim da sequência. A compensação de cabeça continua a manter o olhar ereto.
- **Seleção de assets:** não foi importado um segundo esqueleto nem animação externa para o Carter. Ara é a fonte ativa e os IDs são confirmados pelo catálogo exportado `ANIMATIONS`; KinemIQ/Quaternius foi verificado como alternativa de clips CC0, mas rejeitado para esta versão por não trazer uma vantagem sobre os dois clips já retargetados no rig do personagem.
- **Compatibilidade:** a mesma sequência, captura da guarda, gesto e impacto são usados em desktop e mobile.
- **Validação:** sintaxe JavaScript, IDs de animação e ausência de projétil no módulo de magia foram verificadas. A leitura visual da transição e da mão esquerda ainda requer conferência no navegador real; não foi feita captura de gameplay nesta alteração.

### HA-DI — silhuetas orgânicas no impacto (27/11/2026)

- **Problema identificado:** o conjunto de impacto ainda usa sprites em quads para núcleo, círculo no piso, corte, faíscas e fumaça. Mesmo com texturas CC0 com transparência, a superfície base continua sendo retangular e o contorno podia ficar legível dependendo de textura, câmera e fallback.
- **Correção:** cada material com sprite recebe uma máscara GLSL procedural multiplicada ao alpha original. O ruído FBM distorce os limites do núcleo e das nuvens; faíscas e corte recebem silhuetas alongadas e afiladas; o sigilo no chão usa máscara anelar. Pixels externos são descartados, eliminando o contorno quadrado da placa.
- **Animação:** o campo de ruído recebe o mesmo relógio do impacto, de modo que as bordas da fumaça e do brilho se movimentam durante a explosão. As texturas Kenney CC0 permanecem como detalhe de superfície; o recorte é código original.
- **Referência técnica:** https://github.com/majidmanzarpour/threejs-vfx — repositório MIT de VFX procedural em Three.js/GLSL que usa silhuetas de fumaça, partículas e fragmentos calculadas no shader. Apenas a abordagem foi estudada; nenhum código foi copiado e nenhuma dependência foi adicionada.
- **Compatibilidade:** usa Material.onBeforeCompile e GLSL compatível com o renderer WebGL existente; desktop e mobile continuam no mesmo sistema.
- **Validação:** sintaxe JavaScript e presença das cinco máscaras/atualização temporal verificadas. A conferência visual em navegador e dispositivo físico ainda é necessária.