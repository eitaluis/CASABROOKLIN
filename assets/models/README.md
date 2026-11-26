# Carter Kane — modelo e acessórios

## Pipeline aprovado

O corpo e o rosto do personagem jogável permanecem no modelo humano contínuo e rigado aprovado no Ara 3D Gen, carregado em src/character.js. O projeto segue uma abordagem híbrida: Ara para malha, rig e animações; geometria autoral Three.js e futura edição Blender para acessórios e refinamentos.

Não substituir o modelo Ara por um avatar procedural, placeholder ou personagem low-poly.

## Direção visual

- **C — Game 3D gráfico:** totalmente tridimensional, volumes limpos, materiais estilizados e leitura clara em movimento.
- Rosto humano natural; sem anime, olhos exagerados ou proporções chibi.
- Carter adolescente negro, cabelo crespo curto, corpo esguio/atlético.
- Camisa azul, calça cáqui e calçado escuro/marrom.
- Referência principal: Carter do lado esquerdo na arte de Karen de la Vega (link em docs/CHARACTER.md).
- Mesmo corpo, rosto, rig, bolsa e medalhão no desktop e no mobile.

## Acessórios já implementados

Módulo: src/character-accessories.js.

- Bolsa em couro conhaque com corpo estruturado, aba, bolso, costura e ferragens em latão.
- Alça diagonal do ombro esquerdo ao quadril direito.
- A bolsa acompanha o movimento do quadril e recebe oscilação secundária proporcional à velocidade.
- Medalhão dourado com corrente e relevo egípcio simplificado.
- Os objetos são geometrias e materiais originais do projeto, criados no runtime; não dependem de um GLB externo.

## Rig e compatibilidade

- A bolsa localiza o osso Hips; o trecho superior da alça e a corrente/medalhão localizam Spine2/Spine1/Chest/Spine. Se o osso adequado não existir, usam o root do modelo.
- O gerador Blender cria âncoras distintas para bolsa (Hips), alça (Spine2) e colar/medalhão (Spine2), facilitando a edição e a futura exportação.
- O corpo, a bolsa e o medalhão compartilham o mesmo root e a mesma origem.
- O socket WeaponR do inventário deve permanecer intacto.
- A integração usa a malha e o rig do Ara; não é um segundo esqueleto.

## Blender — próxima etapa

O gerador editável assets/models/carter/blender/create_carter_accessories.py já cria as peças-base no Blender. Ainda não há um arquivo .blend salvo neste commit. Execute o script com o Carter Ara disponível como referência de proporção e rig para refinar:
- costuras e espessura da alça;
- couro e ferragens da bolsa;
- medalhão/corrente;
- eventuais detalhes de roupa aprovados após comparar com a ilustração.

O arquivo Blender deve ser fonte editável; a exportação para jogo deve ser GLB com materiais PBR e, se necessário, acessórios separados para preservar a animação do rig.

## Preview

Abra /character-preview.html para orbitar o modelo, conferir frente, perfil e costas e testar locomoção e ações cinematográficas.

## QA

A posição anatômica da bolsa e do medalhão ainda requer inspeção visual em navegador real. Não marcar o acessório como final até confirmar o quadril direito do personagem, a alça no ombro correto e ausência de clipping nas animações.