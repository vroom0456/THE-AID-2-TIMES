// ─────────────────────────────────────────────
// SubjectCard — accordion with unit/PYP/Lab tabs
// Used inside ResourceVault.jsx
// ─────────────────────────────────────────────
import { useState } from "react";
import { useUIStore } from "../store/useStore";
import { useResourceAdminStore } from "../store/useResourceAdminStore";

// ── UnitRow ──────────────────────────────────
function UnitRow({ unit, unitIndex, subjectIndex, files = [] }) {
  const toggleUnit  = useUIStore((s) => s.toggleUnit);
  const openUnits   = useUIStore((s) => s.openUnits);
  const openPDF     = useUIStore((s) => s.openPDF);
  const isOpen      = !!openUnits[`${subjectIndex}_${unitIndex}`];

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
              <PDFItem
                key={fi}
                title={f.title}
                sub="PDF"
                icon="📄"
                onClick={() => openPDF(f.title, f.url, `${subjectIndex}_u${unitIndex + 1}_${fi}`)}
              />
            ))
          ) : (
            <div className="empty-pdf">No PDFs uploaded for this unit yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ── PDFItem ───────────────────────────────────
export function PDFItem({ title, sub, icon = "📄", onClick }) {
  return (
    <div className="pdf-item" onClick={onClick}>
      <div className="pdf-icon">{icon}</div>
      <div>
        <div className="pdf-name">{title}</div>
        <div className="pdf-sub">{sub}</div>
      </div>
      <span className="pdf-arrow" style={{ marginLeft: "auto", color: "var(--g4)" }}>→</span>
    </div>
  );
}

// ── ResourceTabs ──────────────────────────────
function ResourceTabs({ subject, index }) {
  const openPDF    = useUIStore((s) => s.openPDF);
  const openModal  = useUIStore((s) => s.openModal);
  const activeFilter = useUIStore((s) => s.activeFilter);

  const defaultTab =
    activeFilter === "pyp" ? "pyp" :
    activeFilter === "lab" ? "lab" : "theory";

  const [tab, setTab] = useState(defaultTab);
  const hasLab = subject.resources.lab !== null;

  // Theory panel
  const TheoryPanel = () => (
    <div className="unit-list">
      {subject.units?.length ? (
        subject.units.map((u, ui) => (
          <UnitRow
            key={ui}
            unit={u}
            unitIndex={ui}
            subjectIndex={index}
            files={subject.resources.theory?.[`unit${ui + 1}`] || []}
          />
        ))
      ) : (
        <div className="empty-pdf">No units defined.</div>
      )}
    </div>
  );

  // PYP panel
  const PYPPanel = () => {
    const { mid = [], endsem = [] } = subject.resources.pyp;
    return (
      <div>
        <div className="pyp-section">
          <div className="pyp-section-title">Mid Exam Papers</div>
          {mid.length
            ? mid.map((f, i) => (
                <PDFItem key={i} title={f.title} sub="Mid Paper" icon="📝"
                  onClick={() => openPDF(f.title, f.url, `${subject.code}_mid_${i}`)} />
              ))
            : <div className="empty-pdf">No mid papers yet.</div>}
        </div>
        <div className="pyp-section" style={{ marginTop: 16 }}>
          <div className="pyp-section-title">End Semester Papers</div>
          {endsem.length
            ? endsem.map((f, i) => (
                <PDFItem key={i} title={f.title} sub="End Sem" icon="📝"
                  onClick={() => openPDF(f.title, f.url, `${subject.code}_end_${i}`)} />
              ))
            : <div className="empty-pdf">No end-sem papers yet.</div>}
        </div>
      </div>
    );
  };

  // Lab panel
  const LabPanel = () => {
    const files = subject.resources.lab?.files || [];
    return files.length
      ? files.map((f, i) => (
          <PDFItem key={i} title={f.title} sub="Lab File" icon="🧪"
            onClick={() => openPDF(f.title, f.url, `${subject.code}_lab_${i}`)} />
        ))
      : <div className="empty-pdf">No lab files uploaded yet.</div>;
  };

  return (
    <>
      <div className="res-tabs">
        <button className={`res-tab ${tab === "theory" ? "active" : ""}`} onClick={() => setTab("theory")}>📑 Theory</button>
        <button className={`res-tab ${tab === "pyp"    ? "active" : ""}`} onClick={() => setTab("pyp")}>📝 PYP</button>
        {hasLab && (
          <button className={`res-tab ${tab === "lab" ? "active" : ""}`} onClick={() => setTab("lab")}>🧪 Lab</button>
        )}
      </div>

      <div className="res-panel">
        {tab === "theory" && <TheoryPanel />}
        {tab === "pyp"    && <PYPPanel />}
        {tab === "lab"    && <LabPanel />}
      </div>

      {/* Contribute — always at bottom */}
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
// ── SubjectCard (main export) ──────────────────
export default function SubjectCard({ subject, index }) {
  const toggleSubject = useUIStore((s) => s.toggleSubject);
  const openSubjects  = useUIStore((s) => s.openSubjects);
  const isOpen = !!openSubjects[index];
  const adminMode =
  useResourceAdminStore((s) => s.adminMode);

  return (
    <div className={`subject-card ${isOpen ? "open" : ""}`} id={`sc-${index}`}>
      <div className="subj-header" onClick={() => toggleSubject(index)}>
        {adminMode && (
  <div
    style={{
      display: "flex",
      gap: 8,
      marginTop: 10,
    }}
  >
    <button
      className="btn btn-outline"
      onClick={(e) => {
        e.stopPropagation();
        alert("Rename Subject");
      }}
    >
      Rename
    </button>

    <button
      className="btn btn-outline"
      onClick={(e) => {
        e.stopPropagation();
        alert("Move Subject");
      }}
    >
      Move
    </button>

    <button
      className="btn btn-outline"
      onClick={(e) => {
        e.stopPropagation();
        alert("Delete Subject");
      }}
    >
      Delete
    </button>
  </div>
)}
        <div style={{ flex: 1 }}>
          <div className="subj-name">{subject.name}</div>
          <div className="subj-meta">
            {subject.code} · {subject.credits > 0 ? `${subject.credits} credits` : "Non-Credit"}
          </div>
        </div>
        <ChevronIcon className="subj-chev" />
      </div>

      {isOpen && (
        <div className="resource-drawer">
          <ResourceTabs subject={subject} index={index} />
        </div>
      )}
    </div>
  );
}

// ── Shared icon ───────────────────────────────
function ChevronIcon({ className = "subj-chev" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" width="15" height="15">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
