import { useState, useMemo, useEffect, useCallback } from "react";
import { BRANCHES, SEMS, SUBJECTS } from "../data/curriculum";
import { useUIStore, useUserStore } from "../store/useStore";
import { useAdminStore } from "../store/useAdminStore";
import SubjectCard from "./SubjectCard";
import { fetchAllResources } from "../lib/supabaseResources";

export default function ResourceVault() {
  const { activeReg, activeBranch, activeSem, activeFilter, setReg, setBranch, setSem, setFilter } = useUIStore();
  const user    = useUserStore((s) => s.user);
  const isAdmin = useAdminStore((s) => s.adminSession);

  const [search, setSearch]             = useState("");
  const [supabaseResources, setSupaRes] = useState({});
  const [loadingRes, setLoadingRes]     = useState(false);

  // Auto-select branch/semester from profile
  useEffect(() => {
    if (user?.branch)   setBranch(user.branch);
    if (user?.semester) setSem(user.semester);
  }, [user?.branch, user?.semester]);

  // Load resources from Supabase
  const loadResources = useCallback(async () => {
    setLoadingRes(true);
    const result = await fetchAllResources({ branch: activeBranch, semester: activeSem });
    if (result.success) setSupaRes(result.data || {});
    setLoadingRes(false);
  }, [activeBranch, activeSem]);

  useEffect(() => { loadResources(); }, [loadResources]);

  // Subject list
  const subjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length > 1) {
      const results = [];
      for (const r in SUBJECTS)
        for (const b in SUBJECTS[r])
          for (const s in SUBJECTS[r][b])
            SUBJECTS[r][b][s].forEach((sub) => {
              if (sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q))
                results.push({ ...sub, _meta: `${r} · ${b} · Sem ${s}` });
            });
      return results;
    }
    return SUBJECTS[activeReg]?.[activeBranch]?.[activeSem] || [];
  }, [search, activeReg, activeBranch, activeSem]);

  // Merge Supabase resources into curriculum subjects
  const subjectsWithRes = useMemo(() => {
    return subjects.map((sub) => {
      const dbRes = supabaseResources[sub.code] || {};
      const theory = {};
      (sub.units || []).forEach((_, ui) => {
        const key = `unit${ui + 1}`;
        theory[key] = [
          ...(sub.resources?.theory?.[key] || []),
          ...(dbRes.notes?.[key] || []),
        ];
      });
      const pyp = {
        mid:    [...(sub.resources?.pyp?.mid    || []), ...(dbRes.previous_papers?.mid    || [])],
        endsem: [...(sub.resources?.pyp?.endsem || []), ...(dbRes.previous_papers?.endsem || [])],
      };
      const lab = sub.resources?.lab !== null
        ? { files: [...(sub.resources?.lab?.files || []), ...(dbRes.lab_manuals?.files || [])] }
        : null;
      return { ...sub, resources: { ...sub.resources, theory, pyp, lab } };
    });
  }, [subjects, supabaseResources]);

  const filtered = useMemo(() => {
    if (activeFilter === "pyp")
      return subjectsWithRes.filter((s) => s.resources?.pyp?.mid?.length || s.resources?.pyp?.endsem?.length);
    if (activeFilter === "lab")
      return subjectsWithRes.filter((s) => s.resources?.lab !== null);
    return subjectsWithRes;
  }, [subjectsWithRes, activeFilter]);

  return (
    <section id="resources">
      <div className="sec-label">01 · Academic Resources</div>

      <div className="res-controls">
        <div>
          <h2 className="sec-title">Study Vault.</h2>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            Select regulation, branch &amp; sem — or search globally.
          </p>
        </div>
        <input type="text" className="search-input" style={{ maxWidth: 340 }}
          placeholder="Search subject or code… (Ctrl+K)"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="reg-row">
        <span className="reg-label">REG:</span>
        {["R22A", "R21A"].map((r) => (
          <button key={r} className={`reg-btn ${activeReg === r ? "active" : ""}`} onClick={() => setReg(r)}>{r}</button>
        ))}
      </div>

      <div className="branch-grid">
        {BRANCHES.map((b) => (
          <button key={b.code} className={`branch-btn ${activeBranch === b.code ? "active" : ""}`}
            onClick={() => setBranch(b.code)}>{b.code}</button>
        ))}
      </div>

      <div className="sem-tabs">
        {SEMS.map((s) => (
          <button key={s} className={`sem-tab ${activeSem === s ? "active" : ""}`}
            onClick={() => setSem(s)}>Sem {s}</button>
        ))}
      </div>

      <div className="filter-chips">
        {[{key:"all",label:"All"},{key:"theory",label:"Theory Notes"},{key:"pyp",label:"Prev Year Papers"},{key:"lab",label:"Lab Manuals"}].map((f) => (
          <button key={f.key} className={`chip ${activeFilter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
        {loadingRes && <span style={{ fontSize: ".72rem", color: "var(--g4)", marginLeft: 8 }}>Loading…</span>}
      </div>

      {/* Section anchors for nav scrolling */}
      <div id="pyp" style={{ position: "relative", top: -80 }} />
      <div id="lab-manuals" style={{ position: "relative", top: -80 }} />
      <div id="cgpa" style={{ position: "relative", top: -80 }} />

      {filtered.length === 0 ? (
        <EmptyState activeFilter={activeFilter} />
      ) : (
        <div className="subject-list">
          {filtered.map((subject, i) => (
            <SubjectCard key={subject.code + i} subject={subject} index={i}
              isAdmin={!!isAdmin} onReload={loadResources}
              branch={activeBranch} semester={activeSem} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState({ activeFilter }) {
  const setModalOpen = useUIStore((s) => s.setModalOpen);
  return (
    <div style={{ textAlign:"center", padding:"52px 20px", color:"var(--g4)",
      border:"1px dashed var(--g3)", borderRadius:5, fontSize:".88rem" }}>
      {activeFilter !== "all" ? (
        <>
          No {activeFilter} resources uploaded yet.
          <br />
          <button className="btn btn-outline"
            style={{ marginTop: 12, padding: "8px 16px", fontSize: ".78rem" }}
            onClick={() => setModalOpen("contribute", true)}>
            Contribute Resources +
          </button>
        </>
      ) : "No subjects found for this selection."}
    </div>
  );
}
