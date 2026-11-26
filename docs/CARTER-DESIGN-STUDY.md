# Carter Kane — estudo de direção e preview isolado

Atualizado: 26/11/2026

## Decisões recebidas

- **Visual:** C — Playful 3D de aventura.
- **Movimento:** B — Atlético ninja.
- **Roupa:** A — camisa azul casual, calça cáqui reta e tênis discretos.
- **Cabelo:** A — crespo curto, cachos definidos e laterais baixas.
- **Acessório mantido:** bolsa transversal de couro conhaque no quadril direito, alça diagonal sobre o peito.
- **Regra de produção:** nada deste estudo substitui ou altera o personagem/runtime do jogo antes da aprovação visual explícita do usuário.

## Prancha conceitual

Foi gerada uma prancha de estudo visual nesta conversa, mostrando frente, perfil, costas, corrida e pose baixa. Ela é referência de direção artística, não é malha 3D, rig ou arquivo de jogo.

## Candidato técnico do primeiro preview

**Quaternius Ultimate Modular Men — Casual_2**, carregado como GLB remoto a partir do repositório público Ducz Character Creator.

- Origem dos modelos: Quaternius Ultimate Modular Men (11 personagens modulares, 24 animações, peças substituíveis; licença CC0 1.0).
- O repositório Ducz declara que os modelos/partes vêm dos pacotes Quaternius CC0, compartilham skeleton e animations e exportam GLB rigado.
- GLB de estudo: `public/models/Male/Casual_2.glb` (servido por CDN com commit SHA fixo).
- O código do Ducz Character Creator não é incorporado nem copiado para o CASABROOKLIN; usamos apenas o GLB de origem Quaternius como asset de estudo.
- Os materiais são recoloridos somente na página de preview para simular pele negra, cabelo escuro, camisa azul, calça cáqui e tênis marinho.

## Movimento no primeiro preview

Clips visíveis no pacote Ducz/Quaternius: Idle, Walk, Run, Run_Back, Run_Left, Run_Right, Roll, Wave, Interact, Sword_Slash e outros. O estudo oferece Idle, Walk, Run, Sprint Ninja (Run + inclinação de tronco), corrida lateral, Roll e Sword Slash.

O catálogo consultado não lista um clip Jump explícito. Saltos, aterrissagens e transições específicas serão avaliados numa segunda fonte de animações, depois de aprovarmos a base corporal.

## Limitações a validar

1. O estilo Quaternius é mais low-poly/gráfico do que a prancha de referência; verificar se chega perto do Playful 3D C ou se é angular demais.
2. O penteado original do GLB precisa ser comparado com o brief de cachos curtos e laterais baixas. Se não corresponder, trocar a peça da cabeça/cabelo ou modelar outra.
3. A roupa A é simulada no estudo por recoloração dos materiais da roupa Casual_2; não significa que o corte da camisa e da calça seja o definitivo.
4. A bolsa é geometria de estudo separada, com controles de posição e rotação. Ela ainda não é um asset final nem está integrada no runtime.
5. A alça é uma faixa de preview sobre a parte frontal; conferir orientação frontal e encaixe após a primeira inspeção.
6. Animação e material são carregados externamente no preview. O runtime principal não faz referência a este GLB.

## Critério de aprovação

Só seguir para construção final e posterior integração após aprovação explícita de:
- rosto/expressão/cabelo;
- proporções do corpo;
- corte e material da roupa;
- aparência e posição lateral da bolsa;
- corrida ninja e suas transições;
- desempenho em desktop e mobile.

## Preview

Página independente: `/carter-study.html`.

Ela não é importada por `index.html`, `src/main.js` ou qualquer módulo do runtime principal.
