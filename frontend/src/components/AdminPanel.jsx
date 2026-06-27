import { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import Modal from "./ui/Modal";

export default function AdminPanel() {
  const adminSession = useAdminStore((s) => s.adminSession);
  const adminEmail   = useAdminStore((s) => s.adminEmail);
  const logout       = useAdminStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  if (!adminSession) return null;

  return (
    <>
      <div className="admin-control-bar">
        <span style={{ fontSize: ".72rem", color: "var(--gold)", fontFamily: "var(--fm)", letterSpacing: ".08em" }}>
          {adminEmail}
        </span>
        <button className="btn btn-outline" style={{ padding: "6px 14px", fontSize: ".76rem" }}
          onClick={() => setOpen(true)}>
          Admin Panel ↗
        </button>
        <button className="btn btn-outline"
          style={{ padding: "6px 14px", fontSize: ".76rem", borderColor: "var(--red)", color: "var(--red)" }}
          onClick={logout}>
          Logout Admin
        </button>
      </div>

      {open && (
        <Modal title="⚡ Admin Panel" sub={`Logged in as: ${adminEmail}`}
          onClose={() => setOpen(false)} wide>
          <div style={{ padding: "8px 0", fontSize: ".82rem", color: "var(--g5)" }}>
            Use the inline controls inside each subject → unit to upload, rename, or delete PDFs.
          </div>
          <div style={{ marginTop: 16, borderTop: "1px solid var(--g2)", paddingTop: 16 }}>
            <button className="btn btn-outline"
              style={{ borderColor: "var(--red)", color: "var(--red)", padding: "8px 16px", fontSize: ".78rem" }}
              onClick={() => { logout(); setOpen(false); }}>
              Logout Admin
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
