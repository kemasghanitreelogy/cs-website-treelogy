import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  FileText,
  Upload,
  X,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Activity,
  Database,
  Trash2,
  FileSearch,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import {
  queryWellnessStream,
  uploadKnowledgeDocument,
  checkHealth,
  listKnowledgeDocuments,
  deleteKnowledgeDocument,
} from "../lib/wellnessApi";

/* ─── Suggested Questions ─── */

const SUGGESTED_QUESTIONS = {
  id: [
    "Apa manfaat utama moringa untuk kesehatan?",
    "Bagaimana dosis yang tepat untuk kapsul moringa?",
    "Apakah moringa aman untuk ibu hamil?",
    "Apa perbedaan powder dan kapsul moringa?",
    "Bagaimana cara menyimpan produk moringa?",
    "Apa efek samping moringa yang perlu diketahui?",
  ],
  en: [
    "What are the main health benefits of moringa?",
    "What is the correct dosage for moringa capsules?",
    "Is moringa safe during pregnancy?",
    "What is the difference between moringa powder and capsules?",
    "How should I store moringa products?",
    "What side effects of moringa should I know about?",
  ],
};

/* ─── Source Badge ─── */

function SourceBadge({ type }) {
  if (type === "internal") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-light text-green">
        <Database className="w-3 h-3" />
        Knowledge Base
      </span>
    );
  }
  if (type === "web") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 text-blue-600">
        <ExternalLink className="w-3 h-3" />
        Web Search
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-50 text-amber-600">
      <AlertTriangle className="w-3 h-3" />
      General
    </span>
  );
}

/* ─── Layered Loading State ─── */

