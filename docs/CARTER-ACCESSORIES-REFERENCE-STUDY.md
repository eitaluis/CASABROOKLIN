# Carter Kane — estudo visual dos acessórios (revisão após screenshot)

Status: **pesquisa realizada; referências apresentadas; nenhuma nova malha, strap ou modificação visual integrada. Aguardando aprovação explícita do usuário.**

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

### Interpretação de produção (aguardando aprovação)

- Manter a bolsa no **quadril direito anatômico, posterior/lateral**, próxima da pelve/cóccix, mas não atrás do corpo a ponto de parecer distante da silhueta.
- Preferir corpo compacto e fino em relação ao depth atual; aba de couro arredondada/curva; cantos suavizados; bolso discreto; costura legível; ferragem pequena.
- A alça deve sair do ombro, acompanhar a curvatura real da camisa/peito, passar pela lateral do tronco e entrar nos pontos de fixação da bolsa, sem atravessar o corpo, flutuar ou formar um arco livre.
- O colar deve seguir a superfície do pescoço e do tórax, com folga física mínima e medalhão apoiado na camisa. Preservar o desenho/tamanho do medalhão já aprovado.
- A peça escura no ombro precisa ser identificada antes de apagar ou trocar.

## 3. Referências visuais apresentadas

1. **Carter de Karen de la Vega — referência artística do usuário.** A imagem confirma uma satchel transversal e a relação visual entre camisa, strap, bolsa e medalhão. Não é arte oficial.
2. **HERZ Wrap Flap Mini Shoulder Bag — referência de produto real.** Boa leitura de couro conhaque, aba envolvente, pesponto, corpo relativamente estreito e ferragem simples. Usar apenas como referência de construção/material, não como asset livre.
3. **Warriner Leather Saddle Crossbody — referência de produto real.** Boa referência para uma bolsa tipo saddle, aba contínua, laterais em fole, ferragem em latão e costura aparente. Não é asset 3D livre.
4. **Innerscene Crossbody Bag — candidato real de 3D.** O preview interativo está disponível no link de origem; ver ficha técnica abaixo.
5. **Outros modelos do Innerscene estudados:** handbag de alça de mão é mais estruturada, maior e burgundy; briefcase é muito grande; tote/duffel são tipologias erradas. Não recomendar esses modelos para Carter.

## 4. Candidato 3D principal — ainda não aprovado/importado

### Innerscene — Crossbody bag

- Página do asset: https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2
- Preview 3D interativo: https://www.innerscene.com/v/30D3Tr8OmLQLhr2VttMnR
- Formato: GLB, 3.5 MB.
- Licença declarada na página: CC0 / public domain dedication.
- Fonte: modelo original Innerscene.
- Corpo: aproximadamente 230 × 86 × 180 mm; couro conhaque liso, topo arredondado, aba frontal costurada, fecho rotativo de latão, anéis laterais.
- Alça do modelo: 22 mm, mas foi modelada caída atrás da bolsa e em laço no chão. **Não serve para uso direto no Carter.** Se o corpo for aprovado, a alça solta será removida/substituída por uma nova, montada e retargetada aos ossos corretos.
- Compatibilidade potencial: GLB com materiais e dimensões reais em metros; Three.js consegue carregar GLB via GLTFLoader. A compatibilidade final depende de inspeção da hierarquia, dos materiais e dos pivôs após a aprovação. Nenhum arquivo foi baixado nem testado no runtime.
- Trade-off: é o candidato mais próximo de uma pequena satchel de couro conhaque com aba e ferragem simples; pode ainda exigir alteração da silhueta para coincidir com a ilustração de Karen.

### Alternativa de referência, não de importação

- HERZ Wrap Flap Mini Shoulder Bag: https://www.herz-bag.jp/webshop/products/detail/1472 — corpo em couro mais espesso, aba envolvente e fivela central. A imagem de produto ajuda a avaliar a leitura de couro costurado, mas é produto comercial e não um GLB de licença livre.

### Candidato rejeitado para este uso

- Innerscene Handbag: GLB CC0, mas é uma handbag burgundy de alça de mão, cerca de 315 × 143 × 231 mm no corpo, com duas alças superiores e zíper; não corresponde à bolsa transversal visualmente escolhida.
- Innerscene Leather Briefcase: GLB CC0, mas o corpo de 410 × 105 × 300 mm é muito grande e tem alça de mão; leitura de pasta/briefcase.
- Bolsa genérica baixa/low-poly “survival prop” encontrada em outro catálogo tem proporção e linguagem incompatíveis; não selecionada.

## 5. Proposta visual para aprovação

**Direção recomendada:** usar o corpo GLB Innerscene como base de modelagem/material, mas não manter a alça original. Adaptar a silhueta para mais compacta, arredondada e achatada, preservando a leitura da satchel da ilustração de Karen; construir uma alça nova que envolva ombro/peito/flanco e se conecte de verdade à bolsa na lateral posterior do quadril direito. Reposicionar corrente e medalhão pela superfície real da camisa, sem alterar o medalhão aprovado.

**Não está aprovado para implementação ainda.** Aguardar o usuário escolher/aprovar o candidato 3D ou pedir uma direção alternativa.

## 6. Próximas verificações antes de qualquer merge

- Identificar a peça preta no ombro percorrendo os filhos do modelo Ara e nomes de mesh/material do share original.
- Verificar eixos frontais, rotação do root e transformações dos ossos reais Hips/Spine/Chest/Clavicle/Neck.
- Não inferir o eixo de profundidade apenas pelas coordenadas do modelo; medir pontos/offsets na pose neutra do Carter e validar a superfície em frente, perfil e 3/4.
- Criar um preview isolado com o corpo da bolsa e a alça proposta, mostrando frente, costas, perfil e 3/4.
- Confirmar contato sem clipping em idle, walk, run, curva, salto, ataques, reações e estado ferido.
- Só integrar depois da aprovação visual do usuário. Desktop e mobile devem receber a mesma malha, materiais, rig e lógica.
