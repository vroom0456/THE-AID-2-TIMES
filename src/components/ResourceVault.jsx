import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { BRANCHES, SEMS, SUBJECTS } from "../data/curriculum";
import { useUIStore, useUserStore } from "../store/useStore";
import { useAdminStore } from "../store/useAdminStore";
import SubjectCard from "./SubjectCard";
import { fetchAllResources } from "../lib/supabaseResources";
import { FILTERS } from "../utils/constants";

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function ResourceVault() {
  const { activeReg, activeBranch, activeSem, activeFilter, setReg, setBranch, setSem, setFilter } = useUIStore();
  const user    = useUserStore((s) => s.user);
  const isAdmin = useAdminStore((s) => s.adminSession);

  const [search, setSearch]         = useState("");
  const [supaRes, setSupaRes]       = useState({});
  const [loadingRes, setLoadingRes] = useState(false);
  const [loadError, setLoadError]   = useState("");

  const abortRef   = useRef(null);
  const didSyncRef = useRef(false);

  useEffect(() => {
    if (didSyncRef.current) return;
    if (user?.branch)   setBranch(user.branch);
    if (user?.semester) setSem(user.semester);
    didSyncRef.current = true;
  }, [user?.branch, user?.semester, setBranch, setSem]);

  const loadResources = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoadingRes(true); setLoadError("");
    const result = await fetchAllResources({ branch: activeBranch, semester: activeSem });
    if (result.success) { setSupaRes(result.data || {}); }
    else { setLoadError(result.error || "Failed to load resources."); setSupaRes({}); }
    setLoadingRes(false);
  }, [activeBranch, activeSem]);

  useEffect(() => { loadResources(); return () => abortRef.current?.abort(); }, [loadResources]);

  const debouncedSearch = useDebounced(search, 250);

  const subjects = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (q.length > 1) {
      const results = [];
      for (const r in SUBJECTS) for (const b in SUBJECTS[r]) for (const s in SUBJECTS[r][b])
        SUBJECTS[r][b][s].forEach((sub) => {
          if (sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q))
            results.push({ ...sub, _meta: `${r} · ${b} · Sem ${s}` });
        });
      return results;
    }
    return SUBJECTS[activeReg]?.[activeBranch]?.[activeSem] || [];
  }, [debouncedSearch, activeReg, activeBranch, activeSem]);

  const subjectsWithRes = useMemo(() => subjects.map((sub) => {
    const dbRes = supaRes[sub.code] || {};
    const theory = {};
    (sub.units || []).forEach((_, ui) => {
      const key = `unit${ui + 1}`;
      theory[key] = [...(sub.resources?.theory?.[key] || []), ...(dbRes.notes?.[key] || [])];
    });
    const pyp = {
      mid:    [...(sub.resources?.pyp?.mid    || []), ...(dbRes.previous_papers?.mid    || [])],
      endsem: [...(sub.resources?.pyp?.endsem || []), ...(dbRes.previous_papers?.endsem || [])],
    };
    const lab = sub.resources?.lab !== null ? { files: [...(sub.resources?.lab?.files || []), ...(dbRes.lab_manuals?.files || [])] } : null;
    return { ...sub, resources: { ...sub.resources, theory, pyp, lab } };
  }), [subjects, supaRes]);

  const filtered = useMemo(() => {
    if (activeFilter === "pyp") return subjectsWithRes.filter((s) => s.resources?.pyp?.mid?.length || s.resources?.pyp?.endsem?.length);
    if (activeFilter === "lab") return subjectsWithRes.filter((s) => s.resources?.lab !== null);
    return subjectsWithRes;
  }, [subjectsWithRes, activeFilter]);

  return (
    <section id="resources">
      <div className="sec-label">01 · Academic Resources</div>
      <div className="res-controls">
        <div>
          <h2 className="sec-title">Study Vault.</h2>
          <p className="sec-sub" style={{ marginBottom: 0 }}>Select regulation, branch &amp; sem — or search globally.</p>
        </div>
        <input type="search" className="search-input" style={{ maxWidth: 340 }} placeholder="Search subject or code… (Ctrl+K)" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search subjects" />
      </div>
      <div className="reg-row">
        <span className="reg-label">REG:</span>
        {["R22A", "R21A"].map((r) => <button key={r} className={`reg-btn ${activeReg === r ? "active" : ""}`} onClick={() => setReg(r)} aria-pressed={activeReg === r}>{r}</button>)}
      </div>
      <div className="branch-grid" role="group" aria-label="Branch selection">
        {BRANCHES.map((b) => <button key={b.code} className={`branch-btn ${activeBranch === b.code ? "active" : ""}`} onClick={() => setBranch(b.code)} aria-pressed={activeBranch === b.code}>{b.code}</button>)}
      </div>
      <div className="sem-tabs" role="group" aria-label="Semester selection">
        {SEMS.map((s) => <button key={s} className={`sem-tab ${activeSem === s ? "active" : ""}`} onClick={() => setSem(s)} aria-pressed={activeSem === s}>Sem {s}</button>)}
      </div>
      <div className="filter-chips" role="group" aria-label="Resource filter">
        {FILTERS.map((f) => <button key={f.key} className={`chip ${activeFilter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)} aria-pressed={activeFilter === f.key}>{f.label}</button>)}
        {loadingRes && <span style={{ fontSize: ".72rem", color: "var(--g4)", marginLeft: 8 }} aria-live="polite">Loading…</span>}
        {loadError  && <span style={{ fontSize: ".72rem", color: "var(--red)", marginLeft: 8 }} role="alert">{loadError}</span>}
      </div>
      <div id="pyp" style={{ position: "relative", top: -80 }} />
      <div id="lab-manuals" style={{ position: "relative", top: -80 }} />
      <div id="cgpa" style={{ position: "relative", top: -80 }} />
      {filtered.length === 0
        ? <EmptyState activeFilter={activeFilter} loading={loadingRes} />
        : <div className="subject-list">{filtered.map((subject, i) => <SubjectCard key={`${subject.code}_${i}`} subject={subject} index={i} isAdmin={!!isAdmin} onReload={loadResources} branch={activeBranch} semester={activeSem} />)}</div>
      }
    </section>
  );
}

function EmptyState({ activeFilter, loading }) {
  const setModalOpen = useUIStore((s) => s.setModalOpen);
  if (loading) return null;
  return (
    <div style={{ textAlign: "center", padding: "52px 20px", color: "var(--g4)", border: "1px dashed var(--g3)", borderRadius: 5, fontSize: ".88rem" }} role="status" aria-live="polite">
      {activeFilter !== "all"
        ? <><>{`No ${activeFilter.replace("_", " ")} resources uploaded yet.`}</><br /><button className="btn btn-outline" style={{ marginTop: 12, padding: "8px 16px", fontSize: ".78rem" }} onClick={() => setModalOpen("contribute", true)}>Contribute Resources +</button></>
        : "No subjects found for this selection."}
    </div>
  );
}
