export default function EasterEgg() {
  return (
    <div
      id="egg"
      onClick={() => document.getElementById("egg")?.classList.remove("on")}
    >
      <h1 className="glitch" style={{ fontSize: "3rem", marginBottom: 10 }}>
        HI POTATOES 🥔
      </h1>
      <p style={{ fontFamily: "var(--fm)", color: "#0f0", fontSize: ".95rem" }}>
        built by Varun Teja Cherukuthota
      </p>
      <p style={{ marginTop: 32, fontSize: ".72rem", color: "#050" }}>
        [ tap anywhere to exit ]
      </p>
    </div>
  );
}
