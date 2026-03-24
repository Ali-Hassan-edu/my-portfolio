import { useState, useEffect } from "react";

function parseCSV(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value) return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

export default function AppProjects({ projects }) {
  const [modal, setModal] = useState(null);

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

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {projects.map((p) => (
            <AppCard
              key={p.id}
              project={p}
              onViewGallery={(idx) => setModal({ project: p, idx: idx || 0 })}
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
        <span className="grad-text">
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
    <div className="card" style={{
      display: "grid",
      gridTemplateColumns: screenshots.length > 0 ? "1fr 1fr" : "1fr",
      overflow: "hidden",
    }}>
      {/* Left: Project Details */}
      <div style={{ padding: "28px 28px 24px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          {p.platform && (
            <span style={{ padding: "3px 10px", borderRadius: 6, background: `${accentColor}18`, fontSize: 10, color: accentColor, fontWeight: 600 }}>
              {p.platform}
            </span>
          )}
          {p.year && (
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{p.year}</span>
          )}
        </div>

        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{p.title}</h3>

        {p.tagline && (
          <p style={{ fontSize: 13, color: accentColor, fontWeight: 600, marginBottom: 10, letterSpacing: "0.02em" }}>{p.tagline}</p>
        )}

        {p.description && (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 16 }}>{p.description}</p>
        )}

        {techList.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {techList.map((t) => (
              <span key={t} style={{ padding: "3px 10px", background: `${accentColor}10`, border: `1px solid ${accentColor}25`, borderRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {featureList.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {featureList.slice(0, 5).map((f) => (
              <span key={f} style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: accentColor, fontSize: 8 }}>●</span> {f}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
          {screenshots.length > 0 && (
            <button
              onClick={() => onViewGallery(0)}
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: 12 }}
            >
              Screenshots ({screenshots.length})
            </button>
          )}
          {p.github_link && (
            <a href={p.github_link} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              GitHub ↗
            </a>
          )}
        </div>
      </div>

      {/* Right: Screenshot Strip */}
      {screenshots.length > 0 && (
        <div style={{
          display: "flex",
          gap: 10,
          padding: "20px 20px 20px 0",
          overflowX: "auto",
          alignItems: "center",
          background: `linear-gradient(135deg,${accentColor}08,rgba(255,255,255,0.01))`,
        }}>
          {screenshots.map((src, i) => (
            <div
              key={i}
              onClick={() => onViewGallery(i)}
              style={{
                flexShrink: 0,
                width: 110,
                height: 200,
                borderRadius: 14,
                border: "2px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={src}
                alt={`${p.title} screenshot ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
      )}
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

      {/* Image viewer area (no phone frame) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex", alignItems: "center", gap: 20, flex: 1, minHeight: 0, width: "100%", justifyContent: "center"
        }}
      >
        <button
          onClick={() => setIdx((idx - 1 + total) % total)}
          style={{
            background: "rgba(255,255,255,0.08)", border: "none", color: "#fff",
            width: 48, height: 48, borderRadius: "50%", fontSize: 24,
            cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >‹</button>

        <div style={{
          borderRadius: 16,
          boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)`,
          overflow: "hidden",
          maxHeight: "100%",
          maxWidth: "80vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0,0,0,0.4)"
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
            width: 48, height: 48, borderRadius: "50%", fontSize: 24,
            cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >›</button>
      </div>

      {/* Thumbnail row */}
      {total > 1 && (
        <div onClick={(e) => e.stopPropagation()} style={{ 
          display: "flex", gap: 12, marginTop: 24, padding: "10px 0", 
          overflowX: "auto", maxWidth: "90vw", alignItems: "center",
          /* Hide scrollbar for cleaner look */
          msOverflowStyle: "none", scrollbarWidth: "none" 
        }}>
          <style>{"div::-webkit-scrollbar { display: none; }"}</style>
          {screenshots.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: 60, height: 100, flexShrink: 0, padding: 0,
                borderRadius: 8, overflow: "hidden", cursor: "pointer",
                border: i === idx ? `2px solid ${accentColor}` : "2px solid transparent",
                opacity: i === idx ? 1 : 0.5,
                transition: "all 0.2s",
                background: "#000"
              }}
            >
              <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Thumbnail ${i + 1}`} />
            </button>
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
