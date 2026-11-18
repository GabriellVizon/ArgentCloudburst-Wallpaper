import { CITY_COLORS, CITY_DISTRICTS, CITY_SCENE, CITY_SEED, type CityDistrict } from "./city-config"

type Point = { x: number; y: number }
type BuildingSpec = {
    x: number
    baseY: number
    width: number
    height: number
    depth: number
    hue?: "violet" | "blue" | "pink" | "neutral"
    windows?: number
    rooftop?: "antenna" | "crown" | "sign" | "none"
}

type Random = () => number

const int = (value: number) => Math.round(value)

function seededRandom(seed: number): Random {
    let state = seed >>> 0 || 1
    return () => {
        state = (state + 0x6d2b79f5) >>> 0
        let t = state
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function polygon(ctx: CanvasRenderingContext2D, points: Point[], fill: string, stroke?: string) {
    ctx.beginPath()
    ctx.moveTo(int(points[0].x), int(points[0].y))
    for (let index = 1; index < points.length; index++) {
        ctx.lineTo(int(points[index].x), int(points[index].y))
    }
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
    if (stroke) {
        ctx.strokeStyle = stroke
        ctx.lineWidth = 1
        ctx.stroke()
    }
}

function line(ctx: CanvasRenderingContext2D, points: Point[], color: string, width: number, alpha = 1) {
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.lineCap = "square"
    ctx.lineJoin = "bevel"
    ctx.beginPath()
    ctx.moveTo(int(points[0].x), int(points[0].y))
    for (let index = 1; index < points.length; index++) {
        ctx.lineTo(int(points[index].x), int(points[index].y))
    }
    ctx.stroke()
    ctx.restore()
}

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, alpha = 0.25) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, "rgba(0,0,0,0)")
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = gradient
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    ctx.restore()
}

function drawSky(ctx: CanvasRenderingContext2D, random: Random) {
    const gradient = ctx.createLinearGradient(0, 0, 0, CITY_SCENE.height)
    gradient.addColorStop(0, CITY_COLORS.skyTop)
    gradient.addColorStop(0.46, CITY_COLORS.skyMid)
    gradient.addColorStop(1, CITY_COLORS.horizon)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CITY_SCENE.width, CITY_SCENE.height)

    glow(ctx, 414, 190, 240, "rgba(132,69,191,0.7)", 0.38)
    glow(ctx, 174, 207, 160, "rgba(47,126,190,0.7)", 0.22)
    glow(ctx, 697, 208, 175, "rgba(139,59,176,0.65)", 0.23)

    for (let index = 0; index < 105; index++) {
        const x = int(random() * CITY_SCENE.width)
        const y = int(random() * 170)
        const size = random() > 0.88 ? 2 : 1
        ctx.fillStyle = random() > 0.7 ? "rgba(196,175,255,0.48)" : "rgba(122,149,205,0.34)"
        ctx.fillRect(x, y, size, size)
    }

    // Dithered horizon band: a pixel-art transition between skyline and sky.
    for (let y = 168; y < 225; y += 4) {
        const opacity = (y - 168) / 57
        for (let x = (y % 8); x < CITY_SCENE.width; x += 8) {
            if (random() > 0.45) {
                ctx.fillStyle = `rgba(117,75,157,${0.025 + opacity * 0.035})`
                ctx.fillRect(x, y, 3, 2)
            }
        }
    }
}

function drawTopNavigation(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "rgba(9,7,20,0.82)"
    ctx.fillRect(12, 7, 138, 25)
    ctx.fillStyle = "#DCC9F4"
    ctx.font = "bold 7px monospace"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("GV / CITY NETWORK", 19, 20)

    const items = [
        { label: "MAPA", x: 524, width: 68 },
        { label: "PROJETOS", x: 592, width: 74 },
        { label: "SOBRE", x: 666, width: 68 },
        { label: "CONTATO", x: 734, width: 58 },
    ]

    for (const item of items) {
        ctx.fillStyle = "rgba(12,9,25,0.78)"
        ctx.fillRect(item.x, 7, item.width, 27)
        ctx.fillStyle = "rgba(190,143,237,0.48)"
        ctx.fillRect(item.x, 7, item.width, 1)
        ctx.fillRect(item.x, 33, item.width, 1)
        ctx.fillStyle = "#E9DFFF"
        ctx.font = "bold 6px monospace"
        ctx.textAlign = "center"
        ctx.fillText(item.label, item.x + item.width / 2, 21)
    }
}

