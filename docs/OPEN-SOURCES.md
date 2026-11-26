# Fontes abertas e base de movimento

Este documento separa assets com licença aberta, referências técnicas e o que está realmente carregado no runtime.

## 1. Personagem — runtime atual e opções de substituição

O Carter em runtime é construído pela biblioteca **Ara 3D Gen** usando o link compartilhado em `src/character.js`. O personagem é gerado/carregado como rig humanoide com as animações solicitadas; o projeto não mantém um GLB binário local desse modelo atualmente.

**Ara 3D Gen / ara3d**  
https://ara3dgen.com/docs/library/  
https://github.com/ara3d/ara3d  
Biblioteca: MIT. A documentação informa que os personagens usam dados-base CC0 do MakeHuman e animações da CMU Graphics Lab Motion Capture Database. O rig inclui um osso `WeaponR`, sob a mão direita, destinado ao encaixe de armas. O projeto usa esse socket para o cajado e o khopesh do inventário. A disponibilidade dos dados de personagem depende do CDN Ara, salvo se os assets forem hospedados localmente.

**CharacterCreator — kblood**  
https://github.com/kblood/CharacterCreator  
https://dionysus.dk/webxr/charactercreator/  
Código GPL-3.0-or-later; os GLBs gerados com fontes CC0 e dados próprios são publicados pelo projeto como CC0-1.0. Ferramenta baseada em MakeHuman/MPFB com sliders corporais e faciais, opções de cabelo, vestuário, animações procedurais e exportação GLB. Está documentada como alternativa em avaliação, não integrada no runtime.

**MPFB 2 / MakeHuman Community**  
https://github.com/makehumancommunity/mpfb2  
https://static.makehumancommunity.org/mpfb.html  
Código do add-on GPL-3.0; os assets centrais do sistema MakeHuman são CC0-1.0. Permite personalizar rosto, corpo, assimetria, cabelo, roupas e rig antes de exportar o GLB. Alternativa recomendada para um Carter altamente personalizado em Blender.

**Quaternius — Universal Base Characters**  
https://quaternius.com/packs/universalbasecharacters.html  
Licença CC0-1.0. Seis bases humanoides com proporções Teen/Regular/Superhero, vinte cabelos, rig humanoide e formatos FBX/glTF. Alternativa de aparência mais estilizada e menor custo gráfico.

As opções e os critérios de escolha estão detalhados em `docs/CHARACTER-OPTIONS.md`. Nenhum modelo substituto será integrado antes da escolha e da validação de rig, textura, licença e animações.

**Grab3D Character Mixer**  
https://grab3d.com/tools/character-mixer/  
Licença: CC0 1.0 para personagens exportados. Referência adicional de asset pipeline; não está carregado no runtime.

**Grab3D Teenager**  
https://grab3d.com/models/characters/teen-character/  
Licença: CC0 1.0. Modelo adolescente e rigged; referência de proporções juvenis, não carregado no runtime.

**giaBaoJS — Procedural 3D Characters**  
https://github.com/giaBaoJS/procedural-3d-characters  
Licença: MIT. Referência para geração procedural de malha, rig e keyframes em Three.js.

## 2. Locomoção e animação

**three-procedural-locomotion**, de Pablo Mesquida  
https://github.com/PabloMesquida/three-procedural-locomotion  
Licença: MIT. Referência técnica para cadência, trajetória do pé, IK, aceleração, curvas, caminhada e corrida. A versão atual do Carter usa a locomoção da biblioteca Ara 3D Gen; o controlador do jogo envia a velocidade e aplica lean corporal adicional durante a corrida.

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
35 animações humanoides em GLB/FBX, incluindo idle, walk, run, sprint, crouch, jump, climb e pick-up. Não é usada no runtime atual; fica como alternativa futura para gestos, interações e animações especiais.

**OpenGameArt — Animated Human Low Poly (Quaternius)**  
https://opengameart.org/content/animated-human-low-poly  
Licença anunciada na página: CC0. Alternativa para uma personagem low-poly com animações baked.

## 5. Notas de manutenção

- A versão da biblioteca de locomoção está fixada em `v0.9.0` para reduzir mudanças inesperadas.
- Os assets remotos dependem de disponibilidade dos serviços de CDN e do repositório de origem.
- Para uma versão offline, os binários deverão ser copiados para `assets/models/` após revisão das licenças e dos avisos de atribuição.
- A biblioteca Ara 3D Gen é MIT; conferir também as condições e a proveniência dos dados de personagem e animação usados em cada export.

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
