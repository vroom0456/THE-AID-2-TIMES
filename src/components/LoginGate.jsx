import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useUserStore } from "../store/useStore";
import { fetchStudentProfile } from "../lib/supabaseResources";

const BRANCHES = ["AIDS", "CSE", "AIML", "IT", "CIC", "ECE", "EVL", "MECHANICAL", "CIVIL", "BIOTECH"];
const BRANCH_LABELS = {
  AIDS: "AI & Data Science", CSE: "Computer Science", AIML: "AI & ML",
  IT: "Information Technology", CIC: "CS (IoT & Cyber)", ECE: "Electronics & Comm",
  EVL: "EV & VLSI", MECHANICAL: "Mechanical", CIVIL: "Civil", BIOTECH: "Bio-Technology",
};
const SEM_LABELS = ["I","II","III","IV","V","VI","VII","VIII"];

export default function LoginGate() {
  const loginStore = useUserStore((s) => s.login);

  const [mode, setMode] = useState("login"); // "login" | "signup" | "profile"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auth form
  const [authForm, setAuthForm] = useState({ fullName: "", email: "", password: "", confirm: "" });

  // Profile form
  const [profileForm, setProfileForm] = useState({
    roll_no: "", branch: "AIDS", semester: "V", section: "",
  });
  const [pfpFile, setPfpFile] = useState(null);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [sgpas, setSgpas] = useState({});
  const [pendingUser, setPendingUser] = useState(null); // supabase user after signup/login

  const setA = (k, v) => setAuthForm((f) => ({ ...f, [k]: v }));
  const setP = (k, v) => setProfileForm((f) => ({ ...f, [k]: v }));

  const semIndex = SEM_LABELS.indexOf(profileForm.semester) + 1;

  function handlePfp(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPfpFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPfpPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  // ── SIGN UP ──────────────────────────────────────────────────────────────
  async function handleSignup() {
    setError("");
    if (!authForm.fullName.trim()) return setError("Full name is required.");
    if (!authForm.email.trim()) return setError("Email is required.");
    if (authForm.password.length < 6) return setError("Password must be at least 6 characters.");
    if (authForm.password !== authForm.confirm) return setError("Passwords do not match.");

    setLoading(true);
    const { data, error: signupErr } = await supabase.auth.signUp({
      email: authForm.email.trim(),
      password: authForm.password,
      options: { data: { full_name: authForm.fullName.trim() } },
    });

    if (signupErr) { setLoading(false); return setError(signupErr.message); }

    // Pre-create profile row with name + email
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email: authForm.email.trim(),
      full_name: authForm.fullName.trim(),
      role: "user",
      created_at: new Date().toISOString(),
    });

    setPendingUser(data.user);
    setLoading(false);
    setMode("profile");
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────
  async function handleLogin() {
    setError("");
    if (!authForm.email.trim() || !authForm.password) return setError("Email and password required.");

    setLoading(true);
    const { data, error: loginErr } = await supabase.auth.signInWithPassword({
      email: authForm.email.trim(),
      password: authForm.password,
    });

    if (loginErr) { setLoading(false); return setError(loginErr.message); }

    const supaUser = data.user;
    const profile = await fetchStudentProfile(supaUser.id);

    // If profile incomplete → force profile setup
    if (!profile?.roll_no || !profile?.branch || !profile?.semester) {
      setPendingUser(supaUser);
      // Pre-fill what we have
      if (profile) {
        setProfileForm({
          roll_no: profile.roll_no || "",
          branch: profile.branch || "AIDS",
          semester: profile.semester || "V",
          section: profile.section || "",
        });
        
        // Pre-fill SGPAs if they exist in DB so user doesn't lose them
        if (profile.sgpas && Array.isArray(profile.sgpas)) {
          const loadedSgpas = {};
          profile.sgpas.forEach((val, idx) => {
            loadedSgpas[idx + 1] = val;
          });
          setSgpas(loadedSgpas);
        }
      }
      setLoading(false);
      setMode("profile");
      return;
    }

    // Profile complete — load into store
    const semI = SEM_LABELS.indexOf(profile.semester);
    loginStore({
      id: supaUser.id,
      email: supaUser.email,
      name: profile.full_name,
      roll: profile.roll_no,
      branch: profile.branch,
      semester: profile.semester,
      sem: semI + 1,
      section: profile.section,
      pfp: profile.profile_picture_url || null,
      role: profile.role || "user",
      sgpas: profile.sgpas || [],
    });
    setLoading(false);
  }

  // ── SAVE PROFILE ─────────────────────────────────────────────────────────
  async function handleSaveProfile() {
    setError("");
    if (!profileForm.roll_no.trim()) return setError("Roll number is required.");
    if (!profileForm.branch) return setError("Branch is required.");
    if (!profileForm.semester) return setError("Semester is required.");
    if (!profileForm.section.trim()) return setError("Section is required.");

    setLoading(true);

    // Upload profile picture if provided
    let pfpUrl = null;
    if (pfpFile) {
      const ext = pfpFile.name.split(".").pop();
      const path = `avatars/${pendingUser.id}.${ext}`;
      const { error: storageErr } = await supabase.storage
        .from("avatars")
        .upload(path, pfpFile, { upsert: true });
      if (!storageErr) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        pfpUrl = urlData?.publicUrl;
      }
    }

    const sgpaArr = Array.from({ length: semIndex - 1 }, (_, i) => parseFloat(sgpas[i + 1]) || 0);

    const { data: { user: currentUser } } = await supabase.auth.getUser();

    // Save to Supabase profiles
    const { error: profileErr } = await supabase.from("profiles").upsert({
      id: pendingUser.id,
      email: pendingUser.email,
      full_name: currentUser?.user_metadata?.full_name || authForm.fullName || "",
      roll_no: profileForm.roll_no.trim(),
      branch: profileForm.branch,
      semester: profileForm.semester,
      section: profileForm.section.trim(),
      profile_picture_url: pfpUrl,
      role: "user",
      sgpas: sgpaArr,
      updated_at: new Date().toISOString(),
    });

    if (profileErr) { setLoading(false); return setError(profileErr.message); }

    // Load into app store
    loginStore({
      id: pendingUser.id,
      email: pendingUser.email,
      name: currentUser?.user_metadata?.full_name || authForm.fullName || "",
      roll: profileForm.roll_no.trim(),
      branch: profileForm.branch,
      semester: profileForm.semester,
      sem: semIndex,
      section: profileForm.section.trim(),
      pfp: pfpUrl || pfpPreview,
      role: "user",
      sgpas: sgpaArr,
    });
    setLoading(false);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  if (mode === "profile") {
    return (
      <div id="loginGate">
        <div className="login-box">
          <div className="login-logo">THE AID <span>2</span> TIMES</div>
          <div className="login-sub">Complete your profile to continue</div>

          {/* Profile picture */}
          <div className="pfp-wrap">
            <div className="pfp-preview">
              {pfpPreview ? <img src={pfpPreview} alt="pfp" /> : "?"}
            </div>
            <div>
              <label className="pfp-btn" style={{ cursor: "pointer" }}>
                📷 Upload Photo (optional)
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePfp} />
              </label>
              <p style={{ fontSize: ".7rem", color: "var(--g4)", marginTop: 5 }}>Can be added later</p>
            </div>
          </div>

          {[
            { label: "Roll Number *", key: "roll_no", ph: "e.g. 160122771001" },
            { label: "Section *", key: "section", ph: "e.g. A" },
          ].map(({ label, key, ph }) => (
            <div className="form-row" key={key}>
              <label className="form-label">{label}</label>
              <input className="form-input" placeholder={ph} value={profileForm[key]}
                onChange={(e) => setP(key, e.target.value)} />
            </div>
          ))}

          <div className="form-row">
            <label className="form-label">Branch *</label>
            <select
              className="form-select"
              value={profileForm.branch}
              onChange={(e) => setP("branch", e.target.value)}
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {BRANCH_LABELS[b]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Current Semester *</label>
            <select className="form-select" value={profileForm.semester} onChange={(e) => setP("semester", e.target.value)}>
              {SEM_LABELS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>

          {semIndex > 1 && (
            <div className="form-row">
              <label className="form-label">Previous Semester SGPAs</label>
              <div className="login-cgpa-grid">
                {Array.from({ length: semIndex - 1 }, (_, i) => i + 1).map((n) => (
                  <div className="login-cgpa-item" key={n}>
                    <label>Sem {n}</label>
                    <input type="number" placeholder="—" step="0.01" min="0" max="10"
                      value={sgpas[n] || ""}
                      onChange={(e) => setSgpas((s) => ({ ...s, [n]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <div className="form-error">{error}</div>}

          <button className="btn btn-primary" style={{ width: "100%", marginTop: 10 }}
            onClick={handleSaveProfile} disabled={loading}>
            {loading ? "Saving…" : "Enter Portal →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="loginGate">
      <div className="login-box">
        <div className="login-logo">THE AID <span>2</span> TIMES</div>
        <div className="login-sub">
          {mode === "login" ? "Sign in to your account" : "Create your student account"}
        </div>

        {mode === "signup" && (
          <div className="form-row">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="e.g. Rohan Reddy"
              value={authForm.fullName} onChange={(e) => setA("fullName", e.target.value)} />
          </div>
        )}

        <div className="form-row">
          <label className="form-label">Email Address *</label>
          <input className="form-input" type="email" placeholder="your@email.com"
            value={authForm.email} onChange={(e) => setA("email", e.target.value)} />
        </div>

        <div className="form-row">
          <label className="form-label">Password *</label>
          <input className="form-input" type="password" placeholder="Min 6 characters"
            value={authForm.password} onChange={(e) => setA("password", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? handleLogin() : null)} />
        </div>

        {mode === "signup" && (
          <div className="form-row">
            <label className="form-label">Confirm Password *</label>
            <input className="form-input" type="password" placeholder="Repeat password"
              value={authForm.confirm} onChange={(e) => setA("confirm", e.target.value)} />
          </div>
        )}

        {error && <div className="form-error">{error}</div>}

        <button className="btn btn-primary" style={{ width: "100%", marginTop: 10 }}
          onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading}>
          {loading ? (mode === "login" ? "Signing In…" : "Creating Account…")
            : (mode === "login" ? "Sign In →" : "Create Account →")}
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: ".8rem", color: "var(--g4)" }}>
          {mode === "login" ? (
            <>Don't have an account?{" "}
              <button style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer", fontSize: ".8rem" }}
                onClick={() => { setMode("signup"); setError(""); }}>
                Sign Up
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer", fontSize: ".8rem" }}
                onClick={() => { setMode("login"); setError(""); }}>
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
