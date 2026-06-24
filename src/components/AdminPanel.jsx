import { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { useResourceAdminStore } from "../store/useResourceAdminStore";
import Modal from "./ui/Modal";

export default function AdminPanel() {
  const adminSession = useAdminStore((s) => s.adminSession);
  const logout       = useAdminStore((s) => s.logout);
  const adminMode    = useResourceAdminStore((s) => s.adminMode);
  const setAdminMode = useResourceAdminStore((s) => s.setAdminMode);

  const [open, setOpen] = useState(false);

  if (!adminSession) return null;

  function getStats() {
    try {
      const r = JSON.parse(localStorage.getItem("resources") || "{}");
      let subjects = 0, files = 0;
      for (const reg in r)
        for (const branch in r[reg])
          for (const sem in r[reg][branch]) {
            subjects += r[reg][branch][sem].length;
            r[reg][branch][sem].forEach((subj) => {
              const res = subj.resources || {};
              for (const type in res) {
                if (Array.isArray(res[type])) files += res[type].length;
                else if (res[type]?.files) files += res[type].files.length;
              }
            });
          }
      return { subjects, files };
    } catch {
      return { subjects: 0, files: 0 };
    }
  }

  function exportData() {
    const data = localStorage.getItem("resources") || "{}";
    const blob = new Blob([data], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "resources-backup.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        JSON.parse(ev.target.result);
        localStorage.setItem("resources", ev.target.result);
        alert("Import successful! Reload the page to see changes.");
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  function clearAll() {
    if (!window.confirm("Clear ALL resource data? This cannot be undone.")) return;
    localStorage.removeItem("resources");
    alert("Cleared. Reload the page.");
  }

  const stats = open ? getStats() : null;

  return (
    <>
      {/* Floating admin bar */}
      <div style={{
        border: "1px solid var(--gold)", padding: "14px 20px",
        marginBottom: 30, borderRadius: 8, display: "flex",
        alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <span style={{ fontFamily: "var(--fm)", fontSize: ".7rem", color: "var(--gold)", letterSpacing: ".08em" }}>
            ⚡ ADMIN MODE
          </span>
          <div style={{ fontSize: ".78rem", color: "var(--g5)", marginTop: 2 }}>
            {adminSession}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            style={{ padding: "7px 14px", fontSize: ".78rem" }}
            onClick={() => setAdminMode(!adminMode)}
          >
            {adminMode ? "Disable Edit Mode" : "Enable Edit Mode"}
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: "7px 14px", fontSize: ".78rem" }}
            onClick={() => setOpen(true)}
          >
            Admin Panel ↗
          </button>
        </div>
      </div>

      {/* Admin Panel Modal */}
      {open && (
        <Modal
          title="⚡ Admin Panel"
          sub="Manage resource data. Changes save to this browser's localStorage."
          onClose={() => setOpen(false)}
          wide
        >
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
            {[
              { label: "Subjects", val: stats.subjects },
              { label: "Files",    val: stats.files },
              { label: "Session",  val: "Active" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "var(--g1)", border: "1px solid var(--g3)",
                borderRadius: 6, padding: "12px 14px",
              }}>
                <div style={{ fontFamily: "var(--fm)", fontSize: ".62rem", color: "var(--g5)", letterSpacing: ".08em", textTransform: "uppercase" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--white)", marginTop: 4 }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>

          {/* Data management */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: ".62rem", color: "var(--g5)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
              Data Management
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-outline" style={{ fontSize: ".76rem", padding: "8px 14px" }} onClick={exportData}>
                📤 Export JSON
              </button>
              <label className="btn btn-outline" style={{ fontSize: ".76rem", padding: "8px 14px", cursor: "pointer" }}>
                📥 Import JSON
                <input type="file" accept=".json" style={{ display: "none" }} onChange={importData} />
              </label>
              <button
                className="btn btn-outline"
                style={{ fontSize: ".76rem", padding: "8px 14px", borderColor: "var(--red)", color: "var(--red)" }}
                onClick={clearAll}
              >
                🗑 Clear All Resources
              </button>
            </div>
            <p style={{ fontSize: ".72rem", color: "var(--g4)", marginTop: 8 }}>
              Export your resource data as JSON to back it up or share with co-admins.
            </p>
          </div>

          {/* Session */}
          <div style={{ borderTop: "1px solid var(--g2)", paddingTop: 16 }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: ".62rem", color: "var(--g5)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
              Session
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontSize: ".82rem", color: "var(--g5)" }}>
                Logged in as: <strong style={{ color: "var(--white)" }}>{adminSession}</strong>
              </div>
              <button
                className="btn btn-outline"
                style={{ fontSize: ".76rem", padding: "7px 13px", borderColor: "var(--red)", color: "var(--red)" }}
                onClick={() => { logout(); setOpen(false); }}
              >
                Logout Admin
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
