export default function Footer({ info }) {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "28px 24px" }}>
      <div className="container">
        <div className="footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: "linear-gradient(135deg,#FF4D6D,#A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 12, color: "#fff",
            }}>AH</div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2026 Ali Hassan — All Rights Reserved</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              ["LinkedIn", info?.linkedin],
              ["GitHub", info?.github],
              ["Email", `mailto:${info?.email}`],
            ].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
