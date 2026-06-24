import { useEffect } from "react";
import { useUIStore } from "../store/useStore";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        useUIStore.getState().setKBOpen(true);
      }

      if (e.key === "Escape") {
        useUIStore.getState().setKBOpen(false);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);
}


