# Interiores da Brooklyn House — pesquisa de assets e direção visual

Status: reestruturação do Grande Salão em átrio central implementada: escadarias principais simétricas, passarela elevada de travessia, lances superiores em faixas distintas, assentos circulares junto ao pedestal e passagens inferiores interpretativas. A inspeção visual no navegador e a validação desktop/mobile ainda estão pendentes.

## Direção visual

Manter a direção **híbrida cinematográfica** já escolhida para o exterior: arquitetura principal sob medida, materiais PBR realistas, iluminação quente/fria controlada e objetos egípcios com presença visual. Evitar misturar vários packs low-poly diferentes na mesma sala.

## Referências do texto-fonte

### Grande Salão — canônico

- Pé-direito de quatro pavimentos, com vigas de cedro e pilares de pedra gravados com hieróglifos.
- Três níveis de balcões circundam o salão, com fileiras de portas que se abrem para a área principal.
- Instrumentos musicais e armas egípcias antigas expostos nas paredes.
- Lareira monumental, TV acima do manto e dois sofás grandes de couro.
- Tapete enorme com aparência de pele de serpente.
- Estátua de Thoth em mármore negro, com cerca de 9,1 m, no centro: corpo humano, cabeça e pescoço longos de íbis, kilt, faixa, colar, estilete de escriba e pergaminho/papiro aberto com o sinal Per Ankh.
- Paredes de vidro voltadas para um terraço que contorna a casa, com piscina, área de refeições e fogueira externa.
- No extremo oposto, portas duplas com o Olho de Hórus, correntes e meia dúzia de cadeados.

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

### Reconstrução espacial interpretativa

A prancha da graphic novel mostra a estátua como foco de um grande espaço comum, com assentos em torno de sua base e escadarias que alcançam galerias elevadas. O texto confirma três níveis de balcões que circundam o salão, fileiras de portas voltadas para o espaço principal, a estátua de Thoth e mobiliário de grande escala; não fornece planta cotada nem fixa o desenho exato das escadas, passarelas ou corredores. A solução atual usa duas escadarias centrais simétricas até a primeira galeria, uma passarela que conecta as alas, acessos escalonados aos dois níveis superiores e duas passagens no piso inferior. Esses detalhes de circulação e a forma dos assentos são interpretação de projeto, não fatos canônicos.

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
- O código procedural das peças arquitetónicas é original do projeto. Poly Haven Sofa 03 CC0 está importado como GLB local. Arm Chair 01 permanece apenas como candidato e não foi inserido.


## Correções de leitura visual — 26/11/2026

- Parede cilíndrica da biblioteca: material `DoubleSide` para renderizar também a face interna.
- Grande Salão: a lareira passou de cones poligonais para shader de fogo volumétrico baseado em ruído e textura de perfil, com lenha, brasas, faíscas ascendentes e duas luzes pontuais.
- Sofás: Poly Haven Sofa 03 (CC0) integrado a partir de GLB local otimizado, escala 0,72; modelo com 8.004 triângulos, dois materiais e mapas PBR embutidos.
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
- **Thoth:** escultura original em mármore negro com pernas e tronco humanos, kilt shendyt pregueado, faixa diagonal, colar largo, cabeça e bico de íbis, papiro aberto com emblema Per Ankh e estilete. A escultura histórica CC0 do Minneapolis Institute of Art foi utilizada apenas como referência visual; o modelo não foi importado.
- **Lareira:** o fogo atual usa o volume shader Housz/ThreeVolumetricFire (MIT), com ruído/profilagem, view alignment, lenha, cama de brasas, faíscas e luz dinâmica. A densidade das fatias foi aumentada para reduzir a leitura facetada. A moldura foi substituída por arco de calcário esculpido, pilastras, capitéis, detalhes de bronze e manto arredondado.
- **Mobiliário:** dois GLBs Poly Haven Sofa 03 CC0 (escala 0,72) em cada lado da lareira, mesa circular baixa, e tapete de pele serpentina com dimensões canônicas aproximadas de 12,2 × 4,6 m.
- **Teto e paredes:** medalhão de cedro, roseta, relevos solares alados, placas SVG CC BY 3.0 com harp/drum/flute/spears, porta dupla com Olho de Hórus, correntes e seis cadeados; parede panorâmica com vidro transmissivo e moldura de bronze.

