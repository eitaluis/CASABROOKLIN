# Carter Kane — direção visual, modelo e movimento

Status: **primeira versão local criada e inserida no jogo; aguarda teste visual real em desktop e mobile.**

## 1. Direção visual aprovada

**C — Game 3D gráfico.**

- Personagem totalmente 3D, pensado para um jogo de exploração em terceira pessoa.
- Formas claras, volumes suaves e legíveis, silhueta atlética e acabamento playful.
- Rosto humano natural, com proporções faciais críveis; sem estética anime, olhos exagerados ou proporções chibi.
- Menos detalhes fotográficos de pele/poros e mais acabamento de personagem de videogame.
- Corpo jovem, lean e ágil; sem musculatura adulta exagerada.
- Pele negra, cabelo crespo curto, camiseta azul, calça cargo cáqui e tênis azul-marinho.
- Bolsa transversal de couro conhaque no quadril direito, com alça cruzando o peito.

## 2. Implementação no jogo

**Arquivo:** `src/character.js`

- Geometria original local, produzida com Three.js; o personagem não depende mais de um modelo remoto Ara/CDN.
- Cabeça com mandíbula, olhos, nariz, boca e orelhas discretos.
- Cabelo crespo com base volumétrica e cachos instanciados para reduzir draw calls.
- Camiseta, mangas, calça cargo, bolsos, cinto, tênis e cadarços.
- Rig hierárquico com ossos humanoides de nomes padronizados e socket `WeaponR` na mão direita.
- O inventário existente continua usando o socket da mão direita para cajado e khopesh.
- Os elementos visuais são meshes separados parentados aos bones, não uma única malha com skin weights. O primeiro protótipo prioriza clareza visual, articulação leve e desempenho; movimentos extremos podem mostrar junções entre segmentos.

## 3. Bolsa transversal

A direção foi baseada na peça **Innerscene Crossbody Bag**:
https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2

- Referência CC0: couro conhaque, aba frontal, fecho de latão e argolas.
- O GLB original não pôde ser baixado pelo ambiente de edição: o endpoint redireciona para um host de arquivos que não ficou acessível.
- Para inserir a bolsa agora, o corpo, a aba, as ferragens e a alça vestível foram recriados como geometria Three.js local em `src/character.js`. Portanto, a primeira versão **não é o binário original Innerscene**.
- Posição: quadril direito; alça diagonal do ombro esquerdo ao quadril direito.
- A bolsa recebe um balanço secundário pequeno durante corrida e salto.

## 4. Movimento

As animações da primeira versão são calculadas localmente em `src/character.js`, mantendo a mesma implementação em desktop e mobile.

- **Idle:** respiração sutil, movimento de cabeça e oscilação leve da bolsa.
- **Walk:** passos alternados, flexão de joelho e balanço oposto dos braços.
- **Sprint:** inclinação do tronco para frente, passadas mais amplas e braços puxados para trás com cotovelos flexionados, inspirados na silhueta corporal de corrida de Naruto — sem copiar rosto ou estilo anime.
- **Jump:** impulso vertical, recolhimento das pernas e pose aérea.
- **Landing:** amortecimento do tronco e retorno gradual à locomoção.
- A velocidade é dirigida pelo controlador de terceira pessoa: WASD/Shift no desktop e joystick/botão Correr no mobile.

## 5. Preview e validação

Página independente: `character-preview.html`

Permite orbitar o modelo e alternar entre parado, caminhada, sprint, salto, frente, perfil e costas. Ela carrega o mesmo `src/character.js` usado no jogo.

Ainda precisa de verificação em navegador real:
1. Conferir proporção, rosto, cabelo, roupas e bolsa.
2. Observar junções de braços/pernas durante corrida e salto.
3. Confirmar que a alça cruza o peito sem atravessar a camiseta.
4. Testar cajado e khopesh na mão direita.
5. Testar o mesmo jogo em desktop e celular paisagem.

## 6. Fontes futuras de animação

**Mesh2Motion**
- https://github.com/Mesh2Motion/mesh2motion-app
- https://github.com/Mesh2Motion/mesh2motion-assets
- Código MIT e acervo de rigs/animações CC0 segundo o repositório.
- Clips a avaliar em uma próxima fase: Sprint, Run_Anime, NinjaJump_Start/Idle/Land, Land_Three_Point e Wall_Run.
- Ainda não integrado; a primeira versão usa animação procedural local.

**Quaternius Universal Animation Library**
- https://quaternius.itch.io/universal-animation-library
- CC0; alternativa futura para clips baked e retarget humanoide.
