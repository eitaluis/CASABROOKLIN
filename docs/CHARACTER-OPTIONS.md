# Carter Kane — direção visual e base técnica

Status: **direção visual e bolsa aprovadas; base 3D final em avaliação.** O Carter atual continua no runtime até que o novo modelo rigado seja apresentado e aprovado.

## 1. Direção visual aprovada

**C — Game 3D gráfico.**

A escolha C refere-se à linguagem visual, não a uma escolha automática de um pacote pronto.

- Personagem totalmente 3D, concebido para jogo em tempo real.
- Formas claras, silhueta atlética e reconhecível, volumes simplificados e materiais limpos.
- Aparência playful e expressiva, sem parecer infantil ou chibi.
- Rosto humano natural, com proporções faciais críveis; não anime, não olhos exagerados e não contornos 2D.
- Menos detalhes de pele/poros e menos realismo de escaneamento; mais acabamento de personagem de videogame.
- Corpo jovem, lean e ágil; sem musculatura adulta exagerada.
- Pele negra, cabelo crespo escuro, camisa azul, calça cáqui e tênis azul/branco.
- Não usar mochila nas costas.

A prancha visual de conceito foi preparada na conversa como guia de look-dev (frente, perfil, costas, sprint e cenas de jogo). Ela não representa um GLB real, não foi integrada ao repositório e não deve ser confundida com um personagem já animado.

## 2. Bolsa transversal aprovada

**Innerscene — Crossbody Bag**
- Página e GLB: https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2
- Formato: GLB, 3,5 MB.
- Licença: CC0 (domínio público; uso, modificação e redistribuição, inclusive comercial).
- Corpo em couro conhaque, aba frontal costurada, fecho de latão e argolas laterais.
- Dimensões aproximadas do corpo: 230 × 86 × 180 mm.
- **Posição aprovada:** quadril direito do Carter; alça atravessando diagonalmente peito e ombro.
- Nota técnica: a descrição do asset diz que a alça está disposta atrás da bolsa em laço no chão, não pronta para vestir. O corpo da bolsa é a peça aprovada; a alça precisará ser remodelada/reposicionada ou substituída por uma curva skinned/rigged ajustada ao tronco.
- O GLB ainda não foi baixado nem integrado no runtime.

## 3. Bases e geradores avaliados

### Ara 3D Gen / 3d-gen-TU — primeiro candidato para um teste controlado

- App: https://ara3dgen.com/
- Repositório de código/fork avaliado: https://github.com/TuriaArt/3d-gen-TU
- Código MIT; dados de personagem MakeHuman CC0-1.0 (ver LICENSE e scripts/ASSETS_LICENSE.txt).
- 935 morph targets, 219 sliders de detalhe facial/corporal, diferentes idades, etnias e proporções; cabelo, roupa e acessórios modulares.
- Níveis de detalhe declarados: Low ~5–10k triângulos; Medium ~30–40k; High ~100–120k.
- Game rig de 65 ossos com nomes Mixamo, compatível com Unity Humanoid/Unreal/Mixamo, e socket WeaponR.
- **Risco:** o pipeline gera humanos realistas e skins foto-baseadas; o Carter atual foi percebido como realista demais. Testar Low + materiais gráficos sem textura de pele fotográfica, proporções juvenis e volumes simplificados. Não basta reduzir polígonos e deixar o rosto facetado.
- É uma via de teste, não a aprovação automática do modelo atual.

### Mesh2Motion — ferramenta e acervo de animações

- App: https://mesh2motion.org/
- Repositórios: https://github.com/Mesh2Motion/mesh2motion-app e https://github.com/Mesh2Motion/mesh2motion-assets
- Código MIT; modelos, rigs e animações do acervo CC0-1.0.
- Importa GLB/GLTF/DAE/FBX, permite mapear um rig humanoide, pré-visualizar animações e exportar GLB/FBX com vários clips.
- O app usa um rig humano de 66 ossos. É uma fonte de locomoção para retarget, não o modelo final do Carter.
- Clips relevantes encontrados no manifesto humano: Walk, Jog, Sprint, Run_Anime, Jump_Start, Jump_air, Jump_Land, NinjaJump_Start, NinjaJump_Idle, NinjaJump_Land, Land_Three_Point e Wall_Run.
- Usar Sprint como ciclo de velocidade; avaliar Run_Anime como gesto/referência (clip não-loop); usar NinjaJump e Land_Three_Point para saltos/aterrissagem.
- Ainda não integrado. Retarget, nomenclatura dos ossos, root motion e alinhamento dos pés precisam de teste no rig escolhido.

### Blender Studio — Snow (referência visual secundária)

