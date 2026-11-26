# Personagem explorador em terceira pessoa

## Identidade
O protótipo usa um avatar genérico de exploração, não uma representação definitiva de Carter ou Sadie. A identidade e o figurino podem ser substituídos depois sem alterar a câmera ou a lógica de movimento.

## Modelo
- GLB humanoide de malha base Blender Studio Human Base Meshes (CC0, conforme os avisos da fonte).
- Rig humano com nomes Mixamo compatíveis, preparado pela fonte de locomoção.
- Escala alvo aproximada: 1,78 m.
- Roupa, mochila, sapatos, cabelo e amuleto adicionados proceduralmente a partir dos ossos.

## Movimento
Prioridade para locomoção procedural:
- controle de velocidade contínuo;
- aceleração e desaceleração;
- curva e antecipação corporal;
- passada e balanço alternados;
- contato e rolagem dos pés;
- colocação em escadas e terreno irregular.

A base utilizada é documentada em [OPEN-SOURCES.md](./OPEN-SOURCES.md).

## Câmera
- câmera de perseguição em terceira pessoa;
- rotação por mouse com Pointer Lock;
- zoom por roda do mouse;
- arrasto por toque em dispositivos móveis;
- câmera interpolada para reduzir tremores.

## Fallback
Se o GLB remoto não carregar, um personagem articulado local é gerado com geometria básica. Se o GLB carregar e a biblioteca externa de locomoção não estiver disponível, o rig recebe animação procedimental local simplificada. O HUD informa qual modo está ativo.
