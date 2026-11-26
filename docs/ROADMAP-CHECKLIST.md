# CASABROOKLIN — checklist de produção por setores

Atualizado: 26/11/2026 — exterior East River aprimorado; padrão asset-first aplicado

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
9. Para cada novo cômodo/área, seguir obrigatoriamente o [padrão asset-first](ASSET-FIRST-ROOM-BUILDING.md): pesquisar modelos, PBR, luz, colisão/interação e desempenho no GitHub antes de modelar.

## Estados

- [x] Carter Ara 3D Gen anterior restaurado; redesigns experimentais descartados
- [x] Nova camada visual do Grande Salão implementada no módulo compartilhado
- [x] Escadarias laterais, corrimãos e colunas de lótus criados
- [x] GLB Poly Haven Sofa 03 (CC0), texturas PBR CC0 e fogo volumétrico Housz (MIT) adicionados ao runtime
- [x] Collider e interação por proximidade implementados para sofás, mesa, estátua e lareira; E no desktop e INTERAGIR no mobile
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
- [x] Aplicar variação de blocos de calcário e material PBR de plaster com mapas normal/roughness às paredes, sacadas e colunas.
- [x] Piso recebe mapas PBR CC0 do ambientCG Tiles139.
- [x] Walnut PBR CC0 (color, normal e roughness) aplicado aos acabamentos e mesa.
- [x] Substituir o eixo visual das quatro colunas por shafts com caneluras e capitéis de lótus esculpidos.
- [x] Acrescentar medalhão de cedro, frisos, relevos solares alados e pilastras junto à lareira.
- [x] Substituir os antigos balaústres cilíndricos por balaústres torneados, corrimãos curvos e filetes de latão.
- [x] Substituir harpas/tambores/lanças placeholders por modelos sob medida: harpas arqueadas e cordas tensionadas, tambores com pele e amarrações, lanças com ponta foliácea de bronze e khopeshes de lâmina curva.
- [x] Substituir a TV em bloco por tela plana física refletiva e toggle de energia via E/INTERAGIR. Os modelos CC0 Poly Haven Television 01/02 foram avaliados e rejeitados por serem CRT, não plasma.
- [x] Acrescentar uma parede envidraçada panorâmica com montantes/travessas de bronze e colisores, mantendo a abertura das portas centrais.
- [x] Criar fileiras de portas de madeira em cada galeria (três por lado/nível como decisão de layout, não uma contagem canônica), com molduras de calcário PBR e painéis de nogueira PBR.
- [x] Construir duas escadarias laterais em zigue-zague, cada uma com três lances alternados para alcançar os três níveis de galeria; degraus de pedra arredondados, filetes de bronze, balaústres torneados, corrimãos e patamares.
- [x] Adicionar portas duplas de madeira em painéis, Olho de Hórus, correntes de ferro, seis cadeados, collider e interação de inspeção; a porta continua trancada.
- [x] Adicionar placas SVG CC BY 3.0 (Eye of Horus, harp, drum, flute, spears, crossed chains, padlock) com atribuição por autor e notas das modificações.
- [x] Conectar os lances ao controlador de terceira pessoa: a altura do Carter acompanha as rampas, mantém-se nos patamares e retorna ao piso principal ao sair das galerias.

### Peças de destaque
- [x] Atualizar Thoth para uma figura humana com pernas/tronco separados, kilt shendyt pregueado, faixa diagonal, colar largo, cabeça/bico de íbis, papiro aberto com sinal Per Ankh e estilete de escriba; altura aproximada de 9,1 m.
- [x] Substituir as línguas poligonais por fogo volumétrico de shader MIT com ruído, textura de perfil, lenha, brasas, faíscas e luz dinâmica.
- [x] Aumentar a densidade de amostragem do volume (desktop: slice spacing 0,024 / 66 segmentos; mobile: 0,052 / 34 segmentos) para reduzir arestas visíveis.
- [x] Substituir a moldura quadrada da lareira por arco de calcário, pilastras, capitéis, inlay de bronze e manto arredondado.
- [x] Usar o GLB Poly Haven Sofa 03 CC0 com MeshoptDecoder, materiais PBR, normalização por bounding box e escala 0,72 (~1,97 m), um de cada lado da lareira; manter fallback proporcional visível se o GLB falhar.
- [x] Reduzir a mesa central para altura/diâmetro de mesa baixa e aplicar walnut PBR, bronze e medalhão solar.
- [x] Refazer o tapete como pele de serpente em escamas sobrepostas, com color/bump procedural e dimensões de cerca de 12,2 × 4,6 m conforme o livro.
- [x] Manter lustre, arandelas e estandartes da decoração anterior.

### QA ainda pendente
- [ ] Conferir se o novo fogo volumétrico está orgânico e corretamente orientado à câmera; avaliar custo no mobile.
- [ ] Conferir o tamanho do Sofa 03 (escala 0,72) com o Carter e ajustar posição/rotação caso necessário.
- [ ] Conferir se as interações E/INTERAGIR estão acessíveis para sofás, mesa, estátua, lareira, harpas, tambores, flautas, lanças, khopeshes, portas e TV (toggle), e se as colisões não bloqueiam passagem útil.
- [ ] Conferir a leitura da estátua humana com kilt, faixa, colar, papiro e estilete; verificar mapas de normal/roughness e preservar a reflexão.
- [ ] Conferir arco e pilastras da lareira, portas/fechaduras, transparência da parede envidraçada, sombras, texturas PBR, z-fighting e placas SVG em visão 3/4 e de dentro do salão.
- [ ] Testar a subida e descida nos três níveis de galeria, incluindo as transições entre os lances e os patamares.
- [ ] Ajustar desempenho e densidade visual em mobile paisagem.
- [ ] Testar as portas trancadas, inspeção de harpas/tambores/flautas/armas/TV e colisões da parede de vidro em desktop e mobile.
- [ ] Fazer a aprovação visual final antes de marcar o Grande Salão como concluído.