- Página: https://studio.blender.org/characters/snow/v4/
- Personagem masculino 3D estilizado com rosto articulado e rig completo; gratuito para Blender 4.1+.
- Licença CC-BY; crédito exigido: “Snow Rig (CC) Blender Foundation | studio.blender.org”.
- Direção visual útil como referência de personagem 3D playful com rosto humano, não anime.
- Exige exportação/adaptação do rig Blender para GLB e ajuste visual de pele/cabelo/roupas; não está integrado.

### Quaternius — Universal Base Characters

- Página oficial: https://quaternius.com/packs/universalbasecharacters.html
- Seis bases no pacote completo: proporções Teen/Regular/Superhero, vinte cabelos, rig humanoide, FBX/glTF.
- Licença CC0-1.0.
- **Atenção:** a versão Standard gratuita consultada disponibiliza apenas as bases Superhero masculinas/femininas; Teen/Regular estão no Source pago. Como o Carter não deve parecer musculoso, não usar a base Superhero como substituição imediata.
- O pacote continua útil como referência de malha/rig e pode ser reconsiderado se a base Teen estiver disponível.

### MPFB 2 / MakeHuman Community

- Add-on: https://extensions.blender.org/add-ons/mpfb/
- Repositório: https://github.com/makehumancommunity/mpfb2
- Documentação: https://static.makehumancommunity.org/mpfb.html
- Código do add-on GPL-3.0; assets centrais do sistema MakeHuman CC0-1.0.
- Controle de rosto, corpo, assimetria, cabelo, roupas, material, rigging Rigify e exportação.
- Alternativa de maior controle facial, mas exige Blender e trabalho de look development.

### CharacterCreator — kblood

- Repositório: https://github.com/kblood/CharacterCreator
- Viewer: https://dionysus.dk/webxr/charactercreator/
- Código GPL-3.0-or-later; o projeto declara CC0-1.0 para GLBs gerados apenas de fontes CC0 e dados próprios.
- Sliders corporais/faciais, cabelos, roupas, rig e exportação GLB.
- Projeto relativamente recente; roupas são descritas como protótipo e retarget ainda precisa ser testado.

## 4. Movimento aprovado como requisito de design

A inspiração Naruto é de **mecânica corporal e silhueta em movimento**, não de rosto ou estética 2D.

- Idle: transferência de peso, respiração e microajustes, sem pose rígida.
- Walk: passos naturais com peso e contato claro dos pés.
- Run: tronco ligeiramente projetado, braços alternando e passadas mais amplas.
- Sprint: inclinação mais evidente, aceleração, braços ativos e silhueta atlética; sem copiar literalmente o gesto de Naruto se isso prejudicar a biomecânica.
- Mudanças de direção: inclinação do tronco e ajuste dos pés, sem deslizar.
- Jump/land: impulso, recolhimento das pernas, antecipação e aterrissagem amortecida.
- A bolsa transversal tem balanço secundário discreto; não deve flutuar, atravessar o corpo ou girar sem peso.

### Mesh2Motion — clips específicos para teste

- Sprint (loop) para o ciclo rápido.
- Run_Anime (não-loop) como referência para gesto/silhueta; não assumir que funciona como ciclo de corrida.
- NinjaJump_Start, NinjaJump_Idle e NinjaJump_Land para salto dinâmico.
- Land_Three_Point para aterrissagem em três apoios.
- Wall_Run para avaliar um recurso futuro de mobilidade.
- Walk, Jog, Jump_Start, Jump_air e Jump_Land para transições gerais.

### Outras bibliotecas

**Quaternius — Universal Animation Library**
- https://quaternius.itch.io/universal-animation-library
- Licença CC0-1.0; 120+ clips humanoides, locomoção em oito direções, jog, sprint, combate e emotes; opções com/sem root motion.
- Alternativa caso o retarget Mesh2Motion não funcione no rig final.

**KinemIQ — Free Game Animations**
- https://github.com/Kinemiq/free-game-animations
- Licença anunciada CC0-1.0; 35 clips GLB/FBX, rig humanoide de 66 ossos a 30 fps.
- Fonte complementar para idle, walk, run, sprint, jump, climb, roll e ações com espada.

**three-procedural-locomotion**
- https://github.com/PabloMesquida/three-procedural-locomotion
- MIT. Referência de cadência, contato dos pés, IK, aceleração, curvas e transições procedurais.

## 5. Plano de validação

1. Gerar uma base humana de detalhe baixo e testar face/pele sem material fotográfico, com proporções juvenis.
2. Testar o rig de 65 ossos, mão direita e WeaponR no Three.js.
3. Retarget dos clips Mesh2Motion, em particular Walk, Jog, Sprint, Run_Anime, NinjaJump e Land_Three_Point.
4. Incorporar a bolsa Innerscene no quadril direito e reconstruir a alça diagonal; validar balanço e clipping.
5. Apresentar preview 3D rigado com frente, perfil, costas e animações.
6. Só depois da aprovação explícita substituir src/character.js e integrar o mesmo asset/rig/animador no desktop e mobile.
