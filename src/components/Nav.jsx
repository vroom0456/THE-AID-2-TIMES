import { useState, useEffect } from "react";
import { useUserStore, useUIStore } from "../store/useStore";

export default function Nav() {
  const user = useUserStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);

  // Exact Easter Egg from Final.html
  let eggCount = 0;
  function eggClick() {
    eggCount++;
    if (eggCount >= 5) {
      document.getElementById("egg")?.classList.add("on");
      eggCount = 0;
    }
    setTimeout(() => { eggCount = 0; }, 1200);
  }

  // Exact scroll behavior from Final.html
  useEffect(() => {
    const handleScroll = () => {
      document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 40);
      document.getElementById("scrollTopBtn")?.classList.toggle("show", window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // EXACTLY like Final.html's global openModal(), bypassing all React prop bugs!
  const openModal = (id) => {
    useUIStore.setState((s) => ({ modals: { ...s.modals, [id]: true } }));
  };

  return (
    <>
      <nav id="navbar">
        <div className="nav-logo" onClick={eggClick}>
          THE AID <span>2</span> TIMES
        </div>

        <ul className="nav-links">
          <li><a href="#resources">Resources</a></li>
          <li><a href="#team">Team</a></li>
          <li><button onClick={() => openModal("calc")}>CGPA Calculator</button></li>
        </ul>

        <div className="nav-acts">
          <button className="profile-btn hide-mob" onClick={() => openModal("dash")}>
            <div className="profile-btn-avatar" id="navAvatar">
              {user?.pfp ? <img src={user.pfp} alt="" /> : user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <span id="navUserName">{user?.name?.split(" ")[0] || "Profile"}</span>
          </button>

          <a href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T"
            target="_blank" rel="noreferrer"
            className="btn btn-outline hide-mob"
            style={{ padding: "7px 14px", fontSize: ".75rem" }}>
            Join Channel
          </a>

          {/* Hamburger now gets the 'open' class exactly like Final.html */}
          <button className={`hamburger ${menuOpen ? "open" : ""}`} id="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu - EXACT structure from Final.html */}
      <div className={`full-menu ${menuOpen ? "open" : ""}`} id="fullMenu">
        <button className="modal-close" onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: 22, right: 32 }}>
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        
        <a href="#resources" onClick={() => setMenuOpen(false)}>Resources</a>
        <a href="#team" onClick={() => setMenuOpen(false)}>Team</a>
        <button onClick={() => { setMenuOpen(false); openModal("calc"); }}>CGPA Calculator</button>
        <button onClick={() => { setMenuOpen(false); openModal("dash"); }}>My Dashboard</button>
        <a href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} style={{ color: "var(--white)" }}>
          Join Channel
        </a>
      </div>
    </>
  );
}
