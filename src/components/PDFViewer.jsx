import { useState, useEffect, useRef } from "react";
import { useUIStore, usePDFStore } from "../store/useStore";

export default function PDFViewer() {
  const pdfViewer  = useUIStore((s) => s.pdfViewer);   // { title, url, id } | null
  const closePDF   = useUIStore((s) => s.closePDF);

  const setNote    = usePDFStore((s) => s.setNote);
  const getNote    = usePDFStore((s) => s.getNote);
  const addBM      = usePDFStore((s) => s.addBookmark);
  const deleteBM   = usePDFStore((s) => s.deleteBookmark);
  const getBMs     = usePDFStore((s) => s.getBookmarks);

  const [noteSaved, setNoteSaved]   = useState(false);
  const [bmNote, setBmNote]         = useState("");
  const [allNighter, setAllNighter] = useState(false);

  // Timer state
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const id = pdfViewer?.id;

  // Save note with debounce
  const noteTimeout = useRef(null);
  function handleNoteChange(e) {
    const v = e.target.value;
    setNote(id, v);
    clearTimeout(noteTimeout.current);
    noteTimeout.current = setTimeout(() => { setNoteSaved(true); setTimeout(() => setNoteSaved(false), 1200); }, 600);
  }

  // Timer
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            alert("Focus session complete! 🎉");
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  function setPreset(m) { clearInterval(timerRef.current); setRunning(false); setSeconds(m * 60); }
  function resetTimer() { clearInterval(timerRef.current); setRunning(false); setSeconds(25 * 60); }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // All-nighter fullscreen
  function toggleAllNighter() {
    const next = !allNighter;
    setAllNighter(next);
    if (next) document.documentElement.requestFullscreen?.().catch(() => {});
    else if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  }

  // Cleanup on close
  function handleClose() {
    clearInterval(timerRef.current);
    setRunning(false);
    setSeconds(25 * 60);
    setAllNighter(false);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    closePDF();
  }

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && pdfViewer) handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pdfViewer]);

  if (!pdfViewer) return null;

  const bookmarks = getBMs(id);
  const note      = getNote(id);

  return (
    <div
      className="modal-overlay open"
      style={{ padding: allNighter ? 0 : 10 }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal-box" style={{
        maxWidth: allNighter ? "100vw" : 1100,
        maxHeight: allNighter ? "100vh" : "95vh",
        padding: 0,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
        borderRadius: allNighter ? 0 : 8,
        border: allNighter ? "none" : undefined,
      }}>

        {/* ── LEFT: iframe ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div className="viewer-header">
            <div className="viewer-title-text">
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>{pdfViewer.title}</span>
            </div>
            <div className="viewer-tools">
              <button
                className={`vtool-btn ${allNighter ? "active" : ""}`}
                onClick={toggleAllNighter}
              >
                {allNighter ? "☀️ Exit" : "🌙 All-Nighter"}
              </button>
              {pdfViewer.url && pdfViewer.url !== "#" && (
                <a href={pdfViewer.url} target="_blank" rel="noreferrer"
                  className="vtool-btn" style={{ textDecoration: "none" }}>
                  Open ↗
                </a>
              )}
              <button className="vtool-btn" onClick={handleClose}>✕ Close</button>
            </div>
          </div>

          <iframe
            src={pdfViewer.url && pdfViewer.url !== "#" ? pdfViewer.url : "about:blank"}
            style={{ flex: 1, border: "none", width: "100%", minHeight: 300, background: "#fff" }}
            title={pdfViewer.title}
          />
        </div>

        {/* ── RIGHT: sidebar (hidden in all-nighter) ── */}
        {!allNighter && (
          <div className="viewer-right">

            {/* Timer */}
            <div className="vr-section">
              <div className="vr-title">Focus Timer</div>
              <div className="timer-disp">{fmt(seconds)}</div>
              <div className="timer-btns">
                <button onClick={() => setRunning(true)}  disabled={running}>▶</button>
                <button onClick={() => setRunning(false)} disabled={!running}>⏸</button>
                <button onClick={resetTimer}>↺</button>
              </div>
              <div className="timer-preset">
                {[25, 45, 60, 90].map((m) => (
                  <button key={m} onClick={() => setPreset(m)}>{m}m</button>
                ))}
              </div>
            </div>

            {/* Bookmarks */}
            <div className="vr-section">
              <div className="vr-title">
                Bookmarks
                <span style={{ color: "var(--g5)", fontSize: ".65rem" }}>
                  {bookmarks.length > 0 ? ` (${bookmarks.length})` : ""}
                </span>
              </div>
              <div className="bookmarks-list">
                {bookmarks.length === 0
                  ? <p style={{ fontSize: ".72rem", color: "var(--g4)" }}>No bookmarks yet.</p>
                  : bookmarks.map((b, i) => (
                    <div key={i} className="bookmark-item">
                      <span title={b.ts}>🔖 {b.note}</span>
                      <button className="bm-del" onClick={() => deleteBM(id, i)}>✕</button>
                    </div>
                  ))
                }
              </div>
              <div className="bm-add-row" style={{ marginTop: 8 }}>
                <input
                  className="form-input"
                  placeholder="Bookmark note…"
                  style={{ flex: 1, padding: "6px 8px", fontSize: ".75rem" }}
                  value={bmNote}
                  onChange={(e) => setBmNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && bmNote.trim()) {
                      addBM(id, bmNote.trim()); setBmNote("");
                    }
                  }}
                />
                <button className="vtool-btn" onClick={() => {
                  if (bmNote.trim()) { addBM(id, bmNote.trim()); setBmNote(""); }
                }}>Add</button>
              </div>
            </div>

            {/* Notes */}
            <div className="vr-section" style={{ flex: 1, display: "flex", flexDirection: "column", borderBottom: "none" }}>
              <div className="vr-title">
                Notes
                {noteSaved && <span style={{ color: "var(--green)", fontSize: ".65rem", marginLeft: 8 }}>✓ Saved</span>}
              </div>
              <textarea
                className="notes-area"
                placeholder="Your notes auto-save per document…"
                defaultValue={note}
                onChange={handleNoteChange}
                style={{ flex: 1, minHeight: 120 }}
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
