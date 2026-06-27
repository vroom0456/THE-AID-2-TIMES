
// ─────────────────────────────────────────────
// FILE: src/components/profile/ImageCropper.jsx
// Modal that lets a user crop a profile photo to a
// square before it's ever uploaded. Flow:
//   raw file → crop (this modal) → onCropped(file)
// The raw file is NEVER uploaded directly.
// ─────────────────────────────────────────────
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImageFile } from "./cropImage";

export default function ImageCropper({ imageSrc, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels, 512);
      onConfirm(file);
    } finally {
      setSaving(false);
    }
  }, [imageSrc, croppedAreaPixels, onConfirm]);

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-label="Crop profile photo"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="modal-box" style={{ maxWidth: 480 }}>
        <button className="modal-close" onClick={onCancel} aria-label="Cancel crop">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <div className="modal-title">Crop Photo</div>
        <div className="modal-sub">Drag to reposition, scroll or use the slider to zoom.</div>

        <div style={{ position: "relative", width: "100%", height: 320, background: "#111", borderRadius: 8, overflow: "hidden", marginTop: 14 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <span style={{ fontSize: ".72rem", color: "var(--g4)", fontFamily: "var(--fm)" }}>Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ flex: 1 }}
            aria-label="Zoom"
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={handleConfirm} disabled={saving || !croppedAreaPixels}>
            {saving ? "Saving…" : "Use Photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
