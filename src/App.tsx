import { useState } from "react";

type HttpMethod = "GET" | "POST";

function App() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<HttpMethod>("GET");

  return (
    <div style={{ padding: "16px", fontFamily: "sans-serif" }}>
      <h1>HTTP Request & Response Explorer</h1>

      <div>
        <label>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ width: "100%", marginTop: "4px" }}
            placeholder="https://httpbin.org/get"
          />
        </label>
      </div>

      <div style={{ marginTop: "12px" }}>
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
    </div>
  );
}

export default App;
