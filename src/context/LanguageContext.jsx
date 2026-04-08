import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  id: {
    heroTitle: "Pusat Bantuan Treelogy",
    heroSubtitle:
      "Temukan jawaban seputar produk moringa Treelogy, cara konsumsi, manfaat, dan lainnya.",
    searchPlaceholder: "Cari pertanyaan atau topik...",
    categories: "Kategori",
    allCategories: "Semua Kategori",
    searchResults: "Hasil Pencarian",
    resultsFor: "hasil untuk",
    noResults: "Tidak ada hasil ditemukan",
    noResultsDesc: "Coba kata kunci lain atau jelajahi kategori di bawah.",
    backToHome: "Kembali ke Beranda",
    articles: "artikel",
    contactUs: "Hubungi Kami",
    contactDesc: "Tidak menemukan jawaban? Tim kami siap membantu.",
    contactButton: "Chat via WhatsApp",
    popularQuestions: "Pertanyaan Populer",
    browseCategories: "Jelajahi Kategori",
    footer: "Treelogy - Moringa untuk Kehidupan yang Lebih Baik",
  },
  en: {
    heroTitle: "Treelogy Help Center",
    heroSubtitle:
      "Find answers about Treelogy moringa products, usage, benefits, and more.",
    searchPlaceholder: "Search questions or topics...",
    categories: "Categories",
    allCategories: "All Categories",
    searchResults: "Search Results",
    resultsFor: "results for",
    noResults: "No results found",
    noResultsDesc: "Try different keywords or browse the categories below.",
    backToHome: "Back to Home",
    articles: "articles",
    contactUs: "Contact Us",
    contactDesc: "Can't find your answer? Our team is ready to help.",
    contactButton: "Chat via WhatsApp",
    popularQuestions: "Popular Questions",
    browseCategories: "Browse Categories",
    footer: "Treelogy - Moringa for a Better Life",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("id");

  const t = (key) => translations[lang][key] || key;

  const toggleLang = () => setLang((prev) => (prev === "id" ? "en" : "id"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
