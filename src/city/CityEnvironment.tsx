import { useEffect, useRef } from "react"
import { CITY_SCENE } from "./city-config"
import { renderCityScene } from "./CityLayers"

type CityEnvironmentProps = {
    onFailure?: () => void
}

export default function CityEnvironment({ onFailure }: CityEnvironmentProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d", { alpha: false })
        if (!context) {
            onFailure?.()
            return
        }

        const pixelRatio = Math.min(2, Math.max(1, window.devicePixelRatio || 1))
        canvas.width = CITY_SCENE.width * pixelRatio
        canvas.height = CITY_SCENE.height * pixelRatio

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        context.imageSmoothingEnabled = false
        renderCityScene(context)

        return () => {
            context.clearRect(0, 0, CITY_SCENE.width, CITY_SCENE.height)
        }
    }, [onFailure])

    return (
        <canvas
            ref={canvasRef}
            className="city-map__canvas"
            width={CITY_SCENE.width}
            height={CITY_SCENE.height}
            role="img"
            aria-label="Metrópole cyberpunk em pixel art, com cinco distritos, avenidas elevadas, edifícios iluminados, praça central e canal urbano."
        />
    )
}
