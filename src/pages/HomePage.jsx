import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Search, X, ChevronRight, Sparkles } from "lucide-react";
import SearchBar from "../components/SearchBar";
import CategoryCard from "../components/CategoryCard";
import Accordion from "../components/Accordion";
import ContactCTA from "../components/ContactCTA";
import { useLanguage } from "../context/LanguageContext";
import { categories, articles, searchArticles } from "../data/knowledgeBase";

/* ─── Smart Search Index ─── */

function buildIndex(lang) {
  return articles.map((a) => {
    const q = (a.question[lang] || a.question.id);
    const ans = (a.answer[lang] || a.answer.id);
    const cat = categories.find((c) => c.id === a.categoryId);
    return {
      id: a.id,
      categoryId: a.categoryId,
      categoryName: cat ? cat.name[lang] || cat.name.id : "",
      question: q,
      answer: ans,
      qLower: q.toLowerCase(),
      searchText: q.toLowerCase() + " " + ans.toLowerCase(),
      article: a,
    };
  });
}

function smartSearch(index, query) {
  const raw = query.trim().toLowerCase();
  if (raw.length < 2) return [];
  const tokens = raw.split(/\s+/).filter((t) => t.length > 1);
  if (!tokens.length) return [];

  const scored = [];
  for (const entry of index) {
    let score = 0;

    // Exact substring in question = highest
    if (entry.qLower.includes(raw)) score += 25;

    for (const tok of tokens) {
      // Token start-of-word match in question (higher than mid-word)
      const wordBoundary = new RegExp(`(^|\\s)${tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      if (wordBoundary.test(entry.qLower)) score += 12;
      else if (entry.qLower.includes(tok)) score += 8;

      // Answer match
      if (entry.searchText.includes(tok)) score += 3;
    }

    // Multi-word phrase bonus
    if (tokens.length > 1 && entry.qLower.includes(tokens.join(" "))) score += 15;

    if (score > 0) scored.push({ ...entry, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8);
}

/* ─── Highlight ─── */

function HighlightText({ text, query }) {
  const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
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

/* ─── Answer snippet ─── */

function getAnswerSnippet(answer, query, maxLen = 100) {
  const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
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
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  const index = useMemo(() => buildIndex(lang), [lang]);
  const results = useMemo(() => smartSearch(index, query), [index, query]);

  const POPULAR_QUERIES = useMemo(() => lang === "id"
    ? ["Moringa", "Dosis kapsul", "Cara pakai powder", "Aman untuk ibu hamil", "Perbedaan capsules powder", "Harga"]
    : ["Moringa", "Capsule dosage", "How to use powder", "Safe for pregnant", "Capsules vs powder", "Price"], [lang]);

  useEffect(() => { setSelectedIdx(-1); }, [results]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target) && !inputRef.current?.contains(e.target)) setIsOpen(false);
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
    }
    else if (e.key === "Escape") { setIsOpen(false); inputRef.current?.blur(); }
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
          placeholder={lang === "id" ? "Ketik pertanyaan Anda... cth: dosis, manfaat, harga" : "Type your question... e.g.: dosage, benefits, price"}
          className="w-full pl-12 pr-10 py-3.5 text-sm rounded-xl border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green shadow-sm transition-all duration-200"
          autoComplete="off"
          aria-label="Search FAQ"
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div ref={dropRef} className="absolute z-50 top-full mt-2 left-0 right-0 bg-card rounded-xl border border-border shadow-xl overflow-hidden">
          {/* No query: popular suggestions */}
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

          {/* Results */}
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

          {/* No results */}
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

          {/* Keyboard hints */}
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

/* ─── Page ─── */

const POPULAR_IDS = [1, 3, 7, 8, 15, 26];

export default function HomePage() {
  const { t } = useLanguage();
  const popularArticles = articles.filter((a) => POPULAR_IDS.includes(a.id));

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-green-light rounded-2xl flex items-center justify-center">
            <Leaf className="w-7 h-7 text-green" aria-hidden="true" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3 tracking-tight">
          {t("heroTitle")}
        </h1>
        <p className="text-muted text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          {t("heroSubtitle")}
        </p>
        <HeroSmartSearch />
      </section>

      {/* Popular Questions */}
      <section className="pb-10">
        <h2 className="text-lg font-semibold text-text mb-4">{t("popularQuestions")}</h2>
        <div className="space-y-3">
          {popularArticles.map((article) => (
            <Accordion key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="pb-8">
        <h2 className="text-lg font-semibold text-text mb-4">{t("browseCategories")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}
