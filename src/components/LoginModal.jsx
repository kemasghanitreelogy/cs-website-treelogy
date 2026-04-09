import { useState, useEffect, useRef } from "react";
import { LogIn, X, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ onClose, onSuccess }) {
  const { lang } = useLanguage();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const backdropRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 100);
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password) {
      setError(lang === "id" ? "Masukkan username dan password" : "Enter username and password");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      onSuccess?.();
      onClose();
    } catch (err) {
      if (err.message === "INVALID_CREDENTIALS") {
        setError(lang === "id" ? "Username atau password salah" : "Invalid username or password");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl border border-border animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-light flex items-center justify-center">
              <LogIn className="w-5 h-5 text-green" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text">
                {lang === "id" ? "Masuk" : "Login"}
              </h2>
              <p className="text-[11px] text-muted">
                {lang === "id" ? "Masuk untuk mengelola FAQ" : "Login to manage FAQ"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-text hover:bg-card-hover transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleLogin} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Username
            </label>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(null); }}
              placeholder={lang === "id" ? "Masukkan username..." : "Enter your username..."}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder={lang === "id" ? "Masukkan password..." : "Enter your password..."}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/50">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green hover:bg-green/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading
              ? lang === "id" ? "Memproses..." : "Processing..."
              : lang === "id" ? "Masuk" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
