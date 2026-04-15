const API_BASE = "https://backend-cs-treelogy.vercel.app";

/**
 * POST /api/query — standard JSON response
 */
export async function queryWellness(question) {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * POST /api/query/stream — SSE streaming response
 * Returns a ReadableStream of parsed SSE events.
 */
export async function queryWellnessStream(question, { onToken, onMetadata, onSources, onDisclaimer, onDone, onError, onStages, onStage }) {
  const res = await fetch(`${API_BASE}/api/query/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Stream request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (!raw) continue;

      try {
        const event = JSON.parse(raw);
        switch (event.type) {
          case "stages":
            onStages?.(event.data);
            break;
          case "stage":
            onStage?.(event.data);
            break;
          case "metadata":
            onMetadata?.(event.data);
            break;
          case "token":
            onToken?.(event.data);
            break;
          case "sources":
            onSources?.(event.data);
            break;
          case "disclaimer":
            onDisclaimer?.(event.data);
            break;
          case "done":
            onDone?.();
            break;
          case "error":
            onError?.(event.data);
            break;
        }
      } catch {
        // skip malformed JSON lines
      }
    }
  }
}

/**
 * POST /api/ingest/file — upload a PDF or DOCX to the knowledge base
 */
export async function uploadKnowledgeDocument(file) {
  const formData = new FormData();
  formData.append("document", file);

  const res = await fetch(`${API_BASE}/api/ingest/file`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * GET /api/health — check backend status
 */
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error("Backend unhealthy");
  return res.json();
}

/**
 * GET /api/audit — retrieve audit logs
 */
export async function getAuditLogs({ sourceType, verified, limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (sourceType) params.set("sourceType", sourceType);
  if (verified !== undefined) params.set("verified", String(verified));
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  const res = await fetch(`${API_BASE}/api/audit?${params}`);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}
