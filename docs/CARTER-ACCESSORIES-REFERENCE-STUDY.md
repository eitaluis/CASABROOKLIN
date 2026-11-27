# Carter Kane — estudo visual dos acessórios (revisão após screenshot)

Status em 27/11/2026: **direção A aprovada e asset Innerscene CC0 baixado, inspecionado e integrado ao runtime.** O corpo GLB está versionado em `assets/models/carter/innerscene-crossbody-bag.glb`; a alça original é ocultada e substituída por uma fita customizada projetada na superfície e presa aos ossos. O colar mantém corrente/medalhão projetados no tórax. A inspeção visual em navegador desktop/mobile ainda é necessária antes de chamar o encaixe de aprovado.

> Nota de leitura: as seções 4–10 e a primeira seção 11 registram a pesquisa e os bloqueios históricos. O estado final do asset e da integração está na seção 12; use a seção 12 como fonte de verdade para o status atual.

## 1. Diagnóstico do screenshot enviado em 27/11/2026

O screenshot enviado na rodada anterior mostrava:

- **Bolsa:** corpo muito grande/espesso para a leitura desejada, com forma de estojo rígido, afastado da pelve e com a parte traseira/fechos a parecerem uma extensão separada.
- **Alça:** a faixa visual parece passar à frente do tórax, mas não acompanha a superfície da camisa; na região inferior forma um arco frouxo, sem caminho físico claro até a bolsa.
- **Colar:** corrente/medalhão não assentam sobre a camisa. A profundidade do pendant não acompanha a superfície do tórax e a corrente parece rígida/descolada.
- **Peça escura no ombro:** não existe geometria preta com esse nome/material em `src/character-accessories.js`. A origem ainda não está confirmada. Pode pertencer ao share/modelo Ara ou a uma peça anexa de outro módulo; não remover até localizar o objeto na hierarquia do modelo-base.
- **Naquela captura, o runtime estava visualmente não aprovado.** A imagem documenta o ponto de partida da correção, não o estado posterior à integração descrita na seção 12.

## 2. O que é canônico e o que não é

### Canônico textual / editorial oficial

- O material oficial de divulgação/educação da Disney·Hyperion para *The Red Pyramid* identifica a ilustração de Carter com **camisa azul de manga longa, calça marrom, bolsa marrom de ombro** e khopesh. A legenda descreve o personagem em pose pronta para se mover. Fonte: Rick Riordan, *The Red Pyramid Teacher’s Guide and Event Kit*, página/atividade “Where in the World Is Carter Kane?”.
- A fonte identifica uma **brown shoulder bag**, mas não especifica no texto a construção da aba, formato dos bolsos, dimensões, tipo de couro, posição exata na pelve ou routing completo da alça. Não inventar esses detalhes como cânone textual.
- Um trecho do romance em que uma satchel de couro é retirada de um armário refere-se a um item manuseado por Sadie; não prova que seja a bolsa de Carter. Não reutilizar essa descrição como se fosse a bolsa dele.

### Referência visual escolhida pelo usuário

- Karen de la Vega, ilustradora, tem projeto de portfólio chamado “CARTER KANE (Kane Chronicles by rick riordan)”. A própria artista o descreve como “My own vision of Carter Kane”; é **fan art / visão da artista**, não arte oficial do publisher.
- O usuário já escolheu anteriormente a imagem do Carter à esquerda da composição de Karen como referência de identidade, silhueta e leitura geral do personagem. Essa aprovação continua válida; não substituir o rosto/corpo Ara aprovado.
- A imagem pública associada à composição de Karen de la Vega mostra um Carter com camisa azul, calça clara/bege, satchel marrom transversal e medalhão. É referência artística de direção, não especificação de produto.

### Interpretação de produção (aprovada pelo usuário em 27/11/2026)

- Manter a bolsa no **quadril direito anatômico, posterior/lateral**, próxima da pelve/cóccix, mas não atrás do corpo a ponto de parecer distante da silhueta.
- Reduzir o corpo original em aproximadamente 12% (alvo aproximado: 202 × 76 × 158 mm), mantendo a leitura macia e arredondada da bolsa oficial/editorial; aba costurada, bolso discreto, costura legível e ferragem pequena.
- A alça deve sair do ombro, acompanhar a curvatura real da camisa/peito, passar pela lateral do tronco e entrar nos pontos de fixação da bolsa, sem atravessar o corpo, flutuar ou formar um arco livre.
- O colar deve seguir a superfície do pescoço e do tórax, com folga física mínima e medalhão apoiado na camisa. Preservar o desenho/tamanho do medalhão já aprovado.
- A peça escura no ombro precisa ser identificada antes de apagar ou trocar.

