# CASABROOKLIN — checklist de produção por setores

Atualizado: 27/11/2026 — primeira reconstrução asset-first da biblioteca subterrânea

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

- [x] Carter Ara 3D Gen aprovado preservado; redesigns experimentais descartados
- [x] Refinar lifecycle do Carter: descarte seguro do rig, mixer e listener de salto
- [x] Expor altura retornada pelo Ara e usá-la para calibrar hitbox vertical e alvo da câmera no controlador compartilhado
- [x] Preview informa falha de carregamento do Ara em vez de ficar preso no loading
- [x] Nova camada visual do Grande Salão implementada no módulo compartilhado
- [x] Layout estrutural do Grande Salão refeito: escadarias centrais simétricas até a primeira galeria, voos laterais escalonados para os outros níveis e passarela elevada entre as alas
- [x] Assentos curvos integrados ao pedestal circular de Thoth e passagens inferiores abertas na parede posterior
- [x] Lareira reposicionada em nicho de alvenaria; vigas transversais antigas removidas do vão central
- [x] GLB Poly Haven Sofa 03 (CC0), texturas PBR CC0 e fogo volumétrico Housz (MIT) adicionados ao runtime
- [x] Collider e interação por proximidade implementados para sofás, mesa, estátua e lareira; E no desktop e INTERAGIR no mobile
- [ ] Teste visual do Grande Salão em navegador real, verificando subida/descida de cada lance, passarela, assentos e passagens em desktop e mobile, com verificação de todas as transições e passagens em desktop e mobile
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
- [x] Usuário autorizou continuar refinando o Carter existente sem substituir a base Ara aprovada.
- [x] Corrigir descarte do personagem: parar mixer/sequência de salto, remover listener e retirar pivô da cena.
- [x] Atualizar cache-buster do módulo compartilhado no runtime.
- [x] Melhorar feedback de erro no preview independente.
- [ ] Inspecionar visualmente o modelo Ara em navegador real (frente, perfil e costas).
- [ ] Validar idle, walk, run e jump_start/jump_air/jump_land no preview e no jogo.
- [ ] Conferir proporções, escala em relação aos ambientes e clipping nas articulações.
- [ ] Conferir socket WeaponR e orientação/escala das armas.
- [ ] Decidir e implementar bolsa transversal apenas após confirmar o desenho e a posição no corpo.
- [ ] Testar personagem e controles em desktop e mobile paisagem.

**Prioridade atual:** refinamento incremental do Carter aprovado; não substituir a malha Ara por redesign experimental.

## Setor 03 — inventário e combate

- [x] Inventário inicial com cajado mágico e khopesh egípcio.
- [x] Encaixe no osso WeaponR quando disponível; fallback temporário se o bone não existir.
- [x] Equipar/guardar/usar: desktop I abre inventário e F usa; mobile tem Mochila e Usar.
- [ ] Testar orientação/escala na mão direita em idle, walk e run com o novo rig.
- [ ] Criar animações dedicadas de cajado, ataque de khopesh, defesa e troca.
- [ ] Adicionar relíquias, papiros e itens de história em slots de inventário.

- [x] Átrio central: escadarias principais simétricas, lances superiores em faixas X separadas e passarela elevada entre as alas
- [x] Assentos curvos no pedestal circular de Thoth e passagens inferiores abertas
- [x] Paredes de alvenaria segmentada e remoção das vigas transversais do vão central

## Setor 04 — Grande Salão

