import { create } from "zustand";

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
  setAdminMode: (v) =>
    set({ adminMode: v }),

  selectSubject: (subject) =>
    set({ selectedSubject: subject }),

  clearSubject: () =>
    set({ selectedSubject: null }),
}));
