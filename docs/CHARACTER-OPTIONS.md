# Carter Kane — direção visual e base técnica

Status: **direção visual aprovada; modelo/rig final ainda em avaliação.** O Carter atual continua no runtime até que o novo modelo seja aprovado em preview e passe pelos testes de animação.

## 1. Direção visual aprovada

**C — Game 3D gráfico.**

A escolha C refere-se à linguagem visual, não a uma escolha automática de um pacote de personagem chamado "opção C".

- Personagem totalmente 3D, concebido para jogo em tempo real.
- Formas claras, silhueta atlética e reconhecível, volumes simplificados e materiais limpos.
- Aparência playful e expressiva, sem parecer infantil ou chibi.
- Rosto humano natural, com proporções faciais críveis; não anime, não olhos exagerados e não contornos 2D.
- Menos detalhes de pele/poros e menos realismo de escaneamento; mais acabamento de personagem de videogame.
- Corpo jovem, ágil e proporcional; sem musculatura adulta exagerada.
- Manter pele negra, cabelo crespo escuro, camisa azul e calça cáqui.
- Não usar mochila nas costas.

## 2. Bolsa transversal aprovada

**Innerscene — Crossbody Bag**
- Página e GLB: https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2
- Formato: GLB, 3,5 MB.
- Licença: CC0 (domínio público; uso, modificação e redistribuição, inclusive comercial).
- Corpo em couro conhaque, aba frontal costurada, fecho de latão e argolas laterais.
- Dimensões aproximadas do corpo: 230 × 86 × 180 mm.
- **Posição aprovada:** quadril direito do Carter; alça atravessando diagonalmente peito e ombro.
- Nota técnica: a descrição do asset diz que a alça está disposta atrás da bolsa em laço no chão, não pronta para vestir. A bolsa é a peça aprovada, mas a alça precisará ser remodelada/reposicionada ou substituída por uma curva skinned/rigged ajustada ao tronco. A bolsa deve acompanhar a cintura/quadril com balanço secundário sutil.
- Ainda não foi baixada nem integrada no runtime.

## 3. Malhas-base em avaliação (não aprovadas ainda)

### Quaternius — Universal Base Characters
- Página oficial: https://quaternius.com/packs/universalbasecharacters.html
- Seis modelos base game-ready, incluindo proporções Teen/Regular/Superhero; vinte cabelos; rig humanoide; FBX, glTF e Blend.
- Média anunciada: aproximadamente 13 mil triângulos.
- Licença CC0-1.0; uso comercial permitido.
- Compatível com a Universal Animation Library.
- Primeiro candidato técnico para teste de desempenho e retarget.
- Risco visual: algumas peças Quaternius têm tratamento low-poly/facetado. Precisamos inspecionar o modelo Teen concreto e confirmar se o rosto pode ser refinado o suficiente para manter aparência humana natural sem perder a linguagem C. Não integrar automaticamente.

### Ara 3D Gen — reaproveitar ou regenerar o Carter atual
- Biblioteca: https://github.com/ara3d/ara3d
- Gerador: https://ara3dgen.com/
- Código MIT; bases de personagem CC0 segundo a documentação do projeto.
- Vantagem: o runtime atual já usa Ara, o que reduz risco de migração de rig e preserva o socket WeaponR.
- Risco: o Carter atual foi percebido como excessivamente realista. Só considerar esta via se for possível simplificar formas, materiais, proporções e detalhes de superfície o suficiente sem apenas aplicar um filtro visual.

### MPFB 2 / MakeHuman Community
- Add-on: https://extensions.blender.org/add-ons/mpfb/
- Repositório: https://github.com/makehumancommunity/mpfb2
- Documentação: https://static.makehumancommunity.org/mpfb.html
- Código do add-on GPL-3.0; assets centrais do sistema MakeHuman CC0-1.0.
- Controle de rosto, corpo, assimetria, cabelo, roupa, material, rigging Rigify e exportação.
- Alternativa para gerar uma face humana mais natural e customizada; exige Blender, trabalho de look development e otimização para mobile.

