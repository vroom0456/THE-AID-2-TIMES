import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useResourceAdminStore = create((set, get) => ({
  adminMode: false,
  resources: [],
  loading: false,

  setAdminMode: (v) =>
    set({ adminMode: v }),

  loadResources: async () => {
    set({ loading: true });

    const { data, error } =
      await supabase
        .from("resources")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (!error) {
      set({
        resources: data || [],
      });
    }

    set({ loading: false });
  },

  createResource: async (
    payload
  ) => {
    const { error } =
      await supabase
        .from("resources")
        .insert([payload]);

    return {
      success: !error,
      error,
    };
  },

  deleteResource: async (id) => {
    const { error } =
      await supabase
        .from("resources")
        .delete()
        .eq("id", id);

    return {
      success: !error,
      error,
    };
  },

  renameSubject: async (
    oldCode,
    newName
  ) => {
    const { error } =
      await supabase
        .from("resources")
        .update({
          subject_name: newName,
        })
        .eq("subject_code", oldCode);

    return {
      success: !error,
      error,
    };
  },

  moveSubject: async (
    subjectCode,
    newBranch,
    newSemester
  ) => {
    const { error } =
      await supabase
        .from("resources")
        .update({
          branch: newBranch,
          semester: newSemester,
        })
        .eq("subject_code", subjectCode);

    return {
      success: !error,
      error,
    };
  },
}));    });
  },
}));
