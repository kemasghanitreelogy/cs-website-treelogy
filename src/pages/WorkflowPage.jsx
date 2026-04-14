import { useState, useRef, useCallback } from "react";
import {
  MessageCircle, GraduationCap, HeartPulse, TestTube, Wrench, Droplets,
  Package, Star, ChevronDown, ChevronRight, Copy, Check, ArrowRight,
  AlertTriangle, Clock, Pill, Leaf, Award, Globe, Sparkles,
  Shield, Sunrise, Sun, Moon, Search, X,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { workflowStages, quickReferenceCards } from "../data/workflow";

/* ─── Icon Map ─── */
const ICONS = {
  MessageCircle, GraduationCap, HeartPulse, TestTube, Wrench, Droplets,
  Package, Star, AlertTriangle, Clock, Pill, Leaf, Award, Globe,
  Sparkles, Shield, Sunrise, Sun, Moon,
};

const COLORS = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", ring: "ring-emerald-100", dot: "bg-emerald-500", line: "from-emerald-500" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200",    ring: "ring-blue-100",    dot: "bg-blue-500",    line: "from-blue-500" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-200",    ring: "ring-rose-100",    dot: "bg-rose-500",    line: "from-rose-500" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-200",  ring: "ring-violet-100",  dot: "bg-violet-500",  line: "from-violet-500" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200",   ring: "ring-amber-100",   dot: "bg-amber-500",   line: "from-amber-500" },
  teal:    { bg: "bg-teal-50",    text: "text-teal-600",    border: "border-teal-200",    ring: "ring-teal-100",    dot: "bg-teal-500",    line: "from-teal-500" },
  sky:     { bg: "bg-sky-50",     text: "text-sky-600",     border: "border-sky-200",     ring: "ring-sky-100",     dot: "bg-sky-500",     line: "from-sky-500" },
  yellow:  { bg: "bg-yellow-50",  text: "text-yellow-600",  border: "border-yellow-200",  ring: "ring-yellow-100",  dot: "bg-yellow-500",  line: "from-yellow-500" },
};

/* ─── Copy Button ─── */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-muted hover:text-green rounded-md hover:bg-green-light transition-colors cursor-pointer">
      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
    </button>
  );
}

/* ─── Template Block ─── */
function TemplateBlock({ text }) {
  return (
    <div className="relative mt-2 group">
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyBtn text={text} />
      </div>
      <pre className="text-[11px] leading-relaxed text-text/80 bg-card-hover/60 border border-border/50 rounded-lg px-3 py-2.5 whitespace-pre-wrap font-[inherit]">
        {text}
      </pre>
    </div>
  );
}

