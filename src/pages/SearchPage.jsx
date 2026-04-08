import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import SearchBar from "../components/SearchBar";
import Accordion from "../components/Accordion";
import CategoryCard from "../components/CategoryCard";
import { useLanguage } from "../context/LanguageContext";
import { searchArticles, categories } from "../data/knowledgeBase";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { lang, t } = useLanguage();
  const results = query ? searchArticles(query, lang) : [];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Search */}
      <div className="pt-6 pb-4">
        <div className="max-w-md">
          <SearchBar initialValue={query} />
        </div>
      </div>

      {/* Results Header */}
      <section className="pb-4">
        <h1 className="text-xl font-bold text-text">
          {t("searchResults")}
        </h1>
        {query && (
          <p className="text-sm text-muted mt-1">
            {results.length} {t("resultsFor")} &ldquo;{query}&rdquo;
          </p>
        )}
      </section>

      {/* Results */}
      {results.length > 0 ? (
        <section className="pb-8">
          <div className="space-y-3">
            {results.map((article) => (
              <Accordion key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : (
        <section className="pb-8">
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <SearchX
              className="w-10 h-10 text-muted/40 mx-auto mb-3"
              aria-hidden="true"
            />
            <h2 className="font-semibold text-text mb-1">
              {t("noResults")}
            </h2>
            <p className="text-sm text-muted mb-6">{t("noResultsDesc")}</p>
          </div>

          {/* Browse categories fallback */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-text mb-4">
              {t("browseCategories")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
