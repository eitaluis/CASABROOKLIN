# Animações e locomoção

A caminhada, corrida e transições principais do personagem são calculadas em tempo real por `three-procedural-locomotion` v0.9.0, em vez de depender de clipes baked.

A biblioteca é calibrada com dados CMU motion capture e inclui:
- ciclo de marcha e corrida com transição contínua;
- passada, cadência e elevação natural dos pés;
- rolagem do calcanhar até os dedos;
- ajuste da pisada ao piso e aos degraus;
- balanço dos braços, mãos, tronco e pelve;
- curvas com antecipação de corpo;
- salto, agachamento e subida/descida de escadas.

Fontes e licença estão registradas em `docs/OPEN-SOURCES.md`.

## Animações adicionais futuras

Para gestos, interações com objetos, poses e ações específicas, foram identificadas estas bibliotecas abertas:
- Quaternius Universal Animation Library (CC0): https://quaternius.itch.io/universal-animation-library
- KinemIQ Free Game Animations (CC0): https://github.com/Kinemiq/free-game-animations

Essas bibliotecas são referências e alternativas futuras; ainda não estão incorporadas no ciclo principal do personagem.
