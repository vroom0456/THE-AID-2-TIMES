import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import imageCompression from "browser-image-compression";

import { supabase } from "../lib/supabase";
import { useUserStore } from "../store/useStore";
import { fetchStudentProfile } from "../lib/supabaseResources";

// ─── CONSTANTS ─────────────────────────────────────────────────────────
const BRANCHES = ["AIDS", "CSE", "AIML", "IT", "CIC", "ECE", "EVL", "MECHANICAL", "CIVIL", "BIOTECH"];
const BRANCH_LABELS = {
  AIDS: "AI & Data Science", CSE: "Computer Science", AIML: "AI & ML",
  IT: "Information Technology", CIC: "CS (IoT & Cyber)", ECE: "Electronics & Comm",
  EVL: "EV & VLSI", MECHANICAL: "Mechanical", CIVIL: "Civil", BIOTECH: "Bio-Technology",
};
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// ─── VALIDATION SCHEMAS ────────────────────────────────────────────────
const authSchema = z.object({
  email: z.string().email("Invalid email."),
  password: z.string().min(6, "Min 6 characters."),
  fullName: z.string().optional(),
  confirm: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.confirm && data.password !== data.confirm) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Passwords do not match.", path: ["confirm"] });
  }
  if (data.confirm && (!data.fullName || data.fullName.length < 2)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name required.", path: ["fullName"] });
  }
});

const profileSchema = z.object({
  roll_no: z.string().regex(/^\d+$/, "Numeric only.").max(12, "Max 12 digits."),
  branch: z.enum(["AIDS", "CSE", "AIML", "IT", "CIC", "ECE", "EVL", "MECHANICAL", "CIVIL", "BIOTECH"]),
  semester: z.coerce.number().min(1).max(8),
  section: z.string().regex(/^[A-Z]$/, "A-Z only."),
  sgpas: z.record(z.string(), z.any()).default({}),
});

