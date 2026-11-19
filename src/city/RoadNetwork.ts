type RoadPoint = { x: number; y: number }

type RoadDefinition = {
    id: string
    points: readonly RoadPoint[]
    width: number
    kind: "arterial" | "connector" | "bridge"
    markings?: boolean
}

type RoadEdge = {
    left: RoadPoint[]
    right: RoadPoint[]
    outline: RoadPoint[]
}

const roads: readonly RoadDefinition[] = [
    {
        id: "central-avenue",
        kind: "arterial",
        width: 18,
        markings: true,
        points: [
            { x: -28, y: 251 },
            { x: 72, y: 250 },
            { x: 164, y: 257 },
            { x: 254, y: 260 },
            { x: 350, y: 265 },
            { x: 454, y: 265 },
            { x: 558, y: 272 },
            { x: 670, y: 273 },
            { x: 852, y: 281 },
        ],
    },
    {
        id: "west-feeder",
        kind: "connector",
        width: 12,
        markings: true,
        points: [
            { x: 98, y: 204 },
            { x: 158, y: 220 },
            { x: 220, y: 237 },
            { x: 286, y: 253 },
            { x: 350, y: 265 },
        ],
    },
    {
        id: "east-feeder",
        kind: "connector",
        width: 12,
        markings: true,
        points: [
            { x: 454, y: 265 },
            { x: 510, y: 250 },
            { x: 574, y: 238 },
            { x: 655, y: 237 },
            { x: 742, y: 242 },
            { x: 852, y: 255 },
        ],
    },
    {
        id: "waterfront-link",
        kind: "connector",
        width: 10,
        markings: false,
        points: [
            { x: 254, y: 260 },
            { x: 222, y: 279 },
            { x: 197, y: 306 },
            { x: 196, y: 334 },
            { x: 224, y: 349 },
            { x: 320, y: 349 },
        ],
    },
    {
        id: "east-waterfront-link",
        kind: "connector",
        width: 10,
        markings: false,
        points: [
            { x: 558, y: 272 },
            { x: 548, y: 296 },
            { x: 548, y: 322 },
            { x: 565, y: 344 },
        ],
    },
    {
        id: "canal-bridge",
        kind: "bridge",
        width: 14,
        markings: true,
        points: [
            { x: 320, y: 349 },
            { x: 360, y: 360 },
            { x: 395, y: 367 },
            { x: 499, y: 367 },
            { x: 535, y: 358 },
            { x: 565, y: 344 },
        ],
    },
]

const junctions: readonly { x: number; y: number; width: number; height: number }[] = [
    { x: 350, y: 265, width: 23, height: 16 },
    { x: 454, y: 265, width: 24, height: 16 },
    { x: 254, y: 260, width: 18, height: 13 },
    { x: 320, y: 349, width: 16, height: 12 },
    { x: 558, y: 272, width: 16, height: 12 },
    { x: 565, y: 344, width: 15, height: 11 },
]

const bridgeSupports = [414, 447, 480]

const int = (value: number) => Math.round(value)

function normalize(x: number, y: number): RoadPoint {
    const length = Math.hypot(x, y) || 1
    return { x: x / length, y: y / length }
}

