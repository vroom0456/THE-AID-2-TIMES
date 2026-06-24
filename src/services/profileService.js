import { supabase } from "../lib/supabase";

export async function fetchStudentProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export function isProfileComplete(profile) {
  return Boolean(
    profile?.roll_no &&
    profile?.branch &&
    profile?.semester &&
    profile?.section
  );
}

export async function createProfile(payload) {
  return supabase.from("profiles").insert(payload);
}

export async function updateProfile(userId, payload) {
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      ...payload,
    });
    
  if (error) throw error;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}
