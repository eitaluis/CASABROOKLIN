# Fontes abertas e base de movimento

Este documento separa assets com licença aberta, referências técnicas e o que está realmente carregado no runtime.

## 1. Personagem — runtime atual e direção aprovada

O Carter em runtime ainda é construído pela biblioteca **Ara 3D Gen** usando o link compartilhado em src/character.js. O personagem não foi substituído. A direção visual C — Game 3D gráfico — foi aprovada, mas a malha/rig final ainda passa por avaliação.

**Direção aprovada para Carter**
- Personagem 3D de videogame, estilizado e gráfico, com silhueta atlética e formas legíveis.
- Rosto humano natural; sem estética anime, olhos exagerados, chibi ou realismo de escaneamento.
- Corpo jovem e ágil, pele negra e cabelo crespo escuro.
- Camisa azul, calça cáqui e bolsa transversal no quadril direito.
- Desktop e mobile compartilham o mesmo modelo, rig, assets e animações.

**Ara 3D Gen / ara3d**  
https://ara3dgen.com/docs/library/  
https://github.com/ara3d/ara3d  
Biblioteca: MIT. A documentação informa que os personagens usam dados-base CC0 do MakeHuman e animações da CMU Graphics Lab Motion Capture Database. O rig inclui um osso WeaponR, sob a mão direita, destinado ao encaixe de armas. O projeto usa esse socket para o cajado e o khopesh. A disponibilidade do modelo atual depende do CDN Ara, salvo se o asset for hospedado localmente. Avaliar se uma saída menos realista pode ser obtida sem prejudicar rosto e rig.

**Quaternius — Universal Base Characters**  
https://quaternius.com/packs/universalbasecharacters.html  
Licença CC0-1.0. Seis bases humanoides em proporções Teen/Regular/Superhero, vinte cabelos, rig humanoide e formatos FBX/glTF/Blend; média anunciada de aproximadamente 13 mil triângulos. Primeiro candidato técnico para testar a direção aprovada e retarget. Não está no runtime. Inspecionar a geometria facial do modelo Teen para evitar aparência low-poly facetada demais.

**MPFB 2 / MakeHuman Community**  
https://github.com/makehumancommunity/mpfb2  
https://static.makehumancommunity.org/mpfb.html  
Código do add-on GPL-3.0; assets centrais do sistema MakeHuman CC0-1.0. Permite personalizar rosto, corpo, cabelo, roupas e rig antes de exportar GLB. Alternativa caso a base Quaternius não ofereça rosto natural suficiente; não está no runtime.

**CharacterCreator — kblood**  
https://github.com/kblood/CharacterCreator  
https://dionysus.dk/webxr/charactercreator/  
Código GPL-3.0-or-later; o projeto declara CC0-1.0 para GLBs gerados exclusivamente com fontes CC0 e dados próprios. Ferramenta de personalização e exportação GLB em avaliação; não está integrada no runtime.

## 2. Bolsa transversal — asset aprovado, integração pendente

**Innerscene — Crossbody Bag**  
https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2  
GLB de 3,5 MB. Licença CC0; uso, modificação e redistribuição permitidos, inclusive comercialmente. Corpo em couro conhaque, aba frontal e fecho de latão.  
**Posição decidida:** quadril direito de Carter, com a alça cruzando o peito.  
A descrição do asset observa que a alça está disposta atrás da bolsa num laço no chão. Portanto, o formato do corpo da bolsa foi aprovado, mas a alça deverá ser refeita/ajustada para vestir o personagem. O GLB ainda não foi baixado nem integrado no runtime.

## 3. Locomoção e animação

A inspiração de Naruto se limita à mecânica corporal: agilidade, inclinação do tronco, braços ativos, passadas, aceleração e saltos. O Carter continua com rosto e corpo humano natural em 3D, sem imitar o desenho 2D do anime.

**Quaternius — Universal Animation Library**  
https://quaternius.itch.io/universal-animation-library  
Licença: CC0-1.0. Mais de 120 animações num rig humanoide universal, incluindo locomoção em oito direções, jog, sprint, combate e emotes. Inclui versões com e sem root motion e permite retarget em rigs comuns, como Mixamo. Principal conjunto a testar para locomoção do novo Carter; ainda não integrado.

**Quaternius — Universal Animation Library 2**  
https://quaternius.itch.io/universal-animation-library-2  
Licença: CC0-1.0. Mais de 130 animações complementares, incluindo parkour e combos. Avaliar como complemento para saltos e ações atléticas; ainda não integrado.

**KinemIQ — Free Game Animations**  
https://github.com/Kinemiq/free-game-animations  
Licença: CC0-1.0. Repositório com 35 clips humanoides em FBX/GLB, incluindo idle, walk, run, sprint, jump take-off/air/landing, climb, roll e espada. Rig humanoide de 66 ossos a 30 fps. Alternativa prática para testar retarget; ainda não integrado.

**three-procedural-locomotion**, de Pablo Mesquida  
https://github.com/PabloMesquida/three-procedural-locomotion  
Licença: MIT. Referência técnica para cadência, trajetória do pé, IK, aceleração, curvas e caminhada/corrida. O controlador do jogo deverá combinar clips baked e ajustes procedurais leves, sem trocar de animação abruptamente.

## 4. Motor 3D e carregamento

**Three.js**  
https://github.com/mrdoob/three.js  
Licença: MIT. Renderização WebGL, geometria, materiais, iluminação, câmera, animação e GLTFLoader.

## 5. Exterior industrial cinematográfico — primeira integração

A primeira etapa do exterior foi construída com geometria procedural original em src/world.js, usando os kits abaixo como referências de linguagem e escala. Os modelos dos pacotes não foram importados diretamente: a cena precisa manter orçamento de geometria e carregamento compatível com desktop e celular.

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
