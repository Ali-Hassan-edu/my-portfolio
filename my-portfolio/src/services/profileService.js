import { supabase } from "./supabase";

export async function getProfile() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(profile) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ ...profile, id: 1 })
    .select()
    .single();
  if (error) throw error;
  return data;
}
