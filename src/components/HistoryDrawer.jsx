import { useState, useEffect, useRef } from "react";
import {
  X,
  History,
  Loader2,
  Pencil,
  Trash2,
  Plus,
  ChevronDown,
  Clock,
  User,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";

const ACTION_CONFIG = {
  create: { icon: Plus, label: { id: "Dibuat", en: "Created" }, color: "text-green bg-green-light" },
  update: { icon: Pencil, label: { id: "Diubah", en: "Updated" }, color: "text-blue-600 bg-blue-100" },
  delete: { icon: Trash2, label: { id: "Dihapus", en: "Deleted" }, color: "text-red-500 bg-red-100" },
};

function ChangeDetail({ field, from, to }) {
  return (
    <div className="text-[11px] leading-relaxed">
      <span className="font-medium text-muted/70">{field}:</span>
      <div className="mt-0.5 pl-2 border-l-2 border-red-200">
        <p className="text-red-600/70 line-through line-clamp-2">{from || "-"}</p>
      </div>
      <div className="mt-0.5 pl-2 border-l-2 border-green/30">
        <p className="text-green/80 line-clamp-2">{to || "-"}</p>
      </div>
    </div>
  );
}

function HistoryItem({ item, lang }) {
  const [expanded, setExpanded] = useState(false);
  const config = ACTION_CONFIG[item.action] || ACTION_CONFIG.update;
  const Icon = config.icon;
  const changes = item.changes || {};
  const hasChanges = Object.keys(changes).length > 0;

  return (
    <div className="border-b border-border/40 last:border-0">
      <div
        onClick={() => hasChanges && setExpanded(!expanded)}
        className={`flex items-start gap-3 px-4 py-3 ${hasChanges ? "cursor-pointer hover:bg-card-hover/50" : ""} transition-colors`}
        role={hasChanges ? "button" : undefined}
        tabIndex={hasChanges ? 0 : undefined}
      >
        {/* Icon */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${config.color}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${config.color}`}>
              {config.label[lang]}
            </span>
            {item.article_snapshot?.question_id && (
              <span className="text-[11px] text-muted truncate max-w-[200px]">
                #{item.article_id} — {item.article_snapshot.question_id}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted/60">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {item.user_name}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(item.created_at).toLocaleString(lang === "id" ? "id-ID" : "en-US", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>

        {/* Expand indicator */}
        {hasChanges && (
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted/40 flex-shrink-0 mt-1 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {/* Expanded changes */}
      {expanded && hasChanges && (
        <div className="px-4 pb-3 pl-14 space-y-2">
          {Object.entries(changes).map(([field, { from, to }]) => (
            <ChangeDetail key={field} field={field} from={from} to={to} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoryDrawer({ articleId, onClose }) {
  const { lang } = useLanguage();
  const { fetchHistory } = useData();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    loadHistory();
  }, [articleId]);

  async function loadHistory() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHistory(articleId);
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
    >
      <div className="bg-card w-full max-w-md h-full shadow-2xl border-l border-border flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-card-hover flex items-center justify-center">
              <History className="w-4 h-4 text-muted" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text">
                {lang === "id" ? "Riwayat Perubahan" : "Change History"}
              </h2>
              <p className="text-[11px] text-muted">
                {articleId
                  ? `FAQ #${articleId}`
                  : lang === "id" ? "Semua aktivitas" : "All activity"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-text hover:bg-card-hover transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto faq-scroll">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 text-green animate-spin" />
            </div>
          ) : error ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <History className="w-8 h-8 text-muted/20 mx-auto mb-3" />
              <p className="text-sm text-muted">
                {lang === "id" ? "Belum ada riwayat" : "No history yet"}
              </p>
            </div>
          ) : (
            <div>
              {history.map((item) => (
                <HistoryItem key={item.id} item={item} lang={lang} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-border bg-card-hover/30 text-[11px] text-muted/50">
          {history.length} {lang === "id" ? "entri" : "entries"}
        </div>
      </div>
    </div>
  );
}
