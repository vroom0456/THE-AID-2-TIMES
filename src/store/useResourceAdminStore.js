import { create } from "zustand";
import { supabase } from "../lib/supabase";
export const useResourceAdminStore =
create((set) => ({
adminMode: false,

selectedSubject: null,

setAdminMode: (v) =>
  set({
    adminMode: v,
  }),

selectSubject: (
  subject
) =>
  set({
    selectedSubject:
      subject,
  }),

clearSubject: () =>
  set({
    selectedSubject:
      null,
  }),

renameSubject:
  async (
    subjectCode,
    newName
  ) => {
    const {
      error,
    } = await supabase
      .from(
        "resources"
      )
      .update({
        subject_name:
          newName,
      })
      .eq(
        "subject_code",
        subjectCode
      );

    return {
      success:
        !error,
      error,
    };
  },

deleteSubject:
  async (
    subjectCode
  ) => {
    const {
      error,
    } = await supabase
      .from(
        "resources"
      )
      .delete()
      .eq(
        "subject_code",
        subjectCode
      );

    return {
      success:
        !error,
      error,
    };
  },

addResource:
  async (
    resource
  ) => {
    const {
      error,
    } = await supabase
      .from(
        "resources"
      )
      .insert(
        resource
      );

    return {
      success:
        !error,
      error,
    };
  },

deleteResource:
  async (id) => {
    const {
      error,
    } = await supabase
      .from(
        "resources"
      )
      .delete()
      .eq("id", id);

    return {
      success:
        !error,
      error,
    };
  },

}));