### Arquitetura e materiais
- [x] Aplicar blocos de calcário sob medida nas paredes e mapas PBR CC0 de normal/roughness limestone nas estruturas, pilares e molduras; manter roughness alta e baixo relevo para leitura de pedra maciça.
- [x] Piso recebe mapas PBR CC0 do ambientCG Tiles139.
- [x] Walnut PBR CC0 (color, normal e roughness) aplicado aos acabamentos e mesa.
- [x] Substituir o eixo visual das quatro colunas por shafts com caneluras e capitéis de lótus esculpidos.
- [x] Acrescentar medalhão de cedro, frisos, relevos solares alados e pilastras junto à lareira.
- [x] Substituir os antigos balaústres cilíndricos por balaústres torneados, corrimãos curvos e filetes de latão.
- [x] Substituir harpas/tambores/lanças placeholders por modelos sob medida: harpas arqueadas e cordas tensionadas, tambores com pele e amarrações, lanças com ponta foliácea de bronze e khopeshes de lâmina curva.
- [x] Substituir a TV em bloco por tela plana física refletiva e toggle de energia via E/INTERAGIR. Os modelos CC0 Poly Haven Television 01/02 foram avaliados e rejeitados por serem CRT, não plasma.
- [x] Parede panorâmica envidraçada com montantes/travessas de bronze; portas duplas de vidro funcionais para o terraço (E/INTERAGIR), mais bandeiras fixas nos níveis superiores.
- [x] Criar fileiras de portas de madeira em cada galeria (três por lado/nível como decisão de layout, não uma contagem canônica), com molduras de calcário PBR, painéis de nogueira e interação abrir/fechar; cada vão leva a uma sala lateral interpretativa.
- [x] Construir duas escadarias laterais, com três lances alternados por nível; abrir vazios contínuos nos pisos das galerias, patamares de virada, balaústres torneados, corrimãos e filetes de bronze.
- [x] Adicionar portas duplas de madeira em painéis, Olho de Hórus, correntes de ferro, seis cadeados, collider e interação de inspeção; a porta continua trancada.
- [x] Adicionar placas SVG CC BY 3.0 (Eye of Horus, harp, drum, flute, spears, crossed chains, padlock) com atribuição por autor e notas das modificações.
- [x] Conectar os lances ao controlador de terceira pessoa e ao rig Ara: resolver altura nas rampas e patamares compartilhados pela direção do movimento, além de deslizar ao longo das colisões.

### Peças de destaque
- [x] Atualizar Thoth para uma figura humana com pernas/tronco separados, kilt shendyt pregueado, faixa diagonal, colar largo, cabeça/bico de íbis, papiro aberto com sinal Per Ankh e estilete de escriba; altura aproximada de 9,1 m.
- [x] Substituir as línguas poligonais por fogo volumétrico de shader MIT com ruído, textura de perfil, lenha, brasas, faíscas e luz dinâmica.
- [x] Aumentar a densidade de amostragem do volume (desktop: slice spacing 0,024 / 66 segmentos; mobile: 0,052 / 34 segmentos) para reduzir arestas visíveis.
- [x] Substituir a moldura quadrada da lareira por arco de calcário, pilastras, capitéis, inlay de bronze e manto arredondado.
- [x] Usar o GLB Poly Haven Sofa 03 CC0 com MeshoptDecoder, materiais PBR, normalização por bounding box e escala 1,05 (~2,87 m), um de cada lado da lareira; manter fallback proporcional visível se o GLB falhar.
- [x] Aumentar a presença da mesa central de nogueira e o collider proporcional, mantendo altura baixa, bronze e medalhão solar.
- [x] Refazer o tapete como pele de serpente orgânica (contorno irregular, não oval), escamas sobrepostas e dimensões de cerca de 12,2 × 4,6 m conforme o livro.
- [x] Suavizar gotas de vidro âmbar do lustre e chamas das arandelas; remover pingentes triangulares octaédricos que eram escolha de modelagem, não detalhe canônico.
- [x] Assentar fogo volumétrico em uma câmara de lareira com soleira, leito de brasas, fundo refratário e ombreiras de pedra.

