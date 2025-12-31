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
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold border-b-2 border-red-500 inline-block pb-1">
            HTTP Request & Response Explorer
          </h1>
          <p className="text-neutral-400 mt-2">
            Inspect HTTP requests and responses directly from the browser
          </p>
        </header>

        {/* Request Panel */}
        <section className="border border-neutral-700 rounded-md p-5 space-y-5">
          <h2 className="text-xl font-medium">Request</h2>

          {/* URL */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://httpbin.org/get"
              className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">
              Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className="rounded bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-red-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </div>

          {/* Headers */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">
              Headers <span className="normal-case">(Key: Value)</span>
            </label>
            <textarea
              value={rawHeaders}
              onChange={(e) => setRawHeaders(e.target.value)}
              rows={4}
              placeholder="Content-Type: application/json"
              className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm font-mono focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Body */}
          {method === "POST" && (
            <div>
              <label className="block text-xs uppercase tracking-wide text-neutral-400 mb-1">
                Request Body <span className="normal-case">(JSON)</span>
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={6}
                placeholder='{"hello":"world"}'
                className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={sendRequest}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 transition disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium"
          >
            {isLoading ? "Sending..." : "Send Request"}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </section>

        {/* Response Panel */}
        <section className="border border-neutral-700 rounded-md p-5 space-y-5">
          <h2 className="text-xl font-medium">Response</h2>

          <div className="flex gap-6 text-sm">
            {status !== null && (
              <span className="font-medium">
                Status: <span className="text-red-400">{status}</span>
              </span>
            )}
            {responseTime !== null && <span>Time: {responseTime} ms</span>}
          </div>

          {responseHeaders && (
            <div>
              <h3 className="text-xs uppercase tracking-wide text-neutral-400 mb-1">
                Headers
              </h3>
              <pre className="bg-neutral-800 border border-neutral-700 rounded p-4 text-xs leading-relaxed overflow-auto">
                {JSON.stringify(responseHeaders, null, 2)}
              </pre>
            </div>
          )}

          {responseBody && (
            <div>
              <h3 className="text-xs uppercase tracking-wide text-neutral-400 mb-1">
                Body
              </h3>
              <pre className="bg-neutral-800 border border-neutral-700 rounded p-4 text-xs leading-relaxed overflow-auto max-h-[400px]">
                {responseBody}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