### Critérios de validação pendentes

- Sintaxe e referências estáticas verificadas; ainda falta inspeção visual em navegador.
- O controlador de terceira pessoa recebe as rampas e os três níveis de galeria: acompanha a altura durante cada lance, preserva o nível no patamar e aplica queda ao sair da plataforma. Testar as transições e conferir se não há deslizamento ou mudança abrupta.
- Avaliar o fogo, a estátua, a moldura de lareira, a porta e o vidro de diferentes ângulos, incluindo vista de dentro do salão.
- Testar textura, sombras, clipping e desempenho em desktop e celular paisagem.
- Não marcar como finalizado visualmente até esses testes ocorrerem.


## Padrão asset-first — obrigatório a partir desta etapa

A partir de agora, cada sala é construída segundo [docs/ASSET-FIRST-ROOM-BUILDING.md](ASSET-FIRST-ROOM-BUILDING.md). A pesquisa precisa cobrir objeto/forma, material PBR, luz, escala humana, interação/colisão, licença e orçamento mobile. Não basta haver um GLB: o asset tem de combinar com a direção de arte e com o texto-fonte.

### Grande Salão — fontes e decisões atuais

- Sofa 03: Poly Haven CC0, autor Fran Calvente, dimensões 2,731 × 0,925 × 1,118 m, 8.004 triângulos, dois materiais PBR. O GLB local é carregado por GLTFLoader e MeshoptDecoder e reduzido para 0,72. O código alinha o pivot e a base pela bounding box; o sofá de reserva proporcional permanece visível se o GLB falhar.
- Fogo: Housz/ThreeVolumetricFire, MIT, adaptado para GLSL3/WebGL2 e preservado com aviso de licença. O fogo é view-aligned e recebe os mapas de ruído e perfil do exemplo original.
- Texturas: os mapas PBR estão locais no projeto, evitando dependência de download remoto durante a exploração. A base de pedra ainda mantém a variação de blocos própria; normal e roughness CC0 dão relevo fino.
- Estatua: a escultura atual é geometria original; a referência CC0 do Minneapolis Institute of Art orienta a leitura de Thoth, mas não foi importada como substituição direta.
- Mesa: geometria original sob medida, com madeira de nogueira e bronze. Não se selecionou o Round Coffee Table 01 como objeto final por incompatibilidade estética com a linguagem egípcia do salão.
- Tapete: padrão de escamas foi construído sob medida, pois o livro pede leitura específica de pele de serpente; não foi usado um carpet asset genérico.

### QA pendente

- Verificar no browser a aparência do volume de fogo, incluindo cortes/slicing com a câmera em ângulos diferentes.
- Confirmar que os dois GLBs Sofa 03 carregam e mantêm texturas no GitHub Pages sem erro de MeshoptDecoder/WebP; verificar a nova escala 0,72 com a altura do Carter.
- Comparar o assento do sofá com a altura do Carter, e validar o collider para não bloquear passagem útil.
- Verificar a estatua com iluminação em movimento e o efeito de normal/roughness; o reflexo visual deve continuar presente.
- Conferir a leitura do tapete como pele de serpente em vista de jogo, não apenas visto de cima.
- Verificar interação E/INTERAGIR para todos os elementos hero, incluindo o toggle ligado/desligado da TV, e o comportamento das colisões nos dois perfis.
- Confirmar harpas, tambores, flautas, lanças e khopeshes em escala humana; os modelos de geometria são locais originais e os SVGs auxiliares têm atribuição CC BY 3.0 no manifesto e em assets/decor/README.md. Verificar inspeção e colisões.


## Informação arquitetónica adicional do texto-fonte

