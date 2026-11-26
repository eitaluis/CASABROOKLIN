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

- [x] Implementado no código
- [ ] Em andamento
- [ ] Aguardando escolha/decisão
- [ ] Aguardando teste visual
- [ ] Próxima etapa

## Setor 01 — câmera e controles

- [x] Afastar levemente a câmera para 3,2 unidades (antes 2,65).
- [x] Inverter o eixo vertical: arrastar o mouse/toque para baixo eleva a câmera.
- [x] Impedir que a câmera atravesse o piso da área atual, inclusive durante o smoothing.
- [ ] Testar câmera em órbita frontal/traseira, zoom e limite de piso em desktop e mobile.

## Setor 02 — personagem e movimento

- [x] Inclinação frontal sutil no sprint e inclinação lateral nas mudanças de direção.
- [ ] Escolher base de personagem (ver CHARACTER-OPTIONS.md).
- [ ] Personalizar idade aparente, rosto, cabelo, pele, proporções e figurino após a escolha.
- [ ] Refinar idle, pisadas, transferência de peso, aceleração, frenagem e curvas.
- [ ] Ajustar corrida com lean estilo anime/ninja sem exagero e sem perder contato dos pés.
- [ ] Validar rig, clips e encaixe WeaponR no novo modelo.

## Setor 03 — inventário e combate

- [x] Inventário inicial com cajado mágico e khopesh egípcio.
- [x] Encaixe no osso WeaponR quando disponível; fallback temporário se o bone não existir.
- [x] Equipar/guardar/usar: desktop I abre inventário e F usa; mobile tem Mochila e Usar.
- [ ] Testar orientação/escala na mão direita em idle, walk e run.
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

1. Escolher A, B ou C em CHARACTER-OPTIONS.md.
2. Testar câmera, biblioteca, lareira, iluminação e inventário.
3. Corrigir os erros visuais encontrados antes de avançar para novos setores.