function drawFarSkyline(ctx: CanvasRenderingContext2D, random: Random) {
    let x = -8
    while (x < CITY_SCENE.width + 8) {
        const width = 8 + int(random() * 24)
        const height = 28 + int(random() * 64)
        const top = 224 - height
        ctx.fillStyle = random() > 0.5 ? "#171327" : "#1C1630"
        ctx.fillRect(x, top, width, height)
        ctx.fillStyle = "rgba(151,111,187,0.14)"
        ctx.fillRect(x, top, 1, height)
        if (random() > 0.32) {
            for (let wy = top + 5; wy < 215; wy += 7) {
                for (let wx = x + 3; wx < x + width - 2; wx += 5) {
                    if (random() > 0.48) {
                        ctx.fillStyle = random() > 0.78
                            ? "rgba(113,207,255,0.72)"
                            : "rgba(190,151,233,0.48)"
                        ctx.fillRect(wx, wy, 2, 2)
                    }
                }
            }
        }
        x += width + int(random() * 5)
    }
}

function drawGround(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = CITY_COLORS.ground
    ctx.fillRect(0, 218, CITY_SCENE.width, CITY_SCENE.height - 218)

    // Broad, low-contrast city blocks and an isometric planning grid.
    for (let y = 238; y < CITY_SCENE.height; y += 28) {
        line(ctx, [{ x: 0, y }, { x: CITY_SCENE.width, y: y - 8 }], "rgba(105,80,145,0.17)", 1)
    }
    for (let x = -180; x < CITY_SCENE.width + 180; x += 54) {
        line(ctx, [{ x, y: 220 }, { x: x + 170, y: CITY_SCENE.height }], "rgba(105,80,145,0.11)", 1)
        line(ctx, [{ x, y: 220 }, { x: x - 170, y: CITY_SCENE.height }], "rgba(105,80,145,0.08)", 1)
    }

    // Low silhouettes establish blocks between the five districts.
    for (let index = 0; index < 22; index++) {
        const x = index * 39 - 8
        const height = 14 + ((index * 17) % 30)
        ctx.fillStyle = index % 3 === 0 ? "#211833" : "#19142B"
        ctx.fillRect(x, 248 - height, 22 + (index % 3) * 4, height)
        ctx.fillStyle = "rgba(181,132,225,0.13)"
        ctx.fillRect(x + 2, 250 - height, 1, height - 2)
    }
}

