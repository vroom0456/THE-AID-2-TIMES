import { useState, useEffect, useCallback } from "react";
import { useUserStore } from "../store/useStore";
import { updateProfile } from "../services/profileService";
import { uploadAvatar } from "../services/storageService";
import { friendlyError } from "../utils/errorHelpers";
import { BRANCH_CODES, BRANCH_LABELS, SEMESTERS, SECTIONS, MAX_AVATAR_BYTES, SGPA_MIN, SGPA_MAX } from "../utils/constants";
import Modal from "./ui/Modal";
import ImageCropper from "./profile/ImageCropper";

function clampSgpa(val) {
  const n = parseFloat(String(val));
  if (isNaN(n) || n < SGPA_MIN || n > SGPA_MAX) return null;
  return n;
}

function FieldRow({ label, children, error }) {
  return (
    <div className="form-row">
      <label className="form-label">{label}</label>
      {children}
      {error && <div className="form-error" role="alert">{error}</div>}
    </div>
  );
}

export default function ProfileEdit({ onClose }) {
  const user        = useUserStore((s) => s.user);
  const updateStore = useUserStore((s) => s.updateProfile);

  const [name, setName]         = useState("");
  const [roll, setRoll]         = useState("");
  const [branch, setBranch]     = useState("AIDS");
  const [section, setSection]   = useState("1");
  const [semester, setSemester] = useState(5);
  const [sgpas, setSgpas]       = useState([]);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [pfpFile, setPfpFile]       = useState(null);
  const [cropSrc, setCropSrc]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || ""); setRoll(user.roll || ""); setBranch(user.branch || "AIDS");
    setSection(String(user.section || "1")); setSemester(user.semester ?? 5);
    setSgpas(user.sgpas || []); setPfpPreview(user.pfp || null); setPfpFile(null);
  }, [user]);

  const handlePfp = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) { setError("Image must be under 5 MB."); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setCropSrc(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleCropConfirm = useCallback((croppedFile) => {
    setPfpFile(croppedFile);
    setPfpPreview(URL.createObjectURL(croppedFile));
    setCropSrc(null);
  }, []);

  const handleCropCancel = useCallback(() => setCropSrc(null), []);

  const handleSgpaChange = useCallback((index, val) => {
    if (val !== "" && !/^\d{0,2}(\.\d{0,2})?$/.test(val)) return;
    if (val !== "" && parseFloat(val) > SGPA_MAX) return;
    setSgpas((prev) => { const next = [...prev]; next[index] = val; return next; });
  }, []);

  const handleSave = useCallback(async () => {
    if (loading || !user?.id) return;
    setError("");
    const nameTrimmed = name.trim(), rollTrimmed = roll.trim(), sectionTrimmed = section.trim();
    if (!nameTrimmed || nameTrimmed.length < 2) return setError("Full name must be at least 2 characters.");
    if (!rollTrimmed || !/^\d{1,12}$/.test(rollTrimmed)) return setError("Roll number must be 1–12 digits.");
    if (!SECTIONS.map(String).includes(sectionTrimmed)) return setError("Select a valid section.");
    const semInt = Number(semester);
    if ((user.sgpas?.length || 0) > semInt - 1) {
      if (!window.confirm("Reducing your semester will remove SGPAs for later semesters. Continue?")) return;
    }
    setLoading(true);
    const prevUser = { ...user };
    updateStore({ name: nameTrimmed, roll: rollTrimmed, branch, semester: semInt, sem: semInt, section: sectionTrimmed });
    try {
      let pfpUrl = user.pfp || null;
      if (pfpFile) { const { url } = await uploadAvatar(user.id, pfpFile); pfpUrl = url; }
      const sgpaArr = Array.from({ length: semInt - 1 }, (_, i) => {
        const raw = sgpas[i];
        return raw === "" || raw == null ? null : clampSgpa(raw);
      });
      await updateProfile(user.id, { full_name: nameTrimmed, roll_no: rollTrimmed, branch, semester: semInt, section: sectionTrimmed, profile_picture_url: pfpUrl, sgpas: sgpaArr });
      updateStore({ name: nameTrimmed, roll: rollTrimmed, branch, semester: semInt, sem: semInt, section: sectionTrimmed, pfp: pfpUrl, sgpas: sgpaArr });
      onClose();
    } catch (err) { updateStore(prevUser); setError(friendlyError(err)); }
    finally { setLoading(false); }
  }, [loading, user, name, roll, section, semester, branch, sgpas, pfpFile, updateStore, onClose]);

  const semInt = Number(semester);

  return (
    <Modal title="Edit Profile" sub="Changes are saved to your account" onClose={onClose}>
      {cropSrc && (
        <ImageCropper imageSrc={cropSrc} onCancel={handleCropCancel} onConfirm={handleCropConfirm} />
      )}
      <div className="pfp-wrap">
        <div className="pfp-preview">{pfpPreview ? <img src={pfpPreview} alt="Your avatar" /> : "?"}</div>
        <div>
          <label className="pfp-btn" style={{ cursor: "pointer" }}>
            📷 Change Photo
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePfp} />
          </label>
          <p style={{ fontSize: ".7rem", color: "var(--g4)", marginTop: 4 }}>Optional · Max 5 MB</p>
        </div>
      </div>
      <FieldRow label="Full Name">
        <input className="form-input" value={name} maxLength={80} onChange={(e) => setName(e.target.value.slice(0, 80))} />
      </FieldRow>
      <FieldRow label="Roll Number">
        <input className="form-input" value={roll} maxLength={12} inputMode="numeric" onChange={(e) => setRoll(e.target.value.replace(/\D/g, "").slice(0, 12))} />
      </FieldRow>
      <FieldRow label="Section">
        <select className="form-select" value={section} onChange={(e) => setSection(e.target.value)}>
          {SECTIONS.map((s) => <option key={s} value={String(s)}>Section {s}</option>)}
        </select>
      </FieldRow>
      <FieldRow label="Branch">
        <select className="form-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
          {BRANCH_CODES.map((b) => <option key={b} value={b}>{BRANCH_LABELS[b]}</option>)}
        </select>
      </FieldRow>
      <FieldRow label="Current Semester">
        <select className="form-select" value={semester} onChange={(e) => setSemester(Number(e.target.value))}>
          {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </FieldRow>
      {semInt > 1 && (
        <FieldRow label="Semester-wise SGPAs">
          <div className="login-cgpa-grid">
            {Array.from({ length: semInt - 1 }).map((_, i) => (
              <div className="login-cgpa-item" key={i}>
                <label htmlFor={`sgpa_edit_${i}`}>Sem {i + 1}</label>
                <input id={`sgpa_edit_${i}`} type="number" step="0.01" min={SGPA_MIN} max={SGPA_MAX} placeholder="—" value={sgpas[i] ?? ""} onChange={(e) => handleSgpaChange(i, e.target.value)} />
              </div>
            ))}
          </div>
        </FieldRow>
      )}
      {error && <div className="form-error" role="alert" style={{ marginTop: 8 }}>{error}</div>}
      <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={handleSave} disabled={loading} aria-busy={loading}>
        {loading ? "Saving…" : "Save Profile"}
      </button>
    </Modal>
  );
}



