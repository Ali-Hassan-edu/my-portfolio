import { supabase } from "./supabase";

function tableFor(type) {
  return type === "app" ? "app_projects" : "web_projects";
}

export async function getProjects(type) {
  if (!supabase) return [];
  const table = tableFor(type);
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("year", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function addProject(type, project) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const table = tableFor(type);
  const { data, error } = await supabase
    .from(table)
    .insert([project])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id, type, project) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const table = tableFor(type);
  const { data, error } = await supabase
    .from(table)
    .update(project)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id, type) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const table = tableFor(type);
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
