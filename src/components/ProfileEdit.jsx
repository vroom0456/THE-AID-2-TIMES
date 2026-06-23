import { useState, useEffect } from "react";
import { useUserStore } from "../store/useStore";
import Modal from "./ui/Modal"; // Assumes your generic Modal component is here

export function ProfileEdit({ onClose }) {
  const user = useUserStore((s) => s.user);
  const login = useUserStore((s) => s.login);
  
  const [form, setForm] = useState({
    name: "", roll: "", branch: "AIDS", section: "", sem: "5"
  });
  const [sgpas, setSgpas] = useState([]);
  const [pfpPreview, setPfpPreview] = useState(null);

  // Load existing user data on mount
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        roll: user.roll || "",
        branch: user.branch || "AIDS",
        section: user.section || "",
        sem: user.sem?.toString() || "5"
      });
      setSgpas(user.sgpas || []);
      setPfpPreview(user.pfp || null);
    }
  }, [user]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const semNum = parseInt(form.sem);

  const handlePfp = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPfpPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.roll.trim()) {
      alert("Name and roll number required.");
      return;
    }
    const sgpaArr = Array.from({ length: semNum - 1 }, (_, i) => parseFloat(sgpas[i]) || 0);
    login({ ...form, sem: semNum, sgpas: sgpaArr, pfp: pfpPreview });
    onClose();
  };

  return (
    <Modal title="Edit Profile" sub="Update your details and semester SGPAs" onClose={onClose}>
      <div className="pfp-wrap">
        <div className="pfp-preview">
          {pfpPreview ? <img src={pfpPreview} alt="pfp" /> : "?"}
        </div>
        <div>
          <label className="pfp-btn" style={{ cursor: "pointer" }}>
            📷 Change Photo
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePfp} />
          </label>
          <p style={{ fontSize: ".7rem", color: "var(--g4)", marginTop: 4 }}>JPG, PNG, GIF — saved locally</p>
        </div>
      </div>

      {[
        { label: "Full Name", key: "name" },
        { label: "Roll Number", key: "roll" },
        { label: "Section", key: "section" }
      ].map(({ label, key }) => (
        <div className="form-row" key={key}>
          <label className="form-label">{label}</label>
          <input className="form-input" value={form[key]} onChange={(e) => set(key, e.target.value)} />
        </div>
      ))}

      <div className="form-row">
        <label className="form-label">Branch</label>
        <select className="form-select" value={form.branch} onChange={(e) => set("branch", e.target.value)}>
          {[["AIDS", "AI & Data Science"], ["CSE", "Computer Science"], ["IT", "Information Technology"], ["ECE", "Electronics & Comm"], ["AIML", "AI & ML"]].map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label className="form-label">Current Semester</label>
        <select className="form-select" value={form.sem} onChange={(e) => set("sem", e.target.value)}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>Sem {s}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label className="form-label">Previous SGPAs</label>
        <div className="login-cgpa-grid">
          {semNum > 1 ? (
            Array.from({ length: semNum - 1 }).map((_, i) => (
              <div className="login-cgpa-item" key={i}>
                <label>Sem {i + 1}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="-"
                  value={sgpas[i] || ""}
                  onChange={(e) => {
                    const newSgpas = [...sgpas];
                    newSgpas[i] = e.target.value;
                    setSgpas(newSgpas);
                  }}
                />
              </div>
            ))
          ) : (
            <p style={{ fontSize: ".72rem", color: "var(--g4)", gridColumn: "1/-1" }}>No completed semesters yet.</p>
          )}
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: "100%", marginTop: "12px" }} onClick={handleSave}>
        Save Profile
      </button>
    </Modal>
  );
}

export default ProfileEdit;

