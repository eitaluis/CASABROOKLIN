# Modelos 3D

## Personagem jogável — Carter Kane estilizado

O personagem atual é uma malha 3D original, construída localmente em `src/character.js` com superfícies elípticas contínuas, volumes orgânicos e um rig hierárquico próprio. Não usa o antigo GLB remoto nem o boneco de contingência anterior.

Direção visual:
- adolescente negro, proporções juvenis e silhueta natural;
- rosto com mandíbula, bochechas, olhos, nariz, boca e orelhas modelados;
- cabelo crespo com mechas arredondadas;
- camisa azul com gola, vista frontal, botões e costuras;
- calça cáqui com costura e bolso lateral;
- tênis escuros e bolsa transversal de couro.

A geometria é original do projeto. As referências de produção e montagem são:
- [Grab3D Character Mixer](https://grab3d.com/tools/character-mixer/) — ferramenta aberta de criação de personagens modulares, estilos Cozy/Low Poly, corpo slim e exportação GLB rigged; criações CC0 1.0. É uma fonte de referência e uma opção de asset modular futuro, não um binário carregado pelo jogo.
- [Grab3D Teenager](https://grab3d.com/models/characters/teen-character/) — personagem adolescente CC0 com versões GLB estática e rigged; possui ciclos de walk/run. Referência para proporção e pipeline de personagem de jogo, não usado diretamente no runtime.
- [giaBaoJS/procedural-3d-characters](https://github.com/giaBaoJS/procedural-3d-characters) — referência MIT para personagens com geometria, rig e keyframes gerados em código.

## Otimização

O personagem é gerado com malhas locais e materiais compartilhados. Isso evita download de GLB externo, reduz dependência de CDN e mantém o mesmo modelo em desktop e mobile.
