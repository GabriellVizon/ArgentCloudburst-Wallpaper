# City Map — Tiled Prototype

Este workspace e uma area de experimentacao visual. Ele **nao substitui** o mapa que esta em producao e nao altera a Hero.

## Abrir

1. Instale o [Tiled Map Editor](https://www.mapeditor.org/).
2. Abra `ArgentCloudburst-City.tiled-project`.
3. Abra `maps/MetroBlockout.tmj`.
4. A camada `00 - Referencia visual` carrega a imagem existente em `public/assets/neon-cyberpunk-city-map.png`. Mantenha essa camada como referencia e evite move-la.
5. Use as camadas de objetos para desenhar e revisar a geometria por cima da referencia.

## Decisoes iniciais

- Coordenadas de trabalho: **1648 × 928**, alinhadas ao `viewBox` usado atualmente pelos hotspots de `CityMap.tsx`.
- Grade: **16 × 16 px**, apenas como guia de alinhamento.
- Orientacao inicial do Tiled: **Orthogonal**. Isso nao determina a perspectiva artistica final; foi escolhido para manter os objetos em coordenadas de pixel diretas enquanto fazemos o trace da referencia.
- A perspectiva final (panoramica/obliqua ou isometrica) so sera fechada depois de um primeiro bloco visual aprovado.
- Nenhuma dependencia de renderizacao foi adicionada nesta etapa.

## Camadas

| Camada | Para que serve |
| --- | --- |
| `00 - Referencia visual` | Imagem existente usada como guia. |
| `01 - Eixos viarios` | Polylines para eixo da avenida, conexoes e caminhos da ponte. |
| `02 - Superficies de ruas e calcadas` | Polygons para contorno real das vias, calcadas e cruzamentos. |
| `03 - Canal, margens e travessias` | Polygons para agua, margens, ponte e encontros com as vias. |
| `04 - Quadras e volumes` | Footprints e volumes gerais dos blocos urbanos. |
| `05 - Marcos visuais e elementos urbanos` | Posicionamento de edificios de destaque, torres, placas e props. |
| `06 - Distritos e hotspots` | Areas dos cinco distritos e alvos de navegacao. |

## Primeiro bloco a validar

Nao vamos desenhar a metropole inteira de uma vez. O primeiro recorte deve conter:

1. Um trecho da avenida principal.
2. Duas conexoes secundarias.
3. Um cruzamento com geometria clara.
4. O canal e uma ponte, incluindo as duas aproximacoes.
5. Dois ou tres blocos de edificios em volta das vias.
6. Uma area de distrito e seu hotspot, para confirmar que a navegacao pode ficar alinhada ao desenho.

## Criterio para avancar

O bloco so segue para o renderizador quando a composicao estiver visualmente correta: continuidade das vias, cruzamento sem emendas, ponte ligada as aproximacoes, quadras sem invadir as ruas e edificios com escala/perspectiva coerentes com a referencia.

Depois disso faremos um spike isolado com **PixiJS + pixi-tiledmap** dentro do React. A Hero, os hotspots existentes e o mapa atual permanecem preservados ate a nova cena passar pela validacao visual e pelo build local.
