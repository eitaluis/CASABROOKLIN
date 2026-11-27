# Carter Kane — modelo, movimento e refinamento

Status: **seis animações escolhidas pelo usuário integradas ao rig Ara; GLB Innerscene CC0 da bolsa baixado, inspecionado e carregado no runtime; alça transversal e colar presos aos ossos/superfície do Carter. A validação automatizada do pack passou. A inspeção visual final em navegador desktop e mobile ainda está pendente.**

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
- O rig mantém idle/walk e reações direcionais Ara; o pack `carter-moves` acrescenta `sprint_loop`, `sprint_shield_loop`, `ninjajump_double`, `jump_land`, `melee_combo` e `sword_heavy_combo`, sem trocar a malha humana, o rosto, o cabelo ou as proporções.

## Inventário e objetos do Duat

`src/inventory.js` mantém o cajado e o khopesh e acrescenta shabti de cera, caixa de magia, papiro, cálamo, recipiente de tinta, amuleto, cera branca, paleta de escriba, cordão marrom e estátua de gato em ébano. Os objetos começam guardados no Duat e são retirados por uma abertura visual presa ao socket da mão; o retorno usa a transição inversa. O catálogo usa IDs estáveis e separa armas, ferramentas, artefatos, materiais e recipiente, sem habilitar o comando de ataque para itens que não sejam armas.

O portal está ancorado ao tórax (prioridade Spine2, depois Spine1/Chest/Spine) no ponto de contato previsto pelo clipe Ara `use_press`; o socket dos itens continua preso à mão direita. O mesmo clipe é usado para retirar e guardar. O controlador bloqueia deslocamento, salto e joystick durante os 1,65 s da interação, tanto no desktop como no mobile. O clipe original termina com o indicador estendido, como um toque; a pose completa de palma/dedos atravessando uma membrana ainda poderá receber um refinamento próprio. A geometria procedural dos itens e a posição real do portal precisam de inspeção no navegador. Consulte `docs/CHARACTER-INVENTORY-DUAT.md`.

## Acessórios integrados

Módulo compartilhado: `src/character-accessories.js`.

- **Bolsa:** GLB real Innerscene CC0 versionado em `assets/models/carter/innerscene-crossbody-bag.glb`. O corpo, aba, costura e ferragens são preservados; a dimensão final-alvo após escala 0,88 é aproximadamente 202 × 76 × 158 mm. O pivô fica no quadril direito lateral/posterior e acompanha `Hips`.
- **Alça:** a alça caída original do GLB é ocultada. Uma fita de couro autoral de 22 mm é projetada na superfície do `SkinnedMesh`, dividida em trecho torácico (`Spine2`/`Spine1`) e trecho do quadril (`Hips`), com junção na lateral.
- **Colar:** a corrente é projetada ponto a ponto na superfície da camisa; o medalhão mantém o desenho aprovado e acompanha a normal da superfície do tórax, preso ao osso torácico.
- **Fallback:** se o GLB local não carregar, a bolsa procedural de contingência permanece visível; isso não altera o asset principal versionado.
- **Paridade:** o jogo e `character-preview.html` usam o mesmo módulo e os mesmos transforms, tanto no desktop quanto no mobile.
- **QA:** o fit de frente, costas, perfil e 3/4 precisa ser conferido em idle, corrida, salto e combate no navegador real antes da aprovação visual.

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

- O pack Ara `carter-moves` é carregado por `src/character.js` com `rootMotion: false`; os deslocamentos X/Z, aceleração, colisões e gravidade continuam no controlador físico `src/third-person.js`, evitando root motion duplicado.
- **Sprint sem objeto:** `carter-moves/sprint_loop`. **Sprint com cajado/khopesh:** `carter-moves/sprint_shield_loop`. O clipe com escudo é usado como referência corporal de corrida com objeto; não adiciona um escudo ao inventário.
- **Salto:** `ninjajump_double` toca no impulso e segura a última pose enquanto o controlador calcula o arco. `jump_land` só começa quando a colisão detecta contato real com o piso; a locomoção retorna ao fim da aterrissagem.
- **Ataque:** a tecla `F` e o botão de uso no inventário móvel chamam a mesma função. Sem arma equipada, toca `melee_combo`; com cajado ou khopesh, toca `sword_heavy_combo`.
- O sprint só fica disponível quando Carter não está ferido; a condição de ferimento continua reduzindo a velocidade e usando as animações alternativas já existentes.
- O mesmo rig, os mesmos clipes e a mesma lógica de acessórios são compartilhados; só os controles e os elementos de interface mudam entre desktop e mobile.

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

## Corrida e salto — pesquisa para a próxima revisão

O estudo de referências e assets candidatos está em `docs/CARTER-MOVEMENT-ANIMATION-STUDY.md`. A direção proposta é corrida baixa/inclinada com o objeto equipado estendido atrás, inspirada visualmente na Naruto Run, mas tratada como interpretação de gameplay. A proposta para o salto combina antecipação, take-off, air loop variável e aterrissagem absorvida. Os clips ainda não foram baixados nem integrados; revisar depois da validação visual da bolsa e do medalhão.

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


## Movimento de combate de Carter — 27/11/2026

O runtime usa o pack Ara `carter-moves` com seis clips retargetados: corrida livre, corrida com objeto, salto ninja, aterrissagem, combo desarmado e combo pesado armado. A tecla F chama o combo conforme o item equipado; o botão ATACAR do mobile é o mesmo callback. O controlador físico sincroniza a aterrissagem com o contato real ao solo. Detalhes, tempos e créditos estão em `assets/animations/README.md`.

## Bolsa e colar — asset de runtime

A bolsa usa o GLB Innerscene Crossbody Bag CC0 em `assets/models/carter/innerscene-crossbody-bag.glb`; somente o nó da alça original é ocultado e a alça nova é projetada no corpo/rig do Carter. A corrente e o medalhão continuam na malha da camisa, presos ao pivô do tórax. O QA visual em navegador continua pendente.
