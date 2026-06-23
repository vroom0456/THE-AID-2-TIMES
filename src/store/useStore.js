import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      updateProfile: (updates) =>
        set((s) => ({ user: { ...s.user, ...updates } })),
      updateSGPA: (semIndex, value) =>
        set((s) => {
          const sgpas = [...(s.user?.sgpas || [])];
          sgpas[semIndex] = value;
          return { user: { ...s.user, sgpas } };
        }),
    }),
    { name: "ait2_user" }
  )
);

export const useCIEStore = create(
  persist(
    (set, get) => ({
      marks: {},
      updateMark: (sem, code, key, value) =>
        set((s) => ({
          marks: {
            ...s.marks,
            [sem]: {
              ...s.marks[sem],
              [code]: {
                ...(s.marks[sem]?.[code] || {}),
                [key]: value,
              },
            },
          },
        })),
      getSubjectMarks: (sem, code) => get().marks[sem]?.[code] || {},
      computeCIE: (sem, code) => {
        const d = get().marks[sem]?.[code] || {};
        const n = (k) => parseFloat(d[k]) || 0;
        const sts = [n("st1"), n("st2"), n("st3")].sort((a, b) => b - a);
        const stScore = (sts[0] + sts[1]) / 2;
        const midScore = (n("mid1") + n("mid2")) / 2;
        const asScore = (n("as1") + n("as2")) / 2;
        const att = n("att");
        const attScore = att >= 85 ? 5 : att >= 80 ? 4 : att >= 75 ? 3 : att >= 70 ? 2 : att >= 65 ? 1 : 0;
        return { stScore, midScore, asScore, attScore, total: stScore + midScore + asScore + attScore };
      },
    }),
    { name: "ait2_cie" }
  )
);

export const usePDFStore = create(
  persist(
    (set, get) => ({
      notes: {},
      bookmarks: {},
      setNote: (id, text) => set((s) => ({ notes: { ...s.notes, [id]: text } })),
      getNote: (id) => get().notes[id] || "",
      addBookmark: (id, note) =>
        set((s) => ({
          bookmarks: {
            ...s.bookmarks,
            [id]: [...(s.bookmarks[id] || []), { note, ts: new Date().toLocaleString() }],
          },
        })),
      deleteBookmark: (id, index) =>
        set((s) => ({
          bookmarks: {
            ...s.bookmarks,
            [id]: (s.bookmarks[id] || []).filter((_, i) => i !== index),
          },
        })),
      getBookmarks: (id) => get().bookmarks[id] || [],
    }),
    { name: "ait2_pdf" }
  )
);

export const useUIStore = create((set) => ({
  activeReg: "R22A",
  activeBranch: "AIDS",
  activeSem: "V",
  activeFilter: "all",
  openSubjects: {},   
  openUnits: {},      
  pdfViewer: null,    
  kbOpen: false,
  modals: {}, 

  setReg: (r) => set({ activeReg: r, openSubjects: {}, openUnits: {} }),
  setBranch: (b) => set({ activeBranch: b, openSubjects: {}, openUnits: {} }),
  setSem: (s) => set({ activeSem: s, openSubjects: {}, openUnits: {} }),
  setFilter: (f) => set({ activeFilter: f }),

  toggleSubject: (i) => set((s) => ({ openSubjects: { ...s.openSubjects, [i]: !s.openSubjects[i] } })),
  toggleUnit: (si, ui) => set((s) => ({ openUnits: { ...s.openUnits, [`${si}_${ui}`]: !s.openUnits[`${si}_${ui}`] } })),

  openPDF: (title, url, id) => set({ pdfViewer: { title, url, id } }),
  closePDF: () => set({ pdfViewer: null }),

  setKBOpen: (v) => set({ kbOpen: v }),
  setModalOpen: (id, isOpen) => set((s) => ({ modals: { ...s.modals, [id]: isOpen } })), 
}));
