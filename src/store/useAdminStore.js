// src/store/useAdminStore.js
import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  adminSession: localStorage.getItem('aid2_admin_session')?.split(':')[0] || null,
  login: (username) => set({ adminSession: username }),
  logout: () => {
    localStorage.removeItem('aid2_admin_session');
    set({ adminSession: null });
  }
}));