### CharacterCreator — kblood
- Repositório: https://github.com/kblood/CharacterCreator
- Viewer: https://dionysus.dk/webxr/charactercreator/
- Código GPL-3.0-or-later; o projeto declara CC0-1.0 para GLBs gerados apenas de fontes CC0 e dados próprios.
- Sliders corporais e faciais, cabelos, roupas, rig e exportação GLB.
- Projeto relativamente recente; roupas descritas como protótipo e retarget de outros rigs ainda precisa ser testado.
- Manter apenas como alternativa de pesquisa, não integrar sem validação.

### Ducz Character Creator
- Demo: https://luanducate.github.io/Ducz.CharacterCreator/
- Repositório: https://github.com/LuanDucate/Ducz.CharacterCreator
- Combina partes de outfits Quaternius, recolore materiais e exporta GLB rigged.
- Os assets Quaternius creditados são CC0; a licença do código do builder não estava explícita na raiz consultada. Usar apenas como referência visual até esclarecer.

## 4. Movimento aprovado como requisito de design

A inspiração Naruto é de **mecânica corporal e silhueta em movimento**, não de rosto ou estética 2D.

- Idle: transferência de peso, respiração e microajustes, sem pose rígida.
- Walk: passos naturais com peso e contato claro dos pés.
- Run: tronco ligeiramente projetado, braços alternando e passadas mais amplas.
- Sprint: inclinação mais evidente, aceleração, braços ativos e uma silhueta atlética; não copiar literalmente o gesto de Naruto se isso prejudicar a biomecânica.
- Mudanças de direção: inclinação do tronco e ajuste dos pés, sem deslizar.
- Jump/land: impulso, recolhimento das pernas, antecipação e aterrissagem amortecida.
- A bolsa transversal tem balanço secundário discreto; não deve flutuar, atravessar o corpo ou girar sem peso.

### Quaternius — Universal Animation Library
- Página: https://quaternius.itch.io/universal-animation-library
- 120+ clips humanoides, rig universal, locomoção em oito direções, jog, sprint, combate e emotes.
- Tem versões com e sem root motion e é compatível com rigs comuns (por exemplo, Mixamo).
- Licença CC0-1.0; uso comercial permitido.
- Principal biblioteca a testar para a base de locomoção, se o retarget funcionar corretamente no rig escolhido.

### Quaternius — Universal Animation Library 2
- Página: https://quaternius.itch.io/universal-animation-library-2
- 130+ animações complementares, incluindo parkour e combos de combate.
- Licença CC0-1.0; testar como complemento para saltos e ações atléticas.

### KinemIQ — Free Game Animations
- Repositório: https://github.com/Kinemiq/free-game-animations
- 35 clips CC0 em GLB/FBX, incluindo idle, walk, run, sprint, jump take-off/air/land, climb, roll e sword slash/idle/block.
- Um esqueleto humanoide de 66 ossos a 30 fps.
- Alternativa prática para teste de retarget e integração direta em Three.js.

### Referência técnica
- three-procedural-locomotion: https://github.com/PabloMesquida/three-procedural-locomotion (MIT).
- Usar como referência de cadência, contato dos pés, IK, aceleração, curvas e transições.

## 5. Plano de validação

1. Baixar e inspecionar o GLB Quaternius Teen; avaliar rosto, silhueta, cabelo, rig e peso em triângulos.
2. Fazer preview com a roupa do Carter e a bolsa Innerscene no quadril direito, com a alça ajustada ao tronco.
3. Testar clips de idle, walk, jog/run, sprint, jump/land e curvas no Three.js.
4. Conferir mão direita/WeaponR, mãos/dedos, roupa, clipping da bolsa e comportamento da bolsa em movimento.
5. Apresentar frente, perfil, costas e sequência de sprint.
6. Só depois de aprovação explícita substituir src/character.js e integrar o mesmo asset/rig/animador no desktop e mobile.
