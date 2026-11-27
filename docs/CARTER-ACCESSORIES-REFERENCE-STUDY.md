# Carter Kane — estudo visual dos acessórios (revisão após screenshot)

Status em 27/11/2026: **direção A e composição aprovadas explicitamente pelo usuário.** Integração ainda pendente porque o ambiente não conseguiu recuperar os bytes do GLB Innerscene: o download redireciona para `files.innerscene.com`, cujo arquivo não está acessível pelas ferramentas desta sessão. Nenhuma malha falsa/substituta foi integrada.

## 1. Diagnóstico do screenshot enviado em 27/11/2026

O screenshot atual mostra:

- **Bolsa:** corpo muito grande/espesso para a leitura desejada, com forma de estojo rígido, afastado da pelve e com a parte traseira/fechos a parecerem uma extensão separada.
- **Alça:** a faixa visual parece passar à frente do tórax, mas não acompanha a superfície da camisa; na região inferior forma um arco frouxo, sem caminho físico claro até a bolsa.
- **Colar:** corrente/medalhão não assentam sobre a camisa. A profundidade do pendant não acompanha a superfície do tórax e a corrente parece rígida/descolada.
- **Peça escura no ombro:** não existe geometria preta com esse nome/material em `src/character-accessories.js`. A origem ainda não está confirmada. Pode pertencer ao share/modelo Ara ou a uma peça anexa de outro módulo; não remover até localizar o objeto na hierarquia do modelo-base.
- **A imagem mostra o runtime atual como visualmente não aprovado.** A documentação anterior dizia que o fit ainda precisava de QA; este screenshot confirma a falha e substitui qualquer descrição presumida de que os acessórios já estariam encaixados.

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

## 4. Asset 3D principal — aprovado, aguardando bytes para inspeção e integração

### Innerscene — Crossbody bag

- Página do asset: https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2
- Preview 3D interativo: https://www.innerscene.com/v/30D3Tr8OmLQLhr2VttMnR
- Formato: GLB, 3.5 MB.
- Licença declarada na página: CC0 / public domain dedication.
- Fonte: modelo original Innerscene.
- Corpo: aproximadamente 230 × 86 × 180 mm; couro conhaque liso, topo arredondado, aba frontal costurada, fecho rotativo de latão, anéis laterais.
- Alça do modelo: 22 mm, mas foi modelada caída atrás da bolsa e em laço no chão. **Não serve para uso direto no Carter.** Se o corpo for aprovado, a alça solta será removida/substituída por uma nova, montada e retargetada aos ossos corretos.
- Compatibilidade esperada: GLB glTF 2.0 com materiais e dimensões reais em metros. Three.js oferece `GLTFLoader`, mas a integração só pode ser validada após inspecionar a hierarquia, separar a malha da alça original, verificar materiais/texturas/pivôs e testar a origem local. O arquivo não foi baixado nesta sessão: o endpoint de download redireciona para `files.innerscene.com`, inacessível pelas ferramentas disponíveis. Nenhum arquivo foi testado no runtime.
- Trade-off: é o candidato mais próximo de uma pequena satchel de couro conhaque com aba e ferragem simples; pode ainda exigir alteração da silhueta para coincidir com a ilustração de Karen.

### Alternativa de referência, não de importação

- HERZ Wrap Flap Mini Shoulder Bag: https://www.herz-bag.jp/webshop/products/detail/1472 — corpo em couro mais espesso, aba envolvente e fivela central. A imagem de produto ajuda a avaliar a leitura de couro costurado, mas é produto comercial e não um GLB de licença livre.

### Candidato rejeitado para este uso

- Innerscene Handbag: GLB CC0, mas é uma handbag burgundy de alça de mão, cerca de 315 × 143 × 231 mm no corpo, com duas alças superiores e zíper; não corresponde à bolsa transversal visualmente escolhida.
- Innerscene Leather Briefcase: GLB CC0, mas o corpo de 410 × 105 × 300 mm é muito grande e tem alça de mão; leitura de pasta/briefcase.
- Bolsa genérica baixa/low-poly “survival prop” encontrada em outro catálogo tem proporção e linguagem incompatíveis; não selecionada.

