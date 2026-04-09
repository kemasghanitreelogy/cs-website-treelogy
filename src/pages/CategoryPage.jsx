import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Pill,
  Clock,
  Heart,
  ShieldCheck,
  Package,
  Truck,
  MessageCircle,
  Users,
  ShoppingBag,
  HelpCircle,
  Search,
  X,
  CornerDownRight,
  Droplets,
  Stethoscope,
  Loader2,
  Plus,
} from "lucide-react";
import Accordion from "../components/Accordion";
import ContactCTA from "../components/ContactCTA";
import FAQEditModal from "../components/FAQEditModal";
import FAQAddModal from "../components/FAQAddModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import LoginModal from "../components/LoginModal";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { buildIndex, smartSearch } from "../lib/search";

const iconMap = {
  Leaf, Pill, Clock, Heart, ShieldCheck, Package, Truck,
  MessageCircle, Users, ShoppingBag, HelpCircle, Droplets, Stethoscope,
};

function getSnippet(answer, tokens, maxLen = 90) {
  const lower = answer.toLowerCase();
  let bestPos = -1;
  for (const tok of tokens) {
    const idx = lower.indexOf(tok);
    if (idx !== -1) { bestPos = idx; break; }
  }
  if (bestPos === -1) return answer.slice(0, maxLen) + (answer.length > maxLen ? "..." : "");
  const start = Math.max(0, bestPos - 30);
  const end = Math.min(answer.length, start + maxLen);
  let snippet = answer.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < answer.length) snippet += "...";
  return snippet;
}

