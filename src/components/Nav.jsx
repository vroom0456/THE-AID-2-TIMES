import { useState, useEffect } from "react";
import { useUserStore, useUIStore } from "../store/useStore";
import { useAdminStore } from "../store/useAdminStore";

export default function Nav() {
  const user         = useUserStore((s) => s.user);
  const setModalOpen = useUIStore((s) => s.setModalOpen);
  const setKBOpen    = useUIStore((s) => s.setKBOpen);
  const isAdmin      = useAdminStore((s) => s.adminSession);
  const logout       = useAdminStore((s) => s.logout);

  const [menuOpen, setMenuOpen] = useState(false);

  let eggCount = 0;
  function eggClick() {
    eggCount++;
    if (eggCount >= 5) {
      document.getElementById("egg")?.classList.add("on");
      eggCount = 0;
    }
    setTimeout(() => { eggCount = 0; }, 1200);
  }

  useEffect(() => {
    const handleScroll = () => {
      document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 40);
      document.getElementById("scrollTopBtn")?.classList.toggle("show", window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav id="navbar">
        <div className="nav-logo" onClick={eggClick}>
          THE AID <span>2</span> TIMES
        </div>

        <ul className="nav-links">
          <li><a href="#resources">Resources</a></li>
          <li><a href="#team">Team</a></li>
          <li><button onClick={() => setModalOpen("calc", true)}>CGPA Calculator</button></li>
        </ul>

        <div className="nav-acts">
          {isAdmin ? (
            <button
              className="admin-nav-btn hide-mob"
              onClick={logout}
              style={{ borderColor: "var(--red)", color: "var(--red)" }}
            >
              ⚡ Logout
            </button>
          ) : (
            <button
              className="admin-nav-btn hide-mob"
              onClick={() => document.getElementById("adminGate")?.classList.add("open")}
            >
              ⚡ Admin
            </button>
          )}

          <button className="profile-btn hide-mob" onClick={() => setModalOpen("dash", true)}>
            <div className="profile-btn-avatar">
              {user?.pfp
                ? <img src={user.pfp} alt="" />
                : user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <span>{user?.name?.split(" ")[0] || "Profile"}</span>
          </button>

          <a
            href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T"
            target="_blank" rel="noreferrer"
            className="btn btn-outline hide-mob"
            style={{ padding: "7px 14px", fontSize: ".75rem" }}
          >
            Join Channel
          </a>

          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      <div className={`full-menu ${menuOpen ? "open" : ""}`} id="fullMenu">
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

        <a href="#resources" onClick={closeMenu}>Resources</a>
        <a href="#team" onClick={closeMenu}>Team</a>
        <button onClick={() => { closeMenu(); setModalOpen("calc", true); }}>
          CGPA Calculator
        </button>
        <button onClick={() => { closeMenu(); setModalOpen("dash", true); }}>
          My Dashboard
        </button>
        <button onClick={() => { closeMenu(); setKBOpen(true); }}>
          Quick Search
        </button>
        <a
          href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T"
          target="_blank" rel="noreferrer"
          onClick={closeMenu}
          style={{ color: "var(--white)" }}
        >
          Join Channel
        </a>
      </div>
    </>
  );
}
