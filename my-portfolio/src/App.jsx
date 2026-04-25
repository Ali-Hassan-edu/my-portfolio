import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import BlogPage from "./pages/BlogPage";
import AdminPage from "./pages/AdminPage";
import { getProfile } from "./services/profileService";
import { getProjects } from "./services/projectsService";
import { getBlogPosts } from "./services/blogService";

const DEFAULT_INFO = {
  name: "Ali Hassan",
  tagline: "Planning · Development · Deployment · Flutter",
  bio: "Crafting excellence through precise Planning, agile Development, and seamless Deployment. I specialize in building high-performance web and mobile applications using React, Node.js, and Flutter.",
  about_bio: "Software Engineering student at COMSATS University Islamabad (Vehari Campus) with hands-on experience in Android and full-stack development. I specialize in building production-ready mobile and web applications, delivering end-to-end solutions from intuitive user interfaces to scalable backend systems. Committed to clean, maintainable code and driven by a focus on real-world impact, I continuously refine my skills through professional and freelance projects.",
  university: "COMSATS University Islamabad (Vehari Campus)",
  location: "Vehari, Pakistan",
  email: "raoali.edu@gmail.com",
  linkedin: "https://www.linkedin.com/in/ali-hassan-45b9b53b0",
  github: "https://github.com/Ali-Hassan-edu",
  profile_pic: "/profile.png",
  available: true,
  years_exp: 2,
  projects_count: 14,
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

:root {
  --cream: #F5F0E8;
  --cream2: #EDE8DC;
  --ink: #0D0D0D;
  --ink2: #1A1A1A;
  --ink3: #2A2A2A;
  --muted: #6B6560;
  --muted2: #9B9590;
  --red: #C8372D;
  --red2: #E04038;
  --border: rgba(13,13,13,0.12);
  --border2: rgba(13,13,13,0.06);
  --font-display: 'Bebas Neue', 'Arial Black', sans-serif;
  --font-serif: 'DM Serif Display', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --section-pad: clamp(60px, 10vw, 120px);
  --container-width: 1180px;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; overflow-x:hidden; width: 100%; }

body {
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-body);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  cursor: none;
}

@media (hover: none) and (pointer: coarse) {
  body { cursor: auto; }
  .cursor-dot, .cursor-ring { display: none !important; }
  a, button { cursor: pointer !important; }
}

.cursor-dot {
  width: 8px; height: 8px; background: var(--red);
  border-radius: 50%; position: fixed; pointer-events: none;
  z-index: 99999; transition: transform 0.1s ease;
  transform: translate(-50%, -50%);
}
.cursor-ring {
  width: 36px; height: 36px;
  border: 1.5px solid var(--ink); border-radius: 50%;
  position: fixed; pointer-events: none; z-index: 99998;
  transition: transform 0.18s ease, width 0.25s, height 0.25s, border-color 0.25s;
  transform: translate(-50%, -50%);
}
.cursor-ring.hovering { width: 56px; height: 56px; border-color: var(--red); }

a, button { cursor: none; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--cream2); }
::-webkit-scrollbar-thumb { background: var(--ink); border-radius: 0; }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.rv {
  opacity:0; transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
}
.rv.in { opacity:1; transform: translateY(0); }
.rv-l {
  opacity:0; transform: translateX(-40px);
  transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
}
.rv-l.in { opacity:1; transform: translateX(0); }
.rv-r {
  opacity:0; transform: translateX(40px);
  transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
}
.rv-r.in { opacity:1; transform: translateX(0); }

.rv-d1 { transition-delay: 0.1s !important; }
.rv-d2 { transition-delay: 0.2s !important; }
.rv-d3 { transition-delay: 0.3s !important; }

.section { padding: var(--section-pad) 0; position: relative; width: 100%; }
.container { width: 100%; max-width: var(--container-width); margin: 0 auto; padding: 0 40px; }