O Grande Salão tem três níveis de galerias circundantes com fileiras de portas que dão para a área principal. A implementação acrescentou três portas por lado em cada nível como interpretação de layout; a quantidade exata, desenho das portas e localização das escadas não são especificados no trecho do livro. As escadas em zigue-zague existem para permitir a navegação em terceira pessoa pelos balcões, não como alegação de que o texto descreva aquele desenho particular.


### Televisão — decisão asset-first

Foram avaliadas as páginas oficiais [Poly Haven Television 01](https://polyhaven.com/a/Television_01) e [Television 02](https://polyhaven.com/a/television_02), ambas CC0. Os dois modelos são televisores CRT antigos. Como o livro especifica uma televisão de plasma sobre o manto, os dois foram rejeitados por incompatibilidade histórica/visual. Mantivemos uma geometria original de tela plana, com vidro físico refletivo e estado emissivo que alterna por interação.


## Referência visual publicada — Grande Salão

A graphic novel de *The Red Pyramid* é ilustrada por Orpheus Collar (Disney-Hyperion, 2012). Usar as pranchas como referência de composição, escala e linguagem de desenho; não extrair texturas/arte final diretamente para o jogo sem uma licença adequada. A versão do jogo deve reconstruir os volumes com malhas e materiais próprios. Referências institucionais: [Disney Books — The Red Pyramid: The Graphic Novel](https://books.disney.com/book/red-pyramid-the-graphic-novel/) e [portfólio de Orpheus Collar](https://orpheusartist.com/images/).

## Materiais pétreos — revisão 26/11/2026

- Paredes, pilares e molduras usam cor procedural em blocos de calcário, com normal/roughness CC0 do conjunto limestone local. O relevo deve permanecer discreto; a leitura vem de variação de roughness, pequenas imperfeições e sombras de contato, não de uma aparência de reboco pintado.
- O piso continua com o conjunto PBR tile-limestone local. Separar o comportamento dos materiais: piso mais uniforme e ligeiramente acetinado; blocos/pilares mais foscos e de escala maior.
- Referências de novos sets CC0 a avaliar antes de substituir os atuais: [ambientCG — Tiles 143](https://ambientcg.com/view?id=Tiles143), [ambientCG — Rock 051](https://ambientcg.com/view?id=Rock051) e [Poly Haven — Rock Wall 13](https://www.mixos.io/free-textures/stone/ph_rock_wall_13). Estes links são alternativas de pesquisa, não assets já importados para o repositório.

## Varanda panorâmica — reconstrução interpretativa

A descrição textual estabelece paredes envidraçadas e um terraço que contorna a casa, com piscina, jantar e fogueira. O acesso lateral de vidro e a abertura alinhada na fachada externa são decisões de level design para tornar essa área realmente caminhável. A disposição exata do terraço, sua planta e as salas atrás das portas das galerias não são fixadas pelo romance; mantê-las identificadas como interpretação. A revisão atual implementa um percurso perimetral caminhável, conectado às portas de vidro. Piscina, área de jantar e fogueira concentram-se no setor principal; a posição exata desses elementos e a planta das salas laterais continuam sendo reconstruções interpretativas.


## Sala de Treinamento — estudo e direção visual

Documento de produção: [TRAINING-ROOM-STUDY.md](TRAINING-ROOM-STUDY.md).

### Referência narrativa

A editora Disney descreve oficialmente a Brooklyn House como espaço de treinamento de jovens magos, e o *Brooklyn House Magician's Manual* como manual para iniciados, com quizzes, histórias e informação sobre divindades, criaturas e o Duat: https://books.disney.com/book/brooklyn-house-magicians-manual/

Para a configuração específica da sala (quadra de basquete, piso de madeira, abóbada pintada, estátuas divinas e cestas formadas pelos discos solares de Rá), foi consultada a descrição secundária do universo Kane Chronicles: https://riordan.fandom.com/wiki/Brooklyn_House. A mesma referência relaciona a aula *Magic Problem-Solving 101 / Whatever Works* a guerreiros shabti de barro. Na cena do romance, quatro pequenas estatuetas colocadas em pontos diferentes da quadra crescem até se tornarem guerreiros armados com espadas e escudos. Não foi encontrada nesta pesquisa uma imagem oficial inequívoca da sala; a imagem que aparecia identificada como Great Room foi descartada como referência para este cômodo.

### Programa visual da reconstrução

- Quadra com piso de madeira, 15 × 28 m de marcação, área de circulação e dois aros solares a 3,05 m.
- Abóbada curva com afresco original de temática egípcia, barca solar, discos, papiros e frisos.
- Pilastras, nervuras metálicas, acabamento de calcário/bronze e iluminação quente por arandelas.
- Bustos de divindades como interpretação artística; seleção atual: Anúbis, Sekhmet, Hórus, Ísis e Bastet.
- Efígies de Rá com cabeça de falcão e discos solares vazados como cestas.
- Bola de basquete com assistência de arco ao mirar numa cesta, alvos mágicos e placar; quatro pequenas estatuetas shabti que crescem para guerreiros de barro com espada e escudo.
- Os guerreiros viram-se para encarar Carter, mas ainda não têm IA de perseguição/ataque.

### Materiais e assets

As peças de destaque são geometria original em Three.js, em vez de um pacote 3D genérico low-poly. O piso usa mapas procedurais de cor e bump; o ambientCG Wood Floor 001 foi avaliado como possível referência CC0, mas ainda não foi importado: https://ambientcg.com/view?id=WoodFloor001. Para manter a direção cinematográfica, priorizar materiais PBR e detalhes próprios coerentes com a linguagem dos ambientes existentes.

### Cânone versus interpretação

O segundo andar, a escala de quadra, o piso de madeira, a abóbada pintada, as divindades, Rá como cesta e o exercício do shabti são os elementos narrativos que orientam a sala. A implantação a oeste do Grande Salão, o desenho exato da abóbada, as divindades selecionadas, o quadro de tiro mágico, os três alvos e as regras de combate são decisões interpretativas. As medidas 15 × 28 m seguem a FIBA 2026 como referência de basquete moderno, não como medida escrita no romance.

A sala já está ligada ao inventário e ao controlador comuns; a validação real de câmera, escala, colisões e desempenho desktop/mobile permanece pendente.


A pele de serpente foi orientada com o eixo longo (40 pés) no sentido longitudinal do Grande Salão; validar a posição final no enquadramento 3/4 e na escala do avatar antes de marcar a etapa visual como concluída.


## Biblioteca subterrânea — revisão estrutural de 27/11/2026

Documento complementar de produção: [BIBLIOTECA-STUDY.md](BIBLIOTECA-STUDY.md).

A leitura canônica permanece: câmara circular escavada na rocha; descida de três andares; parede, piso e teto pintados com figuras multicoloridas; Nut e Geb; cavidades redondas em padrão de colmeia com cilindros plásticos de armazenamento pneumático e papiros; quatro estatuetas humanas de cerâmica; mesa longa de pedra com a bolsa de Julius Kane.

**Correção visual importante:** as quatro figuras da biblioteca não devem ser representadas como quatro shabtis mumiformes de braços cruzados. O texto descreve pequenas figuras humanas de cerâmica, com kilt, sandálias, cabelo preto angular e kohl, e objetos distintos (estilete/rolo, caixa, cajado curto em gancho e mãos vazias). Os shabtis guerreiros da Sala de Treinamento são outro conjunto narrativo e não devem ser confundidos com essas estatuetas.

**Implementação estrutural registrada:** painéis murais curvos com aberturas circulares reais e profundidade interna; cápsulas translúcidas com papiro interno; quatro estatuetas humanas; mesa de pedra e bolsa de Julius. As 48 cápsulas (16 por faixa em três faixas) são uma distribuição de produção, não uma contagem canônica.

**Ainda provisório:** forma figurativa final de Nut e Geb, desenho da escada dos três andares e aprovação dos materiais. A escada helicoidal é uma decisão interpretativa, pois o romance fixa a descida de três andares, mas não sua planta. A implementação não deve ser marcada como aprovada sem inspeção real em desktop e celular paisagem.
