# Carter Kane — direção visual e base de produção

Status: **a direção visual C e a bolsa no quadril direito estão aprovadas. O personagem foi revertido para a base humana Ara que o usuário considerou mais interessante; o acabamento e os encaixes aguardam teste visual.**

## 1. Brief aprovado
- C — Game 3D gráfico: personagem claramente 3D, com acabamento de videogame, playful e formas legíveis.
- Rosto humano natural. Não usar rosto anime, proporções chibi ou olhos exagerados.
- Corpo jovem, atlético e móvel; inspiração Naruto limitada à pose e à mecânica corporal da corrida/salto.
- Pele negra, cabelo crespo curto, camisa azul, calça cargo cáqui e tênis escuros.
- Bolsa transversal conhaque no quadril direito, com alça diagonal sobre o peito.
- Mesma malha, rig, acessórios e animações no desktop e mobile.

## 2. Decisão técnica atual
A versão procedural feita de cápsulas, esferas e caixas foi rejeitada pelo usuário após inspeção. Ela não deve ser reutilizada nem refinada como base.

A base de produção voltou a ser a personagem humana gerada pelo Ara 3D Gen, já utilizada antes da tentativa procedural. Essa base possui uma malha humana contínua com rig e skin weights, preservando a silhueta mais natural que o usuário preferiu.

Configuração no arquivo `src/character.js`:
- Identidade/rosto/cabelo: valores do Carter anterior.
- Top: `uniform_shirt`, azul.
- Bottom: `cargo_pants`, cáqui.
- Shoes: `sneakers`, azul escuro.
- Carry: `none`, para não gerar mochila por baixo/por cima da bolsa aprovada.
- Rig: game, com socket `WeaponR`.
- Clips: idle, walk, run e sequência jump_start/jump_air/jump_land.

## 3. Bolsa
Referência visual: Innerscene Crossbody Bag, CC0:
https://www.innerscene.com/tools/library/3d-parts/crossbody-bag-42a4ebf2

O GLB original não foi incorporado. O arquivo atual cria corpo, aba, fole lateral, fecho, ferragens e alça plana ajustada ao rig/escala do Carter. A bolsa fica no quadril direito. A geometria é local e inspirada na peça aprovada; não é o modelo original da Innerscene.

## 4. Movimento
- Locomoção nativa Ara mistura idle, walk e run pela velocidade.
- Sprint mantém lean frontal e banking no pivô de terceira pessoa.
- Saltos usam a sequência de início, fase aérea e aterrissagem.
- A bolsa recebe balanço sutil separado do clip humano.
- A direção Naruto refere-se ao gesto corporal de corrida atlética, não ao desenho do rosto.

## 5. Próxima validação
- [ ] Conferir o novo preview em navegador real.
- [ ] Comparar com o antigo Carter (modelo que precedeu a substituição procedural).
- [ ] Verificar camisa/calça e proporções.
- [ ] Ajustar alça e bolsa no quadril direito.
- [ ] Observar clipping na corrida, salto e curva.
- [ ] Testar armas no socket WeaponR.
- [ ] Confirmar desktop e mobile paisagem.
