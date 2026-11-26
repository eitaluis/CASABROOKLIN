# Animações e locomoção

## Ciclo principal — Carter

A marcha e a corrida são animadas localmente em `src/character.js` e dirigidas pela velocidade real do controlador em `src/third-person.js`.

- caminhada ágil: 3,9 unidades/s;
- corrida: 7,8 unidades/s;
- aceleração e desaceleração amortecidas;
- giro corporal suavizado em vez de mudança instantânea de direção;
- passada, flexão de joelho, balanço oposto dos braços e elevação do corpo;
- inclinação do tronco, movimento da cabeça e oscilação da bolsa;
- transição gradual entre caminhada e corrida.

## Fontes abertas pesquisadas

- [three-procedural-locomotion](https://github.com/PabloMesquida/three-procedural-locomotion) — MIT; referência técnica para passada, posicionamento de pés, IK, aceleração, curvas e corrida. Não é importada no runtime atual.
- [Quaternius Universal Animation Library](https://quaternius.itch.io/universal-animation-library) — CC0; opção futura para gestos, interações e movimentos especiais.
- [KinemIQ Free Game Animations](https://github.com/Kinemiq/free-game-animations) — CC0; alternativa de clipes baked para ações específicas.
- [Grab3D Character Mixer](https://grab3d.com/tools/character-mixer/) — CC0; inclui idle, walk, run, wave e jump num rig humanoide de 19 ossos. Referência para uma futura troca por GLB skinned.

