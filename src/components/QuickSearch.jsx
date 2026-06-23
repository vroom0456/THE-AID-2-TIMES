
// ─────────────────────────────────────────────
// FILE: src/components/QuickSearch.jsx  (Ctrl+K)
// ─────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { SUBJECTS } from "../data/curriculum";
import { useUIStore } from "../store/useStore";

export function QuickSearch() {
  const setKBOpen = useUIStore((s) => s.setKBOpen);
  const setReg    = useUIStore((s) => s.setReg);
  const setBranch = useUIStore((s) => s.setBranch);
  const setSem    = useUIStore((s) => s.setSem);

  const [query, setQuery] = useState("");
  const [sel, setSel]     = useState(0);
  const inputRef          = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const results = query.trim().length < 1 ? [] : (() => {
    const q = query.toLowerCase();
    const out = [];
    for (const r in SUBJECTS)
      for (const b in SUBJECTS[r])
        for (const s in SUBJECTS[r][b])
          SUBJECTS[r][b][s].forEach((sub) => {
            if (sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q))
              out.push({ sub, r, b, s });
          });
    return out.slice(0, 8);
  })();

  function select(item) {
    setReg(item.r); setBranch(item.b); setSem(item.s);
    setKBOpen(false);
    // scroll after render
    setTimeout(() => {
      document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  function onKey(e) {
    if (e.key === "ArrowDown") setSel((s) => Math.min(s + 1, results.length - 1));
    if (e.key === "ArrowUp")   setSel((s) => Math.max(s - 1, 0));
    if (e.key === "Enter" && results[sel]) select(results[sel]);
  }

  return (
    <div id="kbOverlay" className="show" onClick={(e) => { if (e.target.id === "kbOverlay") setKBOpen(false); }}>
      <div className="kb-box">
        <div className="kb-input-wrap">
          <span className="kb-search-icon">🔍</span>
          <input
            ref={inputRef}
            className="kb-input"
            placeholder="Type subject name or code…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSel(0); }}
            onKeyDown={onKey}
          />
          <span style={{ fontFamily:"var(--fm)", fontSize:".65rem", color:"var(--g4)" }}>ESC</span>
        </div>

        <div className="kb-results">
          {results.length === 0 && query.trim().length > 0 && (
            <div style={{ padding:"16px 20px", fontSize:".82rem", color:"var(--g4)" }}>No subjects found.</div>
          )}
          {results.map((it, i) => (
            <div
              key={i}
              className={`kb-result-item ${i === sel ? "selected" : ""}`}
              onClick={() => select(it)}
              onMouseEnter={() => setSel(i)}
            >
              <div>
                <div className="kb-result-name">{it.sub.name}</div>
                <div className="kb-result-meta">{it.r} · {it.b} · Sem {it.s} · {it.sub.code}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="kb-hint">↑↓ navigate · Enter to jump · Esc to close</div>
      </div>
    </div>
  );
}
