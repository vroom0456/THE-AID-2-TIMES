import { lazy, Suspense, useEffect } from "react";
import { useUserStore, useUIStore } from "./store/useStore";

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

function Loader() {
  return (
    <div style={{ position:"fixed", inset:0, background:"#0a0a0a", display:"flex",
      flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"1.3rem",
        fontWeight:700, letterSpacing:".15em", color:"#f5f5f5" }}>
        THE AID <span style={{ color:"#f0c040" }}>2</span> TIMES
      </div>
      <div style={{ width:160, height:1, background:"#2a2a2a", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, height:"100%", width:"60%",
          background:"#f5f5f5", animation:"slide 1s ease forwards" }} />
      </div>
    </div>
  );
}

export default function App() {
  const user = useUserStore((s) => s.user);
  const pdfViewer = useUIStore((s) => s.pdfViewer);
  const kbOpen = useUIStore((s) => s.kbOpen);
  
  // 1. Pull the instruction from the store
  const setModalOpen = useUIStore((s) => s.setModalOpen);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get("subject");
    if (code) {
      setTimeout(() => {
        useUIStore.getState().setDeepLink?.(code, params.get("tab"));
      }, 800);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        useUIStore.getState().setKBOpen(true);
      }
      if (e.key === "Escape") useUIStore.getState().setKBOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      {!user && <LoginGate />}

      {user && (
        <>
          {/* 2. Hand the instruction baton to the Nav bar */}
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
          {kbOpen && <QuickSearch />}
        </>
      )}
    </Suspense>
  );
}
