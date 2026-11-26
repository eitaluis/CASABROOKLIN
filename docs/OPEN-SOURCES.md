# Fontes abertas e base de movimento

Este documento registra as fontes efetivamente utilizadas no protótipo e as alternativas pesquisadas. A intenção é manter a proveniência dos assets e evitar incorporar modelos ou animações sem licença clara.

## 1. Locomoção humanoide — utilizada

**three-procedural-locomotion**, de Pablo Mesquida  
Repositório: https://github.com/PabloMesquida/three-procedural-locomotion  
Versão fixada: `v0.9.0`  
Licença do código: MIT  
Documentação: https://locomotion.pablopx.com/docs/introduction.html

O projeto gera a marcha em tempo real, em vez de apenas alternar animações pré-gravadas. A documentação descreve:
- cadência, comprimento da passada e trajetória do pé;
- rolagem do calcanhar até a ponta dos dedos;
- colocação do pé e ajuste ao piso;
- IK de duas articulações nas pernas;
- contrabalanço de pelve e ombros;
- balanço dos braços e dedos;
- aceleração, frenagem, curvas, corrida, agachamento e salto;
- suporte a degraus retos, curvos e em espiral.

O autor documenta que a marcha foi calibrada com dados de captura de movimento da CMU e inclui testes para verificar propriedades físicas do passo. Este projeto consome a biblioteca externa; não copia seu código-fonte.

## 2. Malha humanoide — utilizada

Arquivo: `human_mix_propio.glb`  
Fonte: https://github.com/PabloMesquida/three-procedural-locomotion/blob/v0.9.0/modelos/human_mix_propio.glb

A documentação do projeto de locomoção declara que a malha vem de **Human Base Meshes**, do Blender Studio, sob CC0, e que o rig com nomes compatíveis com Mixamo foi preparado pelo autor da biblioteca. A roupa, mochila, cabelo e acessórios visuais da Brooklyn House são criados separadamente em `src/character.js`.

A malha é carregada em runtime por CDN. Caso a rede ou o CDN falhe, o aplicativo apresenta um boneco articulado local de contingência.

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
