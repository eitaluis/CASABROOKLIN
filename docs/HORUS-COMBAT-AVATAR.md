# Avatar de Combate de Hórus

Data: 28/11/2026  
Projeto: CASABROOKLIN  
Status: reconstrução estrutural integrada; QA visual desktop/mobile pendente

## Fonte canônica e limites da interpretação

Em *The Red Pyramid*, capítulo 38, “The House Is in the House”, Carter e Hórus agem em uníssono no combate contra Set. O Avatar de Combate envolve Carter, eleva-o do chão e manifesta a figura de um guerreiro com cabeça de falcão que acompanha os movimentos de Carter.

A passagem não determina uma anatomia completa, dimensões exatas, armadura, joias, asas ou textura. O usuário aprovou a interpretação visual de um guerreiro-falcão humanoide, corpo inteiro dourado e translúcido, sem ornamentos, com Carter suspenso no centro do torso. A proporção de três alturas de Carter é uma decisão de escala de produção aprovada para esta reconstrução.

Referência textual digital consultada:  
https://www.jkmedina.com/uploads/1/3/2/3/13236122/rick_riordan_-_kane_chronicles_1_-_the_red_pyramid.pdf

## Referências visuais e de movimento

- **Gor Game Ready**, RenderHub: https://www.renderhub.com/andryuha1981/gor-game-ready-1 — referência de silhueta falconídea; pago e excessivamente ornamentado; não importado.
- **KinemIQ animation library**: https://kinemiq.app/animations/ — biblioteca de animações com exportação GLB/glTF/FBX/BVH e permissão de uso comercial segundo a página do serviço. Referências selecionadas: “Idle - in the air”, “Move - launched into the air”, “Jump - take-off” e “Spell - start”.
- A licença/crédito deve ser conferida na informação de cada entrada individual antes de redistribuir qualquer exportação. Nenhum arquivo de animação KinemIQ foi baixado ou integrado nesta etapa.
- A malha humana aprovada de Carter no Ara 3D Gen permanece preservada.

## Direção aprovada

- Avatar independente, com corpo humanoide falconídeo completo e cabeça de falcão.
- Altura-alvo de 3× Carter, com pés ancorados ao piso.
- Carter visível e suspenso no centro do torso/abdômen.
- Corpo inteiro dourado, translúcido e emissivo, sem armadura, joias, asas ou ornamentos.
- O guerreiro acompanha a orientação e a pose de Carter: locomoção, recuo, corrida e ações.
- Mesmo runtime e mesma cena no desktop e no celular em paisagem.

## Implementação

- A hierarquia óssea Ara é clonada para sincronizar transformações, mas as malhas humanas clonadas ficam ocultas.
- Volumes anatômicos próprios (peitoral, abdômen, pelve, braços, antebraços, mãos, coxas, pernas, pés, pescoço e cabeça) são adicionados à hierarquia de ossos; cabeça falconídea recebe bico, olhos e crista curta. Não há armadura.
- A escala do avatar é 3×, ancorada na origem do controlador. Carter permanece no root de movimento e sua malha sobe visualmente até a região abdominal.
- A invocação usa duas fases: Carter começa a flutuar; em seguida, a forma dourada cresce do piso para cima. Ao desativar, a sequência reverte e Carter retorna ao chão.
- As referências KinemIQ orientam a sequência; a animação de elevação e a flutuação são interpoladas proceduralmente no runtime. Um clip exportado ainda não foi retargetado ao rig Ara.

## Gameplay

- Desktop: tecla H capturada na fase capture do documento.
- Mobile: botão HÓRUS separado dos comandos comuns.
- Custo inicial: 40 pontos de energia; desativação sem custo.
- A habilidade não altera o controlador nem a colisão do personagem.

## QA pendente

- [ ] Confirmar no browser que o avatar tem 3× a altura do Carter e os pés permanecem no piso.
- [ ] Confirmar Carter dentro do abdômen/centro do torso, sem clipping ou ocultação.
- [ ] Conferir a anatomia falconídea e a cabeça em frontal, perfil e três-quartos.
- [ ] Conferir a sincronização em idle, caminhada, corrida, recuo, salto, socos e reações.
- [ ] Conferir a sequência: Carter sobe primeiro; o corpo dourado forma-se depois, dos pés à cabeça.
- [ ] Verificar transparência, bloom, ordenação de profundidade e FPS no mobile.
- [ ] Testar tecla H e botão HÓRUS em celular paisagem.

Código integrado não equivale a QA visual nem aprovação final. Esses itens só devem ser marcados após inspeção no navegador real.
