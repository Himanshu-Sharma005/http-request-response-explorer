import { useState } from "react";

type HttpMethod = "GET" | "POST";

function App() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<HttpMethod>("GET");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = async () => {
    if (!url) {
      setError("URL is required");
      return;
    }

    setError(null);
    setStatus(null);
    setIsLoading(true);

    try {
      const start = performance.now();

      const response = await fetch(url, {
        method,
      });

      const end = performance.now();

      setStatus(response.status);
      console.log("Response time (ms):", Math.round(end - start));
    } catch (err) {
      setError("Failed to fetch. Check URL or CORS.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px", fontFamily: "sans-serif" }}>
      <h1>HTTP Request & Response Explorer</h1>

      <div style={{ marginBottom: "12px" }}>
        <label>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://httpbin.org/get"
            style={{ width: "100%", marginTop: "4px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>
          Method:
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            style={{ marginLeft: "8px" }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </label>
      </div>

      <div>
        <button onClick={sendRequest} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Request"}
        </button>
      </div>

      {status !== null && (
        <p style={{ marginTop: "12px" }}>Status Code: {status}</p>
      )}

      {error && <p style={{ marginTop: "12px", color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
