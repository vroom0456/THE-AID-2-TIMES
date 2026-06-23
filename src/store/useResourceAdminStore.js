import { create } from "zustand";

export const useResourceAdminStore = create((set) => ({
  adminMode: false,

  selectedSubject: null,

  setAdminMode: (v) =>
    set({ adminMode: v }),

  selectSubject: (subject) =>
    set({ selectedSubject: subject }),

  clearSubject: () =>
    set({ selectedSubject: null }),
}));