function LayerProgress({ stages, lang }) {
  if (!stages || stages.length === 0) {
    // Pre-stage "connecting" shimmer while we wait for the backend's plan.
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-muted">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green" />
          </span>
          {lang === "id" ? "Menghubungkan ke asisten..." : "Connecting to assistant..."}
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-card-hover">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-green to-transparent animate-[shimmer_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  const doneCount = stages.filter((s) => s.status === "done").length;
  const pct = Math.round((doneCount / stages.length) * 100);

  return (
    <div className="space-y-3">
      {/* Top progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-card-hover overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green/70 via-green to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] font-medium text-muted tabular-nums w-8 text-right">{pct}%</span>
      </div>

      {/* Vertical stage list */}
      <ol className="space-y-1.5">
        {stages.map((s, i) => {
          const label = lang === "id" ? s.label_id || s.label_en : s.label_en || s.label_id;
          const isActive = s.status === "active";
          const isDone = s.status === "done";
          return (
            <li
              key={s.id}
              className="flex items-center gap-2.5 transition-all duration-300"
              style={{
                opacity: isActive || isDone ? 1 : 0.45,
                transform: isActive ? "translateX(2px)" : "translateX(0)",
              }}
            >
              {/* Node */}
              <span className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                {isDone ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green text-white shadow-sm transition-all duration-300">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                ) : isActive ? (
                  <>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green/40 animate-ping" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green shadow-[0_0_0_3px_rgba(34,197,94,0.15)]" />
                  </>
                ) : (
                  <span className="inline-flex h-2.5 w-2.5 rounded-full border border-muted/30 bg-transparent" />
                )}
              </span>

              {/* Label */}
              <span
                className={`text-xs leading-relaxed transition-colors duration-300 ${
                  isActive ? "text-text font-medium" : isDone ? "text-muted line-through decoration-green/40" : "text-muted/70"
                }`}
              >
                {label}
              </span>

              {/* Active tail shimmer */}
              {isActive && (
                <span className="ml-1 inline-flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-1.5 bg-green rounded-full animate-[bounce_0.9s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-2.5 bg-green rounded-full animate-[bounce_0.9s_ease-in-out_0.15s_infinite]" />
                  <span className="w-0.5 h-2 bg-green rounded-full animate-[bounce_0.9s_ease-in-out_0.3s_infinite]" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ─── Chat Message ─── */

function ChatMessage({ message, lang }) {
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = message.content;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 px-4">
        <div className="max-w-[85%] sm:max-w-[70%]">
          <div className="bg-green text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-green-light flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-green" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green/20 to-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot className="w-4 h-4 text-green" />
      </div>
      <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
        {/* Metadata badges */}
        {message.metadata && (
          <div className="flex items-center gap-2 flex-wrap">
            <SourceBadge type={message.metadata.sourceType} />
            {message.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-green-light text-green">
                <Shield className="w-3 h-3" />
                {lang === "id" ? "Terverifikasi" : "Verified"}
              </span>
            )}
          </div>
        )}

        {/* Layered generation progress — visible while streaming and content hasn't arrived yet,
            or always while the assistant is still thinking (no content yet). */}
        {message.streaming && !message.content && (
          <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
            <LayerProgress stages={message.stages} lang={lang} />
          </div>
        )}

        {/* Message content */}
        {(message.content || !message.streaming) && (
          <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{message.content}</p>
            {message.streaming && (
              <span className="inline-block w-1.5 h-4 bg-green/60 animate-pulse rounded-sm ml-0.5 -mb-0.5" />
            )}
          </div>
        )}

        {/* Disclaimer */}
        {message.disclaimer && (
          <div className="flex items-start gap-2 px-3 py-2 bg-amber-50/50 border border-amber-200/50 rounded-xl">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-amber-700 leading-relaxed">{message.disclaimer}</p>
          </div>
        )}

        {/* Sources */}
        {message.sources?.length > 0 && (
          <div>
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1 text-[11px] text-muted hover:text-text transition-colors cursor-pointer"
            >
              {showSources ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <BookOpen className="w-3 h-3" />
              {message.sources.length} {lang === "id" ? "sumber" : "sources"}
            </button>
            {showSources && (
              <div className="mt-1.5 space-y-1">
                {message.sources.map((src, i) => (
                  <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 bg-card-hover/60 rounded-lg">
                    <FileText className="w-3 h-3 text-muted/50 flex-shrink-0" />
                    <span className="text-[11px] text-muted truncate">{src.name || src.reference}</span>
                    {src.reference?.startsWith("http") && (
                      <a
                        href={src.reference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green hover:text-green/80 flex-shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ready-to-copy customer reply button */}
        {!message.streaming && message.content && (
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              copied
                ? "text-green bg-green-light border-green/30"
                : "text-green bg-green-light/60 border-green/20 hover:bg-green-light hover:border-green/40"
            }`}
            title={lang === "id" ? "Salin balasan siap kirim ke pelanggan" : "Copy reply ready to send to customer"}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                {lang === "id" ? "Tersalin — siap kirim" : "Copied — ready to send"}
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                {lang === "id" ? "Salin balasan untuk pelanggan" : "Copy reply for customer"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── PDF Upload Panel ─── */

function KnowledgeUploadPanel({ lang }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [docs, setDocs] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  const fetchDocs = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const data = await listKnowledgeDocuments();
      setDocs(data.documents || data.files || data.items || []);
      setStats(data.stats || data.summary || null);
    } catch (err) {
      setDocs([]);
      setError(err.message);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const data = await uploadKnowledgeDocument(file);
      setResult(data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDocs();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteKnowledgeDocument(id);
      setDocs((prev) => (prev || []).filter((d) => (d.id || d.name) !== id));
      fetchDocs();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(d);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-green-light flex items-center justify-center">
          <Database className="w-4 h-4 text-green" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text">
            {lang === "id" ? "Basis Pengetahuan" : "Knowledge Base"}
          </h3>
          <p className="text-[11px] text-muted">
            {lang === "id" ? "Upload PDF/DOCX untuk melatih AI" : "Upload PDF/DOCX to train the AI"}
          </p>
        </div>
      </div>

      <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-green/40 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setResult(null);
            setError(null);
          }}
          className="hidden"
          id="pdf-upload"
        />
        <label htmlFor="pdf-upload" className="cursor-pointer space-y-2 block">
          <Upload className="w-8 h-8 text-muted/30 mx-auto" />
          <p className="text-xs text-muted">
            {lang === "id" ? "Klik untuk upload PDF atau DOCX (maks 20MB)" : "Click to upload PDF or DOCX (max 20MB)"}
          </p>
        </label>
      </div>

      {file && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-green-light/30 border border-green/20 rounded-lg">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-green flex-shrink-0" />
            <span className="text-xs text-text truncate">{file.name}</span>
            <span className="text-[10px] text-muted flex-shrink-0">
              ({(file.size / 1024 / 1024).toFixed(1)} MB)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="p-1 text-muted hover:text-red-500 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-green text-white hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {lang === "id" ? "Memproses..." : "Processing..."}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {lang === "id" ? "Upload & Proses" : "Upload & Process"}
            </>
          )}
        </button>
      )}

      {result && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-green-light/50 border border-green/20 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-green mt-0.5 flex-shrink-0" />
          <div className="text-xs text-green-800">
            <p className="font-medium">{lang === "id" ? "Berhasil diproses!" : "Successfully processed!"}</p>
            <p className="text-green-600 mt-0.5">
              {result.chunks} chunks, {result.pages} {lang === "id" ? "halaman" : "pages"}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* ── Uploaded Knowledge Documents ── */}
      <div className="pt-2 border-t border-border space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FileSearch className="w-3.5 h-3.5 text-muted" />
            <h4 className="text-xs font-semibold text-text">
              {lang === "id" ? "Dokumen Tersimpan" : "Stored Documents"}
            </h4>
            {docs && (
              <span className="text-[10px] text-muted px-1.5 py-0.5 bg-card-hover rounded-full tabular-nums">
                {docs.length}
              </span>
            )}
          </div>
          <button
            onClick={fetchDocs}
            disabled={loadingDocs}
            className="p-1 text-muted hover:text-text rounded-md hover:bg-card-hover disabled:opacity-40 cursor-pointer"
            title={lang === "id" ? "Muat ulang" : "Refresh"}
          >
            <RefreshCw className={`w-3 h-3 ${loadingDocs ? "animate-spin" : ""}`} />
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-1.5">
            {stats.totalChunks != null && (
              <div className="px-2 py-1.5 bg-card-hover/50 rounded-lg">
                <div className="text-[10px] text-muted">{lang === "id" ? "Total chunks" : "Total chunks"}</div>
                <div className="text-xs font-semibold text-text tabular-nums">{stats.totalChunks}</div>
              </div>
            )}
            {stats.totalDocuments != null && (
              <div className="px-2 py-1.5 bg-card-hover/50 rounded-lg">
                <div className="text-[10px] text-muted">{lang === "id" ? "Total dokumen" : "Total documents"}</div>
                <div className="text-xs font-semibold text-text tabular-nums">{stats.totalDocuments}</div>
              </div>
            )}
          </div>
        )}

        {loadingDocs && !docs && (
          <div className="flex items-center gap-2 text-[11px] text-muted py-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            {lang === "id" ? "Memuat dokumen..." : "Loading documents..."}
          </div>
        )}

        {docs && docs.length === 0 && !loadingDocs && (
          <div className="flex flex-col items-center gap-1 py-4 text-center">
            <FileText className="w-6 h-6 text-muted/30" />
            <p className="text-[11px] text-muted/60">
              {lang === "id" ? "Belum ada dokumen yang diunggah" : "No documents uploaded yet"}
            </p>
          </div>
        )}

        {docs && docs.length > 0 && (
          <ul className="space-y-1 max-h-60 overflow-y-auto pr-1 faq-scroll">
            {docs.map((d, i) => {
              const id = d.id || d.name || d.path || i;
              const name = d.name || d.filename || d.title || d.path?.split("/").pop() || `Document ${i + 1}`;
              const chunks = d.chunks ?? d.chunkCount ?? d.chunk_count;
              const size = d.size ?? d.bytes;
              const uploaded = d.uploadedAt || d.createdAt || d.created_at || d.uploaded_at;
              const isDeleting = deletingId === id;
              return (
                <li
                  key={id}
                  className="group flex items-start gap-2 px-2.5 py-2 bg-card-hover/40 hover:bg-card-hover/80 border border-transparent hover:border-border/60 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 rounded-md bg-green-light/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-3 h-3 text-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-text truncate" title={name}>{name}</p>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      {chunks != null && (
                        <span className="text-[10px] text-muted">{chunks} chunks</span>
                      )}
                      {size != null && (
                        <span className="text-[10px] text-muted">· {formatBytes(size)}</span>
                      )}
                      {uploaded && (
                        <span className="text-[10px] text-muted/70">· {formatDate(uploaded)}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(id)}
                    disabled={isDeleting}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-red-500 rounded-md transition-opacity disabled:opacity-50 cursor-pointer"
                    title={lang === "id" ? "Hapus" : "Delete"}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─── Backend Status Indicator ─── */

function BackendStatus({ lang }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;
    checkHealth()
      .then(() => { if (!cancelled) setStatus("online"); })
      .catch(() => { if (!cancelled) setStatus("offline"); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${
        status === "online" ? "bg-green animate-pulse" : status === "offline" ? "bg-red-400" : "bg-amber-400 animate-pulse"
      }`} />
      <span className="text-[10px] text-muted">
        {status === "online"
          ? (lang === "id" ? "AI Aktif" : "AI Online")
          : status === "offline"
            ? (lang === "id" ? "AI Offline" : "AI Offline")
            : (lang === "id" ? "Memeriksa..." : "Checking...")}
      </span>
    </div>
  );
}

/* ─── Main Page ─── */

export default function AIFaqPage() {
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(async (text) => {
    const question = (text || input).trim();
    if (!question || isStreaming) return;

    setInput("");
    const userMsg = { id: Date.now(), role: "user", content: question };
    const assistantId = Date.now() + 1;
    const assistantMsg = {
      id: assistantId,
      role: "assistant",
      content: "",
      streaming: true,
      metadata: null,
      sources: [],
      disclaimer: null,
      verified: false,
      stages: null,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    try {
      await queryWellnessStream(question, {
        onStages: (plan) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, stages: plan.map((s) => ({ ...s, status: "pending" })) }
                : m
            )
          );
        },
        onStage: (update) => {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantId) return m;
              const existing = m.stages || [];
              const idx = existing.findIndex((s) => s.id === update.id);
              let next;
              if (idx === -1) {
                // Dynamically inserted stage (e.g. search_web).
                const insertIdx = update.insertAfter
                  ? existing.findIndex((s) => s.id === update.insertAfter) + 1
                  : existing.length;
                const newStage = {
                  id: update.id,
                  label_en: update.label_en,
                  label_id: update.label_id,
                  status: update.status,
                };
                next = [...existing.slice(0, insertIdx), newStage, ...existing.slice(insertIdx)];
              } else {
                next = existing.map((s, i) => (i === idx ? { ...s, status: update.status } : s));
              }
              return { ...m, stages: next };
            })
          );
        },
        onMetadata: (data) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, metadata: data } : m
            )
          );
        },
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + token } : m
            )
          );
        },
        onSources: (sources) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, sources } : m
            )
          );
        },
        onDisclaimer: (disclaimer) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, disclaimer } : m
            )
          );
        },
        onDone: () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, streaming: false, verified: true } : m
            )
          );
        },
        onError: (error) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content: lang === "id"
                      ? `Maaf, terjadi kesalahan: ${error}`
                      : `Sorry, an error occurred: ${error}`,
                    streaming: false,
                  }
                : m
            )
          );
        },
      });
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: lang === "id"
                  ? "Maaf, gagal terhubung ke server AI. Silakan coba lagi."
                  : "Sorry, failed to connect to the AI server. Please try again.",
                streaming: false,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }, [input, isStreaming, lang]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  const suggestions = SUGGESTED_QUESTIONS[lang] || SUGGESTED_QUESTIONS.en;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
      {/* Header */}
      <section className="pt-6 pb-4 sm:pt-8 sm:pb-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green/20 to-emerald-100 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-green" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-text flex items-center gap-2">
                {lang === "id" ? "Asisten AI Treelogy" : "Treelogy AI Assistant"}
                <Sparkles className="w-4 h-4 text-green" />
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted">
                  {lang === "id"
                    ? "Tanyakan apapun tentang produk wellness kami"
                    : "Ask anything about our wellness products"}
                </p>
                <BackendStatus lang={lang} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:text-text hover:border-green/40 transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === "id" ? "Basis Pengetahuan" : "Knowledge Base"}</span>
              </button>
            )}
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === "id" ? "Hapus Chat" : "Clear Chat"}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="flex gap-4">
        {/* Chat Panel */}
        <div className={`flex-1 flex flex-col min-w-0 ${isAuthenticated && showSidebar ? "lg:mr-0" : ""}`}>
          {/* Messages Area */}
          <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col" style={{ height: "calc(100vh - 16rem)" }}>
            <div className="flex-1 overflow-y-auto py-4 space-y-4 faq-scroll">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green/10 to-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-green/60" />
                  </div>
                  <h2 className="text-base font-semibold text-text mb-1">
                    {lang === "id" ? "Hai! Saya asisten wellness Treelogy" : "Hi! I'm your Treelogy wellness assistant"}
                  </h2>
                  <p className="text-xs text-muted text-center max-w-sm mb-6">
                    {lang === "id"
                      ? "Saya bisa menjawab pertanyaan tentang produk moringa, dosis, manfaat, dan keamanan berdasarkan data terpercaya."
                      : "I can answer questions about moringa products, dosages, benefits, and safety based on trusted data."}
                  </p>

                  {/* Suggested questions */}
                  <div className="w-full max-w-md space-y-2">
                    <p className="text-[11px] font-medium text-muted/50 uppercase tracking-wide flex items-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      {lang === "id" ? "Coba tanyakan" : "Try asking"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(q)}
                          className="text-left px-3 py-2.5 text-xs text-muted hover:text-text bg-card-hover/50 hover:bg-green-light/30 border border-border/50 hover:border-green/30 rounded-xl transition-all duration-200 cursor-pointer leading-relaxed"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feature cards */}
                  <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
                    <div className="flex items-center gap-2 text-[11px] text-muted/60">
                      <Shield className="w-3.5 h-3.5 text-green/60" />
                      {lang === "id" ? "Jawaban Terverifikasi" : "Verified Answers"}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted/60">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      {lang === "id" ? "Sumber Terpercaya" : "Trusted Sources"}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted/60">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {lang === "id" ? "Streaming Real-time" : "Real-time Streaming"}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} lang={lang} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-3">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isStreaming
                        ? (lang === "id" ? "Menunggu jawaban..." : "Waiting for response...")
                        : (lang === "id" ? "Ketik pertanyaan wellness Anda..." : "Type your wellness question...")
                    }
                    disabled={isStreaming}
                    rows={1}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-bg text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-none disabled:opacity-50 transition-all"
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                    onInput={(e) => {
                      e.target.style.height = "44px";
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                  />
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isStreaming}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-green text-white hover:bg-green/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm flex-shrink-0"
                  aria-label={lang === "id" ? "Kirim" : "Send"}
                >
                  {isStreaming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-muted/40 mt-1.5 px-1">
                {lang === "id"
                  ? "Jawaban AI diverifikasi dari basis pengetahuan Treelogy & sumber medis terpercaya. Bukan pengganti konsultasi medis."
                  : "AI answers are verified from Treelogy knowledge base & trusted medical sources. Not a substitute for medical advice."}
              </p>
            </div>
          </div>
        </div>

        {/* Knowledge Base Sidebar — auth-gated */}
        {isAuthenticated && showSidebar && (
          <div className="hidden lg:block w-72 flex-shrink-0 space-y-4">
            <KnowledgeUploadPanel lang={lang} />

            {/* How it works */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                <Zap className="w-4 h-4 text-green" />
                {lang === "id" ? "Bagaimana Cara Kerjanya" : "How It Works"}
              </h3>
              <div className="space-y-2.5">
                {[
                  {
                    icon: Upload,
                    title: lang === "id" ? "Upload Dokumen" : "Upload Documents",
                    desc: lang === "id" ? "PDF/DOCX dipotong & diembed secara semantik" : "PDF/DOCX files are semantically chunked & embedded",
                  },
                  {
                    icon: Database,
                    title: lang === "id" ? "Pencarian Vektor" : "Vector Search",
                    desc: lang === "id" ? "Pertanyaan dicocokkan dengan pengetahuan terdekat" : "Questions matched to nearest knowledge",
                  },
                  {
                    icon: Shield,
                    title: lang === "id" ? "Verifikasi Fakta" : "Fact Verification",
                    desc: lang === "id" ? "AI memeriksa ulang jawaban vs sumber" : "AI double-checks answer vs sources",
                  },
                  {
                    icon: ExternalLink,
                    title: lang === "id" ? "Fallback Web" : "Web Fallback",
                    desc: lang === "id" ? "Sumber medis terpercaya jika data internal kurang" : "Trusted medical sources if internal data insufficient",
                  },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-green-light/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3 h-3 text-green" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text">{title}</p>
                      <p className="text-[11px] text-muted leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
