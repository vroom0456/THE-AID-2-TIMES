import React, { useState, useEffect } from "react";
import { useUserStore } from "../store/useStore";
import { supabase } from "../lib/supabase";
import Modal from "./ui/Modal";
import imageCompression from "browser-image-compression";

const BRANCHES = ["AIDS", "CSE", "AIML", "IT", "CIC", "ECE", "EVL", "MECHANICAL", "CIVIL", "BIOTECH"] as const;
const BRANCH_LABELS: Record<string, string> = {
  AIDS: "AI & Data Science", CSE: "Computer Science", AIML: "AI & ML",
  IT: "Information Technology", CIC: "CS (IoT & Cyber)", ECE: "Electronics & Comm",
  EVL: "EV & VLSI", MECHANICAL: "Mechanical", CIVIL: "Civil", BIOTECH: "Bio-Technology",
};
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

interface ProfileEditProps {
  onClose: () => void;
}

export default function ProfileEdit({ onClose }: ProfileEditProps) {
  const user = useUserStore((s: any) => s.user);
  const updateStore = useUserStore((s: any) => s.login);

  const [form, setForm] = useState({
    name: "",
    roll: "",
    branch: "AIDS",
    section: "",
    semester: 5,
  });
  
  const [sgpas, setSgpas] = useState<(number | string)[]>([]);
  const [pfpPreview, setPfpPreview] = useState<string | null>(null);
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        roll: user.roll || "",
        branch: user.branch || "AIDS",
        section: user.section || "",
        semester: user.semester ?? 5,
      });
      setSgpas(user.sgpas || []);
      setPfpPreview(user.pfp || null);
    }
  }, [user]);

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const semIndex = Number(form.semester);

  function handlePfp(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return setError("Image must be under 5 MB.");
    }
    setError("");

    setPfpFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPfpPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (loading) return; // Prevent double-clicks
    setError("");

    const nameTrimmed = form.name.trim();
    const rollTrimmed = form.roll.trim();
    const sectionTrimmed = form.section.trim().toUpperCase();

    // 1. Strict Validation
    if (!nameTrimmed || !rollTrimmed) return setError("Name and roll number are required.");
    if (!/^\d{1,12}$/.test(rollTrimmed)) return setError("Roll number must contain only digits (max 12).");
    if (!/^[A-Z]$/.test(sectionTrimmed)) return setError("Section must be a single letter (A-Z).");

    // 2. Prevent Data Loss on Semester Reduction
    if (user?.sgpas?.length > semIndex - 1) {
      if (!window.confirm("Reducing your semester will permanently remove your later semester SGPAs. Do you want to continue?")) {
        return;
      }
    }

    setLoading(true);
    let pfpUrl = user?.pfp || null;

    // 3. Compress and Upload Profile Picture
    if (pfpFile && user?.id) {
      try {
        const compressedImage = await imageCompression(pfpFile, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: "image/jpeg",
        });

        // Use consistent static path to overwrite and prevent orphans
        const path = `${user.id}/avatar.jpeg`;
        const { error: storageErr } = await supabase.storage
          .from("avatars")
          .upload(path, compressedImage, { 
            contentType: "image/jpeg",
            upsert: true 
          });
          
        if (!storageErr) {
          const { data } = supabase.storage.from("avatars").getPublicUrl(path);
          pfpUrl = `${data.publicUrl}?t=${Date.now()}`;
        } else {
          throw storageErr;
        }
      } catch (err) {
        setLoading(false);
        return setError("Failed to upload profile picture.");
      }
    }

    // 4. Safely Format SGPAs
    const sgpaArr = Array.from({ length: semIndex - 1 }, (_, i) => {
      const v = parseFloat(String(sgpas[i]));
      return !isNaN(v) && v >= 0 && v <= 10 ? v : null;
    });

    // 5. Update Database
    if (user?.id) {
      const { error: dbErr } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: nameTrimmed,
        roll_no: rollTrimmed,
        branch: form.branch,
        semester: form.semester,
        section: sectionTrimmed,
        profile_picture_url: pfpUrl,
        sgpas: sgpaArr,
        updated_at: new Date().toISOString(),
      });
      
      if (dbErr) {
        setLoading(false);
        return setError(dbErr.message);
      }
    }

    // 6. Sync Local Store
    updateStore({
      ...user,
      name: nameTrimmed,
      roll: rollTrimmed,
      branch: form.branch,
      semester: form.semester,
      sem: semIndex,
      section: sectionTrimmed,
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
          <p style={{ fontSize: ".7rem", color: "var(--g4)", marginTop: 4 }}>Optional (Max 5MB)</p>
        </div>
      </div>

      <div className="form-row">
        <label className="form-label">Full Name</label>
        <input 
          className="form-input" 
          value={form.name} 
          onChange={(e) => set("name", e.target.value.slice(0, 80))} 
        />
      </div>

      <div className="form-row">
        <label className="form-label">Roll Number</label>
        <input 
          className="form-input" 
          value={form.roll} 
          maxLength={12}
          inputMode="numeric"
          onChange={(e) => set("roll", e.target.value.replace(/\D/g, ""))} 
        />
      </div>

      <div className="form-row">
        <label className="form-label">Section</label>
        <input 
          className="form-input" 
          value={form.section} 
          onChange={(e) => set("section", e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 1).toUpperCase())} 
        />
      </div>

      <div className="form-row">
        <label className="form-label">Branch</label>
        <select className="form-select" value={form.branch} onChange={(e) => set("branch", e.target.value)}>
          {BRANCHES.map((b) => <option key={b} value={b}>{BRANCH_LABELS[b]}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label className="form-label">Current Semester</label>
        <select 
          className="form-select" 
          value={form.semester} 
          onChange={(e) => set("semester", Number(e.target.value))}
        >
          {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      {semIndex > 1 && (
        <div className="form-row">
          <label className="form-label">Semester-wise SGPAs</label>
          <div className="login-cgpa-grid">
            {Array.from({ length: semIndex - 1 }).map((_, i) => (
              <div className="login-cgpa-item" key={i}>
                <label>Sem {i + 1}</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="10" 
                  placeholder="—"
                  value={sgpas[i] ?? ""} 
                  onChange={(e) => {
                    const val = e.target.value;
                    // Restrict invalid input characters and out-of-bounds values immediately
                    if (val !== "" && (!/^\d{0,2}(\.\d{0,2})?$/.test(val) || parseFloat(val) > 10)) {
                      return;
                    }
                    const arr = [...sgpas];
                    arr[i] = val;
                    setSgpas(arr);
                  }} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="form-error">{error}</div>}

      <button 
        className="btn btn-primary" 
        style={{ width: "100%", marginTop: 12 }}
        onClick={handleSave} 
        disabled={loading}
      >
        {loading ? "Saving…" : "Save Profile"}
      </button>
    </Modal>
  );
}
