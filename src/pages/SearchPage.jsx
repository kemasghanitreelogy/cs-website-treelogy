import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, X, SearchX, CornerDownRight, ChevronRight, Loader2 } from "lucide-react";
import CategoryCard from "../components/CategoryCard";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";

/* ─── Smart Search Engine ─── */

function buildIndex(articles, categories, lang) {
  return articles.map((a) => {
    const q = a.question[lang] || a.question.id;
    const ans = a.answer[lang] || a.answer.id;
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

function smartSearch(index, query, limit = 20) {
  const raw = query.trim().toLowerCase();
  if (raw.length < 2) return [];
  const tokens = raw.split(/\s+/).filter((t) => t.length > 1);
  if (!tokens.length) return [];

  const scored = [];
  for (const entry of index) {
    let score = 0;
    if (entry.qLower.includes(raw)) score += 25;
    for (const tok of tokens) {
      const wordBoundary = new RegExp(`(^|\\s)${tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      if (wordBoundary.test(entry.qLower)) score += 12;
      else if (entry.qLower.includes(tok)) score += 8;
      if (entry.searchText.includes(tok)) score += 3;
    }
    if (tokens.length > 1 && entry.qLower.includes(tokens.join(" "))) score += 15;
    if (score > 0) scored.push({ ...entry, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
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

function getAnswerSnippet(answer, query, maxLen = 120) {
  const tokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  const lower = answer.toLowerCase();
  let pos = 0;
  for (const tok of tokens) {
    const idx = lower.indexOf(tok);
    if (idx !== -1 && idx > pos) pos = idx;
  }
  const start = Math.max(0, pos - 25);
  const end = Math.min(answer.length, start + maxLen);
  let snippet = answer.substring(start, end).replace(/\n/g, " ");
  if (start > 0) snippet = "..." + snippet;
  if (end < answer.length) snippet += "...";
  return snippet;
}

/* ─── Search Page ─── */

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { articles, categories, loading } = useData();

  const [query, setQuery] = useState(initialQuery);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef(null);

  const index = useMemo(() => buildIndex(articles, categories, lang), [articles, categories, lang]);
  const results = useMemo(() => smartSearch(index, query), [index, query]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed) setSearchParams({ q: trimmed }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [query, setSearchParams]);

  useEffect(() => { setSelectedIdx(-1); }, [results]);

  const handleSelect = useCallback((entry) => {
    navigate(`/category/${entry.categoryId}?open=${entry.id}#faq-${entry.id}`);
  }, [navigate]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((p) => Math.min(p + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((p) => Math.max(p - 1, -1)); }
    else if (e.key === "Enter" && selectedIdx >= 0 && results[selectedIdx]) { e.preventDefault(); handleSelect(results[selectedIdx]); }
  };

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <Loader2 className="w-8 h-8 text-green animate-spin mx-auto" />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="pt-6 pb-4">
        <div className="max-w-lg">
          <div className="relative flex items-center bg-white border border-border rounded-xl shadow-sm focus-within:border-cta focus-within:ring-2 focus-within:ring-cta/20 transition-all duration-200 h-12">
            <Search className="absolute left-4 w-4.5 h-4.5 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent outline-none text-text placeholder:text-muted/60 pl-11 pr-10 text-sm"
              aria-label={t("searchPlaceholder")}
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-3 text-muted hover:text-text cursor-pointer transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {query.trim().length >= 2 && (
        <section className="pb-2">
          <p className="text-xs font-medium text-green uppercase tracking-wider">
            {results.length} {lang === "id" ? "jawaban ditemukan" : "answers found"}
          </p>
        </section>
      )}

      {query.trim().length >= 2 && results.length > 0 ? (
        <section className="pb-8">
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={r.id}
                onClick={() => handleSelect(r)}
                className={`group flex items-start gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-150 border ${
                  selectedIdx === i ? "bg-green-light/60 border-green/30" : "bg-white border-border hover:bg-card-hover hover:border-border"
                }`}
              >
                <CornerDownRight className="w-4 h-4 text-muted/50 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-green bg-green-light px-2 py-0.5 rounded-full">{r.categoryName}</span>
                  </div>
                  <p className="text-sm font-medium text-text leading-snug">
                    <HighlightText text={r.question} query={query} />
                  </p>
                  <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                    <HighlightText text={getAnswerSnippet(r.answer, query)} query={query} />
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted/40 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>
      ) : query.trim().length >= 2 ? (
        <section className="pb-8">
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <SearchX className="w-10 h-10 text-muted/40 mx-auto mb-3" aria-hidden="true" />
            <h2 className="font-semibold text-text mb-1">{t("noResults")}</h2>
            <p className="text-sm text-muted mb-6">{t("noResultsDesc")}</p>
          </div>
        </section>
      ) : null}

      {query.trim().length < 2 && (
        <section className="pb-8">
          <h2 className="text-lg font-semibold text-text mb-4">{t("browseCategories")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
