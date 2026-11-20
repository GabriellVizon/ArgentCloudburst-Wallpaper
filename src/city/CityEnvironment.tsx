import { useEffect, useRef } from "react"

const CITY_ART = "/assets/neon-cyberpunk-city-map.png"
const ART_WIDTH = 1648
const ART_HEIGHT = 928

type CityEnvironmentProps = {
    onFailure?: () => void
}

export default function CityEnvironment({ onFailure }: CityEnvironmentProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const onFailureRef = useRef(onFailure)
    onFailureRef.current = onFailure

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext("2d", { alpha: false })

        if (!canvas || !context) {
            onFailureRef.current?.()
            return
        }

        const artwork = new Image()
        artwork.decoding = "async"

        artwork.onload = () => {
            context.imageSmoothingEnabled = true
            context.clearRect(0, 0, ART_WIDTH, ART_HEIGHT)
            context.drawImage(artwork, 0, 0, ART_WIDTH, ART_HEIGHT)
        }

        artwork.onerror = () => onFailureRef.current?.()
        artwork.src = CITY_ART

        return () => {
            artwork.onload = null
            artwork.onerror = null
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="city-map__canvas"
            width={ART_WIDTH}
            height={ART_HEIGHT}
            role="img"
            aria-label="Arte original da cidade cyberpunk, com cinco distritos e navegação integrada."
        />
    )
}
