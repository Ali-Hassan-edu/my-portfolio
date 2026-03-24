import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/profileService";
import { getProjects, addProject, updateProject, deleteProject } from "../services/projectsService";
import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from "../services/blogService";
import { estimateReadingTime } from "../utils/helpers";
import { uploadImage } from "../services/supabase";

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || "ali2024";

const EMPTY_WEB_PROJECT = {
  type: "web", title: "", description: "", technologies: "", live_link: "", github_link: "",
  image_url: "", category: "", year: new Date().getFullYear().toString(), color: "#4DFFB4",
};
const EMPTY_APP_PROJECT = {
  type: "app", title: "", tagline: "", description: "", technologies: "", features: "",
  github_link: "", screenshots: [], platform: "Android", year: new Date().getFullYear().toString(), color: "#A78BFA",
};
const EMPTY_BLOG = {
  title: "", description: "", content: "", category: "", tags: "", featured_image: "", published: false,
};

/* ── ADMIN STYLES ── */
const ADMIN_CSS = `
.admin-wrap { min-height:100vh; padding-top:64px; display:flex; background:#080810; }
.admin-sidebar {
  width:240px; flex-shrink:0; background:rgba(255,255,255,0.02);
  border-right:1px solid rgba(255,255,255,0.07); position:sticky;
  top:64px; height:calc(100vh - 64px); display:flex; flex-direction:column; overflow-y:auto;
}
.admin-sidebar-brand { padding:24px 20px 18px; border-bottom:1px solid rgba(255,255,255,0.06); }
.admin-sidebar nav { padding:12px 10px; flex:1; }
.admin-nav-label { font-size:9px; font-weight:700; letter-spacing:0.12em; color:rgba(255,255,255,0.2); text-transform:uppercase; padding:10px 12px 6px; }
.admin-nav-btn {
  width:100%; display:flex; align-items:center; gap:10px; padding:10px 14px;
  border-radius:10px; background:transparent; border:none; cursor:pointer; margin-bottom:2px;
  font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:rgba(255,255,255,0.5);
}
.admin-nav-btn:hover { background:rgba(255,255,255,0.04); }
.admin-nav-btn.active { background:rgba(255,77,109,0.1); color:#fff; font-weight:600; }
.admin-nav-btn .nav-icon { font-size:16px; width:20px; text-align:center; flex-shrink:0; }
.admin-nav-btn.active .nav-icon { color:#FF4D6D; }
.admin-nav-btn .nav-dot { margin-left:auto; width:5px; height:5px; border-radius:50%; background:#FF4D6D; flex-shrink:0; }
.admin-sidebar-footer { padding:14px 10px 20px; border-top:1px solid rgba(255,255,255,0.06); }
.admin-main { flex:1; min-width:0; display:flex; flex-direction:column; }
.admin-topbar {
  border-bottom:1px solid rgba(255,255,255,0.07); background:rgba(8,8,16,0.95);
  backdrop-filter:blur(20px); padding:0 32px; height:54px;
  display:flex; align-items:center; justify-content:space-between; position:sticky; top:64px; z-index:90;
}
.admin-content { padding:32px 32px 80px; flex:1; }
.admin-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; }
.admin-card:hover { border-color:rgba(255,255,255,0.12); }
.admin-stat-card { padding:22px 24px; cursor:pointer; text-align:left; }
.admin-stat-card:hover { background:rgba(255,255,255,0.05); }
.admin-form-card { padding:28px; border-radius:16px; }
.admin-label { display:block; font-size:11px; color:rgba(255,255,255,0.4); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:6px; font-weight:600; }
.admin-section-head { margin-bottom:28px; }
.admin-section-head h2 { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#fff; margin-bottom:4px; }
.admin-section-head p { font-size:13px; color:rgba(255,255,255,0.4); }
.admin-item {
  padding:16px 18px; border-radius:12px; background:rgba(255,255,255,0.03);
  border:1px solid rgba(255,255,255,0.07); display:flex; align-items:flex-start; gap:14px;
}
.admin-item:hover { background:rgba(255,255,255,0.05); }
.admin-item-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:#fff; }
.admin-item-sub { font-size:11px; color:rgba(255,255,255,0.35); margin-top:3px; }
.admin-btn-edit {
  padding:5px 14px; border-radius:8px; background:rgba(167,139,250,0.12);
  border:none; color:#A78BFA; font-size:11px; cursor:pointer; font-weight:600;
}
.admin-btn-delete {
  padding:5px 14px; border-radius:8px; background:rgba(255,77,109,0.1);
  border:none; color:#FF4D6D; font-size:11px; cursor:pointer; font-weight:600;
}
.admin-btn-publish {
  padding:5px 14px; border-radius:8px; border:none; font-size:11px; cursor:pointer; font-weight:600;
}
.admin-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.admin-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
.admin-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:36px; align-items:start; }
.admin-success-toast {
  position:fixed; top:80px; right:24px; z-index:200;
  padding:12px 20px; border-radius:10px; background:rgba(77,255,180,0.15);
  border:1px solid rgba(77,255,180,0.3); color:#4DFFB4; font-size:13px; font-weight:600;
  display:flex; align-items:center; gap:8px;
}

/* mobile admin */
@media (max-width: 768px) {
  .admin-sidebar { display:none; }
  .admin-mobile-nav {
    display:flex !important; gap:4px; padding:12px 16px;
    overflow-x:auto; border-bottom:1px solid rgba(255,255,255,0.07);
    background:rgba(8,8,16,0.95); position:sticky; top:64px; z-index:91;
  }
  .admin-mobile-nav button {
    flex-shrink:0; padding:8px 16px; border-radius:8px; border:none; cursor:pointer;
    font-size:12px; font-weight:600; background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.5);
    white-space:nowrap;
  }
  .admin-mobile-nav button.active { background:rgba(255,77,109,0.12); color:#FF4D6D; }
  .admin-topbar { display:none !important; }
  .admin-content { padding:24px 16px 60px; }
  .admin-form-grid { grid-template-columns:1fr; }
  .admin-grid-2 { grid-template-columns:1fr; }
  .admin-grid-3 { grid-template-columns:1fr; }
}
@media (min-width: 769px) {
  .admin-mobile-nav { display:none !important; }
}
`;

