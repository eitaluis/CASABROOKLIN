# Carter Kane — estudo de corrida, salto e locomoção

Data da pesquisa: 27/11/2026  
Status: **pesquisado e documentado; ainda não integrado ao runtime.** A prioridade imediata permanece validar visualmente a correção da bolsa e do medalhão. Depois disso, revisar corrida e salto sem alterar a base humana/rig Ara.

## 1. Cânone, referência visual e interpretação

### Canônico textual
- Carter é um dos protagonistas de *The Kane Chronicles*, segue o caminho de Hórus e utiliza magia e armamento durante os confrontos. Fonte oficial do autor: https://rickriordan.com/character/carter-kane/
- O romance contém cenas de perseguição, corrida, saltos e combate com espada; a descrição textual não estabelece uma corrida de braços estendidos para trás como padrão de Carter.
- Portanto, postura inspirada na Naruto Run é **interpretação de gameplay solicitada pelo usuário**, não um movimento canônico dos livros.

### Referência visual externa — Naruto
- Página oficial NARUTO/BORUTO, 06/08/2023: https://naruto-official.com/en/news/01_1479
- A página define a postura conhecida pelos fãs como inclinação do tronco para a frente com os dois braços estendidos para trás. Ela também liga a imagem a uma compilação oficial de cenas de corrida do anime, publicada pelo Studio Pierrot: https://www.youtube.com/watch?v=afLUu0BZ6Dw
- A referência deve orientar silhueta/energia, sem copiar figurino, rosto, símbolos ou identidade visual de Naruto.
- Adaptação desejada para Carter: corrida baixa, tronco inclinado, joelhos flexionados, cabeça estável e uma mão segurando o cajado/khopesh atrás do corpo, com a arma apontada para trás. O braço livre atua como contrapeso, evitando uma pose simétrica artificial.

### Nota biomecânica obtida na fonte oficial de Naruto

A mesma matéria oficial descreve um teste real com um corredor profissional: erguer demais os braços prejudicou a estabilidade dos ombros; uma posição mais baixa permitiu maior uso do core, e a versão revisada encontrou melhor equilíbrio com os braços aproximadamente a 30° em relação ao corpo. A matéria também observa maior frequência de passadas/apoio, mas perda de parte da propulsão dos braços.

Aplicação ao Carter: não fixar os dois braços exatamente horizontais. A arma pode apontar para trás com o braço direito ligeiramente mais baixo e próximo do tronco, enquanto a mão esquerda fica livre como contrapeso. A passada deve ser curta/rápida, com inclinação controlada e sem torção excessiva do tronco. Isso mantém a leitura ninja sem transformar a corrida numa pose rígida ou desequilibrada.

Fonte oficial: https://naruto-official.com/en/news/01_1479

## 2. Candidatos de corrida

### A — KinemIQ: Run - crouched
- Página e preview: https://kinemiq.app/animations/run-crouched/
- Duração: 3,5 s, 107 frames, 30 fps.
- Root motion publicado: 2,1 m para a frente; a página permite exportar em place ou com root motion.
- Formatos: FBX, GLB/glTF, BVH.
- Licença: CC BY 4.0; atribuição ao The 100STYLE Dataset — Ian Mason, Mason, Starke & Komura (2022). A plataforma diz que os exports carregam a atribuição.
- Adequação: melhor ponto de partida para postura baixa e inclinação do tronco. **Não presumir que já tenha os braços estendidos para trás**; inspecionar o preview antes de decidir.

### B — KinemIQ: Run - on toes crouched
- Página e preview: https://kinemiq.app/animations/run-on-toes-crouched/
- Duração: 3,0 s, 90 frames, 30 fps.
- Root motion publicado: 3,9 m para a frente; pode ser exportada in place.
- Formatos: FBX, GLB/glTF, BVH.
- Licença: CC BY 4.0; mesma atribuição ao The 100STYLE Dataset.
- Adequação: alternativa mais leve/agilizada, com passada na ponta dos pés. Comparar contra A para não deixar o Carter excessivamente furtivo ou saltitante.

