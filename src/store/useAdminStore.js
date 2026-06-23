import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useAdminStore = create((set) => ({
  adminSession: null,
  loading: false,

  login: async (email, password) => {
    try {
      set({ loading: true });

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        set({ loading: false });

        return {
          success: false,
          message: error.message,
        };
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      set({
        adminSession: user?.email || null,
        loading: false,
      });

      return {
        success: true,
      };
    } catch (err) {
      set({ loading: false });

      return {
        success: false,
        message: err.message,
      };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();

    set({
      adminSession: null,
    });
  },

  checkAdmin: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      adminSession:
        session?.user?.email || null,
    });
  },
}));