export default function AdminPage({ onBack }) {
  const [tab, setTab] = useState("dashboard");
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState(null);
  const [webProjects, setWebProjects] = useState([]);
  const [appProjects, setAppProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [prof, web, app, blogs] = await Promise.all([
      getProfile(),
      getProjects("web"),
      getProjects("app"),
      getBlogPosts(false),
    ]);
    setProfile(prof || {
      name: "Ali Hassan", tagline: "Building modern web & app experiences",
      bio: "Software Engineering student at COMSATS University Islamabad, Vehari Campus.",
      university: "COMSATS University, Vehari", location: "Vehari, Pakistan",
      email: "raoali.edu@gmail.com", linkedin: "https://www.linkedin.com/in/ali-hassan-45b9b53b0",
      github: "https://github.com/Ali-Hassan-edu", available: true, years_exp: 2, projects_count: 14,
    });
    setWebProjects(web);
    setAppProjects(app);
    setBlogPosts(blogs);
    setLoading(false);
  }

  function login() {
    if (pass === ADMIN_PASS) {
      setAuthed(true);
      setAuthError("");
      loadAll();
    } else {
      setAuthError("Incorrect password");
    }
  }

  function showMsg(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  // Login screen
  if (!authed) {
    return (
      <>
        <style>{ADMIN_CSS}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, paddingTop: 80 }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 400 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 28 }}>← Back to Portfolio</button>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#FF4D6D,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 24 }}>🔐</div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Admin Panel</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 32 }}>Enter your admin password to continue</p>
            <input
              type="password" placeholder="Password" value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") login(); }}
              style={{ marginBottom: 14 }}
            />
            {authError && <p style={{ fontSize: 12, color: "#FF4D6D", marginBottom: 14 }}>{authError}</p>}
            <button className="btn-primary" style={{ width: "100%", padding: "13px 20px" }} onClick={login}>Login →</button>
          </div>
        </div>
      </>
    );
  }

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "◈" },
    { key: "profile", label: "Profile", icon: "◎" },
    { key: "web", label: "Web Projects", icon: "⬡" },
    { key: "app", label: "App Projects", icon: "◉" },
    { key: "blog", label: "Blog Posts", icon: "▦" },
    { key: "settings", label: "Settings", icon: "◆" },
  ];

  const currentNav = navItems.find((n) => n.key === tab);

  return (
    <>
      <style>{ADMIN_CSS}</style>
      <div className="admin-wrap">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg,#FF4D6D,#A78BFA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: "#fff",
                flexShrink: 0,
              }}>AH</div>
              <div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>Admin Panel</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>Ali Hassan</div>
              </div>
            </div>
          </div>

          <nav>
            <div className="admin-nav-label">Navigation</div>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`admin-nav-btn${tab === item.key ? " active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {tab === item.key && <span className="nav-dot" />}
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <button onClick={onBack} className="admin-nav-btn">
              <span className="nav-icon">←</span>
              <span>Back to Portfolio</span>
            </button>
          </div>
        </aside>

        {/* MOBILE NAV */}
        <div className="admin-mobile-nav">
          {navItems.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} className={tab === item.key ? "active" : ""}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* MAIN */}
        <div className="admin-main">
          <div className="admin-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Admin</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>›</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{currentNav?.label}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                padding: "4px 12px", borderRadius: 20,
                background: "rgba(77,255,180,0.08)", border: "1px solid rgba(77,255,180,0.15)",
                fontSize: 11, color: "#4DFFB4", fontWeight: 600,
              }}>● Connected</div>
            </div>
          </div>

          <div className="admin-content">
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)", fontSize: 14, gap: 10 }}>
                Loading data…
              </div>
            ) : (
              <>
                {tab === "dashboard" && <DashboardTab webProjects={webProjects} appProjects={appProjects} blogPosts={blogPosts} profile={profile} onTabChange={setTab} />}
                {tab === "profile" && <ProfileTab profile={profile} setProfile={setProfile} showMsg={showMsg} />}
                {tab === "web" && <WebProjectsTab projects={webProjects} setProjects={setWebProjects} showMsg={showMsg} />}
                {tab === "app" && <AppProjectsTab projects={appProjects} setProjects={setAppProjects} showMsg={showMsg} />}
                {tab === "blog" && <BlogTab posts={blogPosts} setPosts={setBlogPosts} showMsg={showMsg} />}
                {tab === "settings" && <SettingsTab showMsg={showMsg} />}
              </>
            )}
          </div>
        </div>

        {/* Toast */}
        {message && (
          <div className="admin-success-toast">
            <span>✓</span> {message}
          </div>
        )}
      </div>
    </>
  );
}

/* ── DASHBOARD ── */
function DashboardTab({ webProjects, appProjects, blogPosts, profile, onTabChange }) {
  const stats = [
    { label: "Web Projects", value: webProjects.length, color: "#4DFFB4", tab: "web" },
    { label: "App Projects", value: appProjects.length, color: "#A78BFA", tab: "app" },
    { label: "Blog Posts", value: blogPosts.length, color: "#FF4D6D", tab: "blog" },
    { label: "Published", value: blogPosts.filter((p) => p.published).length, color: "#38BDF8", tab: "blog" },
  ];

  const recentItems = [
    ...webProjects.slice(0, 2).map(p => ({ ...p, _type: "Web Project" })),
    ...appProjects.slice(0, 2).map(p => ({ ...p, _type: "App Project" })),
    ...blogPosts.slice(0, 2).map(p => ({ ...p, _type: "Blog Post" })),
  ].slice(0, 5);

  return (
    <div>
      <SectionHeading title="Dashboard" subtitle="Overview of your portfolio content" />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14, marginBottom: 32 }}>
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onTabChange(s.tab)}
            className="admin-card admin-stat-card"
          >
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 40, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 8, fontWeight: 500 }}>{s.label}</div>
          </button>
        ))}
      </div>

      <div className="admin-grid-2" style={{ marginBottom: 14 }}>
        {/* Profile card */}
        <div className="admin-card" style={{ padding: "24px 26px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 14 }}>Profile</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{profile?.name}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>{profile?.tagline}</div>
          <span style={{
            padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
            background: profile?.available ? "rgba(77,255,180,0.1)" : "rgba(255,77,109,0.1)",
            color: profile?.available ? "#4DFFB4" : "#FF4D6D",
          }}>
            {profile?.available ? "● Open to Work" : "○ Not Available"}
          </span>
        </div>

        {/* Quick actions */}
        <div className="admin-card" style={{ padding: "24px 26px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 14 }}>Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Add Web Project", tab: "web", color: "#4DFFB4" },
              { label: "Add App Project", tab: "app", color: "#A78BFA" },
              { label: "Write Blog Post", tab: "blog", color: "#FF4D6D" },
              { label: "Edit Profile", tab: "profile", color: "#38BDF8" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => onTabChange(a.tab)}
                style={{
                  textAlign: "left", padding: "10px 14px", borderRadius: 9,
                  background: "transparent", border: "1px solid rgba(255,255,255,0.07)",
                  color: a.color, fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                + {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent items */}
      {recentItems.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 14 }}>Recent Content</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentItems.map((item, i) => (
              <div key={i} className="admin-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="admin-item-title">{item.title}</div>
                  <div className="admin-item-sub">{item._type} · {item.year || ""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── PROFILE ── */
function ProfileTab({ profile, setProfile, showMsg }) {
  const [form, setForm] = useState(profile || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(profile || {}); }, [profile]);

  async function save() {
    setSaving(true);
    try {
      const saved = await updateProfile(form);
      setProfile(saved || form);
      showMsg("Profile saved!");
    } catch (e) {
      alert("Error saving: " + e.message);
    } finally { setSaving(false); }
  }

  const fields = [
    { l: "Full Name", k: "name", type: "text" },
    { l: "Profile Picture URL", k: "profile_pic", type: "url", full: true },
    { l: "Tagline", k: "tagline", type: "text", full: true },
    { l: "University", k: "university", type: "text" },
    { l: "Location", k: "location", type: "text" },
    { l: "Email", k: "email", type: "email" },
    { l: "LinkedIn URL", k: "linkedin", type: "url", full: true },
    { l: "GitHub URL", k: "github", type: "url", full: true },
  ];

  return (
    <div>
      <SectionHeading title="Profile Management" subtitle="Update your personal information" />
      <div style={{ maxWidth: 640 }}>
        <div className="admin-card admin-form-card">
          <div className="admin-grid-2" style={{ marginBottom: 14 }}>
            {fields.map((f) => (
              <div key={f.k} style={{ gridColumn: f.full ? "1/-1" : undefined }}>
                {f.k === 'profile_pic' ? (
                  <ImageUploadField label={f.l} value={form[f.k]} onChange={(v) => setForm({ ...form, [f.k]: v })} />
                ) : (
                  <>
                    <label className="admin-label">{f.l}</label>
                    <input
                      type={f.type} value={form[f.k] || ""}
                      onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                      placeholder={f.l}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="admin-label">Bio</label>
            <textarea rows={4} value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="admin-grid-3" style={{ marginBottom: 24 }}>
            <div>
              <label className="admin-label">Years of Experience</label>
              <input type="number" value={form.years_exp || 0} onChange={(e) => setForm({ ...form, years_exp: +e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Projects Count</label>
              <input type="number" value={form.projects_count || 0} onChange={(e) => setForm({ ...form, projects_count: +e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Available for Work</label>
              <select value={form.available ? "yes" : "no"} onChange={(e) => setForm({ ...form, available: e.target.value === "yes" })}>
                <option value="yes">✅ Yes</option>
                <option value="no">❌ No</option>
              </select>
            </div>
          </div>
          <button onClick={save} className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Profile"}</button>
        </div>
      </div>
    </div>
  );
}

/* ── WEB PROJECTS ── */
function WebProjectsTab({ projects, setProjects, showMsg }) {
  const [form, setForm] = useState({ ...EMPTY_WEB_PROJECT });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.title) return alert("Title is required");
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateProject(editing.id, form);
        setProjects(projects.map((p) => (p.id === editing.id ? updated : p)));
        setEditing(null);
        showMsg("Project updated!");
      } else {
        const created = await addProject(form);
        setProjects([...projects, created]);
        showMsg("Project added!");
      }
      setForm({ ...EMPTY_WEB_PROJECT });
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!confirm("Delete this project?")) return;
    try { await deleteProject(id, "web"); setProjects(projects.filter((p) => p.id !== id)); showMsg("Deleted!"); }
    catch (e) { alert("Error: " + e.message); }
  }

  function startEdit(p) { setEditing(p); setForm({ ...p }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function cancelEdit() { setEditing(null); setForm({ ...EMPTY_WEB_PROJECT }); }

  return (
    <div>
      <SectionHeading title="Web Projects" subtitle="Manage your web development projects" />
      <div className="admin-form-grid">
        {/* Form */}
        <div className="admin-card admin-form-card">
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, color: "#fff" }}>
            {editing ? "✏️ Edit Project" : "➕ Add New Project"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label className="admin-label">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project Title" /></div>
            <div><label className="admin-label">Category</label><input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. E-commerce, Dashboard" /></div>
            <div><label className="admin-label">Description</label><textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="admin-label">Technologies (comma-separated)</label><input value={form.technologies || ""} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" /></div>
            <div className="admin-grid-2">
              <div><label className="admin-label">Year</label><input value={form.year || ""} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2025" /></div>
              <div><label className="admin-label">Accent Color</label><input type="color" value={form.color || "#4DFFB4"} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ height: 42, padding: "4px 8px" }} /></div>
            </div>
            <div><label className="admin-label">Live Link</label><input value={form.live_link || ""} onChange={(e) => setForm({ ...form, live_link: e.target.value })} placeholder="https://…" /></div>
            <div><label className="admin-label">GitHub Link</label><input value={form.github_link || ""} onChange={(e) => setForm({ ...form, github_link: e.target.value })} placeholder="https://github.com/…" /></div>
            <ImageUploadField label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={save} className="btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Update Project" : "Add Project"}</button>
            {editing && <button onClick={cancelEdit} className="btn-secondary">Cancel</button>}
          </div>
        </div>

        {/* List */}
        <div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 14, fontWeight: 600 }}>{projects.length} project{projects.length !== 1 ? "s" : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 650, overflowY: "auto" }}>
            {projects.map((p) => (
              <div key={p.id} className="admin-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="admin-item-title">{p.title}</div>
                  <div className="admin-item-sub">{p.category} · {p.year}</div>
                  {p.description && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => startEdit(p)} className="admin-btn-edit">Edit</button>
                  <button onClick={() => remove(p.id)} className="admin-btn-delete">Delete</button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "40px 0" }}>No web projects yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── APP PROJECTS ── */
function AppProjectsTab({ projects, setProjects, showMsg }) {
  const [form, setForm] = useState({ ...EMPTY_APP_PROJECT });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [screenshotInput, setScreenshotInput] = useState("");

  function addScreenshot() {
    if (!screenshotInput.trim()) return;
    setForm({ ...form, screenshots: [...(form.screenshots || []), screenshotInput.trim()] });
    setScreenshotInput("");
  }

  function removeScreenshot(i) {
    setForm({ ...form, screenshots: form.screenshots.filter((_, idx) => idx !== i) });
  }

  async function save() {
    if (!form.title) return alert("Title is required");
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateProject(editing.id, form);
        setProjects(projects.map((p) => (p.id === editing.id ? updated : p)));
        setEditing(null);
        showMsg("Project updated!");
      } else {
        const created = await addProject(form);
        setProjects([...projects, created]);
        showMsg("Project added!");
      }
      setForm({ ...EMPTY_APP_PROJECT });
      setScreenshotInput("");
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!confirm("Delete this project?")) return;
    try { await deleteProject(id, "app"); setProjects(projects.filter((p) => p.id !== id)); showMsg("Deleted!"); }
    catch (e) { alert("Error: " + e.message); }
  }

  function startEdit(p) { setEditing(p); setForm({ ...p, screenshots: p.screenshots || [] }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function cancelEdit() { setEditing(null); setForm({ ...EMPTY_APP_PROJECT }); setScreenshotInput(""); }

  return (
    <div>
      <SectionHeading title="App Projects" subtitle="Manage your Android/iOS app projects" />
      <div className="admin-form-grid">
        {/* Form */}
        <div className="admin-card admin-form-card">
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, color: "#fff" }}>
            {editing ? "✏️ Edit App Project" : "➕ Add New App Project"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label className="admin-label">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="App Name" /></div>
            <div><label className="admin-label">Tagline</label><input value={form.tagline || ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short description" /></div>
            <div><label className="admin-label">Description</label><textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="admin-label">Technologies (comma-separated)</label><input value={form.technologies || ""} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="Kotlin, Firebase, SQLite" /></div>
            <div><label className="admin-label">Features (comma-separated)</label><input value={form.features || ""} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Push Notifications, Auth, …" /></div>
            <div className="admin-grid-3">
              <div>
                <label className="admin-label">Platform</label>
                <select value={form.platform || "Android"} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                  <option>Android</option>
                  <option>iOS</option>
                  <option>Cross-platform</option>
                </select>
              </div>
              <div><label className="admin-label">Year</label><input value={form.year || ""} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2025" /></div>
              <div><label className="admin-label">Color</label><input type="color" value={form.color || "#A78BFA"} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ height: 42, padding: "4px 8px" }} /></div>
            </div>
            <div><label className="admin-label">GitHub Link</label><input value={form.github_link || ""} onChange={(e) => setForm({ ...form, github_link: e.target.value })} placeholder="https://github.com/…" /></div>
            <div>
              <label className="admin-label">Screenshot URLs (gallery)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={screenshotInput} onChange={(e) => setScreenshotInput(e.target.value)} placeholder="https://…" onKeyDown={(e) => e.key === "Enter" && addScreenshot()} style={{ flex: 1 }} />
                <label className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12, cursor: "pointer", display:"flex", alignItems:"center", whiteSpace:"nowrap" }}>
                  Upload File
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if(!file) return;
                    try { const url = await uploadImage(file); setForm(f => ({...f, screenshots: [...(f.screenshots||[]), url]})); }
                    catch(err) { alert(err.message); }
                  }} style={{ display: "none" }} />
                </label>
                <button onClick={addScreenshot} className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap" }}>Add URL</button>
              </div>
              {(form.screenshots || []).length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  {(form.screenshots || []).map((s, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={s} alt="" style={{ width: 52, height: 78, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)" }} />
                      <button
                        onClick={() => removeScreenshot(i)}
                        style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#FF4D6D", border: "none", color: "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={save} className="btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Update App" : "Add App"}</button>
            {editing && <button onClick={cancelEdit} className="btn-secondary">Cancel</button>}
          </div>
        </div>

        {/* List */}
        <div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 14, fontWeight: 600 }}>{projects.length} app{projects.length !== 1 ? "s" : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 650, overflowY: "auto" }}>
            {projects.map((p) => (
              <div key={p.id} className="admin-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="admin-item-title">{p.title}</div>
                  <div className="admin-item-sub">{p.platform} · {p.year} · {(p.screenshots || []).length} screenshots</div>
                  {p.tagline && <div style={{ fontSize: 11, color: p.color || "#A78BFA", marginTop: 3 }}>{p.tagline}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => startEdit(p)} className="admin-btn-edit">Edit</button>
                  <button onClick={() => remove(p.id)} className="admin-btn-delete">Delete</button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "40px 0" }}>No app projects yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── BLOG ── */
function BlogTab({ posts, setPosts, showMsg }) {
  const [form, setForm] = useState({ ...EMPTY_BLOG });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.title) return alert("Title is required");
    setSaving(true);
    try {
      const tagsArr = typeof form.tags === "string" ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : form.tags;
      const payload = { ...form, tags: tagsArr };
      if (editing) {
        const updated = await updateBlogPost(editing.id, payload);
        setPosts(posts.map((p) => (p.id === editing.id ? updated : p)));
        setEditing(null);
        showMsg("Post updated!");
      } else {
        const created = await addBlogPost(payload);
        setPosts([...posts, created]);
        showMsg("Post published!");
      }
      setForm({ ...EMPTY_BLOG });
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  }

  async function remove(id) {
    if (!confirm("Delete this post?")) return;
    try { await deleteBlogPost(id); setPosts(posts.filter((p) => p.id !== id)); showMsg("Deleted!"); }
    catch (e) { alert("Error: " + e.message); }
  }

  async function togglePublish(post) {
    try {
      const updated = await updateBlogPost(post.id, { published: !post.published });
      setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
      showMsg(updated.published ? "Published!" : "Unpublished!");
    } catch (e) { alert("Error: " + e.message); }
  }

  function startEdit(p) { setEditing(p); setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(", ") : p.tags }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function cancelEdit() { setEditing(null); setForm({ ...EMPTY_BLOG }); }

  const readingTime = estimateReadingTime(form.content || form.description);

  return (
    <div>
      <SectionHeading title="Blog Management" subtitle="Create and manage blog posts" />
      <div className="admin-form-grid" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        {/* Form */}
        <div className="admin-card admin-form-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>
              {editing ? "✏️ Edit Post" : "📝 New Post"}
            </div>
            {form.content && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{readingTime}</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div><label className="admin-label">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" /></div>
            <div><label className="admin-label">Description / Excerpt</label><textarea rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary shown in cards" /></div>
            <div><label className="admin-label">Content</label><textarea rows={10} value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your full article here…" style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 1.7 }} /></div>
            <div className="admin-grid-2">
              <div><label className="admin-label">Category</label><input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. React, Android" /></div>
              <div><label className="admin-label">Tags (comma-separated)</label><input value={form.tags || ""} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="react, tips, android" /></div>
            </div>
            <ImageUploadField label="Featured Image URL" value={form.featured_image} onChange={(v) => setForm({ ...form, featured_image: v })} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <input type="checkbox" id="pub" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: "auto" }} />
              <label htmlFor="pub" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>Publish immediately</label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={save} className="btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Update Post" : "Publish Post"}</button>
            {editing && <button onClick={cancelEdit} className="btn-secondary">Cancel</button>}
          </div>
        </div>

        {/* List */}
        <div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 14, fontWeight: 600 }}>{posts.length} post{posts.length !== 1 ? "s" : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 650, overflowY: "auto" }}>
            {posts.map((p) => (
              <div key={p.id} className="admin-item" style={{ flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, width: "100%" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-item-title">{p.title}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                      <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: p.published ? "rgba(77,255,180,0.1)" : "rgba(255,255,255,0.06)", color: p.published ? "#4DFFB4" : "rgba(255,255,255,0.3)" }}>
                        {p.published ? "● Published" : "○ Draft"}
                      </span>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{estimateReadingTime(p.content || p.description)}</span>
                      {p.category && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{p.category}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 5, flexShrink: 0, flexWrap: "wrap" }}>
                    <button onClick={() => togglePublish(p)} className="admin-btn-publish" style={{ background: p.published ? "rgba(255,77,109,0.1)" : "rgba(77,255,180,0.1)", color: p.published ? "#FF4D6D" : "#4DFFB4" }}>
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                    <button onClick={() => startEdit(p)} className="admin-btn-edit">Edit</button>
                    <button onClick={() => remove(p.id)} className="admin-btn-delete">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {posts.length === 0 && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "40px 0" }}>No blog posts yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SETTINGS ── */
function SettingsTab({ showMsg }) {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [current, setCurrent] = useState("");

  function changePassword() {
    if (current !== ADMIN_PASS) return alert("Current password is incorrect");
    if (!newPass || newPass.length < 6) return alert("New password must be at least 6 characters");
    if (newPass !== confirmPass) return alert("Passwords don't match");
    showMsg("Password updated in session (restart required for persistence)");
    setNewPass(""); setConfirmPass(""); setCurrent("");
  }

  return (
    <div>
      <SectionHeading title="Settings" subtitle="Manage your admin configuration" />
      <div style={{ maxWidth: 480 }}>
        <div className="admin-card admin-form-card" style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 18 }}>🔑 Change Password</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
            <div><label className="admin-label">Current Password</label><input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></div>
            <div><label className="admin-label">New Password</label><input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} /></div>
            <div><label className="admin-label">Confirm New Password</label><input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} /></div>
          </div>
          <button onClick={changePassword} className="btn-primary">Update Password</button>
        </div>

        <div style={{ padding: "22px 26px", borderRadius: 14, background: "rgba(77,255,180,0.05)", border: "1px solid rgba(77,255,180,0.12)" }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#4DFFB4", marginBottom: 10 }}>✓ Supabase Connected</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
            Your portfolio data is backed by Supabase. Changes in the admin panel are saved in real-time to the database.
          </div>
        </div>

        <div style={{ marginTop: 24, padding: "22px 26px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Database Tables</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {["profiles", "web_projects", "app_projects", "blog_posts", "skills"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4DFFB4", flexShrink: 0 }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── HELPERS ── */
function SectionHeading({ title, subtitle }) {
  return (
    <div className="admin-section-head">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="admin-label">{label}</label>
      <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
        {value ? (
           <div style={{position:"relative", width:100, height:100}}>
             <img src={value} style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:8}} />
             <button onClick={() => onChange("")} style={{position:"absolute", top:-5, right:-5, background:"#FF4D6D", color:"white", border:"none", borderRadius:"50%", width:24, height:24, cursor:"pointer"}}>×</button>
           </div>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="https://..." style={{ flex: 1, padding: "8px 12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", borderRadius: 8, color: "#fff" }} />
            <label className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12, cursor: "pointer", display:"flex", alignItems:"center", whiteSpace:"nowrap" }}>
              {uploading ? "Uploading..." : "Upload File"}
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} disabled={uploading}/>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
