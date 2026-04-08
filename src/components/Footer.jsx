import { Leaf } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-muted text-sm">
          <Leaf className="w-4 h-4 text-green" aria-hidden="true" />
          <span>{t("footer")}</span>
        </div>
        <p className="text-xs text-muted/60">
          &copy; {new Date().getFullYear()} Treelogy
        </p>
      </div>
    </footer>
  );
}
