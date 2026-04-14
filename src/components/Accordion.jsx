import { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { ChevronDown, Copy, Check, Pencil, Trash2, User, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Accordion = forwardRef(function Accordion({ article, defaultOpen = false, highlight = false, onEdit, onDelete }, ref) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
  }));
  const [copied, setCopied] = useState(false);
  const { lang, t } = useLanguage();

  const question = article.question[lang] || article.question.id;
  const answer = article.answer[lang] || article.answer.id;

  const handleCopy = useCallback(async (e) => {
    e.stopPropagation();
    const textToCopy = answer;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [question, answer]);

  if (!answer) return null;

  return (
    <div
      id={`faq-${article.id}`}
      className={`border rounded-xl overflow-hidden bg-card transition-all duration-300 ${
        highlight ? "border-green/50 ring-2 ring-green/20" : "border-border"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-card-hover transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-sm text-text leading-snug">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-4 pt-0">
            <div className="border-t border-border pt-3">
              <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                {answer}
              </p>

              {/* Last updated / added by */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-[11px] text-muted/50">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-light/60 text-green flex-shrink-0">
                    <User className="w-2.5 h-2.5" />
                  </span>
                  <span className="font-medium text-muted/60">
                    {article.updated_at
                      ? `${lang === "id" ? "Diperbarui oleh" : "Updated by"} ${article.updater_name || "Admin"}`
                      : `${lang === "id" ? "Ditambahkan oleh" : "Added by"} ${article.updater_name || "Admin"}`
                    }
                  </span>
                  {(article.updated_at || article.created_at) && (
                    <>
                      <span className="text-muted/30">·</span>
                      <Clock className="w-2.5 h-2.5 text-muted/40" />
                      <span>
                        {new Date(article.updated_at || article.created_at).toLocaleDateString(
                          lang === "id" ? "id-ID" : "en-US",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5">
                  {onEdit && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(article); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted/60 hover:text-blue-600 rounded-lg hover:bg-blue-50 border border-border/60 hover:border-blue-200 transition-all duration-200 cursor-pointer"
                      title={lang === "id" ? "Edit FAQ" : "Edit FAQ"}
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(article); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted/60 hover:text-red-500 rounded-lg hover:bg-red-50 border border-border/60 hover:border-red-200 transition-all duration-200 cursor-pointer"
                      title={lang === "id" ? "Hapus FAQ" : "Delete FAQ"}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{lang === "id" ? "Hapus" : "Delete"}</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                    copied
                      ? "bg-green-light text-green"
                      : "text-muted hover:text-text hover:bg-card-hover border border-border/60 hover:border-border"
                  }`}
                  title={copied ? (lang === "id" ? "Tersalin!" : "Copied!") : (lang === "id" ? "Salin jawaban" : "Copy answer")}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{lang === "id" ? "Tersalin!" : "Copied!"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === "id" ? "Salin" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Accordion;
