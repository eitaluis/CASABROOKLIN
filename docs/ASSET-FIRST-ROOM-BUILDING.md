# CASABROOKLIN — padrão asset-first para construção de espaços

Status: **padrão obrigatório para todo novo espaço, ambiente, interior ou área externa.**

## Princípio

Todo espaço começa pela compreensão do lugar descrito no livro e por uma pesquisa de assets de código aberto. Não começar enchendo o ambiente com caixas, cilindros ou materiais de cor lisa. Geometria procedural continua permitida para arquitetura exclusiva, encaixes, relevos e peças que não tenham asset adequado, mas precisa usar referências de materiais e acabamento de qualidade e passar por revisão de proporção.

**Cada peça visível do ambiente precisa de uma ficha de produção**, sem exceção para os detalhes pequenos. Isso inclui arquitetura, mobiliário, esculturas, ferragens, adornos, instrumentos, armas, luzes, partículas, superfícies, texturas, portas, janelas, vegetação e qualquer elemento interativo. Um conjunto pode agrupar peças repetidas (por exemplo, os balaústres de uma galeria), mas a ficha deve identificar todos os componentes e onde são usados. Cada ficha cobre cinco frentes:

1. **Objeto/forma:** GLB/glTF/FBX/Blend ou geometria original sob medida; silhueta, proporções, pivô, escala e fidelidade à referência textual.
2. **Material/visual:** albedo/base color, normal, roughness, metallic, AO e UVs sempre que disponíveis. Anotar resolução e escala física de repetição.
3. **Luz/reflexo:** interação com iluminação da sala, emissive quando necessário, sombras, transparência, bloom/reflexos e legibilidade no ambiente.
4. **Interação com personagem:** collider, superfície caminhável, proximidade, inspeção, uso, assento, acionamento, animação ou perigo conforme o objeto.
5. **Desempenho/licença:** licença e autor confirmados, tamanho e triângulos, compressão/LOD, custo de textura e perfil desktop/mobile.

## Fluxo obrigatório

### Fase 01 — leitura e intenção
- [ ] Ler as passagens do livro relacionadas ao cômodo, não apenas uma frase isolada.
- [ ] Criar lista de elementos canônicos, referências históricas e detalhes interpretativos.
- [ ] Definir uso do espaço: circulação, permanência, contemplação, exposição, combate, leitura, descanso etc.
- [ ] Identificar o que o Carter precisa alcançar, tocar, atravessar, inspecionar ou usar.
- [ ] Marcar o que é obrigatório para comunicar o espaço e o que é preenchimento opcional.

### Fase 02 — pesquisa de assets
- [ ] Pesquisar primeiro GitHub e repositórios open-source, incluindo GLB/glTF, texturas PBR, shaders, rigs, controllers, colisões e interações.
- [ ] Consultar também as páginas originais do autor/provedor para verificar conteúdo e licença. O facto de um ficheiro aparecer num repositório de terceiros não prova, por si só, a licença.
- [ ] Verificar preview do modelo, dimensões reais, orientação frontal, origem/pivô, UVs, materiais, texturas e triângulos.
- [ ] Preferir assets CC0/MIT ou outra licença explicitamente compatível. Preservar aviso e créditos exigidos.
- [ ] Não selecionar um asset só por ser gratuito: rejeitar linguagem low-poly/blocada que entre em conflito com a direção visual do projeto.
- [ ] Quando não houver asset adequado, registar a lacuna e criar uma peça original de qualidade superior, baseada em referências visuais e materiais abertos.
- [ ] Preparar uma ficha por objeto antes de integrar. Para objetos hero, criar preview isolado e comparar alternativas.
- [ ] Se um asset adequado não existir, registrar a pesquisa, as alternativas rejeitadas e a razão para criar geometria própria. A criação própria também precisa de referência de forma e material; nunca virar um bloco/cilindro placeholder apresentado como versão final.

### Fase 03 — composição e adaptação
- [ ] Fazer greybox apenas para testar escala e circulação; não a tratar como acabamento.
- [ ] Ajustar o asset ao ambiente: escala, orientação, pivô, materiais, textura, patina, ornamentos e contexto.
- [ ] Manter o mesmo sistema de coordenadas, personagem e geometria no desktop e mobile.
- [ ] Usar LOD/compressão e reduzir resolução no mobile apenas quando necessário; não remover detalhe visual gratuitamente.
- [ ] Criar collider coerente com a silhueta e o uso do objeto.
- [ ] Adicionar interação quando houver valor de jogo: inspeção, sentar, usar, abrir, subir, ler, recolher, acionar ou evitar.

