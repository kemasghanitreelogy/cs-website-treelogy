import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  Filter,
  Hash,
  SlidersHorizontal,
  ArrowUpRight,
  Loader2,
  Pencil,
  Trash2,
  History,
  Clock,
  User,
  Plus,
  Maximize2,
} from "lucide-react";
import TreelogyLogo from "../components/TreelogyLogo";
import CategoryCard from "../components/CategoryCard";
import FAQEditModal from "../components/FAQEditModal";
import FAQAddModal from "../components/FAQAddModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import HistoryDrawer from "../components/HistoryDrawer";
import LoginModal from "../components/LoginModal";
import FAQFullscreenEditor from "../components/FAQFullscreenEditor";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { buildIndex, smartSearch } from "../lib/search";

/* ─── Highlight ─── */

function HighlightText({ text, query }) {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (!tokens.length) return <>{text}</>;
  const regex = new RegExp(
    `(${tokens
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200/80 text-text rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function getAnswerSnippet(answer, query, maxLen = 100) {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  const lower = answer.toLowerCase();
  let pos = 0;
  for (const tok of tokens) {
    const idx = lower.indexOf(tok);
    if (idx !== -1 && idx > pos) pos = idx;
  }
  const start = Math.max(0, pos - 20);
  const end = Math.min(answer.length, start + maxLen);
  let snippet = answer.substring(start, end).replace(/\n/g, " ");
  if (start > 0) snippet = "..." + snippet;
  if (end < answer.length) snippet += "...";
  return snippet;
}

/* ─── Hero Smart Search ─── */

function HeroSmartSearch() {
  const { lang } = useLanguage();
  const { articles, categories } = useData();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  const index = useMemo(() => buildIndex(articles, categories, lang), [articles, categories, lang]);
  const results = useMemo(() => smartSearch(index, query), [index, query]);

  const POPULAR_QUERIES = useMemo(
    () =>
      lang === "id"
        ? ["Moringa", "Dosis kapsul", "Cara pakai powder", "Ibu hamil", "Manfaat moringa", "Cara pesan", "Moringa oil"]
        : ["Moringa", "Capsule dosage", "How to use powder", "Safe for pregnant", "Moringa benefits", "How to order", "Moringa oil"],
    [lang]
  );

  useEffect(() => { setSelectedIdx(-1); }, [results]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target) && !inputRef.current?.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (entry) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/category/${entry.categoryId}?open=${entry.id}#faq-${entry.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((p) => Math.min(p + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((p) => Math.max(p - 1, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIdx >= 0 && results[selectedIdx]) handleSelect(results[selectedIdx]);
      else if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else if (e.key === "Escape") { setIsOpen(false); inputRef.current?.blur(); }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted/50 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={lang === "id" ? "Ketik pertanyaan Anda (typo juga bisa)... cth: dosis, manfaat" : "Type your question (typos OK)... e.g.: dosage, benefits"}
          className="w-full pl-12 pr-10 py-3.5 text-sm rounded-xl border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green shadow-sm transition-all duration-200"
          autoComplete="off"
          aria-label="Search FAQ"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div ref={dropRef} className="absolute z-50 top-full mt-2 left-0 right-0 bg-card rounded-xl border border-border shadow-xl overflow-hidden">
          {query.length < 2 && (
            <div className="p-3">
              <p className="text-[11px] font-medium text-muted/50 uppercase tracking-wide px-1 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {lang === "id" ? "Sering dicari" : "Popular searches"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_QUERIES.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(q); setIsOpen(true); inputRef.current?.focus(); }}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-border text-muted hover:text-text hover:border-green/40 hover:bg-green-light/30 transition-colors duration-200 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.length >= 2 && results.length > 0 && (
            <div className="max-h-[22rem] overflow-y-auto">
              <p className="text-[11px] font-medium text-muted/50 uppercase tracking-wide px-4 pt-3 pb-1.5">
                {results.length} {lang === "id" ? "jawaban ditemukan" : "answers found"}
              </p>
              {results.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r)}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={`w-full text-left px-4 py-3 cursor-pointer transition-colors duration-150 ${
                    selectedIdx === i ? "bg-green-light/50" : "hover:bg-card-hover"
                  } ${i < results.length - 1 ? "border-b border-border/40" : ""}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] text-green bg-green-light px-1.5 py-0.5 rounded font-medium">{r.categoryName}</span>
                  </div>
                  <p className="text-[13px] font-medium text-text leading-snug mb-1">
                    <HighlightText text={r.question} query={query} />
                  </p>
                  <p className="text-[11px] text-muted/70 leading-relaxed line-clamp-2">
                    <HighlightText text={getAnswerSnippet(r.answer, query)} query={query} />
                  </p>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div className="p-6 text-center">
              <Search className="w-7 h-7 text-muted/25 mx-auto mb-2" />
              <p className="text-sm text-muted">
                {lang === "id" ? "Tidak ada jawaban untuk" : "No answers for"}{" "}
                <span className="font-medium text-text">"{query}"</span>
              </p>
              <p className="text-[11px] text-muted/50 mt-1">
                {lang === "id" ? "Coba kata kunci lain atau jelajahi kategori" : "Try different keywords or browse categories"}
              </p>
            </div>
          )}

          {query.length >= 2 && results.length > 0 && (
            <div className="px-4 py-2 bg-card-hover/50 border-t border-border flex items-center gap-3 text-[10px] text-muted/40">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded border border-border bg-card text-[9px] font-mono">↑↓</kbd>
                {lang === "id" ? "navigasi" : "navigate"}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded border border-border bg-card text-[9px] font-mono">↵</kbd>
                {lang === "id" ? "buka jawaban" : "open answer"}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded border border-border bg-card text-[9px] font-mono">esc</kbd>
                {lang === "id" ? "tutup" : "close"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Expandable Table Row ─── */

function FAQTableRow({ entry, index, lang, navigate, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const answer = entry.article.answer[lang] || entry.article.answer.id;

  const handleCopy = useCallback(async (e) => {
    e.stopPropagation();
    try { await navigator.clipboard.writeText(answer); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = answer; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [answer]);

  const goToCategory = (e) => {
    e.stopPropagation();
    navigate(`/category/${entry.categoryId}?open=${entry.id}#faq-${entry.id}`);
  };

  return (
    <div className={`group border-b border-border/60 transition-colors duration-150 ${expanded ? "bg-green-light/20" : "hover:bg-card-hover/50"}`}>
      {/* Row */}
      <div
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(!expanded); } }}
        className="w-full grid grid-cols-[2.5rem_1fr_auto_2rem] sm:grid-cols-[3rem_1fr_auto_2rem] items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 text-left cursor-pointer"
      >
        <span className="text-xs font-mono text-muted/50 tabular-nums text-center">{index}</span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-text leading-snug truncate sm:whitespace-normal sm:line-clamp-2">
            {entry.question}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="inline-block text-[10px] font-medium text-green bg-green-light/70 px-1.5 py-0.5 rounded">
              {entry.categoryName}
            </span>
            {entry.article.updater_name && (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted/40">
                <User className="w-2.5 h-2.5" />
                {entry.article.updater_name}
                <Clock className="w-2.5 h-2.5 ml-1" />
                {entry.article.updated_at
                  ? new Date(entry.article.updated_at).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "numeric", month: "short" })
                  : ""}
              </span>
            )}
          </div>
        </div>
        {/* Action buttons - always visible */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(entry.article); }}
            className="p-1.5 rounded-md text-muted/40 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            title={lang === "id" ? "Edit FAQ" : "Edit FAQ"}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(entry.article); }}
            className="p-1.5 rounded-md text-muted/40 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title={lang === "id" ? "Hapus FAQ" : "Delete FAQ"}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted/40 transition-transform duration-200 justify-self-center ${expanded ? "rotate-180" : ""}`} />
      </div>

      {/* Expanded answer */}
      <div className={`grid transition-[grid-template-rows] duration-200 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="px-3 sm:px-4 pb-4">
            <div className="ml-[2.5rem] sm:ml-[3rem] pl-2 sm:pl-3 border-l-2 border-green/20">
              <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{answer}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                    copied ? "bg-green-light text-green" : "text-muted/60 hover:text-text hover:bg-card-hover border border-border/50"
                  }`}
                >
                  {copied ? <><Check className="w-3 h-3" />{lang === "id" ? "Tersalin!" : "Copied!"}</> : <><Copy className="w-3 h-3" />{lang === "id" ? "Salin" : "Copy"}</>}
                </button>
                <button
                  onClick={goToCategory}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-muted/60 hover:text-green rounded-lg hover:bg-green-light/50 border border-border/50 transition-all duration-200 cursor-pointer"
                >
                  <ArrowUpRight className="w-3 h-3" />
                  {lang === "id" ? "Lihat kategori" : "View category"}
                </button>
                {/* Mobile edit/delete */}
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(entry.article); }}
                  className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-muted/60 hover:text-blue-600 rounded-lg hover:bg-blue-50 border border-border/50 transition-all duration-200 cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(entry.article); }}
                  className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-muted/60 hover:text-red-500 rounded-lg hover:bg-red-50 border border-border/50 transition-all duration-200 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  {lang === "id" ? "Hapus" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── FAQ Data Table with Infinite Scroll ─── */

const LIMIT_OPTIONS = [10, 25, 50, 100];

function FAQDataTable() {
  const { lang } = useLanguage();
  const { articles, categories } = useData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [filterCat, setFilterCat] = useState("all");
  const [tableQuery, setTableQuery] = useState("");
  const [limit, setLimit] = useState(25);
  const [visibleCount, setVisibleCount] = useState(25);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showLimitMenu, setShowLimitMenu] = useState(false);
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const limitRef = useRef(null);

  // Modal states
  const [editArticle, setEditArticle] = useState(null);
  const [deleteArticle, setDeleteArticle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { type: 'edit'|'delete'|'add'|'fullscreen', article? }

  const handleAuthAction = useCallback((type, article) => {
    if (isAuthenticated) {
      if (type === "edit") setEditArticle(article);
      else if (type === "delete") setDeleteArticle(article);
      else if (type === "add") setShowAddModal(true);
      else if (type === "fullscreen") setShowFullscreen(true);
    } else {
      setPendingAction({ type, article });
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = useCallback(() => {
    setShowLoginModal(false);
    if (pendingAction) {
      if (pendingAction.type === "edit") setEditArticle(pendingAction.article);
      else if (pendingAction.type === "delete") setDeleteArticle(pendingAction.article);
      else if (pendingAction.type === "add") setShowAddModal(true);
      else if (pendingAction.type === "fullscreen") setShowFullscreen(true);
      setPendingAction(null);
    }
  }, [pendingAction]);

  const index = useMemo(() => buildIndex(articles, categories, lang), [articles, categories, lang]);

  const filtered = useMemo(() => {
    let list = index;
    if (filterCat !== "all") list = list.filter((e) => e.categoryId === filterCat);
    if (tableQuery.trim().length >= 2) {
      const results = smartSearch(list, tableQuery);
      if (results.length > 0) return results;
      const q = tableQuery.toLowerCase();
      list = list.filter((e) => e.searchText.includes(q));
    }
    return list;
  }, [index, filterCat, tableQuery]);

  useEffect(() => { setVisibleCount(limit); }, [limit, filterCat, tableQuery]);

  const loadingRef = useRef(false);
  useEffect(() => {
    const el = sentinelRef.current;
    const root = scrollRef.current;
    if (!el || !root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => {
              const total = filtered.length;
              return prev >= total ? prev : Math.min(prev + limit, total);
            });
            setIsLoadingMore(false);
            loadingRef.current = false;
          }, 300);
        }
      },
      { root, rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered.length, limit]);

  useEffect(() => {
    const handler = (e) => { if (limitRef.current && !limitRef.current.contains(e.target)) setShowLimitMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category filter */}
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/40 pointer-events-none" />
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 text-xs rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green cursor-pointer"
            >
              <option value="all">{lang === "id" ? "Semua Kategori" : "All Categories"}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name[lang]}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted/40 pointer-events-none" />
          </div>

          {/* Table search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/40 pointer-events-none" />
            <input
              type="text"
              value={tableQuery}
              onChange={(e) => setTableQuery(e.target.value)}
              placeholder={lang === "id" ? "Filter data..." : "Filter data..."}
              className="pl-8 pr-8 py-2 text-xs rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green w-44 sm:w-52"
            />
            {tableQuery && (
              <button onClick={() => setTableQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Add FAQ button */}
          <button
            onClick={() => handleAuthAction("add")}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs rounded-lg bg-green text-white hover:bg-green/90 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === "id" ? "Tambah" : "Add"}</span>
          </button>

          {/* Fullscreen editor */}
          <button
            onClick={() => handleAuthAction("fullscreen")}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs rounded-lg border border-border bg-card text-muted hover:text-text hover:border-green/40 transition-colors cursor-pointer"
            title={lang === "id" ? "Edit semua data (fullscreen)" : "Edit all data (fullscreen)"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === "id" ? "Fullscreen" : "Fullscreen"}</span>
          </button>

          {/* History button */}
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs rounded-lg border border-border bg-card text-muted hover:text-text hover:border-green/40 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>{lang === "id" ? "Riwayat" : "History"}</span>
          </button>

          <span className="text-[11px] text-muted/60 tabular-nums">
            {filtered.length} {lang === "id" ? "data" : "items"}
          </span>

          {/* Limit selector */}
          <div className="relative" ref={limitRef}>
            <button
              onClick={() => setShowLimitMenu(!showLimitMenu)}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs rounded-lg border border-border bg-card text-muted hover:text-text hover:border-green/40 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{limit}</span>
              <span className="text-muted/40">/ {lang === "id" ? "muat" : "load"}</span>
            </button>
            {showLimitMenu && (
              <div className="absolute right-0 top-full mt-1 bg-card rounded-lg border border-border shadow-lg z-30 overflow-hidden min-w-[7rem]">
                <p className="text-[10px] text-muted/50 uppercase tracking-wide px-3 pt-2 pb-1">
                  {lang === "id" ? "Per muat" : "Per load"}
                </p>
                {LIMIT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setLimit(opt); setShowLimitMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-xs cursor-pointer transition-colors ${
                      opt === limit ? "bg-green-light text-green font-medium" : "text-text hover:bg-card-hover"
                    }`}
                  >
                    {opt} {lang === "id" ? "item" : "items"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl bg-card shadow-sm flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-card-hover/95 backdrop-blur-sm rounded-t-xl border-b border-border">
          <div className="grid grid-cols-[2.5rem_1fr_2rem] sm:grid-cols-[3rem_1fr_auto_2rem] items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5">
            <span className="text-[10px] font-semibold text-muted/50 uppercase tracking-wider text-center">
              <Hash className="w-3 h-3 mx-auto" />
            </span>
            <span className="text-[10px] font-semibold text-muted/50 uppercase tracking-wider">
              {lang === "id" ? "Pertanyaan" : "Question"}
            </span>
            <span className="hidden sm:block text-[10px] font-semibold text-muted/50 uppercase tracking-wider text-center" />
            <span />
          </div>
        </div>

        {/* Scrollable Rows */}
        <div ref={scrollRef} className="faq-scroll max-h-[60vh] overflow-y-auto scroll-smooth" style={{ scrollbarGutter: "stable" }}>
          {visibleItems.length > 0 ? (
            <div>
              {visibleItems.map((entry, i) => (
                <FAQTableRow
                  key={entry.id}
                  entry={entry}
                  index={i + 1}
                  lang={lang}
                  navigate={navigate}
                  onEdit={(a) => handleAuthAction("edit", a)}
                  onDelete={(a) => handleAuthAction("delete", a)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-muted/20 mx-auto mb-3" />
              <p className="text-sm text-muted">{lang === "id" ? "Tidak ada data ditemukan" : "No data found"}</p>
              <p className="text-[11px] text-muted/50 mt-1">{lang === "id" ? "Coba ubah filter atau kata kunci" : "Try changing filters or keywords"}</p>
            </div>
          )}

          {isLoadingMore && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-border/40">
              <Loader2 className="w-4 h-4 text-green animate-spin" />
              <span className="text-xs text-muted/60">{lang === "id" ? "Memuat lebih banyak..." : "Loading more..."}</span>
            </div>
          )}

          {hasMore && <div ref={sentinelRef} className="h-1" />}
        </div>

        {/* Sticky Footer stats */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-card-hover/95 backdrop-blur-sm border-t border-border text-[11px] text-muted/50 rounded-b-xl">
          <span>
            {lang === "id" ? "Menampilkan" : "Showing"}{" "}
            <span className="font-medium text-text/70 tabular-nums">{Math.min(visibleCount, filtered.length)}</span>{" "}
            {lang === "id" ? "dari" : "of"}{" "}
            <span className="font-medium text-text/70 tabular-nums">{filtered.length}</span>
          </span>
          {!hasMore && filtered.length > 0 && (
            <span className="text-green/70 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              {lang === "id" ? "Semua dimuat" : "All loaded"}
            </span>
          )}
        </div>
      </div>

      {/* Modals */}
      {showFullscreen && (
        <FAQFullscreenEditor onClose={() => setShowFullscreen(false)} />
      )}
      {showAddModal && (
        <FAQAddModal
          onClose={() => setShowAddModal(false)}
          onSaved={() => setShowAddModal(false)}
        />
      )}
      {editArticle && (
        <FAQEditModal
          article={editArticle}
          onClose={() => setEditArticle(null)}
          onSaved={() => setEditArticle(null)}
        />
      )}
      {deleteArticle && (
        <DeleteConfirmModal
          article={deleteArticle}
          onClose={() => setDeleteArticle(null)}
          onDeleted={() => setDeleteArticle(null)}
        />
      )}
      {showHistory && (
        <HistoryDrawer
          articleId={null}
          onClose={() => setShowHistory(false)}
        />
      )}
      {showLoginModal && (
        <LoginModal
          onClose={() => { setShowLoginModal(false); setPendingAction(null); }}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

/* ─── Page ─── */

export default function HomePage() {
  const { lang, t } = useLanguage();
  const { articles, categories, loading } = useData();

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <Loader2 className="w-8 h-8 text-green animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted">{lang === "id" ? "Memuat data..." : "Loading data..."}</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-green-light rounded-2xl flex items-center justify-center">
            <TreelogyLogo className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3 tracking-tight">{t("heroTitle")}</h1>
        <p className="text-muted text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">{t("heroSubtitle")}</p>
        <HeroSmartSearch />
      </section>

      {/* Categories */}
      <section className="pb-10">
        <h2 className="text-lg font-semibold text-text mb-4">{t("browseCategories")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* FAQ Data Table */}
      <section className="pb-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-text">{lang === "id" ? "Semua FAQ" : "All FAQ"}</h2>
          <span className="text-xs text-muted/50 bg-card-hover px-2 py-0.5 rounded-full font-medium tabular-nums">
            {articles.length}
          </span>
        </div>
        <FAQDataTable />
      </section>
    </main>
  );
}
