import { useUIStore } from "../store/useStore";

export function Hero() {
  const setModal = useUIStore((s) => s.setModal);
  const setKROpen = useUIStore((s) => s.setKROpen);

  return (
    <section id="hero" style={{ borderTop: "none" }}>
      <div className="hero-bg">THE AID 2 TIMES</div>
      <p className="hero-eye">CBIT Hyderabad · Student Resource Hub</p>
      <h1 className="hero-h1">
        <span className="hero-hl"><span>Master your</span></span>
        <span className="hero-hl"><span>Semester.</span></span>
      </h1>
      <p className="hero-sub">
        <strong>BUILT BY AIDS DEPT — 3RD YEAR</strong>
        Branch-wise. Semester-wise. Unit-wise. Resources, CIE tracker, CGPA forecaster — all in one place.
      </p>
      <div className="hero-acts">
        <a href="#resources" className="btn btn-primary">Browse Resources →</a>
        <button className="btn btn-gold" onClick={() => setModal("calc", true)}>CGPA Calculator</button>
        <button className="btn btn-outline" onClick={() => setModal("dash", true)}>My Dashboard</button>
        <button className="btn btn-outline" onClick={() => setKROpen(true)} title="Ctrl+K">⌘ Quick Search</button>
      </div>
    </section>
  );
}

export default Hero;

