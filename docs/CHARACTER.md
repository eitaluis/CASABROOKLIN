# Carter Kane — modelo e movimento

Status: **base humana anterior restaurada no runtime; bolsa transversal integrada como acessório local; aguarda inspeção visual em navegador.**

## Direção visual aprovada
- C — Game 3D gráfico, totalmente 3D e com leitura de personagem de videogame.
- Rosto humano natural, sem estética anime, olhos exagerados ou proporções chibi.
- Corpo jovem, lean/atlético e ágil; sem músculos adultos exagerados.
- Pele negra, cabelo crespo curto, camisa azul, calça cargo cáqui e tênis escuros.
- Bolsa transversal de couro conhaque no quadril direito, alça sobre o peito.
- A referência a Naruto aplica-se ao movimento corporal: lean para a frente, braços ativos/recuados, passadas amplas, saltos e aterrissagem.

## Base de personagem
- `src/character.js` carrega novamente o modelo anterior criado com Ara 3D Gen.
- A base é uma malha humana contínua com rig e skin weights; o protótipo procedural de primitivas foi removido após reprovação visual.
- A configuração mantém a identidade anterior do Carter e ajusta o figurino para camisa azul + calça cargo cáqui, tênis escuros e ausência de mochila automática.
- O modelo é construído no navegador pelo pacote `ara3d@0.18.1`; não é uma malha procedural de partes separadas criada em Three.js.
- O game rig inclui `WeaponR`, preservando o encaixe do inventário de cajado e khopesh.

## Bolsa transversal
- A referência aprovada é [Innerscene Crossbody Bag](https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2), CC0: couro conhaque, aba frontal, pesponto, fecho de latão e argolas.
- O GLB original não foi obtido para esta integração. O corpo e a alça foram modelados como geometria local própria, com uma fita plana em vez de uma alça cilíndrica.
- Posicionamento pretendido: quadril direito, alça diagonal do ombro esquerdo. O pivô da bolsa recebe balanço sutil conforme a velocidade.

## Movimento
- Clips carregados: `idle`, `walk`, `run`, `jump_start`, `jump_air`, `jump_land`.
- O Ara mistura idle/walk/run segundo a velocidade do controlador.
- O controlador de terceira pessoa aplica inclinação frontal e banking na mudança de direção; os mesmos cálculos servem desktop e mobile.
- O salto reproduz a sequência start/air/land e volta à locomoção.
- A bolsa recebe oscilação de pequena amplitude durante movimento, sem alterar o clip principal.

## Validação ainda pendente
1. Abrir `character-preview.html` e comparar rosto, corpo e roupas com o Carter anterior.
2. Conferir se a alça está sobre a superfície da camisa, sem atravessar pescoço/ombro.
3. Ajustar a posição e o tamanho da bolsa no quadril direito.
4. Observar balanço/clipping da bolsa no sprint e no salto.
5. Testar cajado/khopesh em `WeaponR`.
6. Testar o mesmo modelo em desktop e mobile paisagem.

**Não marcar como visualmente aprovado até realizar os testes 1–6 em navegador real.**
