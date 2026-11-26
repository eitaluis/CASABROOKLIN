# Modelos 3D

## Personagem de exploração

O protótipo carrega em runtime o arquivo `human_mix_propio.glb` do projeto **three-procedural-locomotion**:

- Arquivo: [human_mix_propio.glb](https://github.com/PabloMesquida/three-procedural-locomotion/blob/v0.9.0/modelos/human_mix_propio.glb)
- Origem da malha: Human Base Meshes, Blender Studio (CC0, conforme a documentação do projeto de locomoção).
- Rig: esqueleto de nomenclatura compatível com Mixamo, preparado pelo autor do projeto de locomoção.
- Uso neste projeto: personagem jogável em terceira pessoa, com roupa e acessórios adicionados proceduralmente aos ossos.

O GLB é servido pelo CDN do jsDelivr para evitar duplicação do binário no repositório. O código possui um boneco articulado de contingência caso o arquivo remoto não carregue.

Antes de redistribuir o GLB em um pacote offline, confira novamente a licença e os avisos da versão utilizada.
