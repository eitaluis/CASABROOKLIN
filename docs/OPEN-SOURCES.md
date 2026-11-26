# Fontes abertas e proveniência

## Personagem Carter — implementação atual

**Geometria original local do projeto**, criada em `src/character.js` com geometrias e materiais do Three.js (licença MIT). O runtime não carrega mais o modelo Ara remoto. O rig é hierárquico, com bones humanoides e socket `WeaponR`; as peças visuais são parentadas aos bones, não usam skin weights.

Direção: Game 3D gráfico, rosto humano natural, cabelo crespo, corpo jovem/atlético, camiseta azul e calça cáqui. A inspiração de Naruto limita-se à agilidade, lean frontal, passadas e silhueta corporal em movimento.

## Bolsa transversal

**Referência:** [Innerscene Crossbody Bag](https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2), CC0.
A página descreve uma bolsa de couro conhaque de cerca de 230 × 86 × 180 mm, aba costurada, fecho de latão e argolas laterais. A alça do arquivo de origem fica deitada atrás da bolsa. O binário GLB original não pôde ser obtido pelo ambiente de edição, portanto a primeira versão do Carter contém uma recriação procedural local do corpo e da alça vestível (não é o GLB original). Posição: quadril direito, com a alça cruzando peito do ombro esquerdo.

## Animações

Animações atuais geradas por código em `src/character.js`: idle com respiração, walk, sprint, braço/perna alternados, inclinação frontal, salto e aterrissagem. Nenhum clip externo está carregado no runtime nesta versão.

**Mesh2Motion**
- https://github.com/Mesh2Motion/mesh2motion-app
- https://github.com/Mesh2Motion/mesh2motion-assets
- Código MIT; modelos/rigs/animações CC0 segundo o repositório.
- Referência avaliada para futuras animações baked: Sprint, Run_Anime, NinjaJump_Start/Idle/Land, Land_Three_Point e Wall_Run. Ainda não integrada.

**Quaternius Universal Animation Library**
- https://quaternius.itch.io/universal-animation-library
- CC0; alternativa futura para clips baked e retarget.

## Motor

**Three.js** — https://github.com/mrdoob/three.js — MIT.
