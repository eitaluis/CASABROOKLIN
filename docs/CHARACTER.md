# Carter Kane — modelo, movimento e refinamento

Status: **correção estrutural da bolsa/alça/medalhão integrada ao módulo compartilhado em 27/11/2026. O encaixe usa os transforms reais do SkinnedMesh e ossos Ara em runtime; a validação visual final ainda depende de abrir o preview/jogo em navegador. O GLB Innerscene aprovado não foi baixado/importado nesta sessão; a silhueta/dimensões atuais são uma implementação procedural provisória, identificada como tal.**

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
- `createCharacter()` aceita `characterSource` e `characterName`; a mesma camada de locomoção e ações Ara pode ser reaproveitada em outro mago sem carregar os acessórios exclusivos de Carter (`attachCarterAccessories: false`).
- O controlador de terceira pessoa continua em src/third-person.js; teclado, mouse, joystick e toque conduzem a mesma instância.
- A escala é obtida do próprio rig, com fallback de 1,75 m.
- As animações centrais incluem idle/walk/run, jump_start/jump_air/jump_land, walk_slouch e crouch; as reações direcionais hit_front/back/left/right são carregadas no mesmo rig Ara.

## Inventário e objetos do Duat

`src/inventory.js` mantém o cajado e o khopesh e acrescenta shabti de cera, caixa de magia, papiro, cálamo, recipiente de tinta, amuleto, cera branca, paleta de escriba, cordão marrom e estátua de gato em ébano. Os objetos começam guardados no Duat e são retirados por uma abertura visual presa ao socket da mão; o retorno usa a transição inversa. O catálogo usa IDs estáveis e separa armas, ferramentas, artefatos, materiais e recipiente, sem habilitar o comando de ataque para itens que não sejam armas.

O portal está ancorado ao tórax (prioridade Spine2, depois Spine1/Chest/Spine) no ponto de contato previsto pelo clipe Ara `use_press`; o socket dos itens continua preso à mão direita. O mesmo clipe é usado para retirar e guardar. O controlador bloqueia deslocamento, salto e joystick durante os 1,65 s da interação, tanto no desktop como no mobile. O clipe original termina com o indicador estendido, como um toque; a pose completa de palma/dedos atravessando uma membrana ainda poderá receber um refinamento próprio. A geometria procedural dos itens e a posição real do portal precisam de inspeção no navegador. Consulte `docs/CHARACTER-INVENTORY-DUAT.md`.

## Acessórios autorais integrados

Módulo: src/character-accessories.js.

- `src/character-accessories.js` foi refeito para corrigir a ordem de montagem: a geometria é criada em coordenadas locais do Carter e somente depois os grupos são anexados aos ossos com `Object3D.attach()`, preservando a pose neutra.
- Bolsa: pivô lateral/posterior direito projetado por raycast na superfície do corpo e ancorado a `Hips`; dimensão-alvo provisória de 202 × 158 × 76 mm, equivalente à redução aprovada de 0,88 do corpo Innerscene.
- Alça: faixa de couro de 22 mm projetada sobre os vértices já deformados do `SkinnedMesh`; o trecho superior acompanha `Spine2`/`Spine1` e o trecho inferior acompanha `Hips`, com junção na lateral do tronco. As normais são calculadas a partir dos vértices deformados, para orientar a faixa e o pesponto sobre a camisa.
- Medalhão: desenho e dimensões aprovados preservados. Corrente e pingente são projetados sobre a superfície real da camisa e o conjunto acompanha o osso torácico.
- **Limite de proveniência:** o GLB Innerscene Crossbody Bag continua como referência CC0 aprovada, mas não foi importado. A tentativa de download redirecionou para `files.innerscene.com`, host que não ficou acessível às ferramentas desta sessão. Portanto, o corpo da bolsa no runtime é geometria procedural provisória com a silhueta/dimensões-alvo, não o GLB original.
- A peça preta no ombro vista no screenshot anterior não é criada por `src/character-accessories.js`; sua origem ainda precisa ser identificada na hierarquia do share Ara. Não remover por aproximação.
- A mochila embutida no share Ara permanece desativada por `carry: 'none'`.
- O mesmo módulo é usado pelo jogo e pelo preview, portanto a geometria e a lógica são idênticas em desktop e mobile; apenas a camada de controles muda.
- A revisão está integrada no código, mas **não está marcada como visualmente testada/aprovada** até inspeção real do Carter em navegador.