## 3. Referências visuais apresentadas

1. **Carter de Karen de la Vega — referência artística do usuário.** A imagem confirma uma satchel transversal e a relação visual entre camisa, strap, bolsa e medalhão. Não é arte oficial.
2. **HERZ Wrap Flap Mini Shoulder Bag — referência de produto real.** Boa leitura de couro conhaque, aba envolvente, pesponto, corpo relativamente estreito e ferragem simples. Usar apenas como referência de construção/material, não como asset livre.
3. **Warriner Leather Saddle Crossbody — referência de produto real.** Boa referência para uma bolsa tipo saddle, aba contínua, laterais em fole, ferragem em latão e costura aparente. Não é asset 3D livre.
4. **Innerscene Crossbody Bag — candidato real de 3D.** O preview interativo está disponível no link de origem; ver ficha técnica abaixo.
5. **Outros modelos do Innerscene estudados:** handbag de alça de mão é mais estruturada, maior e burgundy; briefcase é muito grande; tote/duffel são tipologias erradas. Não recomendar esses modelos para Carter.

## 4. Histórico da pesquisa de asset — bloqueio superado na seção 12

### Innerscene — Crossbody bag

- Página do asset: https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2
- Preview 3D interativo: https://www.innerscene.com/v/30D3Tr8OmLQLhr2VttMnR
- Formato: GLB, 3.5 MB.
- Licença declarada na página: CC0 / public domain dedication.
- Fonte: modelo original Innerscene.
- Corpo: aproximadamente 230 × 86 × 180 mm; couro conhaque liso, topo arredondado, aba frontal costurada, fecho rotativo de latão, anéis laterais.
- Alça do modelo: 22 mm, mas foi modelada caída atrás da bolsa e em laço no chão. **Não serve para uso direto no Carter.** Se o corpo for aprovado, a alça solta será removida/substituída por uma nova, montada e retargetada aos ossos corretos.
- Registro histórico: na etapa inicial, o arquivo ainda não havia sido baixado e a inspeção estava pendente. Esse bloqueio foi resolvido posteriormente; veja a seção 12 para a integração efetiva.
- Trade-off: é o candidato mais próximo de uma pequena satchel de couro conhaque com aba e ferragem simples; pode ainda exigir alteração da silhueta para coincidir com a ilustração de Karen.

### Alternativa de referência, não de importação

- HERZ Wrap Flap Mini Shoulder Bag: https://www.herz-bag.jp/webshop/products/detail/1472 — corpo em couro mais espesso, aba envolvente e fivela central. A imagem de produto ajuda a avaliar a leitura de couro costurado, mas é produto comercial e não um GLB de licença livre.

### Candidato rejeitado para este uso

- Innerscene Handbag: GLB CC0, mas é uma handbag burgundy de alça de mão, cerca de 315 × 143 × 231 mm no corpo, com duas alças superiores e zíper; não corresponde à bolsa transversal visualmente escolhida.
- Innerscene Leather Briefcase: GLB CC0, mas o corpo de 410 × 105 × 300 mm é muito grande e tem alça de mão; leitura de pasta/briefcase.
- Bolsa genérica baixa/low-poly “survival prop” encontrada em outro catálogo tem proporção e linguagem incompatíveis; não selecionada.

## 5. Composição aprovada e implementada

**Direção implementada:** usar o corpo GLB Innerscene como base e material; ocultar a alça original; construir uma fita nova que acompanha ombro/peito/flanco e se conecta à bolsa na lateral posterior do quadril direito. Corrente e medalhão são projetados na superfície da camisa, mantendo o desenho aprovado.

**Aprovação recebida:** o usuário aprovou a direção A (corpo Innerscene como base e nova alça) e a composição/tamanho/posição. A implementação consta na seção 12; a pendência atual é apenas a inspeção visual no navegador.

## 6. QA pós-integração

- Identificar a peça preta no ombro percorrendo os filhos do modelo Ara e nomes de mesh/material do share original.
- Verificar eixos frontais, rotação do root e transformações dos ossos reais Hips/Spine/Chest/Clavicle/Neck.
- Não inferir o eixo de profundidade apenas pelas coordenadas do modelo; medir pontos/offsets na pose neutra do Carter e validar a superfície em frente, perfil e 3/4.
- Criar um preview isolado com o corpo GLB real e a alça proposta, mostrando frente, costas, perfil e 3/4.
- Confirmar contato sem clipping em idle, walk, run, curva, salto, ataques, reações e estado ferido.
- A aprovação visual de direção e composição já foi recebida em 27/11/2026. A integração depende agora da inspeção do GLB original e da validação técnica de encaixe. Desktop e mobile devem receber a mesma malha, materiais, rig e lógica.