function offsetEdges(points: readonly RoadPoint[], width: number): RoadEdge {
    const halfWidth = width / 2
    const left: RoadPoint[] = []
    const right: RoadPoint[] = []

    for (let index = 0; index < points.length; index++) {
        const point = points[index]
        const previous = points[Math.max(0, index - 1)]
        const next = points[Math.min(points.length - 1, index + 1)]

        // Open endpoints use the normal of their one connected segment.
        if (index === 0 || index === points.length - 1) {
            const direction = index === 0
                ? normalize(next.x - point.x, next.y - point.y)
                : normalize(point.x - previous.x, point.y - previous.y)
            const normal = { x: -direction.y, y: direction.x }

            left.push({
                x: point.x + normal.x * halfWidth,
                y: point.y + normal.y * halfWidth,
            })
            right.push({
                x: point.x - normal.x * halfWidth,
                y: point.y - normal.y * halfWidth,
            })
            continue
        }

        const before = normalize(point.x - previous.x, point.y - previous.y)
        const after = normalize(next.x - point.x, next.y - point.y)
        const normalBefore = { x: -before.y, y: before.x }
        const normalAfter = { x: -after.y, y: after.x }
        const normalSum = normalize(
            normalBefore.x + normalAfter.x,
            normalBefore.y + normalAfter.y,
        )
        const dot = normalSum.x * normalAfter.x + normalSum.y * normalAfter.y
        const denominator = Math.max(0.42, Math.abs(dot))
        const miterLength = Math.min(halfWidth * 2, halfWidth / denominator)

        left.push({
            x: point.x + normalSum.x * miterLength,
            y: point.y + normalSum.y * miterLength,
        })
        right.push({
            x: point.x - normalSum.x * miterLength,
            y: point.y - normalSum.y * miterLength,
        })
    }

    return { left, right, outline: [...left, ...right.reverse()] }
}
function tracePolygon(ctx: CanvasRenderingContext2D, points: readonly RoadPoint[]) {
    if (points.length < 3) return
    ctx.beginPath()
    ctx.moveTo(int(points[0].x), int(points[0].y))
    for (let index = 1; index < points.length; index++) {
        ctx.lineTo(int(points[index].x), int(points[index].y))
    }
    ctx.closePath()
}

function fillRoadPolygon(
    ctx: CanvasRenderingContext2D,
    points: readonly RoadPoint[],
    color: string,
) {
    tracePolygon(ctx, points)
    ctx.fillStyle = color
    ctx.fill()
}

function tracePolyline(ctx: CanvasRenderingContext2D, points: readonly RoadPoint[]) {
    if (points.length < 2) return
    ctx.beginPath()
    ctx.moveTo(int(points[0].x), int(points[0].y))
    for (let index = 1; index < points.length; index++) {
        ctx.lineTo(int(points[index].x), int(points[index].y))
    }
}

function drawLaneMarkings(ctx: CanvasRenderingContext2D, road: RoadDefinition) {
    if (!road.markings) return

    ctx.save()
    ctx.strokeStyle = road.kind === "arterial"
        ? "rgba(229,213,255,0.54)"
        : "rgba(181,170,211,0.4)"
    ctx.lineWidth = road.kind === "arterial" ? 1.5 : 1
    ctx.lineCap = "square"
    ctx.lineJoin = "bevel"
    ctx.setLineDash(road.kind === "arterial" ? [8, 10] : [5, 10])
    tracePolyline(ctx, road.points)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()

    // Sparse pixel reflectors make the road legible without turning it into a neon strip.
    const spacing = road.kind === "arterial" ? 28 : 34
    for (let index = 0; index < road.points.length - 1; index++) {
        const start = road.points[index]
        const end = road.points[index + 1]
        const distance = Math.hypot(end.x - start.x, end.y - start.y)
        const count = Math.floor(distance / spacing)
        for (let mark = 1; mark <= count; mark++) {
            const t = mark / (count + 1)
            const x = int(start.x + (end.x - start.x) * t)
            const y = int(start.y + (end.y - start.y) * t)
            ctx.fillStyle = road.kind === "arterial"
                ? "rgba(111,202,255,0.68)"
                : "rgba(211,165,255,0.5)"
            ctx.fillRect(x - 1, y - 1, 2, 2)
        }
    }
}

function drawJunction(ctx: CanvasRenderingContext2D, junction: typeof junctions[number]) {
    const { x, y, width, height } = junction
    const shoulder = [
        { x: x - width, y },
        { x: x - width * 0.7, y: y - height },
        { x: x + width * 0.7, y: y - height },
        { x: x + width, y },
        { x: x + width * 0.7, y: y + height },
        { x: x - width * 0.7, y: y + height },
    ]
    const asphalt = [
        { x: x - width + 3, y },
        { x: x - width * 0.7 + 2, y: y - height + 2 },
        { x: x + width * 0.7 - 2, y: y - height + 2 },
        { x: x + width - 3, y },
        { x: x + width * 0.7 - 2, y: y + height - 2 },
        { x: x - width * 0.7 + 2, y: y + height - 2 },
    ]

    fillRoadPolygon(ctx, shoulder, "#392A4A")
    fillRoadPolygon(ctx, asphalt, "#171827")
    ctx.fillStyle = "rgba(194,154,225,0.32)"
    ctx.fillRect(int(x - 2), int(y - 1), 4, 2)
}