O gerador Blender continua sendo apenas uma fonte de lookdev e não foi aberto/validado sobre o Carter Ara. A forma atual não deve ser tratada como referência final.

## Ações cinematográficas

src/character.js consulta ANIMATIONS do pacote Ara antes de pedir os clips. Além da locomoção e do salto, solicita somente os IDs encontrados no catálogo:

- use_press — alcançar com a mão direita e tocar um ponto à frente do tórax; usado pelo portal do Duat.
- look_around — observar o ambiente (loop).
- talk_gestures — gesticular ao falar (loop).
- wave — acenar.
- point — apontar.
- bow — inclinar-se/cumprimentar.

As ações expressivas são expostas por playAction() e stopAction(). Se algum ID deixar de existir numa versão futura do catálogo, ele não é solicitado e o botão correspondente é desativado no preview.

## Movimento compartilhado

- A locomoção continua sendo orientada pela velocidade física do controlador e pelo blending idle/walk/run do Ara.
- A aceleração e a desaceleração foram suavizadas.
- A rotação horizontal do corpo é suavizada, mas o root fica estritamente neutro nos eixos de inclinação: somente yaw é aplicado. Não há inclinação frontal nem lateral ao correr, andar para os lados ou girar a câmera.
- Ao trocar de cômodo, o controlador de locomoção anterior é encerrado antes de criar o novo; os portais automáticos reativam a locomoção sem acumular controladores no mesmo mixer.
- A câmera de terceira pessoa acompanha com easing mais lento.
- O salto combina jump_start/jump_air/jump_land com um arco físico vertical no controlador (impulso inicial + gravidade), em vez de manter o root no piso durante o clip.
- A partir de 50% de vitalidade, Carter troca para crouch idle e walk_slouch; o sprint fica bloqueado. O blend mantém três clips distintos (crouch / walk_slouch / run) para evitar duas ações concorrentes com o mesmo clip.
- A reação hit_* tem uma janela curta de impacto; ao continuar andando, o jogador pode retomar a locomoção sem esperar o fim de uma animação longa. Hits repetidos não reiniciam indefinidamente a mesma reação.
- Os valores são compartilhados entre desktop e mobile; somente os controles de entrada diferem.

## Preview

Abra character-preview.html para conferir o mesmo módulo usado pelo jogo. O preview permite orbitar o personagem, verificar frente/perfil/costas, alternar locomoção, testar as ações cinematográficas (incluindo ALCANÇAR O DUAT) e retirar/guardar os oito objetos na bancada do Duat à direita. Use-o para revisar a extensão do braço, o portal, a escala dos objetos e o encaixe na mão antes da inspeção no cenário.

## QA obrigatório — não marcar como concluído antes de testar

