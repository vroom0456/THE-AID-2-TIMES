import { useUserStore, useUIStore } from "../store/useStore";

export function Hero() {
  const setModalOpen = useUIStore((s) => s.setModalOpen);
  const setKBOpen    = useUIStore((s) => s.setKBOpen);
  const user         = useUserStore((s) => s.user);

  const firstName = user?.name?.split(" ")[0] || user?.name || "";

  return (
    <section id="hero" style={{ borderTop: "none" }}>
      <div className="hero-bg">THE AID 2 TIMES</div>

      {firstName && (
        <p className="hero-greeting">Hello {firstName} 👋</p>
      )}

      <p className="hero-eye">CBIT Hyderabad · Student Resource Hub</p>

      <h1 className="hero-h1">
        <span className="hero-hl"><span>Master your</span></span>
        <span className="hero-hl"><span>Semester.</span></span>
      </h1>

      <p className="hero-sub">
        Find Notes, Previous Papers, Lab Manuals and Resources in one place.
        <br />
        <strong>BUILT BY AIDS DEPT — 3RD YEAR</strong>
      </p>

      <div className="hero-acts">
        <a href="#resources" className="btn btn-primary">Browse Resources →</a>
        <button className="btn btn-gold" onClick={() => setModalOpen("calc", true)}>CGPA Calculator</button>
        <button className="btn btn-outline" onClick={() => setModalOpen("dash", true)}>My Dashboard</button>
        <button className="btn btn-outline" onClick={() => setKBOpen(true)} title="Ctrl+K">⌘ Quick Search</button>
      </div>
    </section>
  );
}

export default Hero;



