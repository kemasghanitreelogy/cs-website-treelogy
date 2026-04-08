import { NavLink, useLocation } from "react-router-dom";
import { HelpCircle, BookOpen, Leaf } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

/* ─── Parent Menu Definitions (scalable) ─── */

const PARENT_MENUS = [
  {
    id: "faq",
    label: { id: "FAQ", en: "FAQ" },
    icon: HelpCircle,
    path: "/",
    matchFn: (pathname) => !pathname.startsWith("/playbook"),
  },
  {
    id: "playbook",
    label: { id: "Playbook", en: "Playbook" },
    icon: BookOpen,
    path: "/playbook",
    matchFn: (pathname) => pathname.startsWith("/playbook"),
  },
];

/* ─── Sidebar Component ─── */

export default function AppSidebar({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-56 bg-white border-r border-border flex flex-col transition-transform duration-300 lg:sticky lg:top-16 lg:z-auto lg:translate-x-0 lg:shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex-1 py-4 px-3 space-y-1">
          {PARENT_MENUS.map((menu) => {
            const Icon = menu.icon;
            const active = menu.matchFn(location.pathname);

            return (
              <NavLink
                key={menu.id}
                to={menu.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  active
                    ? "text-green bg-green-light/50"
                    : "text-muted hover:text-text hover:bg-card-hover"
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{menu.label[lang]}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-2 text-muted/50">
            <Leaf className="w-3.5 h-3.5 text-green/50" />
            <span className="text-[10px]">Treelogy Knowledge Base</span>
          </div>
        </div>
      </aside>
    </>
  );
}
