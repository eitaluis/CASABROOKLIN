# Padrão asset-first de pesquisa e implementação

Data de adoção: 27/11/2026  
Escopo: **todo o CASABROOKLIN** — espaços, arquitetura, objetos, armas, personagens, roupas, texturas, partículas, animações, interações, sons e efeitos.

Este documento é a ordem obrigatória de trabalho para qualquer mudança visual ou funcional. Uma referência não substitui um asset, um asset não substitui a pesquisa de canon e uma implementação não é considerada aprovada sem inspeção visual.

## 1. Ordem de pesquisa

### 1.1 Fonte primária e canon
1. Identificar o livro, capítulo, edição e página/trecho que descrevem o elemento.
2. Registrar literalmente apenas o mínimo necessário e resumir a descrição com referência verificável.
3. Separar claramente:
   - **Canon textual:** o que o livro realmente afirma.
   - **Canon visual oficial:** o que aparece nas ilustrações/capas oficiais publicadas.
   - **Referência histórica/arqueológica:** objeto real comparável, com instituição, data e medida.
   - **Interpretação de produção:** tudo que o romance não determina (cor, escala, forma, material, quantidade, animação, layout ou regra de gameplay).
4. Não transferir descrição de um personagem/objeto para outro sem evidência (por exemplo, o cajado de Zia não define automaticamente o cajado de Carter).

### 1.2 Referências visuais
1. Procurar primeiro ilustrações oficiais de Rick Riordan/Read Riordan/Disney/Hyperion, capas e artes licenciadas.
2. Para elementos não ilustrados, pesquisar documentação de museus, publicações acadêmicas, registros arqueológicos, fotografia de objetos reais e referências técnicas.
3. Usar Pinterest, ArtStation, Sketchfab, Behance e imagens de comunidade apenas como referência secundária, identificando autoria e natureza não oficial.
4. Toda referência exibida deve ter legenda: **oficial**, **histórica**, **artística não oficial** ou **asset candidato**.
5. Mostrar no chat uma seleção visual de cada elemento tratado, com link direto à página de origem. Não usar imagem decorativa sem relação com a peça que será implementada.

## 2. Pesquisa e seleção de assets

Para cada objeto, espaço, textura, efeito, animação ou interação:
1. Pesquisar GitHub e catálogos abertos (CC0, MIT, CC BY, Poly Haven, ambientCG, Kenney, OpenGameArt, Sketchfab quando a licença for clara, etc.).
2. Preferir asset real em formato diretamente utilizável no runtime: GLB/glTF para 3D, PNG/WebP/KTX2 para textura, SVG para vetores, áudio aberto para som, FBX/GLB/BVH para movimento.
3. Confirmar antes de integrar:
   - página do autor e arquivo exato;
   - licença específica do arquivo, não apenas licença do repositório;
   - atribuição exigida e possibilidade de uso comercial;
   - dimensões, unidades, pivô/origem, orientação, materiais, triângulos e dependências;
   - CORS e método de carregamento quando servido por CDN;
   - compatibilidade com Three.js 0.165.0 e dispositivos-alvo.
4. Não importar itens com licença NC, “editorial only”, copyright sem permissão ou licença desconhecida.
5. Registrar também assets rejeitados e o motivo, para evitar pesquisas repetidas.
6. Não chamar de “asset usado” algo que foi visto somente em screenshot/página/miniatura. Só marcar `runtimeImported: true` quando o runtime efetivamente carrega o arquivo.
7. Quando o asset vem por CDN, preservar fallback local de Three.js e registrar que a rede é necessária para a malha original. Quando possível, preferir armazenamento local no repositório.

## 3. Adaptação ao mundo

- Reutilizar o asset original; adaptar escala, orientação, materiais, pivô e colisões para o universo CASABROOKLIN.
- Preservar o máximo possível da malha original; não substituir a fonte por um desenho procedural sem registrar a razão.
- Documentar qualquer retintura, redução de espessura, remoção de scabbard, reposicionamento de pivot, re-topologia ou troca de LOD.
- Se não houver asset adequado/licença compatível, criar geometria/shader original e registrar que a implementação é autoral — sem atribuí-la ao asset pesquisado.
- Atribuir créditos na documentação e nos créditos do jogo de acordo com a licença.

## 4. Desktop e mobile

- O jogo tem uma única fonte de verdade: mesma cena, mundo, personagens, GLBs, materiais essenciais, animações, interações, físicas, colisões, progressão, inventário e energia.
- Desktop e mobile devem receber as mesmas melhorias na mesma branch/commit.
- Só podem variar controles de entrada, layout, densidade de UI, resolução, pixel ratio, sombras/efeitos de desempenho e qualidade de renderização adaptativa.
- Nunca manter um asset ou mecânica nova exclusivamente em desktop ou mobile.

## 5. Documentação obrigatória

Cada mudança deve atualizar o MD apropriado e, quando aplicável:
- `docs/OPEN-SOURCES.md`: origem, autor, licença, formato, dimensões, versão, links e estado de importação.
- `assets/manifest.json`: asset de runtime e referência, incluindo `runtimeImported`.
- Documento de área/sistema: canon, arte oficial, referências secundárias, assets usados/rejeitados, decisões de implementação, arquivos alterados e QA.
- Créditos: atribuição literal da licença quando necessário.

Cada entrada deve identificar claramente **asset externo**, **referência visual** ou **implementação original**.

## 6. Entrega e aprovação

Para toda nova rodada:
1. Apresentar a pesquisa e a seleção visual no chat antes ou junto da implementação.
2. Mostrar qual asset será efetivamente carregado, não somente a inspiração.
3. Explicar onde a direção artística é interpretação e onde é descrição canônica.
4. Implementar em branch isolada.
5. Atualizar docs e manifest.
6. Mostrar o diff/resumo dos arquivos alterados e abrir PR draft para revisão quando a inspeção visual do navegador ainda depender do usuário.
7. Não fazer merge nem declarar aprovado sem QA visual no navegador e confirmação do usuário quando a aparência for subjetiva.

## 7. Checklist de QA para toda alteração

- [ ] Canon e interpretações estão separadas.
- [ ] Referência oficial e/ou histórica está identificada.
- [ ] Asset exato, autor, licença e compatibilidade foram verificados.
- [ ] O runtime carrega o asset real e o fallback cobre falha de rede, quando necessário.
- [ ] Escala, pivô, eixo, material, clipping, iluminação e colisões conferidos.
- [ ] Controle e animação funcionam juntos e sem descolar objetos dos sockets.
- [ ] Desktop e mobile usam o mesmo comportamento e conteúdo.
- [ ] MD, manifest e créditos foram atualizados.
- [ ] O usuário recebeu referências visuais e pode acompanhar a decisão.
- [ ] A validação pendente foi explicitada, sem alegar teste que não ocorreu.

---

Este padrão se aplica a todas as próximas alterações e revisões do CASABROOKLIN, inclusive quando a solicitação vier como uma correção pontual.