### QA ainda pendente
- [ ] Conferir se o novo fogo volumétrico está orgânico e corretamente orientado à câmera; avaliar custo no mobile.
- [ ] Conferir o tamanho do Sofa 03 (escala 1,05) com o Carter e ajustar posição/rotação caso necessário.
- [ ] Conferir se as interações E/INTERAGIR estão acessíveis para sofás, mesa, estátua, lareira, harpas, tambores, flautas, lanças, khopeshes, portas e TV (toggle), e se as colisões não bloqueiam passagem útil.
- [ ] Conferir a leitura da estátua humana com kilt, faixa, colar, papiro e estilete; verificar mapas de normal/roughness e preservar a reflexão.
- [ ] Conferir arco e pilastras da lareira, portas/fechaduras, transparência da parede envidraçada, sombras, texturas PBR, z-fighting e placas SVG em visão 3/4 e de dentro do salão.
- [ ] Testar a subida e descida nos três níveis de galeria, incluindo transições nos patamares sobrepostos e entrada/saída de todas as salas laterais.
- [ ] Ajustar desempenho e densidade visual em mobile paisagem.
- [ ] Testar as portas trancadas, inspeção de harpas/tambores/flautas/armas/TV e colisões da parede de vidro em desktop e mobile.
- [ ] Fazer a aprovação visual final antes de marcar o Grande Salão como concluído.

## Setor 05 — Biblioteca subterrânea

- [x] Primeira reconstrução asset-first da biblioteca: parede mural curva, nichos circulares escavados, cápsulas pneumáticas com papiro, quatro estatuetas humanas cerâmicas e mesa pétrea com bolsa de Julius.
- [x] Painéis murais curvos com recortes circulares reais, profundidade interna e parede rochosa como substrato.
- [x] Clareamento da tonalidade da parede.
- [ ] Testar face interna, profundidade, cúpula, piso e distribuição dos nichos.
- [ ] Ajustar luz ambiente e materiais para evitar aparência cinza/transparente.
- [x] Adicionar abertura/fechamento das 16 cápsulas inferiores e inspeção das quatro estatuetas humanas e da mesa com a bolsa de Julius (E/INTERAGIR compartilhado).
- [x] Fixar a seed das texturas de Nut e Geb para manter a composição estável entre recarregamentos e dispositivos.
- [ ] Criar leitura aprofundada/coleção de papiros e interações de uso dos artefatos.

### Atualização 26/11/2026 — biblioteca subterrânea
- [x] Conectar a biblioteca ao array de interações compartilhado sem criar controladores paralelos.
- [x] Registrar 16 pontos de inspeção dos nichos inferiores, quatro shabtis cardeais e a mesa central.
- [x] Tornar determinística a geração das texturas de Nut e Geb.
- [ ] Validar alcance e leitura dos prompts no navegador desktop e em celular paisagem.
- [ ] Refinar materiais/iluminação da câmara após inspeção visual.


### Atualização 27/11/2026 — reconstrução estrutural asset-first

- [x] Criar módulo compartilhado src/library.js e ligá-lo ao runtime desktop/mobile.
- [x] Substituir a parede visual lisa por 48 painéis curvos com pintura original e aberturas circulares recortadas na geometria.
- [x] Criar profundidade de cavidade com túnel interno, fundo recuado e aro de acabamento.
- [x] Colocar uma cápsula plástica translúcida com papiro dentro de cada nicho; manter 16 interações na faixa inferior.
- [x] Substituir os quatro shabtis mumiformes antigos por estatuetas humanas de cerâmica com kilt, sandálias, corte de cabelo angular e kohl; diferenciar estilete/rolo, caixa, cajado em gancho e mãos vazias.
- [x] Substituir a mesa de madeira por mesa comprida de pedra com a bolsa de Julius Kane.
- [x] Remover colisores invisíveis das estantes desativadas e adicionar limites físicos à parede, mesa e pedestais.
- [x] Registrar matriz de fontes, assets aceitos/rejeitados e distinção canônico/interpretação em docs/BIBLIOTECA-STUDY.md.
- [x] Compartilhar o atlas do mural e a textura das etiquetas das cápsulas, evitando cópias desnecessárias de texturas na GPU do celular.
- [ ] Validar recortes, normais, materiais, interação e circulação no navegador desktop.
- [ ] Repetir QA em celular paisagem e medir desempenho/estabilidade.
- [ ] Reconstruir Nut e Geb como figuras humanas pintadas; texturas atuais ainda são provisórias.
- [ ] Revisar a escada dos três andares; sua forma helicoidal é uma interpretação, não uma exigência do romance.

## Setor 06 — arquitetura, circulação e interiores

