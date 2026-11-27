# Carter Kane — animações, acessórios e locomoção

## Runtime compartilhado

Os mesmos estados, clipes, rig, física e acessórios são usados em desktop e mobile. Somente a camada de entrada difere: teclado/mouse no desktop e joystick/botões de toque no celular.

## Pack Ara: corrida, salto e combate

O pack publicado em `assets/animations/carter-movement.ara-pack.json` é carregado pelo Ara 3D através de `packs`. Ele contém seis clipes retargetados para o rig humano do Ara:

| Estado / entrada | Clip Ara | Duração | Comportamento |
|---|---|---:|---|
| Sprint sem objeto | `carter-moves/sprint_loop` | 0,67 s | Loop |
| Sprint com cajado/khopesh | `carter-moves/sprint_shield_loop` | 0,67 s | Loop |
| Salto | `carter-moves/ninjajump_double` | 0,90 s | Uma execução; segura a pose até o contato físico |
| Aterrissagem | `carter-moves/jump_land` | 1,27 s | Começa quando o controlador detecta o chão |
| Ataque sem arma | `carter-moves/melee_combo` | 2,27 s | Combo completo, sem interrupção por movimento |
| Ataque com arma | `carter-moves/sword_heavy_combo` | 4,33 s | Combo pesado para cajado ou khopesh |

A tecla **F** executa o combo desarmado quando Carter está com as mãos livres e o combo pesado quando cajado ou khopesh estão equipados. O botão **ATACAR** do mobile e o controle **ATACAR · F** do inventário usam exatamente a mesma função. O sprint equipado troca para o clipe com escudo; sem objeto, usa o sprint livre.

O salto mantém o impulso e a gravidade existentes em `src/third-person.js`. A animação não desloca o root; o clipe de aterrissagem só é iniciado quando a física reporta contato com a superfície. O tempo de voo, portanto, continua pertencendo ao controlador e não a uma sequência rígida de temporizadores.

## Pack reproduzível e proveniência

- Fonte dos seis GLBs: KinemIQ, coleção pública de animações: https://kinemiq.app/animations/
- Créditos e licenças declarados pela plataforma: https://kinemiq.app/sources/
- Pack Ara: `assets/animations/carter-movement.ara-pack.json`
- Créditos por arquivo e URL de origem: `assets/animations/carter-movement-source-credits.json`
- Gerador: `scripts/build-carter-motion-pack.mjs`
- Automação de download, conversão, validação e publicação: `.github/workflows/build-carter-motion-pack.yml`

As fontes do catálogo incluem Quaternius UAL/UAL2 (CC0-1.0), Open Motion Project/ACCAD (CC BY 3.0) e The 100STYLE Dataset (CC BY 4.0). O conjunto é declarado como licenças mistas; os créditos do KinemIQ devem acompanhar qualquer redistribuição. Não tratar todos os clipes como CC0.

## Bolsa e colar

- **Bolsa:** o corpo real do Innerscene Crossbody Bag foi baixado e versionado em `assets/models/carter/innerscene-crossbody-bag.glb`. A página declara CC0. O GLB separa `Crossbody body`, `Front flap`, `Shoulder strap` e `Stitching, lock and rings`. O runtime oculta somente `Shoulder strap`, gira o modelo Z-up para Y-up, aplica escala 0,88 e centraliza o corpo no encaixe do quadril posterior/lateral direito.
- **Alça:** é uma fita própria, projetada sobre a superfície skinned da camisa e dividida entre os ossos do peito e quadril. Ela substitui a alça caída do GLB; não há uma mochila adicionada ao Carter.
- **Colar:** corrente e medalhão mantêm geometria própria, projetada na superfície da camisa, presos ao pivô do tórax. O medalhão conserva o desenho previamente aprovado.
- **Fallback:** se o GLB remoto não carregar, o modelo procedural compacto continua visível; não deixa o personagem sem bolsa.

A implementação está em `src/character-accessories.js`. O mesmo módulo é chamado pelo runtime principal e pelo preview independente.

## Preview e QA

- Preview isolado: `character-preview.html`; inclui teste de sprint, salto, ações e ataque com/sem item equipado.
- Verificações automatizadas concluídas: seis GLBs baixados, retargetados e validados por `ara3d pack check`; origem do GLB Innerscene inspecionada e asset salvo no repositório.
- **QA visual final ainda pendente:** abrir o jogo em navegador desktop e em celular paisagem; confirmar alinhamento do corpo da bolsa, contato da corrente/medalhão e pegada da arma durante os seis clipes. Não marcar encaixe visual como aprovado apenas com a validação dos arquivos.

## Referências técnicas

- Ara content packs: https://ara3dgen.com/docs/packs/
- KinemIQ sources & credits: https://kinemiq.app/sources/
- Innerscene Crossbody Bag: https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2