## 7. Confirmação da referência oficial — 27/11/2026

Foi aberta e inspecionada visualmente a página 13 de *The Kane Chronicles Egyptian Event Kit / The Red Pyramid Teacher's Guide*, material Disney·Hyperion hospedado no site oficial de Rick Riordan: https://rickriordan.com/wp-content/uploads/2016/04/kane-chronicles-teachers-guide-event-kit.pdf

A ilustração oficial mostra Carter em pose de movimento, usando bolsa marrom de ombro apoiada na lateral do quadril. Visualmente, a bolsa tem corpo curto, cantos arredondados, volume de couro flexível e aba frontal ampla; a alça sai da região do ombro e acompanha o torso. A página ajuda a validar a silhueta e a posição, mas não define medidas de fabricação, número exato de bolsos ou construção interna. Essas dimensões continuam sendo interpretação de produção.

## 8. Decisão de remoção da mochila

`src/character.js` já cria o personagem com a opção `carry: 'none'`, conforme a documentação oficial do Ara: https://ara3dgen.com/docs/library/ (seção Options, linhas sobre `carry` e remoção de props). Portanto, não repetir alterações cegas nessa opção. A forma escura ainda visível deve ser rastreada pela hierarquia de `hero.scene` e `hero.props` quando o runtime e/ou os bytes do modelo puderem ser inspecionados; só remover a peça exata identificada.

## 9. Etapa histórica — obtenção do GLB (superada)

O pedido antigo para anexar manualmente o GLB deixou de ser necessário: o arquivo original foi obtido e versionado em `assets/models/carter/innerscene-crossbody-bag.glb`. A hierarquia e os materiais foram inspecionados e a alça original foi ocultada. Consulte a seção 12.

## 10. Alternativas de asset após limite de upload do usuário — 27/11/2026

O usuário não consegue anexar o GLB Innerscene nesta conversa. Foram pesquisadas alternativas com download público direto, priorizando licença clara e silhueta de satchel.

### Candidato B — Vinish.dev Leather Satchel (CC BY 4.0; download sem conta)

- Página e visualizador: https://vinish.dev/free-3d-models/bags-and-backpacks
- Download GLB direto: https://vinish-models.pages.dev/bags-and-backpacks/leather-satchel.glb
- Formato e peso: GLB, 317 KB; 8.320 triângulos.
- Dimensões listadas: 0.41 × 0.13 × 0.64 m (largura × profundidade × altura).
- Linguagem: couro tan, aba marrom-escura, duas fivelas douradas, alça superior enrolada e alça longa de ombro em anéis dourados.
- Hierarquia descrita: uma única malha/node LeatherSatchel_Mesh; não há confirmação de peças separadas para alça, topo ou ferragens.
- Licença: CC BY 4.0; autoria Vinish.dev; exige crédito e indicação das modificações.
- Adequação: tipologia e cor de couro mais próximas do Carter do que a handbag rosa; porém é muito alta (64 cm) e exigiria reconstrução proporcional importante. A malha única dificulta remover alça e handle sem edição de faces/retopologia.
- Status: candidato de pesquisa; não aprovado e não baixado.

### Candidato C — Grab3D Handbag (CC0; download sem conta)

- Página: https://grab3d.com/models/props/handbag/
- Download GLB direto: https://grab3d.com/dl/handbag/handbag.glb
- Formato e peso: GLB, 597 KB; 8.348 triângulos; texturas PBR 2K.
- Dimensões anunciadas: 0.30 × 0.14 × 0.38 m (incluindo o handle).
- Linguagem: corpo de couro rosa, aba marrom, fecho giratório dourado, vivo lateral creme, base com quatro pés e handle superior em couro marrom.
- Licença: CC0 1.0 / domínio público; uso comercial e sem atribuição.
- Adequação: corpo macio e arredondado, com aba/ferragem que pode ser reaproveitada; não é uma satchel transversal. Exige recoloração para conhaque, remoção do handle e dos pés se a leitura ficar excessivamente handbag, achatamento de profundidade/altura e nova alça.
- Status: candidato de pesquisa; não aprovado e não baixado.