- [ ] Implementar subida/descida física pela escada em caracol, com altura dos degraus (circulação do Grande Salão foi resolvida separadamente).
- [ ] Fazer o portal mágico funcionar como passagem física.
- [ ] Refinar terraço, piscina, refeições e fogueira.
- [ ] Refinar quarto do Carter, banheiro, deck e pavimentos.
- [ ] Construir enfermaria e salas auxiliares como reconstruções interpretativas quando o texto não definir forma.

### Sala de Treinamento — implementada, QA pendente

Estudo de referência: [TRAINING-ROOM-STUDY.md](TRAINING-ROOM-STUDY.md).

- [x] Criar módulo independente `src/training-room.js`, conectado ao mundo compartilhado.
- [x] Criar quadra de madeira 15 × 28 m, marcações de 5 cm, afresco de abóbada, nervuras, frisos e iluminação.
- [x] Criar efígies de Rá com discos solares vazados usados como cestas, aro a 3,05 m do piso.
- [x] Criar bola interativa, arremesso com assistência de arco ao mirar numa cesta, detecção descendente do aro e placar.
- [x] Criar prática de mira com alvos e orbes mágicos acionados pelo cajado.
- [x] Criar quatro estatuetas shabti em pontos diferentes da quadra; ao iniciar “Whatever Works”, crescem para guerreiros de barro com espada e escudo.
- [x] Dar a cada guerreiro estado independente, dois pontos de resistência, reação a golpes e retorno à forma de estatueta após derrota.
- [x] Permitir derrotar os quatro usando cajado ou khopesh.
- [ ] Desenvolver IA de aproximação, defesa e ataque dos guerreiros.
- [x] Criar inspeção de bustos/afrescos e portas duplas que abrem/fecham.
- [x] Conectar a sala à galeria do Grande Salão por passarela e transição física de zona.
- [x] Adicionar acesso rápido pelo menu e tecla 5.
- [x] Usar o mesmo mundo, personagem, inventário, colisões e interações em desktop/mobile.
- [ ] Testar a travessia real da galeria ao portal e o retorno ao Grande Salão.
- [ ] Conferir escala, composição, materiais, cestas, abóbada, iluminação e câmera em navegador.
- [ ] Testar bola, cesta, placar, alvos, cajado, khopesh, transformação dos quatro shabtis, combate e portas.
- [ ] Testar celular em paisagem e medir desempenho.
- [ ] Ajustar o que for identificado na revisão visual antes de aprovar a sala.

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


### Revisão de circulação e varanda — 26/11/2026
- [x] Remover colisores residuais de sofás/mesa antigos que permaneciam após esconder as malhas e bloqueavam o acesso ao mobiliário atual.
- [x] Remover colisores de paredes laterais antigas e substituir as paredes por vãos de porta; deslocar a ala dos quartos para liberar a área dos cômodos laterais.
- [x] Criar três faixas de piso por nível com vazio contínuo para a escada, em vez de uma laje atravessando os degraus.
- [x] Criar portas laterais articuladas que removem o collider quando abertas; salas atrás delas são reconstrução interpretativa, não layout canônico detalhado.
- [x] Abrir a parede envidraçada e a fachada externa no mesmo eixo; portas de vidro duplas dão acesso ao terraço panorâmico, com piscina, mesa de jantar e fogueira.
- [x] Criar piso de terraço em segmentos ao redor do recorte da piscina, com bordas de calcário e guarda-corpo de nogueira/bronze.
- [x] Rebaixar fogo/lenha/brasas para o interior da lareira e adicionar caixa refratária física.
- [ ] Validar o caminho completo salão → portas de vidro → terraço, a colisão da piscina e as portas de cada galeria em desktop e mobile.


## Setor — exterior e entrada da Brooklyn House

### Base canônica e escala
- [x] Confirmar o lado correto do rio: Brooklyn House fica na margem do Brooklyn; Manhattan é a margem oposta.
- [x] Registrar a sequência barco → doca → pátio industrial → armazém → mansão → escada → portal.
- [x] Registrar a escada metálica contornando o armazém como canônica e a planta helicoidal como interpretação.