### C — KinemIQ: Run - sprint with a shield
- Página e preview: https://kinemiq.app/animations/run-sprint-with-a-shield/
- Duração: 0,7 s, 21 frames, 30 fps.
- Root motion publicado: 5,2 m; pode ser exportada in place.
- Formatos: FBX, GLB/glTF, BVH.
- Licença: CC0 1.0; Universal Animation Library 2 by Quaternius.
- Adequação: referência auxiliar para corrida rápida mantendo um objeto defensivo na mão; escudo não é cajado nem khopesh. Inspecionar orientação dos braços antes de aproveitar.

### D — KinemIQ: Run - bent forward
- Página e preview: https://kinemiq.app/animations/run-bent-forward/
- Duração: 2,9 s, 87 frames, 30 fps.
- Root motion publicado: 2,0 m; pode ser exportada in place.
- Licença: CC BY 4.0; The 100STYLE Dataset.
- Adequação: referência de inclinação e aceleração, mas a pose de braços não deve ser assumida como compatível com arma atrás.

### E — KinemIQ: Run - from the fighting stance
- Página e preview: https://kinemiq.app/animations/run-from-the-fighting-stance/
- Duração: 2,5 s, 77 frames, 30 fps.
- Root motion publicado: 5,7 m; pode ser exportada in place.
- Licença: CC BY 3.0; Open Motion Project, ACCAD / The Ohio State University.
- Adequação: alternativa de arranque a partir de postura de combate, não necessariamente um loop de corrida principal.

**Recomendação de pesquisa:** usar A como base principal; comparar B e C como referências de ritmo/apoio e porte de objeto. A corrida final deve ser adaptada para arma na mão direita atrás do corpo. O braço livre deve equilibrar o movimento, e a cabeça deve continuar nivelada. Não integrar nenhuma destas animações sem inspeção visual do preview e aprovação da versão final.

## 3. Candidatos de salto

### Fonte principal — KinemIQ / Universal Animation Library by Quaternius
Página de coleção e licenças: https://kinemiq.app/free-jump-animations/

A coleção lista os clips:
- Jump - take-off: 1,3 s.
- Jump - in the air: 2,5 s (loop).
- Jump - landing: 1,3 s.
- Jump - ninja take-off: 0,9 s.
- Jump - ninja landing: 1,3 s.
- Jump - ninja double: 0,9 s.
- Jump - double: 0,9 s.
- Hit - landing impact: 0,7 s.

Os saltos desta coleção são CC0 (Universal Animation Library by Quaternius), em FBX, GLB/glTF e BVH, para uso comercial sem atribuição. A coleção separa take-off, ar e aterrissagem para que o clip aéreo possa repetir pelo tempo real de voo.

### Alternativa — 3D Valley / Quaternius
- Página: https://3dvalley.com/3d-animations
- A página apresenta 79 animações CC0, incluindo Jump, In the air, Land, Ninja jump, Ninja jump in the air e Ninja jump landing.
- É uma segunda fonte para comparar os movimentos, mas a coleção KinemIQ/Quaternius acima já possui uma divisão clara em fases e formatos úteis para Three.js/Ara.

## 4. Compatibilidade com o rig Ara e Three.js

### Pipeline documentado
- Ara Content Packs: https://ara3dgen.com/docs/packs/
- Ara Animations: https://ara3dgen.com/docs/animations/
- Ara Exporting: https://ara3dgen.com/docs/exporting/
- O Ara retargeta clips de Mixamo, Blender e motion capture para o rig de 65 ossos; aceita FBX, glTF/GLB e BVH, com correções de pose/base. Packs são arquivos .ara-pack.json e podem ser carregados em createCharacter() via opção packs.
- O Ara suporta exportação in-place e root motion. No Projeto Brooklyn, a movimentação horizontal já é controlada por src/third-person.js; os clips escolhidos devem ser exportados/importados **in place**, para evitar deslocamento duplicado.

