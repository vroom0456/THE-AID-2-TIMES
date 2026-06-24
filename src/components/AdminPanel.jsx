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

  const exportResources = () => {
    const resources =
      localStorage.getItem("resources") || "{}";

    const blob = new Blob(
      [resources],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "resources-backup.json";

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section
      style={{
        border: "1px solid #f0c040",
        padding: 20,
        marginBottom: 30,
        borderRadius: 8,
      }}
    >
      <h3
        style={{
          marginBottom: 10,
        }}
      >
        ⚡ Admin Panel
      </h3>

      <p>{adminSession}</p>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={() =>
            setAdminMode(
              !adminMode
            )
          }
        >
          {adminMode
            ? "Disable Admin Mode"
            : "Enable Admin Mode"}
        </button>

        <button
          className="btn btn-outline"
          onClick={
            exportResources
          }
        >
          Export Resources
        </button>
      </div>
    </section>
  );
}
