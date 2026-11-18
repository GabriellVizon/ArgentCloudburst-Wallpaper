import { useState } from "react"

const MAP_VIEWBOX = {
    width: 1648,
    height: 928,
}

type Hotspot = {
    centerX: number
    centerY: number
    width: number
    height: number
}

type Region = {
    id: string
    number: string
    title: string
    subtitle: string
    target: string
    hotspot: Hotspot
}

type MenuLink = {
    label: string
    target: string
    hotspot: Hotspot
}

/**
 * Coordinates are stored in the artwork's native 1648 × 928 coordinate
 * space. The SVG overlay therefore scales with the PNG without recalculating
 * percentages against a potentially different container.
 *
 * Values below are the first calibrated pass, translated from the previous
 * hotspot rectangles. Open the page with ?mapDebug=1 to inspect their bounds.
 */
const regions: Region[] = [
    {
        id: "centro",
        number: "01",
        title: "Centro",
        subtitle: "Minha identidade",
        target: "#inicio",
        hotspot: { centerX: 837.184, centerY: 242.672, width: 210.944, height: 75.168 },
    },
    {
        id: "tecnologia",
        number: "02",
        title: "Distrito Tecnológico",
        subtitle: "Habilidades e ferramentas",
        target: "#tecnologia",
        hotspot: { centerX: 401.288, centerY: 326.192, width: 288.4, height: 80.736 },
    },
    {
        id: "carreira",
        number: "03",
        title: "Distrito Profissional",
        subtitle: "Experiências e carreira",
        target: "#carreira",
        hotspot: { centerX: 1380.2, centerY: 329.904, width: 304.88, height: 80.736 },
    },
    {
        id: "projetos",
        number: "04",
        title: "Zona de Projetos",
        subtitle: "Meus projetos e criações",
        target: "#projetos",
        hotspot: { centerX: 560.32, centerY: 615.264, width: 283.456, height: 78.0 },
    },
    {
        id: "contato",
        number: "05",
        title: "Ponto de Conexão",
        subtitle: "Contato e redes",
        target: "#contato",
        hotspot: { centerX: 1296.976, centerY: 643.104, width: 293.344, height: 78.0 },
    },
]

const menuLinks: MenuLink[] = [
    { label: "Mapa", target: "#mapa", hotspot: { centerX: 1116.88, centerY: 40.368, width: 133.488, height: 56.608 } },
    { label: "Projetos", target: "#projetos", hotspot: { centerX: 1257.424, centerY: 40.368, width: 148.32, height: 56.608 } },
    { label: "Sobre", target: "#inicio", hotspot: { centerX: 1400.0, centerY: 40.368, width: 136.784, height: 56.608 } },
    { label: "Contato", target: "#contato", hotspot: { centerX: 1526.048, centerY: 40.368, width: 115.36, height: 56.608 } },
]

const chapters = [
    {
        id: "tecnologia",
        number: "02",
        name: "Distrito Tecnológico",
        eyebrow: "Conhecimentos e ferramentas",
        title: "Tecnologia em movimento.",
        description:
            "Um espaço para apresentar linguagens, ferramentas, conhecimentos e práticas que fazem parte da minha jornada.",
    },
    {
        id: "carreira",
        number: "03",
        name: "Distrito Profissional",
        eyebrow: "Experiências e evolução",
        title: "O caminho que constrói experiência.",
        description:
            "Um espaço para conhecer experiências, responsabilidades, aprendizados e momentos importantes da minha trajetória profissional.",
    },
    {
        id: "projetos",
        number: "04",
        name: "Zona de Projetos",
        eyebrow: "Criações e aplicações",
        title: "Ideias que ganham forma.",
        description:
            "Projetos pessoais e profissionais apresentados com seu contexto, tecnologias utilizadas e decisões por trás de cada criação.",
    },
    {
        id: "contato",
        number: "05",
        name: "Ponto de Conexão",
        eyebrow: "Contato e redes",
        title: "Toda boa conexão começa com uma conversa.",
        description:
            "Um espaço para reunir meus canais profissionais e facilitar novas conversas e oportunidades.",
    },
]

function hotspotRect(hotspot: Hotspot) {
    return {
        x: hotspot.centerX - hotspot.width / 2,
        y: hotspot.centerY - hotspot.height / 2,
        width: hotspot.width,
        height: hotspot.height,
    }
}

