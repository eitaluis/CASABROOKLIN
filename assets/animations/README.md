# Animações e locomoção

## Carter — runtime atual

As animações são controladas pelo módulo compartilhado src/character.js e pela velocidade real de src/third-person.js. Desktop e mobile usam os mesmos clips, estados e parâmetros; somente a entrada muda (teclado/mouse ou joystick/toque).

### Locomoção

- **Idle:** respiração, pequenos movimentos de cabeça e transferência de peso.
- **Walk:** passada natural, flexão dos joelhos e braços em oposição.
- **Run:** passada mais ampla, com inclinação frontal moderada.
- **Jump:** jump_start, jump_air e jump_land em sequência, com transição suave.

A velocidade de locomoção é enviada ao blending do Ara a cada frame. Caminhada usa alvo de 1,5 m/s; corrida usa 4,2 m/s. A aceleração, desaceleração, rotação do corpo e câmera receberam uma resposta mais suave para a direção cinematográfica.

### Ações cinematográficas

src/character.js lê o catálogo ANIMATIONS e só carrega os IDs existentes entre os candidatos:

- **look_around:** olhar ao redor; ação de fundo em loop.
- **talk_gestures:** gesticular enquanto fala; loop.
- **wave:** aceno de mão.
- **point:** apontar.
- **bow:** inclinar-se/cumprimentar.

O preview independente oferece botões para estas ações. Se um clip não estiver presente na versão publicada do catálogo, o botão correspondente é desativado. A locomoção retorna ao terminar uma ação de uma só execução ou ao pressionar RETOMAR.

### Movimento secundário dos acessórios

A bolsa transversal no quadril direito e o medalhão têm pivôs próprios no módulo src/character-accessories.js. O balanço é discreto e proporcional à velocidade; os acessórios são descartados junto com o personagem.

## Fonte e API

- Ara 3D Gen — https://ara3dgen.com/docs/animations/
- API JavaScript — https://ara3dgen.com/docs/library/
- O runtime consulta ANIMATIONS antes de pedir clips. O blending idle/walk/run, o mixer e hero.update(delta) seguem a API oficial.

## QA pendente

- Confirmar que os IDs de cada ação aparecem na versão carregada e que os botões funcionam.
- Verificar as transições idle/walk/run/salto.
- Verificar contato dos pés e ausência de deslizamento em curvas.
- Observar a bolsa no quadril direito durante caminhada, corrida, mudança de direção e salto.
- Conferir o medalhão e a alça sem clipping no pescoço, ombro e tronco.
- Testar Chrome desktop e celular em modo paisagem.
- Marcar como aprovado somente depois de inspeção no navegador real.