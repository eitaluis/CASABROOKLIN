# Animações e locomoção

## Carter — runtime atual

As animações são geradas localmente em `src/character.js` e dirigidas pela velocidade real do controlador em `src/third-person.js`. A mesma implementação é usada no desktop e no mobile.

- **Idle:** respiração, pequenos movimentos de cabeça e transferência de peso.
- **Walk:** passada alternada, flexão dos joelhos e braços em oposição.
- **Sprint:** lean para frente, passadas maiores, joelhos mais ativos e braços puxados para trás com cotovelos flexionados — inspiração de silhueta/mecânica corporal de Naruto, sem estética anime.
- **Jump:** impulso e recolhimento das pernas.
- **Landing:** flexão amortecida e retorno gradual à locomoção.
- **Bolsa:** oscilação secundária sutil presa ao quadril direito.

Velocidades-alvo do controlador: caminhada 1,5 unidades/s; sprint 4,2 unidades/s. Aceleração/desaceleração e giro são interpolados pelo controlador de terceira pessoa.

## Fontes abertas pesquisadas (não integradas nesta versão)

- [Mesh2Motion app](https://github.com/Mesh2Motion/mesh2motion-app) e [assets](https://github.com/Mesh2Motion/mesh2motion-assets) — código MIT; assets/rigs/animações CC0. Avaliar Sprint, Run_Anime, NinjaJump_Start/Idle/Land, Land_Three_Point e Wall_Run para variedade adicional e retarget.
- [Quaternius Universal Animation Library](https://quaternius.itch.io/universal-animation-library) — CC0; alternativa futura para clips baked.
- [KinemIQ Free Game Animations](https://github.com/Kinemiq/free-game-animations) — CC0; clips GLB/FBX de caminhada, corrida, sprint, salto e combate.
- [three-procedural-locomotion](https://github.com/PabloMesquida/three-procedural-locomotion) — MIT; referência técnica para passada, contato dos pés, IK, aceleração e curvas.

## QA pendente

- Testar transições de idle/walk/sprint e contato visual dos pés.
- Observar a bolsa no quadril direito durante corrida, curva e salto.
- Testar em Chrome desktop e celular em modo paisagem.