- Comparar frente, perfil e costas com a referência de Karen de la Vega.
- Confirmar que a mochila Ara não aparece e que a bolsa transversal é o único item de carga.
- Confirmar que a bolsa está menor, na lateral posterior do quadril direito, e que a face larga não aponta para a frente nem para trás.
- Conferir se a alça cruza o peito e contorna a lateral sem atravessar pescoço, rosto, clavícula ou braço.
- Confirmar que o corpo da bolsa lê como satchel marrom compacta conforme a referência de Karen de la Vega, não como rádio/estojo rígido.
- Conferir se a alça acompanha a superfície do peito e do flanco, entra nos pontos de fixação da bolsa e não forma laços soltos.
- Conferir se o colar acompanha a superfície do tórax, sem flutuar nem atravessar a camisa.
- Identificar a origem da peça preta no ombro antes de removê-la ou substituí-la.
- Verificar clipping da bolsa e da alça em idle, walk, run, curvas e salto.
- Confirmar que a caminhada realmente alterna pernas e braços, sem o efeito de andar parado.
- Confirmar elevação física do root durante o salto e contato dos pés na aterrissagem.
- Verificar o balanço secundário sem vibração, penetração na perna ou movimento excessivo.
- Confirmar que os cinco botões cinematográficos correspondem a clips carregados no Ara.
- Conferir as reações de impacto direcionais e o retorno à locomoção, inclusive quando dois ou mais golpes chegam em sequência e enquanto o jogador mantém movimento.
- Testar as barras VITALIDADE/ENERGIA, custo de HA-DI/orbe, regeneração e limiar de 50% para o estado ferido.
- Conferir o tremor de câmera e a vinheta vermelha periférica quando um golpe conecta.
- Conferir escala do personagem contra portas, móveis, corrimãos e objetos da Brooklyn House.
- Testar em Chrome desktop e celular em paisagem; conferir FPS, memória e descarte do personagem.
- Confirmar que o inventário e o socket WeaponR continuam funcionando.

## Próximas etapas

1. Apresentar e obter aprovação do painel visual de bolsa/alça/colar. Depois da aprovação, identificar a peça escura do ombro no Ara e construir um preview de montagem antes de alterar o runtime.
2. Executar assets/models/carter/blender/create_carter_accessories.py no Blender, comparar a posição com o Carter Ara e salvar a cena-fonte .blend após a inspeção.
3. Fazer revisão de materiais e costuras à escala real, mantendo leitura clara no mobile.
4. Ampliar as interações situacionais — observar estátuas, livros e objetos, cumprimentar e gesticular — sem interromper indevidamente a locomoção. O olhar dirigido ao objeto já está integrado ao exame por proximidade.
5. Só então avaliar exportação de um GLB consolidado; a fonte Ara permanece a referência regenerável do corpo e do rig.

## Regra de produção

O preview deve importar o mesmo src/character.js do jogo. Toda alteração de personagem e movimento deve funcionar nas versões desktop e mobile. Diferenças só são permitidas na interface e nos controles específicos de cada dispositivo. Marcar como testado somente após inspeção real no navegador.
## Vitalidade, energia e reação a dano

O estado global do jogador vive em `src/main.js` e não é reiniciado ao sair da sala de treinamento:

- VITALIDADE começa em 100; cada acerto de espada do Shabti remove 20 pontos. O evento escolhe `hit_front`, `hit_back`, `hit_left` ou `hit_right` conforme a direção do atacante, além de microtremor da câmera e vinheta vermelha periférica.
- A 50 pontos ou menos, Carter passa a usar `crouch` parado e `walk_slouch` em movimento, com velocidade reduzida e sprint bloqueado.
- ENERGIA começa em 100 e recupera 8 pontos por segundo. HA-DI consome 30 pontos; o orbe de treino do cajado consome 12.
- A HUD permanece visível fora da sala de treinamento e adapta-se ao layout desktop/mobile.

## Estudo de animações externas de combate

O repositório KinemIQ Free Game Animations disponibiliza 35 animações humanoides CC0 1.0 em FBX/GLB, incluindo sword slash, sword idle/block, crouch e hit reactions. A opção foi registrada como fonte pesquisada, mas não foi inserida no Carter ainda: os clips precisam ser retargetados/testados no rig Ara e a mão deve permanecer corretamente presa ao cajado/khopesh. A documentação oficial Ara permite esse fluxo por content pack. Já os Shabtis atuais não usam rig humanoide; seus ataques são articulados diretamente nos pivôs autorais do modelo procedural.

Fontes: https://github.com/Kinemiq/free-game-animations · https://ara3dgen.com/docs/packs/
