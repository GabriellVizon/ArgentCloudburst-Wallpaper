# City Map — Tiled Workspace

O mapa de produção permanece intacto. Esta pasta contém a construção visual da cidade no Tiled.

## Abrir o Distrito Tecnológico

1. Abra `ArgentCloudburst-City.tiled-project` no Tiled.
2. Abra `maps/TechnologyDistrict.tmj`.
3. O tileset `TechnologyDistrict` usa sprites SVG separados em `tiles/`.
4. Ative/desative as camadas para estudar o piso, a malha viária, os edifícios e a navegação.

## Perspectiva e organização

- Projeção do mapa: Orthogonal como plano de edição; os sprites usam volumes e fachadas em perspectiva oblíqua/2.5D.
- Grade: 32 × 32 px.
- Mapa de trabalho: 1024 × 768 px.
- Os edifícios são objetos de tile independentes, ancorados pela base, para permitir reposicionamento sem redesenhar a arte.
- A malha viária fica na camada de piso; os edifícios e elementos de rua são camadas separadas.
- O primeiro recorte não inclui canal. A infraestrutura hídrica só será adicionada quando a posição e a relação com as quadras estiverem definidas, evitando atravessar visualmente os edifícios.

## Camadas

1. Piso e malha viária
2. Edifícios 2.5D
3. Praças, travessias e mobiliário
4. Identidade e navegação

## Próxima etapa

Validar no Tiled a leitura dos quarteirões, a escala dos prédios e a continuidade das vias. Depois, desenhar mais variações de edifícios, calçadas, iluminação e vegetação antes de integrar ao renderizador do portfólio.
