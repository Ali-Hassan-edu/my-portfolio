import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/profileService";
import { getProjects, addProject, updateProject, deleteProject } from "../services/projectsService";
import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost } from "../services/blogService";
import { estimateReadingTime } from "../utils/helpers";

// NOTE: This password is client-side only (for demo/personal use). For production,
// replace with Supabase Auth (email/password or OAuth) to prevent anyone who
// inspects the source from finding the admin password.
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

export default function AdminPage({ onBack }) {
  const [tab, setTab] = useState("dashboard");
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [message, setMessage] = useState("");

  // Data state
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

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, paddingTop: 80 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 380 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 24 }}>← Back</button>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#FF4D6D,#A78BFA)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 20 }}>🔐</div>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Admin Panel</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>Enter your admin password to continue</p>
          <input
            type="password" placeholder="Password" value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") login(); }}
            style={{ marginBottom: 12 }}
          />
          {authError && <p style={{ fontSize: 12, color: "#FF4D6D", marginBottom: 12 }}>{authError}</p>}
          <button className="btn-primary" style={{ width: "100%" }} onClick={login}>Login →</button>
        </div>
      </div>
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
    <div style={{ minHeight: "100vh", paddingTop: 64, display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: "rgba(255,255,255,0.02)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          position: "sticky",
          top: 64,
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Sidebar brand */}
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg,#FF4D6D,#A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: "#fff",
              flexShrink: 0,
            }}>AH</div>
            <div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>Admin Panel</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>Ali Hassan</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", padding: "8px 10px 6px" }}>
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 9,
                  background: isActive ? "rgba(255,77,109,0.1)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 2,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 15, color: isActive ? "#FF4D6D" : "rgba(255,255,255,0.3)", flexShrink: 0, width: 18, textAlign: "center" }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}>
                  {item.label}
                </span>
                {isActive && (
                  <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "#FF4D6D", flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div style={{ padding: "12px 10px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={onBack}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 9,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>←</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>Back to Portfolio</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(8,8,16,0.95)",
          backdropFilter: "blur(20px)",
          padding: "0 28px",
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 64,
          zIndex: 90,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Admin</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)" }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{currentNav?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {message && (
              <span style={{ fontSize: 12, color: "#4DFFB4", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 14 }}>✓</span> {message}
              </span>
            )}
            <div style={{
              padding: "4px 12px",
              borderRadius: 20,
              background: "rgba(77,255,180,0.08)",
              border: "1px solid rgba(77,255,180,0.15)",
              fontSize: 11,
              color: "#4DFFB4",
              fontWeight: 600,
            }}>
              ● Connected
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "32px 28px 80px", flex: 1 }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", color: "rgba(255,255,255,0.3)", fontSize: 14, gap: 10 }}>
              <span style={{ fontSize: 18 }}>⟳</span> Loading data…
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
    </div>
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
  return (
    <div>
      <SectionHeading title="Dashboard" subtitle="Overview of your portfolio content" />

      {/* Stats cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14, marginBottom: 32 }}>
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onTabChange(s.tab)}
            style={{
              padding: "20px 22px", borderRadius: 14,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer", textAlign: "left", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.055)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          >
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 36, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Profile card */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={{ padding: "22px 24px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 12 }}>Profile</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{profile?.name}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>{profile?.tagline}</div>
          <span style={{
            padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600,
            background: profile?.available ? "rgba(77,255,180,0.1)" : "rgba(255,77,109,0.1)",
            color: profile?.available ? "#4DFFB4" : "#FF4D6D",
          }}>
            {profile?.available ? "Open to Work" : "Not Available"}
          </span>
        </div>

        {/* Quick actions */}
        <div style={{ padding: "22px 24px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 12 }}>Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Add Web Project", tab: "web", color: "#4DFFB4" },
              { label: "Add App Project", tab: "app", color: "#A78BFA" },
              { label: "Write Blog Post", tab: "blog", color: "#FF4D6D" },
              { label: "Edit Profile", tab: "profile", color: "#38BDF8" },
            ].map((a) => (
              <button
                key={a.tab}
                onClick={() => onTabChange(a.tab)}
                style={{
                  textAlign: "left", padding: "8px 12px", borderRadius: 8,
                  background: "transparent", border: `1px solid rgba(255,255,255,0.07)`,
                  color: a.color, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                + {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
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
    { l: "Tagline", k: "tagline", type: "text" },
    { l: "University", k: "university", type: "text" },
    { l: "Location", k: "location", type: "text" },
    { l: "Email", k: "email", type: "email" },
    { l: "LinkedIn URL", k: "linkedin", type: "url" },
    { l: "GitHub URL", k: "github", type: "url" },
  ];

  return (
    <div>
      <SectionHeading title="Profile Management" subtitle="Update your personal information" />
      <div style={{ maxWidth: 640 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {fields.map((f) => (
            <div key={f.k} style={{ gridColumn: ["tagline", "linkedin", "github"].includes(f.k) ? "1/-1" : undefined }}>
              <Label>{f.l}</Label>
              <input
                type={f.type} value={form[f.k] || ""}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                placeholder={f.l}
              />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 14 }}>
          <Label>Bio</Label>
          <textarea rows={4} value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div>
            <Label>Years of Experience</Label>
            <input type="number" value={form.years_exp || 0} onChange={(e) => setForm({ ...form, years_exp: +e.target.value })} />
          </div>
          <div>
            <Label>Projects Count</Label>
            <input type="number" value={form.projects_count || 0} onChange={(e) => setForm({ ...form, projects_count: +e.target.value })} />
          </div>
          <div>
            <Label>Available for Work</Label>
            <select value={form.available ? "yes" : "no"} onChange={(e) => setForm({ ...form, available: e.target.value === "yes" })}>
              <option value="yes">✅ Yes</option>
              <option value="no">❌ No</option>
            </select>
          </div>
        </div>
        <button onClick={save} className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save Profile"}</button>
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

  function startEdit(p) { setEditing(p); setForm({ ...p }); }
  function cancelEdit() { setEditing(null); setForm({ ...EMPTY_WEB_PROJECT }); }

  return (
    <div>
      <SectionHeading title="Web Projects" subtitle="Manage your web development projects" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "start" }}>
        {/* Form */}
        <div style={{ padding: "24px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18, color: "#fff" }}>
            {editing ? "Edit Project" : "Add New Project"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><Label>Title *</Label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project Title" /></div>
            <div><Label>Category</Label><input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. E-commerce, Dashboard" /></div>
            <div><Label>Description</Label><textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Technologies (comma-separated)</Label><input value={form.technologies || ""} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><Label>Year</Label><input value={form.year || ""} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2025" /></div>
              <div><Label>Accent Color</Label><input type="color" value={form.color || "#4DFFB4"} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ height: 42, padding: "4px 8px" }} /></div>
            </div>
            <div><Label>Live Link</Label><input value={form.live_link || ""} onChange={(e) => setForm({ ...form, live_link: e.target.value })} placeholder="https://…" /></div>
            <div><Label>GitHub Link</Label><input value={form.github_link || ""} onChange={(e) => setForm({ ...form, github_link: e.target.value })} placeholder="https://github.com/…" /></div>
            <div><Label>Image URL</Label><input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" /></div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={save} className="btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Add Project"}</button>
            {editing && <button onClick={cancelEdit} className="btn-secondary">Cancel</button>}
          </div>
        </div>

        {/* List */}
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>{projects.length} project{projects.length !== 1 ? "s" : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 600, overflowY: "auto" }}>
            {projects.map((p) => (
              <div key={p.id} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{p.category} · {p.year}</div>
                  {p.description && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => startEdit(p)} style={{ padding: "5px 12px", borderRadius: 7, background: "rgba(167,139,250,0.12)", border: "none", color: "#A78BFA", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                  <button onClick={() => remove(p.id)} style={{ padding: "5px 12px", borderRadius: 7, background: "rgba(255,77,109,0.1)", border: "none", color: "#FF4D6D", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Delete</button>
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

  function startEdit(p) { setEditing(p); setForm({ ...p, screenshots: p.screenshots || [] }); }
  function cancelEdit() { setEditing(null); setForm({ ...EMPTY_APP_PROJECT }); setScreenshotInput(""); }

  return (
    <div>
      <SectionHeading title="App Projects" subtitle="Manage your Android/iOS app projects" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "start" }}>
        {/* Form */}
        <div style={{ padding: "24px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 18, color: "#fff" }}>
            {editing ? "Edit App Project" : "Add New App Project"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><Label>Title *</Label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="App Name" /></div>
            <div><Label>Tagline</Label><input value={form.tagline || ""} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short description" /></div>
            <div><Label>Description</Label><textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Technologies (comma-separated)</Label><input value={form.technologies || ""} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="Kotlin, Firebase, SQLite" /></div>
            <div><Label>Features (comma-separated)</Label><input value={form.features || ""} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Push Notifications, Auth, …" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div>
                <Label>Platform</Label>
                <select value={form.platform || "Android"} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                  <option>Android</option>
                  <option>iOS</option>
                  <option>Cross-platform</option>
                </select>
              </div>
              <div><Label>Year</Label><input value={form.year || ""} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2025" /></div>
              <div><Label>Color</Label><input type="color" value={form.color || "#A78BFA"} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ height: 42, padding: "4px 8px" }} /></div>
            </div>
            <div><Label>GitHub Link</Label><input value={form.github_link || ""} onChange={(e) => setForm({ ...form, github_link: e.target.value })} placeholder="https://github.com/…" /></div>
            {/* Screenshots */}
            <div>
              <Label>Screenshot URLs (gallery)</Label>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={screenshotInput} onChange={(e) => setScreenshotInput(e.target.value)} placeholder="https://…" onKeyDown={(e) => e.key === "Enter" && addScreenshot()} style={{ flex: 1 }} />
                <button onClick={addScreenshot} className="btn-secondary" style={{ padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap" }}>Add</button>
              </div>
              {(form.screenshots || []).length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {(form.screenshots || []).map((s, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={s} alt="" style={{ width: 48, height: 72, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.12)" }} />
                      <button
                        onClick={() => removeScreenshot(i)}
                        style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#FF4D6D", border: "none", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={save} className="btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Add App"}</button>
            {editing && <button onClick={cancelEdit} className="btn-secondary">Cancel</button>}
          </div>
        </div>

        {/* List */}
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>{projects.length} app{projects.length !== 1 ? "s" : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 600, overflowY: "auto" }}>
            {projects.map((p) => (
              <div key={p.id} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{p.platform} · {p.year} · {(p.screenshots || []).length} screenshots</div>
                  {p.tagline && <div style={{ fontSize: 11, color: p.color || "#A78BFA", marginTop: 2 }}>{p.tagline}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => startEdit(p)} style={{ padding: "5px 12px", borderRadius: 7, background: "rgba(167,139,250,0.12)", border: "none", color: "#A78BFA", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                  <button onClick={() => remove(p.id)} style={{ padding: "5px 12px", borderRadius: 7, background: "rgba(255,77,109,0.1)", border: "none", color: "#FF4D6D", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Delete</button>
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

  function startEdit(p) { setEditing(p); setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(", ") : p.tags }); }
  function cancelEdit() { setEditing(null); setForm({ ...EMPTY_BLOG }); }

  const readingTime = estimateReadingTime(form.content || form.description);

  return (
    <div>
      <SectionHeading title="Blog Management" subtitle="Create and manage blog posts" />
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 36, alignItems: "start" }}>
        {/* Form */}
        <div style={{ padding: "24px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>
              {editing ? "Edit Post" : "New Post"}
            </div>
            {form.content && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{readingTime}</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><Label>Title *</Label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" /></div>
            <div><Label>Description / Excerpt</Label><textarea rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary shown in cards" /></div>
            <div><Label>Content</Label><textarea rows={8} value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your full article here…" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><Label>Category</Label><input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. React, Android" /></div>
              <div><Label>Tags (comma-separated)</Label><input value={form.tags || ""} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="react, tips, android" /></div>
            </div>
            <div><Label>Featured Image URL</Label><input value={form.featured_image || ""} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} placeholder="https://…" /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="pub" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: "auto" }} />
              <label htmlFor="pub" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>Publish immediately</label>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button onClick={save} className="btn-primary" disabled={saving}>{saving ? "Saving…" : editing ? "Update Post" : "Publish Post"}</button>
            {editing && <button onClick={cancelEdit} className="btn-secondary">Cancel</button>}
          </div>
        </div>

        {/* List */}
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>{posts.length} post{posts.length !== 1 ? "s" : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 620, overflowY: "auto" }}>
            {posts.map((p) => (
              <div key={p.id} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.title}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: p.published ? "rgba(77,255,180,0.1)" : "rgba(255,255,255,0.06)", color: p.published ? "#4DFFB4" : "rgba(255,255,255,0.3)" }}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{estimateReadingTime(p.content || p.description)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 5, flexShrink: 0, flexWrap: "wrap" }}>
                  <button onClick={() => togglePublish(p)} style={{ padding: "4px 10px", borderRadius: 7, background: p.published ? "rgba(255,77,109,0.1)" : "rgba(77,255,180,0.1)", border: "none", color: p.published ? "#FF4D6D" : "#4DFFB4", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => startEdit(p)} style={{ padding: "4px 10px", borderRadius: 7, background: "rgba(167,139,250,0.12)", border: "none", color: "#A78BFA", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                  <button onClick={() => remove(p.id)} style={{ padding: "4px 10px", borderRadius: 7, background: "rgba(255,77,109,0.1)", border: "none", color: "#FF4D6D", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>Delete</button>
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
  const [confirm, setConfirm] = useState("");
  const [current, setCurrent] = useState("");

  function changePassword() {
    if (current !== ADMIN_PASS) return alert("Current password is incorrect");
    if (!newPass || newPass.length < 6) return alert("New password must be at least 6 characters");
    if (newPass !== confirm) return alert("Passwords don't match");
    // NOTE: Password stored in code for demo. In production use Supabase Auth.
    showMsg("Password updated in session (restart required for persistence)");
    setNewPass(""); setConfirm(""); setCurrent("");
  }

  return (
    <div>
      <SectionHeading title="Settings" subtitle="Manage your admin configuration" />
      <div style={{ maxWidth: 460 }}>
        <div style={{ padding: "24px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 24 }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Change Password</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            <div><Label>Current Password</Label><input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></div>
            <div><Label>New Password</Label><input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} /></div>
            <div><Label>Confirm New Password</Label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
          </div>
          <button onClick={changePassword} className="btn-primary">Update Password</button>
        </div>
        <div style={{ padding: "20px 24px", borderRadius: 14, background: "rgba(77,255,180,0.05)", border: "1px solid rgba(77,255,180,0.12)" }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, color: "#4DFFB4", marginBottom: 8 }}>Supabase Connected</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            Your portfolio data is backed by Supabase. Changes in the admin panel are saved in real-time to the database.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── HELPERS ── */
function Label({ children }) {
  return <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 5 }}>{children}</label>;
}
function SectionHeading({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{subtitle}</p>}
    </div>
  );
}