function drawBuilding(ctx: CanvasRenderingContext2D, spec: BuildingSpec, seed: number) {
    const { x, baseY, width, height, depth } = spec
    const random = seededRandom(seed)
    const topY = baseY - height
    const sideColor = spec.hue === "blue" ? "#111D34" : spec.hue === "pink" ? "#2A163B" : CITY_COLORS.buildingSide
    const frontColor = spec.hue === "blue" ? "#1B2941" : spec.hue === "pink" ? "#382044" : CITY_COLORS.buildingFront
    const roofColor = spec.hue === "blue" ? "#2A4564" : spec.hue === "pink" ? "#56305F" : CITY_COLORS.buildingRoof

    polygon(ctx, [
        { x: x + width, y: topY },
        { x: x + width + depth, y: topY - depth * 0.35 },
        { x: x + width + depth, y: baseY - depth * 0.35 },
        { x: x + width, y: baseY },
    ], sideColor)

    ctx.fillStyle = frontColor
    ctx.fillRect(int(x), int(topY), int(width), int(height))

    polygon(ctx, [
        { x, y: topY },
        { x: x + depth, y: topY - depth * 0.35 },
        { x: x + width + depth, y: topY - depth * 0.35 },
        { x: x + width, y: topY },
    ], roofColor)

    ctx.fillStyle = "rgba(201,160,239,0.32)"
    ctx.fillRect(int(x), int(topY), 1, int(height))
    ctx.fillStyle = "rgba(7,5,16,0.42)"
    ctx.fillRect(int(x + width - 2), int(topY + 1), 2, int(height - 1))

    const rows = Math.max(2, int(height / 10))
    const columns = Math.max(1, int(width / 8))
    const litChance = spec.windows ?? 0.62

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (random() > litChance) continue
            const wx = int(x + 3 + column * ((width - 6) / columns))
            const wy = int(topY + 6 + row * ((height - 10) / rows))
            if (wx < x + width - 2 && wy < baseY - 2) {
                ctx.fillStyle = random() > 0.75
                    ? CITY_COLORS.windowCool
                    : random() > 0.72
                        ? CITY_COLORS.windowWarm
                        : CITY_COLORS.window
                ctx.fillRect(wx, wy, 2, random() > 0.82 ? 4 : 2)
            }
        }
    }

    if (spec.rooftop === "antenna") {
        const center = int(x + width * 0.52)
        ctx.fillStyle = "#A9DFFF"
        ctx.fillRect(center, int(topY - 15), 1, 15)
        ctx.fillRect(center - 2, int(topY - 15), 5, 2)
        glow(ctx, center, topY - 14, 11, "rgba(90,191,255,0.8)", 0.24)
    } else if (spec.rooftop === "crown") {
        polygon(ctx, [
            { x: x + width * 0.22, y: topY },
            { x: x + width * 0.36, y: topY - 15 },
            { x: x + width * 0.48, y: topY - 5 },
            { x: x + width * 0.64, y: topY - 20 },
            { x: x + width * 0.82, y: topY },
        ], roofColor, "rgba(220,178,255,0.6)")
    } else if (spec.rooftop === "sign") {
        ctx.fillStyle = "#5A2C76"
        ctx.fillRect(int(x + 2), int(topY + 7), Math.max(8, int(width - 4)), 5)
        ctx.fillStyle = spec.hue === "blue" ? "#8BE4FF" : "#F0B6FF"
        ctx.fillRect(int(x + 5), int(topY + 9), Math.max(3, int(width - 10)), 1)
    }
}

