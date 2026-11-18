import { useState } from "react"

type Region = {
    id: string
    number: string
    title: string
    subtitle: string
    target: string
    position: { left: string; top: string; width: string; height: string }
}

const regions: Region[] = [
    {
        id: "centro",
        number: "01",
        title: "Centro",
        subtitle: "Minha identidade",
        target: "#inicio",
        position: { left: "44.4%", top: "22.1%", width: "12.8%", height: "8.1%" },
    },
    {
        id: "tecnologia",
        number: "02",
        title: "Distrito Tecnológico",
        subtitle: "Habilidades e ferramentas",
        target: "#tecnologia",
        position: { left: "15.6%", top: "30.8%", width: "17.5%", height: "8.7%" },
    },
    {
        id: "carreira",
        number: "03",
        title: "Distrito Profissional",
        subtitle: "Experiências e carreira",
        target: "#carreira",
        position: { left: "74.5%", top: "31.2%", width: "18.5%", height: "8.7%" },
    },
    {
        id: "projetos",
        number: "04",
        title: "Zona de Projetos",
        subtitle: "Meus projetos e criações",
        target: "#projetos",
        position: { left: "25.4%", top: "62.1%", width: "17.2%", height: "8.4%" },
    },
    {
        id: "contato",
        number: "05",
        title: "Ponto de Conexão",
        subtitle: "Contato e redes",
        target: "#contato",
        position: { left: "69.8%", top: "65.1%", width: "17.8%", height: "8.4%" },
    },
]

const menuLinks = [
    { label: "Mapa", target: "#mapa", position: { left: "63.7%", width: "8.1%" } },
    { label: "Projetos", target: "#projetos", position: { left: "71.8%", width: "9.0%" } },
    { label: "Sobre", target: "#inicio", position: { left: "80.8%", width: "8.3%" } },
    { label: "Contato", target: "#contato", position: { left: "89.1%", width: "7.0%" } },
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

export default function CityMap() {
    const [artLoaded, setArtLoaded] = useState(true)

    return (
        <>
            <section id="mapa" className="city-map" aria-label="Mapa interativo da cidade">
                <div className="city-map__frame">
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
                            <nav className="city-map__image-nav" aria-label="Navegação principal">
                                {menuLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.target}
                                        aria-label={link.label}
                                        title={link.label}
                                        style={{
                                            left: link.position.left,
                                            width: link.position.width,
                                        }}
                                    />
                                ))}
                            </nav>

                            <div className="city-map__image-regions" aria-label="Selecionar região">
                                {regions.map((region) => (
                                    <a
                                        key={region.id}
                                        href={region.target}
                                        aria-label={`${region.number}. ${region.title}: ${region.subtitle}`}
                                        title={region.title}
                                        style={{
                                            left: region.position.left,
                                            top: region.position.top,
                                            width: region.position.width,
                                            height: region.position.height,
                                        }}
                                    />
                                ))}
                            </div>
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