## Setor 05 — Biblioteca subterrânea

- [x] Substituir estantes genéricas por nichos de papiros, Nut, Geb e quatro shabtis.
- [x] Material da parede cilíndrica renderiza os dois lados.
- [x] Clareamento da tonalidade da parede.
- [ ] Testar face interna, profundidade, cúpula, piso e distribuição dos nichos.
- [ ] Ajustar luz ambiente e materiais para evitar aparência cinza/transparente.
- [x] Adicionar inspeção contextual aos 16 nichos inferiores, quatro shabtis e mesa de leitura (E/INTERAGIR compartilhado).
- [x] Fixar a seed das texturas de Nut e Geb para manter a composição estável entre recarregamentos e dispositivos.
- [ ] Criar leitura aprofundada/coleção de papiros e interações de uso dos artefatos.

### Atualização 26/11/2026 — biblioteca subterrânea
- [x] Conectar a biblioteca ao array de interações compartilhado sem criar controladores paralelos.
- [x] Registrar 16 pontos de inspeção dos nichos inferiores, quatro shabtis cardeais e a mesa central.
- [x] Tornar determinística a geração das texturas de Nut e Geb.
- [ ] Validar alcance e leitura dos prompts no navegador desktop e em celular paisagem.
- [ ] Refinar materiais/iluminação da câmara após inspeção visual.

## Setor 06 — arquitetura, circulação e interiores

- [ ] Implementar subida/descida física pela escada em caracol, com altura dos degraus (circulação do Grande Salão foi resolvida separadamente).
- [ ] Fazer o portal mágico funcionar como passagem física.
- [ ] Refinar terraço, piscina, refeições e fogueira.
- [ ] Refinar quarto do Carter, banheiro, deck e pavimentos.
- [ ] Construir enfermaria, treinamento e salas auxiliares como reconstruções interpretativas quando o texto não definir forma.

## Setor 09 — exterior e chegada

### East River
- [x] Preservar a geometria ampliada do rio, a linha de margem e as ondulações instanciadas.
- [x] Adicionar mapa de altura procedural periódico como bumpMap animado, com intensidade/repetição ajustadas para desktop e mobile.
- [ ] Validar a escala das ondas em vista próxima e distante, reflexos e ausência de padrão repetitivo perceptível.
- [ ] Avaliar leitura da água junto ao cais e ao barco; ajustar a transição visual da margem.

### Cais, armazém e chegada
- [x] Doca de madeira, juntas, estacas, cabeços, defensas de borracha e argolas de amarração.
- [x] Armazém industrial com portão, marquise, tubulações, exaustores e objetos de carga.
- [x] Mansão elevada, cinco pavimentos, portal sem maçaneta e escada metálica em caracol.
- [x] Barco de papiro com casco trançado, cobertura de esteiras, banco, leme e luzes; inspeção por proximidade.
- [ ] Testar circulação da margem ao patamar, escada espiral e passarela da entrada com o Carter.
- [ ] Conferir a escala e o enquadramento do barco em relação ao cais e à fachada.

### Horizonte urbano
- [x] Williamsburg Bridge em geometria estrutural instanciada, cabos e pendurais.
- [x] Margem distante e skyline de Manhattan em camadas.
- [ ] Validar perspectiva, distância aparente, neblina e silhueta da ponte a partir do cais.
- [ ] Avaliar densidade de janelas e custo de sombras no desktop/mobile.

### QA exterior
- [ ] Verificar sintaxe/imports e cache-busters.
- [ ] Testar exterior em navegador desktop e celular paisagem.
- [ ] Medir FPS, memória e estabilidade com o rio, ponte, skyline e interiores carregados.
- [ ] Marcar separadamente implementado, testado e aprovado visualmente.

## Setor 07 — visual e desempenho

- [x] EffectComposer com SSAO no desktop e bloom em desktop/mobile.
- [x] Perfil de processamento reduzido para telas touch.
- [ ] Validar FPS, temperatura e estabilidade em celular e PC.
- [ ] Ajustar efeitos conforme desempenho real.
- [x] Integrar conjuntos PBR CC0 locais para walnut, limestone, plaster e marble.
- [ ] Pesquisar HDRI CC0 adequado ao salão e avaliar custo/performance antes de ligar ao runtime.
- [ ] Fazer passe final de color grading e sombras de contato.

## Setor 08 — QA e entrega

- [x] Atualizar cache-busters dos módulos alterados.
- [ ] Verificar sintaxe estática de todos os módulos afetados.
- [ ] Testar no navegador desktop.
- [ ] Testar em celular em modo paisagem.
- [ ] Registrar novos bugs por setor antes de abrir a próxima etapa.

## Próximas ações

1. Abrir o Grande Salão no navegador e avaliar a chama volumétrica, o Sofa 03, a estátua, o tapete serpentino, a mesa e as superfícies PBR.
2. Conferir colisões e interação contextual E/INTERAGIR; ajustar o raio/posições se algo não puder ser alcançado.
3. Testar desktop e mobile em modo paisagem, mantendo o mesmo mundo, assets e gameplay; comparar FPS, carregamento e temperatura.
4. Preencher a matriz asset-first e fechar as lacunas de instrumentos/armas expostos antes de marcar o Grande Salão como aprovado.
