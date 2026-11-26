# Interiores da Brooklyn House — pesquisa de assets e direção visual

Status: o Grande Salão recebeu uma etapa asset-first: sofá Poly Haven Sofa 03 CC0 em GLB local, fogo volumétrico MIT, conjuntos PBR CC0 locais para piso/paredes/madeira/mármore, colisões e inspeção por proximidade. A inspeção visual no navegador e a validação desktop/mobile ainda estão pendentes.

## Direção visual

Manter a direção **híbrida cinematográfica** já escolhida para o exterior: arquitetura principal sob medida, materiais PBR realistas, iluminação quente/fria controlada e objetos egípcios com presença visual. Evitar misturar vários packs low-poly diferentes na mesma sala.

## Referências do texto-fonte

### Grande Salão — canônico

- Pé-direito de quatro pavimentos, com vigas de cedro e pilares de pedra gravados com hieróglifos.
- Três níveis de sacadas voltadas para o salão.
- Instrumentos musicais e armas egípcias antigas expostos nas paredes.
- Lareira monumental, TV acima do manto e dois sofás grandes de couro.
- Tapete enorme com aparência de pele de serpente.
- Estátua de Thoth em mármore negro no centro.
- Terraço envidraçado que contorna a casa, com piscina, área de refeições e fogueira externa.

Referência textual: *The Red Pyramid*, capítulo da primeira visita dos Kane à mansão. A geometria atual já representa parte desse programa, mas ainda precisa de escala, silhueta e decoração para deixar de parecer um blockout.

### Biblioteca subterrânea — canônico

- A entrada fica no primeiro piso, mas a sala desce três pavimentos.
- Câmara circular com paredes, piso e teto em cúpula cobertos por imagens multicoloridas.
- Teto azul estrelado representa Nut; o piso verde e marrom representa Geb.
- As paredes são preenchidas por nichos/cavidades contendo cilindros e papiros, não por estantes convencionais.
- Quatro shabtis em pedestais, um em cada ponto cardeal.

Referência textual: *The Red Pyramid*, passagem da descida à biblioteca. A biblioteca atual tem estantes circulares genéricas; a próxima revisão visual deve substituir esse vocabulário por nichos, papiros, pintura mural, cúpula e shabtis.

### Quartos — canônico

- Quarto de Carter com cama king-size, cabeceira egípcia de marfim com leões e hieróglifos, tecnologia moderna, banheiro e deck com vista para a água.
- A decoração deve mesclar conforto contemporâneo com objetos egípcios funcionais.

Referência textual: *The Red Pyramid*, descrição do quarto de Carter.

### Elementos a tratar como interpretação

A divisão exata dos pavimentos, dimensões de cada quarto, posição de enfermaria, salas de apoio e o acabamento de corredores não são completamente determinados pelas descrições consultadas. Marcar esses trechos como reconstrução interpretativa, sem apresentá-los como fatos textuais.

## Opções de assets de licença aberta

