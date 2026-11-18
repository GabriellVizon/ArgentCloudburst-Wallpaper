import { useEffect, useRef } from "react"
import { CITY_PARALLAX, CITY_SCENE } from "./city-config"
import { CITY_RENDER_LAYERS, renderCityLayer, type CityLayerId } from "./CityLayers"

type CityEnvironmentProps = {
    onFailure?: () => void
}

type RenderPlane = {
    id: CityLayerId
    depth: number
    canvas: HTMLCanvasElement
}

type PointerPosition = {
    x: number
    y: number
}

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value))

const centeredPointer = (): PointerPosition => ({ x: 0, y: 0 })

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

        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
        let prefersReducedMotion = motionQuery.matches
        let pixelRatio = 1
        let planes: RenderPlane[] = []
        let targetPointer = centeredPointer()
        let currentPointer = centeredPointer()
        let frameId = 0
        let lastFrameTime = 0
        let isInViewport = true
        let observer: IntersectionObserver | null = null

        const inputTarget = canvas.parentElement ?? canvas

        const canAnimate = () =>
            !prefersReducedMotion && isInViewport && !document.hidden

        const stopFrame = () => {
            if (frameId) window.cancelAnimationFrame(frameId)
            frameId = 0
            lastFrameTime = 0
        }

        const drawComposite = () => {
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
            context.imageSmoothingEnabled = false
            context.clearRect(0, 0, CITY_SCENE.width, CITY_SCENE.height)

            for (const plane of planes) {
                const offsetX = Math.round(
                    -currentPointer.x * CITY_PARALLAX.maxOffsetX * plane.depth,
                )
                const offsetY = Math.round(
                    -currentPointer.y * CITY_PARALLAX.maxOffsetY * plane.depth,
                )

                context.drawImage(
                    plane.canvas,
                    offsetX,
                    offsetY,
                    CITY_SCENE.width,
                    CITY_SCENE.height,
                )
            }
        }

        const buildScene = () => {
            const nextPixelRatio = Math.min(
                CITY_PARALLAX.pixelRatioCap,
                Math.max(1, window.devicePixelRatio || 1),
            )

            pixelRatio = nextPixelRatio
            canvas.width = CITY_SCENE.width * pixelRatio
            canvas.height = CITY_SCENE.height * pixelRatio
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
            context.imageSmoothingEnabled = false

            const nextPlanes: RenderPlane[] = []

            for (const layer of CITY_RENDER_LAYERS) {
                const surface = document.createElement("canvas")
                surface.width = CITY_SCENE.width * pixelRatio
                surface.height = CITY_SCENE.height * pixelRatio

                const surfaceContext = surface.getContext("2d")
                if (!surfaceContext) {
                    for (const plane of nextPlanes) {
                        plane.canvas.width = 0
                        plane.canvas.height = 0
                    }
                    onFailureRef.current?.()
                    return false
                }

                surfaceContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
                surfaceContext.imageSmoothingEnabled = false
                renderCityLayer(surfaceContext, layer.id)

                nextPlanes.push({
                    id: layer.id,
                    depth: layer.depth,
                    canvas: surface,
                })
            }

            for (const plane of planes) {
                plane.canvas.width = 0
                plane.canvas.height = 0
            }

            planes = nextPlanes
            drawComposite()
            return true
        }

        const animate = (timestamp: number) => {
            frameId = 0
            if (!canAnimate()) {
                lastFrameTime = 0
                return
            }

            const delta = lastFrameTime
                ? Math.min(48, timestamp - lastFrameTime)
                : 16
            lastFrameTime = timestamp
            const easing = 1 - Math.exp(-delta / CITY_PARALLAX.smoothingMs)

            currentPointer.x += (targetPointer.x - currentPointer.x) * easing
            currentPointer.y += (targetPointer.y - currentPointer.y) * easing

            drawComposite()

            const settled =
                Math.abs(targetPointer.x - currentPointer.x) < CITY_PARALLAX.settleThreshold &&
                Math.abs(targetPointer.y - currentPointer.y) < CITY_PARALLAX.settleThreshold

            if (settled) {
                currentPointer = { ...targetPointer }
                drawComposite()
                lastFrameTime = 0
            } else {
                frameId = window.requestAnimationFrame(animate)
            }
        }

        const scheduleFrame = () => {
            if (!canAnimate()) {
                drawComposite()
                return
            }
            if (!frameId) frameId = window.requestAnimationFrame(animate)
        }

        const resetPointer = () => {
            targetPointer = centeredPointer()
            scheduleFrame()
        }

        const handlePointerMove = (event: PointerEvent) => {
            if (!canAnimate()) return

            if (event.pointerType === "touch") {
                resetPointer()
                return
            }

            const bounds = inputTarget.getBoundingClientRect()
            if (!bounds.width || !bounds.height) return

            targetPointer = {
                x: clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1),
                y: clamp(((event.clientY - bounds.top) / bounds.height) * 2 - 1, -1, 1),
            }
            scheduleFrame()
        }

        const handlePointerLeave = () => resetPointer()

        const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
            prefersReducedMotion = event.matches

            if (prefersReducedMotion) {
                targetPointer = centeredPointer()
                currentPointer = centeredPointer()
                stopFrame()
                drawComposite()
            }
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                targetPointer = centeredPointer()
                stopFrame()
            } else {
                scheduleFrame()
            }
        }

        const handleResize = () => {
            const nextPixelRatio = Math.min(
                CITY_PARALLAX.pixelRatioCap,
                Math.max(1, window.devicePixelRatio || 1),
            )

            if (nextPixelRatio !== pixelRatio) {
                buildScene()
            } else {
                drawComposite()
            }
        }

        if (!buildScene()) return

        inputTarget.addEventListener("pointermove", handlePointerMove, { passive: true })
        inputTarget.addEventListener("pointerleave", handlePointerLeave, { passive: true })
        inputTarget.addEventListener("pointercancel", handlePointerLeave, { passive: true })
        window.addEventListener("resize", handleResize, { passive: true })
        document.addEventListener("visibilitychange", handleVisibilityChange)
        motionQuery.addEventListener("change", handleMotionPreferenceChange)

        if (typeof IntersectionObserver !== "undefined") {
            observer = new IntersectionObserver(([entry]) => {
                isInViewport = Boolean(entry?.isIntersecting)

                if (!isInViewport) {
                    targetPointer = centeredPointer()
                    stopFrame()
                } else {
                    scheduleFrame()
                }
            }, { rootMargin: "120px" })

            observer.observe(canvas)
        }

        return () => {
            stopFrame()
            observer?.disconnect()
            inputTarget.removeEventListener("pointermove", handlePointerMove)
            inputTarget.removeEventListener("pointerleave", handlePointerLeave)
            inputTarget.removeEventListener("pointercancel", handlePointerLeave)
            window.removeEventListener("resize", handleResize)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            motionQuery.removeEventListener("change", handleMotionPreferenceChange)

            for (const plane of planes) {
                plane.canvas.width = 0
                plane.canvas.height = 0
            }

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
            aria-label="Metrópole cyberpunk em pixel art, com cinco distritos em planos de profundidade e parallax interativo."
        />
    )
}
