# CASABROOKLIN — checklist de produção por setores

Atualizado: 26/11/2026

Este documento é a fonte de verdade do andamento. A cada nova solicitação, classificar os setores afetados, trabalhar neles isoladamente, atualizar este checklist e manter desktop/mobile sincronizados.

## Procedimento para toda solicitação

1. **Classificar o setor:** personagem, locomoção/animação, câmera/controles, cenário/interiores, iluminação/visual, inventário/interações ou desempenho/mobile.
2. Registrar o pedido e o resultado esperado neste documento.
3. Inspecionar os arquivos atuais e as dependências antes de mexer; não reaplicar correções antigas sem confirmar o código.
4. Implementar apenas o setor solicitado e dependências estritamente necessárias.
5. Replicar mudanças compartilhadas entre desktop e mobile.
6. Verificar sintaxe, imports, referências, cache-busters e documentação.
7. Distinguir **implementado** de **testado**. Não marcar como visualmente concluído sem teste real no navegador.
8. Atualizar estados e próxima ação no mesmo changeset.

## Estados

- [x] Decisão visual registrada
- [ ] Malha/rig final integrado
- [ ] Animações retargetadas
- [ ] Asset da bolsa integrado
- [ ] Teste visual desktop/mobile

## Setor 01 — câmera e controles

- [x] Afastar levemente a câmera para 3,2 unidades (antes 2,65).
- [x] Inverter o eixo vertical: arrastar o mouse/toque para baixo eleva a câmera.
- [x] Impedir que a câmera atravesse o piso da área atual, inclusive durante o smoothing.
- [ ] Testar câmera em órbita frontal/traseira, zoom e limite de piso em desktop e mobile.

## Setor 02 — personagem e movimento

- [x] Aprovar direção visual **C — Game 3D gráfico**: personagem totalmente 3D, formas limpas e legíveis, acabamento playful de videogame; sem anime e sem realismo de escaneamento.
- [x] Manter rosto humano natural, com proporções faciais críveis; sem olhos de anime ou proporções chibi.
- [x] Aprovar corpo jovem, lean/atlético e ágil, sem musculatura adulta exagerada.
- [x] Manter pele negra, cabelo crespo escuro, camisa azul e calça cáqui como direção de design.
- [x] Aprovar a bolsa transversal marrom CC0 apoiada no **quadril direito**, com alça cruzando diagonalmente o tronco.
- [x] Definir a referência de movimento: agilidade, inclinação do tronco, braços ativos, passadas e silhueta atlética inspiradas na movimentação de Naruto; não copiar rosto nem estética 2D.
- [x] Preparar estudo visual conceitual com vistas de frente, perfil, costas e poses dinâmicas. **É uma referência de look-dev, não um modelo 3D rigado nem o runtime.**
- [ ] Testar geração de personagem com detalhe baixo (5–10k triângulos) e materiais sem textura fotográfica; avaliar rosto e cabelo antes de escolher a base.
- [ ] Avaliar o rig de jogo de 65 ossos / Mixamo e o socket WeaponR, preservando compatibilidade com o inventário.
- [ ] Escolher e aprovar a malha-base/rig definitivo; o personagem atual continua no runtime até a aprovação.
- [ ] Personalizar idade aparente jovem, rosto negro natural, cabelo crespo curto, proporções e figurino.
- [ ] Adaptar o corpo da bolsa CC0 e refazer a alça para cruzar o peito; manter bolsa no quadril direito, sem mochila.
- [ ] Retarget e refinar idle, walk, jog, aceleração, frenagem, curvas, sprint, saltos e aterrissagens.
- [ ] Testar como referência os clips Mesh2Motion: Sprint, Run_Anime, NinjaJump_Start/Idle/Land, Land_Three_Point e Wall_Run.
- [ ] Ajustar sprint com lean, braços ativos e passadas amplas; manter contato dos pés e transições contínuas.
- [ ] Dar à bolsa balanço secundário discreto; evitar clipping em idle, walk, run e jump.
- [ ] Validar rig, clips e encaixe WeaponR no novo modelo.

## Setor 03 — inventário e combate

- [x] Inventário inicial com cajado mágico e khopesh egípcio.
- [x] Encaixe no osso WeaponR quando disponível; fallback temporário se o bone não existir.
- [x] Equipar/guardar/usar: desktop I abre inventário e F usa; mobile tem Mochila e Usar.
- [ ] Testar orientação/escala na mão direita em idle, walk e run com o novo rig.
- [ ] Criar animações dedicadas de cajado, ataque de khopesh, defesa e troca.
- [ ] Adicionar relíquias, papiros e itens de história em slots de inventário.

## Setor 04 — Grande Salão

- [x] Primeira decoração: lustre, arandelas, estandartes, placas, frisos e sofá refinado.
- [x] Substituir esferas soltas da lareira por chamas em camadas com flicker.
- [x] Clarear exposição e luz ambiente, reduzir força do SSAO.
- [ ] Testar visualmente lareira, iluminação, sombras e estátua de Thoth.
- [ ] Refinar instrumentos, armas, tapete e mobiliário.
- [ ] Integrar modelos Poly Haven CC0 com licenças e arquivos conferidos.

## Setor 05 — Biblioteca subterrânea

- [x] Substituir estantes genéricas por nichos de papiros, Nut, Geb e quatro shabtis.
- [x] Material da parede cilíndrica renderiza os dois lados.
- [x] Clareamento da tonalidade da parede.
- [ ] Testar face interna, profundidade, cúpula, piso e distribuição dos nichos.
- [ ] Ajustar luz ambiente e materiais para evitar aparência cinza/transparente.
- [ ] Criar interações de papiros e artefatos.

## Setor 06 — arquitetura, circulação e interiores

- [ ] Implementar subida/descida física pela escada em caracol, com altura dos degraus.
- [ ] Fazer o portal mágico funcionar como passagem física.
- [ ] Refinar terraço, piscina, refeições e fogueira.
- [ ] Refinar quarto do Carter, banheiro, deck e pavimentos.
- [ ] Construir enfermaria, treinamento e salas auxiliares como reconstruções interpretativas quando o texto não definir forma.

## Setor 07 — visual e desempenho

- [x] EffectComposer com SSAO no desktop e bloom em desktop/mobile.
- [x] Perfil de processamento reduzido para telas touch.
- [ ] Validar FPS, temperatura e estabilidade em celular e PC.
- [ ] Ajustar efeitos conforme desempenho real.
- [ ] Integrar PBR/HDRI CC0 selecionados.
- [ ] Fazer passe final de color grading e sombras de contato.

## Setor 08 — QA e entrega

- [x] Atualizar cache-busters dos módulos alterados.
- [ ] Verificar sintaxe estática de todos os módulos afetados.
- [ ] Testar no navegador desktop.
- [ ] Testar em celular em modo paisagem.
- [ ] Registrar novos bugs por setor antes de abrir a próxima etapa.

## Próximas ações

1. Criar um Carter-teste com base humana CC0 em detalhe baixo, materiais gráficos e proporções juvenis; comparar com o atual sem substituir o runtime.
2. Usar Mesh2Motion para validar o conjunto de locomoção, especialmente Sprint, Run_Anime, NinjaJump e aterrissagem em três apoios.
3. Inspecionar e adaptar o GLB da bolsa Innerscene; a malha da bolsa foi aprovada, mas a alça original fica deitada atrás dela.
4. Apresentar um preview 3D rigado e animado — não apenas uma prancha — para aprovação final.
5. Só então integrar o mesmo GLB, rig, bolsa e animações nas versões desktop e mobile.
