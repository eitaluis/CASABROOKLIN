# Carter Kane — proteção rápida com varinha

Data: 28/11/2026

## Base canônica

A página oficial de Rick Riordan sobre magia egípcia descreve a varinha como uma peça curva, normalmente feita de marfim de hipopótamo, usada como instrumento defensivo: repelir feitiços/inimigos, criar escudos mágicos, desenhar círculos de proteção e curar. Em *A Pirâmide Vermelha*, Zia explica a Carter que a varinha é geralmente usada para defesa, enquanto o cajado é mais associado ao ataque.

Fontes:
- https://rickriordan.com/extra/about-egyptian-magic/
- https://www.jkmedina.com/uploads/1/3/2/3/13236122/rick_riordan_-_kane_chronicles_1_-_the_red_pyramid.pdf

## Interpretação implementada

- Comando rápido: tecla Q no desktop e botão PROTEGER nos controles mobile.
- A varinha curta e curva, em tom de marfim, é criada proceduralmente e só fica visível durante a ativação.
- A pose usa o ciclo defensivo `fight_idle` do Ara, com a varinha acompanhando a mão direita do rig.
- Campo de força esférico translúcido azul-ciano, com fresnel nas bordas e fluxo animado; o efeito envolve Carter sem ocultar completamente o personagem.
- Duração inicial: 0,92 s. Custo: 18 pontos de energia. Pequeno intervalo entre ativações.
- O dano recebido durante a janela de proteção é bloqueado quando o atacante está no arco frontal; ataques pelas costas continuam causando dano.
- Cada bloqueio cria uma onda circular luminosa no campo.

## Separação entre cânone e adaptação

A forma curva e marfim da varinha, assim como sua função defensiva, vêm da descrição oficial. O campo esférico ao redor do corpo, a paleta azul-ciano, a animação, o custo, a duração e a regra de bloqueio frontal são decisões de gameplay/visual do projeto, não descrições literais do livro.

## Compatibilidade e limitações

O efeito é implementado em Three.js/WebGL diretamente, sem importar o projeto externo React Three Fiber. A referência de shader consultada foi https://github.com/cortiz2894/flow-shield-effect. O shader foi reescrito de forma enxuta para o renderizador atual e para o perfil de desempenho mobile.

## QA pendente

A integração de código foi feita para desktop e mobile usando a mesma lógica. Ainda é necessária inspeção visual real nos dois dispositivos para ajustar a orientação exata da varinha na mão, a pose defensiva do Ara e o equilíbrio entre transparência/visibilidade do campo. O bloqueio foi conectado ao callback atual de dano; projéteis de duelo ainda precisarão chamar a mesma interface de bloqueio quando forem implementados.