export default function CityMap() {
    const [artLoaded, setArtLoaded] = useState(true)
    const [showHotspotGuides] = useState(
        () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("mapDebug"),
    )

    return (
        <>
            <section id="mapa" className="city-map" aria-label="Mapa interativo da cidade">
                <div className={`city-map__frame${showHotspotGuides ? " city-map__frame--debug" : ""}`}>
                    {artLoaded ? (
                        <img
                            className="city-map__art"
                            src="/assets/neon-cyberpunk-city-map.png"
                            alt="Vista panorâmica de uma metrópole cyberpunk iluminada em roxo, azul e magenta, dividida em cinco regiões."
                            onError={() => setArtLoaded(false)}
                        />
                    ) : (
                        <div className="city-map__fallback" role="img" aria-label="Prévia estilizada do mapa da metrópole">
                            <div className="city-map__fallback-skyline" />
                            <div className="city-map__fallback-river" />
                            <div className="city-map__fallback-title">
                                <span>GV / CITY NETWORK</span>
                                <strong>MAPA DA METRÓPOLE</strong>
                                <small>O cenário será carregado de public/assets/neon-cyberpunk-city-map.png</small>
                            </div>
                        </div>
                    )}

                    {artLoaded && (
                        <>
                            <svg
                                className="city-map__image-nav"
                                viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
                                preserveAspectRatio="none"
                                role="navigation"
                                aria-label="Navegação principal"
                            >
                                {menuLinks.map((link) => {
                                    const rect = hotspotRect(link.hotspot)
                                    return (
                                        <a
                                            key={link.label}
                                            href={link.target}
                                            aria-label={link.label}
                                            title={link.label}
                                        >
                                            <rect
                                                className="city-map__hotspot"
                                                x={rect.x}
                                                y={rect.y}
                                                width={rect.width}
                                                height={rect.height}
                                                rx="10"
                                            />
                                            {showHotspotGuides && (
                                                <text
                                                    className="city-map__debug-label"
                                                    x={link.hotspot.centerX}
                                                    y={link.hotspot.centerY}
                                                >
                                                    {link.label}
                                                </text>
                                            )}
                                        </a>
                                    )
                                })}
                            </svg>

                            <svg
                                className="city-map__image-regions"
                                viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
                                preserveAspectRatio="none"
                                role="group"
                                aria-label="Selecionar região"
                            >
                                {regions.map((region) => {
                                    const rect = hotspotRect(region.hotspot)
                                    return (
                                        <a
                                            key={region.id}
                                            href={region.target}
                                            aria-label={`${region.number}. ${region.title}: ${region.subtitle}`}
                                            title={region.title}
                                        >
                                            <rect
                                                className="city-map__hotspot"
                                                x={rect.x}
                                                y={rect.y}
                                                width={rect.width}
                                                height={rect.height}
                                                rx="12"
                                            />
                                            {showHotspotGuides && (
                                                <text
                                                    className="city-map__debug-label"
                                                    x={region.hotspot.centerX}
                                                    y={region.hotspot.centerY}
                                                >
                                                    {region.number}
                                                </text>
                                            )}
                                        </a>
                                    )
                                })}
                            </svg>
                        </>
                    )}

                    {!artLoaded && (
                        <nav className="city-map__fallback-regions" aria-label="Selecionar região do mapa">
                            {regions.map((region) => (
                                <a href={region.target} key={region.id}>
                                    <strong>{region.number}. {region.title}</strong>
                                    <span>{region.subtitle}</span>
                                </a>
                            ))}
                        </nav>
                    )}
                </div>

                <nav className="city-map__mobile-nav" aria-label="Explorar as regiões da cidade">
                    <a className="city-map__mobile-link city-map__mobile-link--map" href="#mapa">
                        <span className="city-map__mobile-number">00</span>
                        <span><strong>Mapa da cidade</strong><small>Visão geral da metrópole</small></span>
                    </a>
                    {regions.map((region) => (
                        <a className="city-map__mobile-link" href={region.target} key={region.id}>
                            <span className="city-map__mobile-number">{region.number}</span>
                            <span><strong>{region.title}</strong><small>{region.subtitle}</small></span>
                            <span className="city-map__mobile-arrow" aria-hidden="true">↗</span>
                        </a>
                    ))}
                </nav>
            </section>

            <div className="city-chapters">
                {chapters.map((chapter) => (
                    <section
                        id={chapter.id}
                        className={`city-chapter city-chapter--${chapter.id}`}
                        key={chapter.id}
                        aria-labelledby={`chapter-title-${chapter.id}`}
                    >
                        <div className="city-chapter__inner">
                            <div className="city-chapter__eyebrow">
                                <span>{chapter.number}</span>
                                <span>{chapter.name}</span>
                            </div>
                            <p className="city-chapter__label">{chapter.eyebrow}</p>
                            <h2 id={`chapter-title-${chapter.id}`}>{chapter.title}</h2>
                            <p className="city-chapter__description">{chapter.description}</p>
                            <a className="city-chapter__back" href="#mapa">
                                <span aria-hidden="true">↑</span> Voltar ao mapa
                            </a>
                        </div>
                    </section>
                ))}
            </div>
        </>
    )
}
