import { useMemo, useState } from "react";

export default function App() {
  const defaultPath = useMemo(() => {
    // You can change this later to a file picker via Electron dialog.
    return "C:\\source\\repos\\RaalnanUno\\DBForge\\data\\dbforge.sqlite";
  }, []);

  const [dbPath, setDbPath] = useState(defaultPath);
  const [status, setStatus] = useState<string>("No database opened yet.");
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const openDb = async () => {
    setError(null);
    setStatus("Opening...");
    setTables([]);

    const resp = await window.dbforge.openDb(dbPath);
    if (!resp.ok) {
      setError(resp.error ?? "Failed to open DB");
      setStatus("Failed");
      return;
    }

    setStatus(`Opened: ${resp.dbPath}`);
  };

  const refreshTables = async () => {
    setError(null);
    const resp = await window.dbforge.listTables();
    if (!resp.ok) {
      setError(resp.error ?? "Failed to list tables");
      return;
    }
    setTables(resp.tables ?? []);
  };

  return (
    <div style={{ padding: 16, fontFamily: "Segoe UI, Arial, sans-serif" }}>
      <h2>DBForge</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Database path</label>
        <input
          value={dbPath}
          onChange={(e) => setDbPath(e.target.value)}
          style={{ width: 680, padding: 8 }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={openDb}>Open / Create DB</button>
        <button onClick={refreshTables}>List Tables</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Status:</strong> {status}
      </div>

      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <h3>Tables</h3>
      {tables.length === 0 ? (
        <div>(none yet)</div>
      ) : (
        <ul>
          {tables.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}