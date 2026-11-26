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

- [x] Carter Ara 3D Gen anterior restaurado; redesigns experimentais descartados
- [x] Nova camada visual do Grande Salão implementada no módulo compartilhado
- [x] Escadarias laterais, corrimãos, colunas de lótus, estátua de Thoth e fogo orgânico criados
- [ ] Teste visual do Grande Salão em navegador real
- [ ] Ajustes de enquadramento, proporção e circulação após inspeção desktop/mobile

## Setor 01 — câmera e controles

- [x] Afastar levemente a câmera para 3,2 unidades (antes 2,65).
- [x] Inverter o eixo vertical: arrastar o mouse/toque para baixo eleva a câmera.
- [x] Impedir que a câmera atravesse o piso da área atual, inclusive durante o smoothing.
- [ ] Testar câmera em órbita frontal/traseira, zoom e limite de piso em desktop e mobile.

## Setor 02 — personagem e movimento

- [x] Restaurar exatamente a implementação Ara 3D Gen que precedeu o protótipo procedural, considerada mais interessante pelo usuário.
- [x] Remover do runtime a construção rejeitada de cápsulas/esferas/caixas.
- [x] Descartar o estudo Quaternius Casual_2 e pausar qualquer redesign.
- [x] Manter o carregamento Ara, rig humano e clips já aprovados anteriormente.
- [ ] Não alterar novamente o personagem até solicitação específica do usuário.

**Prioridade atual:** cenário e interiores; não integrar personagem novo nesta fase.

## Setor 03 — inventário e combate

- [x] Inventário inicial com cajado mágico e khopesh egípcio.
- [x] Encaixe no osso WeaponR quando disponível; fallback temporário se o bone não existir.
- [x] Equipar/guardar/usar: desktop I abre inventário e F usa; mobile tem Mochila e Usar.
- [ ] Testar orientação/escala na mão direita em idle, walk e run com o novo rig.
- [ ] Criar animações dedicadas de cajado, ataque de khopesh, defesa e troca.
- [ ] Adicionar relíquias, papiros e itens de história em slots de inventário.

## Setor 04 — Grande Salão

### Arquitetura e materiais
- [x] Aplicar textura procedural de calcário em blocos com variação tonal, bump e desgaste sutil nas paredes, piso, sacadas e colunas.
- [x] Aplicar textura de madeira com veios e bump às peças novas de mobiliário.
- [x] Substituir o eixo visual das quatro colunas por shafts com caneluras e capitéis de lótus esculpidos.
- [x] Acrescentar medalhão de cedro, frisos, relevos solares alados e pilastras junto à lareira.
- [x] Substituir os antigos balaústres cilíndricos por balaústres torneados, corrimãos curvos e filetes de latão.
- [x] Construir duas escadarias laterais com degraus de pedra arredondados, espelhos, filetes de bronze, corrimãos e patamares para as galerias.

### Peças de destaque
- [x] Substituir a estátua central geométrica por uma escultura de Thoth com túnica esculpida, cabeça e bico de íbis, olhos, braços, cetro, papiro e coroa lunar.
- [x] Recriar a lareira com lenha, brasas, várias línguas orgânicas de fogo em gradiente, faíscas e luz dinâmica.
- [x] Substituir os sofás quadrados por estofados de cantos suaves, almofadas, costuras e estrutura em madeira.
- [x] Substituir o tapete e a mesa de centro por versões ovais/circulares com motivos solares e detalhes de bronze.
- [x] Manter lustre, arandelas e estandartes da decoração anterior.

### QA ainda pendente
- [ ] Conferir a leitura de fogo, estátua, degraus, capitéis e mobiliário no navegador desktop.
- [ ] Conferir sombras, texturas, z-fighting e orientação dos relevos em visão 3/4 e de dentro do salão.
- [ ] Testar a circulação e confirmar se as escadas podem ser subidas; a primeira implementação é visual e ainda não faz a locomoção do controlador mudar de altura.
- [ ] Ajustar desempenho e densidade visual em mobile paisagem.
- [ ] Fazer a aprovação visual final antes de marcar o Grande Salão como concluído.

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

1. Abrir o Grande Salão no navegador e avaliar o novo conjunto: escadas, estátua de Thoth, fogo, colunas e mobiliário.
2. Corrigir quaisquer problemas de escala, câmera, clipping, materiais ou circulação identificados nessa inspeção.
3. Testar desktop e mobile em modo paisagem, mantendo o mesmo mundo e os mesmos assets.
4. Somente após a inspeção visual, marcar o Grande Salão como aprovado e passar à próxima área.
