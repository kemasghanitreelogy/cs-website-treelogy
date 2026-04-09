import { Link } from "react-router-dom";
import {
  ChevronRight,
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
  Droplets,
  Stethoscope,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useData } from "../context/DataContext";

const iconMap = { Leaf, Pill, Clock, Heart, ShieldCheck, Package, Truck, MessageCircle, Users, ShoppingBag, HelpCircle, Droplets, Stethoscope };

export default function CategoryCard({ category }) {
  const { lang, t } = useLanguage();
  const { getArticlesByCategory } = useData();
  const Icon = iconMap[category.icon] || HelpCircle;
  const articleCount = getArticlesByCategory(category.id).length;

  return (
    <Link
      to={`/category/${category.id}`}
      className="group flex items-start gap-4 p-5 bg-card rounded-xl border border-border hover:border-green/30 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-green-light rounded-lg flex items-center justify-center group-hover:bg-green/10 transition-colors duration-200">
        <Icon className="w-5 h-5 text-green" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text text-sm leading-tight group-hover:text-green transition-colors duration-200">
          {category.name[lang]}
        </h3>
        <p className="text-muted text-xs mt-1 leading-relaxed line-clamp-2">
          {category.description[lang]}
        </p>
        {articleCount > 0 && (
          <span className="text-xs text-muted/70 mt-1.5 inline-block">
            {articleCount} {t("articles")}
          </span>
        )}
      </div>
      <ChevronRight
        className="w-4 h-4 text-muted/40 group-hover:text-green flex-shrink-0 mt-1 transition-colors duration-200"
        aria-hidden="true"
      />
    </Link>
  );
}
