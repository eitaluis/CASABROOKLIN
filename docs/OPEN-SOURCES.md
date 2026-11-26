# Fontes abertas e base de movimento

Este documento separa assets com licença aberta, referências técnicas e o que está realmente carregado no runtime.

## 1. Personagem — runtime atual e direção aprovada

O Carter em runtime ainda é construído pela biblioteca Ara 3D Gen usando o link compartilhado em src/character.js. O personagem não foi substituído. A direção visual C — Game 3D gráfico — foi aprovada, mas a malha/rig final ainda passa por avaliação.

**Direção aprovada para Carter**
- Personagem 3D de videogame, estilizado e gráfico, com silhueta atlética e formas legíveis.
- Rosto humano natural; sem estética anime, olhos exagerados, chibi ou realismo de escaneamento.
- Corpo jovem e ágil, pele negra e cabelo crespo escuro.
- Camisa azul, calça cáqui e bolsa transversal no quadril direito.
- Desktop e mobile compartilham o mesmo modelo, rig, assets e animações.
- A prancha feita na conversa é referência conceitual de look-dev, não GLB/rig nem parte do runtime.

**Ara 3D Gen / 3d-gen-TU**
- App: https://ara3dgen.com/
- Código: https://github.com/TuriaArt/3d-gen-TU
- Código MIT; dados MakeHuman CC0-1.0.
- Gerador com sliders corporais/faciais, diferentes idades, etnias, cabelo/roupa e níveis Low (~5–10k tris), Medium (~30–40k) e High (~100–120k). O game rig tem 65 ossos com nomes Mixamo e WeaponR.
- É candidato para um teste controlado de detalhe baixo e materiais simplificados, mas o Carter atual já veio desta família e ficou realista demais. Não considerar como solução aprovada até validar um look-dev mais gráfico.

**Blender Studio — Snow**
- https://studio.blender.org/characters/snow/v4/
- Personagem 3D masculino estilizado, rig de Blender com controles faciais.
- Gratuito, Blender 4.1+, CC-BY. Crédito: “Snow Rig (CC) Blender Foundation | studio.blender.org”.
- Referência visual secundária para rosto humano 3D com acabamento playful. Requer exportação/adaptação antes de usar em Three.js.

**Quaternius — Universal Base Characters**
- https://quaternius.com/packs/universalbasecharacters.html
- CC0-1.0; bases humanoides com rig e formatos FBX/glTF.
- A versão Standard gratuita consultada disponibiliza apenas bases Superhero; Teen/Regular estão no pacote Source. Não usar o Superhero como Carter sem deformar o corpo, pois não corresponde à silhueta jovem/lean aprovada.

**MPFB 2 / MakeHuman Community**
- https://github.com/makehumancommunity/mpfb2
- https://static.makehumancommunity.org/mpfb.html
- Código GPL-3.0; assets centrais CC0-1.0. Alternativa para personalizar rosto e corpo em Blender.

## 2. Bolsa transversal — asset aprovado, integração pendente

**Innerscene — Crossbody Bag**
- https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2
- GLB de 3,5 MB. Licença CC0; uso, modificação e redistribuição permitidos, inclusive comercialmente.
- Corpo em couro conhaque, aba frontal e fecho de latão.
- **Posição decidida:** quadril direito de Carter, com a alça cruzando o peito.
- A alça original está deitada atrás da bolsa em laço no chão. O corpo da bolsa foi aprovado; a alça deverá ser reconstruída/ajustada para vestir o personagem.
- O GLB ainda não foi baixado nem integrado no runtime.

## 3. Locomoção e animação

A inspiração de Naruto se limita à mecânica corporal: agilidade, inclinação do tronco, braços ativos, passadas, aceleração e saltos. O Carter continua com rosto e corpo humano natural em 3D, sem imitar o desenho 2D do anime.

