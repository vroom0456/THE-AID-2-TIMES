// Supabase resource functions — Google Drive URL storage (no file upload to Supabase)
import { supabase } from "./supabase";

// ── Fetch student profile from Supabase ──────────────────────────────────────
export async function fetchStudentProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("branch, semester, section, full_name, roll_no, previous_cgpa, profile_picture_url, role")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

// ── Save / upsert student profile ────────────────────────────────────────────
export async function saveStudentProfile(userId, profileData) {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...profileData, updated_at: new Date().toISOString() });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Fetch all resources for a branch/sem ─────────────────────────────────────
export async function fetchAllResources({ branch, semester }) {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("branch", branch)
    .eq("semester", semester)
    .order("created_at", { ascending: true });

  if (error) return { success: false, data: null, error: error.message };

  // Group: subject → category → unit → [files]
  const grouped = {};
  for (const row of data || []) {
    const { subject, category, unit } = row;
    if (!grouped[subject]) grouped[subject] = {};
    if (!grouped[subject][category]) grouped[subject][category] = {};
    const key = unit || "files";
    if (!grouped[subject][category][key]) grouped[subject][category][key] = [];
    grouped[subject][category][key].push({
      id: row.id,
      title: row.title,
      url: row.drive_url,
      drive_file_id: row.drive_file_id,
    });
  }

  return { success: true, data: grouped };
}

// ── Add resource (admin: stores Drive URL + metadata) ────────────────────────
export async function addResource({ title, branch, semester, subject, unit, category, drive_url, drive_file_id, uploaded_by }) {
  const { data, error } = await supabase
    .from("resources")
    .insert({
      title,
      branch,
      semester,
      subject,
      unit: unit || null,
      category,       // "notes" | "previous_papers" | "lab_manuals"
      drive_url,
      drive_file_id,
      uploaded_by,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ── Delete resource ───────────────────────────────────────────────────────────
export async function deleteResource(id) {
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Rename resource ───────────────────────────────────────────────────────────
export async function renameResource(id, newTitle) {
  const { error } = await supabase
    .from("resources")
    .update({ title: newTitle })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Move resource (update metadata only — Drive file unchanged) ───────────────
export async function moveResource(id, { branch, semester, subject, unit, category }) {
  const { error } = await supabase
    .from("resources")
    .update({ branch, semester, subject, unit: unit || null, category })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Upload profile picture to Supabase Storage ────────────────────────────────
export async function uploadProfilePicture(userId, file) {
  const ext = file.name.split(".").pop();
  const path = `avatars/${userId}.${ext}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) return { success: false, error: error.message };
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
