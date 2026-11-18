export const CITY_SCENE = {
    width: 824,
    height: 464,
    pixelScale: 2,
} as const

export type CityDistrict = {
    id: string
    number: string
    title: string
    markerLines: readonly [string, string]
    anchor: { x: number; y: number }
    accent: string
    glow: string
}

export const CITY_DISTRICTS: readonly CityDistrict[] = [
    {
        id: "centro",
        number: "01",
        title: "Centro",
        markerLines: ["CENTRO", "IDENTIDADE"],
        anchor: { x: 418.6, y: 121.3 },
        accent: "#D8B8FF",
        glow: "#9A5BEB",
    },
    {
        id: "tecnologia",
        number: "02",
        title: "Distrito Tecnológico",
        markerLines: ["DISTRITO", "TECNOLOGICO"],
        anchor: { x: 200.6, y: 163.1 },
        accent: "#77DFFF",
        glow: "#388CDE",
    },
    {
        id: "carreira",
        number: "03",
        title: "Distrito Profissional",
        markerLines: ["DISTRITO", "PROFISSIONAL"],
        anchor: { x: 690.1, y: 165.0 },
        accent: "#E6B8FF",
        glow: "#A35AE8",
    },
    {
        id: "projetos",
        number: "04",
        title: "Zona de Projetos",
        markerLines: ["ZONA DE", "PROJETOS"],
        anchor: { x: 280.2, y: 307.6 },
        accent: "#E58BFF",
        glow: "#B34DDF",
    },
    {
        id: "contato",
        number: "05",
        title: "Ponto de Conexão",
        markerLines: ["PONTO DE", "CONEXAO"],
        anchor: { x: 648.5, y: 321.6 },
        accent: "#83D5FF",
        glow: "#438BE5",
    },
] as const

export const CITY_COLORS = {
    skyTop: "#090714",
    skyMid: "#17102A",
    horizon: "#2B1641",
    ground: "#100D20",
    groundLight: "#1B1430",
    road: "#171726",
    roadEdge: "#6A3B95",
    water: "#101D3B",
    waterLight: "#4E92D7",
    farBuilding: "#171327",
    farBuildingSide: "#100D20",
    buildingFront: "#241A38",
    buildingSide: "#171126",
    buildingRoof: "#38264F",
    window: "#E5D7FF",
    windowWarm: "#F3B8E5",
    windowCool: "#8ADFFF",
} as const

export const CITY_SEED = 20261118
