import { useState, useRef, useEffect } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export default function DeleteConfirmModal({ article, onClose, onDeleted }) {
  const { lang } = useLanguage();
  const { deleteArticle } = useData();
  const { user: authUser } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleDelete = async () => {
    if (!authUser) {
      setError(lang === "id" ? "Silakan login terlebih dahulu" : "Please login first");
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      await deleteArticle(article.id, authUser.id, authUser.name);
      onDeleted?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-base font-semibold text-text">
              {lang === "id" ? "Hapus FAQ" : "Delete FAQ"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-text hover:bg-card-hover transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-muted leading-relaxed">
            {lang === "id"
              ? "Apakah kamu yakin ingin menghapus FAQ ini? Tindakan ini tidak bisa dibatalkan."
              : "Are you sure you want to delete this FAQ? This action cannot be undone."}
          </p>

          {/* Article preview */}
          <div className="bg-red-50/50 border border-red-200/50 rounded-xl px-4 py-3">
            <p className="text-xs text-muted mb-1">#{article?.id}</p>
            <p className="text-sm font-medium text-text leading-snug">
              {article?.question?.[lang] || article?.question?.id}
            </p>
          </div>

          {/* Deleting as */}
          {authUser && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card-hover/50 border border-border/50">
              <div className="w-6 h-6 rounded-full bg-green-light flex items-center justify-center">
                <span className="text-[10px] font-semibold text-green">
                  {authUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-muted">
                {lang === "id" ? "Dihapus oleh" : "Deleted by"}{" "}
                <span className="font-medium text-text">{authUser.name}</span>
              </span>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-card-hover/30 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted hover:text-text rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
          >
            {lang === "id" ? "Batal" : "Cancel"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {deleting
              ? lang === "id" ? "Menghapus..." : "Deleting..."
              : lang === "id" ? "Hapus" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
