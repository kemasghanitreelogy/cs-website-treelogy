import { useState, useEffect, useRef } from "react";
import { X, Mail, KeyRound, ShieldCheck, Loader2, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const STEPS = { REQUEST: 0, VERIFY: 1, NEWPASS: 2, DONE: 3 };

export default function ChangePasswordModal({ onClose }) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [step, setStep] = useState(STEPS.REQUEST);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpRefs = useRef([]);
  const backdropRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Step 1: Request OTP
  const handleRequestOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await supabase.functions.invoke("send-otp", {
        body: { user_id: user.id },
      });

      // supabase.functions.invoke puts non-2xx responses in res.error
      // but the actual JSON body with the detailed error may be in res.error.context
      if (res.error) {
        // Try to extract JSON error from the response body
        let detail = null;
        try {
          const ctx = res.error.context;
          if (ctx && typeof ctx.json === "function") {
            detail = await ctx.json();
          }
        } catch {}
        if (detail?.error) {
          if (detail.error === "NO_EMAIL") {
            setError(lang === "id" ? "Email belum terdaftar. Hubungi admin." : "No email registered. Contact admin.");
          } else if (detail.error === "Email service not configured") {
            setError(lang === "id" ? "Layanan email belum dikonfigurasi. Hubungi admin." : "Email service not configured. Contact admin.");
          } else if (detail.error === "Failed to send email") {
            setError(lang === "id" ? "Gagal mengirim email. Coba lagi nanti." : "Failed to send email. Try again later.");
          } else {
            setError(detail.error);
          }
        } else {
          setError(res.error.message);
        }
        return;
      }

      if (res.data?.error) {
        if (res.data.error === "NO_EMAIL") {
          setError(lang === "id" ? "Email belum terdaftar. Hubungi admin." : "No email registered. Contact admin.");
        } else {
          throw new Error(res.data.error);
        }
        return;
      }

      setMaskedEmail(res.data.email);
      setStep(STEPS.VERIFY);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // OTP input handler
  const handleOtpChange = (idx, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[idx] = value.slice(-1);
    setOtp(next);
    setError(null);
    if (value && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError(lang === "id" ? "Masukkan 6 digit kode OTP" : "Enter 6-digit OTP code");
      return;
    }
    setStep(STEPS.NEWPASS);
    setError(null);
  };

  // Step 3: Change password
  const handleChangePassword = async () => {
    if (newPassword.length < 4) {
      setError(lang === "id" ? "Password minimal 4 karakter" : "Password must be at least 4 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(lang === "id" ? "Password tidak cocok" : "Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcErr } = await supabase.rpc("verify_otp_change_password", {
        p_user_id: user.id,
        p_code: otp.join(""),
        p_new_password: newPassword,
      });

      if (rpcErr) throw rpcErr;
      if (data?.error === "INVALID_OTP") {
        setError(lang === "id" ? "Kode OTP salah atau sudah kadaluarsa" : "Invalid or expired OTP code");
        setStep(STEPS.VERIFY);
        return;
      }

      setStep(STEPS.DONE);
    } catch (err) {
      setError(err.message);
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
              <KeyRound className="w-5 h-5 text-green" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text">
                {lang === "id" ? "Ganti Password" : "Change Password"}
              </h2>
              <p className="text-[11px] text-muted">
                {lang === "id" ? "Verifikasi melalui email" : "Verify via email"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-muted hover:text-text hover:bg-card-hover transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Step indicator */}
          {step < STEPS.DONE && (
            <div className="flex items-center gap-2 mb-5">
              {[0, 1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    step > s ? "bg-green text-white" : step === s ? "bg-green text-white" : "bg-card-hover text-muted/50"
                  }`}>
                    {step > s ? <Check className="w-3.5 h-3.5" /> : s + 1}
                  </div>
                  {s < 2 && <div className={`flex-1 h-0.5 rounded-full transition-colors ${step > s ? "bg-green" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Request OTP */}
          {step === STEPS.REQUEST && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <Mail className="w-10 h-10 text-green/60 mx-auto mb-3" />
                <p className="text-sm text-text font-medium mb-1">
                  {lang === "id" ? "Kirim kode OTP" : "Send OTP Code"}
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  {lang === "id"
                    ? "Kami akan mengirim kode verifikasi 6 digit ke email yang terdaftar pada akun Anda."
                    : "We will send a 6-digit verification code to the email registered on your account."}
                </p>
              </div>
              <button
                onClick={handleRequestOtp}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green hover:bg-green/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {loading
                  ? lang === "id" ? "Mengirim..." : "Sending..."
                  : lang === "id" ? "Kirim Kode OTP" : "Send OTP Code"}
              </button>
            </div>
          )}

          {/* Step 2: Enter OTP */}
          {step === STEPS.VERIFY && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <ShieldCheck className="w-10 h-10 text-green/60 mx-auto mb-3" />
                <p className="text-sm text-text font-medium mb-1">
                  {lang === "id" ? "Masukkan Kode OTP" : "Enter OTP Code"}
                </p>
                <p className="text-xs text-muted">
                  {lang === "id" ? "Kode dikirim ke" : "Code sent to"}{" "}
                  <span className="font-medium text-text">{maskedEmail}</span>
                </p>
              </div>

              {/* OTP input boxes */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setStep(STEPS.REQUEST); setOtp(["", "", "", "", "", ""]); setError(null); }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-muted hover:text-text rounded-lg border border-border hover:bg-card-hover transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {lang === "id" ? "Kirim Ulang" : "Resend"}
                </button>
                <button
                  onClick={handleVerifyOtp}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green hover:bg-green/90 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  {lang === "id" ? "Verifikasi" : "Verify"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === STEPS.NEWPASS && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">
                  {lang === "id" ? "Password Baru" : "New Password"}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
                  placeholder={lang === "id" ? "Masukkan password baru..." : "Enter new password..."}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted mb-1.5 block">
                  {lang === "id" ? "Konfirmasi Password" : "Confirm Password"}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                  placeholder={lang === "id" ? "Ulangi password baru..." : "Repeat new password..."}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green hover:bg-green/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                {loading
                  ? lang === "id" ? "Menyimpan..." : "Saving..."
                  : lang === "id" ? "Simpan Password" : "Save Password"}
              </button>
            </div>
          )}

          {/* Step 4: Done */}
          {step === STEPS.DONE && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-light flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-green" />
              </div>
              <h3 className="text-base font-semibold text-text mb-1">
                {lang === "id" ? "Password Berhasil Diubah!" : "Password Changed!"}
              </h3>
              <p className="text-xs text-muted mb-5">
                {lang === "id" ? "Gunakan password baru untuk login selanjutnya." : "Use your new password for future logins."}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-white bg-green hover:bg-green/90 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {lang === "id" ? "Selesai" : "Done"}
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 mt-3 rounded-lg bg-red-50 border border-red-200/50">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
