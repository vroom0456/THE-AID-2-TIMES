// ─────────────────────────────────────────────
// Global state with Zustand
// npm install zustand
// ─────────────────────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── User store (persisted to localStorage) ──
export const useUserStore = create(
  persist(
    (set, get) => ({
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

// ── CIE marks store (persisted) ──
export const useCIEStore = create(
  persist(
    (set, get) => ({
      // shape: { "V": { "22ADC51N": { st1, st2, st3, mid1, mid2, as1, as2, att } } }
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

        // Slip tests: best 2 of 3, average out of 5
        const sts = [n("st1"), n("st2"), n("st3")].sort((a, b) => b - a);
        const stScore = (sts[0] + sts[1]) / 2;

        // Mids: average of both out of 20
        const midScore = (n("mid1") + n("mid2")) / 2;

        // Assignments: average out of 10
        const asScore = (n("as1") + n("as2")) / 2;

        // Attendance out of 5
        const att = n("att");
        const attScore =
          att >= 85 ? 5 : att >= 80 ? 4 : att >= 75 ? 3 : att >= 70 ? 2 : att >= 65 ? 1 : 0;

        const total = stScore + midScore + asScore + attScore;
        return { stScore, midScore, asScore, attScore, total };
      },
    }),
    { name: "ait2_cie" }
  )
);

// ── PDF notes & bookmarks store (persisted) ──
export const usePDFStore = create(
  persist(
    (set, get) => ({
      notes: {},       // { [pdfId]: string }
      bookmarks: {},   // { [pdfId]: [{note, ts}] }

      setNote: (id, text) =>
        set((s) => ({ notes: { ...s.notes, [id]: text } })),

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

// ── UI state (NOT persisted — resets on reload) ──
export const useUIStore = create((set) => ({
  activeReg: "R22A",
  activeBranch: "AIDS",
  activeSem: "V",
  activeFilter: "all",
  openSubjects: {},   // { [index]: bool }
  openUnits: {},      // { ["si_ui"]: bool }
  pdfViewer: null,    // { title, url, id } | null
  kbOpen: false,
  modalOpen: null,    // <-- ADDED THIS!

  setReg: (r) => set({ activeReg: r, openSubjects: {}, openUnits: {} }),
  setBranch: (b) => set({ activeBranch: b, openSubjects: {}, openUnits: {} }),
  setSem: (s) => set({ activeSem: s, openSubjects: {}, openUnits: {} }),
  setFilter: (f) => set({ activeFilter: f }),

  toggleSubject: (i) =>
    set((s) => ({ openSubjects: { ...s.openSubjects, [i]: !s.openSubjects[i] } })),

  toggleUnit: (si, ui) => {
    const key = `${si}_${ui}`;
    set((s) => ({ openUnits: { ...s.openUnits, [key]: !s.openUnits[key] } }));
  },

  openPDF: (title, url, id) => set({ pdfViewer: { title, url, id } }),
  closePDF: () => set({ pdfViewer: null }),

  setKBOpen: (v) => set({ kbOpen: v }),
  
  setModalOpen: (id, isOpen) => set({ modalOpen: isOpen ? id : null }), // <-- ADDED THIS!
}));
