import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useResourceAdminStore = create((set) => ({
  adminMode: false,

  selectedSubject: null,

  renameSubject: async (
    subjectCode,
    newName
  ) => {
    const { error } = await supabase
      .from("resources")
      .update({
        subject_name: newName,
      })
      .eq("subject_code", subjectCode);

    return {
      success: !error,
      error,
    };
  },

  addResource: async (resource) => {
    const { data, error } = await supabase
      .from("resources")
      .insert([resource])
      .select();

    return {
      success: !error,
      data,
      error,
    };
  },

  deleteResource: async (id) => {
    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", id);

    return {
      success: !error,
      error,
    };
  },

  getResources: async (subjectCode) => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("subject_code", subjectCode);

    return {
      success: !error,
      data: data || [],
      error,
    };
  },

  setAdminMode: (v) =>
    set({ adminMode: v }),

  selectSubject: (subject) =>
    set({ selectedSubject: subject }),

  clearSubject: () =>
    set({ selectedSubject: null }),
}));
