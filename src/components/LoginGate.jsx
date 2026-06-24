import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

import { useUserStore } from "../store/useStore";
import { signUpUser, signInUser, getCurrentUser } from "../services/authService";
import { fetchStudentProfile, isProfileComplete, updateProfile } from "../services/profileService";
import { uploadAvatar, deleteAvatar } from "../services/storageService";
import { authSchema, profileSchema, buildSgpaArray } from "../utils/validators";
import { friendlyError } from "../utils/errorHelpers";
import {
  BRANCH_CODES, BRANCH_LABELS, SEMESTERS, MAX_AVATAR_BYTES,
} from "../utils/constants";

function FieldError({ error }) {
  if (!error) return null;
  return <p className="error" role="alert">{error.message}</p>;
}

function AvatarPicker({ preview, onPick, onRemove }) {
  return (
    <div className="pfp-wrap">
      <div className="pfp-preview" aria-label="Avatar preview">
        {preview ? <img src={preview} alt="Profile avatar" /> : "?"}
      </div>
      <div>
        <label className="pfp-btn" style={{ cursor: "pointer" }}>
          📷 Upload Photo
          <input type="file" accept="image/*" hidden onChange={onPick} aria-label="Upload profile photo" />
        </label>
        {preview && (
          <button type="button" className="btn btn-outline" onClick={onRemove}
            style={{ marginTop: 6, fontSize: ".75rem", padding: "4px 10px" }}>
            ❌ Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoginGate() {
  const loginStore = useUserStore((s) => s.login);

  const [mode, setMode] = useState("login");
  const [pendingUserId, setPendingUserId] = useState(null);
  const [pendingEmail, setPendingEmail]   = useState(null);

  const [pfpFile, setPfpFile]           = useState(null);
  const [pfpPreview, setPfpPreview]     = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);

  const authForm = useForm({ resolver: zodResolver(authSchema) });
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { branch: "AIDS", semester: 5, section: "", roll_no: "" },
  });

  const currentSem = profileForm.watch("semester");

  const switchMode = useCallback((next) => {
    authForm.reset();
    setMode(next);
  }, [authForm]);

  const handlePfp = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) { toast.error("Image must be under 5 MB."); return; }
    setPfpFile(file);
    setPhotoRemoved(false);
    const reader = new FileReader();
    reader.onload = (ev) => setPfpPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const removePfp = useCallback(() => {
    setPfpFile(null); setPfpPreview(null); setPhotoRemoved(true);
  }, []);

  const onAuthSubmit = useCallback(async (data) => {
    const toastId = toast.loading("Processing…");
    try {
      if (mode === "signup") {
        const { user } = await signUpUser({ email: data.email, password: data.password, fullName: data.fullName.trim() });
        setPendingUserId(user.id); setPendingEmail(user.email); setMode("profile");
        toast.success("Account created! Complete your profile.", { id: toastId });
      } else {
        const { user } = await signInUser({ email: data.email, password: data.password });
        const profile = await fetchStudentProfile(user.id);
        if (!isProfileComplete(profile)) {
          setPendingUserId(user.id); setPendingEmail(user.email); setMode("profile");
          toast.dismiss(toastId); return;
        }
        loginStore({
          id: user.id, name: profile.full_name, email: user.email, roll: profile.roll_no,
          branch: profile.branch, semester: profile.semester, sem: profile.semester,
          section: profile.section, pfp: profile.profile_picture_url, sgpas: profile.sgpas || [],
        });
        toast.success("Welcome back!", { id: toastId });
      }
    } catch (err) { toast.error(friendlyError(err), { id: toastId }); }
  }, [mode, loginStore]);

  const onProfileSubmit = useCallback(async (data) => {
    const currentUser = await getCurrentUser();
    if (!currentUser || !pendingUserId) {
      toast.error("Session expired. Please log in again."); setMode("login"); setPendingUserId(null); return;
    }
    const toastId = toast.loading("Saving profile…");
    try {
      const existing = await fetchStudentProfile(pendingUserId);
      let finalPfpUrl = photoRemoved ? null : (existing?.profile_picture_url || null);
      if (pfpFile) { const { url } = await uploadAvatar(pendingUserId, pfpFile); finalPfpUrl = url; }
      else if (photoRemoved && existing?.profile_picture_url) { deleteAvatar(pendingUserId); }
      const sgpaArr = buildSgpaArray(data.sgpas, Number(data.semester));
      const fullName = currentUser.user_metadata?.full_name || existing?.full_name || data.fullName || "";
      await updateProfile(pendingUserId, {
        full_name: fullName, roll_no: data.roll_no, branch: data.branch,
        semester: Number(data.semester), section: data.section, profile_picture_url: finalPfpUrl, sgpas: sgpaArr,
      });
      loginStore({
        id: pendingUserId, name: fullName, email: pendingEmail || currentUser.email,
        roll: data.roll_no, branch: data.branch, semester: Number(data.semester), sem: Number(data.semester),
        section: data.section, pfp: finalPfpUrl, sgpas: sgpaArr,
      });
      toast.success("Profile saved!", { id: toastId });
    } catch (err) { toast.error(friendlyError(err), { id: toastId }); }
  }, [pendingUserId, pendingEmail, pfpFile, photoRemoved, loginStore]);

  return (
    <div id="loginGate" role="main" aria-label="Sign in">
      <Toaster position="top-center" />
      <div className="login-box">
        {mode === "profile" && (
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} noValidate>
            <h2 className="login-heading">Complete Your Profile</h2>
            <AvatarPicker preview={pfpPreview} onPick={handlePfp} onRemove={removePfp} />
            <div className="form-row">
              <label className="form-label" htmlFor="roll_no">Roll Number</label>
              <input id="roll_no" className="form-input" placeholder="e.g. 220010234" inputMode="numeric" {...profileForm.register("roll_no")} />
              <FieldError error={profileForm.formState.errors.roll_no} />
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="section">Section</label>
              <input id="section" className="form-input" placeholder="e.g. A" maxLength={1} {...profileForm.register("section")} />
              <FieldError error={profileForm.formState.errors.section} />
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="branch">Branch</label>
              <select id="branch" className="form-select" {...profileForm.register("branch")}>
                {BRANCH_CODES.map((b) => <option key={b} value={b}>{BRANCH_LABELS[b]}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="semester">Current Semester</label>
              <select id="semester" className="form-select" {...profileForm.register("semester", { valueAsNumber: true })}>
                {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
            {Number(currentSem) > 1 && (
              <div className="form-row">
                <label className="form-label">Semester-wise SGPAs</label>
                <div className="login-cgpa-grid">
                  {Array.from({ length: Number(currentSem) - 1 }, (_, i) => i + 1).map((n) => (
                    <div className="login-cgpa-item" key={n}>
                      <label htmlFor={`sgpa_${n}`}>Sem {n}</label>
                      <input id={`sgpa_${n}`} type="number" step="0.01" min="0" max="10" placeholder="—" {...profileForm.register(`sgpas.${n}`)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 12 }} disabled={profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting ? "Saving…" : "Save Profile"}
            </button>
          </form>
        )}
        {mode !== "profile" && (
          <form onSubmit={authForm.handleSubmit(onAuthSubmit)} noValidate>
            <h2 className="login-heading">{mode === "signup" ? "Create Account" : "Sign In"}</h2>
            {mode === "signup" && (
              <div className="form-row">
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input id="fullName" className="form-input" placeholder="Your full name" {...authForm.register("fullName")} />
                <FieldError error={authForm.formState.errors.fullName} />
              </div>
            )}
            <div className="form-row">
              <label className="form-label" htmlFor="email">Email</label>
              <input id="email" className="form-input" type="email" placeholder="you@college.edu" autoComplete={mode === "login" ? "email" : "new-email"} {...authForm.register("email")} />
              <FieldError error={authForm.formState.errors.email} />
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" className="form-input" type="password" placeholder="••••••" autoComplete={mode === "login" ? "current-password" : "new-password"} {...authForm.register("password")} />
              <FieldError error={authForm.formState.errors.password} />
            </div>
            {mode === "signup" && (
              <div className="form-row">
                <label className="form-label" htmlFor="confirm">Confirm Password</label>
                <input id="confirm" className="form-input" type="password" placeholder="••••••" autoComplete="new-password" {...authForm.register("confirm")} />
                <FieldError error={authForm.formState.errors.confirm} />
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={authForm.formState.isSubmitting}>
              {authForm.formState.isSubmitting ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
            </button>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: ".82rem" }}>
              {mode === "login" ? (
                <>No account? <button type="button" className="link-btn" onClick={() => switchMode("signup")}>Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" className="link-btn" onClick={() => switchMode("login")}>Sign in</button></>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
