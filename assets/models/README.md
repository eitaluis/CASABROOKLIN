# Carter Kane — modelo procedural local

O personagem jogável foi implementado em `src/character.js` como um modelo 3D original, criado localmente com geometrias do Three.js e um rig articulado de bones.

## Direção visual aprovada
- **C — Game 3D gráfico:** totalmente 3D, formas limpas, volumes legíveis e materiais sem pele fotográfica.
- Rosto humano natural; sem anime, olhos exagerados ou proporções chibi.
- Adolescente negro, cabelo crespo curto, corpo lean/atlético.
- Camiseta azul, calça cargo cáqui e tênis azul-marinho.
- Mesma malha/rig no desktop e no mobile.

## Bolsa transversal
- Corpo em couro conhaque e aba frontal, com ferragens em latão.
- Posicionamento no quadril direito; alça diagonal do ombro esquerdo ao quadril direito.
- O desenho segue a referência do asset CC0 [Innerscene Crossbody Bag](https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2).
- **Limitação de integração:** o arquivo GLB original do Innerscene não pôde ser obtido pelo ambiente de edição (o endpoint redireciona para um host de arquivo GLB não acessível pela ferramenta). Para não bloquear a integração, o corpo e a alça foram recriados como geometria Three.js local, seguindo a descrição e a escala da peça. Não é o binário original do Innerscene.

## Rig e acessórios
- Hierarquia humanoide com ossos Hips, Spine, Spine1, Neck, Head, Left/RightArm, Left/RightForeArm, Left/RightHand, Left/RightUpLeg, Left/RightLeg, Left/RightFoot e WeaponR.
- O socket `WeaponR` está na mão direita e mantém compatibilidade com o inventário atual.
- Os segmentos visuais são objetos parentados aos bones, com articulação procedural no runtime. Não são uma única malha deformada por skin weights.

## Animação local
- Idle respirado, caminhada, corrida/sprint, balanço de braços e pernas, inclinação frontal, flexão dos joelhos e pequeno balanço da bolsa.
- Salto com impulso, pose aérea, gravidade e aterrissagem.
- Animações geradas localmente para manter um mesmo comportamento no desktop e no mobile; clips externos ficam como referência futura.

## Preview
Abra `/character-preview.html` para ver o modelo em 3D, orbitar a câmera e alternar entre parado, caminhada, sprint, salto, frente, perfil e costas.