### Candidato D — Meshy Vintage Leather Satchel / Illustros (CC0)

- Página: https://www.meshy.ai/3d-models/Vintage-Leather-Satchel-v2-0195ba14-468c-73fb-a0f3-37f288a60227
- Imagem/preview encontrado: https://cdn.meshy.ai/uploads/prod/c43523eec3b2029182db9a5dcc3aef98d72159540d2fd5e225fe42f27f6abdac/publish/cover-square/0195ba17-d9cd-727c-b613-333af69d9cd3.jpg
- Licença: CC0 de acordo com a ficha do modelo.
- Visual: couro marrom, aba frontal larga, duas fivelas e ferragens prateadas decoradas, relevo floral ao centro, handle superior e laterais em fole.
- Formatos anunciados na ficha da plataforma: GLB, FBX, OBJ, USDZ e STL. A plataforma informa que é necessária conta gratuita para baixar os arquivos.
- Adequação: material e tipologia são fortes; relevo ornamental e alça superior não correspondem exatamente ao visual do Carter. Não há dimensões, topologia ou estrutura de nodes verificadas.
- Status: referência visual/candidato; não aprovado, sem download.

### Candidatos rejeitados nesta rodada

- Polyfork Leather Belt Satchel: corpo 0.21 × 0.22 × 0.12 m, 675 triângulos e aspecto rígido de estojo; contradiz o pedido de bolsa macia e não parecer rádio.
- 3DAssets.dev Messenger Bag: CC0 e download/CDN direto, mas 0.435 × 0.724 × 0.163 m, 660 triângulos, estilo low-poly survival/tático e forma alta; não serve para a silhueta de Carter.
- Meshy sacoche / gd84.lab: 1.982 faces, juta/saco rústico; leitura de pouch, sem semelhança suficiente com satchel de couro.

### Limite técnico do ambiente de trabalho

As páginas e URLs de download foram verificadas. Entretanto, nesta sessão, os downloads externos binários não foram materializados no workspace: os links GLB de Grab3D e Vinish retornaram Cache miss/resposta binária não interpretável pelas ferramentas web; o downloader do container também não conseguiu recuperar os arquivos externos. As ferramentas GitHub disponíveis só recuperam binários alojados no próprio GitHub. Portanto, não afirmar que qualquer desses GLBs foi efetivamente baixado. A alternativa só pode ser chamada de integrada depois de obter seus bytes e inspecionar a malha.

Recomendação atual: manter Innerscene como referência aprovada de direção, e levar à avaliação estética prioritária o Vinish Leather Satchel (melhor tipologia/cor, apesar da proporção muito alta) e o Grab3D Handbag (melhor corpo suave/aba, apesar de ser handbag rosa). O Meshy CC0 fica como referência adicional. Nenhum candidato substitui a direção A até aprovação explícita.


## 11. Histórico da primeira correção estrutural — 27/11/2026 (superado pela seção 12)

> Esta seção preserva o registro de uma etapa anterior, quando o GLB ainda não estava disponível. As afirmações de que o GLB não foi baixado e de que o runtime usa somente geometria procedural foram superadas pela seção 12.

A revisão foi integrada ao runtime em três partes: src/character-accessories.js, src/character.js (cache-buster), e o import de src/character.js usado por src/main.js e por character-preview.html.

### O que foi corrigido

- **Coordenadas/ordem de ancoragem:** bolsa, alça e corrente são construídas primeiro no espaço local neutro de Carter. Só depois os grupos são reparentados com Object3D.attach(), que preserva a posição mundial inicial. Isso evita que os vértices authored em coordenadas do modelo sejam interpretados como coordenadas locais de Hips/Spine.
- **Bolsa:** volume compacto, arredondado e lateral/posterior no quadril direito; dimensão-alvo provisória de 202 × 158 × 76 mm (0,88 das dimensões de corpo publicadas para o Innerscene). O pivô procura a superfície lateral do SkinnedMesh por raycast e é ancorado ao osso Hips.
- **Alça:** largura de 22 mm, acompanhando ombro/peito/lateral e chegando ao anel traseiro da bolsa. A geometria é dividida em dois trechos contíguos: o superior acompanha Spine2/Spine1 e o inferior acompanha Hips. Os pontos são projetados sobre a malha deformada e a orientação da fita/pesponto usa as normais calculadas dos vértices deformados do triângulo atingido.
- **Corrente e medalhão:** o desenho e a dimensão do pingente aprovado foram preservados. Os pontos da corrente são projetados sobre a superfície frontal do SkinnedMesh, o plano do medalhão acompanha a normal local obtida e o conjunto segue o osso torácico.
- **Paridade:** src/main.js e character-preview.html usam o mesmo src/character.js; o módulo de acessórios é único e compartilhado por desktop e mobile.

