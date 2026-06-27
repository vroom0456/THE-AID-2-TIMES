import imageCompression from "browser-image-compression";
import { supabase } from "../lib/supabase";

export async function uploadAvatar(userId, file) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: "image/jpeg",
  });

  const path = `${userId}/avatar.jpeg`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, compressed, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function deleteAvatar(userId) {
  return supabase.storage
    .from("avatars")
    .remove([`${userId}/avatar.jpeg`]);
}
