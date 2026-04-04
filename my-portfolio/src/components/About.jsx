export default function About({ info }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#0ea5e9", marginBottom: 10, textTransform: "uppercase" }}>WHO I AM</div>
          <h2 className="section-title" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)" }}>
            About <span style={{ color: "#0ea5e9" }}>Me</span>
          </h2>
        </div>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, marginBottom: 18 }}>{info?.bio}</p>
            <div className="about-info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 28 }}>
              {[
                { l: "University", v: info?.university },
                { l: "Location", v: info?.location },
                { l: "Email", v: info?.email },
                { l: "Experience", v: `${info?.years_exp ?? 2}+ Years` },
              ].map((item) => (
                <div key={item.l} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{item.l}</div>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 500, wordBreak: "break-word" }}>{item.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: 20, textTransform: "uppercase" }}>Experience</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { period: "2023 — Present", role: "B.S. Software Engineering", company: "COMSATS University, Vehari", desc: "Studying software engineering with focus on full-stack development, mobile applications, and AI.", accent: "#0ea5e9" },
                { period: "2024 — Present", role: "Full Stack Developer", company: "Freelance · Remote", desc: "Building full-stack web & Android apps for clients worldwide.", accent: "#0ea5e9" },
                { period: "2023 — 2024", role: "AI & ML Developer", company: "Academic Projects", desc: "Developed AI/ML projects as part of coursework and personal interest.", accent: "#0ea5e9" },
              ].map((t, i) => (
                <div key={i} style={{ padding: "16px 18px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", transition: "background 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.role}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{t.period}</div>
                  </div>
                  <div style={{ fontSize: 11, color: t.accent, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 4 }}>{t.company}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
