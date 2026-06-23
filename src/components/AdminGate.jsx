import { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";

export default function AdminGate() {
  const login = useAdminStore((s) => s.login);
  const loading = useAdminStore((s) => s.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const result = await login(email, password);

    if (!result.success) {
      alert(result.message);
      return;
    }

    document
      .getElementById("adminGate")
      ?.classList.remove("open");
  }

  return (
    <div id="adminGate" className="modal-overlay">
      <div
        className="modal-box"
        style={{
          maxWidth: 420,
        }}
      >
        <h2>Admin Login</h2>

        <div className="form-row">
          <input
            className="form-input"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className="form-row">
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>
      </div>
    </div>
  );
}
