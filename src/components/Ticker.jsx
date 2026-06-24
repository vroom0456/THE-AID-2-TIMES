import { useUIStore } from "../store/useStore";

export default function Ticker() {
  const setModalOpen = useUIStore((s) => s.setModalOpen);
  const setKBOpen = useUIStore((s) => s.setKBOpen);

  const scrollToResources = () => {
    const el = document.getElementById("resources");
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {[1, 2].map((loopIndex) => (
          <span key={loopIndex} style={{ display: "contents" }}>
            <span
              className="ticker-item"
              onClick={scrollToResources}
            >
              Theory Notes <span className="t-dot"></span>
            </span>

            <span
              className="ticker-item"
              onClick={() => setModalOpen("calc", true)}
            >
              CGPA Calculator <span className="t-dot"></span>
            </span>

            <span
              className="ticker-item"
              onClick={scrollToResources}
            >
              Lab Manuals <span className="t-dot"></span>
            </span>

            <span
              className="ticker-item"
              onClick={scrollToResources}
            >
              Prev Year Papers <span className="t-dot"></span>
            </span>

            <span
              className="ticker-item"
              onClick={() => setModalOpen("dash", true)}
            >
              My Dashboard <span className="t-dot"></span>
            </span>

            <span
              className="ticker-item"
              onClick={() => setKBOpen(true)}
            >
              Quick Search ⌘K <span className="t-dot"></span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}



