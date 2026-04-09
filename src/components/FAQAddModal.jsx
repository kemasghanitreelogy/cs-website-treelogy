import { useState, useEffect, useRef } from "react";
import { X, Save, Loader2, Tag, User, Plus, Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function FAQAddModal({ onClose, onSaved }) {
  const { lang } = useLanguage();
  const { categories, createArticle } = useData();
  const { user: authUser } = useAuth();
  const [form, setForm] = useState({
    category_id: categories[0]?.id || "",
    question: "",
    answer_id: "",
    answer_en: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
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
    if (!form.question.trim()) {
      setError(lang === "id" ? "Pertanyaan tidak boleh kosong" : "Question cannot be empty");
      return;
    }
    if (!form.answer_id.trim()) {
      setError(lang === "id" ? "Jawaban (ID) tidak boleh kosong" : "Answer (ID) cannot be empty");
      return;
    }

    setSaving(true);
    setError(null);
    setStatus(lang === "id" ? "Menerjemahkan ke Inggris..." : "Translating to English...");

    try {
      // Build list of texts that need translation (question always, answer_en only if empty)
      const textsToTranslate = [form.question];
      const needAnswerTranslate = !form.answer_en.trim();
      if (needAnswerTranslate) textsToTranslate.push(form.answer_id);

      const res = await supabase.functions.invoke("translate", {
        body: { texts: textsToTranslate, from: "id", to: "en" },
      });

      let questionEn = form.question;
      let answerEn = form.answer_en.trim() || form.answer_id;

      if (!res.error && res.data?.translations) {
        questionEn = res.data.translations[0] || form.question;
        if (needAnswerTranslate) {
          answerEn = res.data.translations[1] || form.answer_id;
        }
      }

      setStatus(lang === "id" ? "Menyimpan FAQ..." : "Saving FAQ...");

      await createArticle(
        {
          category_id: form.category_id,
          question_id: form.question,
          question_en: questionEn,
          answer_id: form.answer_id,
          answer_en: answerEn,
        },
        authUser.id,
        authUser.name
      );
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setStatus(null);
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
              <p className="text-[11px] text-muted flex items-center gap-1">
                <Languages className="w-3 h-3" />
                {lang === "id" ? "Tulis dalam Bahasa Indonesia, otomatis diterjemahkan ke Inggris" : "Write in Indonesian, auto-translated to English"}
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

          {/* Question */}
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              {lang === "id" ? "Pertanyaan" : "Question"}
            </label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => handleChange("question", e.target.value)}
              placeholder={lang === "id" ? "Tulis pertanyaan dalam Bahasa Indonesia..." : "Write question in Indonesian..."}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              autoFocus
            />
          </div>

          {/* Answer ID */}
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              {lang === "id" ? "Jawaban (ID)" : "Answer (ID)"}
            </label>
            <textarea
              value={form.answer_id}
              onChange={(e) => handleChange("answer_id", e.target.value)}
              placeholder={lang === "id" ? "Tulis jawaban dalam Bahasa Indonesia..." : "Write answer in Indonesian..."}
              rows={5}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-y leading-relaxed"
            />
          </div>

          {/* Answer EN (optional) */}
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 flex items-center justify-between">
              <span>{lang === "id" ? "Jawaban (EN)" : "Answer (EN)"}</span>
              <span className="text-[10px] text-muted/50 font-normal flex items-center gap-1">
                <Languages className="w-3 h-3" />
                {lang === "id" ? "Opsional — kosongkan untuk auto-translate" : "Optional — leave empty to auto-translate"}
              </span>
            </label>
            <textarea
              value={form.answer_en}
              onChange={(e) => handleChange("answer_en", e.target.value)}
              placeholder={lang === "id" ? "Kosongkan untuk terjemahan otomatis, atau tulis manual..." : "Leave empty for auto-translate, or write manually..."}
              rows={5}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card-hover/30 rounded-b-2xl">
          <div className="flex-1 mr-4">
            {error && <p className="text-xs text-red-500">{error}</p>}
            {!error && saving && status && (
              <p className="text-xs text-green flex items-center gap-1.5">
                <Languages className="w-3 h-3 animate-pulse" />
                {status}
              </p>
            )}
          </div>
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
