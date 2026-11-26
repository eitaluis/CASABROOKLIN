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
- `src/character.js`: carregamento do GLB, roupa procedural, acessórios, inicialização do rig e fallback articulado.
- `src/third-person.js`: WASD, corrida, salto, rotação por mouse, câmera de perseguição, teleporte e colisão leve por volumes AABB.
- `assets/manifest.json`: proveniência, endereço remoto e licenças dos assets.
- `docs/OPEN-SOURCES.md`: fontes abertas e decisões de licença.

## Escala

O mundo utiliza metros e eixo Y para cima. O personagem tem escala aproximada de 1,78 m. A biblioteca de locomoção recebe as superfícies transitáveis para consultar a altura do chão e dos degraus.

## Controles

- WASD ou setas: deslocamento relativo à direção da câmera.
- Mouse: orbitar a câmera em torno do personagem.
- Shift: correr.
- Espaço: saltar (quando a biblioteca de locomoção estiver disponível).
- Esc: liberar o cursor.
- 1–4: alternar doca, Grande Salão, biblioteca e quartos.
- Botões da esquerda: teleporte rápido entre ambientes.

## Próximas etapas técnicas

1. Expandir os volumes de colisão para os demais objetos e resolver a circulação vertical na escada em caracol.
2. Interação com portas, maçanetas, fechaduras e objetos.
3. Animação de subida/descida da escada em caracol com detecção de degraus.
4. Sons de passos por tipo de superfície.
5. Materiais PBR e assets locais para funcionamento sem CDN.
6. Refinamento do figurino e substituição gradual das geometrias provisórias por modelos de maior detalhe.
