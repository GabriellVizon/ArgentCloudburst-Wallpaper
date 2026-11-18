# City map artwork

Place the approved panoramic map artwork in this folder with this exact filename:

`neon-cyberpunk-city-map.png`

The React map component loads it from:

`/assets/neon-cyberpunk-city-map.png`

The image is intentionally kept separate from the React controls. The map artwork currently contains decorative labels and navigation artwork; transparent accessible links are positioned over those areas on desktop, while mobile uses a real navigation list beneath the image. This makes it possible to replace the artwork later without rewriting the navigation.
