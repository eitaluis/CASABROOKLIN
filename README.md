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
| Espaço | Saltar |
| Esc | Liberar o mouse |
| I | Abrir/fechar inventário |
| F | Usar arma equipada |
| 1–4 | Teleportar entre áreas |

## Personagem — Carter Kane

O runtime usa novamente a base humana contínua e rigada do Ara 3D Gen, que já havia sido aprovada visualmente antes do protótipo procedural rejeitado. O Carter mantém rosto humano natural, cabelo crespo curto, camiseta azul, calça cargo cáqui e tênis. A mochila automática foi removida.

A bolsa transversal conhaque fica no quadril direito, com alça diagonal sobre o peito. O corpo da bolsa e a alça são geometria local de encaixe, inspirada na referência CC0 Innerscene; o GLB original não foi baixado. O jogo usa o rig/skin weights e as animações idle, walk, run e jump do Ara, com inclinação de sprint aplicada pelo controlador comum de desktop e mobile.

Use [Abrir preview 3D do Carter](./character-preview.html) para inspecionar o mesmo módulo usado no jogo. A posição final da bolsa e as transições ainda precisam de teste visual em navegador real; veja [docs/CHARACTER.md](docs/CHARACTER.md).


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
