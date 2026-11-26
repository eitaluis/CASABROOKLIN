# Arquitetura do projeto

## Organização

```text
CASABROOKLIN/
├── index.html
├── src/
│   ├── main.js
│   ├── world.js
│   ├── character.js
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
- `src/character.js`: personagem Carter local, geometria gráfica, rig articulado, bolsa transversal, socket WeaponR e animação procedural.
- `src/inventory.js`: inventário inicial, cajado, khopesh, encaixe WeaponR e ações de uso.
- `src/third-person.js`: WASD, corrida com lean frontal, salto, rotação por mouse/toque, câmera com proteção do piso, teleporte e colisão leve por volumes AABB.
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
- 1–4: alternar doca, Grande Salão, biblioteca e quartos.
- Botões da esquerda: teleporte rápido entre ambientes.

## Próximas etapas técnicas

1. Expandir os volumes de colisão para os demais objetos e resolver a circulação vertical na escada em caracol.
2. Interação com portas, maçanetas, fechaduras e objetos.
3. Animação de subida/descida da escada em caracol com detecção de degraus.
4. Sons de passos por tipo de superfície.
5. Refinar skinning contínuo das articulações se o teste visual revelar junções entre segmentos.
6. Avaliar clips externos de movimento (Mesh2Motion/Quaternius) sem substituir a locomoção compartilhada até validação.