### Estado atual do projeto
- src/character.js já chama hero.locomotion() com clips idle/walk/run e já expõe um único rig compartilhado.
- src/third-person.js move o personagem no plano XZ e aplica gravidade/velocidade vertical no controlador.
- O salto atual parte de verticalVelocity = 4.6 e gravidade = 9.3 m/s²; isso representa aproximadamente 0,99 s de voo e 1,14 m de altura máxima em condições ideais. As colisões com o piso podem encurtar o arco.
- A animação atual chama jump_start 0.32s, jump_air 0.22s e jump_land em sequência. O ciclo fixo não está sincronizado com o tempo real de voo calculado pelo controlador, contribuindo para a sensação mecânica.

## 5. Plano de implementação após validação dos acessórios

### Corrida baixa com arma atrás
1. Importar o clip de corrida selecionado como um Ara content pack e manter a exportação in-place.
2. Substituir apenas o estado de sprint/corrida rápida; preservar a caminhada normal.
3. Adaptar a pose do braço direito para trás com o objeto equipado preso ao socket WeaponR, mantendo a mão fechada/pegada coerente e o eixo do cajado/khopesh apontado para trás.
4. Ajustar o braço livre como contrapeso, manter cabeça/olhar estáveis e adicionar inclinação de tronco/pelve sem comprometer os pés.
5. Fazer blend suave entre walk → crouch run → idle, sem alterar velocidades de movimento/colisão de desktop e mobile.
6. Testar o mesmo clip com cajado e khopesh, inclusive curvas, obstáculos, ataques, dano e corrida em declive.

### Salto dinâmico
1. Substituir a sequência fixa por take-off, air loop e landing.
2. Iniciar o take-off com antecipação e flexão real dos joelhos/quadril; usar a velocidade horizontal para escolher uma variante de salto correndo quando disponível.
3. Manter o clip no ar em loop até o controlador indicar proximidade do piso/descida; sincronizar a aterrissagem com o contato real.
4. Ao pousar, absorver impacto flexionando tornozelos/joelhos/quadril, inclinar o tronco e recuperar o equilíbrio, sem snapping direto para idle.
5. Preservar momentum horizontal, aplicar limite de altura/colisão e impedir que o root/anim clip dupliquem a posição vertical.
6. Testar saltos parado, correndo, em escadas/desníveis, sobre obstáculos e com objetos nas mãos.

## 6. Aprovação e status

- Pesquisa textual/canônica: concluída; Naruto Run identificada como interpretação de gameplay, não como movimento canônico de Carter.
- Referência visual oficial: localizada.
- Assets candidatos e licenças: pesquisados e documentados.
- Compatibilidade com Ara: confirmada na documentação oficial.
- Download/importação dos clips: **não realizada**.
- Modificação do movimento: **não realizada**.
- Aprovação visual do movimento final: **pendente**.
- Ordem do projeto: terminar e validar bolsa/medalhão primeiro; depois apresentar o preview comparativo de corrida e salto e só então integrar os clips aprovados.

## 7. Checklist de QA
- Desktop e mobile usam o mesmo rig, clips, objetos e gameplay; só controles/UI podem diferir.
- Conferir frontal, lateral, traseira e 3/4.
- Sem pés escorregando, atravessando o piso ou pairando.
- Sem weapon drift: a mão permanece no grip e a arma não atravessa coxa, torso ou chão.
- Sem cotovelos quebrados, braços atravessando a roupa ou cabeça balançando excessivamente.
- Sem root motion duplicado.
- Blend em transições sem estalo ou pose congelada.
- Salto com antecipação, arco contínuo e aterrissagem absorvida.
- Testar FPS e estabilidade no celular em paisagem.