function HighlightText({ text, tokens }) {
  if (!tokens.length) return <>{text}</>;
  const regex = new RegExp(
    `(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200/80 text-text rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ── Inline Smart Search Component ── */

function InlineSmartSearch({ currentCategoryId, onJumpToArticle, navigate }) {
  const { lang } = useLanguage();
  const { articles, categories } = useData();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  const index = useMemo(() => buildIndex(articles, categories, lang), [articles, categories, lang]);
  const tokens = useMemo(
    () => query.toLowerCase().split(/\s+/).filter((t) => t.length > 1),
    [query]
  );
  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return smartSearch(index, query);
  }, [index, query]);

  useEffect(() => setSelectedIdx(-1), [results]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target) && !inputRef.current?.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (r) => {
    setIsOpen(false);
    setQuery("");
    if (r.categoryId === currentCategoryId) onJumpToArticle(r.id);
    else navigate(`/category/${r.categoryId}?open=${r.id}#faq-${r.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((p) => Math.min(p + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((p) => Math.max(p - 1, -1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (selectedIdx >= 0 && results[selectedIdx]) handleSelect(results[selectedIdx]); }
    else if (e.key === "Escape") { setIsOpen(false); inputRef.current?.blur(); }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center bg-white border border-border rounded-xl shadow-sm focus-within:border-green focus-within:ring-2 focus-within:ring-green/20 transition-all duration-200 h-11">
        <Search className="absolute left-4 w-4 h-4 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={lang === "id" ? "Cari pertanyaan (typo juga bisa)..." : "Search questions (typos OK)..."}
          className="w-full bg-transparent outline-none text-text placeholder:text-muted/60 pl-10 pr-10 text-sm"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-4 text-muted hover:text-text cursor-pointer transition-colors"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div ref={dropRef} className="absolute z-50 top-full mt-2 left-0 right-0 bg-white rounded-xl border border-border shadow-xl overflow-hidden">
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 bg-card-hover/30 border-b border-border/50">
                <span className="text-[10px] font-semibold text-muted/60 tracking-widest uppercase">
                  {results.length} {lang === "id" ? "jawaban ditemukan" : "results found"}
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto overscroll-contain">
                {results.map((r, i) => {
                  const isSameCategory = r.categoryId === currentCategoryId;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleSelect(r)}
                      onMouseEnter={() => setSelectedIdx(i)}
                      className={`w-full text-left px-4 py-3 cursor-pointer transition-all duration-150 group ${
                        selectedIdx === i ? "bg-green-light/40" : "hover:bg-card-hover/60"
                      } ${i < results.length - 1 ? "border-b border-border/30" : ""}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSameCategory ? "bg-green-light text-green" : "bg-card-hover text-muted"
                        }`}>{r.categoryName}</span>
                        {isSameCategory && (
                          <span className="text-[10px] text-green/60 flex items-center gap-0.5">
                            <CornerDownRight className="w-2.5 h-2.5" />
                            {lang === "id" ? "di halaman ini" : "on this page"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-text leading-snug mb-0.5">
                        <HighlightText text={r.question} tokens={tokens} />
                      </p>
                      <p className="text-xs text-muted/70 leading-relaxed line-clamp-1">
                        <HighlightText text={getSnippet(r.answer, tokens)} tokens={tokens} />
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted">{lang === "id" ? "Tidak ditemukan" : "No results found"}</p>
              <p className="text-xs text-muted/50 mt-1">{lang === "id" ? "Coba kata kunci lain" : "Try different keywords"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Category Page ── */

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { getCategoryById, getArticlesByCategory, loading } = useData();
  const { isAuthenticated } = useAuth();
  const category = getCategoryById(id);
  const articles = getArticlesByCategory(id);

  const [openArticleId, setOpenArticleId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const accordionRefs = useRef({});

  // Modal states
  const [editArticle, setEditArticle] = useState(null);
  const [deleteArticle, setDeleteArticle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleAuthAction = useCallback((type, article) => {
    if (isAuthenticated) {
      if (type === "edit") setEditArticle(article);
      else if (type === "delete") setDeleteArticle(article);
      else if (type === "add") setShowAddModal(true);
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
      setPendingAction(null);
    }
  }, [pendingAction]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openId = params.get("open");
    if (openId) setTimeout(() => jumpToArticle(openId), 100);
  }, [id]);

  const jumpToArticle = useCallback((articleId) => {
    setOpenArticleId(articleId);
    setHighlightId(articleId);
    const ref = accordionRefs.current[articleId];
    if (ref) ref.open();
    setTimeout(() => {
      const el = document.getElementById(`faq-${articleId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    setTimeout(() => setHighlightId(null), 2500);
  }, []);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <Loader2 className="w-8 h-8 text-green animate-spin mx-auto" />
      </main>
    );
  }

  if (!category) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted">Category not found.</p>
        <Link to="/" className="text-cta hover:underline mt-4 inline-block cursor-pointer">{t("backToHome")}</Link>
      </main>
    );
  }

  const Icon = iconMap[category.icon] || HelpCircle;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="pt-6 pb-4">
        <div className="max-w-lg">
          <InlineSmartSearch currentCategoryId={id} onJumpToArticle={jumpToArticle} navigate={navigate} />
        </div>
      </div>

      <section className="pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-light rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-green" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text">{category.name[lang]}</h1>
              <p className="text-sm text-muted">{category.description[lang]}</p>
            </div>
          </div>
          <button
            onClick={() => handleAuthAction("add")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-green text-white hover:bg-green/90 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === "id" ? "Tambah FAQ" : "Add FAQ"}</span>
          </button>
        </div>
      </section>

      <section className="pb-8">
        {articles.length > 0 ? (
          <div className="space-y-3">
            {articles.map((article) => (
              <Accordion
                key={article.id}
                ref={(el) => { if (el) accordionRefs.current[article.id] = el; }}
                article={article}
                defaultOpen={openArticleId === article.id}
                highlight={highlightId === article.id}
                onEdit={(a) => handleAuthAction("edit", a)}
                onDelete={(a) => handleAuthAction("delete", a)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted text-sm">{t("noResults")}</p>
          </div>
        )}
      </section>

      <ContactCTA />

      {/* Modals */}
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
      {showLoginModal && (
        <LoginModal
          onClose={() => { setShowLoginModal(false); setPendingAction(null); }}
          onSuccess={handleLoginSuccess}
        />
      )}
    </main>
  );
}
