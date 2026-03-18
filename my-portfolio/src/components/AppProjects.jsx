import { useState } from "react";

function hexAlpha(hex, alpha) {
  // Convert 6-digit hex + opacity (0-1) to rgba
  const r = parseInt((hex || "#A78BFA").slice(1, 3), 16) || 167;
  const g = parseInt((hex || "#A78BFA").slice(3, 5), 16) || 139;
  const b = parseInt((hex || "#A78BFA").slice(5, 7), 16) || 250;
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function AppProjects({ projects }) {
  const [filter, setFilter] = useState("All");

  const platforms = ["All", "Android", "iOS"];
  const shown = filter === "All" ? projects : projects.filter((p) => (p.platform || "Android") === filter);

  if (!projects || projects.length === 0) {
    return (
      <section id="app-projects" className="section">
        <div className="container">
          <SectionHeader filter={filter} setFilter={setFilter} platforms={platforms} />
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
        <SectionHeader filter={filter} setFilter={setFilter} platforms={platforms} />
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {shown.map((app) => (
            <AppProjectCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppProjectCard({ app }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const screenshots = app.screenshots || [];
  const techList = Array.isArray(app.technologies) ? app.technologies : (app.technologies ? app.technologies.split(",").map((s) => s.trim()) : []);
  const featureList = Array.isArray(app.features) ? app.features : (app.features ? app.features.split(",").map((s) => s.trim()) : []);
  const accent = app.color || "#A78BFA";

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Top: screenshots gallery */}
      {screenshots.length > 0 && (
        <div style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "28px 28px 20px" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Main screenshot */}
            <div style={{
              width: 140, height: 256, borderRadius: 18, overflow: "hidden", flexShrink: 0,
              border: `2px solid ${hexAlpha(accent, 0.19)}`, boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
              background: "#000",
            }}>
              <img
                src={screenshots[activeIdx]}
                alt={`${app.title} screenshot ${activeIdx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
              />
            </div>
            {/* Thumbnail strip */}
            {screenshots.length > 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 256, overflowY: "auto" }}>
                {screenshots.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    style={{
                      width: 56, height: 96, borderRadius: 10, overflow: "hidden", cursor: "pointer", flexShrink: 0,
                      border: `2px solid ${activeIdx === i ? accent : "rgba(255,255,255,0.1)"}`,
                      opacity: activeIdx === i ? 1 : 0.55,
                      transition: "all 0.18s",
                      background: "#000",
                    }}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom: app info */}
      <div style={{ padding: "22px 28px 26px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ padding: "3px 10px", borderRadius: 8, background: hexAlpha(accent, 0.09), fontSize: 10, color: accent, fontWeight: 700, letterSpacing: "0.04em" }}>
            {app.platform || "Android"}
          </span>
          {app.year && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{app.year}</span>}
          {screenshots.length > 0 && (
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>
              {activeIdx + 1} / {screenshots.length}
            </span>
          )}
        </div>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(18px,3vw,26px)", fontWeight: 800, color: "#fff", marginBottom: 4 }}>{app.title}</h3>
        {app.tagline && <div style={{ fontSize: 13, color: accent, fontWeight: 600, marginBottom: 10 }}>{app.tagline}</div>}
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 14, maxWidth: 600 }}>{app.description}</p>

        {featureList.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {featureList.map((f) => (
              <span key={f} style={{ padding: "3px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 14, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{f}</span>
            ))}
          </div>
        )}

        {techList.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {techList.map((t) => (
              <span key={t} style={{ padding: "3px 10px", background: hexAlpha(accent, 0.07), borderRadius: 8, fontSize: 11, color: accent, fontWeight: 500 }}>{t}</span>
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
}

function SectionHeader({ filter, setFilter, platforms }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 52 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#A78BFA", marginBottom: 10, textTransform: "uppercase" }}>MOBILE APPS</div>
      <h2 className="section-title" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)", marginBottom: 20 }}>
        App <span style={{ background: "linear-gradient(135deg,#A78BFA,#4DFFB4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Projects</span>
      </h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto 28px" }}>
        Android apps built from scratch with Java, Kotlin and Firebase.
      </p>
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
  );
}

