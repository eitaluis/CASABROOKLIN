# HUD mobile em retrato — Brooklyn House

## Status
- Direção visual aprovada: HUD híbrido, densidade mínima, acabamento egípcio.
- Implementação integrada na branch `main`.
- Revisão visual em aparelho real: pendente.
- Testes em Safari/iPhone: pendentes.

## Decisão de design
O HUD mobile usa orientação retrato. O desktop mantém a composição em paisagem. A cena 3D, Carter, ambientes, inventário, magias e lógica de jogo permanecem compartilhados; apenas a apresentação e os métodos de entrada mudam por dispositivo.

A identidade visual usa ouro envelhecido, turquesa e carvão, com símbolos egípcios pontuais. Não foram adicionados assets externos nem dependências visuais.

## Canon e interpretação
- **Canônico textual:** os romances de *As Crônicas dos Kane* descrevem personagens, objetos, ambientes e práticas mágicas; não estabelecem um HUD de videogame ou um esquema de controles mobile.
- **Interpretação de produção:** toda a interface, disposição dos controles, indicadores e ícones é uma solução original de produto para esta adaptação interativa. Os motivos egípcios são linguagem visual de interface, não alegações de que exista um HUD oficial/canônico.
- **Assets:** nenhum asset 3D, textura, animação ou fonte adicional foi integrado nesta mudança. A tipografia e os símbolos já presentes no projeto foram reaproveitados.

## Comportamento mobile
- Retrato como composição principal no celular; não é exibido aviso obrigatório para girar o aparelho.
- Câmera com enquadramento vertical e distância maior para acomodar a proporção.
- Joystick analógico no canto inferior esquerdo.
- Intensidade do joystick controla a velocidade; empurrar para frente além da faixa intermediária acelera progressivamente até a corrida.
- Não há botão separado de corrida no HUD mobile.
- Arraste no lado direito continua controlando a câmera, inclusive durante o deslocamento, sujeito à área ocupada por botões.
- Ações de salto, ataque, interação, Avatar de Hórus, inventário e HA-DI permanecem acessíveis; interação e HA-DI podem aparecer contextualmente.
- Lista de ambientes e minimapa são recolhidos e abertos pelos atalhos discretos no topo.
- Áreas seguras do iPhone são respeitadas com `env(safe-area-inset-*)`.

## Desktop
- Mantém a orientação paisagem, navegação por WASD, câmera pelo mouse e corrida com Shift.
- A cena, os assets, as salas e os sistemas de gameplay são compartilhados com o mobile.

## Arquivos alterados
- `index.html`: estrutura e estilos responsivos para retrato, botões de menu/mapa e remoção do aviso que exigia paisagem.
- `src/main.js`: controles dos painéis recolhíveis, visibilidade contextual do botão de interação, campo de visão adaptado e posicionamento do HUD de vida/energia.
- `src/third-person.js`: velocidade analógica progressiva, distância de câmera adaptada à orientação e preservação da restrição de corrida quando Carter está ferido.

## QA pendente
Validar em Safari no iPhone:
1. A tela inicial aparece corretamente em retrato.
2. Ao entrar, a cena inicia sem reinício ou erro.
3. Carter permanece enquadrado em doca, Grande Salão, Biblioteca, Quarto e Sala de Treinamento.
4. É possível mover com o polegar esquerdo e girar a câmera simultaneamente com o direito.
5. A corrida aumenta progressivamente e não exige botão separado.
6. Menu de ambientes, mapa, inventário, salto, ataque, interação e magias continuam acessíveis.
7. Confirmar que desktop permanece visual e funcionalmente inalterado.
