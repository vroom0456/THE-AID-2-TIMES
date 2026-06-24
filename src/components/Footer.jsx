import { useState } from "react";

export function Footer() {
  const [tapCount, setTapCount] = useState(0);

  const handleSecretTap = () => {
    const next = tapCount + 1;
    if (next >= 7) {
      document.getElementById("adminGate")?.classList.add("open");
      setTapCount(0);
    } else {
      setTapCount(next);
    }
  };

  return (
    <footer id="about">
      <div className="footer-logo">THE AID <span>2</span> TIMES</div>

      <div className="footer-links">
        <a href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T" target="_blank" rel="noreferrer">
          Join Channel
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); handleSecretTap(); }}
          id="footerAdminLink" style={{ color: "var(--g3)", fontSize: ".65rem" }} title="Admin Login">
          ⚡
        </a>
      </div>

      <div className="footer-disc">
        <strong>Disclaimer:</strong>{" "}
        All study materials and external resources linked remain the intellectual property of their
        respective creators. THE AID 2 TIMES acts solely as an aggregator for student convenience. CBIT Hyderabad.
      </div>
    </footer>
  );
}

export default Footer;