| Fonte | Conteúdo e formato | Licença | Melhor uso aqui |
|---|---|---|---|
| [Poly Haven — Models](https://polyhaven.com/models) | Biblioteca com centenas de modelos; a categoria Furniture inclui camas, assentos, mesas e armazenamento. | CC0 | Móveis e decoração de acabamento mais realista. |
| [Poly Haven — Furniture](https://polyhaven.com/models/furniture) | Modelos individuais de mobiliário, em diferentes materiais e condições. | CC0 | Sofás, cadeiras, mesas, estantes e peças de destaque. |
| [ambientCG](https://ambientcg.com/list) | Materiais PBR, superfícies, texturas e HDRIs; mapas de cor, normal e rugosidade conforme o asset. | CC0 | Cedro, calcário, madeira escura, reboco, tecido e pedra. |
| [Quaternius — Fantasy Props MegaKit](https://quaternius.com/packs/fantasypropsmegakit.html) | Mais de 200 props de fantasia; glTF, FBX, OBJ e Blend; poucos texture sets compartilhados. | CC0 | Papiros, baús, ferramentas, objetos ritualísticos e itens pequenos. A linguagem é low-poly/hand-painted: usar de forma seletiva. |
| [KayKit — Furniture Bits](https://kaylousberg.itch.io/furniture-bits) | 50+ móveis low-poly; GLTF, FBX e OBJ; atlas de textura único e leve. | CC0 | Alternativa rápida e leve para mobiliário secundário ou protótipo mobile. |
| [Kenney — Furniture Kit](https://kenney.nl/assets/furniture-kit) | Pack de mobiliário com cerca de 140 arquivos/peças. | CC0 | Blockout e mobiliário de preenchimento; avaliar a linguagem visual de cada peça antes de usar na versão final. |

### Recomendação de combinação

**Base recomendada:** Poly Haven para móveis e objetos de destaque + ambientCG para materiais PBR.

**Complemento seletivo:** Quaternius para pequenos props mágicos/egípcios que não encontremos em acabamento realista. KayKit e Kenney ficam como alternativas de prototipagem; não misturar os dois estilos no mesmo ambiente final sem tratamento visual.

Antes de importar: conferir licença na página do asset específico, escala, pivô, quantidade de materiais, peso do GLB e textura. Preferir GLB/glTF; quando o pack não fornecer esse formato, converter e otimizar antes de incluir em `assets/`. Para celular, começar com texturas de 1K/2K e reduzir polígonos/LOD quando necessário.

## Visual “shader” para Three.js

Os shaderpacks de Minecraft não são plug-ins universais: foram feitos para o pipeline do Minecraft e não podem ser simplesmente copiados para o CASABROOKLIN. O equivalente aqui é um pipeline de pós-processamento do Three.js e materiais/iluminação PBR.

### Pilha proposta

1. **Ambient occlusion (SSAO):** reforçar contato entre móveis, piso, paredes e colunas; perfil leve para mobile.
2. **Bloom sutil:** destacar fogo, luzes, magia, hieróglifos e partículas — sem lavar a imagem.
3. **Color grading:** contraste e temperatura cinematográfica, com interiores quentes e sombras ligeiramente frias.
4. **Iluminação e reflexos PBR:** HDRI de ambiente e materiais de madeira, pedra, metal e tecido com mapas corretos.
5. **Sombras de contato e névoa local:** reforçar profundidade onde não custar muitos passes extras.

O Three.js oferece `EffectComposer`, `SSAOPass`, `GTAOPass` e `UnrealBloomPass` nos addons oficiais. GTAO tem qualidade maior que SSAO, mas custa mais; portanto, não deve ser o perfil padrão no celular.

### Perfis de renderização

- **Desktop:** SSAO/GTAO conforme GPU, bloom discreto, sombras de maior resolução e grading completo.
- **Mobile paisagem:** SSAO reduzido ou baked AO, bloom em resolução menor, sombras e pixel ratio limitados; desativar GTAO e passes caros se houver queda de FPS.

A cena já usa ACES tone mapping e sombras suaves. O próximo passo de lookdev é adicionar um composer e testar os passes um de cada vez, medindo desktop e mobile separadamente.

## Ordem de produção sugerida

1. Corrigir a navegação vertical: a escada em caracol precisa transportar o personagem até o patamar e a porta mágica. Até lá, usar o teleporte **Grande Salão** no menu.
2. Grande Salão: completar silhuetas e decoração canônicas, com assets reais de escala consistente.
3. Biblioteca: substituir estantes circulares genéricas por nichos de papiros, murais Nut/Geb, shabtis e iluminação de câmara subterrânea.
4. Terraço: piscina, mesa e área externa de fogo.
5. Quartos e demais pavimentos, marcando detalhes interpretativos.

## Referências técnicas e licenças

- Three.js Post Processing: https://threejs.org/manual/pages/post-processing.html
- Three.js GTAOPass: https://threejs.org/docs/pages/GTAOPass.html
- Three.js UnrealBloomPass: https://threejs.org/docs/pages/UnrealBloomPass
- Poly Haven License: https://polyhaven.com/license
- ambientCG License: https://docs.ambientcg.com/license
- Kenney Furniture Kit: https://kenney.nl/assets/furniture-kit
- KayKit Furniture Bits: https://kaylousberg.itch.io/furniture-bits
- Quaternius Fantasy Props MegaKit: https://quaternius.com/packs/fantasypropsmegakit.html


## Primeira etapa visual integrada — 26/11/2026

- Grande Salão: lustre cerimonial de bronze em três níveis, arandelas quentes, estandartes egípcios, placas de madeira entalhada e sofá com estrutura, assentos, almofadas e filetes de bronze.
- Biblioteca: as estantes genéricas foram ocultadas e substituídas por nichos circulares de papiros em três faixas; foi adicionada uma cúpula celeste estrelada (Nut), cartografia de piso em tons de verde e terra (Geb), quatro shabtis em pedestais e objetos de leitura.
- Lookdev: EffectComposer com SSAO no desktop e bloom controlado; o mobile usa bloom em resolução menor e dispensa SSAO na primeira configuração.
- O código procedural das peças arquitetónicas é original do projeto. Poly Haven Sofa 03 CC0 já está importado como GLB local; Arm Chair 01 permanece apenas como candidato e não foi inserido.


## Correções de leitura visual — 26/11/2026

- Parede cilíndrica da biblioteca: material `DoubleSide` para renderizar também a face interna.
- Grande Salão: a lareira passou de cones poligonais para shader de fogo volumétrico baseado em ruído e textura de perfil, com lenha, brasas, faíscas ascendentes e duas luzes pontuais.
- Sofás: Poly Haven Sofa 03 (CC0) integrado a partir de GLB local otimizado, escala 0,84; modelo com 8.004 triângulos, dois materiais e mapas PBR embutidos.
- Materiais PBR: Walnut Veneer 02 (Poly Haven), Beige Wall 001 (Poly Haven), Tiles139 e Marble012 (ambientCG), com mapas color/normal/roughness locais.
- Estátua de Thoth: mantém malha original figurativa e brilho; adicionados mapas de normal/roughness reais sobre albedo de basalto escuro.
- Tapete: novo padrão de escamas de serpente com bump procedimental; mesa circular redimensionada para escala de mesa baixa e materiais de nogueira/bronze.
- Instrumentos e armas: as harpas quadradas e lanças cônicas antigas foram removidas; foram criadas harpas arqueadas com cordas individuais, tambores com pele/amarras e lanças de ponta foliácea em bronze. As peças usam nogueira/bronze PBR e descrições próprias.
- TV: a caixa antiga foi substituída por moldura metálica de cantos arredondados e painel escuro de vidro refletivo.
- Interação: tecla E no desktop e botão INTERAGIR no mobile mostram descrição contextual para sofá, mesa, estátua, lareira, harpas, tambores, lanças, khopeshes e TV; colliders foram adicionados aos objetos sólidos.
- Exposição e luz ambiente elevadas moderadamente; SSAO reduzido para evitar escurecimento excessivo.
- Validação visual final ainda pendente de navegador.


## Finalização do Grande Salão — nova camada escultórica

A nova etapa está implementada em `src/grand-salon.js`, chamada depois da construção-base de `world.js` e da decoração compartilhada de `interior-details.js`. O mesmo módulo é executado no desktop e no mobile.

- **Calcário:** textura 2D procedural em blocos com variação de tom, juntas, veios discretos e bump map. Aplicada às paredes internas, sacadas, piso e shafts das colunas.
- **Madeira:** mapa de veios e bump para peças novas de mobiliário e acabamentos.
- **Colunas:** shafts com caneluras verticais, anéis metálicos, capitéis em forma de lótus e pétalas.
- **Galerias:** substituição visual dos guarda-corpos retos por balaústres torneados, corrimãos de madeira com filete de latão e postes de extremidade.
- **Escadarias:** dois conjuntos laterais em zigue-zague, cada um com três lances alternados e 14 degraus por lance, alcançando as três galerias. Incluem filetes de bronze, corrimãos, balaústres torneados e patamares.
- **Thoth:** nova escultura original em basalto, com túnica de pregas, cabeça de íbis, bico, olhos, braços, papiro, cetro e coroa lunar. A escultura histórica CC0 do Minneapolis Institute of Art foi utilizada apenas como referência visual; o modelo não foi importado.
- **Lareira:** remoção dos antigos cones isolados; novas malhas orgânicas em gradiente de cor, múltiplas línguas, lenha, cama de brasas, partículas e luz pontual animada.
- **Mobiliário:** sofás de volumes arredondados com almofadas e costuras, tapete oval com motivo solar, mesa circular de centro e detalhes de bronze.
- **Teto e paredes:** medalhão de cedro, roseta, relevos solares alados e pilastras esculpidas próximas à lareira.

### Critérios de validação pendentes

- Sintaxe e referências estáticas verificadas; ainda falta inspeção visual em navegador.
- O controlador de terceira pessoa recebe as rampas e os três níveis de galeria: acompanha a altura durante cada lance, preserva o nível no patamar e aplica queda ao sair da plataforma. Testar as transições e conferir se não há deslizamento ou mudança abrupta.
- Avaliar o fogo e a estátua de diferentes ângulos, incluindo vista de dentro do salão.
- Testar textura, sombras, clipping e desempenho em desktop e celular paisagem.
- Não marcar como finalizado visualmente até esses testes ocorrerem.


## Padrão asset-first — obrigatório a partir desta etapa

A partir de agora, cada sala é construída segundo [docs/ASSET-FIRST-ROOM-BUILDING.md](ASSET-FIRST-ROOM-BUILDING.md). A pesquisa precisa cobrir objeto/forma, material PBR, luz, escala humana, interação/colisão, licença e orçamento mobile. Não basta haver um GLB: o asset tem de combinar com a direção de arte e com o texto-fonte.

### Grande Salão — fontes e decisões atuais

- Sofa 03: Poly Haven CC0, autor Fran Calvente, dimensões 2,731 × 0,925 × 1,118 m, 8.004 triângulos, dois materiais PBR. O GLB local é carregado por GLTFLoader e MeshoptDecoder e reduzido para 0,84. A malha de reserva só permanece visível se o GLB falhar.
- Fogo: Housz/ThreeVolumetricFire, MIT, adaptado para GLSL3/WebGL2 e preservado com aviso de licença. O fogo é view-aligned e recebe os mapas de ruído e perfil do exemplo original.
- Texturas: os mapas PBR estão locais no projeto, evitando dependência de download remoto durante a exploração. A base de pedra ainda mantém a variação de blocos própria; normal e roughness CC0 dão relevo fino.
- Estatua: a escultura atual é geometria original; a referência CC0 do Minneapolis Institute of Art orienta a leitura de Thoth, mas não foi importada como substituição direta.
- Mesa: geometria original sob medida, com madeira de nogueira e bronze. Não se selecionou o Round Coffee Table 01 como objeto final por incompatibilidade estética com a linguagem egípcia do salão.
- Tapete: padrão de escamas foi construído sob medida, pois o livro pede leitura específica de pele de serpente; não foi usado um carpet asset genérico.

### QA pendente

- Verificar no browser a aparência do volume de fogo, incluindo cortes/slicing com a câmera em ângulos diferentes.
- Confirmar que o GLB Sofa 03 carrega e mantém texturas no GitHub Pages sem erro de MeshoptDecoder/WebP.
- Comparar o assento do sofá com a altura do Carter, e validar o collider para não bloquear passagem útil.
- Verificar a estatua com iluminação em movimento e o efeito de normal/roughness; o reflexo visual deve continuar presente.
- Conferir a leitura do tapete como pele de serpente em vista de jogo, não apenas visto de cima.
- Verificar interação E/INTERAGIR para todos os elementos hero e o comportamento das colisões nos dois perfis.
- Confirmar que os instrumentos originais têm proporção e silhueta convincentes em escala humana; caso sejam aprovados, registar as suas fichas como assets locais originais no manifesto.
