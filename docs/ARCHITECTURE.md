# Arquitetura do projeto

## Organização

```text
CASABROOKLIN/
├── index.html
├── src/
│   ├── main.js
│   ├── world.js
│   ├── training-room.js
│   ├── character.js
│   ├── character-accessories.js
│   └── third-person.js
├── assets/
│   ├── manifest.json
│   ├── models/
│   ├── textures/
│   └── audio/
└── docs/
    ├── ARCHITECTURE.md
    └── OPEN-SOURCES.md
```

## Responsabilidades

- `src/main.js`: inicialização Three.js, materiais-base, iluminação, HUD, minimapa, pós-processamento adaptativo e loop de renderização.
- `src/world.js`: geometria da doca, armazém, fachada, escada em caracol, Grande Salão, biblioteca e ala dos quartos.
- `src/interior-details.js`: decoração procedural compartilhada dos interiores, incluindo lustre, arandelas, estandartes, cúpula de Nut, piso de Geb, nichos de papiros e shabtis.
- `src/grand-salon.js`: passe asset-first do Grande Salão — GLB Poly Haven Sofa 03, texturas PBR locais, colunas de lótus, escadarias laterais, balaustradas, tapete serpentino, mesa, estátua de Thoth e fogo volumétrico; expõe colliders, superfícies caminháveis e objetos inspecionáveis.
- `src/training-room.js`: ala de treinamento com quadra, abóbada pintada, efígies de Rá/cestas, bola e placar, prática de alvos mágicos, prova dos quatro shabtis com IA básica de aproximação/ataque, vitalidade do jogador, portas e inspeções; fornece plataformas caminháveis e portais de transição.
- `src/vendor/volumetric-fire.js`: shader volumétrico Housz MIT adaptado a GLSL3/WebGL2; licença preservada em licenses/THREE-VOLUMETRIC-FIRE-MIT.txt.
- `src/character.js`: fábrica reutilizável baseada no Ara 3D Gen, com `characterSource`/`characterName`, `carry: 'none'` no Carter para remover a mochila do share original, animações centrais e ações filtradas pelo catálogo, API de olhar dirigido e descarte seguro do rig; `attachCarterAccessories: false` desliga os acessórios exclusivos dele para outros magos.
- `src/character-accessories.js`: bolsa transversal autoral menor, arredondada e virada para a lateral/posterior do quadril direito; alça que cruza o peito e contorna o flanco; medalhão recuado contra o tórax e movimento secundário. Bolsa presa ao Hips; alça e colar ao Spine2 quando disponível.
- `src/inventory.js`: catálogo de doze itens do Duat, metadados de capacidades por objeto, socket configurável da mão, portal ancorado ao tórax, clipe `use_press`, transições de retirada/armazenamento e uso de armas. Poses específicas de empunhadura e QA em locomoção ainda pendentes.
- `src/magic-system.js` (planejado): catálogo independente de feitiços, animações de conjuração, hieróglifos, seleção de alvos e efeitos por capacidades; pesquisa canônica em `docs/MAGIC-SPELLS-STUDY.md`. A implementação ainda não começou.
- `src/third-person.js`: movimento desktop/mobile compartilhado, aceleração e desaceleração suavizadas, curvas e inclinação corporal cinematográficas, salto, rotação por mouse/toque, câmera com proteção do piso, teleporte, colisão AABB e `setLocked()` para ações diegéticas que exigem imobilidade temporária. Altura da cápsula e alvo vertical da câmera usam a altura informada pelo rig.
- `src/main.js`: interação por proximidade, inventário e direcionamento do olhar de Carter para o objeto examinado por E/INTERAGIR.
- `assets/manifest.json`: proveniência e licenças dos assets locais e referências externas.
- `docs/OPEN-SOURCES.md`: fontes abertas e decisões de licença.

## Escala

O mundo utiliza metros e eixo Y para cima. O personagem tem escala aproximada de 1,78 m. A biblioteca de locomoção recebe as superfícies transitáveis para consultar a altura do chão e dos degraus.

## Controles

- WASD ou setas: deslocamento relativo à direção da câmera.
- Mouse: orbitar a câmera em torno do personagem.
- Shift: correr.
- Espaço: saltar.
- Esc: liberar o cursor.
- 1–5: alternar doca, Grande Salão, biblioteca, quartos e Sala de Treinamento.
- Botões da esquerda: teleporte rápido entre ambientes.

## Próximas etapas técnicas

1. Expandir os volumes de colisão para os demais objetos e resolver a circulação vertical na escada em caracol.
2. Interação com portas, maçanetas, fechaduras e objetos.
3. Animação de subida/descida da escada em caracol com detecção de degraus.
4. Sons de passos por tipo de superfície.
5. Refinar skinning contínuo das articulações se o teste visual revelar junções entre segmentos.
6. Avaliar clips externos de movimento (Mesh2Motion/Quaternius) sem substituir a locomoção compartilhada até validação.


## Exterior e sequência de chegada

- src/exterior.js: composição exterior separada dos interiores. Amplia o East River, constrói Williamsburg Bridge e margem distante de Manhattan, cria skyline atmosférico, barco de papiro e interação de abertura do portal.
- src/world.js: conserva armazém, mansão, doca, escada metálica, passarela e vão aberto do portal; expõe os parâmetros da escada para o controlador.
- src/third-person.js: resolve a altura da volta correspondente ao caminhar pela escada helicoidal.
- src/main.js: integra cenário exterior, plataformas caminháveis, minimap e atualização de água/portal.
- A mesma cena, malha de personagem e lógica de movimento são compartilhadas por desktop e mobile.

A casa está no lado do Brooklyn. Manhattan é a margem oposta e o skyline distante, não uma segunda área explorável. A escada que contorna o armazém é canônica; sua planta helicoidal exata é interpretativa. Consulte docs/BROOKLYN-HOUSE-EXTERIOR.md para a pesquisa, a sequência textual, as fichas e o estado de QA.
