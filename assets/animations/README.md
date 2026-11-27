# Animações e locomoção

## Carter — runtime atual

As animações são controladas pelo módulo compartilhado src/character.js e pela velocidade real de src/third-person.js. Desktop e mobile usam os mesmos clips, estados e parâmetros; somente a entrada muda (teclado/mouse ou joystick/toque).

### Locomoção

- **Idle:** respiração, pequenos movimentos de cabeça e transferência de peso.
- **Walk:** passada natural, flexão dos joelhos e braços em oposição.
- **Run:** passada mais ampla; o root externo permanece neutro e gira somente no eixo vertical, sem tombar para os lados.
- **Jump:** jump_start, jump_air e jump_land com arco físico vertical (impulso + gravidade) no controlador, compartilhado entre desktop e mobile.

A velocidade de locomoção é enviada ao blending do Ara a cada frame. Caminhada usa alvo de 1,7 m/s; corrida usa 4,2 m/s. A aceleração e desaceleração receberam uma resposta mais suave. A orientação do root usa apenas yaw, sem inclinação lateral ou frontal. Abaixo de 50% de vitalidade, o sprint é bloqueado e Carter usa crouch idle + walk_slouch em velocidade reduzida; o terceiro canal do blend usa o clip run distinto, sem duplicar walk_slouch.

### Ações cinematográficas

src/character.js lê o catálogo ANIMATIONS e só carrega os IDs existentes entre os candidatos:

- **look_around:** olhar ao redor; ação de fundo em loop.
- **talk_gestures:** gesticular enquanto fala; loop.
- **wave:** aceno de mão.
- **point:** apontar.
- **bow:** inclinar-se/cumprimentar.

O preview independente oferece botões para estas ações. Se um clip não estiver presente na versão publicada do catálogo, o botão correspondente é desativado. A locomoção retorna ao terminar uma ação de uma só execução ou ao pressionar RETOMAR.

### Movimento secundário dos acessórios

A bolsa transversal no quadril direito e o medalhão têm pivôs próprios no módulo src/character-accessories.js. O balanço é discreto e proporcional à velocidade; os acessórios são descartados junto com o personagem.

## Fonte e API

- Ara 3D Gen — https://ara3dgen.com/docs/animations/
- API JavaScript — https://ara3dgen.com/docs/library/
- O runtime consulta ANIMATIONS antes de pedir clips. O blending idle/walk/run, o mixer e hero.update(delta) seguem a API oficial.

## QA pendente

- Confirmar que os IDs de cada ação aparecem na versão carregada e que os botões funcionam.
- Verificar as transições idle/walk/run/salto.
- Verificar contato dos pés e ausência de deslizamento em curvas.
- Observar a bolsa no quadril direito durante caminhada, corrida, mudança de direção e salto.
- Conferir o medalhão e a alça sem clipping no pescoço, ombro e tronco.
- Testar Chrome desktop e celular em modo paisagem.
- Marcar como aprovado somente depois de inspeção no navegador real.
## Combate e recursos do jogador

- Os quatro Shabtis usam aproximação com passada, preparação de golpe, balanço de espada com articulação de cotovelo, movimento do escudo e recuperação. A animação procedural usa as peças/pivôs já existentes no modelo; não importa um esqueleto externo incompatível.
- Quando um golpe conecta, o callback global reduz a vitalidade, toca hit_front, aplica tremor curto de câmera e uma vinheta vermelha periférica.
- VITALIDADE inicia em 100 e perde 20 pontos por acerto dos Shabtis (cinco segmentos internos na prova). A 50 ou menos, Carter entra no estado cansado/agachado e não pode correr.
- ENERGIA inicia em 100 e regenera 8 pontos por segundo. HA-DI custa 30; o orbe de prática com cajado custa 12.
- A vitalidade é compartilhada entre ambientes e não é reiniciada ao sair da sala de treinamento. A energia recarrega continuamente até 100.

## Fonte externa estudada para combate

- **KinemIQ Free Game Animations (CC0 1.0):** pacote aberto com 35 clips em FBX/GLB num esqueleto humanoide de 66 ossos a 30 fps; inclui sword slash/idle/block, crouch, fases de salto e reações de impacto. A biblioteca é uma boa fonte futura para movimentos armados do Carter. O pack ainda não foi importado no runtime.
- **Compatibilidade:** Ara aceita animações FBX/GLB/glTF/BVH como content packs e retargeta os clips ao seu próprio rig. O fluxo documentado é `npx ara3d pack <pasta>`; cada clip passa a ser listado sob o ID do pack. Antes de adotar um movimento, testar a mão na arma, direção do root motion, pés no chão e transição de retorno ao idle.
- **Shabtis:** os quatro guerreiros atuais são grupos procedurais articulados, sem esqueleto humano skinado. O movimento de aproximação, preparação, golpe e recuperação foi animado nos pivôs próprios de ombro/cotovelo/escudo/pernas. Não aplicar diretamente um clip humanoide a esse modelo sem primeiro criar/retargetar um rig compatível.

Fontes: https://github.com/Kinemiq/free-game-animations · https://ara3dgen.com/docs/packs/ · https://ara3dgen.com/docs/animations/
