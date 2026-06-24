// ─────────────────────────────────────────────
// Dashboard.jsx  (imports CIETracker below)
// ─────────────────────────────────────────────
import { useState } from "react";
import { useUserStore, useCIEStore, useUIStore } from "../store/useStore";
import { SUBJECTS, SEMS, SEM_CREDITS, GRADE_BOUNDS } from "../data/curriculum";
import { calcCGPA, predictExternal } from "../utils/cgpaCalc";
import Modal from "./ui/Modal";
import CIETracker from "./CIETracker";

export default function Dashboard() {
  const isOpen   = useUIStore((s) => s.modals?.dash);
  const setModal = useUIStore((s) => s.setModalOpen);
  const user     = useUserStore((s) => s.user);
  const updateSGPA = useUserStore((s) => s.updateSGPA);

  const [dashSem, setDashSem] = useState("V");

  if (!isOpen || !user) return null;

  const sgpas       = user.sgpas || [];
  const currentCGPA = calcCGPA(sgpas);

  // Chart bars
  const maxBar = 90; // px
  const bars = Array.from({ length: 8 }, (_, i) => {
    const v = parseFloat(sgpas[i]) || 0;
    return { v, h: v > 0 ? Math.max(4, (v / 10) * maxBar) : 4, filled: v > 0 };
  });

  return (
    <Modal
      title="My Dashboard"
      sub={`${user.roll} · ${user.branch} · Sec ${user.section || "?"} · Sem ${user.sem}`}
      wide
      onClose={() => setModal("dash", false)}
      headerExtra={
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          <button className="btn btn-outline" style={{ padding: "6px 11px", fontSize: ".74rem" }}
            onClick={() => { setModal("dash", false); setModal("profileEdit", true); }}>
            Edit Profile
          </button>
          <button className="btn btn-outline" style={{ padding: "6px 11px", fontSize: ".74rem" }}
            onClick={() => useUserStore.getState().logout()}>
            Logout
          </button>
        </div>
      }
    >
      {/* ── Avatar + info ── */}
      <div className="dash-header">
        <div className="dash-avatar">
          {user.pfp
            ? <img src={user.pfp} alt="pfp" />
            : user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="dash-name">{user.name}</div>
          <div className="dash-meta">
            {user.roll} · {user.branch} · Sec {user.section || "?"} · Sem {user.sem}
          </div>
        </div>
      </div>

      {/* ── CGPA Bar Chart ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--fm)", fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--g5)" }}>
            CGPA History — click bar to edit
          </span>
          {currentCGPA > 0 && (
            <span style={{ fontFamily: "var(--fm)", fontSize: ".78rem", color: "var(--gold)" }}>
              Current CGPA: {currentCGPA.toFixed(2)}
            </span>
          )}
        </div>
        <div className="cgpa-chart-wrap">
          {/* Bars */}
          <div className="cgpa-chart" style={{ height: maxBar }}>
            {bars.map((b, i) => (
              <div key={i} className="cgpa-bw">
                <div style={{ fontFamily: "var(--fm)", fontSize: ".6rem", color: b.filled ? "var(--g6)" : "transparent", marginBottom: 3 }}>
                  {b.filled ? b.v.toFixed(1) : "·"}
                </div>
                <div
                  className={`cgpa-bar ${b.filled ? "filled" : ""}`}
                  style={{ height: b.h }}
                  title={`Sem ${i + 1} SGPA`}
                />
              </div>
            ))}
          </div>
          {/* Editable inputs */}
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <input
                  className="cgpa-edit"
                  type="number" step="0.01" min="0" max="10"
                  placeholder={`S${i + 1}`}
                  value={b.v || ""}
                  onChange={(e) => updateSGPA(i, parseFloat(e.target.value) || 0)}
                />
                <div style={{ fontFamily: "var(--fm)", fontSize: ".58rem", color: "var(--g4)", marginTop: 2 }}>
                  S{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CIE Tracker ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: ".95rem", fontWeight: 600, color: "var(--white)" }}>CIE Marks Tracker</div>
          <div style={{ fontSize: ".78rem", color: "var(--g5)", marginTop: 2 }}>
            Track slip tests, mids, assignments & attendance. Auto-saves instantly.
          </div>
        </div>
        <select
          className="form-select"
          style={{ width: "auto", padding: "7px 32px 7px 10px", fontSize: ".78rem" }}
          value={dashSem}
          onChange={(e) => setDashSem(e.target.value)}
        >
          {SEMS.map((s) => <option key={s} value={s}>Sem {s}</option>)}
        </select>
      </div>

      <CIETracker sem={dashSem} branch={user.branch} />

      {/* ── Grade Predictor ── */}
      <GradePredictor sem={dashSem} branch={user.branch} />
    </Modal>
  );
}

// ─────────────────────────────────────────────
// GradePredictor (inline sub-component)
// ─────────────────────────────────────────────
function GradePredictor({ sem, branch }) {
  const computeCIE = useCIEStore((s) => s.computeCIE);
  const subjects   = (SUBJECTS["R22A"]?.[branch]?.[sem] || []).filter((s) => s.credits > 0);

  const [si, setSi]    = useState(0);
  const [grade, setGrade] = useState(10);

  if (!subjects.length) return null;

  const subj = subjects[si];
  const { total: cieTot } = computeCIE(sem, subj.code);
  const { needed, feasible } = predictExternal(cieTot, grade);

  const gradeLabel = (g) => ({ 10:"S",9:"A",8:"B",7:"C",6:"D",5:"E" }[g] || "E");

  return (
    <div className="grade-pred" style={{ marginTop: 16 }}>
      <div style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--white)", marginBottom: 5 }}>
        Grade Predictor
      </div>
      <div style={{ fontSize: ".78rem", color: "var(--g5)", marginBottom: 12 }}>
        How much do you need in external to hit a target grade?
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: 150 }}>
          <label className="form-label">Subject</label>
          <select className="form-select" value={si} onChange={(e) => setSi(parseInt(e.target.value))}>
            {subjects.map((s, i) => <option key={i} value={i}>{s.name}</option>)}
          </select>
        </div>
        <div style={{ width: 130 }}>
          <label className="form-label">Target Grade</label>
          <select className="form-select" value={grade} onChange={(e) => setGrade(parseInt(e.target.value))}>
            {[[10,"S — 90+"],[9,"A — 80+"],[8,"B — 70+"],[7,"C — 60+"],[6,"D — 55+"],[5,"E — 50+"]].map(([v,l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="gp-result" style={{ marginTop: 12 }}>
        {cieTot === 0
          ? <span style={{ color: "var(--g4)" }}>Enter your CIE marks above to see the prediction.</span>
          : !feasible
          ? <span style={{ color: "var(--red)" }}>
              CIE: <strong>{cieTot.toFixed(1)}/40</strong> — Not achievable.
              Best total: {(cieTot + 60).toFixed(0)}. Try a lower grade.
            </span>
          : needed === 0
          ? <span style={{ color: "var(--green)" }}>
              CIE: <strong>{cieTot.toFixed(1)}/40</strong> — Already secured{" "}
              <strong>{gradeLabel(grade)} ({grade})</strong>! 🎉
            </span>
          : <>
              CIE: <strong style={{ color: "var(--g6)" }}>{cieTot.toFixed(1)}/40</strong>
              {" → "}Score{" "}
              <strong style={{ color: "var(--gold)", fontSize: "1rem" }}>{needed}/60</strong>
              {" "}in external to get{" "}
              <strong style={{ color: "var(--white)" }}>{gradeLabel(grade)} ({grade})</strong>
            </>
        }
      </div>
    </div>
  );
}


