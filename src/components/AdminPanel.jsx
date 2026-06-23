import { useAdminStore } from "../store/useAdminStore";
import { useResourceAdminStore } from "../store/useResourceAdminStore";

export default function AdminPanel() {
  const adminSession =
    useAdminStore((s) => s.adminSession);

  const adminMode =
    useResourceAdminStore((s) => s.adminMode);

  const setAdminMode =
    useResourceAdminStore((s) => s.setAdminMode);

  if (!adminSession) return null;

  return (
    <section
      style={{
        border: "1px solid #f0c040",
        padding: 20,
        marginBottom: 30,
        borderRadius: 8,
      }}
    >
      <h3 style={{ marginBottom: 10 }}>
        ⚡ Admin Panel
      </h3>

      <p>{adminSession}</p>

      <button
        className="btn btn-primary"
        onClick={() =>
          setAdminMode(!adminMode)
        }
      >
        {adminMode
          ? "Disable Admin Mode"
          : "Enable Admin Mode"}
      </button>
    </section>
  );
}
