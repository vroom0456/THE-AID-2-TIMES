// ── UI state (NOT persisted — resets on reload) ──
export const useUIStore = create((set) => ({
  activeReg: "R22A",
  activeBranch: "AIDS",
  activeSem: "V",
  activeFilter: "all",
  openSubjects: {},   
  openUnits: {},      
  pdfViewer: null,    
  kbOpen: false,
  modals: {}, // <-- FIXED: This is now an object!

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
  
  // <-- FIXED: This securely updates the modals object
  setModalOpen: (id, isOpen) => set((s) => ({ modals: { ...s.modals, [id]: isOpen } })), 
}));
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
