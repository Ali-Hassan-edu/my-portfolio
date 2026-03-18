export default function Skills() {
  const groups = [
    { name: "Frontend & Web", color: "#FF4D6D", skills: ["React", "HTML/CSS", "JavaScript", "TypeScript", "Tailwind", "Next.js", "Vite"] },
    { name: "Backend", color: "#A78BFA", skills: ["Node.js", "Express", "Python", "REST APIs", "Firebase", "Supabase"] },
    { name: "Mobile", color: "#4DFFB4", skills: ["Android", "Java", "Kotlin", "SQLite", "Firebase Android"] },
    { name: "Tools & Databases", color: "#38BDF8", skills: ["Git", "GitHub", "VS Code", "Postman", "MySQL", "MongoDB"] },
    { name: "AI & Data", color: "#FB923C", skills: ["Python", "TensorFlow", "scikit-learn", "Pandas", "ML/AI"] },
    { name: "Systems & Other", color: "#F9A8D4", skills: ["C++", "Data Structures", "Algorithms", "Linux"] },
  ];

  return (
    <section id="skills" className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#4DFFB4", marginBottom: 10, textTransform: "uppercase" }}>CAPABILITIES</div>
          <h2 className="section-title" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)" }}>
            Skills &amp; <span style={{ background: "linear-gradient(135deg,#4DFFB4,#38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Technologies</span>
          </h2>
        </div>
        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {groups.map((g) => (
            <div key={g.name} className="card" style={{ padding: "22px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 6, height: 24, borderRadius: 3, background: g.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700 }}>{g.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{g.skills.length} skills</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {g.skills.map((s) => (
                  <span key={s} style={{ padding: "3px 10px", borderRadius: 6, background: `${g.color}10`, border: `1px solid ${g.color}25`, fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
