import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import AppProjects from "./components/AppProjects";
import WebProjects from "./components/WebProjects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import BlogPage from "./pages/BlogPage";
import AdminPage from "./pages/AdminPage";
import { getProfile } from "./services/profileService";
import { getProjects } from "./services/projectsService";
import { getBlogPosts } from "./services/blogService";

const DEFAULT_INFO = {
  name: "Ali Hassan",
  tagline: "Building modern web & app experiences",
  bio: "Software Engineering student at COMSATS University Islamabad, Vehari Campus. I build high-quality web and Android applications using React, Node.js, Java and modern AI tools.",
  university: "COMSATS University, Vehari",
  location: "Vehari, Pakistan",
  email: "raoali.edu@gmail.com",
  linkedin: "https://www.linkedin.com/in/ali-hassan-45b9b53b0",
  github: "https://github.com/Ali-Hassan-edu",
  available: true,
  years_exp: 2,
  projects_count: 14,
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');

*,*::before,*::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; overflow-x: hidden; }
body { background: #080810; color: #fff; font-family: 'DM Sans', sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(255,77,109,0.5); border-radius: 2px; }
a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

section[id] { scroll-margin-top: 80px; }

.grad-text {
  color: #A78BFA;
}

.section { padding: 80px 0; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #FF4D6D;
  color: #fff; border: none; padding: 12px 26px; border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
  letter-spacing: 0.03em; cursor: pointer; text-decoration: none;
  transition: opacity 0.2s ease;
}
.btn-primary:hover { opacity: 0.88; }
.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: #fff;
  border: 1px solid rgba(255,255,255,0.18);
  padding: 12px 26px; border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; text-decoration: none; transition: all 0.2s;
}
.btn-secondary:hover { border-color: rgba(255,255,255,0.45); background: rgba(255,255,255,0.04); }

.card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; transition: border-color 0.2s ease, background 0.2s ease;
}
.card:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.048); }

input, textarea, select {
  width: 100%; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
  padding: 11px 14px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px;
  outline: none; transition: border-color 0.25s;
}
input:focus, textarea:focus, select:focus { border-color: rgba(255,77,109,0.6); }
input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
textarea { resize: vertical; }
select option { background: #111; }

/* NAV */
.nav-link {
  font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55);
  letter-spacing: 0.04em; transition: color 0.2s; padding: 4px 0;
}
.nav-link:hover, .nav-link.active { color: #FF4D6D; }

/* HAMBURGER */
.hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px; }
.hamburger span { width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.3s; }

/* RESPONSIVE */
@media (max-width: 1000px) {
  .skills-grid { grid-template-columns: repeat(2,1fr) !important; }
}
@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr !important; }
  .hero-photo { display: flex; justify-content: center; order: -1; }
  .hero-photo > div { width: 220px !important; height: 280px !important; }
  .about-grid { grid-template-columns: 1fr !important; }
  .contact-grid { grid-template-columns: 1fr !important; }
  .footer-inner { flex-direction: column !important; gap: 14px !important; text-align: center !important; }
  .section { padding: 60px 0; }
}
@media (max-width: 768px) {
  .card[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
}
@media (max-width: 640px) {
  .nav-links-desktop { display: none !important; }
  .nav-links {
    display: none; flex-direction: column;
    position: fixed; top: 0; right: 0; bottom: 0; width: 72%; max-width: 280px;
    background: rgba(8,8,16,0.99); backdrop-filter: blur(20px);
    padding: 90px 24px 40px; gap: 4px; z-index: 1100;
    border-left: 1px solid rgba(255,255,255,0.08);
  }
  .nav-links.open { display: flex; }
  .nav-links .nav-link { font-size: 16px; padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.06); width: 100%; }
  .hamburger { display: flex; }
  .nav-name { display: none !important; }
  .hero-h1 { font-size: clamp(38px, 14vw, 80px) !important; letter-spacing: -1px !important; }
  .hero-left { text-align: center !important; }
  .hero-available { justify-content: center !important; }
  .hero-btns { justify-content: center !important; }
  .hero-stats { justify-content: center !important; }
  .hero-socials { justify-content: center !important; }
  .hero-p { text-align: center !important; margin-left: auto !important; margin-right: auto !important; }
  .about-info-grid { grid-template-columns: 1fr !important; }
  .skills-grid { grid-template-columns: 1fr !important; }
  .container { padding-left: 16px !important; padding-right: 16px !important; }
  .nav-cta { display: none; }
}
`;

export default function App() {
  const [page, setPage] = useState("home");
  const [active, setActive] = useState("hero");
  const [showTop, setShowTop] = useState(false);

  const [info, setInfo] = useState(DEFAULT_INFO);
  const [appProjects, setAppProjects] = useState([]);
  const [webProjects, setWebProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);


  // Load data from Supabase once
  useEffect(() => {
    async function load() {
      const [prof, web, app, blogs] = await Promise.all([
        getProfile(),
        getProjects("web"),
        getProjects("app"),
        getBlogPosts(true),
      ]);
      if (prof) setInfo(prof);
      setWebProjects(web);
      setAppProjects(app);
      setBlogPosts(blogs);
    }

    load();
  }, []);

  // Intersection observer for nav active state
  useEffect(() => {
    if (page !== "home") return;
    const sections = ["hero", "about", "app-projects", "web-projects", "skills", "contact"];
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { threshold: 0.25 }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [page]);

  // Scroll-to-top button
  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <Nav active={active} page={page} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }} />

      {page === "home" && (
        <main>
          <Hero info={info} />
          <About info={info} />
          <AppProjects projects={appProjects} />
          <WebProjects projects={webProjects} />
          <Skills />
          <Contact info={info} />
        </main>
      )}

      {page === "blog" && (
        <BlogPage posts={blogPosts} onBack={() => { setPage("home"); window.scrollTo({ top: 0 }); }} />
      )}

      {page === "admin" && (
        <AdminPage onBack={() => { setPage("home"); window.scrollTo({ top: 0 }); }} />
      )}

      {page === "home" && <Footer info={info} />}

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 999,
            width: 42, height: 42, borderRadius: "50%",
            background: "linear-gradient(135deg,#FF4D6D,#A78BFA)",
            border: "none", color: "#fff", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(255,77,109,0.25)",
          }}
          title="Back to top"
        >↑</button>
      )}
    </>
  );
}
