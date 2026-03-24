import { useState } from "react";

export default function WebProjects({ projects }) {
  const [filter, setFilter] = useState("All");

  const cats = ["All", ...new Set((projects || []).map((p) => p.category).filter(Boolean))];
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  if (!projects || projects.length === 0) {
    return (
      <section id="web-projects" className="section" style={{ background: "rgba(255,255,255,0.01)" }}>
        <div className="container">
          <SectionHeader />
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
            No web projects yet. Add some in the admin panel.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="web-projects" className="section" style={{ background: "rgba(255,255,255,0.01)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#4DFFB4", marginBottom: 10, textTransform: "uppercase" }}>WEB DEVELOPMENT</div>
          <h2 className="section-title" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)", marginBottom: 20 }}>
            Web <span style={{ color: "#4DFFB4" }}>Projects</span>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto 28px" }}>
            Full-stack web applications, dashboards and APIs.
          </p>
          {cats.length > 1 && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {cats.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                    background: filter === f ? "rgba(77,255,180,0.15)" : "rgba(255,255,255,0.04)",
                    color: filter === f ? "#4DFFB4" : "rgba(255,255,255,0.4)",
                    outline: filter === f ? "1px solid rgba(77,255,180,0.35)" : "1px solid rgba(255,255,255,0.08)",
                    transition: "all 0.2s",
                  }}
                >{f}</button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 22 }}>
          {shown.map((p) => {
            const techList = Array.isArray(p.technologies) ? p.technologies : (p.technologies ? p.technologies.split(",").map((s) => s.trim()) : []);
            return (
              <div key={p.id} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Image */}
                {p.image_url ? (
                  <div style={{ height: 160, overflow: "hidden" }}>
                    <img src={p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ height: 120, background: `linear-gradient(135deg,${p.color || "#4DFFB4"}14,rgba(255,255,255,0.02))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: p.color || "#4DFFB4", opacity: 0.2 }}>WEB</span>
                  </div>
                )}
                <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>{p.title}</h3>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{p.year}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 12, flex: 1 }}>{p.description}</p>
                  {techList.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {techList.map((t) => (
                        <span key={t} style={{ padding: "2px 9px", background: "rgba(77,255,180,0.08)", borderRadius: 8, fontSize: 10, color: "#4DFFB4", fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10 }}>
                    {p.live_link && (
                      <a href={p.live_link} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#4DFFB4", textDecoration: "none" }}>Live Demo ↗</a>
                    )}
                    {p.github_link && (
                      <a href={p.github_link} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>GitHub ↗</a>
                    )}
                  </div>
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
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#4DFFB4", marginBottom: 10, textTransform: "uppercase" }}>WEB DEVELOPMENT</div>
      <h2 className="section-title" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)" }}>
        Web <span style={{ color: "#4DFFB4" }}>Projects</span>
      </h2>
    </div>
  );
}
