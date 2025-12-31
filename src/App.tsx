import { useState } from "react";

type HttpMethod = "GET" | "POST";

function App() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<HttpMethod>("GET");

  const [rawHeaders, setRawHeaders] = useState("");
  const [requestBody, setRequestBody] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<
    string,
    string
  > | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);

  const parseHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {};

    rawHeaders
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const [key, ...rest] = line.split(":");
        if (!key || rest.length === 0) return;
        headers[key.trim()] = rest.join(":").trim();
      });

    return headers;
  };

  const sendRequest = async () => {
    if (!url) {
      setError("URL is required");
      return;
    }

    setError(null);
    setStatus(null);
    setResponseTime(null);
    setResponseHeaders(null);
    setResponseBody(null);
    setIsLoading(true);

    try {
      const start = performance.now();

      const response = await fetch(url, {
        method,
        headers: parseHeaders(),
        body: method === "POST" && requestBody ? requestBody : undefined,
      });

      const end = performance.now();

      setStatus(response.status);
      setResponseTime(Math.round(end - start));

      const headersObj: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      setResponseHeaders(headersObj);

      const text = await response.text();

      try {
        const json = JSON.parse(text);
        setResponseBody(JSON.stringify(json, null, 2));
      } catch {
        setResponseBody(text);
      }
    } catch {
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

      <div style={{ marginBottom: "12px" }}>
        <label>
          Headers (one per line, Key: Value)
          <textarea
            value={rawHeaders}
            onChange={(e) => setRawHeaders(e.target.value)}
            rows={4}
            style={{ width: "100%", marginTop: "4px" }}
            placeholder="Content-Type: application/json"
          />
        </label>
      </div>

      {method === "POST" && (
        <div style={{ marginBottom: "12px" }}>
          <label>
            Request Body (JSON)
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              rows={6}
              style={{ width: "100%", marginTop: "4px" }}
              placeholder='{"hello":"world"}'
            />
          </label>
        </div>
      )}

      <button onClick={sendRequest} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Request"}
      </button>

      {status !== null && (
        <p style={{ marginTop: "12px" }}>Status Code: {status}</p>
      )}

      {responseTime !== null && <p>Response Time: {responseTime} ms</p>}

      {error && <p style={{ marginTop: "12px", color: "red" }}>{error}</p>}

      {responseHeaders && (
        <div style={{ marginTop: "16px" }}>
          <h3>Response Headers</h3>
          <pre>{JSON.stringify(responseHeaders, null, 2)}</pre>
        </div>
      )}

      {responseBody && (
        <div style={{ marginTop: "16px" }}>
          <h3>Response Body</h3>
          <pre>{responseBody}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
