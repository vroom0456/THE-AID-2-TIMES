
// ─────────────────────────────────────────────
// FILE: src/components/LoginGate.jsx
// ─────────────────────────────────────────────
import { useState } from "react";
import { useUserStore } from "../store/useStore";

export function LoginGate() {
  const login = useUserStore((s) => s.login);
  const [form, setForm] = useState({ name:"", roll:"", branch:"AIDS", section:"", sem:"5" });
  const [sgpas, setSgpas] = useState({});
  const [pfp, setPfp]     = useState(null);
  const [pfpPreview, setPfpPreview] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const semNum = parseInt(form.sem);

  function handlePfp(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPfp(ev.target.result); setPfpPreview(ev.target.result); };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.roll.trim()) { alert("Name and roll number required."); return; }
    const sgpaArr = Array.from({ length: semNum - 1 }, (_, i) => parseFloat(sgpas[i + 1]) || 0);
    login({ ...form, sem: semNum, sgpas: sgpaArr, pfp });
  }

  return (
    <div id="loginGate">
      <div className="login-box">
        <div className="login-logo">THE AID <span>2</span> TIMES</div>
        <div className="login-sub">Create your student profile — data saves to your device</div>

        {/* Profile picture */}
        <div className="pfp-wrap">
          <div className="pfp-preview">
            {pfpPreview ? <img src={pfpPreview} alt="pfp" /> : "?"}
          </div>
          <div>
            <label className="pfp-btn" style={{ cursor:"pointer" }}>
              📷 Upload Photo
              <input type="file" accept="image/*" style={{ display:"none" }} onChange={handlePfp} />
            </label>
            <p style={{ fontSize:".7rem", color:"var(--g4)", marginTop:5 }}>Optional</p>
          </div>
        </div>

        {[
          { label:"Full Name",    key:"name",    ph:"e.g. Varun Teja" },
          { label:"Roll Number",  key:"roll",    ph:"e.g. 160122771001" },
          { label:"Section",      key:"section", ph:"e.g. A" },
        ].map(({ label, key, ph }) => (
          <div className="form-row" key={key}>
            <label className="form-label">{label}</label>
            <input className="form-input" placeholder={ph} value={form[key]}
              onChange={(e) => set(key, e.target.value)} />
          </div>
        ))}

        <div className="form-row">
          <label className="form-label">Branch</label>
          <select className="form-select" value={form.branch} onChange={(e) => set("branch", e.target.value)}>
            {[["AIDS","AI & Data Science"],["CSE","Computer Science"],["IT","Information Technology"],["ECE","Electronics"],["AIML","AI & ML"]].map(([v,l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label className="form-label">Current Semester</label>
          <select className="form-select" value={form.sem} onChange={(e) => set("sem", e.target.value)}>
            {["I","II","III","IV","V","VI","VII","VIII"].map((s,i) => (
              <option key={s} value={i+1}>Sem {s}</option>
            ))}
          </select>
        </div>

        {semNum > 1 && (
          <div className="form-row">
            <label className="form-label">Previous Semester SGPAs</label>
            <div className="login-cgpa-grid">
              {Array.from({ length: semNum - 1 }, (_, i) => i + 1).map((n) => (
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

        <button className="btn btn-primary" style={{ width:"100%", marginTop:10 }} onClick={handleSubmit}>
          Enter Portal →
        </button>
      </div>
    </div>
  );
}
export default LoginGate;