.label {
  font-family: var(--font-body); font-size: 10px; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted);
  display: flex; align-items: center; gap: 10px;
}
.label::before { content: ''; display: block; width: 28px; height: 1.5px; background: var(--muted); }

.display {
  font-family: var(--font-display);
  letter-spacing: 0.02em; line-height: 0.9; color: var(--ink);
  font-size: clamp(60px, 10vw, 130px);
}
.display-sm {
  font-family: var(--font-display);
  letter-spacing: 0.02em; line-height: 0.95; color: var(--ink);
  font-size: clamp(40px, 7vw, 88px);
}
.display .red, .display-sm .red { color: var(--red); }

.btn-dark {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--ink); color: var(--cream);
  padding: 14px 32px; border-radius: 0;
  font-family: var(--font-body); font-size: 12px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  text-decoration: none; border: none; cursor: none;
  transition: all 0.3s ease; position: relative; overflow: hidden;
}
.btn-dark::before {
  content: ''; position: absolute; inset: 0;
  background: var(--red); transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
}
.btn-dark:hover { letter-spacing: 0.12em; }
.btn-dark:hover::before { transform: scaleX(1); }
.btn-dark span { position: relative; z-index: 1; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 10px;
  background: transparent; color: var(--ink);
  padding: 13px 30px;
  border: 1.5px solid var(--ink);
  font-family: var(--font-body); font-size: 12px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  text-decoration: none; cursor: none;
  transition: all 0.3s ease;
}
.btn-outline:hover { background: var(--ink); color: var(--cream); }

.project-card {
  display: flex; flex-direction: column;
  background: #fff; border: 1px solid var(--border);
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
}
.project-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px rgba(0,0,0,0.08); }

@media (min-width: 900px) {
  .project-card.has-media { flex-direction: row; }
  .project-card.has-media > div:first-child { flex: 1.2; }
  .project-card.has-media > .project-media { flex: 1; border-left: 1px solid var(--border); }
}

.nav-link {
  font-size: 11px; font-weight: 700; color: var(--ink);
  letter-spacing: 0.12em; text-transform: uppercase;
  background: none; border: none; cursor: none;
  padding: 6px 0; position: relative;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  opacity: 0.6;
}
.nav-link::after {
  content: ''; position: absolute; bottom: -4px; left: 0;
  width: 0; height: 2px; background: var(--red);
  transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
}
.nav-link:hover, .nav-link.active { color: var(--ink); opacity: 1; }
.nav-link:hover::after, .nav-link.active::after { width: 100%; }

.nav-links { display: none; }

.hamburger { display:none; flex-direction:column; gap:5px; cursor:none; padding:6px; z-index: 1200; }
.hamburger span { width:22px; height:1.5px; background:var(--ink); transition:all 0.3s; display:block; }

input, textarea, select {
  width: 100%; background: transparent;
  border: none; border-bottom: 1.5px solid var(--border);
  padding: 14px 0; color: var(--ink);
  font-family: var(--font-body); font-size: 15px; font-weight: 400;
  outline: none; transition: border-color 0.3s;
}
input:focus, textarea:focus { border-color: var(--red); }
input::placeholder, textarea::placeholder { color: var(--muted2); }
textarea { resize: none; }

.marquee-wrap {
  overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: 14px 0; background: var(--ink); white-space: nowrap;
}
.marquee-track { display: inline-flex; gap: 0; animation: marquee 20s linear infinite; }
.marquee-item {
  font-family: var(--font-display); font-size: 22px; color: var(--cream);
  padding: 0 32px; letter-spacing: 0.06em;
  display: flex; align-items: center; gap: 32px;
}
.marquee-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); }

@media (max-width: 1024px) { .container { padding: 0 32px; } }

