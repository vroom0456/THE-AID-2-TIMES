import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import imageCompression from "browser-image-compression";

import { supabase } from "../lib/supabase";
import { useUserStore } from "../store/useStore";
import { fetchStudentProfile } from "../lib/supabaseResources";

// ─── CONSTANTS & ENUMS ─────────────────────────────────────────────────────────
const BRANCHES = ["AIDS", "CSE", "AIML", "IT", "CIC", "ECE", "EVL", "MECHANICAL", "CIVIL", "BIOTECH"] as const;
const BRANCH_LABELS: Record<typeof BRANCHES[number], string> = {
  AIDS: "AI & Data Science", CSE: "Computer Science", AIML: "AI & ML",
  IT: "Information Technology", CIC: "CS (IoT & Cyber)", ECE: "Electronics & Comm",
  EVL: "EV & VLSI", MECHANICAL: "Mechanical", CIVIL: "Civil", BIOTECH: "Bio-Technology",
};
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

// ─── VALIDATION SCHEMAS (ZOD) ──────────────────────────────────────────────────
const authSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  fullName: z.string().optional(),
  confirm: z.string().optional(),
}).refine((data) => !data.confirm || data.password === data.confirm, {
  message: "Passwords do not match.",
  path: ["confirm"],
});

const profileSchema = z.object({
  roll_no: z.string().regex(/^\d+$/, "Numeric only.").max(12, "Max 12 digits."),
  branch: z.enum(BRANCHES, { errorMap: () => ({ message: "Invalid branch." }) }),
  semester: z.coerce.number().min(1).max(8),
  section: z.string().regex(/^[A-Z]$/, "Single uppercase letter (e.g. A)."),
  sgpas: z.record(z.string(), z.any()).optional().default({}),
}).superRefine((data, ctx) => {
  // Cross-field validation: Ensure all previous SGPAs exist based on selected semester
  if (data.semester > 1) {
    for (let i = 1; i < data.semester; i++) {
      const val = data.sgpas[String(i)];
      const parsed = parseFloat(val);
      if (val === undefined || val === null || val === "" || isNaN(parsed) || parsed < 0 || parsed > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Valid SGPA (0-10) is required for Semester ${i}.`,
          path: ["sgpas", String(i)],
        });
      }
    }
  }
});

type AuthFormData = z.infer<typeof authSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

// ─── STRICT ERROR MAPPER ───────────────────────────────────────────────────────
function getFriendlyError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes("Invalid login credentials")) return "Incorrect email or password.";
    if (msg.includes("already exists") || msg.includes("already registered")) return "An account with this email already exists.";
    if (msg.includes("fetch")) return "Network error. Please check your connection.";
    return msg;
  }
  if (typeof err === "string") return err;
  return "Something went wrong. Please try again.";
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────────
export default function LoginGate() {
  const loginStore = useUserStore((s) => s.login);

  const [mode, setMode] = useState<"login" | "signup" | "profile">("login");
  const [pendingUser, setPendingUser] = useState<any>(null);

  // Avatar states
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [pfpPreview, setPfpPreview] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);

  // React Hook Form setups
  const authForm = useForm<AuthFormData>({ resolver: zodResolver(authSchema) });
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { branch: "AIDS", semester: 5, section: "", roll_no: "" }
  });

  const currentSem = profileForm.watch("semester");

  // ─── AVATAR HANDLERS ─────────────────────────────────────────────────────────
  const handlePfp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be under 5 MB.");
    }
    
    setPfpFile(file);
    setPhotoRemoved(false);
    const reader = new FileReader();
    reader.onload = (ev) => setPfpPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removePfp = () => {
    setPfpFile(null);
    setPfpPreview(null);
    setPhotoRemoved(true);
  };

  // ─── AUTHENTICATION SUBMISSION ───────────────────────────────────────────────
  const onAuthSubmit = async (data: AuthFormData) => {
    const toastId = toast.loading(mode === "login" ? "Signing in..." : "Creating account...");

    try {
      if (mode === "signup") {
        const { data: authData, error: signupErr } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: { data: { full_name: data.fullName } },
        });

        if (signupErr) throw signupErr;
        if (!authData.user) throw new Error("Account creation failed.");

        const { error: profileErr } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          created_at: new Date().toISOString(),
        });

        if (profileErr) {
          await supabase.auth.signOut();
          throw profileErr;
        }

        setPendingUser(authData.user);
        setMode("profile");
        toast.success("Account created! Let's setup your profile.", { id: toastId });
      } else {
        const { data: authData, error: loginErr } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (loginErr) throw loginErr;
        if (!authData.user) throw new Error("Login failed.");

        const profile = await fetchStudentProfile(authData.user.id);

        if (!profile?.roll_no || !profile?.branch || !profile?.semester) {
          setPendingUser(authData.user);
          if (profile) {
            profileForm.reset({
              roll_no: profile.roll_no || "",
              branch: profile.branch || "AIDS",
              semester: profile.semester || 5,
              section: profile.section || "",
              sgpas: profile.sgpas?.reduce((acc: any, val: number, i: number) => ({ ...acc, [i + 1]: val }), {}) || {}
            });
            if (profile.profile_picture_url) setPfpPreview(profile.profile_picture_url);
          }
          setMode("profile");
          toast("Please complete your profile.", { icon: "👋", id: toastId });
          return;
        }

        loginStore({
          id: authData.user.id,
          email: authData.user.email,
          name: profile.full_name,
          roll: profile.roll_no,
          branch: profile.branch,
          semester: profile.semester,
          sem: profile.semester,
          section: profile.section,
          pfp: profile.profile_picture_url,
          sgpas: profile.sgpas || [],
        });
        toast.success("Welcome back!", { id: toastId });
      }
    } catch (err) {
      toast.error(getFriendlyError(err), { id: toastId });
    }
  };

  // ─── PROFILE SUBMISSION & TRANSACTION ────────────────────────────────────────
  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!pendingUser) return toast.error("Session expired. Please sign in again.");

    const toastId = toast.loading("Saving profile...");
    let finalPfpUrl: string | null = null;

    try {
      const { data: { user: currentUser }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !currentUser) throw new Error("Session expired. Please sign in again.");

      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("full_name, profile_picture_url")
        .eq("id", pendingUser.id)
        .single();

      // 1. Storage: Fix Avatar Path Leaks by overwriting a single exact file
      const exactAvatarPath = `${pendingUser.id}/avatar.jpeg`;

      if (photoRemoved && currentProfile?.profile_picture_url) {
        await supabase.storage.from("avatars").remove([exactAvatarPath]).catch(() => console.warn("Silent delete fail"));
      }

      finalPfpUrl = photoRemoved ? null : currentProfile?.profile_picture_url || null;

      if (pfpFile) {
        const compressedImage = await imageCompression(pfpFile, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: "image/jpeg" // Force JPEG for consistency in overwrite
        });
        
        const { error: storageErr } = await supabase.storage
          .from("avatars")
          .upload(exactAvatarPath, compressedImage, { 
             contentType: "image/jpeg", 
             upsert: true // Ensures single file, no infinite growth
          });
        
        if (storageErr) throw new Error("Failed to upload profile picture.");
        
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(exactAvatarPath);
        // Cache busting via query param without changing the actual file path
        finalPfpUrl = `${urlData.publicUrl}?t=${Date.now()}`; 
      }

      const sgpaArr = Array.from({ length: data.semester - 1 }, (_, i) => parseFloat(data.sgpas[String(i + 1)]));
      const finalName = currentUser?.user_metadata?.full_name || currentProfile?.full_name || "";

      // 2. Database: Update Profile (Ideally an RPC here for true transactions)
      const { error: profileErr } = await supabase.from("profiles").update({
        full_name: finalName,
        roll_no: data.roll_no,
        branch: data.branch,
        semester: data.semester,
        section: data.section,
        profile_picture_url: finalPfpUrl,
        sgpas: sgpaArr,
        updated_at: new Date().toISOString(),
      }).eq("id", pendingUser.id);

      if (profileErr) {
        // Rollback image upload if DB update fails
        if (pfpFile) await supabase.storage.from("avatars").remove([exactAvatarPath]).catch(() => {});
        throw profileErr;
      }

      setPfpFile(null);
      setPhotoRemoved(false);

      loginStore({
        id: pendingUser.id,
        email: pendingUser.email,
        name: finalName,
        roll: data.roll_no,
        branch: data.branch,
        semester: data.semester,
        sem: data.semester,
        section: data.section,
        pfp: finalPfpUrl,
        sgpas: sgpaArr,
      });

      toast.success("Profile saved successfully!", { id: toastId });
    } catch (err) {
      toast.error(getFriendlyError(err), { id: toastId });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: PROFILE SETUP
  // ─────────────────────────────────────────────────────────────────────────
  if (mode === "profile") {
    return (
      <div id="loginGate">
        <Toaster position="top-center" />
        <div className="login-box">
          <div className="login-logo">THE AID <span>2</span> TIMES</div>
          <div className="login-sub">Complete your profile to continue</div>

          {/* AVATAR UPLOAD */}
          <div className="pfp-wrap">
            <div className="pfp-preview">
              {pfpPreview ? <img src={pfpPreview} alt="pfp" /> : "?"}
            </div>
            <div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <label className="pfp-btn" htmlFor="avatar-upload" style={{ cursor: "pointer", margin: 0 }}>
                  📷 Upload Photo
                  <input id="avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePfp} />
                </label>
                {pfpPreview && (
                  <button type="button" onClick={removePfp} aria-label="Remove photo" style={{ background: "none", border: "none", color: "var(--red, #ff4444)", cursor: "pointer", fontSize: "0.8rem" }}>
                    ❌ Remove
                  </button>
                )}
              </div>
              <p style={{ fontSize: ".7rem", color: "var(--g4)", marginTop: 5 }}>Optional (Max 5MB)</p>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            {/* ROLL NUMBER */}
            <div className="form-row">
              <label className="form-label" htmlFor="roll_no">Roll Number *</label>
              <input
                id="roll_no"
                className="form-input"
                placeholder="e.g. 160122771001"
                maxLength={12}
                inputMode="numeric"
                aria-invalid={!!profileForm.formState.errors.roll_no}
                aria-describedby="roll_no_error"
                {...profileForm.register("roll_no", {
                  onChange: (e) => e.target.value = e.target.value.replace(/\D/g, "")
                })}
              />
              {profileForm.formState.errors.roll_no && (
                <span id="roll_no_error" className="form-error" role="alert">{profileForm.formState.errors.roll_no.message}</span>
              )}
            </div>

            {/* SECTION */}
            <div className="form-row">
              <label className="form-label" htmlFor="section">Section *</label>
              <input
                id="section"
                className="form-input"
                placeholder="e.g. A"
                aria-invalid={!!profileForm.formState.errors.section}
                aria-describedby="section_error"
                {...profileForm.register("section", {
                  onChange: (e) => e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 1).toUpperCase()
                })}
              />
              {profileForm.formState.errors.section && (
                <span id="section_error" className="form-error" role="alert">{profileForm.formState.errors.section.message}</span>
              )}
            </div>

            {/* BRANCH */}
            <div className="form-row">
              <label className="form-label" htmlFor="branch">Branch *</label>
              <select 
                id="branch" 
                className="form-select" 
                aria-invalid={!!profileForm.formState.errors.branch} 
                aria-describedby="branch_error"
                {...profileForm.register("branch")}
              >
                {BRANCHES.map((b) => <option key={b} value={b}>{BRANCH_LABELS[b]}</option>)}
              </select>
              {profileForm.formState.errors.branch && (
                <span id="branch_error" className="form-error" role="alert">{profileForm.formState.errors.branch.message}</span>
              )}
            </div>

            {/* SEMESTER */}
            <div className="form-row">
              <label className="form-label" htmlFor="semester">Current Semester *</label>
              <select id="semester" className="form-select" {...profileForm.register("semester")}>
                {SEMESTERS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>

            {/* SGPAs (Contextual rendering and cross-validation via superRefine) */}
            {currentSem > 1 && (
              <div className="form-row">
                <label className="form-label">Previous Semester SGPAs *</label>
                <div className="login-cgpa-grid">
                  {Array.from({ length: currentSem - 1 }, (_, i) => i + 1).map((n) => (
                    <div className="login-cgpa-item" key={n}>
                      <label htmlFor={`sgpa-${n}`}>Sem {n}</label>
                      <input
                        id={`sgpa-${n}`}
                        type="number"
                        placeholder="—"
                        step="0.01"
                        aria-invalid={!!profileForm.formState.errors.sgpas?.[String(n)]}
                        aria-describedby={`sgpa_error_${n}`}
                        {...profileForm.register(`sgpas.${n}` as any, {
                          onChange: (e) => {
                            const val = e.target.value;
                            if (val !== "" && (!/^\d{0,2}(\.\d{0,2})?$/.test(val) || parseFloat(val) > 10)) {
                              e.target.value = val.slice(0, -1);
                            }
                          }
                        })}
                      />
                      {profileForm.formState.errors.sgpas?.[String(n)] && (
                        <span id={`sgpa_error_${n}`} className="form-error" role="alert" style={{ display: 'none' }}>
                          {profileForm.formState.errors.sgpas[String(n)]?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {profileForm.formState.errors.sgpas && (
                  <span className="form-error" role="alert">Please provide valid SGPAs (0-10) for all past semesters.</span>
                )}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 10 }} disabled={profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting ? "Saving..." : "Enter Portal →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: AUTHENTICATION
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div id="loginGate">
      <Toaster position="top-center" />
      <div className="login-box">
        <div className="login-logo">THE AID <span>2</span> TIMES</div>
        <div className="login-sub">
          {mode === "login" ? "Sign in to your account" : "Create your student account"}
        </div>

        <form onSubmit={authForm.handleSubmit(onAuthSubmit)}>
          {mode === "signup" && (
            <div className="form-row">
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <input 
                id="fullName" 
                className="form-input" 
                placeholder="e.g. Rohan Reddy" 
                aria-invalid={!!authForm.formState.errors.fullName} 
                aria-describedby="fullName_error"
                {...authForm.register("fullName")} 
              />
              {authForm.formState.errors.fullName && (
                <span id="fullName_error" className="form-error" role="alert">{authForm.formState.errors.fullName.message}</span>
              )}
            </div>
          )}

          <div className="form-row">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input 
              id="email" 
              className="form-input" 
              type="email" 
              placeholder="your@email.com" 
              aria-invalid={!!authForm.formState.errors.email} 
              aria-describedby="email_error"
              {...authForm.register("email")} 
            />
            {authForm.formState.errors.email && (
              <span id="email_error" className="form-error" role="alert">{authForm.formState.errors.email.message}</span>
            )}
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="password">Password *</label>
            <input 
              id="password" 
              className="form-input" 
              type="password" 
              placeholder="Min 6 characters" 
              aria-invalid={!!authForm.formState.errors.password} 
              aria-describedby="password_error"
              {...authForm.register("password")} 
            />
            {authForm.formState.errors.password && (
              <span id="password_error" className="form-error" role="alert">{authForm.formState.errors.password.message}</span>
            )}
          </div>

          {mode === "signup" && (
            <div className="form-row">
              <label className="form-label" htmlFor="confirm">Confirm Password *</label>
              <input 
                id="confirm" 
                className="form-input" 
                type="password" 
                placeholder="Repeat password" 
                aria-invalid={!!authForm.formState.errors.confirm} 
                aria-describedby="confirm_error"
                {...authForm.register("confirm")} 
              />
              {authForm.formState.errors.confirm && (
                <span id="confirm_error" className="form-error" role="alert">{authForm.formState.errors.confirm.message}</span>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 10 }} disabled={authForm.formState.isSubmitting}>
            {authForm.formState.isSubmitting 
              ? (mode === "login" ? "Signing In…" : "Creating Account…")
              : (mode === "login" ? "Sign In →" : "Create Account →")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: ".8rem", color: "var(--g4)" }}>
          {mode === "login" ? (
            <>Don't have an account?{" "}
              <button type="button" style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer", fontSize: ".8rem" }}
                onClick={() => { setMode("signup"); authForm.reset(); }}>
                Sign Up
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button type="button" style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer", fontSize: ".8rem" }}
                onClick={() => { setMode("login"); authForm.reset(); }}>
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