**Mesh2Motion**
- App: https://mesh2motion.org/
- Código: https://github.com/Mesh2Motion/mesh2motion-app
- Assets-fonte: https://github.com/Mesh2Motion/mesh2motion-assets
- Código MIT; modelos, rigs e animações CC0-1.0.
- Importa GLB/GLTF/DAE/FBX, permite configurar/mapear um rig humanoide, pré-visualizar animações e exportar GLB/FBX com vários clips.
- Acervo humano tem clips importantes: Walk, Jog, Sprint, Run_Anime, Jump_Start/Air/Land, NinjaJump_Start/Idle/Land, Land_Three_Point e Wall_Run.
- O rig humano do app tem 66 ossos. É fonte de clips/retarget; seu modelo humano neutro não está escolhido como aparência do Carter.
- Ainda não integrado. É preciso testar compatibilidade de bones, root motion, nomes, contato dos pés e escalas no rig final.

**Quaternius — Universal Animation Library**
- https://quaternius.itch.io/universal-animation-library
- CC0-1.0. Mais de 120 animações humanoides; locomoção em oito direções, jog, sprint, combate e emotes, com opções root-motion e in-place.
- Alternativa se retarget Mesh2Motion não funcionar no rig final.

**Quaternius — Universal Animation Library 2**
- https://quaternius.itch.io/universal-animation-library-2
- CC0-1.0. Mais de 130 animações complementares, incluindo parkour e combos.

**KinemIQ — Free Game Animations**
- https://github.com/Kinemiq/free-game-animations
- Licença anunciada CC0-1.0. 35 clips em GLB/FBX e rig humanoide de 66 ossos a 30 fps.

**three-procedural-locomotion**
- https://github.com/PabloMesquida/three-procedural-locomotion
- MIT. Referência de cadência, trajetória do pé, IK, aceleração, curvas e caminhada/corrida.

## 4. Motor 3D e carregamento

**Three.js**
- https://github.com/mrdoob/three.js
- MIT. Renderização WebGL, geometria, materiais, iluminação, câmera, animação e GLTFLoader.

## 5. Exterior industrial cinematográfico — primeira integração

A primeira etapa do exterior foi construída com geometria procedural original em src/world.js, usando os kits abaixo como referências de linguagem e escala. Os modelos dos pacotes não foram importados diretamente: a cena precisa manter orçamento de geometria e carregamento compatível com desktop e celular.

**Kenney — City Kit Industrial**
- https://kenney.nl/assets/city-kit-industrial
- CC0. Referência para módulos industriais, proporções e leitura de volumes urbanos.

**Kenney — Factory Kit**
- https://kenney.nl/assets/factory-kit
- CC0. Referência para equipamentos, maquinaria e objetos de pátio fabril.

**Poly Haven — materiais PBR**
- https://polyhaven.com/textures
- CC0. Referência para tijolo, concreto, madeira envelhecida e metal oxidado. Nesta etapa, os materiais continuam sendo gerados localmente pelo projeto; nenhuma textura externa foi adicionada como dependência de runtime.

**Poly Haven — Docklands 01 e Factory Yard**
- https://polyhaven.com/a/docklands_01
- https://polyhaven.com/a/factory_yard
- CC0. Referências de iluminação e atmosfera ribeirinha/industrial; não são usados como fundos HDRI no runtime atual.

### Geometria original integrada

- Marquise e nervuras sobre o portão de carga, suportes e luzes de serviço.
- Tubulações externas, abraçadeiras e exaustores de cobertura.
- Tesouras metálicas do telhado.
- Pallets, tambores, caixotes, chapas e agrupamentos de sucata.
- Cabeços, defensas de borracha, argolas e cabos de amarração no píer.
- Mastro central e corrimão interno da escada em espiral.
- Blocos de proteção da margem e detalhes de atracação.

Esses elementos são código e geometria originais do projeto, sem dependência de download de modelos externos. A escolha evita importar cenas inteiras de centenas de milhares de triângulos para uma experiência WebGL que também roda em celular.
