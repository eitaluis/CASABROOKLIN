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
- [x] Manter pele negra, cabelo crespo escuro, camiseta azul, calça cargo cáqui e tênis azul-marinho.
- [x] Criar a primeira versão local do Carter em `src/character.js` e substituir o carregamento Ara remoto no runtime.
- [x] Criar rig articulado com bones humanoides e socket `WeaponR` na mão direita; inventário existente segue conectado.
- [x] Recriar localmente corpo, aba, ferragens e alça vestível da bolsa de referência Innerscene; quadril direito e alça cruzando peito. **O GLB original não foi integrado; a geometria atual é uma recriação procedural local.**
- [x] Implementar idle, caminhada, sprint, lean frontal, braços recuados no sprint, salto, aterrissagem e balanço secundário da bolsa.
- [x] Criar `character-preview.html` com o mesmo módulo de personagem do jogo, controles de animação e vistas frontal, lateral e traseira.
- [ ] Testar a aparência do modelo no navegador real: rosto, proporção, cabelo, costuras, roupa, alça e bolsa.
- [ ] Observar articulações/possíveis junções entre meshes durante curvas, sprint e saltos. A primeira versão usa peças parentadas aos bones, não um único SkinnedMesh com skin weights.
- [ ] Confirmar posição de cajado e khopesh no socket `WeaponR` em idle, walk e sprint.
- [ ] Validar o mesmo modelo e as mesmas animações no desktop e no celular em modo paisagem.
- [ ] Avaliar em fase futura retarget dos clips Mesh2Motion (Sprint, Run_Anime, NinjaJump, Land_Three_Point e Wall_Run) se o movimento procedural precisar de mais variedade.

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

1. Abrir character-preview.html e ajustar proporções, rosto e leitura da bolsa; o primeiro Carter local já está no runtime.
2. Testar o jogo real no desktop e mobile: walk, sprint, giros, saltos, teleporte e armas. Depois comparar clips Mesh2Motion para eventual refinamento.
3. A integração inicial usa uma recriação procedural da bolsa Innerscene; avaliar se o GLB original pode ser baixado/importado posteriormente.
4. Usar character-preview.html para aprovar visualmente o modelo 3D e ajustar a primeira versão.
5. Após teste visual, refinar articulações/skin weights se necessário; o modelo e a animação atuais já são compartilhados entre desktop e mobile.
