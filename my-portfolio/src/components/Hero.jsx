import { useState, useEffect } from "react";

export default function Hero({ info }) {
  const [y2, setY2] = useState(0);
  const [y14, setY14] = useState(0);
  const [y5, setY5] = useState(0);

  useEffect(() => {
    const animate = (setter, target) => {
      let n = 0;
      const step = target / (1200 / 16);
      const t = setInterval(() => {
        n += step;
        if (n >= target) { setter(target); clearInterval(t); }
        else setter(Math.floor(n));
      }, 16);
    };
    animate(setY2, info?.years_exp ?? 2);
    animate(setY14, info?.projects_count ?? 14);
    animate(setY5, 5);
  }, [info]);

  const fmt = (n) => (n < 10 ? `0${n}` : `${n}`);

  const esc = (str) => (str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const generateCV = () => {
    const cvHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${esc(info?.name ?? "Ali Hassan")} — CV</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#111;font-size:13px;line-height:1.6;}
.page{max-width:780px;margin:0 auto;padding:42px 48px;}
.header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #FF4D6D;padding-bottom:22px;margin-bottom:22px;}
.name{font-size:34px;font-weight:900;letter-spacing:-1px;color:#111;}
.tagline{font-size:13px;color:#666;margin-top:4px;}
.contact-info{text-align:right;font-size:12px;color:#444;line-height:1.8;}
.contact-info a{color:#FF4D6D;text-decoration:none;}
.section{margin-bottom:24px;}
.section-title{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#FF4D6D;margin-bottom:10px;border-bottom:1px solid #f0e0e4;padding-bottom:6px;}
.bio{font-size:13px;color:#444;line-height:1.8;}
.skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.skill-group-title{font-weight:700;font-size:12px;color:#333;margin-bottom:5px;}
.skill-tags{display:flex;flex-wrap:wrap;gap:5px;}
.skill-tag{font-size:11px;background:#f3f0ff;color:#6d4cbb;padding:3px 9px;border-radius:4px;font-weight:500;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.page{padding:28px 36px;}}
</style>
</head>
<body>
<div class="page">
<div class="header">
<div>
<div class="name">${esc(info?.name ?? "Ali Hassan")}</div>
<div class="tagline">${esc(info?.tagline ?? "")}</div>
<div class="tagline" style="margin-top:2px;color:#888;">Software Engineering Student · ${esc(info?.university ?? "COMSATS University")}</div>
</div>
<div class="contact-info">
<div><a href="mailto:${esc(info?.email)}">${esc(info?.email)}</a></div>
<div><a href="${esc(info?.linkedin)}" target="_blank">LinkedIn Profile</a></div>
<div><a href="${esc(info?.github)}" target="_blank">GitHub Profile</a></div>
<div>${esc(info?.location ?? "Pakistan")}</div>
</div>
</div>
<div class="section">
<div class="section-title">Profile</div>
<p class="bio">${esc(info?.bio ?? "")}</p>
</div>
<div class="section">
<div class="section-title">Technical Skills</div>
<div class="skills-grid">
<div><div class="skill-group-title">Frontend & Web</div><div class="skill-tags"><span class="skill-tag">React</span><span class="skill-tag">JavaScript</span><span class="skill-tag">HTML/CSS</span></div></div>
<div><div class="skill-group-title">Backend</div><div class="skill-tags"><span class="skill-tag">Node.js</span><span class="skill-tag">Express</span><span class="skill-tag">Supabase</span></div></div>
<div style="margin-top:10px;"><div class="skill-group-title">Mobile</div><div class="skill-tags"><span class="skill-tag">Android</span><span class="skill-tag">Java</span><span class="skill-tag">Kotlin</span></div></div>
<div style="margin-top:10px;"><div class="skill-group-title">AI & Data</div><div class="skill-tags"><span class="skill-tag">Python</span><span class="skill-tag">ML/AI</span><span class="skill-tag">TensorFlow</span></div></div>
</div>
</div>
</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(cvHTML); w.document.close(); }
  };

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
      {/* Subtle background gradient */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(167,139,250,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="container" style={{ width: "100%" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 56, alignItems: "center" }}>
          {/* LEFT */}
          <div className="hero-left" style={{ animation: "fadeUp 0.6s ease forwards" }}>
            <div className="hero-available" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: "rgba(77,255,180,0.08)", border: "1px solid rgba(77,255,180,0.2)", marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4DFFB4", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#4DFFB4", fontWeight: 600, letterSpacing: "0.06em" }}>
                {info?.available ? "OPEN TO WORK" : "NOT AVAILABLE"}
              </span>
            </div>

            <h1 className="hero-h1" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-2px", marginBottom: 24, fontSize: "clamp(44px,8vw,88px)" }}>
              <div style={{ color: "#fff" }}>ALI</div>
              <div style={{ background: "linear-gradient(135deg,#FF4D6D,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>HASSAN</div>
            </h1>

            <p className="hero-p" style={{ fontSize: "clamp(14px,1.5vw,16px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 480, marginBottom: 36 }}>
              {info?.tagline} — student at <strong style={{ color: "#fff" }}>COMSATS University</strong>, building with React, Node.js &amp; Android.
            </p>

            <div className="hero-btns" style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap" }}>
              <a href="#app-projects" className="btn-primary">View My Work →</a>
              <button onClick={generateCV} className="btn-secondary">Download CV ↓</button>
            </div>

            <div className="stats-row hero-stats" style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {[
                { n: fmt(y2), l: "Years Exp." },
                { n: fmt(y14), l: "Projects" },
                { n: fmt(y5), l: "Technologies" },
              ].map((s) => (
                <div key={s.l}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.n}<span style={{ color: "#FF4D6D" }}>+</span></div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div className="hero-socials" style={{ display: "flex", gap: 10, marginTop: 36, flexWrap: "wrap" }}>
              {[
                { label: "LinkedIn", href: info?.linkedin, bg: "rgba(10,102,194,0.1)", border: "rgba(10,102,194,0.3)", color: "#5aabff" },
                { label: "GitHub", href: info?.github, bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" },
                { label: "Email", href: `mailto:${info?.email}`, bg: "rgba(77,255,180,0.06)", border: "rgba(77,255,180,0.2)", color: "#4DFFB4" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                  padding: "8px 18px", borderRadius: 8, background: s.bg, border: `1px solid ${s.border}`,
                  color: s.color, fontSize: 12, fontWeight: 600, transition: "opacity 0.2s",
                  textDecoration: "none",
                }}>{s.label}</a>
              ))}
            </div>
          </div>

          {/* PHOTO placeholder card */}
          <div className="hero-photo" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 280, height: 350, borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "linear-gradient(135deg,rgba(255,77,109,0.08),rgba(167,139,250,0.08))",
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 72, fontWeight: 800, color: "rgba(255,255,255,0.06)" }}>AH</div>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "16px", background: "linear-gradient(to top, rgba(8,8,16,0.95), transparent)",
              }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>{info?.name ?? "Ali Hassan"}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Software Engineer · COMSATS</div>
                <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
                  {["React", "Node.js", "Android"].map((t) => (
                    <span key={t} style={{ padding: "2px 8px", borderRadius: 10, background: "rgba(167,139,250,0.15)", fontSize: 10, color: "#A78BFA", fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
