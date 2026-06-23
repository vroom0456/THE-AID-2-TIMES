import { lazy, Suspense, useEffect } from "react";
import { useUserStore, useUIStore } from "./store/useStore";
import { useAdminStore } from "./store/useAdminStore";

const LoginGate       = lazy(() => import("./components/LoginGate"));
const Nav             = lazy(() => import("./components/Nav"));
const Ticker          = lazy(() => import("./components/Ticker"));
const Hero            = lazy(() => import("./components/Hero"));
const ResourceVault   = lazy(() => import("./components/ResourceVault"));
const Team            = lazy(() => import("./components/Team"));
const Footer          = lazy(() => import("./components/Footer"));
const PDFViewer       = lazy(() => import("./components/PDFViewer"));
const CGPACalculator  = lazy(() => import("./components/CGPACalculator"));
const Dashboard       = lazy(() => import("./components/Dashboard"));
const QuickSearch     = lazy(() => import("./components/QuickSearch"));
const AdminGate       = lazy(() => import("./components/AdminGate"));
const AdminPanel      = lazy(() => import("./components/AdminPanel"));
function Loader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "1.3rem",
          fontWeight: 700,
          letterSpacing: ".15em",
          color: "#f5f5f5",
        }}
      >
        THE AID <span style={{ color: "#f0c040" }}>2</span> TIMES
      </div>

      <div
        style={{
          width: 160,
          height: 1,
          background: "#2a2a2a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "60%",
            background: "#f5f5f5",
            animation: "slide 1s ease forwards",
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const user = useUserStore((s) => s.user);

  const kbOpen = useUIStore((s) => s.kbOpen);

  const modals = useUIStore((s) => s.modals);

const AdminGate = lazy(() =>
  import("./components/AdminGate")
);

  useEffect(() => {
  checkAdmin();
}, [checkAdmin]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get("subject");

    if (code) {
      setTimeout(() => {
        useUIStore.getState().setDeepLink?.(
          code,
          params.get("tab")
        );
      }, 800);
    }
  }, []);

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

  // MOBILE BACK BUTTON HANDLER
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

  return (
    <Suspense fallback={<Loader />}>
      {!user && <LoginGate />}

      {user && (
        <>
          <Nav />

          <Ticker />

          <main>
            <Hero />

            <ResourceVault />

            <Team />
          </main>

          <Footer />

          <PDFViewer />

          <CGPACalculator />

          <Dashboard />

<AdminGate />

{kbOpen && <QuickSearch />}
        </>
      )}
    </Suspense>
  );
}
