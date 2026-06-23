import { useAdminStore } from "../store/useAdminStore";

export default function AdminPanel() {
  const adminSession = useAdminStore(
    (s) => s.adminSession
  );

  if (!adminSession) return null;

  return (
    <section
      style={{
        border: "1px solid var(--g3)",
        padding: 20,
        marginBottom: 30,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          color: "#f0c040",
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        ⚡ ADMIN PANEL
      </div>

      <p>
        Logged in as:
        <br />
        <strong>{adminSession}</strong>
      </p>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 15,
        }}
      >
        <button className="btn btn-outline">
          Resources
        </button>

        <button className="btn btn-outline">
          Users
        </button>

        <button className="btn btn-outline">
          Uploads
        </button>

        <button className="btn btn-outline">
          Analytics
        </button>
      </div>
    </section>
  );
}
