import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

import { useUserStore } from "../store/useStore";
import { supabase } from "../lib/supabase";
import { signUpUser, signInUser, sendPasswordReset, updateUserPassword } from "../services/authService";
import { fetchStudentProfile, isProfileComplete, updateProfile, createProfile } from "../services/profileService";
import { uploadAvatar } from "../services/storageService";
import ImageCropper from "./profile/ImageCropper";
import { authSchema, profileSchema, buildSgpaArray } from "../utils/validators";
import { friendlyError } from "../utils/errorHelpers";
import {
  BRANCH_CODES, BRANCH_LABELS, SEMESTERS, SECTIONS, MAX_AVATAR_BYTES,
} from "../utils/constants";

function FieldError({ error }) {
  if (!error) return null;
  return <p className="error" role="alert">{error.message}</p>;
}

const forgotSchema = z.object({
  email: z.string().email("Invalid email address."),
});

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

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

  const [mode, setMode] = useState("signup");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setMode("reset");
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("reset");
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  const [pendingUserId, setPendingUserId] = useState(null);
  const [pendingEmail, setPendingEmail]   = useState(null);
  const [pendingName, setPendingName]     = useState(null);

  const [pfpFile, setPfpFile]       = useState(null);
  const [pfpPreview, setPfpPreview] = useState(null);
  const [cropSrc, setCropSrc]       = useState(null);

  const authForm    = useForm({ resolver: zodResolver(authSchema) });
  const forgotForm  = useForm({ resolver: zodResolver(forgotSchema) });
  const resetForm   = useForm({ resolver: zodResolver(resetSchema) });
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { branch: "AIDS", semester: 5, section: "1", roll_no: "" },
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
  const removePfp = useCallback(() => { setPfpFile(null); setPfpPreview(null); }, []);

  const onAuthSubmit = useCallback(async (data) => {
    console.log("FORM SUBMITTED", data);
    const toastId = toast.loading("Processing…");
    try {
      if (mode === "signup") {
        const { user } = await signUpUser({
          email: data.email,
          password: data.password,
          fullName: data.fullName.trim(),
        });

        // Immediately create the profile row after signup
        await createProfile({
          id: user.id,
          full_name: data.fullName.trim(),
        });

        setPendingUserId(user.id);
        setPendingEmail(data.email);
        setPendingName(data.fullName.trim());
        setMode("profile");
        toast.success("Account created! Complete your profile.", { id: toastId });
      } else {
        const { user } = await signInUser({ email: data.email, password: data.password });
        const profile = await fetchStudentProfile(user.id);
        if (!isProfileComplete(profile)) {
          setPendingUserId(user.id);
          setPendingEmail(user.email);
          setPendingName(profile?.full_name || "");
          setMode("profile");
          toast.dismiss(toastId);
          return;
        }
        loginStore({
          id: user.id, name: profile.full_name, email: user.email,
          roll: profile.roll_no, branch: profile.branch,
          semester: profile.semester, sem: profile.semester,
          section: profile.section, pfp: profile.profile_picture_url,
          sgpas: profile.sgpas || [],
        });
        toast.success("Welcome back!", { id: toastId });
      }
    } catch (err) {
      console.error("SIGNUP ERROR:", err);

      alert(
        err?.message ||
        JSON.stringify(err, null, 2) ||
        "Unknown error"
      );

      toast.error(
        err?.message ||
        JSON.stringify(err) ||
        "Unknown error",
        { id: toastId }
      );
    }
  }, [mode, loginStore]);

  const onForgotSubmit = useCallback(async (data) => {
    const toastId = toast.loading("Sending reset link…");
    try {
      const { error } = await sendPasswordReset(data.email.trim());
      if (error) throw error;
      toast.success("Check your email for a reset link.", { id: toastId });
      forgotForm.reset();
      setMode("login");
    } catch (err) { toast.error(friendlyError(err), { id: toastId }); }
  }, [forgotForm]);

  const onResetSubmit = useCallback(async (data) => {
    const toastId = toast.loading("Updating password…");
    try {
      const { error } = await updateUserPassword(data.password);
      if (error) throw error;
      toast.success("Password updated. Please sign in.", { id: toastId });
      window.history.replaceState(null, "", window.location.pathname);
      await supabase.auth.signOut();
      resetForm.reset();
      setMode("login");
    } catch (err) { toast.error(friendlyError(err), { id: toastId }); }
  }, [resetForm]);

  const onProfileSubmit = useCallback(async (data) => {
    if (!pendingUserId || !pendingEmail) {
      toast.error("Session lost. Please sign up again.");
      setMode("signup");
      return;
    }
    const toastId = toast.loading("Saving profile…");
    try {
      let finalPfpUrl = null;
      if (pfpFile) {
        const url = await uploadAvatar(pendingUserId, pfpFile);
        finalPfpUrl = url;
      }
      const sgpaArr = buildSgpaArray(Number(data.semester), data.sgpas);

      await updateProfile(pendingUserId, {
        full_name: pendingName,
        roll_no: data.roll_no,
        branch: data.branch,
        semester: Number(data.semester),
        section: data.section,
        profile_picture_url: finalPfpUrl,
        sgpas: sgpaArr,
      });

      loginStore({
        id: pendingUserId,
        name: pendingName,
        email: pendingEmail,
        roll: data.roll_no,
        branch: data.branch,
        semester: Number(data.semester),
        sem: Number(data.semester),
        section: data.section,
        pfp: finalPfpUrl,
        sgpas: sgpaArr,
      });
      toast.success("Profile saved! Welcome 🎉", { id: toastId });
    } catch (err) {
      toast.error(friendlyError(err), { id: toastId });
    }
  }, [pendingUserId, pendingEmail, pendingName, pfpFile, loginStore]);

  return (
    <div id="loginGate" role="main" aria-label="Sign in">
      <Toaster position="top-center" />
      {cropSrc && (
        <ImageCropper imageSrc={cropSrc} onCancel={handleCropCancel} onConfirm={handleCropConfirm} />
      )}
      <div className="login-box">
        <div className="login-logo">THE AID <span>2</span> TIMES</div>
        <div className="login-sub">CBIT's student resource portal</div>

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
              <select id="section" className="form-select" {...profileForm.register("section")}>
                {SECTIONS.map((s) => <option key={s} value={String(s)}>Section {s}</option>)}
              </select>
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
                <label className="form-label">
                  Previous SGPAs{" "}
                  <span style={{ color: "var(--g4)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </label>
                <div className="login-cgpa-grid">
                  {Array.from({ length: Number(currentSem) - 1 }, (_, i) => i + 1).map((n) => (
                    <div className="login-cgpa-item" key={n}>
                      <label htmlFor={`sgpa_${n}`}>Sem {n}</label>
                      <input
                        id={`sgpa_${n}`}
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="—"
                        onKeyDown={(e) => {
                          if (
                            !/[\d.]/.test(e.key) &&
                            !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        {...profileForm.register(`sgpas.${n}`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button type="submit" className="btn btn-gold" style={{ width: "100%", marginTop: 12 }} disabled={profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting ? "Saving…" : "Save Profile & Enter →"}
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} noValidate>
            <h2 className="login-heading">Reset Password</h2>
            <p style={{ fontSize: ".82rem", color: "var(--g5)", marginBottom: 14 }}>
              Enter your account email and we'll send you a reset link.
            </p>
            <div className="form-row">
              <label className="form-label" htmlFor="forgot_email">Email</label>
              <input id="forgot_email" className="form-input" type="email" placeholder="you@college.edu" autoComplete="email" {...forgotForm.register("email")} />
              <FieldError error={forgotForm.formState.errors.email} />
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: "100%", marginTop: 8 }} disabled={forgotForm.formState.isSubmitting}>
              {forgotForm.formState.isSubmitting ? "Sending…" : "Send Reset Link"}
            </button>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: ".82rem" }}>
              <button type="button" className="link-btn" onClick={() => setMode("login")}>Back to Sign In</button>
            </div>
          </form>
        )}

        {mode === "reset" && (
          <form onSubmit={resetForm.handleSubmit(onResetSubmit)} noValidate>
            <h2 className="login-heading">Set New Password</h2>
            <div className="form-row">
              <label className="form-label" htmlFor="new_password">New Password</label>
              <input id="new_password" type="password" className="form-input" placeholder="••••••" autoComplete="new-password" {...resetForm.register("password")} />
              <FieldError error={resetForm.formState.errors.password} />
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="confirm_password">Confirm Password</label>
              <input id="confirm_password" type="password" className="form-input" placeholder="••••••" autoComplete="new-password" {...resetForm.register("confirm")} />
              <FieldError error={resetForm.formState.errors.confirm} />
            </div>
            <button type="submit" className="btn btn-gold" style={{ width: "100%", marginTop: 8 }} disabled={resetForm.formState.isSubmitting}>
              {resetForm.formState.isSubmitting ? "Saving…" : "Update Password"}
            </button>
          </form>
        )}

        {mode !== "profile" && mode !== "forgot" && mode !== "reset" && (
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
              <input id="email" className="form-input" type="email" placeholder="you@college.edu"
                autoComplete={mode === "login" ? "email" : "new-email"} {...authForm.register("email")} />
              <FieldError error={authForm.formState.errors.email} />
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" className="form-input" type="password" placeholder="••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"} {...authForm.register("password")} />
              <FieldError error={authForm.formState.errors.password} />
            </div>
            {mode === "signup" && (
              <div className="form-row">
                <label className="form-label" htmlFor="confirm">Confirm Password</label>
                <input id="confirm" className="form-input" type="password" placeholder="••••••"
                  autoComplete="new-password" {...authForm.register("confirm")} />
                <FieldError error={authForm.formState.errors.confirm} />
              </div>
            )}
            <button type="submit" className="btn btn-gold" style={{ width: "100%", marginTop: 8 }} disabled={authForm.formState.isSubmitting}>
              {authForm.formState.isSubmitting ? "Please wait…" : mode === "signup" ? "Create Account →" : "Sign In →"}
            </button>
            {mode === "login" && (
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <button type="button" className="link-btn" style={{ fontSize: ".78rem" }} onClick={() => setMode("forgot")}>
                  Forgot Password?
                </button>
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 14, fontSize: ".82rem", color: "var(--g5)" }}>
              {mode === "signup" ? (
                <>Already have an account?{" "}
                  <button type="button" className="link-btn" onClick={() => switchMode("login")}>Sign in</button>
                </>
              ) : (
                <>No account?{" "}
                  <button type="button" className="link-btn" onClick={() => switchMode("signup")}>Sign up</button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

