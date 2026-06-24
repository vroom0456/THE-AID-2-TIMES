export default function Loader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "1.3rem",
          fontWeight: 700,
          letterSpacing: ".15em",
          color: "#f5f5f5",
        }}
      >
        THE AID <span style={{ color: "#f0c040" }}>2</span> TIMES
      </div>

      <div
        style={{
          width: 160,
          height: 1,
          background: "#2a2a2a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "60%",
            background: "#f5f5f5",
            animation: "slide 1s ease forwards",
          }}
        />
      </div>
    </div>
  );
}


