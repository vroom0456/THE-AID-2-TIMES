import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("SUPABASE URL =", supabaseUrl);

if (!supabaseUrl) {
  throw new Error(
    "VITE_SUPABASE_URL is missing from Vercel Environment Variables"
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_ANON_KEY is missing from Vercel Environment Variables"
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
