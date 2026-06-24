import { useState, useEffect } from "react";
import { useUserStore } from "../store/useStore";
import { supabase } from "../lib/supabase";
import Modal from "./ui/Modal";

const BRANCHES = ["AIDS","CSE","AIML","IT","CIC","ECE","EVL","MECHANICAL","CIVIL","BIOTECH"];
const BRANCH_LABELS = {
  AIDS:"AI & Data Science",CSE:"Computer Science",AIML:"AI & ML",
  IT:"Information Technology",CIC:"CS (IoT & Cyber)",ECE:"Electronics & Comm",
  EVL:"EV & VLSI",MECHANICAL:"Mechanical",CIVIL:"Civil",BIOTECH:"Bio-Technology",
};
const SEM_LABELS = ["I","II","III","IV","V","VI","VII","VIII"];

export default function ProfileEdit({ onClose }) {
  const user        = useUserStore((s) => s.user);
  const updateStore = useUserStore((s) => s.login);

  const [form, setForm] = useState({
    name: "", roll: "", branch: "AIDS", section: "", semester: "V", previous_cgpa: "",
  });
  const [sgpas, setSgpas] = useState([]);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [pfpFile, setPfpFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        roll: user.roll || "",
        branch: user.branch || "AIDS",
        section: user.section || "",
        semester: user.semester || "V",
        previous_cgpa: user.previous_cgpa?.toString() || "",
      });
      setSgpas(user.sgpas || []);
      setPfpPreview(user.pfp || null);
    }
  }, [user]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const semIndex = SEM_LABELS.indexOf(form.semester) + 1;

  function handlePfp(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPfpFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPfpPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setError("");
    if (!form.name.trim() || !form.roll.trim()) return setError("Name and roll number required.");
    if (!form.section.trim()) return setError("Section is required.");
    setLoading(true);

    let pfpUrl = user?.pfp || null;

    // Upload new profile picture if changed
    if (pfpFile && user?.id) {
      const ext = pfpFile.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: storageErr } = await supabase.storage
        .from("avatars").upload(path, pfpFile, { upsert: true });
      if (!storageErr) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        pfpUrl = data?.publicUrl;
      }
    }

    const sgpaArr = Array.from({ length: semIndex - 1 }, (_, i) => parseFloat(sgpas[i]) || 0);

    // Update Supabase profiles
    if (user?.id) {
      const { error: dbErr } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: form.name.trim(),
        roll_no: form.roll.trim(),
        branch: form.branch,
        semester: form.semester,
        section: form.section.trim(),
        previous_cgpa: parseFloat(form.previous_cgpa) || null,
        profile_picture_url: pfpUrl,
        updated_at: new Date().toISOString(),
      });
      if (dbErr) { setLoading(false); return setError(dbErr.message); }
    }

    // Update local store
    updateStore({
      ...user,
      name: form.name.trim(),
      roll: form.roll.trim(),
      branch: form.branch,
      semester: form.semester,
      sem: semIndex,
      section: form.section.trim(),
      previous_cgpa: parseFloat(form.previous_cgpa) || null,
      pfp: pfpUrl || pfpPreview,
      sgpas: sgpaArr,
    });

    setLoading(false);
    onClose();
  }

  return (
    <Modal title="Edit Profile" sub="Changes save to Supabase immediately" onClose={onClose}>
      <div className="pfp-wrap">
        <div className="pfp-preview">
          {pfpPreview ? <img src={pfpPreview} alt="pfp" /> : "?"}
        </div>
        <div>
          <label className="pfp-btn" style={{ cursor: "pointer" }}>
            📷 Change Photo
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePfp} />
          </label>
          <p style={{ fontSize: ".7rem", color: "var(--g4)", marginTop: 4 }}>Optional</p>
        </div>
      </div>

      {[
        { label: "Full Name", key: "name" },
        { label: "Roll Number", key: "roll" },
        { label: "Section", key: "section" },
      ].map(({ label, key }) => (
        <div className="form-row" key={key}>
          <label className="form-label">{label}</label>
          <input className="form-input" value={form[key]} onChange={(e) => set(key, e.target.value)} />
        </div>
      ))}

      <div className="form-row">
        <label className="form-label">Branch</label>
        <select className="form-select" value={form.branch} onChange={(e) => set("branch", e.target.value)}>
          {BRANCHES.map((b) => <option key={b} value={b}>{BRANCH_LABELS[b]}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label className="form-label">Current Semester</label>
        <select className="form-select" value={form.semester} onChange={(e) => set("semester", e.target.value)}>
          {SEM_LABELS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label className="form-label">Previous CGPA</label>
        <input className="form-input" type="number" step="0.01" min="0" max="10"
          value={form.previous_cgpa} onChange={(e) => set("previous_cgpa", e.target.value)} />
      </div>

      {semIndex > 1 && (
        <div className="form-row">
          <label className="form-label">Semester-wise SGPAs</label>
          <div className="login-cgpa-grid">
            {Array.from({ length: semIndex - 1 }).map((_, i) => (
              <div className="login-cgpa-item" key={i}>
                <label>Sem {i + 1}</label>
                <input type="number" step="0.01" min="0" max="10" placeholder="—"
                  value={sgpas[i] || ""}
                  onChange={(e) => {
                    const arr = [...sgpas];
                    arr[i] = e.target.value;
                    setSgpas(arr);
                  }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="form-error">{error}</div>}

      <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }}
        onClick={handleSave} disabled={loading}>
        {loading ? "Saving…" : "Save Profile"}
      </button>
    </Modal>
  );
}
