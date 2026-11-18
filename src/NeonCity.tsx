import ArgentCloudburst from "./ArgentCloudburst"
import PixelParallaxSkyline from "./PixelParallaxSkyline"

export default function NeonCity() {
    return (
        <main className="neon-city">
            <section className="neon-hero" aria-labelledby="neon-hero-title">
                <div className="neon-scene" aria-hidden="true">
                    <div className="neon-scene__skyline">
                        <PixelParallaxSkyline
                            background="#0B0812"
                            skyTop="#0B0A15"
                            skyHorizon="#28143D"
                            sunColor="#D8D1E2"
                            speed={16}
                            scale={100}
                            depth={55}
                            sunSize={18}
                            hover={92}
                            lamps
                            advanced={{
                                baseSpeed: 24,
                                cloudSpeed: 10,
                                farSpeed: 38,
                                frontSpeed: 120,
                                sunX: -2,
                                sunY: 38,
                                glowSize: 9,
                                glowStrength: 58,
                                haloStrength: 20,
                                skyDeep: "#100B1B",
                                skyMid: "#20132F",
                                cloudColor: "#B9B0C8",
                                cloudShadow: "#171020",
                                farTop: "#5D456F",
                                farBottom: "#30203F",
                                midTop: "#2B1A3B",
                                midBottom: "#17101F",
                                windowColor: "#F3EDF8",
                                windowWarm: "#D5B6EC",
                                windowDensity: 45,
                                hazeColor: "#704A98",
                                hazeStrength: 60,
                                reflection: 62,
                                railColor: "#AAA4B8",
                                lampColor: "#171226",
                                lampGlow: "#E0D7EE",
                                lampSpacing: 90,
                                lampX: 10,
                                parallax: 42,
                                seed: 7,
                                grain: 0,
                                vignette: 42,
                                hover: 92,
                            }}
                            style={{ minWidth: 0, minHeight: 0 }}
                        />
                    </div>

                    <div className="neon-scene__rain">
                        <ArgentCloudburst
                            background="#000000"
                            density={38}
                            baseColor="#DED8E3"
                            accentColor="#7017C8"
                            hover={88}
                            wind={2.9}
                            downpour={5.5}
                            tap={79}
                            tapEffect="splash"
                            speed={54}
                        />
                    </div>

                    <div className="neon-scene__shade" />
                </div>

                <div className="neon-hero__content">
                    <h1 id="neon-hero-title">
                        <span>Gabriel Felipe</span>
                        <span className="neon-hero__surname">Vizon</span>
                    </h1>
                    <p>
                        Explorando tecnologia, desenvolvimento e qualidade de
                        software.
                    </p>
                </div>
            </section>
        </main>
    )
}
