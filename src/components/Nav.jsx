import { useState, useEffect } from "react";
import { useUserStore, useUIStore } from "../store/useStore";

export default function Nav() {
  const user = useUserStore((s) => s.user);
  const setModalOpen = useUIStore((s) => s.setModalOpen);

  const [menuOpen, setMenuOpen] = useState(false);

  let eggCount = 0;

  function eggClick() {
    eggCount++;

    if (eggCount >= 5) {
      document.getElementById("egg")?.classList.add("on");
      eggCount = 0;
    }

    setTimeout(() => {
      eggCount = 0;
    }, 1200);
  }

  useEffect(() => {
    const handleScroll = () => {
      document
        .getElementById("navbar")
        ?.classList.toggle("scrolled", window.scrollY > 40);

      document
        .getElementById("scrollTopBtn")
        ?.classList.toggle("show", window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav id="navbar">
        <div className="nav-logo" onClick={eggClick}>
          THE AID <span>2</span> TIMES
        </div>

        <ul className="nav-links">
          <li>
            <a href="#resources">Resources</a>
          </li>

          <li>
            <a href="#team">Team</a>
          </li>

          <li>
            <button
              onClick={() => setModalOpen("calc", true)}
            >
              CGPA Calculator
            </button>
          </li>
        </ul>

        <div className="nav-acts">
          <button
            className="profile-btn hide-mob"
            onClick={() => setModalOpen("dash", true)}
          >
            <div className="profile-btn-avatar">
              {user?.pfp ? (
                <img src={user.pfp} alt="" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "?"
              )}
            </div>

            <span>
              {user?.name?.split(" ")[0] || "Profile"}
            </span>
          </button>

          <a
            href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline hide-mob"
            style={{
              padding: "7px 14px",
              fontSize: ".75rem",
            }}
          >
            Join Channel
          </a>

          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`full-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="modal-close"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "absolute",
            top: 22,
            right: 32,
          }}
        >
          ✕
        </button>

        <a
          href="#resources"
          onClick={() => setMenuOpen(false)}
        >
          Resources
        </a>

        <a
          href="#team"
          onClick={() => setMenuOpen(false)}
        >
          Team
        </a>

        <button
          onClick={() => {
            setMenuOpen(false);
            setModalOpen("calc", true);
          }}
        >
          CGPA Calculator
        </button>

        <button
          onClick={() => {
            setMenuOpen(false);
            setModalOpen("dash", true);
          }}
        >
          My Dashboard
        </button>

        <a
          href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T"
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Join Channel
        </a>
      </div>
    </>
  );
}
