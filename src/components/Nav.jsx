import { useState } from "react";
import { useUserStore, useUIStore } from "../store/useStore";

export default function Nav() {
  const user = useUserStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);

  let eggCount = 0;
  function eggClick() {
    eggCount++;
    if (eggCount >= 5) document.getElementById("egg")?.classList.add("on");
    setTimeout(() => { eggCount = 0; }, 1200);
  }

  // ── THE BYPASS: Force the state directly, ignoring missing store instructions ──
  const openDash = () => useUIStore.setState((s) => ({ modals: { ...s.modals, dash: true } }));
  const openCalc = () => useUIStore.setState((s) => ({ modals: { ...s.modals, calc: true } }));

  return (
    <>
      <nav id="navbar">
        <div className="nav-logo" onClick={eggClick}>
          THE AID <span>2</span> TIMES
        </div>

        <ul className="nav-links">
          <li><a href="#resources">Resources</a></li>
          <li><a href="#team">Team</a></li>
          <li><button onClick={openCalc}>CGPA Calculator</button></li>
        </ul>

        <div className="nav-acts">
          <button className="profile-btn hide-mob" onClick={openDash}>
            <div className="profile-btn-avatar">
              {user?.pfp ? <img src={user.pfp} alt="" /> : user?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{user?.name?.split(" ")[0] || "Profile"}</span>
          </button>

          <a href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T"
            target="_blank" rel="noreferrer"
            className="btn btn-outline hide-mob"
            style={{ padding: "7px 14px", fontSize: ".75rem" }}>
            Join Channel
          </a>

          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      {menuOpen && (
        <div className="full-menu open">
          <button className="modal-close" style={{ position:"absolute",top:22,right:32 }}
            onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          {[
            { label:"Resources",      href:"#resources" },
            { label:"Team",           href:"#team" },
          ].map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <button onClick={() => { openCalc(); setMenuOpen(false); }}>CGPA Calculator</button>
          <button onClick={() => { openDash(); setMenuOpen(false); }}>My Dashboard</button>
          <a href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T" target="_blank" rel="noreferrer"
            style={{ color:"var(--white)" }} onClick={() => setMenuOpen(false)}>
            Join Channel
          </a>
        </div>
      )}
    </>
  );
}
