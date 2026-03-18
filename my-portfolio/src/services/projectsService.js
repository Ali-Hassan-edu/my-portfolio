import { supabase } from "./supabase";

export async function getProjects(type) {
  let query = supabase.from("projects").select("*").order("year", { ascending: false });
  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

export async function addProject(project) {
  const { data, error } = await supabase
    .from("projects")
    .insert([project])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id, project) {
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
