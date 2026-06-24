import { useState, useRef } from "react";
import { useUIStore } from "../store/useStore";
import { useAdminStore } from "../store/useAdminStore";
import { addResource, deleteResource, renameResource, moveResource } from "../lib/supabaseResources";

function ChevronIcon({ className = "subj-chev" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" width="15" height="15">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function PDFItem({ title, sub, icon = "📄", onClick, isAdmin, onDelete, onRename }) {
  return (
    <div className="pdf-item">
      <div className="pdf-icon" onClick={onClick} style={{ cursor: "pointer" }}>{icon}</div>
      <div style={{ flex: 1, cursor: "pointer" }} onClick={onClick}>
        <div className="pdf-name">{title}</div>
        <div className="pdf-sub">{sub}</div>
      </div>
      <span className="pdf-arrow" onClick={onClick} style={{ color: "var(--g4)", cursor: "pointer" }}>→</span>
      {isAdmin && (
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          {onRename && (
            <button className="btn btn-outline"
              style={{ padding: "2px 8px", fontSize: ".68rem" }}
              onClick={(e) => { e.stopPropagation(); onRename(); }}>
              Rename
            </button>
          )}
          {onDelete && (
            <button className="btn btn-outline"
              style={{ padding: "2px 8px", fontSize: ".68rem", borderColor: "var(--red)", color: "var(--red)" }}
              onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Inline admin upload (Drive URL entry) ────────────────────────────────────
function AdminUploadInline({ label, onAdd }) {
  const [open, setOpen]     = useState(false);
  const [title, setTitle]   = useState("");
  const [driveUrl, setUrl]  = useState("");
  const [driveId, setId]    = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!title.trim() || !driveUrl.trim()) return alert("Title and Drive URL required.");
    setSaving(true);
    await onAdd({ title: title.trim(), drive_url: driveUrl.trim(), drive_file_id: driveId.trim() });
    setTitle(""); setUrl(""); setId(""); setOpen(false); setSaving(false);
  }

  if (!open) {
    return (
      <button className="btn btn-outline"
        style={{ fontSize: ".72rem", padding: "5px 12px", marginTop: 8 }}
        onClick={() => setOpen(true)}>
        ↑ Upload PDF
      </button>
    );
  }

  return (
    <div style={{ background: "var(--g1)", border: "1px solid var(--g3)", borderRadius: 6,
      padding: "12px", marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: ".72rem", color: "var(--gold)", fontFamily: "var(--fm)", letterSpacing: ".08em" }}>
        ADD PDF
      </div>
      <input className="form-input" placeholder="PDF Title" value={title}
        onChange={(e) => setTitle(e.target.value)} style={{ fontSize: ".8rem", padding: "6px 10px" }} />
      <input className="form-input" placeholder="Google Drive shareable URL"
        value={driveUrl} onChange={(e) => setUrl(e.target.value)}
        style={{ fontSize: ".8rem", padding: "6px 10px" }} />
      <input className="form-input" placeholder="Drive File ID (optional)"
        value={driveId} onChange={(e) => setId(e.target.value)}
        style={{ fontSize: ".8rem", padding: "6px 10px" }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-primary" style={{ fontSize: ".75rem", padding: "6px 14px" }}
          onClick={handleAdd} disabled={saving}>
          {saving ? "Saving…" : "Add PDF"}
        </button>
        <button className="btn btn-outline" style={{ fontSize: ".75rem", padding: "6px 12px" }}
          onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

// ── UnitRow ──────────────────────────────────────────────────────────────────
function UnitRow({ unit, unitIndex, subjectIndex, files = [], isAdmin, subject, branch, semester, onReload }) {
  const toggleUnit  = useUIStore((s) => s.toggleUnit);
  const openUnits   = useUIStore((s) => s.openUnits);
  const openPDF     = useUIStore((s) => s.openPDF);
  const adminEmail  = useAdminStore((s) => s.adminEmail);
  const isOpen      = !!openUnits[`${subjectIndex}_${unitIndex}`];

  async function handleAdd({ title, drive_url, drive_file_id }) {
    await addResource({
      title, branch, semester,
      subject: subject.code,
      unit: `unit${unitIndex + 1}`,
      category: "notes",
      drive_url, drive_file_id,
      uploaded_by: adminEmail,
    });
    onReload();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this PDF?")) return;
    await deleteResource(id);
    onReload();
  }

  async function handleRename(id, currentTitle) {
    const newTitle = window.prompt("New title:", currentTitle);
    if (!newTitle || !newTitle.trim()) return;
    await renameResource(id, newTitle.trim());
    onReload();
  }

  return (
    <div className={`unit-item ${isOpen ? "open" : ""}`}>
      <div className="unit-header" onClick={() => toggleUnit(subjectIndex, unitIndex)}>
        <div className="unit-left">
          <span className="unit-num">UNIT {unitIndex + 1}</span>
          <span className="unit-name">{unit}</span>
        </div>
        <ChevronIcon />
      </div>

      {isOpen && (
        <div className="unit-files-inner">
          {files.length ? (
            files.map((f, fi) => (
              <PDFItem key={fi} title={f.title} sub="PDF" icon="📄"
                onClick={() => openPDF(f.title, f.url, `${subjectIndex}_u${unitIndex + 1}_${fi}`)}
                isAdmin={isAdmin}
                onDelete={f.id ? () => handleDelete(f.id) : null}
                onRename={f.id ? () => handleRename(f.id, f.title) : null}
              />
            ))
          ) : (
            <div className="empty-pdf">
              {isAdmin ? "No PDFs yet — add one below." : "No PDFs uploaded for this unit yet."}
            </div>
          )}

          {/* Admin controls inline */}
          {isAdmin && (
            <div style={{ borderTop: "1px solid var(--g2)", marginTop: 8, paddingTop: 8 }}>
              <AdminUploadInline onAdd={handleAdd} />
              <button className="btn btn-outline"
                style={{ fontSize: ".72rem", padding: "5px 12px", marginTop: 6, marginLeft: 8 }}
                onClick={onReload}>
                ↻ Reload
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── ResourceTabs ─────────────────────────────────────────────────────────────
function ResourceTabs({ subject, index, isAdmin, branch, semester, onReload }) {
  const openPDF      = useUIStore((s) => s.openPDF);
  const setModalOpen = useUIStore((s) => s.setModalOpen);
  const activeFilter = useUIStore((s) => s.activeFilter);
  const adminEmail   = useAdminStore((s) => s.adminEmail);

  const defaultTab = activeFilter === "pyp" ? "pyp" : activeFilter === "lab" ? "lab" : "theory";
  const [tab, setTab] = useState(defaultTab);
  const hasLab = subject.resources.lab !== null;

  // PYP panel
  const PYPPanel = () => {
    const { mid = [], endsem = [] } = subject.resources.pyp;

    async function addPYP(subcat, { title, drive_url, drive_file_id }) {
      await addResource({
        title, branch, semester, subject: subject.code,
        unit: subcat, category: "previous_papers",
        drive_url, drive_file_id, uploaded_by: adminEmail,
      });
      onReload();
    }

    async function handleDelete(id) {
      if (!window.confirm("Delete?")) return;
      await deleteResource(id); onReload();
    }

    async function handleRename(id, cur) {
      const t = window.prompt("New title:", cur);
      if (t?.trim()) { await renameResource(id, t.trim()); onReload(); }
    }

    return (
      <div>
        <div className="pyp-section">
          <div className="pyp-section-title">Mid Exam Papers</div>
          {mid.length
            ? mid.map((f, i) => (
                <PDFItem key={i} title={f.title} sub="Mid Paper" icon="📝"
                  onClick={() => openPDF(f.title, f.url, `${subject.code}_mid_${i}`)}
                  isAdmin={isAdmin}
                  onDelete={f.id ? () => handleDelete(f.id) : null}
                  onRename={f.id ? () => handleRename(f.id, f.title) : null}
                />
              ))
            : <div className="empty-pdf">{isAdmin ? "No mid papers yet." : "No mid papers uploaded."}</div>}
          {isAdmin && <AdminUploadInline onAdd={(d) => addPYP("mid", d)} />}
        </div>

        <div className="pyp-section" style={{ marginTop: 16 }}>
          <div className="pyp-section-title">End Semester Papers</div>
          {endsem.length
            ? endsem.map((f, i) => (
                <PDFItem key={i} title={f.title} sub="End Sem" icon="📝"
                  onClick={() => openPDF(f.title, f.url, `${subject.code}_end_${i}`)}
                  isAdmin={isAdmin}
                  onDelete={f.id ? () => handleDelete(f.id) : null}
                  onRename={f.id ? () => handleRename(f.id, f.title) : null}
                />
              ))
            : <div className="empty-pdf">{isAdmin ? "No end-sem papers yet." : "No end-sem papers uploaded."}</div>}
          {isAdmin && <AdminUploadInline onAdd={(d) => addPYP("endsem", d)} />}
        </div>
      </div>
    );
  };

  // Lab panel
  const LabPanel = () => {
    const files = subject.resources.lab?.files || [];

    async function addLab({ title, drive_url, drive_file_id }) {
      await addResource({
        title, branch, semester, subject: subject.code,
        unit: "files", category: "lab_manuals",
        drive_url, drive_file_id, uploaded_by: adminEmail,
      });
      onReload();
    }

    async function handleDelete(id) {
      if (!window.confirm("Delete?")) return;
      await deleteResource(id); onReload();
    }

    async function handleRename(id, cur) {
      const t = window.prompt("New title:", cur);
      if (t?.trim()) { await renameResource(id, t.trim()); onReload(); }
    }

    return (
      <div>
        {files.length
          ? files.map((f, i) => (
              <PDFItem key={i} title={f.title} sub="Lab File" icon="🧪"
                onClick={() => openPDF(f.title, f.url, `${subject.code}_lab_${i}`)}
                isAdmin={isAdmin}
                onDelete={f.id ? () => handleDelete(f.id) : null}
                onRename={f.id ? () => handleRename(f.id, f.title) : null}
              />
            ))
          : <div className="empty-pdf">{isAdmin ? "No lab files yet." : "No lab files uploaded."}</div>}
        {isAdmin && <AdminUploadInline onAdd={addLab} />}
      </div>
    );
  };

  return (
    <>
      <div className="res-tabs">
        <button className={`res-tab ${tab === "theory" ? "active" : ""}`} onClick={() => setTab("theory")}>📑 Theory</button>
        <button className={`res-tab ${tab === "pyp"    ? "active" : ""}`} onClick={() => setTab("pyp")}>📝 PYP</button>
        {hasLab && <button className={`res-tab ${tab === "lab" ? "active" : ""}`} onClick={() => setTab("lab")}>🧪 Lab</button>}
      </div>

      <div className="res-panel">
        {tab === "theory" && (
          <div className="unit-list">
            {subject.units?.length ? (
              subject.units.map((u, ui) => (
                <UnitRow key={ui} unit={u} unitIndex={ui} subjectIndex={index}
                  files={subject.resources.theory?.[`unit${ui + 1}`] || []}
                  isAdmin={isAdmin} subject={subject} branch={branch}
                  semester={semester} onReload={onReload} />
              ))
            ) : <div className="empty-pdf">No units defined.</div>}
          </div>
        )}
        {tab === "pyp" && <PYPPanel />}
        {tab === "lab" && <LabPanel />}
      </div>

      <div style={{ padding: "0 20px 14px" }}>
        <div className="contribute-section">
          <p>Missing resources for {subject.name}?</p>
          <button className="btn btn-outline" style={{ padding: "7px 13px", fontSize: ".76rem" }}
            onClick={() => useUIStore.getState().setModalOpen("contribute", true)}>
            Contribute Material +
          </button>
        </div>
      </div>
    </>
  );
}

// ── SubjectCard ───────────────────────────────────────────────────────────────
export default function SubjectCard({ subject, index, isAdmin, onReload, branch, semester }) {
  const toggleSubject = useUIStore((s) => s.toggleSubject);
  const openSubjects  = useUIStore((s) => s.openSubjects);
  const isOpen        = !!openSubjects[index];

  return (
    <div className={`subject-card ${isOpen ? "open" : ""}`} id={`sc-${index}`}>
      <div className="subj-header" onClick={() => toggleSubject(index)}>
        <div style={{ flex: 1 }}>
          <div className="subj-name">{subject.name}</div>
          <div className="subj-meta">
            {subject.code} · {subject.credits > 0 ? `${subject.credits} credits` : "Non-Credit"}
            {subject._meta && <span style={{ marginLeft: 8, color: "var(--g4)" }}>· {subject._meta}</span>}
          </div>
        </div>
        <ChevronIcon className="subj-chev" />
      </div>

      {isOpen && (
        <div className="resource-drawer">
          <ResourceTabs subject={subject} index={index} isAdmin={isAdmin}
            branch={branch} semester={semester} onReload={onReload} />
        </div>
      )}
    </div>
  );
}



