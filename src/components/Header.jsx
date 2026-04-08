import { Link } from "react-router-dom";
import { Leaf, Globe, Menu } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Header({ onToggleSidebar }) {
  const { lang, toggleLang } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-muted hover:text-text cursor-pointer p-1.5 -ml-1.5 rounded-lg hover:bg-card-hover transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 text-text font-semibold text-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
          >
            <Leaf className="w-6 h-6 text-green" aria-hidden="true" />
            <span>Treelogy</span>
          </Link>
        </div>

        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-muted hover:text-text hover:border-primary transition-colors duration-200 cursor-pointer"
          aria-label={`Switch to ${lang === "id" ? "English" : "Bahasa Indonesia"}`}
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span>{lang === "id" ? "EN" : "ID"}</span>
        </button>
      </div>
    </header>
  );
}
