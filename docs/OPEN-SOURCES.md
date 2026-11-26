# Fontes abertas e proveniência

## Personagem Carter — runtime atual

**Ara 3D Gen** — https://github.com/ara3d/ara3d — pacote JavaScript MIT.
- O jogo voltou a usar a base humana contínua, com rig de jogo e skin weights, em vez do protótipo procedural de cápsulas/esferas/caixas que foi rejeitado após inspeção visual.
- A configuração mantém o rosto humano, cabelo crespo curto e proporções juvenis do Carter anterior. Figurino: camisa azul, calça cargo cáqui e tênis escuros; sem mochila automática.
- A malha é gerada pelo Ara no navegador. O pacote fornece os clips de idle, walk, run e jump usados no controlador. O movimento de jogo continua compartilhado entre desktop e mobile.
- O asset original da Innerscene é apenas referência de forma e acabamento; ele não foi incorporado como arquivo binário.

O Ara documenta que a malha humana recebe skin weights CC0 MakeHuman, roupas e cabelo também recebem pesos, e o game rig tem 65 ossos, nomes Mixamo e socket WeaponR na mão direita. A biblioteca mistura idle/walk/run pela velocidade e atualiza expressões/blinks com `hero.update(dt)`.

## Bolsa transversal

**Referência:** [Innerscene Crossbody Bag](https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2), CC0.
- Referência estética: couro conhaque, aba frontal pespontada, fecho de latão e argolas laterais.
- O GLB original não foi obtido pelo ambiente de edição. O runtime usa geometria local própria para o corpo da bolsa e para uma alça plana vestível, ajustada sobre o peito.
- Posição aprovada: quadril direito; alça diagonal do ombro esquerdo ao quadril direito. A bolsa tem balanço secundário leve.
- Não creditar a geometria local como arquivo original da Innerscene.

## Animações e locomoção

**Ara 3D Gen** — clips atuais: `idle`, `walk`, `run`, `jump_start`, `jump_air`, `jump_land`.
- `hero.locomotion(mixer)` mistura idle/walk/run conforme velocidade.
- O controlador de terceira pessoa inclina o pivô do personagem para a frente durante sprint, aplica direção e curva, e funciona da mesma forma em desktop e mobile.
- A referência Naruto continua limitada à linguagem corporal de corrida ágil; não são usados modelos, rostos ou animações extraídos da franquia.

**Mesh2Motion**
- https://github.com/Mesh2Motion/mesh2motion-app
- https://github.com/Mesh2Motion/mesh2motion-assets
- Referência futura para clips atléticos e retargeting; ainda não integrada.

**Quaternius Universal Animation Library**
- https://quaternius.itch.io/universal-animation-library
- Alternativa futura CC0 para mais ciclos baked; ainda não integrada.

## Motor

**Three.js** — https://github.com/mrdoob/three.js — MIT.