### Implementação
- [x] Separar a composição externa em src/exterior.js.
- [x] Ampliar o East River e posicionar a margem de Manhattan em distância visual.
- [x] Reconstruir a Williamsburg Bridge com torres, cabos, pendurais, treliças e tabuleiro.
- [x] Criar skyline em planos de profundidade, barcos e cais industriais.
- [x] Criar barco de papiro com cobertura de esteiras, leme/remo e tochas; sem piloto visível.
- [x] Abrir o vão de entrada e animar a porta de madeira para cima.
- [x] Conectar cálculo de altura da escada, patamar, passarela e piso do Grande Salão.
- [x] Atualizar minimap e instrução inicial de chegada.
- [x] Preservar uma única implementação compartilhada entre desktop e mobile.

### QA ainda pendente
- [ ] Percorrer doca → escada → patamar → portal → Grande Salão em navegador desktop.
- [ ] Validar subida e descida da escada sem queda, clipping ou salto de altura.
- [ ] Testar abertura/fechamento e travessia da porta em desktop e mobile.
- [ ] Conferir composição, escala da ponte, horizonte e neblina em câmera baixa/alta.
- [ ] Medir FPS, memória, temperatura e estabilidade em celular paisagem.
- [ ] Integrar mapas PBR locais de tijolo somente após baixar e verificar todos os mapas/licenças.
- [ ] Não marcar visualmente aprovado antes de inspeção real.

- [x] Fechar o percurso perimetral caminhável do terraço, com piscina, jantar e fogueira concentrados no setor principal.
- [ ] Validar visualmente a orientação longitudinal do tapete de 40 × 15 pés em relação ao posicionamento final dos sofás e da estátua.


## Correção canônica do exterior — 26/11/2026

- [x] Primeira leitura externa limitada ao galpão industrial antigo.
- [x] Manter a mansão de cinco andares e a escada como geometria de percepção mágica.
- [x] Usar materiais invisíveis com escrita de profundidade para ocultar a arquitetura interna sem deixar os cômodos vazarem para a vista externa.
- [x] Revelar fachada, escada e luzes depois de “olhar novamente” para o telhado na doca.
- [x] Não criar silhuetas exteriores para Grande Salão, biblioteca, treinamento ou quartos.
- [x] Reposicionar a escada para a lateral do galpão e alinhar patamar/passarela.
- [x] Separar a Williamsburg Bridge da projeção do telhado e mantê-la sobre o corredor do East River.
- [x] Colocar o barco sob o vão, junto ao extremo do cais.
- [ ] QA visual da revelação e da oclusão dos ambientes internos em desktop/mobile.
- [ ] QA de percurso completo, escada, ponte, barco e porta em desktop/mobile.


## Regra de exterior e interior mágico — 26/11/2026

- [x] Manter o galpão antigo como a única silhueta vista na percepção comum.
- [x] Manter a mansão de cinco pavimentos e a escada apenas na camada de percepção mágica ativada na doca.
- [x] Isolar salas legadas, biblioteca, quartos, sala de treinamento e anexos modulares em um grupo interno separado.
- [x] Impedir que os anexos apareçam na doca; ativar o grupo ao entrar e ocultá-lo ao sair.
- [x] Incluir os objetos carregados assincronamente no grupo interno, evitando que modelos GLB apareçam do lado de fora.
- [x] Aplicar a mesma regra ao minimapa.
- [x] Manter a Williamsburg Bridge sobre o East River e o barco sob o vão, sem colocar o tabuleiro sobre o telhado.
- [ ] Inspecionar a silhueta exterior em 360° no navegador, desktop e mobile.
- [ ] Confirmar que todas as salas e interações internas continuam visíveis e funcionais após a entrada.

## Waterfront exterior — Brooklyn / East River / Manhattan