function drawBridgeSupports(ctx: CanvasRenderingContext2D) {
    for (const supportX of bridgeSupports) {
        ctx.fillStyle = "rgba(5,4,15,0.74)"
        ctx.fillRect(supportX - 3, 370, 6, 22)
        ctx.fillStyle = "rgba(143,109,178,0.52)"
        ctx.fillRect(supportX - 1, 372, 1, 17)
    }
}

function drawBridgeRails(ctx: CanvasRenderingContext2D) {
    const bridge = roads.find((road) => road.id === "canal-bridge")
    if (!bridge) return
    const edges = offsetEdges(bridge.points, bridge.width + 5)

    ctx.save()
    ctx.strokeStyle = "rgba(205,177,235,0.62)"
    ctx.lineWidth = 1
    ctx.lineCap = "square"
    ctx.lineJoin = "bevel"
    tracePolyline(ctx, edges.left)
    ctx.stroke()
    tracePolyline(ctx, edges.right)
    ctx.stroke()
    ctx.restore()

    // Evenly spaced rail uprights remain visible along the straight bridge span.
    for (const supportX of bridgeSupports) {
        const deckY = 367
        ctx.fillStyle = "rgba(194,169,220,0.72)"
        ctx.fillRect(int(supportX), int(deckY - bridge.width / 2 - 4), 1, 3)
        ctx.fillRect(int(supportX), int(deckY + bridge.width / 2 + 2), 1, 3)
    }
}
export function drawRoadNetwork(ctx: CanvasRenderingContext2D) {
    const roadEdges = roads.map((road) => ({
        road,
        edges: offsetEdges(road.points, road.width),
    }))

    // Bridge piers are behind the deck, inside the channel.
    drawBridgeSupports(ctx)

    // Pass one: soft contact shadows keep every road grounded on the terrain.
    for (const { road } of roadEdges) {
        const shoulderWidth = road.width + (road.kind === "arterial" ? 8 : 6)
        ctx.save()
        ctx.translate(0, road.kind === "bridge" ? 4 : 3)
        fillRoadPolygon(
            ctx,
            offsetEdges(road.points, shoulderWidth + 5).outline,
            "rgba(3,2,10,0.48)",
        )
        ctx.restore()
    }

    // Pass two: continuous curb shoulders, followed by the shared asphalt surfaces.
    for (const { road } of roadEdges) {
        fillRoadPolygon(
            ctx,
            offsetEdges(road.points, road.width + (road.kind === "arterial" ? 8 : 6)).outline,
            road.kind === "bridge" ? "#463457" : "#392A4A",
        )
    }

    for (const { road, edges } of roadEdges) {
        fillRoadPolygon(ctx, edges.outline, road.kind === "bridge" ? "#202033" : "#171827")
    }

    // Junction pads unify the branches into one connected street surface.
    for (const junction of junctions) drawJunction(ctx, junction)

    // Pass three: edge strips and lane markings are kept above the intersections.
    for (const { road, edges } of roadEdges) {
        ctx.save()
        ctx.strokeStyle = "rgba(194,154,225,0.36)"
        ctx.lineWidth = 1
        ctx.lineCap = "square"
        ctx.lineJoin = "bevel"
        tracePolyline(ctx, edges.left)
        ctx.stroke()
        tracePolyline(ctx, edges.right)
        ctx.stroke()
        ctx.restore()
        drawLaneMarkings(ctx, road)
    }

    // Bridge rails and abutment lights finish the elevated crossing.
    drawBridgeRails(ctx)
    for (const x of [395, 499]) {
        ctx.fillStyle = "rgba(133,205,255,0.72)"
        ctx.fillRect(x - 2, 358, 4, 2)
    }
}