// ─── COMPONENT ─────────────────────────────────────────────────────────
export default function LoginGate() {
  const loginStore = useUserStore((s) => s.login);
  const [mode, setMode] = useState("login");
  const [pendingUser, setPendingUser] = useState(null);
  const [pfpFile, setPfpFile] = useState(null);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);

  const authForm = useForm({ resolver: zodResolver(authSchema) });
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { branch: "AIDS", semester: 5, section: "", roll_no: "" }
  });

  const currentSem = profileForm.watch("semester");

  const handlePfp = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB.");
    setPfpFile(file);
    setPhotoRemoved(false);
    const reader = new FileReader();
    reader.onload = (ev) => setPfpPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removePfp = () => { setPfpFile(null); setPfpPreview(null); setPhotoRemoved(true); };

  const onAuthSubmit = async (data) => {
    const toastId = toast.loading("Processing...");
    try {
      if (mode === "signup") {
        const { data: authData, error: signupErr } = await supabase.auth.signUp({
          email: data.email, password: data.password, options: { data: { full_name: data.fullName } }
        });
        if (signupErr) throw signupErr;
        if (!authData.user) throw new Error("Account creation failed.");
        
        const { error: pErr } = await supabase.from("profiles").insert({
          id: authData.user.id, email: data.email, full_name: data.fullName, created_at: new Date().toISOString()
        });
        if (pErr) throw pErr;
        setPendingUser(authData.user);
        setMode("profile");
        toast.success("Success!", { id: toastId });
      } else {
        const { data: authData, error: loginErr } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
        if (loginErr) throw loginErr;
        const profile = await fetchStudentProfile(authData.user.id);
        if (!profile?.roll_no || !profile?.branch || !profile?.semester || !profile?.section) {
          setPendingUser(authData.user);
          setMode("profile");
          return;
        }
        loginStore({ id: authData.user.id, ...profile, name: profile.full_name, roll: profile.roll_no, pfp: profile.profile_picture_url });
        toast.success("Welcome back!", { id: toastId });
      }
    } catch (err) { toast.error(err.message, { id: toastId }); }
  };

  const onProfileSubmit = async (data) => {
    if (!pendingUser) { toast.error("Session expired."); return; }
    const toastId = toast.loading("Saving...");
    try {
      const { data: { user: currentUser }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !currentUser) throw new Error("Session expired.");

      const { data: currentProfile } = await supabase.from("profiles")
        .select("full_name, profile_picture_url").eq("id", pendingUser.id).single();
      
      let finalPfpUrl = photoRemoved ? null : currentProfile?.profile_picture_url;
      if (pfpFile) {
        const compressed = await imageCompression(pfpFile, { maxSizeMB: 0.3, maxWidthOrHeight: 800, useWebWorker: true, fileType: "image/jpeg" });
        const { error: sErr } = await supabase.storage.from("avatars").upload(`${pendingUser.id}/avatar.jpeg`, compressed, { 
          contentType: "image/jpeg", upsert: true 
        });
        if (sErr) throw new Error("Upload failed.");
        const { data: url } = supabase.storage.from("avatars").getPublicUrl(`${pendingUser.id}/avatar.jpeg`);
        finalPfpUrl = `${url.publicUrl}?t=${Date.now()}`;
      } else if (photoRemoved) {
        await supabase.storage.from("avatars").remove([`${pendingUser.id}/avatar.jpeg`]).catch(() => {});
      }

      const sgpaArr = Array.from({ length: data.semester - 1 }, (_, i) => Number(data.sgpas[String(i + 1)] || 0));
      const fullName = currentUser.user_metadata?.full_name || currentProfile?.full_name || "";

      const { error: profileErr } = await supabase.from("profiles").update({
        full_name: fullName, roll_no: data.roll_no, branch: data.branch, semester: data.semester,
        section: data.section, profile_picture_url: finalPfpUrl, sgpas: sgpaArr, updated_at: new Date().toISOString()
      }).eq("id", pendingUser.id);

      if (profileErr) throw profileErr;

      loginStore({
        id: pendingUser.id, name: fullName, email: pendingUser.email,
        roll: data.roll_no, branch: data.branch, semester: data.semester,
        sem: data.semester, section: data.section, pfp: finalPfpUrl, sgpas: sgpaArr
      });
      toast.success("Saved!", { id: toastId });
    } catch (err) { toast.error(err.message, { id: toastId }); }
  };

  return (
    <div id="loginGate">
      <Toaster />
      <div className="login-box">
        {mode === "profile" ? (
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <div className="pfp-wrap">
              <div className="pfp-preview">{pfpPreview ? <img src={pfpPreview} alt="pfp" /> : "?"}</div>
              <label>📷 Upload<input type="file" accept="image/*" hidden onChange={handlePfp}/></label>
              {pfpPreview && <button type="button" onClick={removePfp}>❌ Remove</button>}
            </div>
            <input className="form-input" placeholder="Roll Number" {...profileForm.register("roll_no")} />
            {profileForm.formState.errors.roll_no && <p className="error">{profileForm.formState.errors.roll_no.message}</p>}
            <input className="form-input" placeholder="Section" {...profileForm.register("section")} />
            <select {...profileForm.register("branch")}>{BRANCHES.map(b => <option key={b} value={b}>{BRANCH_LABELS[b]}</option>)}</select>
            <select {...profileForm.register("semester", { valueAsNumber: true })}>{SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}</select>
            {currentSem > 1 && Array.from({ length: currentSem - 1 }, (_, i) => i + 1).map(n => (
              <input key={n} type="number" step="0.01" placeholder={`Sem ${n} SGPA`} {...profileForm.register(`sgpas.${n}`)} />
            ))}
            <button type="submit" disabled={profileForm.formState.isSubmitting}>Save Profile</button>
          </form>
        ) : (
          <form onSubmit={authForm.handleSubmit(onAuthSubmit)}>
            {mode === "signup" && <input className="form-input" placeholder="Full Name" {...authForm.register("fullName")} />}
            <input className="form-input" type="email" placeholder="Email" {...authForm.register("email")} />
            <input className="form-input" type="password" placeholder="Password" {...authForm.register("password")} />
            {mode === "signup" && <input className="form-input" type="password" placeholder="Confirm" {...authForm.register("confirm")} />}
            <button type="submit" disabled={authForm.formState.isSubmitting}>Submit</button>
          </form>
        )}
      </div>
    </div>
  );
}
