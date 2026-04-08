import { useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function SearchBar({ large = false, initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative flex items-center bg-white border border-border rounded-xl shadow-sm focus-within:border-cta focus-within:ring-2 focus-within:ring-cta/20 transition-all duration-200 ${
          large ? "h-14" : "h-11"
        }`}
      >
        <Search
          className={`absolute left-4 text-muted ${large ? "w-5 h-5" : "w-4 h-4"}`}
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className={`w-full bg-transparent outline-none text-text placeholder:text-muted/60 ${
            large ? "pl-12 pr-12 text-base" : "pl-10 pr-10 text-sm"
          }`}
          aria-label={t("searchPlaceholder")}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 text-muted hover:text-text cursor-pointer transition-colors duration-200"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