### Limite de asset e status real

O GLB original aprovado de Innerscene ainda não está no repositório e não foi baixado. A página de origem foi verificada como CC0 e documenta o corpo de couro conhaque 230 × 86 × 180 mm, mas o botão de download redireciona para o host binário files.innerscene.com, inacessível às ferramentas desta sessão. Portanto:

- A bolsa visível no runtime nesta revisão é **geometria procedural provisória**, não o GLB Innerscene.
- Não foi possível inspecionar sua hierarquia de nodes/malhas nem remover com segurança a alça caída original do GLB.
- A revisão do código foi integrada; **teste no navegador, validação de movimento e aprovação visual continuam pendentes**.
- A peça escura no ombro que apareceu no screenshot anterior segue sem origem identificada no Ara share; o parâmetro carry: 'none' já está definido e não deve ser repetido como tentativa cega de remoção.

### Evidência de implementação

Commits de implementação em main:
- 210f476 — reestrutura os anchors e troca o strap/necklace para pontos de fixação separados.
- 7bc663a — alinha o ajustador de latão ao plano da alça.
- 28a7c55 — calcula as normais de superfície a partir dos vértices deformados do SkinnedMesh.
- f8e9055 — registra proveniência e status no manifest.

O resultado esperado é bolsa sentada na lateral posterior da pelve, faixa colada à camisa e medalhão apoiado na parte superior do tórax. Esta é a intenção técnica documentada; só a inspeção real do preview pode confirmar o resultado visual.


## 12. Download e integração efetiva do asset Innerscene — 27/11/2026

O antigo bloqueio de download desta pesquisa foi resolvido usando o redirecionamento público oficial da página para o arquivo GLB. O arquivo foi baixado e gravado no repositório em `assets/models/carter/innerscene-crossbody-bag.glb` (3.687.552 bytes). A página oficial descreve o corpo como couro conhaque, com aba costurada, fecho de latão e anéis laterais, em dimensões aproximadas de 230 × 86 × 180 mm; a própria página declara CC0.

A hierarquia interna do GLB foi inspecionada antes da integração:

| Nó | Malha | Decisão |
|---|---|---|
| `Crossbody body` | 0 | Preservar |
| `Front flap` | 1 | Preservar |
| `Shoulder strap` | 2 | Ocultar, pois fica caída atrás da bolsa e não acompanha o corpo |
| `Stitching, lock and rings` | 3 | Preservar |

Os materiais separados são `Cognac smooth leather`, `Brushed brass hardware` e `Cream stitching`. O GLB tem eixo Z-up e declara a frente em -Y; o loader gira -90° no eixo X para o sistema Y-up do Three.js, aplica escala 0,88 e posiciona o corpo no pivô de quadril. A fita própria de 22 mm continua ajustada à superfície skinned da camisa, com segmentos vinculados aos pivôs do peito e quadril.

O loader mantém uma geometria procedural de fallback caso o GLB não carregue. Assim, a ausência do recurso remoto não retira a bolsa do personagem. A origem é carregada do mesmo domínio do projeto a partir do asset CC0 versionado no repositório.

### Colar

A corrente é uma curva tubular fina com projeção ponto a ponto na superfície skinned da camisa. O medalhão está ligado ao centro do tórax por um pivô cuja orientação acompanha a normal da superfície; o desenho de aro e ankh existente foi mantido. A margem de poucos milímetros reduz a chance de a peça flutuar ou atravessar a camisa, mas ainda precisa ser observada em movimento real.

### Estado técnico

- [x] GLB original baixado e mantido no repositório.
- [x] Hierarquia, dimensões e materiais inspecionados.
- [x] Alça original identificada e ocultada sem apagar as demais peças.
- [x] Corpo do asset ligado ao loader Three.js.
- [x] Alça nova projetada na malha e ancorada aos ossos do torso/quadril.
- [x] Corrente e medalhão preservados no módulo e presos ao tórax.
- [ ] Verificação visual de frente, costas, perfil e 3/4 em idle, walk, run, salto e combate.
- [ ] Verificação física de clipping/folga em desktop e celular paisagem.

A seção 9 acima, que pede o envio manual do GLB, é histórica e foi **superada** pela integração realizada nesta data.
