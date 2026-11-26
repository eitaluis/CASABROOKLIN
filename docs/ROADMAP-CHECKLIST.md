# CASABROOKLIN — checklist de produção por setores

Atualizado: 26/11/2026 — refinamento técnico do Carter iniciado; exterior East River aprimorado; padrão asset-first aplicado

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

- [x] Substituir estantes genéricas por nichos de papiros, Nut, Geb e quatro shabtis.
- [x] Material da parede cilíndrica renderiza os dois lados.
- [x] Clareamento da tonalidade da parede.
- [ ] Testar face interna, profundidade, cúpula, piso e distribuição dos nichos.
- [ ] Ajustar luz ambiente e materiais para evitar aparência cinza/transparente.
- [x] Adicionar abertura/fechamento visual dos 16 papiros inferiores e inspeção dos quatro shabtis e mesa de leitura (E/INTERAGIR compartilhado).
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
- [ ] Construir enfermaria e salas auxiliares como reconstruções interpretativas quando o texto não definir forma.

### Sala de Treinamento — implementada, QA pendente

Estudo de referência: [TRAINING-ROOM-STUDY.md](TRAINING-ROOM-STUDY.md).

- [x] Criar módulo independente `src/training-room.js`, conectado ao mundo compartilhado.
- [x] Criar quadra de madeira 15 × 28 m, marcações de 5 cm, afresco de abóbada, nervuras, frisos e iluminação.
- [x] Criar efígies de Rá com discos solares vazados usados como cestas, aro a 3,05 m do piso.
- [x] Criar bola interativa, arremesso simplificado, detecção de cesta e placar.
- [x] Criar prática de mira com alvos e orbes mágicos acionados pelo cajado.
- [x] Criar desafio “Whatever Works” com guerreiro shabti e interação por cajado/khopesh.
- [x] Criar inspeção de bustos/afrescos e portas duplas que abrem/fecham.
- [x] Conectar a sala à galeria do Grande Salão por passarela e transição física de zona.
- [x] Adicionar acesso rápido pelo menu e tecla 5.
- [x] Usar o mesmo mundo, personagem, inventário, colisões e interações em desktop/mobile.
- [ ] Testar a travessia real da galeria ao portal e o retorno ao Grande Salão.
- [ ] Conferir escala, composição, materiais, cestas, abóbada, iluminação e câmera em navegador.
- [ ] Testar bola, cesta, placar, alvos, cajado, khopesh, shabti e portas.
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

- [ ] Completar o restante do percurso perimetral do terraço para representar integralmente o contorno da casa; esta revisão entrega primeiro o acesso caminhável principal com piscina, jantar e fogueira.
- [ ] Validar visualmente a orientação longitudinal do tapete de 40 × 15 pés em relação ao posicionamento final dos sofás e da estátua.
