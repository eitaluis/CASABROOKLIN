# Carter Kane — modelo, movimento e refinamento

Status: **base Ara 3D Gen aprovada preservada; refinamento técnico autorizado e em andamento. A identidade visual não foi redesenhada.**

## Base ativa

- `src/character.js` carrega o Carter aprovado por meio do share salvo do Ara 3D Gen.
- Não substituir a malha humana, o rosto, o cabelo ou as proporções por modelos procedurais, Quaternius ou placeholders.
- Clips solicitados ao Ara: `idle`, `walk`, `run`, `jump_start`, `jump_air`, `jump_land`.
- Um `CarterMovementRoot` independente controla orientação e navegação sem disputar a rotação interna do rig.
- O controlador de terceira pessoa e o módulo do personagem são compartilhados entre desktop e mobile.
- O inventário tenta usar o socket de equipamento do rig; confirmar a presença e a orientação do osso no preview antes de considerar o encaixe aprovado.
- A fonte atual do personagem **não cria bolsa transversal**. Houve uma implementação procedural local em uma etapa anterior, mas ela não faz parte do runtime Ara restaurado. Não declarar a bolsa integrada até nova implementação e inspeção visual.

## Decisões visuais preservadas

- Carter adolescente negro, cabelo crespo curto e olhos castanhos.
- Camisa azul, calça cargo cáqui e tênis escuros conforme a direção aprovada no Ara.
- Aparência 3D de videogame com base humana contínua; evitar chibi, anime facial e realismo de escaneamento.
- Manter o modelo Ara aprovado como referência de identidade. Melhorias futuras devem ser graduais e reversíveis.

## Refinamento técnico aplicado

- Proteção contra chamadas de animação depois do descarte do personagem.
- Listener do evento `finished` removido ao terminar ou descartar o salto.
- Sequência de salto interrompida com segurança durante o descarte.
- Mixer parado e pivô removido da cena no `dispose()`.
- Altura aproximada do modelo exposta no estado para futuras calibrações de câmera e colisão.
- Preview independente mostra mensagem explícita quando o carregamento do Ara falha, em vez de permanecer indefinidamente no estado de loading.

## Não considerar concluído sem teste real

- Rosto, cabelo, expressão, proporção corporal e leitura do figurino.
- Escala do Carter em relação às portas, móveis, corrimãos e objetos da Brooklyn House.
- Orientação e escala de cajado/khopesh no socket `WeaponR`.
- Clipping nas articulações durante idle, walk, run e salto.
- Estabilidade de animações, câmera e controles em desktop e mobile paisagem.
- Desempenho, carregamento e descarte sem vazamento de objetos Three.js.

## Próximas etapas

1. Abrir o [preview independente](../character-preview.html) e validar frente, perfil, costas e animações.
2. Comparar o Carter com a referência visual aprovada antes de alterar materiais ou proporções.
3. Calibrar escala e hitbox usando a altura real retornada pelo Ara, sem alterar a malha.
4. Verificar socket e armas no rig.
5. Só depois propor refinamentos visuais reversíveis (materiais, pequenos acessórios e bolsa), preservando o modelo-base.

## Regra de produção

O preview deve importar o mesmo `src/character.js` do jogo. Toda mudança no módulo compartilhado vale para desktop e mobile. Diferenças são permitidas apenas na interface e nos controles específicos de cada dispositivo. Marcar como **testado** somente após inspeção real no navegador.
