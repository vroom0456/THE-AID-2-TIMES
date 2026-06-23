// ─────────────────────────────────────────────
// FILE: src/components/ui/Modal.jsx
// Reusable modal wrapper used by Dashboard,
// CGPACalculator, ProfileEdit, Contribute
// ─────────────────────────────────────────────
export default function Modal({ title, sub, children, onClose, wide, headerExtra }) {
  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target.className.includes("modal-overlay")) onClose(); }}>
      <div className="modal-box" style={{ maxWidth: wide ? 800 : 540 }}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        {headerExtra
          ? <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom: sub ? 5 : 18 }}>
              <div><div className="modal-title">{title}</div>{sub && <div className="modal-sub">{sub}</div>}</div>
              <div style={{ marginRight: 32 }}>{headerExtra}</div>
            </div>
          : <><div className="modal-title">{title}</div>{sub && <div className="modal-sub">{sub}</div>}</>
        }
        {children}
      </div>
    </div>
  );
}