### Fase 04 — validação
- [ ] Comparar com a referência textual e visual, frontal e em ângulos de jogo.
- [ ] Testar distância do personagem aos móveis e altura de assento/mesa.
- [ ] Testar colisão, passagem, escadas, interações e clipping.
- [ ] Testar em navegador real no desktop e em celular paisagem.
- [ ] Medir FPS, carregamento, memória, temperatura e estabilidade do mobile.
- [ ] Separar status **implementado**, **testado** e **aprovado visualmente**. Não declarar o espaço concluído enquanto a inspeção real estiver pendente.

## Matriz de assets — Grande Salão

O programa textual do Grande Salão em *A Pirâmide Vermelha* inclui pé-direito de quatro alturas, três níveis de galerias, colunas/vigas de cedro e pedra, instrumentos e armas egípcias expostos, lareira monumental com TV acima, dois grandes sofás de couro, tapete de pele de serpente de aproximadamente 12,2 × 4,6 m e estátua de Thoth em mármore negro (cerca de 9,1 m), com corpo humano, cabeça de íbis, kilt, faixa, colar, estilete e papiro aberto com o sinal Per Ankh. As portas duplas com o Olho de Hórus, correntes e cadeados e as paredes envidraçadas voltadas para o terraço também fazem parte da composição descrita. O terraço envidraçado, piscina, refeições e fogueira exterior são tratados como uma zona contígua.

