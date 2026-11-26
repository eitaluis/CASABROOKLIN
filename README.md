# Brooklyn House — As Crônicas dos Kane

Reconstrução 3D explorável da Brooklyn House, baseada em *A Pirâmide Vermelha*, de Rick Riordan.

## Executar

O projeto é uma aplicação WebGL/Three.js. Para visualizar:

1. Ative GitHub Pages em **Settings → Pages → Deploy from a branch → main → /(root)**.
2. Abra a URL publicada pelo GitHub Pages.
3. Clique em **Explorar em terceira pessoa**.
4. Use WASD para mover o personagem e o mouse para orbitar a câmera.

Também pode ser executado por um servidor estático local. Abrir o HTML diretamente como `file://` pode bloquear módulos e assets remotos.

## Controles

| Controle | Ação |
|---|---|
| WASD / setas | Caminhar |
| Mouse | Girar a câmera em terceira pessoa |
| Shift | Correr |
| Espaço | Saltar (quando disponível) |
| Esc | Liberar o mouse |
| I | Abrir/fechar inventário |
| F | Usar arma equipada |
| 1–4 | Teleportar entre áreas |

## Estrutura do repositório

Veja [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para a divisão dos módulos, [docs/OPEN-SOURCES.md](docs/OPEN-SOURCES.md) para fontes e licenças, [docs/CHARACTER-OPTIONS.md](docs/CHARACTER-OPTIONS.md) para alternativas de personagem e [docs/ROADMAP-CHECKLIST.md](docs/ROADMAP-CHECKLIST.md) para o checklist por setores.

## Fidelidade ao livro

As cenas misturam três categorias que devem continuar identificadas durante o desenvolvimento:

- **Canônico:** descrito no romance.
- **Referência histórica:** arquitetura e objetos reais usados para completar a forma.
- **Interpretação:** detalhes criados para preencher áreas que o texto não descreve.

A escada metálica em caracol, o armazém na margem do East River, os blocos de calcário, a mistura de museu moderno e templo antigo, o Grande Salão e a biblioteca circular são tratados como prioridades do projeto.

## Licenças

Consulte [docs/OPEN-SOURCES.md](docs/OPEN-SOURCES.md) e [assets/manifest.json](assets/manifest.json). Assets remotos permanecem nos seus repositórios de origem; confirme as licenças antes de redistribuir binários offline.


## Personagem — Carter Kane

A primeira versão local do Carter está em `src/character.js`, com direção Game 3D gráfico, rosto humano natural, rig articulado, bolsa transversal no quadril direito e locomoção procedural. A página `character-preview.html` permite inspecionar o mesmo modelo em 3D antes de testar a cena completa.

