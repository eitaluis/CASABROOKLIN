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

- [x] Direção visual e posição da bolsa registradas
- [x] Base humana contínua e rig Ara restaurados no runtime
- [x] Bolsa transversal local integrada no quadril direito; GLB original não incorporado
- [ ] Teste visual do rosto, roupa, alça e bolsa em navegador real
- [ ] Teste de locomoção, clipping e sincronização desktop/mobile
- [ ] Animações atléticas adicionais retargetadas

## Setor 01 — câmera e controles

- [x] Afastar levemente a câmera para 3,2 unidades (antes 2,65).
- [x] Inverter o eixo vertical: arrastar o mouse/toque para baixo eleva a câmera.
- [x] Impedir que a câmera atravesse o piso da área atual, inclusive durante o smoothing.
- [ ] Testar câmera em órbita frontal/traseira, zoom e limite de piso em desktop e mobile.

## Setor 02 — personagem e movimento

### Brief visual atual aprovado para estudo
- [x] Visual **C — Playful 3D de aventura**: personagem humano estilizado, carismático, inteiramente 3D; sem anime e sem realismo fotográfico.
- [x] Movimento **B — Atlético ninja**: inclinação frontal no sprint, braços ativos/recuados, passadas amplas, mudanças de direção com transferência de peso e saltos com aterrissagem forte.
- [x] Roupa **A**: camisa azul casual, calça cáqui reta e tênis discretos.
- [x] Cabelo **A**: crespo curto, cachos definidos e laterais baixas.
- [x] Bolsa transversal conhaque permanece no quadril direito, com alça diagonal sobre o peito.

### Estudo e protótipo isolado — não integra o runtime
- [x] Gerar uma prancha conceitual de frente, perfil, costas e poses atléticas para orientar a identidade visual.
- [x] Pesquisar bases open-source personalizáveis e verificar a origem/licença dos modelos.
- [x] Escolher provisoriamente Quaternius Ultimate Modular Men / `Casual_2` como primeiro candidato técnico, carregado do repositório Ducz Character Creator; os modelos de origem são CC0 1.0.
- [x] Criar `carter-study.html`, preview independente com órbita, vistas, animações, recoloração e controles para ajustar bolsa/alça.
- [x] Registrar o estudo em `docs/CARTER-DESIGN-STUDY.md`.
- [x] Manter o GLB como dependência externa fixa por commit SHA. Não copiar o código do construtor Ducz; apenas visualizar o asset Quaternius CC0.
- [x] Confirmar que `index.html`, `src/main.js` e `src/character.js` do jogo não foram alterados nesta etapa.
- [ ] Conferir o modelo em navegador real e decidir se sua linguagem low-poly alcança o Playful 3D C ou se é angular demais.
- [ ] Conferir rosto, expressão e cabelo curto crespo. Substituir a peça de cabeça/cabelo se não corresponder ao brief.
- [ ] Conferir se a recoloração do Casual_2 produz o corte de camisa e calça adequado; se não, trocar as peças modulares.
- [ ] Ajustar bolsa e alça usando as vistas frontal, 3/4 e perfil; confirmar que o volume fica do lado externo do quadril direito.
- [ ] Testar sprint ninja, corrida lateral e rolamento; selecionar/retargetar depois clips adequados de salto e aterrissagem.
- [ ] Aprovar explicitamente a malha, o figurino, o cabelo, a bolsa e a locomoção antes de criar um GLB final.
- [ ] Após a aprovação, decidir se o asset deve ser armazenado localmente e só então planejar a integração compartilhada desktop/mobile.

**Regra desta etapa:** não substituir o Carter no jogo, não alterar o mundo, não alterar o inventário e não marcar o personagem como aprovado até receber feedback do preview isolado.

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