/* ─── Branch Connector ─── */
function BranchItem({ label, color, onClick }) {
  const c = COLORS[color] || COLORS.emerald;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-[12px] font-medium ${c.bg} ${c.text} ${c.border} border rounded-lg hover:ring-2 ${c.ring} transition-all cursor-pointer text-left w-full`}
    >
      <ArrowRight className="w-3 h-3 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );
}

/* ─── Stage Card (Expandable) ─── */
function StageCard({ stage, isExpanded, onToggle, onNavigate, lang }) {
  const c = COLORS[stage.color] || COLORS.emerald;
  const Icon = ICONS[stage.icon] || Sparkles;

  return (
    <div className={`border rounded-2xl transition-all duration-300 ${isExpanded ? `${c.border} shadow-md ring-1 ${c.ring}` : "border-border hover:border-border hover:shadow-sm"}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer"
      >
        {/* Phase badge */}
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${c.text}`}>
              Phase {stage.phase}
            </span>
            <span className="text-[10px] text-muted/40 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {stage.estimatedTime}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-text mt-0.5 truncate">{stage.title[lang]}</h3>
          <p className="text-[11px] text-muted mt-0.5 truncate">{stage.subtitle[lang]}</p>
        </div>

        <ChevronDown className={`w-4 h-4 text-muted/40 flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-border/50 pt-4">
          {stage.steps.map((step, si) => (
            <StepBlock key={si} step={step} stepIndex={si} stage={stage} lang={lang} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Step Block ─── */
function StepBlock({ step, stepIndex, stage, lang, onNavigate }) {
  const c = COLORS[stage.color] || COLORS.emerald;

  return (
    <div className="relative pl-6">
      {/* Step dot + connector line */}
      <div className="absolute left-0 top-0 flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${c.dot} ring-2 ring-white mt-1`} />
        <div className="w-px flex-1 bg-border/50 mt-1" />
      </div>

      <div className="pb-4">
        <h4 className="text-[13px] font-semibold text-text">{step.title[lang]}</h4>
        {step.description && (
          <p className="text-[11px] text-muted mt-1 leading-relaxed">{step.description[lang]}</p>
        )}

        {/* Template */}
        {step.template && <TemplateBlock text={step.template} />}

        {/* Branches (decision points) */}
        {step.branches && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2.5">
            {step.branches.map((b, i) => {
              const targetStage = workflowStages.find(s => s.id === b.goto);
              return (
                <BranchItem
                  key={i}
                  label={b.label[lang]}
                  color={targetStage?.color || stage.color}
                  onClick={() => onNavigate(b.goto)}
                />
              );
            })}
          </div>
        )}

        {/* Key Points */}
        {step.keyPoints && (
          <ul className="mt-2 space-y-1">
            {step.keyPoints.map((kp, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-text/80">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />
                {typeof kp === "string" ? kp : kp[lang]}
              </li>
            ))}
          </ul>
        )}

        {/* Products (education) */}
        {step.products && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2.5">
            {step.products.map((p, i) => {
              const PIcon = ICONS[p.icon] || Leaf;
              return (
                <div key={i} className="bg-card-hover/50 border border-border/50 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PIcon className={`w-4 h-4 ${c.text}`} />
                    <span className="text-[12px] font-semibold text-text">{p.name}</span>
                  </div>
                  <p className="text-[10px] text-muted leading-relaxed">{p.benefit[lang]}</p>
                  <p className="text-[10px] text-green font-medium mt-1">{p.dosage[lang]}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Decision Table */}
        {step.decisionTable && (
          <div className="mt-2.5 border border-border/50 rounded-lg overflow-hidden">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-card-hover/50">
                  <th className="px-3 py-2 text-left font-semibold text-muted/60 uppercase tracking-wider">
                    {lang === "id" ? "Kebutuhan" : "Need"}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-muted/60 uppercase tracking-wider">
                    {lang === "id" ? "Rekomendasi" : "Recommendation"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {step.decisionTable.map((row, i) => (
                  <tr key={i} className="border-t border-border/30">
                    <td className="px-3 py-2 text-text/80">{row.condition[lang]}</td>
                    <td className="px-3 py-2 font-medium text-green">{row.recommend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dosage Table */}
        {step.dosageTable && (
          <div className="mt-2.5 space-y-3">
            {Object.entries(step.dosageTable).map(([format, rows]) => (
              <div key={format}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {format === "capsule" ? <Pill className="w-3.5 h-3.5 text-violet-500" /> : <Leaf className="w-3.5 h-3.5 text-green" />}
                  <span className="text-[11px] font-semibold text-text capitalize">{format === "capsule" ? "Moringa Capsules" : "Moringa Powder"}</span>
                </div>
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  <table className="w-full text-[11px]">
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i} className={i > 0 ? "border-t border-border/30" : ""}>
                          <td className="px-3 py-1.5 text-muted/70 w-1/2">{r.phase[lang]}</td>
                          <td className="px-3 py-1.5 font-medium text-text">{r.dose[lang]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timing Guide */}
        {step.timingGuide && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5">
            {step.timingGuide.map((t, i) => {
              const TIcon = ICONS[t.icon] || Clock;
              return (
                <div key={i} className="bg-card-hover/50 border border-border/50 rounded-xl px-3 py-2.5 text-center">
                  <TIcon className={`w-4 h-4 ${c.text} mx-auto mb-1`} />
                  <p className="text-[11px] font-semibold text-text">{t.time[lang]}</p>
                  <p className="text-[10px] text-muted mt-0.5 leading-snug">{t.benefit[lang]}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Conditions (health check) */}
        {step.conditions && (
          <ConditionsAccordion conditions={step.conditions} lang={lang} color={stage.color} />
        )}

        {/* Rules list */}
        {step.rules && (
          <div className="mt-2 space-y-1">
            {step.rules.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <Shield className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-text/80">{r[lang]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reactions (troubleshooting) */}
        {step.reactions && (
          <div className="mt-2.5 space-y-2">
            {step.reactions.map((r, i) => (
              <div key={i} className="bg-amber-50/50 border border-amber-100 rounded-lg px-3 py-2.5">
                <p className="text-[11px] font-semibold text-amber-700">{r.symptom[lang]}</p>
                <p className="text-[10px] text-muted mt-1"><span className="font-medium">{lang === "id" ? "Penyebab" : "Cause"}:</span> {r.cause[lang]}</p>
                <p className="text-[10px] text-green mt-0.5"><span className="font-medium">{lang === "id" ? "Solusi" : "Solution"}:</span> {r.action[lang]}</p>
              </div>
            ))}
          </div>
        )}

        {/* Solutions list */}
        {step.solutions && (
          <ul className="mt-2 space-y-1">
            {step.solutions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-text/80">
                <Check className="w-3 h-3 text-green mt-0.5 flex-shrink-0" />
                {typeof s === "string" ? s : s[lang]}
              </li>
            ))}
          </ul>
        )}

        {/* Usages (oil guide) */}
        {step.usages && (
          <div className="mt-2.5 space-y-2">
            {step.usages.map((u, i) => (
              <div key={i} className="flex items-start gap-3 bg-teal-50/50 border border-teal-100 rounded-lg px-3 py-2.5">
                <Droplets className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-teal-700">{u.area[lang]}</p>
                  <p className="text-[10px] text-text/70 mt-0.5">{u.method[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Special Cases (oil) */}
        {step.specialCases && (
          <div className="mt-2.5 space-y-1.5">
            {step.specialCases.map((sc, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />
                <div>
                  <span className="font-semibold text-text">{sc.case[lang]}:</span>{" "}
                  <span className="text-text/70">{sc.advice[lang]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Conditions Accordion (Health Check) ─── */
function ConditionsAccordion({ conditions, lang, color }) {
  const [openIdx, setOpenIdx] = useState(null);
  const c = COLORS[color];

  return (
    <div className="mt-2.5 space-y-1.5">
      {conditions.map((cond, i) => (
        <div key={i} className={`border rounded-lg overflow-hidden transition-all ${openIdx === i ? `${c.border}` : "border-border/50"}`}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-card-hover/50 transition-colors cursor-pointer"
          >
            <ChevronRight className={`w-3 h-3 text-muted/40 transition-transform ${openIdx === i ? "rotate-90" : ""}`} />
            <span className="text-[12px] font-medium text-text">{cond.category[lang]}</span>
            <span className="text-[10px] text-muted/50 ml-auto">{cond.items.length}</span>
          </button>
          {openIdx === i && (
            <div className="px-3 pb-2.5 border-t border-border/30 pt-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {cond.items.map((item, j) => (
                  <span key={j} className={`text-[10px] ${c.bg} ${c.text} px-2 py-0.5 rounded-full font-medium`}>
                    {item[lang]}
                  </span>
                ))}
              </div>
              <div className="flex items-start gap-1.5 bg-green-light/50 rounded-md px-2.5 py-2">
                <Shield className="w-3 h-3 text-green mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-green leading-relaxed font-medium">{cond.safety[lang]}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Quick Reference Card ─── */
function QuickRefCard({ card, lang }) {
  const Icon = ICONS[card.icon] || Sparkles;
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-green" />
        <h4 className="text-[13px] font-semibold text-text">{card.title[lang]}</h4>
      </div>
      <ul className="space-y-1.5">
        {card.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[11px] text-text/70">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-green flex-shrink-0" />
            {typeof item === "string" ? item : item[lang]}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Main Page ─── */
export default function WorkflowPage() {
  const { lang } = useLanguage();
  const [expandedStage, setExpandedStage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const stageRefs = useRef({});

  const handleToggle = useCallback((stageId) => {
    setExpandedStage((prev) => (prev === stageId ? null : stageId));
  }, []);

  const handleNavigate = useCallback((stageId) => {
    setExpandedStage(stageId);
    setTimeout(() => {
      stageRefs.current[stageId]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  // Filter stages by search
  const filteredStages = workflowStages.filter((stage) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const texts = [
      stage.title.id, stage.title.en, stage.subtitle.id, stage.subtitle.en,
      ...stage.steps.flatMap((s) => [
        s.title?.id, s.title?.en, s.description?.id, s.description?.en, s.template,
        ...(s.keyPoints?.map(kp => typeof kp === "string" ? kp : `${kp.id} ${kp.en}`) || []),
        ...(s.branches?.map(b => `${b.label.id} ${b.label.en}`) || []),
        ...(s.conditions?.flatMap(c => [...c.items.map(i => `${i.id} ${i.en}`), c.safety.id, c.safety.en]) || []),
        ...(s.reactions?.flatMap(r => [r.symptom.id, r.symptom.en, r.cause.id, r.action.id]) || []),
        ...(s.rules?.map(r => `${r.id} ${r.en}`) || []),
      ]),
    ].filter(Boolean).join(" ").toLowerCase();
    return texts.includes(q);
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-green text-[11px] font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          {lang === "id" ? "Panduan SOP" : "SOP Guideline"}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-text">
          {lang === "id" ? "Workflow Customer Service" : "Customer Service Workflow"}
        </h1>
        <p className="text-sm text-muted mt-1">
          {lang === "id"
            ? "Panduan langkah demi langkah untuk menangani pertanyaan pelanggan Treelogy"
            : "Step-by-step guide for handling Treelogy customer inquiries"}
        </p>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "id" ? "Cari dalam workflow..." : "Search workflow..."}
            className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-card text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Journey Overview (mini-map) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {workflowStages.map((stage, i) => {
          const c = COLORS[stage.color];
          const Icon = ICONS[stage.icon] || Sparkles;
          const isActive = expandedStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => handleNavigate(stage.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                isActive ? `${c.bg} ${c.text} ${c.border} border` : "text-muted/50 hover:text-muted hover:bg-card-hover border border-transparent"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{stage.title[lang]}</span>
              <span className="sm:hidden">P{stage.phase}</span>
              {i < workflowStages.length - 1 && <ChevronRight className="w-3 h-3 text-muted/20 ml-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Stage Cards */}
      <div className="space-y-3">
        {filteredStages.map((stage) => (
          <div key={stage.id} ref={(el) => { stageRefs.current[stage.id] = el; }}>
            <StageCard
              stage={stage}
              isExpanded={expandedStage === stage.id}
              onToggle={() => handleToggle(stage.id)}
              onNavigate={handleNavigate}
              lang={lang}
            />
          </div>
        ))}

        {filteredStages.length === 0 && (
          <div className="py-12 text-center">
            <Search className="w-6 h-6 text-muted/20 mx-auto mb-2" />
            <p className="text-xs text-muted">
              {lang === "id" ? "Tidak ditemukan workflow yang cocok" : "No matching workflow found"}
            </p>
          </div>
        )}
      </div>

      {/* Quick Reference Cards */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-green" />
          {lang === "id" ? "Referensi Cepat" : "Quick Reference"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickReferenceCards.map((card) => (
            <QuickRefCard key={card.id} card={card} lang={lang} />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-8 mb-4 px-4 py-3 bg-green-light/30 border border-green/10 rounded-xl text-center">
        <p className="text-[11px] text-green font-medium">
          {lang === "id"
            ? "Moringa bukan obat — selalu komunikasikan sebagai superfood dan sarankan konsultasi dokter untuk kondisi medis berat."
            : "Moringa is not medicine — always communicate as a superfood and recommend doctor consultation for serious medical conditions."}
        </p>
      </div>
    </div>
  );
}
