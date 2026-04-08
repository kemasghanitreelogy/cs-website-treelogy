import { useState, useEffect, useRef, useMemo } from "react";
import {
  BookOpen,
  ChevronDown,
  X,
  AlertTriangle,
  Info,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Search,
  Table2,
  FileText,
  MessageSquareWarning,
  Lightbulb,
  CornerDownRight,
  MessageCircle,
  ShieldAlert,
  Clock,
  Megaphone,
  Heart,
  Headphones,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { playbookSections } from "../data/playbook";

/* ─── Search Index Builder ─── */

function buildSearchIndex(lang) {
  const entries = [];

  for (const section of playbookSections) {
    for (const sub of section.subsections) {
      for (let blockIdx = 0; blockIdx < sub.blocks.length; blockIdx++) {
        const block = sub.blocks[blockIdx];
        const texts = [];
        let blockLabel = "";

        switch (block.type) {
          case "text":
            texts.push(block.content[lang] || block.content.id);
            break;
          case "heading":
            texts.push(block.content[lang] || block.content.id);
            break;
          case "bullets": {
            const items = block.items[lang] || block.items.id;
            items.forEach((item) => texts.push(item));
            break;
          }
          case "table":
            block.headers.forEach((h) => texts.push(h));
            block.rows.forEach((row) => row.forEach((cell) => texts.push(cell)));
            blockLabel = "table";
            break;
          case "warning":
            texts.push(block.content[lang] || block.content.id);
            blockLabel = "warning";
            break;
          case "note":
            texts.push(block.content[lang] || block.content.id);
            blockLabel = "note";
            break;
          case "macro":
            texts.push(block.label[lang] || block.label.id);
            texts.push(block.content);
            blockLabel = "macro";
            break;
          case "example":
            texts.push(block.bad);
            texts.push(block.good);
            texts.push(block.badReason[lang] || block.badReason.id);
            texts.push(block.goodReason[lang] || block.goodReason.id);
            blockLabel = "example";
            break;
        }

        const fullText = texts.join(" ").toLowerCase();
        if (!fullText.trim()) continue;

        entries.push({
          sectionId: section.id,
          sectionNumber: section.number,
          sectionTitle: section.title[lang],
          subsectionId: sub.id,
          subsectionTitle: sub.title[lang],
          blockIdx,
          blockType: block.type,
          blockLabel,
          fullText,
          snippetTexts: texts,
        });
      }
    }
  }

  return entries;
}

/* ─── Smart Search Logic ─── */

function tokenize(query) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreEntry(entry, tokens) {
  let score = 0;
  const text = entry.fullText;
  const title = entry.subsectionTitle.toLowerCase();
  const sectionTitle = entry.sectionTitle.toLowerCase();

  for (const token of tokens) {
    if (title.includes(token)) score += 10;
    if (sectionTitle.includes(token)) score += 5;
    if (text.includes(token)) score += 3;
    if (text.includes(tokens.join(" "))) score += 8;
  }

  if (entry.blockType === "macro") score += 2;
  if (entry.blockType === "warning") score += 1;

  return score;
}

function findSnippet(texts, tokens, maxLen = 120) {
  let bestText = "";
  let bestScore = -1;

  for (const t of texts) {
    const lower = t.toLowerCase();
    let s = 0;
    for (const tok of tokens) {
      if (lower.includes(tok)) s++;
    }
    if (s > bestScore) {
      bestScore = s;
      bestText = t;
    }
  }

  if (!bestText) return texts[0]?.substring(0, maxLen) || "";

  const lower = bestText.toLowerCase();
  let matchPos = lower.length;
  for (const tok of tokens) {
    const pos = lower.indexOf(tok);
    if (pos !== -1 && pos < matchPos) matchPos = pos;
  }

  const start = Math.max(0, matchPos - 30);
  const end = Math.min(bestText.length, start + maxLen);
  let snippet = bestText.substring(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < bestText.length) snippet = snippet + "...";

  return snippet;
}

function searchPlaybook(index, query) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = [];
  const seen = new Set();

  for (const entry of index) {
    const score = scoreEntry(entry, tokens);
    if (score <= 0) continue;

    const key = entry.subsectionId + "|" + entry.blockType + "|" + entry.blockIdx;
    if (seen.has(key)) continue;
    seen.add(key);

    scored.push({
      ...entry,
      score,
      snippet: findSnippet(entry.snippetTexts, tokens),
    });
  }

  scored.sort((a, b) => b.score - a.score);

  const subsectionBest = new Map();
  for (const item of scored) {
    if (!subsectionBest.has(item.subsectionId)) {
      subsectionBest.set(item.subsectionId, item);
    }
  }

  return Array.from(subsectionBest.values()).slice(0, 8);
}

