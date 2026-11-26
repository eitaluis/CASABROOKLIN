# Carter Kane — modelo, movimento e refinamento

Status: **base Ara aprovada preservada; primeira camada de acessórios próprios e ações cinematográficas integrada. Inspeção visual real ainda pendente.**

## Decisões confirmadas

- Método: híbrido — manter o Carter humanoide e rigado aprovado no Ara 3D Gen, acrescentando peças autorais e refinamentos com Three.js/Blender.
- Movimento: cinematográfico — aceleração e desaceleração suaves, curvas menos abruptas, inclinação corporal contida e ações expressivas.
- Rosto: natural, sem olhos exagerados, anime facial ou proporções chibi.
- Direção visual: C — personagem 3D gráfico de videogame, volumes limpos e materiais legíveis, sem pele fotográfica.
- Referência de identidade: Carter do lado esquerdo na ilustração de Karen de la Vega: https://cdnb.artstation.com/p/assets/images/images/032/344/645/large/karen-de-la-vega-asset.jpg?1606172873.

## Base ativa

- src/character.js carrega o personagem aprovado pelo link compartilhado do Ara 3D Gen.
- Não substituir a malha humana, o rosto, o cabelo ou as proporções sem uma revisão visual e aprovação explícita.
- O rig e o módulo de personagem são únicos e compartilhados pelo jogo desktop e mobile.
- O controlador de terceira pessoa continua em src/third-person.js; teclado, mouse, joystick e toque conduzem a mesma instância.
- A escala é obtida do próprio rig, com fallback de 1,75 m.
- As animações centrais continuam sendo idle, walk, run, jump_start, jump_air e jump_land.

## Acessórios autorais integrados

Módulo: src/character-accessories.js.

- Bolsa transversal em couro conhaque, com corpo estruturado, aba, bolso frontal, costuras e ferragens em latão.
- Alça diagonal do ombro esquerdo ao quadril direito do Carter.
- Bolsa posicionada no quadril direito; o grupo é anexado ao osso Hips quando disponível, com fallback no root do modelo.
- Corrente e medalhão têm âncora independente no alto do tronco (prioridade Spine2, depois Spine1/Chest/Spine), para acompanhar o tórax em vez de oscilar com a pelve.
- Medalhão dourado independente, corrente e relevo egípcio simplificado.
- Oscilação secundária discreta da bolsa e do medalhão, atualizada pelo mesmo ciclo de movimento.
- Geometria e materiais são originais do projeto; não dependem de GLB externo nem de download em runtime.

A modelagem de detalhe em Blender ainda não foi concluída. O módulo Three.js atual é a primeira implementação funcional de acessórios e deverá servir como guia de escala, posição e leitura para o futuro arquivo-fonte Blender.

## Ações cinematográficas

src/character.js consulta ANIMATIONS do pacote Ara antes de pedir os clips. Além da locomoção e do salto, solicita somente os IDs encontrados no catálogo:

- look_around — observar o ambiente (loop).
- talk_gestures — gesticular ao falar (loop).
- wave — acenar.
- point — apontar.
- bow — inclinar-se/cumprimentar.

As ações expressivas são expostas por playAction() e stopAction(). Se algum ID deixar de existir numa versão futura do catálogo, ele não é solicitado e o botão correspondente é desativado no preview.

## Movimento compartilhado

- A locomoção continua sendo orientada pela velocidade física do controlador e pelo blending idle/walk/run do Ara.
- A aceleração e a desaceleração foram suavizadas.
- A rotação horizontal do corpo, a inclinação frontal e a inclinação lateral em curvas foram reduzidas para uma leitura menos atlética/exagerada.
- A câmera de terceira pessoa acompanha com easing mais lento.
- O salto usa a sequência de preparação, pose aérea e aterrissagem.
- Os valores são compartilhados entre desktop e mobile; somente os controles de entrada diferem.

## Preview

Abra character-preview.html para conferir o mesmo módulo usado pelo jogo. O preview permite orbitar o personagem, verificar frente/perfil/costas, alternar locomoção e testar as ações cinematográficas. Use-o primeiro para inspecionar a posição da bolsa e do medalhão.

## QA obrigatório — não marcar como concluído antes de testar

- Comparar frente, perfil e costas com a referência de Karen de la Vega.
- Confirmar visualmente que a bolsa está no quadril direito do Carter, não apenas na direita do enquadramento.
- Conferir se a alça parte do ombro esquerdo e não atravessa pescoço, rosto ou clavícula.
- Conferir escala, rotação e profundidade do medalhão.
- Verificar clipping da bolsa e da alça em idle, walk, run, curvas e salto.
- Verificar o balanço secundário sem vibração, penetração na perna ou movimento excessivo.
- Confirmar que os cinco botões cinematográficos correspondem a clips carregados no Ara.
- Conferir escala do personagem contra portas, móveis, corrimãos e objetos da Brooklyn House.
- Testar em Chrome desktop e celular em paisagem; conferir FPS, memória e descarte do personagem.
- Confirmar que o inventário e o socket WeaponR continuam funcionando.

## Próximas etapas

1. Abrir o preview no navegador e corrigir posição/orientação dos acessórios com base na inspeção real.
2. Executar assets/models/carter/blender/create_carter_accessories.py no Blender, comparar a posição com o Carter Ara e salvar a cena-fonte .blend após a inspeção.
3. Fazer revisão de materiais e costuras à escala real, mantendo leitura clara no mobile.
4. Ampliar as interações situacionais — observar estátuas, livros e objetos, cumprimentar e gesticular — sem interromper indevidamente a locomoção. O olhar dirigido ao objeto já está integrado ao exame por proximidade.
5. Só então avaliar exportação de um GLB consolidado; a fonte Ara permanece a referência regenerável do corpo e do rig.

## Regra de produção

O preview deve importar o mesmo src/character.js do jogo. Toda alteração de personagem e movimento deve funcionar nas versões desktop e mobile. Diferenças só são permitidas na interface e nos controles específicos de cada dispositivo. Marcar como testado somente após inspeção real no navegador.