| Elemento | Asset/estudo escolhido | Material e visual | Interação prevista | Estado |
|---|---|---|---|---|
| Fogo | [Housz/ThreeVolumetricFire](https://github.com/Housz/ThreeVolumetricFire), MIT; classe local adaptada a GLSL3/WebGL2 e texturas de perfil/ruído | Volume 3D view-aligned; amostragem aumentada (0,024 desktop / 0,052 mobile; 66 segmentos desktop / 34 mobile), lenha, cama de brasas, faíscas e luz dinâmica | Inspeção por proximidade; luz afeta a leitura do espaço | Shader integrado e densidade aumentada; suavidade visual ainda precisa de QA em vários ângulos |
| Sofás (2) | [Poly Haven Sofa 03](https://polyhaven.com/a/sofa_03), Fran Calvente, CC0; GLB local; 2,731 × 0,925 × 1,118 m, 8.004 triângulos | Dois materiais e mapas PBR incorporados; escala 0,72 (largura aproximada 1,97 m); posicionamento corrigido pela caixa real da malha; fallback procedural proporcional permanece visível em caso de erro | Colliders e inspeção por proximidade; sentar/levantar é interação futura | GLB integrado com fallback validado; QA visual de escala/orientação pendente |
| Thoth | Escultura original sob medida; referência visual CC0 ao [Thoth do Minneapolis Institute of Art](https://sketchfab.com/3d-models/thoth-c-644-bce-30-ce-394a94722862460e8cefab54b4bed7bf) | Mármore negro com albedo próprio e mapas normal/roughness; corpo humano separado, pernas, kilt shendyt com pregas, faixa diagonal, colar largo, cabeça/bico de íbis, papiro aberto Per Ankh e estilete; altura composta de cerca de 9,1 m | Collider e inspeção contextual; escultura permanece bloqueada como elemento monumental | Geometria original atualizada para corresponder à descrição textual; escaneado não importado porque não contém o mesmo arranjo de atributos |
| Mesa baixa | Geometria original inspirada em [Round Coffee Table 01](https://polyhaven.com/a/coffee_table_round_01) e [Round Wooden Table 01](https://polyhaven.com/a/round_wooden_table_01) | Walnut PBR CC0, tampo de cerca de 1,5 m, bronze e medalhão solar | Collider e inspeção | Geometria redimensionada; validação visual pendente |
| Tapete | Superfície procedural original, conforme a descrição de pele de serpente | Escamas sobrepostas jade/terra/carvão, albedo + bump e borda de couro/bronze | Caminhável; não deve bloquear Carter | Implementado; conferir escala e leitura |
| Piso de calcário | [ambientCG Tiles139](https://ambientcg.com/a/Tiles139), CC0 | Color, normal e roughness maps locais | Superfície caminhável | PBR integrado |
| Paredes/colunas | Geometria arquitetónica sob medida; [Poly Haven Beige Wall 001](https://polyhaven.com/a/beige_wall_001), CC0 | Calcário com normal/roughness reais, caneluras, capitéis de lótus, veios e juntas | Colliders; galerias e escadas caminháveis | PBR integrado; detalhamento e QA pendentes |
| Madeira | [Poly Haven Walnut Veneer 02](https://polyhaven.com/a/walnut_veneer_02), CC0 | Color, normal e roughness locais | Usado nos móveis e acabamentos | PBR integrado |
| Mármore | [ambientCG Marble012](https://ambientcg.com/a/Marble012), CC0 | Normal/roughness sobre o albedo negro da estátua | Integrado na estátua | PBR integrado |
| Lustre/arandelas | Geometria original sob medida | Bronze, vidro âmbar, emissive e luz quente | Acionamento de luz futuro | Primeira camada existente; refino pendente |
| Galerias/escadas/portas dos quartos | Arquitetura sob medida, escadarias em zigue-zague e 18 portas de madeira repetidas nos três níveis; pedra/beige wall, walnut veneer e bronze PBR | Calcário com normal/roughness, caneluras, capitéis de lótus, juntas, portas entalhadas e ferragens em bronze | Altura progressiva, colliders de degraus/patamares e inspeção por proximidade das portas | Implementado; conferir subida e escala visual |
| Instrumentos/armas | Harpas arqueadas, tambores de pele, flautas, lanças e khopeshes construídos sob medida; nenhum pack high-detail com licença/estilo compatíveis foi selecionado. SVGs de identificação vêm de [game-icons/icons](https://github.com/game-icons/icons), CC BY 3.0, com autores Delapouite e Lorc | Walnut PBR CC0, bronze, pele e cordas; geometrias curvas de alta segmentação; placas SVG douradas com créditos em assets/decor/README.md | Colliders em harpas/tambores/flautas e inspeção por proximidade para instrumentos e armas | Geometria própria + vetores CC BY como identificação; validação visual/interativa pendente |
| Lareira/manto | Fogo Housz MIT; moldura de calcário esculpida sob medida com arco, pilastras, capitéis e manto arredondado; TV própria | PBR de pedra, bronze e madeira; shader volumétrico com amostragem aumentada, lenha e brasas | Collider e inspeção do conjunto; interação de acendimento é futura | Moldura e fogo refinados em código; QA visual pendente |
| TV de plasma | Moldura plana original sob medida, vidro físico refletivo e tela emissiva com estado ligado/desligado; Poly Haven Television 01/02 foram avaliadas, mas são CRT e não correspondem ao texto | Metal escuro, clearcoat, vidro e emissive azul discreto | Interação de alternar energia por E/INTERAGIR | Integrada; validar no browser |
| Portas duplas especiais | Geometria original em folhas de madeira, moldura de pedra; Eye of Horus, correntes e seis cadeados com SVGs Game-icons CC BY 3.0 | Nogueira PBR, ferragens de metal escuro/bronze | Collider bloqueia passagem; inspeção contextual informa que a porta permanece trancada | Implementada como porta trancada; ação de destrancar é futura |
| Paredes envidraçadas | Painéis e bandeira de vidro físicos com montantes/travessas de bronze | MeshPhysicalMaterial, transmissão e acabamento de bronze | Colliders evitam atravessar os painéis | Implementadas na parede posterior; validar vista para o terraço e transparência no browser |
| Estandartes/relevos | Textura e geometria local; Game-icons SVG para harp/drum/flute/spears/eye/chains/locks | Tecido dupla-face, cedro/bronze, relevos solares e placas de identificação | Inspeção contextual integrada nos objetos associados | Implementado; atribuição individual em assets/decor/README.md; QA visual pendente |

### Critérios de escala
- Sofá Poly Haven: largura física nativa de 2,731 m, importado com escala 0,72 (dimensão final aproximada de 1,97 m no eixo longo). Confirmar em perspectiva de jogo com a altura de Carter (~1,78 m).
- Mesa baixa: por volta de 1,45–1,55 m de diâmetro e 0,5–0,55 m de altura.
- Assento de sofá: alvo de 0,40–0,48 m acima do piso. Não criar animação de sentar sem clip ou controller confiável.
- Tapete: dimensão canônica aproximada de 12,2 × 4,6 m; a superfície procedural de pele serpentina deve ser legível em vista oblíqua e não pode bloquear a navegação.
- Estátua: aproximadamente 9,1 m até à coroa; o kilt, a faixa, o papiro aberto e o estilete precisam ser legíveis, não escondidos em vista de terceira pessoa.

## Regra de crédito

Cada asset externo e cada conjunto de texturas precisa de registo individual em assets/manifest.json, incluindo fonte, licença, autor quando exigido, localização local e função. Nunca creditar geometria original ao fornecedor de textura nem afirmar que um modelo foi importado quando foi usado apenas como referência.
