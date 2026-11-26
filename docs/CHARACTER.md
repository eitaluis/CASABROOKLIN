# Carter Kane — modelo e movimento

Status: **primeira versão local integrada no runtime e preview independente publicada.** O modelo substitui o carregamento Ara remoto; não depende de CDN de personagem.

## Direção visual aprovada
- C — Game 3D gráfico, totalmente 3D.
- Rosto humano natural e proporções juvenis; sem linguagem anime.
- Corpo lean/atlético, pele negra e cabelo crespo curto.
- Camiseta azul, calça cargo cáqui, tênis azul e bolsa transversal no quadril direito.

## Implementação
- Geometria procedural local em `src/character.js`, com materiais gráficos e cabelo instanciado.
- Rig articulado humanoide com nomes padronizados, incluindo `WeaponR`.
- O inventário continua anexando cajado e khopesh ao socket da mão direita.
- Movimento procedural de idle, walk, sprint, giro corporal, salto e aterrissagem.
- A corrida usa inclinação positiva do tronco (personagem voltado para -Z), braços ativos e passadas maiores; o controlador de movimento continua compartilhado entre desktop e mobile.
- A bolsa tem corpo de couro conhaque, aba, fivela, argolas e alça transversal; balanço secundário de pequena amplitude.

## Limite conhecido
A bolsa aprovada foi referenciada a partir do modelo CC0 Innerscene. O GLB binário original não pôde ser obtido pelo ambiente de edição; a primeira integração usa uma reconstrução procedural local com a mesma linguagem de couro, aba, fecho e dimensões aproximadas. O corpo é carregado no quadril direito e a alça cruza o peito. Não afirmar que é o GLB original.

Os objetos visuais são meshes separados parentados aos bones, não um único SkinnedMesh com skin weights. Essa solução é leve e apropriada para o primeiro protótipo, mas movimentos extremos podem revelar articulações; a próxima etapa técnica é avaliar skinning contínuo caso o preview mostre cortes visíveis.

## Validação
- Verificar sintaxe, imports, bones, socket WeaponR e referências nos módulos.
- Testar `character-preview.html` em Chrome desktop e celular paisagem.
- Testar no jogo: andar, correr, mudar direção, saltar, teletransportar e equipar ambas as armas.
- Ajustar proporções, encaixes e clipping com base no teste visual real.