## 5. Composição aprovada e plano de implementação

**Direção recomendada:** usar o corpo GLB Innerscene como base de modelagem/material, mas não manter a alça original. Adaptar a silhueta para mais compacta, arredondada e achatada, preservando a leitura da satchel da ilustração de Karen; construir uma alça nova que envolva ombro/peito/flanco e se conecte de verdade à bolsa na lateral posterior do quadril direito. Reposicionar corrente e medalhão pela superfície real da camisa, sem alterar o medalhão aprovado.

**Aprovação recebida:** o usuário aprovou a direção A (corpo Innerscene como base e nova alça) e respondeu “pode seguir” à proposta de composição/tamanho/posição. Não solicitar nova aprovação estética para essa mesma direção. O bloqueio atual é exclusivamente técnico: falta obter o arquivo GLB para inspecionar e modificar a malha real.

## 6. Próximas verificações antes de qualquer merge

- Identificar a peça preta no ombro percorrendo os filhos do modelo Ara e nomes de mesh/material do share original.
- Verificar eixos frontais, rotação do root e transformações dos ossos reais Hips/Spine/Chest/Clavicle/Neck.
- Não inferir o eixo de profundidade apenas pelas coordenadas do modelo; medir pontos/offsets na pose neutra do Carter e validar a superfície em frente, perfil e 3/4.
- Criar um preview isolado com o corpo da bolsa e a alça proposta, mostrando frente, costas, perfil e 3/4.
- Confirmar contato sem clipping em idle, walk, run, curva, salto, ataques, reações e estado ferido.
- Só integrar depois da aprovação visual do usuário. Desktop e mobile devem receber a mesma malha, materiais, rig e lógica.

## 7. Confirmação da referência oficial — 27/11/2026

Foi aberta e inspecionada visualmente a página 13 de *The Kane Chronicles Egyptian Event Kit / The Red Pyramid Teacher's Guide*, material Disney·Hyperion hospedado no site oficial de Rick Riordan: https://rickriordan.com/wp-content/uploads/2016/04/kane-chronicles-teachers-guide-event-kit.pdf

A ilustração oficial mostra Carter em pose de movimento, usando bolsa marrom de ombro apoiada na lateral do quadril. Visualmente, a bolsa tem corpo curto, cantos arredondados, volume de couro flexível e aba frontal ampla; a alça sai da região do ombro e acompanha o torso. A página ajuda a validar a silhueta e a posição, mas não define medidas de fabricação, número exato de bolsos ou construção interna. Essas dimensões continuam sendo interpretação de produção.

## 8. Decisão de remoção da mochila

`src/character.js` já cria o personagem com a opção `carry: 'none'`, conforme a documentação oficial do Ara: https://ara3dgen.com/docs/library/ (seção Options, linhas sobre `carry` e remoção de props). Portanto, não repetir alterações cegas nessa opção. A forma escura ainda visível deve ser rastreada pela hierarquia de `hero.scene` e `hero.props` quando o runtime e/ou os bytes do modelo puderem ser inspecionados; só remover a peça exata identificada.

## 9. Próximo insumo técnico necessário

Para prosseguir com o asset escolhido sem substituí-lo por geometria aproximada, é necessário obter o arquivo original `crossbody-bag.glb`. Abrir a página do asset, usar **Download GLB** e anexar o arquivo nesta conversa:

https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2

Após obter os bytes: inspecionar meshes/nodes e materiais; remover apenas a alça caída original; aplicar escala-alvo de 0,88; ajustar orientação lateral/posterior no quadril direito; construir a nova alça adaptada à superfície real do Carter e aos ossos do rig; preservar o medalhão aprovado e corrigir seu contato com a camisa; validar vistas frontal, posterior, perfil e 3/4 em idle, walk, run, turn, jump e hit. Até lá, o código runtime atual permanece explicitamente marcado como protótipo procedural não aprovado visualmente.