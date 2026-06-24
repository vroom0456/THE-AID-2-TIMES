import { useState } from "react";
import { useUIStore } from "../store/useStore";

export function Footer() {
  const [tapCount, setTapCount] =
    useState(0);

  const setModalOpen =
    useUIStore(
      (s) => s.setModalOpen
    );

  const handleSecretTap =
    () => {
      const next =
        tapCount + 1;

      if (next >= 7) {
        setModalOpen(
          "admin",
          true
        );

        setTapCount(0);
      } else {
        setTapCount(next);
      }
    };

  return (
    <footer>
      <div className="footer-logo">
        THE AID <span>2</span>
        TIMES

        <span
          onClick={
            handleSecretTap
          }
          style={{
            opacity: 0,
            marginLeft: 8,
            cursor: "pointer",
          }}
        >
          ⚡
        </span>
      </div>

      <div className="footer-links">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();

            alert(
              "Contribute feature coming soon!"
            );
          }}
        >
          Submit Resources
        </a>

        <a
          href="https://whatsapp.com/channel/0029VavYpcu8vd1WvvTrMm3T"
          target="_blank"
          rel="noreferrer"
        >
          Join Channel
        </a>
      </div>

      <div className="footer-disc">
        <strong>
          Disclaimer:
        </strong>{" "}
        All study materials
        and external
        resources linked
        remain the
        intellectual
        property of their
        respective
        creators. THE AID 2
        TIMES acts solely
        as an aggregator
        for student
        convenience. CBIT
        Hyderabad.
      </div>
    </footer>
  );
}

export default Footer;
