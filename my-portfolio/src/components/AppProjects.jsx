import { useState, useRef } from "react";

function hexAlpha(hex, alpha) {
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
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {shown.map((app, idx) => (
            <AppProjectCard key={app.id} app={app} reverse={idx % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AppProjectCard({ app, reverse }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const galleryRef = useRef(null);
  const screenshots = app.screenshots || [];
  const techList = Array.isArray(app.technologies)
    ? app.technologies
    : app.technologies
    ? app.technologies.split(",").map((s) => s.trim())
    : [];
  const featureList = Array.isArray(app.features)
    ? app.features
    : app.features
    ? app.features.split(",").map((s) => s.trim())
    : [];
  const accent = app.color || "#A78BFA";

  function scrollTo(i) {
    setActiveIdx(i);
    if (galleryRef.current) {
      const child = galleryRef.current.children[i];
      if (child) child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }

  function prev() { scrollTo(Math.max(0, activeIdx - 1)); }
  function next() { scrollTo(Math.min(screenshots.length - 1, activeIdx + 1)); }

  const hasScreenshots = screenshots.length > 0;

  return (
    <div
      className="card"
      style={{
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: hasScreenshots ? "240px 1fr" : "1fr",
      }}
    >
      {/* Screenshot gallery */}
      {hasScreenshots && (
        <div
          style={{
            order: reverse ? 1 : 0,
            background: "linear-gradient(160deg, rgba(0,0,0,0.45), rgba(0,0,0,0.25))",
            borderRight: !reverse ? "1px solid rgba(255,255,255,0.06)" : "none",
            borderLeft: reverse ? "1px solid rgba(255,255,255,0.06)" : "none",
            padding: "28px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* Phone mockup with main screenshot */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 148,
                height: 272,
                borderRadius: 22,
                border: `2px solid ${hexAlpha(accent, 0.4)}`,
                background: "#080810",
                overflow: "hidden",
                boxShadow: `0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)`,
                position: "relative",
              }}
            >
              {/* Notch bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 20,
                  background: "rgba(0,0,0,0.7)",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 40, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.15)" }} />
              </div>
              <img
                src={screenshots[activeIdx]}
                alt={`${app.title} screenshot ${activeIdx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
              />
            </div>

            {/* Prev / Next arrows */}
            {screenshots.length > 1 && (
              <>
                <button
                  onClick={prev}
                  disabled={activeIdx === 0}
                  style={{
                    position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)",
                    width: 28, height: 28, borderRadius: "50%",
                    background: activeIdx === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: activeIdx === 0 ? "rgba(255,255,255,0.15)" : "#fff",
                    cursor: activeIdx === 0 ? "default" : "pointer",
                    fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >‹</button>
                <button
                  onClick={next}
                  disabled={activeIdx === screenshots.length - 1}
                  style={{
                    position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)",
                    width: 28, height: 28, borderRadius: "50%",
                    background: activeIdx === screenshots.length - 1 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: activeIdx === screenshots.length - 1 ? "rgba(255,255,255,0.15)" : "#fff",
                    cursor: activeIdx === screenshots.length - 1 ? "default" : "pointer",
                    fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >›</button>
              </>
            )}
          </div>

          {/* Dot indicators */}
          {screenshots.length > 1 && (
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  style={{
                    width: i === activeIdx ? 16 : 5, height: 5,
                    borderRadius: 3,
                    background: i === activeIdx ? accent : "rgba(255,255,255,0.2)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </div>
          )}

          {/* Thumbnail strip */}
          {screenshots.length > 1 && (
            <div
              ref={galleryRef}
              style={{
                display: "flex", gap: 7, overflowX: "auto",
                maxWidth: 192, paddingBottom: 2,
                scrollbarWidth: "none",
              }}
            >
              {screenshots.map((img, i) => (
                <div
                  key={i}
                  onClick={() => scrollTo(i)}
                  style={{
                    flexShrink: 0, width: 40, height: 65,
                    borderRadius: 7, overflow: "hidden", cursor: "pointer",
                    border: `2px solid ${i === activeIdx ? accent : "rgba(255,255,255,0.1)"}`,
                    opacity: i === activeIdx ? 1 : 0.45,
                    transition: "all 0.15s", background: "#000",
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                </div>
              ))}
            </div>
          )}

          {screenshots.length > 0 && (
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
              {activeIdx + 1} / {screenshots.length}
            </div>
          )}
        </div>
      )}

      {/* Project info */}
      <div
        style={{
          order: reverse ? 0 : 1,
          padding: "30px 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span
            style={{
              padding: "3px 10px", borderRadius: 8,
              background: hexAlpha(accent, 0.1),
              fontSize: 10, color: accent, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
            }}
          >
            {app.platform || "Android"}
          </span>
          {app.year && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{app.year}</span>}
        </div>

        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(18px,2.5vw,26px)",
            fontWeight: 800, color: "#fff", marginBottom: 6, lineHeight: 1.2,
          }}
        >
          {app.title}
        </h3>

        {app.tagline && (
          <div style={{ fontSize: 13, color: accent, fontWeight: 600, marginBottom: 12 }}>{app.tagline}</div>
        )}

        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 16 }}>
          {app.description}
        </p>

        {featureList.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {featureList.map((f) => (
              <span
                key={f}
                style={{
                  padding: "3px 10px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, fontSize: 11, color: "rgba(255,255,255,0.45)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {techList.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {techList.map((t) => (
              <span
                key={t}
                style={{
                  padding: "3px 10px",
                  background: hexAlpha(accent, 0.08),
                  border: `1px solid ${hexAlpha(accent, 0.2)}`,
                  borderRadius: 8, fontSize: 11, color: accent, fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {app.github_link && (
          <a
            href={app.github_link}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "9px 20px", borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.65)",
              fontSize: 12, fontWeight: 600, textDecoration: "none",
              alignSelf: "flex-start", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          >
            View on GitHub ↗
          </a>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ filter, setFilter, platforms }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 52 }}>
      <div
        style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.15em",
          color: "#A78BFA", marginBottom: 10, textTransform: "uppercase",
        }}
      >
        MOBILE APPS
      </div>
      <h2
        style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800,
          letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)",
          marginBottom: 16, color: "#fff",
        }}
      >
        App{" "}
        <span
          style={{
            background: "linear-gradient(135deg,#A78BFA,#4DFFB4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}
        >
          Projects
        </span>
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
              padding: "6px 18px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: "pointer", border: "none",
              background: filter === f ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)",
              color: filter === f ? "#A78BFA" : "rgba(255,255,255,0.4)",
              outline: filter === f ? "1px solid rgba(167,139,250,0.4)" : "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.2s",
            }}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
