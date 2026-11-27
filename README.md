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
| E | Inspecionar objeto próximo |
| INTERAGIR (mobile) | Inspecionar objeto próximo |
| 1–5 | Teleportar entre áreas |

## Personagem — Carter Kane

O jogo preserva o Carter aprovado no Ara 3D Gen, remove a mochila original com `carry: 'none'` e acrescenta uma bolsa transversal menor, arredondada e posicionada na lateral posterior do quadril direito, além do medalhão ajustado ao tórax. O movimento e os acessórios são compartilhados entre desktop e mobile. O [preview independente do Carter](character-preview.html) usa o mesmo módulo do jogo. Para editar os acessórios no Blender, consulte `assets/models/carter/blender/`. A inspeção visual final ainda depende de teste em navegador real.



## Estrutura do repositório

As instruções para agentes estão em [AGENTS.md](AGENTS.md), e o fluxo visual obrigatório para qualquer alteração do Projeto Brooklyn está em [SKILL.md](SKILL.md): livro → referências oficiais/ilustrações → assets abertos → painel visual no chat → aprovação explícita → integração. Não baixar, criar nem substituir assets visuais antes do seu ok. O estudo atual da bolsa/colar do Carter está em [docs/CARTER-ACCESSORIES-REFERENCE-STUDY.md](docs/CARTER-ACCESSORIES-REFERENCE-STUDY.md).

Veja [docs/CARTER-MOVEMENT-ANIMATION-STUDY.md](docs/CARTER-MOVEMENT-ANIMATION-STUDY.md) para o estudo de corrida baixa com arma atrás e salto dinâmico, [docs/CHARACTER-INVENTORY-DUAT.md](docs/CHARACTER-INVENTORY-DUAT.md) para o catálogo e o fluxo de objetos no Duat, [docs/MAGIC-SPELLS-STUDY.md](docs/MAGIC-SPELLS-STUDY.md) para a pesquisa dos feitiços canônicos e o plano de conjuração, [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para a divisão dos módulos, [docs/OPEN-SOURCES.md](docs/OPEN-SOURCES.md) para fontes e licenças, [docs/ROADMAP-CHECKLIST.md](docs/ROADMAP-CHECKLIST.md) para o checklist por setores, [docs/ASSET-FIRST-ROOM-BUILDING.md](docs/ASSET-FIRST-ROOM-BUILDING.md) para o padrão de pesquisa e integração de assets e [docs/TRAINING-ROOM-STUDY.md](docs/TRAINING-ROOM-STUDY.md) para o estudo e as interações da Sala de Treinamento. [docs/BIBLIOTECA-STUDY.md](docs/BIBLIOTECA-STUDY.md) para o estudo canônico, referências e matriz de assets da biblioteca subterrânea.

## Fidelidade ao livro

As cenas misturam três categorias que devem continuar identificadas durante o desenvolvimento:

- **Canônico:** descrito no romance.
- **Referência histórica:** arquitetura e objetos reais usados para completar a forma.
- **Interpretação:** detalhes criados para preencher áreas que o texto não descreve.

A escada metálica em caracol, o armazém na margem do East River, os blocos de calcário, a mistura de museu moderno e templo antigo, o Grande Salão e a biblioteca circular são tratados como prioridades do projeto.

## Licenças

Consulte [docs/OPEN-SOURCES.md](docs/OPEN-SOURCES.md) e [assets/manifest.json](assets/manifest.json). Assets remotos permanecem nos seus repositórios de origem; confirme as licenças antes de redistribuir binários offline.


## Estudo do exterior

A geografia narrativa da Brooklyn House, a chegada pelo East River, a Williamsburg Bridge, a doca, a escada e o portal estão documentados em [docs/BROOKLYN-HOUSE-EXTERIOR.md](docs/BROOKLYN-HOUSE-EXTERIOR.md). Manhattan fica do outro lado do rio; não é a localização da casa. A escada metálica contorna o armazém no romance, mas o formato helicoidal exato adotado no jogo é uma interpretação.


## Quarto de Carter

A suíte de Carter, os móveis asset-first, a kitchenette, o banheiro, o deck e o apoio de cabeça egípcio estão documentados em [docs/CARTER-BEDROOM-STUDY.md](docs/CARTER-BEDROOM-STUDY.md). A cena é compartilhada entre desktop e mobile; os GLBs CC0 são carregados de fontes versionadas e mantêm fallbacks locais.
