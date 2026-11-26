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
- Escala: inscrição final aproximadamente 24% menor que a versão anterior, sem perder legibilidade.
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