- [x] Corrigir o pátio para não avançar sobre a superfície do East River.
- [x] Estender a água e construir terra firme separada nas duas margens.
- [x] Criar muros de cais, abertura no acesso da doca, píeres secundários e guindastes de carga.
- [x] Substituir o skyline genérico cinza por fábricas de tijolo, depósitos, ruas, tanques d'água, chaminés e fachadas variadas.
- [x] Integrar Chrysler Building e Empire State Building como modelos GLB CC0 distantes de Manhattan.
- [x] Construir rampas de aproximação nas duas extremidades da Williamsburg Bridge, com vias laterais e trilhos centrais contínuos.
- [x] Organizar pistas rodoviárias laterais e dois trilhos centrais no mesmo tabuleiro, conforme a seção oficial da Williamsburg Bridge.
- [x] Refazer o barco de papiro com casco de feixes vegetais, cabana de esteiras, tochas e pequena figura timoneira.
- [x] Atracar o barco ao lado do cais e alinhar o ponto de interação à posição visual.
- [x] Reforçar degraus, corrimãos, patamares e passarela até o portal da Brooklyn House.
- [ ] QA visual em 360° desktop e mobile, incluindo leitura do skyline e da conexão ponte/margens.
- [ ] Testar FPS e distância de renderização em celular.
- [ ] Confirmar carregamento dos GLBs em hospedagem GitHub Pages e fallback do skyline caso falhem.


## Grande Salão — entrada e conexões (27/11/2026)

- [x] Reposicionar o ponto de entrada para fora do anel de assentos e manter espaço livre diante de Thoth.
- [x] Fazer o atalho físico `2`/`Numpad2` chamar a entrada do Grande Salão.
- [x] Substituir oito bancos soltos por três níveis de assentos curvos integrados, abertos para a entrada.
- [x] Trocar o plinto quadrado da estátua por uma base circular coerente com os níveis de assento.
- [x] Rebaixar treliças e exaustores do telhado industrial para não cruzarem o piso do salão.
- [x] Trocar luminárias cônicas por difusores cilíndricos opalinos.
- [x] Substituir painéis laterais totalmente transparentes por peitoris de calcário, vidro fumê, montantes de bronze e portas operáveis para o terraço.
- [x] Abrir a fachada posterior nos dois eixos das passagens inferiores e recompor a alvenaria superior/lateral.
- [x] Conectar as passagens inferiores ao passeio posterior do terraço perimetral.
- [ ] Validar no navegador que a entrada pelo botão e pela tecla 2 não prende Carter; testar saída e circulação em torno de Thoth.
- [ ] Testar colisões nos três níveis de assentos, escadas principais, passarela central e saídas para o terraço.
- [ ] Inspecionar o vidro fumê e a cor quente do calcário em desktop e celular paisagem.
- [ ] Construir a descida canônica de três pavimentos do Grande Salão até a biblioteca.
- [ ] Reposicionar/conectar o portal do Olho de Hórus no extremo oposto, conforme o texto-fonte.
- [ ] Confirmar percurso completo entre Grande Salão, terraço/piscina, galerias e biblioteca.

## Waterfront — continuidade visual da chegada — 27/11/2026

- [x] Substituir o píer elevado de 25 × 57 por uma pequena doca de aproximadamente 10 × 8.
- [x] Construir tábuas, longarinas, estacas, cabeços e argolas de amarração na doca.
- [x] Rebaixar o barco à linha d'água e alinhar sua passarela ao píer.
- [x] Mover o corredor da Williamsburg Bridge e suas aproximações para longe do spawn.
- [x] Trocar os apoios cilíndricos mais dominantes por apoios retangulares com capitéis.
- [x] Dar espessura ao deck da aproximação para que pareça uma estrutura contínua.
- [x] Estreitar a abertura do muro de cais e adicionar enrocamento instanciado.
- [x] Espalhar ondulações por toda a superfície do East River.
- [x] Deslocar fábricas e píeres secundários que cruzavam o corredor da ponte.
- [ ] Inspecionar no navegador a composição do spawn, dock, galpão, rio, ponte e Manhattan em 360°.
- [ ] Confirmar passagem sob a ponte e atracação ao lado da doca em desktop e mobile.
- [ ] Medir FPS no celular após os novos detalhes de água e margem.

