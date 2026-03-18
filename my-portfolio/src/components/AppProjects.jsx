import { useState } from "react";

export default function AppProjects({ projects }) {
  const [activeImg, setActiveImg] = useState({});
  const [filter, setFilter] = useState("All");

  const platforms = ["All", "Android", "iOS"];
  const shown = filter === "All" ? projects : projects.filter((p) => (p.platform || "Android") === filter);

  if (!projects || projects.length === 0) {
    return (
      <section id="app-projects" className="section">
        <div className="container">
          <SectionHeader />
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
            No app projects yet. Add some in the admin panel.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="app-projects" className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#A78BFA", marginBottom: 10, textTransform: "uppercase" }}>MOBILE APPS</div>
          <h2 className="section-title" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)", marginBottom: 20 }}>
            App <span style={{ background: "linear-gradient(135deg,#A78BFA,#4DFFB4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Projects</span>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto 28px" }}>
            Android apps built from scratch with Java, Kotlin and Firebase.
          </p>
          {/* Platform filter */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {platforms.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                  background: filter === f ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)",
                  color: filter === f ? "#A78BFA" : "rgba(255,255,255,0.4)",
                  outline: filter === f ? "1px solid rgba(167,139,250,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.2s",
                }}
              >{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {shown.map((app) => {
            const screenshots = app.screenshots || [];
            const imgIdx = activeImg[app.id] ?? 0;
            const currentImg = screenshots[imgIdx];
            const techList = Array.isArray(app.technologies) ? app.technologies : (app.technologies ? app.technologies.split(",").map((s) => s.trim()) : []);
            const featureList = Array.isArray(app.features) ? app.features : (app.features ? app.features.split(",").map((s) => s.trim()) : []);

            return (
              <div key={app.id} className="card" style={{ display: "flex", gap: 32, alignItems: "flex-start", padding: 32, flexWrap: "wrap" }}>
                {/* Phone mockup + thumbnails */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 160, height: 290, borderRadius: 24, overflow: "hidden",
                    border: "2px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.5)",
                    position: "relative",
                  }}>
                    {currentImg ? (
                      <img src={currentImg} alt={app.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>No image</div>
                    )}
                  </div>
                  {/* Thumbnail strip */}
                  {screenshots.length > 1 && (
                    <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap", justifyContent: "center", maxWidth: 200 }}>
                      {screenshots.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveImg((prev) => ({ ...prev, [app.id]: i }))}
                          style={{
                            width: 36, height: 56, borderRadius: 6, overflow: "hidden", cursor: "pointer",
                            border: `2px solid ${imgIdx === i ? (app.color || "#A78BFA") : "rgba(255,255,255,0.1)"}`,
                            transition: "border-color 0.2s", flexShrink: 0,
                          }}
                        >
                          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                        </div>
                      ))}
                    </div>
                  )}
                  {screenshots.length > 0 && (
                    <div style={{ marginTop: 6, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{screenshots.length} screenshot{screenshots.length > 1 ? "s" : ""}</div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 8, background: "rgba(167,139,250,0.12)", fontSize: 10, color: "#A78BFA", fontWeight: 600 }}>
                      {app.platform || "Android"}
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{app.year}</span>
                  </div>
                  <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(17px,3vw,24px)", fontWeight: 800, color: "#fff", marginBottom: 6 }}>{app.title}</h3>
                  <div style={{ fontSize: 13, color: app.color || "#A78BFA", fontWeight: 600, marginBottom: 10 }}>{app.tagline || ""}</div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 14, maxWidth: 540 }}>{app.description}</p>
                  {featureList.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      {featureList.map((f) => (
                        <span key={f} style={{ padding: "3px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 16, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{f}</span>
                      ))}
                    </div>
                  )}
                  {techList.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {techList.map((t) => (
                        <span key={t} style={{ padding: "3px 10px", background: "rgba(167,139,250,0.08)", borderRadius: 10, fontSize: 11, color: "#A78BFA", fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {app.github_link && (
                    <a href={app.github_link} target="_blank" rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
                    >View on GitHub ↗</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: 52 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#A78BFA", marginBottom: 10, textTransform: "uppercase" }}>MOBILE APPS</div>
      <h2 className="section-title" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)" }}>
        App <span style={{ background: "linear-gradient(135deg,#A78BFA,#4DFFB4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Projects</span>
      </h2>
    </div>
  );
}
