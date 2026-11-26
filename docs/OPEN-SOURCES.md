# Fontes abertas e base de movimento

Este documento separa assets com licença aberta, referências técnicas e o que está realmente carregado no runtime.

## 1. Personagem — nova implementação

O Carter atual é uma malha humanoide original construída em `src/character.js`, com superfícies suaves, anatomia juvenil estilizada, rosto, cabelo crespo, camisa azul, calça cáqui, tênis e bolsa transversal. Não há GLB externo sendo carregado.

**Grab3D Character Mixer**  
https://grab3d.com/tools/character-mixer/  
Licença: CC0 1.0 para personagens exportados. Ferramenta com 198 peças modulares, estilos Cozy/Blocky/Low Poly, corpo slim e exportação GLB rigged. Inclui idle, walk, run, wave e jump. É referência de asset pipeline e rig; o binário não está integrado no runtime.

**Grab3D Teenager**  
https://grab3d.com/models/characters/teen-character/  
Licença: CC0 1.0. Modelo adolescente com versões GLB, incluindo versão rigged com walk/run. Referência de proporções juvenis e de asset game-ready; não carregado no runtime.

**giaBaoJS — Procedural 3D Characters**  
https://github.com/giaBaoJS/procedural-3d-characters  
Licença: MIT. Referência para geração procedural de malha, rig e keyframes em Three.js.

## 2. Locomoção e animação

**three-procedural-locomotion**, de Pablo Mesquida  
https://github.com/PabloMesquida/three-procedural-locomotion  
Licença: MIT. Referência técnica para cadência, trajetória do pé, IK, aceleração, curvas, caminhada e corrida. A versão atual do Carter usa ciclo procedural próprio, não importa a biblioteca em runtime.

**Grab3D Character Mixer** também documenta clips de idle (2 s), walk (1 s), run (0,67 s), wave e jump num rig de 19 ossos. Fonte útil para uma futura troca por personagem skinned com animações baked.

**Quaternius — Universal Animation Library**  
https://quaternius.itch.io/universal-animation-library  
Licença anunciada: CC0 1.0. Opção futura para gestos e ações especiais.

**KinemIQ — Free Game Animations**  
https://github.com/Kinemiq/free-game-animations  
Licença anunciada: CC0 1.0. Opção futura para clipes de idle, walk, run, sprint, crouch, jump, climb e pick-up.

## 3. Motor 3D e carregamento

**Three.js**  
https://github.com/mrdoob/three.js  
Licença: MIT  
Utilização: renderização WebGL, geometrias, materiais, iluminação, câmera e GLTFLoader.

## 4. Alternativas pesquisadas para animações futuras

**Quaternius — Universal Animation Library**  
https://quaternius.itch.io/universal-animation-library  
Licença anunciada: CC0 1.0  
120+ animações humanoides, com locomoção em oito direções, corrida, sprint, rastejar, nadar, sentar, gestos e combate. Não é a fonte da marcha atual: fica como alternativa para gestos, interações e animações especiais futuras.

**KinemIQ — Free Game Animations**  
https://github.com/Kinemiq/free-game-animations  
Licença anunciada: CC0 1.0  
35 animações humanoides em GLB/FBX, incluindo idle, walk, run, sprint, crouch, jump, climb e pick-up. Não é usada no protótipo atual porque a base de locomoção procedural já cobre o ciclo principal.

**OpenGameArt — Animated Human Low Poly (Quaternius)**  
https://opengameart.org/content/animated-human-low-poly  
Licença anunciada na página: CC0. Alternativa para uma personagem low-poly com animações baked.

## 5. Notas de manutenção

- A versão da biblioteca de locomoção está fixada em `v0.9.0` para reduzir mudanças inesperadas.
- Os assets remotos dependem de disponibilidade dos serviços de CDN e do repositório de origem.
- Para uma versão offline, os binários deverão ser copiados para `assets/models/` após revisão das licenças e dos avisos de atribuição.
- A licença MIT do Three.js e da biblioteca de locomoção deve ser preservada nos avisos de distribuição quando aplicável.

## 6. Exterior industrial cinematográfico — primeira integração

A primeira etapa do exterior foi construída com geometria procedural original em `src/world.js`, usando os kits abaixo como referências de linguagem e escala. Os modelos dos pacotes não foram importados diretamente: a cena precisa manter orçamento de geometria e carregamento compatível com desktop e celular.

**Kenney — City Kit Industrial**  
https://kenney.nl/assets/city-kit-industrial  
Licença: CC0. Referência para módulos industriais, proporções e leitura de volumes urbanos.

**Kenney — Factory Kit**  
https://kenney.nl/assets/factory-kit  
Licença: CC0. Referência para equipamentos, maquinaria e objetos de pátio fabril.

**Poly Haven — materiais PBR**  
https://polyhaven.com/textures  
Licença: CC0. Referência para tijolo, concreto, madeira envelhecida e metal oxidado. Nesta etapa, os materiais continuam sendo gerados localmente pelo projeto; nenhuma textura externa foi adicionada como dependência de runtime.

**Poly Haven — Docklands 01 e Factory Yard**  
https://polyhaven.com/a/docklands_01  
https://polyhaven.com/a/factory_yard  
Licença: CC0. Referências de iluminação e atmosfera ribeirinha/industrial; não são usados como fundos HDRI no runtime atual.

### Geometria original integrada

- Marquise e nervuras sobre o portão de carga, suportes e luzes de serviço.
- Tubulações externas, abraçadeiras e exaustores de cobertura.
- Tesouras metálicas do telhado.
- Pallets, tambores, caixotes, chapas e agrupamentos de sucata.
- Cabeços, defensas de borracha, argolas e cabos de amarração no píer.
- Mastro central e corrimão interno da escada em espiral.
- Blocos de proteção da margem e detalhes de atracação.

Esses elementos são código e geometria originais do projeto, sem dependência de download de modelos externos. A escolha evita importar cenas inteiras de centenas de milhares de triângulos para uma experiência WebGL que também roda em celular.
