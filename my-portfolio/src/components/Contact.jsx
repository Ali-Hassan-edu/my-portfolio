import { useState } from "react";

export default function Contact({ info }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const WHATSAPP_NUMBER = "923270196155";

  const openWhatsApp = () => {
    const name = form.name || "Website visitor";
    const email = form.email || "no-email";
    const message = form.message || "I want to discuss a project/opportunity.";
    const msg = encodeURIComponent(`Hi Ali! I'm ${name} (${email}). ${message}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <section id="contact" className="section" style={{ background: "rgba(255,255,255,0.01)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", color: "#FF4D6D", marginBottom: 10, textTransform: "uppercase" }}>GET IN TOUCH</div>
          <h2 className="section-title" style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, letterSpacing: "-1.5px", fontSize: "clamp(32px,5vw,52px)", marginBottom: 14 }}>
            Contact <span style={{ color: "#FF4D6D" }}>Me</span>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", maxWidth: 460, margin: "0 auto" }}>Share your details and connect via WhatsApp or email.</p>
        </div>
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text" placeholder="Your full name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email" placeholder="your@email.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <textarea
              rows={5} placeholder="Tell me about your project or opportunity..." value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={openWhatsApp} className="btn-primary">💬 WhatsApp Me</button>
              <a href={`mailto:${info?.email}`} className="btn-secondary">✉️ Email Me</a>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { name: "LinkedIn", sub: "Connect professionally", href: info?.linkedin, color: "#5aabff" },
              { name: "GitHub", sub: "See my open source work", href: info?.github, color: "rgba(255,255,255,0.75)" },
              { name: info?.email, sub: "Direct email", href: `mailto:${info?.email}`, color: "#4DFFB4" },
            ].map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="card"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", textDecoration: "none" }}>
                <div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: s.color }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{s.sub}</div>
                </div>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }}>↗</span>
              </a>
            ))}
            <div style={{ padding: "18px 20px", borderRadius: 14, background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>💬</span>
                <span style={{ fontSize: 12, color: "#25D366", fontWeight: 700 }}>WhatsApp Available</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                Message Ali on WhatsApp for <strong style={{ color: "#fff" }}>quick replies</strong>, or use email for formal inquiries.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
