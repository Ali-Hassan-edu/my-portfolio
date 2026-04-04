import { useState, useEffect } from "react";

export default function Nav({ active, page, onPageChange }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "About", href: "#about", key: "about" },
    { label: "App Projects", href: "#app-projects", key: "app-projects" },
    { label: "Web Projects", href: "#web-projects", key: "web-projects" },
    { label: "Skills", href: "#skills", key: "skills" },
    { label: "Blog", key: "blog" },
    { label: "Contact", href: "#contact", key: "contact" },
  ];

  const handleLink = (link) => {
    setOpen(false);
    if (link.key === "blog") {
      onPageChange("blog");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (page !== "home") {
      onPageChange("home");
      setTimeout(() => {
        document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }
    document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 24px",
        background: scrolled ? "rgba(8,8,16,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => { onPageChange("home"); window.scrollTo({ top: 0 }); }}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#0ea5e9",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: "#fff",
          }}>AH</div>
          <span className="nav-name" style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>
            Ali Hassan
          </span>
        </button>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => handleLink(l)}
              className={`nav-link${active === l.key || (l.key === "blog" && page === "blog") ? " active" : ""}`}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => onPageChange("admin")}
            className="btn-primary nav-cta"
            style={{ padding: "9px 20px", fontSize: 13 }}
          >
            Admin
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="hamburger" onClick={() => setOpen(!open)}>
          <span style={{ transform: open ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </div>
      </nav>

      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 1099, background: "rgba(0,0,0,0.5)" }} />}

      {open && (
        <div className="nav-links open">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => handleLink(l)}
              className="nav-link"
              style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => { setOpen(false); onPageChange("admin"); }} className="btn-primary" style={{ padding: "12px 20px", fontSize: 15 }}>
            Admin Panel
          </button>
        </div>
      )}
    </>
  );
}
