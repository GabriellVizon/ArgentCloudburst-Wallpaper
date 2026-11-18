import { useEffect, useRef } from "react"
import { CITY_SCENE, CITY_RENDERING } from "./city-config"
import { CITY_RENDER_LAYERS, renderCityLayer, type CityLayerId } from "./CityLayers"

type CityEnvironmentProps = {
    onFailure?: () => void
}

type RenderLayer = {
    id: CityLayerId
    canvas: HTMLCanvasElement
}

export default function CityEnvironment({ onFailure }: CityEnvironmentProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const onFailureRef = useRef(onFailure)
    onFailureRef.current = onFailure

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d", { alpha: false })
        if (!context) {
            onFailureRef.current?.()
            return
        }

        let pixelRatio = 1
        let layers: RenderLayer[] = []

        const releaseLayers = (items: RenderLayer[]) => {
            for (const layer of items) {
                layer.canvas.width = 0
                layer.canvas.height = 0
            }
        }

        const renderScene = () => {
            const nextPixelRatio = Math.min(
                CITY_RENDERING.pixelRatioCap,
                Math.max(1, window.devicePixelRatio || 1),
            )

            const nextLayers: RenderLayer[] = []

            for (const layer of CITY_RENDER_LAYERS) {
                const surface = document.createElement("canvas")
                surface.width = CITY_SCENE.width * nextPixelRatio
                surface.height = CITY_SCENE.height * nextPixelRatio

                const surfaceContext = surface.getContext("2d")
                if (!surfaceContext) {
                    releaseLayers(nextLayers)
                    surface.width = 0
                    surface.height = 0
                    onFailureRef.current?.()
                    return false
                }

                surfaceContext.setTransform(nextPixelRatio, 0, 0, nextPixelRatio, 0, 0)
                surfaceContext.imageSmoothingEnabled = false
                renderCityLayer(surfaceContext, layer.id)

                nextLayers.push({ id: layer.id, canvas: surface })
            }

            pixelRatio = nextPixelRatio
            canvas.width = CITY_SCENE.width * pixelRatio
            canvas.height = CITY_SCENE.height * pixelRatio

            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
            context.imageSmoothingEnabled = false
            context.clearRect(0, 0, CITY_SCENE.width, CITY_SCENE.height)

            for (const layer of nextLayers) {
                context.drawImage(
                    layer.canvas,
                    0,
                    0,
                    CITY_SCENE.width,
                    CITY_SCENE.height,
                )
            }

            releaseLayers(layers)
            layers = nextLayers
            return true
        }

        const handleResize = () => {
            const nextPixelRatio = Math.min(
                CITY_RENDERING.pixelRatioCap,
                Math.max(1, window.devicePixelRatio || 1),
            )

            if (nextPixelRatio !== pixelRatio) renderScene()
        }

        if (!renderScene()) return

        window.addEventListener("resize", handleResize, { passive: true })

        return () => {
            window.removeEventListener("resize", handleResize)
            releaseLayers(layers)
            canvas.width = 0
            canvas.height = 0
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="city-map__canvas"
            width={CITY_SCENE.width}
            height={CITY_SCENE.height}
            role="img"
            aria-label="Mapa estático em pixel art de uma metrópole cyberpunk com cinco distritos, avenidas, pontes e profundidade atmosférica."
        />
    )
}
