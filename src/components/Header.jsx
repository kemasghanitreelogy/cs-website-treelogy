import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Globe, Menu, LogIn, LogOut, KeyRound, AlertTriangle } from "lucide-react";
import TreelogyLogo from "./TreelogyLogo";
import LoginModal from "./LoginModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function Header({ onToggleSidebar }) {
  const { lang, toggleLang } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const logoutBackdropRef = useRef(null);

  return (
    <>
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
              <TreelogyLogo className="w-6 h-6" />
              <span>Treelogy</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="hidden sm:flex items-center gap-2 mr-1">
                  <div className="w-7 h-7 rounded-full bg-green-light flex items-center justify-center">
                    <span className="text-xs font-semibold text-green">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-text">{user.name}</span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        user.role === "Owner"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "Developer"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
                {/* Change Password */}
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-muted hover:text-green hover:border-green/30 transition-colors duration-200 cursor-pointer"
                  aria-label={lang === "id" ? "Ganti Password" : "Change Password"}
                >
                  <KeyRound className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === "id" ? "Ganti Password" : "Change Password"}</span>
                </button>
                {/* Logout */}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-muted hover:text-red-500 hover:border-red-200 transition-colors duration-200 cursor-pointer"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === "id" ? "Keluar" : "Logout"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green/30 bg-green-light/30 text-sm font-medium text-green hover:bg-green-light hover:border-green/50 transition-colors duration-200 cursor-pointer"
                title={lang === "id" ? "Login untuk tambah, edit, atau hapus FAQ" : "Login to add, edit, or delete FAQ"}
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === "id" ? "Masuk untuk Kelola FAQ" : "Login to Manage FAQ"}</span>
              </button>
            )}

            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-muted hover:text-text hover:border-primary transition-colors duration-200 cursor-pointer"
              aria-label={`Switch to ${lang === "id" ? "English" : "Bahasa Indonesia"}`}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              <span>{lang === "id" ? "EN" : "ID"}</span>
            </button>
          </div>
        </div>
      </header>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => setShowLogin(false)}
        />
      )}

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}

      {showLogoutConfirm && (
        <div
          ref={logoutBackdropRef}
          onClick={(e) => { if (e.target === logoutBackdropRef.current) setShowLogoutConfirm(false); }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        >
          <div className="bg-card w-full max-w-xs rounded-2xl shadow-2xl border border-border animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="px-6 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-semibold text-text mb-1">
                {lang === "id" ? "Konfirmasi Logout" : "Confirm Logout"}
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {lang === "id"
                  ? "Apakah Anda yakin ingin keluar dari akun ini?"
                  : "Are you sure you want to log out of this account?"}
              </p>
            </div>
            <div className="flex border-t border-border">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 text-sm font-medium text-muted hover:text-text hover:bg-card-hover transition-colors cursor-pointer rounded-bl-2xl"
              >
                {lang === "id" ? "Batal" : "Cancel"}
              </button>
              <div className="w-px bg-border" />
              <button
                onClick={() => { setShowLogoutConfirm(false); logout(); }}
                className="flex-1 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer rounded-br-2xl"
              >
                {lang === "id" ? "Ya, Keluar" : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
