import { useEffect } from "react";
import { useUIStore } from "../store/useStore";

export function useDeepLinking() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const subject = params.get("subject");

    if (!subject) return;

    setTimeout(() => {
      useUIStore.getState().setDeepLink?.(
        subject,
        params.get("tab")
      );
    }, 800);
  }, []);
}
