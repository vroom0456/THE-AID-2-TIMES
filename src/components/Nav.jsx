import { useState, useEffect, useRef, useCallback } from "react";
import { useUserStore, useUIStore } from "../store/useStore";
import { useAdminStore } from "../store/useAdminStore";
import { signOutUser } from "../services/authService";

export default function Nav() {
  const user = useUserStore((s) => s.user);
  const setModalOpen = useUIStore((s) => s.setModalOpen);
  const setKBOpen = useUIStore((s) => s.setKBOpen);
  const isAdmin = useAdminStore((s) => s.adminSession);
  const adminLogout = useAdminStore((s) => s.logout);
  const signOut = signOutUser;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const eggCountRef = useRef(0);
  const eggTimer = useRef(null);

  const eggClick = useCallback(() => {
    eggCountRef.current += 1;
    if (eggCountRef.current >= 5) {
      document.getElementById("egg")?.classList.add("on");
      eggCountRef.current = 0;
    }
    clearTimeout(eggTimer.current);
    eggTimer.current = setTimeout(() => {
      eggCountRef.current = 0;
    }, 1200);
  }, []);

  useEffect(() => () => clearTimeout(eggTimer.current), []);

  useEffect(() => {
    const handle = () => {
      document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 40);
      document.getElementById("scrollTopBtn")?.classList.toggle("show", window.scrollY > 500);
      const ids = ["resources", "pyp", "lab-manuals", "cgpa", "team", "about"];
      let cur = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) cur = id;
      }
      setActiveSection(cur);
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!showUserMenu) return;
    const handler = (e) => {
      if (e.key === "Escape") setShowUserMenu(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showUserMenu]);

  const closeMenu = () => setMenuOpen(false);

  const scrollTo = useCallback((id) => {
    closeMenu();
    setShowUserMenu(false);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 72,
        behavior: "smooth",
      });
    }
  }, []);

  const navItems = [
    { label: "Resources", id: "resources" },
    { label: "Previous Year Papers", id: "pyp" },
    { label: "Lab Manuals", id: "lab-manuals" },
    { label: "CGPA Calculator", id: "cgpa" },
    { label: "Team", id: "team" },
    { label: "About", id: "about" },
  ];

  return (
    <>
      <nav id="navbar" role="navigation" aria-label="Main navigation">
        <div
          className="nav-logo"
          onClick={eggClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && eggClick()}
        >
          THE AID <span>2</span> TIMES
        </div>

        {isAdmin && <div className="admin-nav-badge" aria-label="Admin mode active">⚡ ADMIN MODE ACTIVE</div>}

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeSection === item.id ? "active" : ""}
                aria-current={activeSection === item.id ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-acts">
          {isAdmin && (
            <button
              className="admin-nav-btn hide-mob"
              onClick={adminLogout}
              style={{ borderColor: "var(--red)", color: "var(--red)" }}
            >
              ⚡ Logout Admin
            </button>
          )}

          <div className="profile-btn-wrap hide-mob" style={{ position: "relative" }}>
            <button
              className="profile-btn"
              onClick={() => setShowUserMenu((v) => !v)}
              aria-haspopup="true"
              aria-expanded={showUserMenu}
              aria-label="Open user menu"
            >
              <div className="profile-btn-avatar">
                {user?.pfp ? (
                  <img src={user.pfp} alt="" aria-hidden="true" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || "?"
                )}
              </div>
              <span>{user?.name?.split(" ")[0] || "Profile"}</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown" role="menu">
                <button
                  role="menuitem"
                  onClick={() => {
                    setShowUserMenu(false);
                    setModalOpen("profileEdit", true);
                  }}
                >
                  My Profile
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setShowUserMenu(false);
                    setModalOpen("dash", true);
                  }}
                >
                  Dashboard
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setShowUserMenu(false);
                    signOut();
                  }}
                  style={{ color: "var(--red)" }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <a
            href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T"
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-outline hide-mob"
            style={{ padding: "7px 14px", fontSize: ".75rem" }}
          >
            Join Channel
          </a>

          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        className={`full-menu ${menuOpen ? "open" : ""}`}
        id="fullMenu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          className="modal-close"
          onClick={closeMenu}
          style={{ position: "absolute", top: 22, right: 32 }}
          aria-label="Close menu"
        >
          <svg viewBox="0 0 24 24" width={24} height={24} stroke="currentColor" strokeWidth={2} fill="none">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activeSection === item.id ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(item.id);
            }}
          >
            {item.label}
          </a>
        ))}

        <button onClick={() => { closeMenu(); setModalOpen("profileEdit", true); }}>My Profile</button>
        <button onClick={() => { closeMenu(); setModalOpen("dash", true); }}>Dashboard</button>
        <button onClick={() => { closeMenu(); setKBOpen(true); }}>Quick Search</button>
        <a
          href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T"
          target="_blank"
          rel="noreferrer noopener"
          onClick={closeMenu}
          style={{ color: "var(--white)" }}
        >
          Join Channel
        </a>
        <button onClick={() => { closeMenu(); signOut(); }} style={{ color: "var(--red)" }}>Logout</button>
      </div>

      {showUserMenu && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 4999 }}
          onClick={() => setShowUserMenu(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
