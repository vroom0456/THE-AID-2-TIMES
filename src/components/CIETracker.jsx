import { useState } from "react";
import { useCIEStore } from "../store/useStore";
import { SUBJECTS } from "../data/curriculum";

// ─────────────────────────────────────────────
// CIETracker.jsx  (save as separate file if preferred)
// ─────────────────────────────────────────────
export function CIETracker({ sem, branch }) {
  const subjects   = (SUBJECTS["R22A"]?.[branch]?.[sem] || []).filter((s) => s.credits > 0);
  const updateMark = useCIEStore((s) => s.updateMark);
  const computeCIE = useCIEStore((s) => s.computeCIE);
  const marks      = useCIEStore((s) => s.marks);

  const [activeTab, setActiveTab] = useState(0);
  const [saved, setSaved] = useState(false);

  if (!subjects.length)
    return <p style={{ fontSize: ".82rem", color: "var(--g5)" }}>No theory subjects found.</p>;

  const subj = subjects[activeTab];
  const d    = marks[sem]?.[subj.code] || {};
  const n    = (k) => parseFloat(d[k]) || "";

  const handleChange = (key, val) => {
    updateMark(sem, subj.code, key, parseFloat(val) || 0);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  const cie = computeCIE(sem, subj.code);

  return (
    <div>
      {/* Subject tabs */}
      <div className="cie-tabs">
        {subjects.map((s, i) => (
          <button key={i} className={`cie-tab ${activeTab === i ? "active" : ""}`}
            onClick={() => setActiveTab(i)}>
            {s.code.replace("22", "").replace(/[A-Z]$/, "")}
          </button>
        ))}
        {saved && <span className="save-ind" style={{ opacity: 1, marginLeft: "auto" }}>✓ Saved</span>}
      </div>

      <div className="marks-card">
        {/* Slip Tests */}
        <Section title="Slip Tests (Best 2 of 3 → avg → /5)">
          {["Slip Test 1","Slip Test 2","Slip Test 3"].map((l, j) => (
            <MarksRow key={j} label={l} max={5}
              value={n(`st${j + 1}`)}
              onChange={(v) => handleChange(`st${j + 1}`, v)} />
          ))}
        </Section>

        {/* Mids */}
        <Section title="Mid Exams (average of both → /20)">
          {["Mid 1","Mid 2"].map((l, j) => (
            <MarksRow key={j} label={l} max={20}
              value={n(`mid${j + 1}`)}
              onChange={(v) => handleChange(`mid${j + 1}`, v)} />
          ))}
        </Section>

        {/* Assignments */}
        <Section title="Assignments (average → /10)">
          {["Assignment 1","Assignment 2"].map((l, j) => (
            <MarksRow key={j} label={l} max={10}
              value={n(`as${j + 1}`)}
              onChange={(v) => handleChange(`as${j + 1}`, v)} />
          ))}
        </Section>

        {/* Attendance */}
        <Section title="Attendance (85%+=5M · 80%+=4M · 75%+=3M · 70%+=2M · 65%+=1M)">
          <MarksRow label="Attendance %" max={100}
            value={n("att")}
            onChange={(v) => handleChange("att", v)} />
        </Section>
      </div>

      {/* CIE Summary */}
      <div className="cie-summary">
        <div className="cie-sum-title">CIE Summary (out of 40)</div>
        {[
          ["Slip Test Score (/5)",    cie.stScore.toFixed(1)],
          ["Mid Exam Score (/20)",    cie.midScore.toFixed(1)],
          ["Assignment Score (/10)",  cie.asScore.toFixed(1)],
          ["Attendance Marks (/5)",   cie.attScore],
        ].map(([l, v]) => (
          <div key={l} className="cie-sum-row">
            <span>{l}</span><span className="val">{v}</span>
          </div>
        ))}
        <div className="cie-sum-row" style={{ fontSize: ".92rem" }}>
          <span style={{ fontWeight: 700 }}>Total CIE (/40)</span>
          <span className="val" style={{
            fontSize: ".95rem",
            color: cie.total >= 30 ? "var(--green)" : cie.total >= 20 ? "var(--gold)" : "var(--red)"
          }}>
            {cie.total.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Small reusable bits ───────────────────────
function Section({ title, children }) {
  return (
    <div>
      <div className="marks-section-title">{title}</div>
      {children}
    </div>
  );
}

function MarksRow({ label, max, value, onChange }) {
  return (
    <div className="marks-row">
      <span className="marks-row-label">{label}</span>
      <span className="marks-row-max">/{max}</span>
      <input
        type="number"
        className="marks-input"
        min={0} max={max} step={0.5}
        placeholder="—"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
