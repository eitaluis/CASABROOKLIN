# Alternativas de personagem para Carter Kane

Status: pesquisa de alternativas; **o modelo atual não foi substituído**. A escolha final é do usuário.

## Critérios

- Aparência de adolescente/jovem adulto, sem aspecto de guerreiro adulto genérico.
- Estilo de videogame com proporções críveis, rosto expressivo e cabelo crespo escuro.
- Figurino contemporâneo de Carter, preservando camisa azul, calça cáqui e bolsa até nova decisão.
- Rig humanoide, dedos e mão direita disponíveis para cajado e khopesh.
- Idle, walk, run, frenagem, giro, salto e ataque com transições orgânicas.
- GLB/glTF, texturas locais e desempenho mobile/desktop.
- Licença verificada por modelo, roupa, cabelo e textura.

## A — CharacterCreator (kblood): semi-realista, muito personalizável

- Repositório: https://github.com/kblood/CharacterCreator
- Viewer: https://dionysus.dk/webxr/charactercreator/
- Código GPL-3.0-or-later; GLBs/arquivos gerados somente de fontes CC0 e dados próprios são CC0-1.0. Conferir cada asset de saída.
- Sliders corporais (altura, peso, musculatura, proporções e idade), 13 sliders faciais, cor de pele/íris, oito cabelos incluindo afro e roupas modulares.
- Animações procedurais: variações de idle, walk, run, andar para trás, strafe e jump/fall/land, com IK dos pés.
- Exporta GLB com morphs e rig.
- Ponto de atenção: projeto relativamente recente e pequeno na consulta de 26/11/2026; roupas ainda descritas como protótipo e retarget Mixamo/KayKit ainda planejado. Excelente para avaliar personalização, mas requer teste antes de adotar como base de produção.

## B — MPFB 2 / MakeHuman Community: controle facial e corporal mais profundo

- Add-on: https://extensions.blender.org/add-ons/mpfb/
- Repositório: https://github.com/makehumancommunity/mpfb2
- Documentação: https://static.makehumancommunity.org/mpfb.html
- Código GPL-3.0; assets centrais do sistema MakeHuman CC0-1.0. A comunidade declara que os modelos exportados construídos apenas com os assets CC0 e criação própria podem ser usados sem restrições de copyright.
- Modelagem paramétrica de corpo e rosto, assimetria, cabelo, roupas, materiais, rigging Rigify e exportação.
- Versão consultada: MPFB 2.0.18 (10/10/2026), compatível com Blender 4.2 LTS ou superior.
- Ponto forte: maior liberdade para controlar idade aparente, formato do rosto, nariz, mandíbula, proporções e cabelo. Exige Blender e exportação do GLB.

## C — Quaternius Universal Base Characters: estilizado e leve

- Página: https://quaternius.com/packs/universalbasecharacters.html
- Seis bases game-ready, com proporções Teen, Regular e Superhero para modelos masculinos e femininos.
- Vinte cabelos, rig humanoide e modelos FBX/glTF; média anunciada de ~13 mil triângulos.
- CC0-1.0. A página informa que 60–70% do pack é gratuito; alguns arquivos-fonte e shaders ficam na versão Source.
- Ponto forte: leve e pronto para jogo. Menos liberdade facial/corporal que MPFB ou CharacterCreator.

## Ferramenta complementar de navegador — Ducz Character Creator

- Demo: https://luanducate.github.io/Ducz.CharacterCreator/
- Repositório: https://github.com/LuanDucate/Ducz.CharacterCreator
- Mistura partes de 21 outfits Quaternius, recolore materiais, pré-visualiza 24 animações e exporta GLB rigged.
- Os modelos Quaternius creditados são CC0. **O repositório do builder não apresenta licença explícita na raiz consultada**, portanto não será tratado como código open source confirmado nem copiado para produção sem autorização/licença do autor.
- É útil para testar visualmente combinações modulares rapidamente.

## Recomendação

1. Avaliar A primeiro para um Carter semi-realista, expressivo e com sliders.
2. Comparar com B se quisermos controle mais minucioso de rosto, idade e proporções.
3. Usar C como alternativa estilizada e de baixo custo gráfico.

A direção visual proposta para Carter é jovem, pele castanha escura, cabelo crespo curto, rosto expressivo e roupa de aventura contemporânea. A aparência final só será definida depois da escolha.

## Decisões pendentes

- Escolher A, B ou C como base.
- Escolher o nível de estilização: semi-realista, cinematográfico estilizado ou low-poly.
- Aprovar rosto, cabelo e figurino antes de substituir o modelo atual.
- Testar idle, walk, run e encaixe de arma antes de integrar.
