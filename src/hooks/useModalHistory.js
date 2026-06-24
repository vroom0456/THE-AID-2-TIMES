import { useEffect } from "react";
import { useUIStore } from "../store/useStore";

export function useModalHistory() {
  useEffect(() => {
    const push = () => {
      window.history.pushState(
        { ait2: true },
        "",
        window.location.href
      );
    };

    push();

    const onBack = () => {
      const store = useUIStore.getState();

      if (store.kbOpen) {
        store.setKBOpen(false);
        push();
        return;
      }

      if (store.modals?.dash) {
        store.setModalOpen("dash", false);
        push();
        return;
      }

      if (store.modals?.calc) {
        store.setModalOpen("calc", false);
        push();
        return;
      }

      push();
    };

    window.addEventListener("popstate", onBack);

    return () => {
      window.removeEventListener("popstate", onBack);
    };
  }, []);
}


