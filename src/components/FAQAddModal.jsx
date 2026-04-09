import { useState, useEffect, useRef } from "react";
import { X, Save, Loader2, Tag, User, Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export default function FAQAddModal({ onClose, onSaved }) {
  const { lang } = useLanguage();
  const { categories, createArticle } = useData();
  const { user: authUser } = useAuth();
  const [form, setForm] = useState({
    category_id: categories[0]?.id || "",
    question_id: "",
    question_en: "",
    answer_id: "",
    answer_en: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleSave = async () => {
    if (!authUser) {
      setError(lang === "id" ? "Silakan login terlebih dahulu" : "Please login first");
      return;
    }

    if (!form.question_id.trim() && !form.question_en.trim()) {
      setError(lang === "id" ? "Pertanyaan tidak boleh kosong" : "Question cannot be empty");
      return;
    }
    if (!form.answer_id.trim() && !form.answer_en.trim()) {
      setError(lang === "id" ? "Jawaban tidak boleh kosong" : "Answer cannot be empty");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createArticle(form, authUser.id, authUser.name);
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-8 sm:pt-16 px-4 overflow-y-auto"
    >
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border animate-in fade-in slide-in-from-bottom-4 duration-200 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-light flex items-center justify-center">
              <Plus className="w-5 h-5 text-green" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text">
                {lang === "id" ? "Tambah FAQ" : "Add FAQ"}
              </h2>
              <p className="text-[11px] text-muted">
                {lang === "id" ? "Buat pertanyaan & jawaban baru" : "Create new question & answer"}
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
        <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto faq-scroll">
          {/* User + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Created by */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted mb-1.5">
                <User className="w-3.5 h-3.5" />
                {lang === "id" ? "Dibuat oleh" : "Created by"}
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card-hover/50">
                <div className="w-6 h-6 rounded-full bg-green-light flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-green">
                    {authUser?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <span className="text-sm font-medium text-text">{authUser?.name || "-"}</span>
                {authUser && (
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      authUser.role === "Owner"
                        ? "bg-purple-100 text-purple-700"
                        : authUser.role === "Developer"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {authUser.role}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted mb-1.5">
                <Tag className="w-3.5 h-3.5" />
                {lang === "id" ? "Kategori" : "Category"}
              </label>
              <select
                value={form.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green cursor-pointer appearance-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name[lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question ID */}
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Pertanyaan (ID)
            </label>
            <input
              type="text"
              value={form.question_id}
              onChange={(e) => handleChange("question_id", e.target.value)}
              placeholder={lang === "id" ? "Tulis pertanyaan dalam Bahasa Indonesia..." : "Write question in Indonesian..."}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              autoFocus
            />
          </div>

          {/* Question EN */}
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Question (EN)
            </label>
            <input
              type="text"
              value={form.question_en}
              onChange={(e) => handleChange("question_en", e.target.value)}
              placeholder={lang === "id" ? "Tulis pertanyaan dalam Bahasa Inggris..." : "Write question in English..."}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>

          {/* Answer ID */}
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Jawaban (ID)
            </label>
            <textarea
              value={form.answer_id}
              onChange={(e) => handleChange("answer_id", e.target.value)}
              placeholder={lang === "id" ? "Tulis jawaban dalam Bahasa Indonesia..." : "Write answer in Indonesian..."}
              rows={5}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-y leading-relaxed"
            />
          </div>

          {/* Answer EN */}
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Answer (EN)
            </label>
            <textarea
              value={form.answer_en}
              onChange={(e) => handleChange("answer_en", e.target.value)}
              placeholder={lang === "id" ? "Tulis jawaban dalam Bahasa Inggris..." : "Write answer in English..."}
              rows={5}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card-hover/30 rounded-b-2xl">
          {error && (
            <p className="text-xs text-red-500 mr-4 flex-1">{error}</p>
          )}
          {!error && <div />}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted hover:text-text rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
            >
              {lang === "id" ? "Batal" : "Cancel"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-green hover:bg-green/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving
                ? lang === "id" ? "Menyimpan..." : "Saving..."
                : lang === "id" ? "Simpan" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
