import { lazy, Suspense, useEffect } from "react";

import { useUserStore, useUIStore } from "./store/useStore";
import { useAdminStore } from "./store/useAdminStore";

import Loader from "./components/Loader";
import Cursor from "./components/Cursor";

import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useDeepLinking } from "./hooks/useDeepLinking";
import { useModalHistory } from "./hooks/useModalHistory";

const LoginGate = lazy(() => import("./components/LoginGate"));
const Nav = lazy(() => import("./components/Nav"));
const Ticker = lazy(() => import("./components/Ticker"));
const Hero = lazy(() => import("./components/Hero"));
const ResourceVault = lazy(() => import("./components/ResourceVault"));
const Team = lazy(() => import("./components/Team"));
const Footer = lazy(() => import("./components/Footer"));
const PDFViewer = lazy(() => import("./components/PDFViewer"));
const CGPACalculator = lazy(() => import("./components/CGPACalculator"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const QuickSearch = lazy(() => import("./components/QuickSearch"));
const AdminGate = lazy(() => import("./components/AdminGate"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const ProfileEdit = lazy(() => import("./components/ProfileEdit"));
const EasterEgg = lazy(() => import("./components/EasterEgg"));

export default function App() {
  const user = useUserStore((s) => s.user);

  const kbOpen = useUIStore((s) => s.kbOpen);

  const modals = useUIStore((s) => s.modals);

  const setModal = useUIStore((s) => s.setModalOpen);

  const checkAdmin = useAdminStore((s) => s.checkAdmin);

  useKeyboardShortcuts();
  useDeepLinking();
  useModalHistory();

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  return (
    <Suspense fallback={<Loader />}>
      <Cursor />

      {!user && <LoginGate />}

      {user && (
        <>
          <Nav />
          <Ticker />

          <main>
            <Hero />
            <AdminPanel />
            <ResourceVault />
            <Team />
          </main>

          <Footer />

          <PDFViewer />
          <CGPACalculator />
          <Dashboard />
          <AdminGate />
          <EasterEgg />

          {modals?.profileEdit && (
            <ProfileEdit
              onClose={() =>
                setModal("profileEdit", false)
              }
            />
          )}

          {kbOpen && <QuickSearch />}
        </>
      )}
    </Suspense>
  );
}
