import { useUIStore } from "../store/useStore";

export default function Hero() {
  const setModalOpen = useUIStore((s) => s.setModalOpen);
  const setKBOpen = useUIStore((s) => s.setKBOpen);

  return (
    <section id="hero" style={{ borderTop: "none" }}>
      <div className="hero-bg">
        THE AID 2 TIMES
      </div>

      <p className="hero-eye">
        CBIT Hyderabad · Student Resource Hub
      </p>

      <h1 className="hero-h1">
        <span className="hero-hl">
          <span>Master your</span>
        </span>

        <span className="hero-hl">
          <span>Semester.</span>
        </span>
      </h1>

      <p className="hero-sub">
        <strong>BUILT BY AIDS DEPT — 3RD YEAR</strong>
        <br />
        Branch-wise. Semester-wise. Unit-wise.
        Resources, CIE Tracker, CGPA Forecaster —
        all in one place.
      </p>

      <div className="hero-acts">
        <a
          href="#resources"
          className="btn btn-primary"
        >
          Browse Resources →
        </a>

        <button
          className="btn btn-gold"
          onClick={() => setModalOpen("calc", true)}
        >
          CGPA Calculator
        </button>

        <button
          className="btn btn-outline"
          onClick={() => setModalOpen("dash", true)}
        >
          My Dashboard
        </button>

        <button
          className="btn btn-outline"
          onClick={() => setKBOpen(true)}
        >
          ⌘ Quick Search
        </button>
      </div>
    </section>
  );
}