function drawDistrictBuildings(ctx: CanvasRenderingContext2D) {
    const buildings: BuildingSpec[] = [
        // Technology district — server towers and cool cyan lighting.
        { x: 100, baseY: 326, width: 34, height: 94, depth: 12, hue: "blue", rooftop: "antenna", windows: 0.82 },
        { x: 138, baseY: 311, width: 27, height: 72, depth: 9, hue: "blue", rooftop: "sign", windows: 0.74 },
        { x: 168, baseY: 330, width: 38, height: 116, depth: 13, hue: "blue", rooftop: "antenna", windows: 0.78 },
        { x: 210, baseY: 309, width: 27, height: 68, depth: 9, hue: "blue", rooftop: "none", windows: 0.68 },
        { x: 240, baseY: 324, width: 34, height: 88, depth: 11, hue: "blue", rooftop: "crown", windows: 0.72 },

        // Downtown — the visual landmark and tallest silhouette.
        { x: 365, baseY: 333, width: 39, height: 177, depth: 15, hue: "violet", rooftop: "crown", windows: 0.8 },
        { x: 410, baseY: 342, width: 48, height: 250, depth: 20, hue: "pink", rooftop: "antenna", windows: 0.88 },
        { x: 465, baseY: 329, width: 35, height: 144, depth: 13, hue: "violet", rooftop: "sign", windows: 0.78 },
        { x: 337, baseY: 316, width: 23, height: 82, depth: 8, hue: "violet", rooftop: "none", windows: 0.62 },
        { x: 505, baseY: 322, width: 25, height: 96, depth: 9, hue: "violet", rooftop: "antenna", windows: 0.66 },

        // Professional district — glass-like towers and warm magenta windows.
        { x: 594, baseY: 331, width: 36, height: 120, depth: 12, hue: "pink", rooftop: "crown", windows: 0.76 },
        { x: 635, baseY: 317, width: 42, height: 166, depth: 16, hue: "violet", rooftop: "antenna", windows: 0.84 },
        { x: 681, baseY: 333, width: 31, height: 111, depth: 11, hue: "pink", rooftop: "sign", windows: 0.74 },
        { x: 718, baseY: 323, width: 39, height: 137, depth: 14, hue: "violet", rooftop: "none", windows: 0.72 },
        { x: 759, baseY: 326, width: 30, height: 93, depth: 10, hue: "pink", rooftop: "antenna", windows: 0.7 },

        // Projects district — creative studios, low factories and digital venues.
        { x: 104, baseY: 431, width: 40, height: 48, depth: 12, hue: "violet", rooftop: "sign", windows: 0.54 },
        { x: 151, baseY: 425, width: 54, height: 64, depth: 15, hue: "pink", rooftop: "none", windows: 0.58 },
        { x: 211, baseY: 438, width: 47, height: 54, depth: 13, hue: "blue", rooftop: "sign", windows: 0.64 },
        { x: 262, baseY: 432, width: 44, height: 74, depth: 13, hue: "violet", rooftop: "antenna", windows: 0.68 },
        { x: 310, baseY: 429, width: 44, height: 46, depth: 12, hue: "pink", rooftop: "none", windows: 0.6 },

        // Connection district — transit hub, terminal and waterfront buildings.
        { x: 534, baseY: 440, width: 44, height: 63, depth: 15, hue: "blue", rooftop: "sign", windows: 0.62 },
        { x: 582, baseY: 425, width: 54, height: 78, depth: 16, hue: "violet", rooftop: "antenna", windows: 0.68 },
        { x: 642, baseY: 434, width: 44, height: 56, depth: 13, hue: "blue", rooftop: "sign", windows: 0.58 },
        { x: 690, baseY: 428, width: 50, height: 72, depth: 15, hue: "pink", rooftop: "none", windows: 0.62 },
        { x: 746, baseY: 441, width: 38, height: 55, depth: 12, hue: "blue", rooftop: "antenna", windows: 0.58 },
    ]

    buildings.forEach((building, index) => drawBuilding(ctx, building, 1200 + index * 19))

    // A central civic tower crown and its vertical beacon.
    line(ctx, [{ x: 434, y: 73 }, { x: 434, y: 35 }], "#D6C0FF", 2, 0.9)
    glow(ctx, 434, 35, 28, "rgba(178,125,255,0.9)", 0.28)
    ctx.fillStyle = "#F2DFFF"
    ctx.fillRect(431, 32, 6, 4)
}

function drawElevatedRoads(ctx: CanvasRenderingContext2D) {
    const mainRoads: Point[][] = [
        [{ x: -20, y: 244 }, { x: 82, y: 236 }, { x: 173, y: 255 }, { x: 267, y: 250 }, { x: 355, y: 272 }, { x: 462, y: 258 }, { x: 560, y: 276 }, { x: 674, y: 258 }, { x: 844, y: 270 }],
        [{ x: 260, y: 206 }, { x: 309, y: 225 }, { x: 362, y: 235 }, { x: 416, y: 257 }, { x: 464, y: 272 }, { x: 514, y: 305 }],
        [{ x: 518, y: 286 }, { x: 582, y: 303 }, { x: 645, y: 307 }, { x: 716, y: 298 }, { x: 840, y: 326 }],
    ]

    for (const points of mainRoads) {
        line(ctx, points, "rgba(128,72,180,0.42)", 15)
        line(ctx, points, "#191827", 10)
        line(ctx, points, "rgba(183,124,231,0.46)", 1)
    }

    const avenue = mainRoads[0]
    for (let index = 0; index < avenue.length - 1; index++) {
        const a = avenue[index]
        const b = avenue[index + 1]
        const length = Math.hypot(b.x - a.x, b.y - a.y)
        const steps = Math.max(1, int(length / 19))
        for (let step = 0; step < steps; step++) {
            const t = step / steps
            const x = int(a.x + (b.x - a.x) * t)
            const y = int(a.y + (b.y - a.y) * t)
            ctx.fillStyle = step % 2 === 0 ? "rgba(215,176,255,0.72)" : "rgba(110,190,255,0.5)"
            ctx.fillRect(x, y - 1, 4, 2)
        }
    }

    // Bridge deck crossing the southern waterway.
    ctx.fillStyle = "#27223D"
    ctx.fillRect(395, 367, 104, 8)
    ctx.fillStyle = "#8B65B3"
    ctx.fillRect(395, 367, 104, 1)
    ctx.fillStyle = "rgba(120,202,255,0.72)"
    for (let x = 402; x < 496; x += 12) ctx.fillRect(x, 365, 2, 2)
    ctx.fillStyle = "#121020"
    ctx.fillRect(402, 375, 92, 3)
}