@media (max-width: 768px) {
  .container { padding: 0 24px; }
  .nav-links-desktop { display: none !important; }
  .hamburger { display: flex; }
  .nav-links {
    display: flex; flex-direction: column;
    position: fixed; top: 0; right: 0; bottom: 0; width: 100%;
    background: var(--cream); padding: 120px 40px 40px;
    gap: 12px; z-index: 1100;
    transform: translateX(100%); transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  .nav-links.open { transform: translateX(0); }
  .nav-links .nav-link { 
    font-size: 32px; font-weight: 800; font-family: var(--font-display); 
    padding: 16px 0; border-bottom: 1px solid var(--border2); width: 100%; 
    text-align: left; opacity: 1;
  }
  .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
  .hero-photo { justify-content: center !important; order: -1; margin-bottom: 40px; }
  .about-content-wrapper { grid-template-columns: 1fr !important; gap: 40px !important; }
  .info-cards-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important; }
}

.hr { border: none; border-top: 1px solid var(--border); }

.card-editorial {
  background: var(--cream2); border: 1px solid var(--border);
  padding: 28px 28px; position: relative;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
}
.card-editorial::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 3px; background: var(--red); transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
}
.card-editorial:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
.card-editorial:hover::after { transform: scaleX(1); }

@media (max-width: 480px) {
  .container { padding: 0 20px; }
  .display { font-size: 48px; }
  .display-sm { font-size: 36px; }
  .info-cards-grid { grid-template-columns: 1fr !important; }
}
`;

export default function App() {
  const [page, setPage] = useState("home");
  const [active, setActive] = useState("hero");
  const [showTop, setShowTop] = useState(false);
  const [info, setInfo] = useState(DEFAULT_INFO);
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [prof, web, app, blogs] = await Promise.all([
          getProfile(), getProjects("web"), getProjects("app"), getBlogPosts(true),
        ]);
        if (prof) setInfo(prof);
        setProjects([
          ...(app || []).map(p => ({ ...p, type: "app" })),
          ...(web || []).map(p => ({ ...p, type: "web" }))
        ].sort((a, b) => parseInt(b.year || 0) - parseInt(a.year || 0)));
        setBlogPosts(blogs || []);
      } catch (err) {
        console.error("Load error:", err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (page !== "home") return;
    const sections = ["hero","about","experience","projects","skills","contact"];
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { threshold: 0.2 }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [page]);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rv, .rv-l, .rv-r").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });

  useEffect(() => {
    const dot = document.getElementById("cur-dot");
    const ring = document.getElementById("cur-ring");
    if (!dot || !ring) return;
    const move = (e) => {
      dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px";
      ring.style.left = e.clientX + "px"; ring.style.top = e.clientY + "px";
    };
    const hover = () => ring.classList.add("hovering");
    const leave = () => ring.classList.remove("hovering");
    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, .card-editorial").forEach(el => {
      el.addEventListener("mouseenter", hover);
      el.addEventListener("mouseleave", leave);
    });
    return () => document.removeEventListener("mousemove", move);
  });

  return (
    <>
      <style>{CSS}</style>
      <div id="cur-dot" className="cursor-dot" />
      <div id="cur-ring" className="cursor-ring" />
      <Nav active={active} page={page} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }} />

      {page === "home" && (
        <main>
          <Hero info={info} />
          <About info={info} />
          <Experience />
          <Projects projects={projects} />
          <Skills />
          <Contact info={info} />
        </main>
      )}
      {page === "blog" && <BlogPage posts={blogPosts} onBack={() => { setPage("home"); window.scrollTo({ top: 0 }); }} />}
      {page === "admin" && <AdminPage onBack={() => { setPage("home"); window.scrollTo({ top: 0 }); }} />}
      {page === "home" && <Footer info={info} />}

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ position:"fixed", bottom:32, right:32, zIndex:999, width:48, height:48,
            background:"var(--ink)", border:"none", color:"var(--cream)", fontSize:20,
            cursor:"none", display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.background="var(--red)"}
          onMouseLeave={e=>e.currentTarget.style.background="var(--ink)"}
        >↑</button>
      )}
    </>
  );
}
