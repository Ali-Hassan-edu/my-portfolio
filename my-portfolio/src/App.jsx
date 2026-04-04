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

/* ===== ANIMATIONS ===== */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 140, 0, 0.5); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== BASE STYLES ===== */
*,*::before,*::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; overflow-x: hidden; }

body {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f2e 100%);
  color: #f5f5f5;
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 140, 0, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 50% 0%, rgba(255, 165, 0, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: rgba(26, 31, 46, 0.5); }
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #D4AF37, #FF8C00);
  border-radius: 10px;
  border: 2px solid rgba(26, 31, 46, 0.5);
}
::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #FFB800, #FFA500); }

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }

section[id] { scroll-margin-top: 80px; position: relative; }

/* ===== TEXT EFFECTS ===== */
.grad-text {
  background: linear-gradient(135deg, #FFB800, #FF8C00, #FFA500, #D4AF37, #FFB800);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 6s ease infinite;
  font-weight: 700;
}

h1, h2, h3, h4, h5, h6 {
  animation: slideInUp 0.8s ease-out;
}

p, span {
  animation: slideInUp 0.8s ease-out;
  animation-fill-mode: both;
}

/* ===== LAYOUT ===== */
.section { padding: 80px 0; position: relative; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

/* ===== BUTTONS ===== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FFB800, #FF8C00, #FFA500);
  color: #0a0e27;
  border: none;
  padding: 12px 26px;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.6), 0 0 30px rgba(255, 140, 0, 0.4);
}

.btn-primary:active {
  transform: translateY(-1px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #f5f5f5;
  border: 2px solid;
  border-image: linear-gradient(135deg, #FFB800, #FF8C00, #FFA500) 1;
  padding: 12px 26px;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
  transition: left 0.5s;
  z-index: 0;
}

.btn-secondary:hover {
  background: rgba(212, 175, 55, 0.1);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(255, 140, 0, 0.1);
  transform: translateY(-2px);
}

.btn-secondary:hover::before {
  left: 100%;
}

/* ===== CARDS ===== */
.card {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(255, 140, 0, 0.08));
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: slideInUp 0.6s ease-out;
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transform: rotate(45deg);
  animation: spin-slow 4s linear infinite;
  opacity: 0;
}

.card:hover {
  border-color: rgba(212, 175, 55, 0.6);
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(255, 140, 0, 0.15));
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.25), 0 0 20px rgba(255, 140, 0, 0.2);
  transform: translateY(-8px);
}

.card:hover::before {
  opacity: 1;
}

/* ===== FORM ELEMENTS ===== */
input, textarea, select {
  width: 100%;
  background: rgba(212, 175, 55, 0.06);
  border: 1.5px solid rgba(212, 175, 55, 0.25);
  border-radius: 12px;
  padding: 11px 14px;
  color: #f5f5f5;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

input:focus, textarea:focus, select:focus {
  border-color: rgba(212, 175, 55, 0.9);
  background: rgba(212, 175, 55, 0.12);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(212, 175, 55, 0.08);
  transform: translateY(-2px);
}

input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.35); }
textarea { resize: vertical; }
select option { background: #0a0e27; }

/* ===== NAVIGATION ===== */
.nav-link {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.04em;
  transition: all 0.3s ease;
  padding: 4px 0;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFB800, #FF8C00, #FFA500);
  transition: width 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  color: #FFB800;
}

.nav-link:hover::after, .nav-link.active::after {
  width: 100%;
}

/* ===== HAMBURGER ===== */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 6px;
  transition: all 0.3s ease;
}

.hamburger span {
  width: 22px;
  height: 2px;
  background: linear-gradient(90deg, #FFB800, #FF8C00, #FFA500);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger:hover span {
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .section { padding: 70px 0; }
  .container { padding: 0 20px; }
}

@media (max-width: 1000px) {
  .skills-grid { grid-template-columns: repeat(2,1fr) !important; }
  .section { padding: 60px 0; }
}

@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr !important; }
  .hero-photo { display: flex; justify-content: center; order: -1; }
  .hero-photo > div { width: 220px !important; height: 280px !important; }
  .about-grid { grid-template-columns: 1fr !important; }
  .contact-grid { grid-template-columns: 1fr !important; }
  .footer-inner { flex-direction: column !important; gap: 14px !important; text-align: center !important; }
  .section { padding: 50px 0; }
  .container { padding: 0 16px; }
}

@media (max-width: 768px) {
  .card[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  .btn-primary, .btn-secondary { font-size: 12px; padding: 10px 20px; }
}

@media (max-width: 640px) {
  .nav-links-desktop { display: none !important; }
  .nav-links {
    display: none;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 72%;
    max-width: 280px;
    background: linear-gradient(135deg, rgba(10, 14, 39, 0.95), rgba(26, 31, 46, 0.95));
    backdrop-filter: blur(20px);
    padding: 90px 24px 40px;
    gap: 4px;
    z-index: 1100;
    border-left: 1px solid rgba(212, 175, 55, 0.25);
    animation: slideInDown 0.3s ease-out;
  }
  .nav-links.open { display: flex; }
  .nav-links .nav-link { font-size: 16px; padding: 13px 0; border-bottom: 1px solid rgba(212, 175, 55, 0.15); width: 100%; }
  .hamburger { display: flex; }
  .nav-name { display: none !important; }
  .hero-h1 { font-size: clamp(38px, 14vw, 80px) !important; letter-spacing: -1px !important; }
  .hero-left { text-align: center !important; }
  .hero-available { justify-content: center !important; }
  .hero-btns { justify-content: center !important; gap: 8px !important; flex-wrap: wrap !important; }
  .hero-stats { justify-content: center !important; }
  .hero-socials { justify-content: center !important; }
  .hero-p { text-align: center !important; margin-left: auto !important; margin-right: auto !important; font-size: 14px !important; }
  .about-info-grid { grid-template-columns: 1fr !important; }
  .skills-grid { grid-template-columns: 1fr !important; }
  .section { padding: 40px 0; }
  .container { padding-left: 16px !important; padding-right: 16px !important; }
  .nav-cta { display: none; }
  input, textarea { font-size: 16px; }
}

@media (max-width: 480px) {
  .hero-h1 { font-size: clamp(28px, 12vw, 48px) !important; }
  .section { padding: 30px 0; }
  .grad-text { font-size: 24px; }
  .btn-primary, .btn-secondary { padding: 8px 16px; font-size: 11px; }
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
            background: "linear-gradient(135deg, #FFB800, #FF8C00)",
            border: "none", color: "#0a0e27", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(212, 175, 55, 0.4)",
          }}
          title="Back to top"
        >↑</button>
      )}
    </>
  );
}