function drawWaterway(ctx: CanvasRenderingContext2D) {
    const banks: Point[] = [
        { x: -30, y: 400 },
        { x: 108, y: 376 },
        { x: 236, y: 389 },
        { x: 370, y: 369 },
        { x: 506, y: 391 },
        { x: 650, y: 376 },
        { x: 850, y: 392 },
    ]
    line(ctx, banks, "rgba(58,118,190,0.26)", 36)
    line(ctx, banks, "#101B35", 27)
    line(ctx, banks, "rgba(72,153,224,0.48)", 1.5)

    for (let index = 0; index < 30; index++) {
        const x = (index * 31) % CITY_SCENE.width
        const y = 382 + ((index * 17) % 45)
        const width = 5 + ((index * 7) % 13)
        ctx.fillStyle = index % 3 === 0 ? "rgba(115,200,255,0.62)" : "rgba(143,94,205,0.42)"
        ctx.fillRect(x, y, width, 1)
    }
}

function drawStreetDetails(ctx: CanvasRenderingContext2D) {
    // Small lit windows, signs and sidewalk strips bring scale to the blocks.
    for (let index = 0; index < 54; index++) {
        const x = 18 + ((index * 73) % 788)
        const y = 286 + ((index * 29) % 68)
        ctx.fillStyle = index % 4 === 0 ? "rgba(112,202,255,0.8)" : "rgba(219,166,255,0.66)"
        ctx.fillRect(x, y, index % 5 === 0 ? 4 : 2, 2)
    }

    // Transit pylons and tiny station platforms.
    for (const x of [72, 354, 514, 782]) {
        ctx.fillStyle = "#45325C"
        ctx.fillRect(x, 228, 2, 31)
        ctx.fillStyle = "#8ADFFF"
        ctx.fillRect(x - 3, 226, 8, 2)
        ctx.fillStyle = "rgba(105,191,255,0.2)"
        ctx.fillRect(x - 6, 259, 14, 2)
    }
}

function drawDistrictMarker(ctx: CanvasRenderingContext2D, district: CityDistrict) {
    const width = district.id === "centro" ? 104 : district.id === "tecnologia" ? 142 : district.id === "carreira" ? 150 : 138
    const height = 34
    const x = int(district.anchor.x - width / 2)
    const y = int(district.anchor.y - height / 2)

    glow(ctx, district.anchor.x, district.anchor.y, 62, district.glow, 0.13)

    ctx.fillStyle = "rgba(11,8,22,0.93)"
    ctx.fillRect(x, y, width, height)
    ctx.fillStyle = district.accent
    ctx.fillRect(x, y, width, 1)
    ctx.fillRect(x, y + height - 1, width, 1)
    ctx.fillRect(x, y, 1, height)
    ctx.fillRect(x + width - 1, y, 1, height)

    ctx.fillStyle = "rgba(92,62,126,0.65)"
    ctx.fillRect(x + 4, y + 4, 20, 25)
    ctx.fillStyle = district.accent
    ctx.font = "bold 7px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(district.number, x + 14, y + 16)

    ctx.textAlign = "left"
    ctx.fillStyle = "#F4EFFF"
    ctx.font = "bold 7px monospace"
    ctx.fillText(district.markerLines[0], x + 30, y + 12)
    ctx.fillStyle = district.accent
    ctx.font = "6px monospace"
    ctx.fillText(district.markerLines[1], x + 30, y + 23)

    ctx.fillStyle = district.accent
    ctx.fillRect(x + width - 8, y + 5, 3, 3)
    ctx.fillRect(x + width - 8, y + 11, 3, 1)
}

