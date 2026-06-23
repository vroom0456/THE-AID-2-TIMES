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

      const { data: adminRow, error: adminError } =
        await supabase
          .from("admins")
          .select("*")
          .eq("email", email)
          .single();

      if (adminError || !adminRow) {
        await supabase.auth.signOut();

        set({
          adminSession: null,
          loading: false,
        });

        return {
          success: false,
          message: "Not authorized.",
        };
      }

      set({
        adminSession: adminRow.email,
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

    if (!session?.user?.email) {
      set({
        adminSession: null,
      });

      return;
    }

    const { data: adminRow } =
      await supabase
        .from("admins")
        .select("*")
        .eq("email", session.user.email)
        .single();

    if (!adminRow) {
      set({
        adminSession: null,
      });

      return;
    }

    set({
      adminSession: adminRow.email,
    });
  },
}));
