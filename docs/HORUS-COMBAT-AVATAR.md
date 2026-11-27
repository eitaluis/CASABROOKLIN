
# Avatar de Combate de Hórus

Data: 27/11/2026  
Projeto: CASABROOKLIN  
Status: primeira integração técnica; QA visual desktop/mobile pendente

## Fonte canônica

Em The Red Pyramid, capítulo 38, “The House Is in the House”, Carter e Hórus agem em uníssono no combate contra Set. O Avatar de Combate se forma ao redor de Carter, eleva-o do chão e o envolve em energia dourada. Um guerreiro com cabeça de falcão acompanha os movimentos de Carter, perfeitamente alinhado às suas intenções.

Referência textual digital consultada:  
https://www.jkmedina.com/uploads/1/3/2/3/13236122/rick_riordan_-_kane_chronicles_1_-_the_red_pyramid.pdf

A passagem não descreve armadura completa, asas extensas, ornamentos ou dimensões exatas; esses detalhes não são assumidos como cânone.

## Referência visual e assets

- **Gor Game Ready**, RenderHub: https://www.renderhub.com/andryuha1981/gor-game-ready-1 — referência de proporção geral de guerreiro falconídeo. É um modelo pago e muito ornamentado para o objetivo; não foi comprado, baixado ou integrado.
- A malha aprovada de Carter no Ara 3D Gen permanece intacta.
- Nenhum modelo externo, textura ou rig foi importado para o Avatar.

## Direção aprovada

- Carter é a figura humana central, visível no interior da manifestação.
- O avatar é uma silhueta humanoide maior que o envolve, com proporção de guerreiro e cabeça de falcão.
- O corpo inteiro é dourado e translúcido; não recebe placas de armadura, joias, ornamentos, asas ou texturas detalhadas.
- A cabeça de falcão é uma interpretação geométrica simples: crânio, bico, olhos e penas curtas na nuca.
- O Avatar não é um NPC separado e não tem IA, controlador de locomoção ou mixer próprio.

## Sincronização técnica

- SkeletonUtils.clone(hero.scene) duplica a estrutura SkinnedMesh/skeleton do Carter.
- Depois de mixer.update(dt) e hero.update(dt), cada osso da cópia recebe posição, quaternion e escala do osso original.
- Morph target weights também são copiados quando existem.
- Como Carter e avatar compartilham CarterMovementRoot, direção e deslocamento são iguais. A cópia é ampliada suavemente e Carter recebe uma elevação visual discreta durante a manifestação.
- O material usa emissão dourada, transparência aditiva e depthWrite desligado. A cabeça e os olhos têm emissão mais forte para preservar a leitura da forma.

## Gameplay

- Desktop: tecla H para invocar/desfazer.
- Mobile: botão HÓRUS.
- Custo inicial: 40 pontos de energia na invocação. Não há custo para desfazer. O custo e o toggle são adaptações de gameplay.
- A habilidade está disponível nos ambientes jogáveis e não substitui Carter nem modifica os controles normais.

## QA pendente

- [ ] Confirmar Carter no centro do corpo ampliado, incluindo cabeça e pés.
- [ ] Confirmar que a cabeça de falcão cobre a silhueta do avatar sem ocultar Carter.
- [ ] Conferir sincronização em idle, caminhada para frente/trás, corrida, salto, socos e reações.
- [ ] Verificar transparência dourada em fundos claros/escuros e ordenação de profundidade.
- [ ] Testar tecla H e botão HÓRUS no mobile paisagem.
- [ ] Medir desempenho em celular.

A integração do código não significa aprovação visual. Marcar os itens somente após inspeção no navegador real.
