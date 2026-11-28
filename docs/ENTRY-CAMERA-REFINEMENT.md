# Refinamento de câmera e identidade de entrada — 2026-11-27

## Escopo aprovado
- Câmera B: enquadramento intermediário, Carter ligeiramente maior no quadro do celular, sem perder leitura do cenário.
- Ícone 2: Olho de Hórus dourado com brilho turquesa sobre base escura.
- Tela inicial: apresentação cinematográfica, com símbolo, título, texto introdutório e chamada principal.

## Canon e interpretação
- **Canônico textual:** a Brooklyn House é o refúgio dos Kane no Brooklyn, junto ao East River; o projeto representa a casa e o universo de *As Crônicas dos Kane*.
- **Interpretação de produção:** câmera, identidade cromática do ícone, hierarquia tipográfica, composição da tela inicial e apresentação de carregamento são decisões da adaptação interativa; não são descrições visuais atribuídas ao romance.
- **Símbolo:** o Olho de Hórus já existia no repositório em `assets/decor/game-icons/eye-of-horus.svg`. O novo ícone reaproveita sua forma e preserva a atribuição a Delapouite / CC BY 3.0, com adaptação de cor e composição descrita nos metadados do SVG.

## Implementação
- Câmera retrato: distância de 4.0 para 3.35; FOV de 76° para 70°. Paisagem/desktop permanece em 3.2 e 58°.
- Tela inicial: título em duas linhas, símbolo central, texto reescrito e botão com área de toque maior.
- Tipografia retrato: parágrafo 14px, kicker 10px, botão 13px; removidas as regras que comprimiam o texto a 7–11px.
- Carregamento: símbolo, marca, mensagem legível e barra animada; o motor 3D continua sendo importado apenas após o toque em “Explorar”.
- Ícone SVG referenciado por favicon, apple-touch-icon e Web App Manifest.

## QA e limitações
- Código e referências de cache revisados no repositório.
- **Não testado em navegador ou iPhone nesta alteração.** Confirmar enquadramento em áreas estreitas, escadas e saltos; verificar também se o iOS atualiza o ícone da tela inicial. Se o iOS mantiver o ícone antigo, remover o atalho existente e adicioná-lo novamente; alguns fluxos do iOS podem preferir um PNG dedicado para `apple-touch-icon`.
- Desktop preservado por alterações de câmera e tipografia restritas ao retrato.