/* ─── Quick Scenario Cards ─── */

const SCENARIOS = {
  id: [
    { icon: "complaint", label: "Komplain Masuk", desc: "Cara tangani keluhan", section: "sop-framework", sub: "complaint-resolution" },
    { icon: "macro", label: "Template Respons", desc: "Macro siap pakai", section: "tone-of-voice", sub: "response-macros" },
    { icon: "escalation", label: "Perlu Eskalasi?", desc: "Kapan & ke siapa", section: "sop-framework", sub: "escalation-flow" },
    { icon: "tone", label: "Nada & Gaya", desc: "Do's & Don'ts", section: "tone-of-voice", sub: "dos-and-donts" },
    { icon: "vip", label: "VIP Customer", desc: "Perlakuan khusus", section: "sop-framework", sub: "vip-handling" },
    { icon: "monitor", label: "Monitoring Harian", desc: "Checklist & ritme", section: "sop-framework", sub: "daily-monitoring" },
  ],
  en: [
    { icon: "complaint", label: "Complaint Received", desc: "How to handle", section: "sop-framework", sub: "complaint-resolution" },
    { icon: "macro", label: "Response Templates", desc: "Ready-to-use macros", section: "tone-of-voice", sub: "response-macros" },
    { icon: "escalation", label: "Need to Escalate?", desc: "When & to whom", section: "sop-framework", sub: "escalation-flow" },
    { icon: "tone", label: "Tone & Style", desc: "Do's & Don'ts", section: "tone-of-voice", sub: "dos-and-donts" },
    { icon: "vip", label: "VIP Customer", desc: "Special treatment", section: "sop-framework", sub: "vip-handling" },
    { icon: "monitor", label: "Daily Monitoring", desc: "Checklist & rhythm", section: "sop-framework", sub: "daily-monitoring" },
  ],
};

function ScenarioIcon({ type, className }) {
  switch (type) {
    case "complaint": return <ShieldAlert className={className} />;
    case "macro": return <MessageCircle className={className} />;
    case "escalation": return <Megaphone className={className} />;
    case "tone": return <Heart className={className} />;
    case "vip": return <Sparkles className={className} />;
    case "monitor": return <Clock className={className} />;
    default: return <Headphones className={className} />;
  }
}

/* ─── Popular Search Suggestions ─── */

const SUGGESTIONS = {
  id: [
    { text: "Macro respons", icon: "macro" },
    { text: "Eskalasi komplain", icon: "warning" },
    { text: "SLA response time", icon: "table" },
    { text: "Nada komunikasi", icon: "note" },
    { text: "Penanganan DM", icon: "text" },
    { text: "VIP customer", icon: "note" },
    { text: "Tracking number", icon: "macro" },
    { text: "Emoji yang disetujui", icon: "text" },
  ],
  en: [
    { text: "Response macros", icon: "macro" },
    { text: "Complaint escalation", icon: "warning" },
    { text: "SLA response time", icon: "table" },
    { text: "Tone of voice", icon: "note" },
    { text: "DM handling", icon: "text" },
    { text: "VIP customer", icon: "note" },
    { text: "Tracking number", icon: "macro" },
    { text: "Approved emojis", icon: "text" },
  ],
};

/* ─── Block Type Icons ─── */

function BlockTypeIcon({ type, className = "w-3.5 h-3.5" }) {
  switch (type) {
    case "table": return <Table2 className={className} />;
    case "macro": return <Copy className={className} />;
    case "warning": return <MessageSquareWarning className={className} />;
    case "note": return <Lightbulb className={className} />;
    case "example": return <ThumbsUp className={className} />;
    default: return <FileText className={className} />;
  }
}

/* ─── Highlight matching text ─── */