## Fundo urbano e horizonte — 27/11/2026

- [x] Fechar o horizonte na direção inicial da câmera a partir da doca.
- [x] Construir três planos urbanos: indústria de waterfront, bairro misto e skyline de Manhattan.
- [x] Acrescentar janelas instanciadas, lojas, escadas de incêndio, chaminés e caixas d'água.
- [x] Reposicionar Chrysler Building e Empire State Building no skyline que aparece no enquadramento inicial.
- [x] Trocar céu plano claro por abóbada em gradiente e nuvens altas difusas.
- [x] Reduzir a névoa para preservar a leitura da cidade ao longe.
- [ ] Inspecionar 360° a partir do spawn e ao longo da margem.
- [ ] Verificar a distância aparente dos edifícios, os pontos de fuga e a continuidade do rio.
- [ ] Testar GLBs, draw calls e FPS no celular.


## Grande Salão — refinamento aprovado (27/11/2026)

### Thoth, base e bancos
- [x] Preservar a estátua canônica de Thoth em mármore negro e escala aproximada de 9,1 m.
- [x] Refinar a cabeça e o pescoço de íbis com pescoço alongado, bico curvo e afilado, volumes faciais, olhos e sulcos de pena.
- [x] Preservar kilt, faixa, colar, papiro Per Ankh e estilete existentes.
- [x] Substituir os oito bancos isolados por dois crescentes curvos contínuos com estrutura de calcário, almofada de couro, encosto, braços e acabamentos de bronze.
- [x] Definir altura do assento em aproximadamente 0,485 m e manter os vãos frontal/posterior.
- [x] Substituir a interação genérica da base por dois anchors de sentar/levantar com colisores segmentados.

### Escadaria — direção Museum Grand Stair
- [x] Adicionar espelhos verticais e focinhos de degraus com bronze.
- [x] Adicionar laterais maciças de calcário e coroamento contínuo inclinado.
- [x] Substituir a leitura do corrimão por perfis contínuos de calcário e filetes de bronze.
- [x] Refazer balaústres, newels, bases e finiais em linguagem monumental.
- [x] Preservar as rampas, patamares e superfícies caminháveis do controlador existente.
- [ ] Testar subida e descida dos três níveis no navegador e verificar que cada patamar se conecta corretamente às galerias.

### Interação / retarget Ara
- [x] Preservar o Carter Ara aprovado e solicitar os clips nativos `sit_down` e `sit_idle` quando presentes no catálogo ANIMATIONS; usar `sit_down` invertido para levantar.
- [x] Implementar sequência `sit_down` → `sit_idle` em loop → `sit_down` em sentido inverso para levantar.
- [x] Travar a locomoção enquanto sentado e liberar ao concluir a animação de levantar.
- [x] Criar anchors de posição e direção para sentar e sair, sem atravessar a estrutura.
- [x] Retornar Carter à posição anterior se o conjunto de clips não estiver disponível.
- [x] Usar o gesto Ara `look_around` para a inspeção de Thoth.
- [ ] Confirmar em runtime Ara 0.18.1 que os três clips são carregados e retargetados; conferir pés, pelve, mãos, clipping e transições.
- [ ] Testar E/INTERAGIR, sentar, idle, levantar e movimento após a saída em desktop e celular paisagem.

### Assets, licença e publicação
- [x] Registrar Innerscene Curved Modular Seating como referência CC0 (GLB 127 KB; 4,446 × 1,330 × 0,440 m), sem declarar importação do binário.
- [x] Registrar Tevy Museum Grand Stair como referência CC0 (GLB LOD0 416 KB; 12.064 triângulos; três LODs; 6,16 × 4,81 × 6,63 m), sem declarar importação do binário.
- [x] Registrar a geometria procedural original, as adaptações, as licenças e o estado das referências em manifest, OPEN-SOURCES e lookdev.
- [x] Atualizar cache-busters dos módulos compartilhados e da entrada index.html.
- [ ] Revisão visual real do Grande Salão após reload sem cache.
- [ ] QA de desempenho, carregamento de assets e paridade visual em desktop e mobile.
