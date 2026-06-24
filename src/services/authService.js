import { supabase } from "../lib/supabase";

export async function signUpUser(email, password, fullName) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
}

export async function signInUser(email, password) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function signOutUser() {
  return supabase.auth.signOut();
}