function HighlightText({ text, tokens }) {
  if (!tokens.length) return <>{text}</>;

  const regex = new RegExp(
    `(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200/80 text-text rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ─── Search Component ─── */

function PlaybookSearch({ onNavigate }) {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const index = useMemo(() => buildSearchIndex(lang), [lang]);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return searchPlaybook(index, query);
  }, [index, query]);

  const tokens = useMemo(() => tokenize(query), [query]);
  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.en;

  const showDropdown = isOpen && (query.length < 2 || results.length > 0 || query.length >= 2);

  useEffect(() => {
    setSelectedIdx(-1);
  }, [results]);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNavigate = (result) => {
    onNavigate(result.sectionId, result.subsectionId);
    setIsOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    const items = query.length >= 2 ? results : [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIdx >= 0 && items[selectedIdx]) {
      e.preventDefault();
      handleNavigate(items[selectedIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            lang === "id"
              ? "Cari solusi... (macro, SOP, eskalasi, komplain...)"
              : "Find a solution... (macros, SOP, escalation, complaint...)"
          }
          className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-border bg-card text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green transition-all duration-200 shadow-sm"
          aria-label="Search playbook"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full mt-2 left-0 right-0 bg-card rounded-xl border border-border shadow-xl overflow-hidden"
        >
          {query.length < 2 && (
            <div className="p-3">
              <p className="text-[11px] font-medium text-muted/60 uppercase tracking-wide px-1 mb-2">
                {lang === "id" ? "Coba cari" : "Try searching"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s.text)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-border text-muted hover:text-text hover:border-green/40 hover:bg-green-light/30 transition-colors duration-200 cursor-pointer"
                  >
                    <BlockTypeIcon type={s.icon} className="w-3 h-3" />
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.length >= 2 && results.length > 0 && (
            <div className="max-h-[26rem] overflow-y-auto">
              <p className="text-[11px] font-medium text-muted/60 uppercase tracking-wide px-4 pt-3 pb-1.5">
                {results.length} {lang === "id" ? "solusi ditemukan" : "solutions found"}
              </p>
              {results.map((r, i) => (
                <button
                  key={r.subsectionId + r.blockIdx}
                  onClick={() => handleNavigate(r)}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={`w-full text-left px-4 py-3 cursor-pointer transition-colors duration-150 group ${
                    selectedIdx === i ? "bg-green-light/50" : "hover:bg-card-hover"
                  } ${i < results.length - 1 ? "border-b border-border/50" : ""}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono text-green bg-green-light px-1.5 py-0.5 rounded">
                      {r.sectionNumber}
                    </span>
                    <span className="text-[11px] text-muted truncate">{r.sectionTitle}</span>
                    <CornerDownRight className="w-2.5 h-2.5 text-muted/40 flex-shrink-0" />
                    <span className="text-[11px] text-text font-medium truncate">{r.subsectionTitle}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    <HighlightText text={r.snippet} tokens={tokens} />
                  </p>
                  {r.blockLabel && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <BlockTypeIcon type={r.blockType} className="w-3 h-3 text-muted/50" />
                      <span className="text-[10px] text-muted/50 uppercase tracking-wide">{r.blockLabel}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-muted/30 mx-auto mb-2" />
              <p className="text-sm text-muted">
                {lang === "id" ? "Tidak ada hasil untuk" : "No results for"}{" "}
                <span className="font-medium text-text">"{query}"</span>
              </p>
              <p className="text-xs text-muted/60 mt-1">
                {lang === "id"
                  ? "Coba kata kunci lain seperti: macro, SOP, eskalasi, nada"
                  : "Try other keywords like: macro, SOP, escalation, tone"}
              </p>
            </div>
          )}

          {query.length >= 2 && results.length > 0 && (
            <div className="px-4 py-2 bg-card-hover/50 border-t border-border flex items-center gap-3 text-[10px] text-muted/50">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded border border-border bg-card text-[9px] font-mono">↑↓</kbd>{" "}
                {lang === "id" ? "navigasi" : "navigate"}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded border border-border bg-card text-[9px] font-mono">↵</kbd>{" "}
                {lang === "id" ? "pilih" : "select"}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded border border-border bg-card text-[9px] font-mono">esc</kbd>{" "}
                {lang === "id" ? "tutup" : "close"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar Navigation ─── */

function SidebarNav({ activeSection, activeSubsection, onSelect, mobile = false }) {
  const { lang } = useLanguage();
  const [expandedSections, setExpandedSections] = useState([activeSection]);

  useEffect(() => {
    setExpandedSections([activeSection]);
  }, [activeSection]);

  const toggleSection = (id) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <nav className={mobile ? "" : "sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"} aria-label="Playbook navigation">
      <ul className="space-y-1">
        {playbookSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const isSectionActive = activeSection === section.id;

          return (
            <li key={section.id}>
              <button
                onClick={() => {
                  toggleSection(section.id);
                  onSelect(section.id, section.subsections[0].id);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm rounded-lg cursor-pointer transition-colors duration-200 ${
                  isSectionActive
                    ? "bg-green-light text-green font-medium"
                    : "text-muted hover:bg-card-hover hover:text-text"
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono text-muted/60 flex-shrink-0">{section.number}</span>
                  <span className="truncate">{section.title[lang]}</span>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {isExpanded && (
                <ul className="ml-6 mt-1 space-y-0.5 border-l border-border pl-3">
                  {section.subsections.map((sub) => (
                    <li key={sub.id}>
                      <a
                        href={`#${sub.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelect(section.id, sub.id);
                        }}
                        className={`block px-2 py-1.5 text-xs rounded cursor-pointer transition-colors duration-200 ${
                          activeSubsection === sub.id
                            ? "text-green font-medium bg-green-light/50"
                            : "text-muted hover:text-text"
                        }`}
                      >
                        {sub.title[lang]}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ─── Block Renderers ─── */

function TextBlock({ block, lang }) {
  const content = block.content[lang] || block.content.id;
  return <p className="text-[13px] text-muted leading-relaxed">{content}</p>;
}

function HeadingBlock({ block, lang }) {
  const content = block.content[lang] || block.content.id;
  return (
    <h4 className="text-[13px] font-semibold text-text mt-3 mb-1.5 flex items-center gap-2">
      <span className="w-1 h-4 bg-green rounded-full flex-shrink-0" />
      {content}
    </h4>
  );
}

function BulletsBlock({ block, lang }) {
  const items = block.items[lang] || block.items.id;
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[13px] text-muted leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-green flex-shrink-0 mt-[7px]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TableBlock({ block }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr>
            {block.headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-3.5 py-2.5 bg-card-hover text-text font-semibold text-[11px] uppercase tracking-wider border-b border-border"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-b-0 hover:bg-card-hover/50 transition-colors">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3.5 py-3 text-[13px] leading-relaxed ${
                    j === 0 ? "text-text font-medium" : "text-muted"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WarningBlock({ block, lang }) {
  const content = block.content[lang] || block.content.id;
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200/80">
      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-1">
          {lang === "id" ? "Perhatian" : "Warning"}
        </p>
        <p className="text-[13px] text-amber-800 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function NoteBlock({ block, lang }) {
  const content = block.content[lang] || block.content.id;
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200/80">
      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Info className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide mb-1">
          {lang === "id" ? "Catatan" : "Note"}
        </p>
        <p className="text-[13px] text-blue-800 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

function MacroBlock({ block, lang }) {
  const [copied, setCopied] = useState(false);
  const label = block.label[lang] || block.label.id;

  const handleCopy = () => {
    navigator.clipboard.writeText(block.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-lg border border-green/20 bg-green-light/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-green-light/50 border-b border-green/15">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-3.5 h-3.5 text-green" />
          <span className="text-xs font-semibold text-green uppercase tracking-wide">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
            copied
              ? "bg-green text-white"
              : "bg-card border border-border text-muted hover:text-green hover:border-green/40"
          }`}
          aria-label="Copy macro"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" /><span>Copied!</span></>
          ) : (
            <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
          )}
        </button>
      </div>
      <pre className="px-4 py-3.5 text-[13px] text-text/80 leading-relaxed whitespace-pre-wrap font-sans">
        {block.content}
      </pre>
    </div>
  );
}

function ExampleBlock({ block, lang }) {
  const badReason = block.badReason[lang] || block.badReason.id;
  const goodReason = block.goodReason[lang] || block.goodReason.id;

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="rounded-lg border border-red-200 bg-red-50/40 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-100/50 border-b border-red-200">
          <div className="w-5 h-5 rounded-full bg-red-200/60 flex items-center justify-center">
            <ThumbsDown className="w-3 h-3 text-red-600" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold text-red-700 uppercase tracking-wide">
            {lang === "id" ? "Hindari" : "Avoid"}
          </span>
        </div>
        <div className="px-4 py-3.5 space-y-2.5">
          <p className="text-[13px] text-red-900/80 italic leading-relaxed">{block.bad}</p>
          <div className="flex gap-2 items-start">
            <span className="text-[10px] font-semibold text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0 mt-0.5">
              {lang === "id" ? "Alasan" : "Why"}
            </span>
            <p className="text-xs text-red-700/80 leading-relaxed">{badReason}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100/50 border-b border-emerald-200">
          <div className="w-5 h-5 rounded-full bg-emerald-200/60 flex items-center justify-center">
            <ThumbsUp className="w-3 h-3 text-emerald-600" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
            {lang === "id" ? "Gunakan" : "Use this"}
          </span>
        </div>
        <div className="px-4 py-3.5 space-y-2.5">
          <p className="text-[13px] text-emerald-900/80 italic leading-relaxed">{block.good}</p>
          <div className="flex gap-2 items-start">
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0 mt-0.5">
              {lang === "id" ? "Alasan" : "Why"}
            </span>
            <p className="text-xs text-emerald-700/80 leading-relaxed">{goodReason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockRenderer({ block, lang }) {
  switch (block.type) {
    case "text": return <TextBlock block={block} lang={lang} />;
    case "heading": return <HeadingBlock block={block} lang={lang} />;
    case "bullets": return <BulletsBlock block={block} lang={lang} />;
    case "table": return <TableBlock block={block} />;
    case "warning": return <WarningBlock block={block} lang={lang} />;
    case "note": return <NoteBlock block={block} lang={lang} />;
    case "macro": return <MacroBlock block={block} lang={lang} />;
    case "example": return <ExampleBlock block={block} lang={lang} />;
    default: return null;
  }
}

/* ─── Subsection Content ─── */

function SubsectionContent({ subsection, lang, isHighlighted }) {
  return (
    <div
      id={subsection.id}
      className={`scroll-mt-24 transition-all duration-700 ${
        isHighlighted ? "ring-2 ring-green/40 ring-offset-2 rounded-xl" : ""
      }`}
    >
      <h3 className="text-[15px] font-bold text-text mb-4 flex items-center gap-2">
        {subsection.title[lang]}
      </h3>
      <div className="space-y-4">
        {subsection.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} lang={lang} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function PlaybookPage() {
  const { lang, t } = useLanguage();
  const [activeSection, setActiveSection] = useState(playbookSections[0].id);
  const [activeSubsection, setActiveSubsection] = useState(
    playbookSections[0].subsections[0].id
  );
  const [highlightedSub, setHighlightedSub] = useState(null);

  const currentSection = playbookSections.find((s) => s.id === activeSection);
  const scenarios = SCENARIOS[lang] || SCENARIOS.en;

  const handleSelect = (sectionId, subId) => {
    setActiveSection(sectionId);
    setActiveSubsection(subId);

    // Highlight the target subsection briefly
    setHighlightedSub(subId);
    setTimeout(() => setHighlightedSub(null), 2000);

    setTimeout(() => {
      document.getElementById(subId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Page title + Search */}
      <div className="pt-6 pb-6 border-b border-border mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-green-light rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-green" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">
              {lang === "id" ? "Playbook Operasi CX" : "CX Operations Playbook"}
            </h1>
            <p className="text-sm text-muted">
              {lang === "id"
                ? "Panduan lengkap untuk operasi dan komunikasi brand"
                : "Complete guide for operations and brand communication"}
            </p>
          </div>
        </div>
        <PlaybookSearch onNavigate={handleSelect} />
      </div>

      {/* Quick Scenario Cards */}
      <div className="mb-8">
        <p className="text-xs font-medium text-muted/60 uppercase tracking-wide mb-3">
          {lang === "id" ? "Akses Cepat" : "Quick Access"}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {scenarios.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSelect(s.section, s.sub)}
              className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-border bg-card hover:border-green/40 hover:bg-green-light/20 hover:shadow-sm transition-all duration-200 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-card-hover group-hover:bg-green-light flex items-center justify-center transition-colors duration-200">
                <ScenarioIcon type={s.icon} className="w-4 h-4 text-muted group-hover:text-green transition-colors duration-200" />
              </div>
              <span className="text-xs font-medium text-text text-center leading-tight">{s.label}</span>
              <span className="text-[10px] text-muted/60 text-center leading-tight">{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-8 pb-12">
        {/* Section sidebar */}
        <aside className="hidden md:block w-60 flex-shrink-0">
          <SidebarNav
            activeSection={activeSection}
            activeSubsection={activeSubsection}
            onSelect={handleSelect}
          />
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Section header */}
          <div className="mb-6">
            <span className="text-xs font-mono text-green uppercase tracking-wider">
              {lang === "id" ? "Bagian" : "Section"} {currentSection?.number}
            </span>
            <h2 className="text-lg font-bold text-text mt-1">
              {currentSection?.title[lang]}
            </h2>
            {currentSection?.description && (
              <p className="text-sm text-muted mt-1">{currentSection.description[lang]}</p>
            )}
          </div>

          {/* Subsections */}
          <div className="space-y-6">
            {currentSection?.subsections.map((sub) => (
              <div
                key={sub.id}
                className="bg-card rounded-xl border border-border p-5 sm:p-6"
              >
                <SubsectionContent
                  subsection={sub}
                  lang={lang}
                  isHighlighted={highlightedSub === sub.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
