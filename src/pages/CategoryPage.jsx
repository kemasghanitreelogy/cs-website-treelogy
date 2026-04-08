import { useState, useMemo, useRef, useEffect, useCallback, createRef } from "react";
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
} from "lucide-react";
import Accordion from "../components/Accordion";
import ContactCTA from "../components/ContactCTA";
import { useLanguage } from "../context/LanguageContext";
import {
  getCategoryById,
  getArticlesByCategory,
  categories,
  articles as allArticles,
} from "../data/knowledgeBase";

const iconMap = {
  Leaf, Pill, Clock, Heart, ShieldCheck, Package, Truck,
  MessageCircle, Users, ShoppingBag, HelpCircle, Droplets, Stethoscope,
};

/* ── Smart Search Engine ── */

function buildIndex(lang) {
  return allArticles.map((a) => {
    const q = (a.question[lang] || a.question.id).toLowerCase();
    const ans = (a.answer[lang] || a.answer.id).toLowerCase();
    const cat = categories.find((c) => c.id === a.categoryId);
    return {
      id: a.id,
      categoryId: a.categoryId,
      categoryName: cat ? cat.name[lang] || cat.name.id : "",
      question: a.question[lang] || a.question.id,
      answer: a.answer[lang] || a.answer.id,
      qLower: q,
      ansLower: ans,
    };
  });
}

function smartSearch(index, query) {
  const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!tokens.length) return [];

  const phrase = tokens.join(" ");
  const scored = [];

  for (const entry of index) {
    let score = 0;
    for (const tok of tokens) {
      // Word-boundary match in question
      const wbQ = new RegExp(`\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
      if (wbQ.test(entry.qLower)) score += 12;
      else if (entry.qLower.includes(tok)) score += 8;

      // Answer match
      if (entry.ansLower.includes(tok)) score += 3;
    }
    // Phrase bonus
    if (tokens.length > 1 && entry.qLower.includes(phrase)) score += 15;

    if (score > 0) scored.push({ ...entry, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8);
}

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
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  const index = useMemo(() => buildIndex(lang), [lang]);
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
      if (
        dropRef.current && !dropRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (r) => {
    setIsOpen(false);
    setQuery("");
    // If same category, scroll to and open the accordion directly
    if (r.categoryId === currentCategoryId) {
      onJumpToArticle(r.id);
    } else {
      // Navigate to the other category via React Router (client-side)
      navigate(`/category/${r.categoryId}?open=${r.id}#faq-${r.id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((p) => Math.min(p + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((p) => Math.max(p - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIdx >= 0 && results[selectedIdx]) handleSelect(results[selectedIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
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
          placeholder={lang === "id" ? "Cari pertanyaan atau topik..." : "Search questions or topics..."}
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

      {/* Results dropdown */}
      {isOpen && query.length >= 2 && (
        <div
          ref={dropRef}
          className="absolute z-50 top-full mt-2 left-0 right-0 bg-white rounded-xl border border-border shadow-xl overflow-hidden"
        >
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
                          isSameCategory
                            ? "bg-green-light text-green"
                            : "bg-card-hover text-muted"
                        }`}>
                          {r.categoryName}
                        </span>
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
              <p className="text-sm text-muted">
                {lang === "id" ? "Tidak ditemukan" : "No results found"}
              </p>
              <p className="text-xs text-muted/50 mt-1">
                {lang === "id" ? "Coba kata kunci lain" : "Try different keywords"}
              </p>
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
  const category = getCategoryById(id);
  const articles = getArticlesByCategory(id);

  // Track which article to highlight/open
  const [openArticleId, setOpenArticleId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);

  // Refs for each accordion
  const accordionRefs = useRef({});

  // Check URL params for direct-open on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openId = params.get("open");
    if (openId) {
      // Small delay to let DOM render
      setTimeout(() => jumpToArticle(openId), 100);
    }
  }, [id]);

  const jumpToArticle = useCallback((articleId) => {
    setOpenArticleId(articleId);
    setHighlightId(articleId);

    // Open the accordion via ref
    const ref = accordionRefs.current[articleId];
    if (ref) ref.open();

    // Scroll to it
    setTimeout(() => {
      const el = document.getElementById(`faq-${articleId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);

    // Remove highlight after 2.5s
    setTimeout(() => setHighlightId(null), 2500);
  }, []);

  if (!category) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-muted">Category not found.</p>
        <Link
          to="/"
          className="text-cta hover:underline mt-4 inline-block cursor-pointer"
        >
          {t("backToHome")}
        </Link>
      </main>
    );
  }

  const Icon = iconMap[category.icon] || HelpCircle;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Smart Search */}
      <div className="pt-6 pb-4">
        <div className="max-w-lg">
          <InlineSmartSearch
            currentCategoryId={id}
            onJumpToArticle={jumpToArticle}
            navigate={navigate}
          />
        </div>
      </div>

      {/* Category Header */}
      <section className="pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-light rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-green" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">
              {category.name[lang]}
            </h1>
            <p className="text-sm text-muted">{category.description[lang]}</p>
          </div>
        </div>
      </section>

      {/* Articles */}
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted text-sm">
              {t("noResults")}
            </p>
          </div>
        )}
      </section>

      <ContactCTA />
    </main>
  );
}