function drawCentralPlaza(ctx: CanvasRenderingContext2D) {
    // The central plaza is a low octagonal platform around the landmark tower.
    polygon(ctx, [
        { x: 346, y: 330 },
        { x: 383, y: 310 },
        { x: 465, y: 310 },
        { x: 505, y: 332 },
        { x: 465, y: 349 },
        { x: 383, y: 349 },
    ], "#27203D", "rgba(199,153,255,0.58)")
    polygon(ctx, [
        { x: 370, y: 329 },
        { x: 401, y: 316 },
        { x: 449, y: 316 },
        { x: 480, y: 330 },
        { x: 449, y: 342 },
        { x: 401, y: 342 },
    ], "#19172C", "rgba(124,184,255,0.42)")

    ctx.fillStyle = "#B98AF2"
    ctx.fillRect(422, 322, 25, 2)
    ctx.fillStyle = "#6EDBFF"
    ctx.fillRect(432, 326, 5, 5)
    glow(ctx, 434, 330, 34, "rgba(158,105,255,0.8)", 0.32)
}

function drawVignette(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(412, 225, 100, 412, 225, 510)
    gradient.addColorStop(0, "rgba(0,0,0,0)")
    gradient.addColorStop(1, "rgba(4,3,12,0.48)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CITY_SCENE.width, CITY_SCENE.height)

    ctx.fillStyle = "rgba(4,3,12,0.3)"
    ctx.fillRect(0, 0, CITY_SCENE.width, 8)
    ctx.fillRect(0, CITY_SCENE.height - 6, CITY_SCENE.width, 6)
}

export type CityLayerId =
    | "sky"
    | "skyline"
    | "terrain"
    | "transit"
    | "architecture"
    | "foreground"
    | "interface"

export const CITY_RENDER_LAYERS: readonly { id: CityLayerId; depth: number }[] = [
    { id: "sky", depth: 0 },
    { id: "skyline", depth: 0.18 },
    { id: "terrain", depth: 0.32 },
    { id: "transit", depth: 0.52 },
    { id: "architecture", depth: 0.78 },
    { id: "foreground", depth: 0.94 },
    { id: "interface", depth: 0 },
]

export function renderCityLayer(ctx: CanvasRenderingContext2D, layer: CityLayerId) {
    ctx.save()
    ctx.imageSmoothingEnabled = false

    switch (layer) {
        case "sky":
            drawSky(ctx, seededRandom(CITY_SEED))
            break
        case "skyline":
            drawFarSkyline(ctx, seededRandom(CITY_SEED + 1))
            break
        case "terrain":
            drawGround(ctx)
            break
        case "transit":
            drawWaterway(ctx)
            drawElevatedRoads(ctx)
            break
        case "architecture":
            drawDistrictBuildings(ctx)
            break
        case "foreground":
            drawCentralPlaza(ctx)
            drawStreetDetails(ctx)
            break
        case "interface":
            drawTopNavigation(ctx)
            for (const district of CITY_DISTRICTS) drawDistrictMarker(ctx, district)
            drawVignette(ctx)
            break
    }

    ctx.restore()
}

export function renderCityScene(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, CITY_SCENE.width, CITY_SCENE.height)

    for (const layer of CITY_RENDER_LAYERS) {
        renderCityLayer(ctx, layer.id)
    }

    ctx.restore()
}
