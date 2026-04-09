import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { X, Save, Loader2, Maximize2, Search, Filter, ChevronDown, Check, AlertCircle, Undo2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export default function FAQFullscreenEditor({ onClose }) {
  const { lang } = useLanguage();
  const { articles, categories, updateArticle } = useData();
  const { user: authUser } = useAuth();

  // Build editable rows from articles
  const [rows, setRows] = useState(() =>
    articles.map((a) => ({
      id: a.id,
      category_id: a.categoryId,
      question_id: a.question.id,
      question_en: a.question.en,
      answer_id: a.answer.id,
      answer_en: a.answer.en,
    }))
  );

  // Track original values to detect changes
  const originals = useRef(
    Object.fromEntries(
      articles.map((a) => [
        a.id,
        {
          category_id: a.categoryId,
          question_id: a.question.id,
          question_en: a.question.en,
          answer_id: a.answer.id,
          answer_en: a.answer.en,
        },
      ])
    )
  );

  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterCat, setFilterCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Detect changed rows
  const changedIds = useMemo(() => {
    const ids = new Set();
    for (const row of rows) {
      const orig = originals.current[row.id];
      if (!orig) continue;
      if (
        row.category_id !== orig.category_id ||
        row.question_id !== orig.question_id ||
        row.question_en !== orig.question_en ||
        row.answer_id !== orig.answer_id ||
        row.answer_en !== orig.answer_en
      ) {
        ids.add(row.id);
      }
    }
    return ids;
  }, [rows]);

  // Filter rows
  const filteredRows = useMemo(() => {
    let list = rows;
    if (filterCat !== "all") list = list.filter((r) => r.category_id === filterCat);
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.question_id.toLowerCase().includes(q) ||
          r.question_en.toLowerCase().includes(q) ||
          r.answer_id.toLowerCase().includes(q) ||
          r.answer_en.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rows, filterCat, searchQuery]);

  const handleChange = useCallback((id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  const handleUndo = useCallback((id) => {
    const orig = originals.current[id];
    if (orig) setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...orig } : r)));
  }, []);

  const handleSaveAll = async () => {
    if (!authUser || changedIds.size === 0) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    setSavedCount(0);

    let saved = 0;
    let failed = 0;

    for (const id of changedIds) {
      const row = rows.find((r) => r.id === id);
      if (!row) continue;
      try {
        await updateArticle(id, row, authUser.id, authUser.name);
        // Update originals to reflect saved state
        originals.current[id] = { ...row };
        saved++;
        setSavedCount(saved);
      } catch (err) {
        failed++;
        console.error(`Failed to save article ${id}:`, err);
      }
    }

    setSaving(false);
    // Force re-render to clear changedIds
    setRows((prev) => [...prev]);

    if (failed > 0) {
      setError(lang === "id" ? `${failed} data gagal disimpan` : `${failed} items failed to save`);
    } else {
      setSuccess(lang === "id" ? `${saved} data berhasil disimpan!` : `${saved} items saved successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const getCatName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name[lang] : catId;
  };

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-green" />
            <h1 className="text-sm font-semibold text-text">
              {lang === "id" ? "Editor FAQ" : "FAQ Editor"}
            </h1>
          </div>
          <span className="text-[11px] text-muted bg-card-hover px-2 py-0.5 rounded-full tabular-nums">
            {filteredRows.length} / {rows.length}
          </span>
          {changedIds.size > 0 && (
            <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium tabular-nums">
              {changedIds.size} {lang === "id" ? "diubah" : "changed"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted/40 pointer-events-none" />
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="appearance-none pl-7 pr-6 py-1.5 text-[11px] rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-green/30 cursor-pointer"
            >
              <option value="all">{lang === "id" ? "Semua" : "All"}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name[lang]}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "id" ? "Cari..." : "Search..."}
              className="pl-7 pr-3 py-1.5 text-[11px] rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 w-36"
            />
          </div>

          {/* Status */}
          {error && (
            <span className="text-[11px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {error}
            </span>
          )}
          {success && (
            <span className="text-[11px] text-green flex items-center gap-1">
              <Check className="w-3 h-3" /> {success}
            </span>
          )}

          {/* Save All */}
          <button
            onClick={handleSaveAll}
            disabled={saving || changedIds.size === 0}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-medium text-white bg-green hover:bg-green/90 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                {savedCount}/{changedIds.size}
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                {lang === "id" ? "Simpan Semua" : "Save All"}
                {changedIds.size > 0 && ` (${changedIds.size})`}
              </>
            )}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-card-hover transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-card-hover/95 backdrop-blur-sm border-b border-border">
              <th className="px-2 py-2.5 text-left font-semibold text-muted/60 uppercase tracking-wider w-10 text-center">#</th>
              <th className="px-2 py-2.5 text-left font-semibold text-muted/60 uppercase tracking-wider w-28">
                {lang === "id" ? "Kategori" : "Category"}
              </th>
              <th className="px-2 py-2.5 text-left font-semibold text-muted/60 uppercase tracking-wider" style={{ width: "22%" }}>
                Pertanyaan (ID)
              </th>
              <th className="px-2 py-2.5 text-left font-semibold text-muted/60 uppercase tracking-wider" style={{ width: "22%" }}>
                Question (EN)
              </th>
              <th className="px-2 py-2.5 text-left font-semibold text-muted/60 uppercase tracking-wider" style={{ width: "23%" }}>
                Jawaban (ID)
              </th>
              <th className="px-2 py-2.5 text-left font-semibold text-muted/60 uppercase tracking-wider" style={{ width: "23%" }}>
                Answer (EN)
              </th>
              <th className="px-2 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, i) => {
              const isChanged = changedIds.has(row.id);
              return (
                <tr
                  key={row.id}
                  className={`border-b border-border/40 transition-colors ${
                    isChanged ? "bg-amber-50/50" : i % 2 === 0 ? "bg-white" : "bg-card-hover/20"
                  }`}
                >
                  <td className="px-2 py-1 text-center text-muted/40 tabular-nums align-top pt-2.5">
                    {row.id}
                  </td>
                  <td className="px-1 py-1 align-top">
                    <select
                      value={row.category_id}
                      onChange={(e) => handleChange(row.id, "category_id", e.target.value)}
                      className="w-full px-1.5 py-1.5 text-[11px] rounded border border-transparent hover:border-border focus:border-green focus:ring-1 focus:ring-green/20 bg-transparent text-text cursor-pointer appearance-none focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name[lang]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-1 py-1 align-top">
                    <textarea
                      value={row.question_id}
                      onChange={(e) => handleChange(row.id, "question_id", e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1.5 text-[12px] rounded border border-transparent hover:border-border focus:border-green focus:ring-1 focus:ring-green/20 bg-transparent text-text resize-none focus:outline-none leading-relaxed"
                    />
                  </td>
                  <td className="px-1 py-1 align-top">
                    <textarea
                      value={row.question_en}
                      onChange={(e) => handleChange(row.id, "question_en", e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1.5 text-[12px] rounded border border-transparent hover:border-border focus:border-green focus:ring-1 focus:ring-green/20 bg-transparent text-text resize-none focus:outline-none leading-relaxed"
                    />
                  </td>
                  <td className="px-1 py-1 align-top">
                    <textarea
                      value={row.answer_id}
                      onChange={(e) => handleChange(row.id, "answer_id", e.target.value)}
                      rows={3}
                      className="w-full px-2 py-1.5 text-[12px] rounded border border-transparent hover:border-border focus:border-green focus:ring-1 focus:ring-green/20 bg-transparent text-text resize-y focus:outline-none leading-relaxed"
                    />
                  </td>
                  <td className="px-1 py-1 align-top">
                    <textarea
                      value={row.answer_en}
                      onChange={(e) => handleChange(row.id, "answer_en", e.target.value)}
                      rows={3}
                      className="w-full px-2 py-1.5 text-[12px] rounded border border-transparent hover:border-border focus:border-green focus:ring-1 focus:ring-green/20 bg-transparent text-text resize-y focus:outline-none leading-relaxed"
                    />
                  </td>
                  <td className="px-1 py-1 align-top pt-2">
                    {isChanged && (
                      <button
                        onClick={() => handleUndo(row.id)}
                        className="p-1 rounded text-amber-500 hover:bg-amber-50 transition-colors cursor-pointer"
                        title={lang === "id" ? "Batalkan perubahan" : "Undo changes"}
                      >
                        <Undo2 className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredRows.length === 0 && (
          <div className="py-16 text-center">
            <Search className="w-6 h-6 text-muted/20 mx-auto mb-2" />
            <p className="text-xs text-muted">{lang === "id" ? "Tidak ada data ditemukan" : "No data found"}</p>
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-card border-t border-border text-[11px] text-muted/50 flex-shrink-0">
        <span>
          {lang === "id" ? "Total" : "Total"}: {rows.length} FAQ
          {changedIds.size > 0 && (
            <span className="text-amber-600 ml-3">
              {changedIds.size} {lang === "id" ? "belum disimpan" : "unsaved"}
            </span>
          )}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          {lang === "id" ? "Kuning = ada perubahan" : "Yellow = has changes"}
        </span>
      </div>
    </div>
  );
}
