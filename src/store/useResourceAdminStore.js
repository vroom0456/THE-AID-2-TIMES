import { create } from "zustand";

export const useResourceAdminStore = create((set) => ({
  adminMode: false,

  selectedSubject: null,

  renameSubject: async () => ({
    success: true,
    error: null,
  }),

  addResource: async () => ({
    success: true,
    data: [],
    error: null,
  }),

  deleteResource: async () => ({
    success: true,
    error: null,
  }),

  getResources: async () => ({
    success: true,
    data: [],
    error: null,
  }),

  setAdminMode: (v) =>
    set({ adminMode: v }),

  selectSubject: (subject) =>
    set({ selectedSubject: subject }),

  clearSubject: () =>
    set({ selectedSubject: null }),
}));


