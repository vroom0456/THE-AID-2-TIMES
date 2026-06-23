import { useUIStore } from "../store/useStore";

export function Ticker() {
  const setModal = useUIStore((s) => s.setModal);
  const setKROpen = useUIStore((s) => s.setKROpen);

  const scrollToResources = () => {
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {/* We duplicate the items just like the HTML for the seamless CSS animation loop */}
        {[1, 2].map((loopIndex) => (
          <span key={loopIndex} style={{ display: "contents" }}>
            <span className="ticker-item" onClick={scrollToResources}>Theory Notes <span className="t-dot"></span></span>
            <span className="ticker-item" onClick={() => setModal("calc", true)}>CGPA Calculator <span className="t-dot"></span></span>
            <span className="ticker-item" onClick={scrollToResources}>Lab Manuals <span className="t-dot"></span></span>
            <span className="ticker-item" onClick={scrollToResources}>Prev Year Papers <span className="t-dot"></span></span>
            <span className="ticker-item" onClick={() => setModal("dash", true)}>My Dashboard <span className="t-dot"></span></span>
            <span className="ticker-item" onClick={() => setKROpen(true)}>Quick Search ⌘K <span className="t-dot"></span></span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Ticker;

