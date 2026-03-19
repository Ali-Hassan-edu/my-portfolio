import { useState, useEffect } from "react";

function parseCSV(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value) return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

export default function AppProjects({ projects }) {
  const [modal, setModal] = useState(null); // { project, idx }

  useEffect(() => {
    if (!modal) return;
    const screenshots = Array.isArray(modal.project.screenshots) ? modal.project.screenshots.filter(Boolean) : [];
    if (screenshots.length === 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") setModal(null);
      if (e.key === "ArrowRight") setModal((m) => ({ ...m, idx: (m.idx + 1) % screenshots.length }));
      if (e.key === "ArrowLeft") setModal((m) => ({ ...m, idx: (m.idx - 1 + screenshots.length) % screenshots.length }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

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
        <SectionHeader />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
          {projects.map((p) => (
            <AppCard
              key={p.id}
              project={p}
              onViewGallery={() => setModal({ project: p, idx: 0 })}
            />
          ))}
        </div>
      </div>

      {modal && (
        <ScreenshotModal
          project={modal.project}
          idx={modal.idx}
          setIdx={(idx) => setModal((m) => ({ ...m, idx }))}
          onClose={() => setModal(null)}
        />
      )}
    </section>
  );
}

function SectionHeader() {
  return (
    <div style={{ textAlign: "center", marginBottom: 52 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#A78BFA", marginBottom: 10, textTransform: "uppercase" }}>MOBILE APPS</div>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)", marginBottom: 14 }}>
        App{" "}
        <span style={{ background: "linear-gradient(135deg,#A78BFA,#FF4D6D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Projects
        </span>
      </h2>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto" }}>
        Android and cross-platform mobile applications.
      </p>
    </div>
  );
}

function AppCard({ project: p, onViewGallery }) {
  const techList = parseCSV(p.technologies);
  const featureList = parseCSV(p.features);
  const screenshots = Array.isArray(p.screenshots) ? p.screenshots.filter(Boolean) : [];
  const accentColor = p.color || "#A78BFA";

  return (
    <div className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Screenshot preview or placeholder */}
      <div
        style={{
          position: "relative",
          height: 200,
          background: `linear-gradient(135deg,${accentColor}18,rgba(255,255,255,0.02))`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: screenshots.length > 0 ? "pointer" : "default",
        }}
        onClick={screenshots.length > 0 ? onViewGallery : undefined}
      >
        {screenshots.length > 0 ? (
          <>
            {/* Phone mockup with first screenshot */}
            <div style={{
              width: 100,
              height: 170,
              borderRadius: 18,
              border: "4px solid rgba(255,255,255,0.14)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`,
              overflow: "hidden",
              flexShrink: 0,
              position: "relative",
              zIndex: 2,
            }}>
              <img
                src={screenshots[0]}
                alt={p.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {screenshots[1] && (
              <div style={{
                width: 88,
                height: 150,
                borderRadius: 16,
                border: "4px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                position: "absolute",
                right: "18%",
                opacity: 0.6,
                zIndex: 1,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}>
                <img
                  src={screenshots[1]}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
            {/* Gallery count badge */}
            {screenshots.length > 1 && (
              <div style={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "3px 10px",
                borderRadius: 12,
                background: "rgba(0,0,0,0.65)",
                backdropFilter: "blur(8px)",
                fontSize: 10,
                color: "rgba(255,255,255,0.75)",
                fontWeight: 600,
                zIndex: 3,
              }}>
                {screenshots.length} screenshots · tap to view
              </div>
            )}
          </>
        ) : (
          <span style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 800, color: accentColor, opacity: 0.2 }}>APP</span>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>{p.title}</h3>
          <div style={{ display: "flex", gap: 5, flexShrink: 0, marginLeft: 8 }}>
            {p.platform && (
              <span style={{ padding: "2px 8px", borderRadius: 6, background: `${accentColor}18`, fontSize: 10, color: accentColor, fontWeight: 600, whiteSpace: "nowrap" }}>
                {p.platform}
              </span>
            )}
            {p.year && (
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", paddingTop: 2 }}>{p.year}</span>
            )}
          </div>
        </div>

        {p.tagline && (
          <p style={{ fontSize: 12, color: accentColor, fontWeight: 600, marginBottom: 8, letterSpacing: "0.02em" }}>{p.tagline}</p>
        )}

        {p.description && (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 12, flex: 1 }}>{p.description}</p>
        )}

        {techList.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
            {techList.map((t) => (
              <span key={t} style={{ padding: "2px 9px", background: `${accentColor}10`, border: `1px solid ${accentColor}25`, borderRadius: 8, fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {featureList.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
            {featureList.slice(0, 4).map((f) => ( /* show up to 4 key features to keep card compact */
              <span key={f} style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ color: accentColor, fontSize: 8 }}>✦</span> {f}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
          {screenshots.length > 0 && (
            <button
              onClick={onViewGallery}
              style={{ fontSize: 12, fontWeight: 700, color: accentColor, background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "none" }}
            >
              View Gallery ({screenshots.length}) →
            </button>
          )}
          {p.github_link && (
            <a href={p.github_link} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ScreenshotModal({ project: p, idx, setIdx, onClose }) {
  const screenshots = Array.isArray(p.screenshots) ? p.screenshots.filter(Boolean) : [];
  const accentColor = p.color || "#A78BFA";
  const total = screenshots.length;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(16px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 20, right: 20,
          background: "rgba(255,255,255,0.08)", border: "none",
          color: "#fff", width: 36, height: 36, borderRadius: "50%",
          fontSize: 18, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}
      >×</button>

      {/* Project info */}
      <div style={{ textAlign: "center", marginBottom: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{p.title}</div>
        {p.tagline && <div style={{ fontSize: 12, color: accentColor, fontWeight: 600 }}>{p.tagline}</div>}
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
          Screenshot {idx + 1} of {total} · Press ← → to navigate · Esc to close
        </div>
      </div>

      {/* Image with phone frame */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex", alignItems: "center", gap: 20, maxHeight: "70vh",
        }}
      >
        <button
          onClick={() => setIdx((idx - 1 + total) % total)}
          style={{
            background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
            width: 42, height: 42, borderRadius: "50%", fontSize: 18,
            cursor: "pointer", flexShrink: 0,
          }}
        >‹</button>

        <div style={{
          borderRadius: 28,
          border: "6px solid rgba(255,255,255,0.14)",
          boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)`,
          overflow: "hidden",
          maxHeight: "65vh",
          maxWidth: "min(320px, 70vw)",
        }}>
          <img
            src={screenshots[idx]}
            alt={`${p.title} screenshot ${idx + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", maxHeight: "65vh" }}
          />
        </div>

        <button
          onClick={() => setIdx((idx + 1) % total)}
          style={{
            background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
            width: 42, height: 42, borderRadius: "50%", fontSize: 18,
            cursor: "pointer", flexShrink: 0,
          }}
        >›</button>
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: 6, marginTop: 20 }}>
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 20 : 6,
                height: 6, borderRadius: 3,
                background: i === idx ? accentColor : "rgba(255,255,255,0.2)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom links */}
      {p.github_link && (
        <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 20 }}>
          <a
            href={p.github_link}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
          >
            View on GitHub ↗
          </a>
        </div>
      )}
    </div>
  );
}
