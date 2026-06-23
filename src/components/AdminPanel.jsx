import { useAdminStore } from "../store/useAdminStore";

export default function AdminPanel() {
  const adminSession = useAdminStore((s) => s.adminSession);

  if (!adminSession) return null;

  return (
    <section
      style={{
        margin: "24px 0",
        padding: "20px",
        border: "1px solid var(--g3)",
        borderRadius: 8,
        background: "rgba(255,255,255,.02)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              color: "#f0c040",
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            ADMIN PANEL
          </div>

          <div style={{ fontSize: ".85rem", color: "var(--g4)" }}>
            Logged in as: {adminSession}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 12,
        }}
      >
        <button className="btn btn-outline">
          📤 Upload Resource
        </button>

        <button className="btn btn-outline">
          📝 Manage Resources
        </button>

        <button className="btn btn-outline">
          📬 Contributions
        </button>

        <button className="btn btn-outline">
          👥 Admins
        </button>
      </div>
    </section>
  );
}
