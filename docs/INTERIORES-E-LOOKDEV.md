# Interiores da Brooklyn House — pesquisa de assets e direção visual

Status: pesquisa e pré-produção. Os pacotes abaixo ainda não foram importados no runtime; manter as opções registradas antes da integração dos binários.

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
