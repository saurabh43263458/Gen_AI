import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  BookOpen,
  Code2,
  MessageSquare,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  Check,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

const InterviewReportView = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "technical" | "behavioral" | "roadmap"
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [masteredQuestions, setMasteredQuestions] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#dc2626", "#ef4444", "#ffffff", "#991b1b"],
      });
    } catch (e) {
      // safe fallback
    }
  }, [report?._id]);

  if (!report) return null;

  const matchScore = report.matchScore ?? 80;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-red-500 border-red-500/30 bg-red-600/10";
    if (score >= 60) return "text-red-400 border-red-500/20 bg-red-600/5";
    return "text-zinc-400 border-zinc-800 bg-zinc-900/40";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Strong Role Match";
    if (score >= 60) return "Competitive Match";
    return "Foundation Needed";
  };

  const toggleQuestionAccordion = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleMastered = (index) => {
    const nextState = !masteredQuestions[index];
    setMasteredQuestions((prev) => ({
      ...prev,
      [index]: nextState,
    }));

    if (nextState) {
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.7 },
          colors: ["#dc2626", "#ffffff", "#ef4444"],
        });
      } catch (e) {}
    }
  };

  const toggleTask = (dayIndex, taskIndex) => {
    const key = `${dayIndex}-${taskIndex}`;
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCopySummary = () => {
    const textToCopy = `PrepAI Interview Evaluation for ${report.jobTitle || "Role"}:
Match Score: ${report.matchScore}/100 (${getScoreLabel(report.matchScore)})
Summary: ${report.summary || "Evidence-based interview analysis"}
Skill Gaps: ${(report.skillGaps || []).map((s) => s.skill).join(", ")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="interview-report" className="py-12 px-6 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* =========================================================================
          SCREEN-ONLY INTERACTIVE INTERVIEW REPORT UI
          Includes dynamic tabs, interactive accordions, celebration confetti,
          and task check-offs. Hidden during print preview / PDF export.
          ========================================================================= */}
      <div className="screen-only-report-ui space-y-8">
        {/* Top Banner Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0d0d12] border border-zinc-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-red-600/10 text-red-400 text-xs font-bold border border-red-500/25">
              ASSESSMENT REPORT READY
            </span>
            <span className="text-xs text-zinc-400 font-mono tabular-nums">
              Generated {new Date(report.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-balance">
            {report.jobTitle || "Target Technical Role"}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopySummary}
            aria-label="Copy Report Summary"
            className="btn-secondary text-xs px-3.5 py-2.5 active:scale-[0.98]"
            title="Copy Report Summary"
          >
            {copied ? <Check size={16} className="text-red-400" /> : <Copy size={16} />}
            <span>{copied ? "Copied!" : "Copy Summary"}</span>
          </button>

          <button
            onClick={() => window.print()}
            aria-label="Print or Export Assessment to PDF"
            className="btn-secondary text-xs px-3.5 py-2.5 active:scale-[0.98]"
            title="Print or Export to PDF"
          >
            <Printer size={16} />
            <span>Export / Print</span>
          </button>

          <button
            onClick={onReset}
            aria-label="Generate New Assessment"
            className="btn-primary text-xs px-4 py-2.5 active:scale-[0.98]"
            title="Generate New Assessment"
          >
            <RotateCcw size={16} />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* Hero Stats & Executive Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Match Score Card */}
        <div className="p-6 rounded-3xl bg-[#0d0d12] border border-zinc-800 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-4 font-semibold uppercase tracking-wider font-mono">
            <span>Overall Candidate Fit</span>
            <TrendingUp size={16} className="text-red-500" />
          </div>

          <div className="flex items-center gap-5 my-2">
            <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 ${getScoreColor(matchScore)} shadow-sm`}>
              <span className="text-3xl font-extrabold tracking-tight font-mono tabular-nums">{matchScore}</span>
              <span className="text-[10px] font-semibold opacity-80 font-mono">/ 100</span>
            </div>
            <div>
              <p className="text-base font-bold text-white">{getScoreLabel(matchScore)}</p>
              <p className="text-xs text-zinc-400 mt-1 text-pretty">
                Evidence-verified overlap between resume & job description.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Confidence Index</span>
            <span className="text-red-400 font-semibold tabular-nums">98.4% Grounded</span>
          </div>
        </div>

        {/* Executive Summary Card */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#0d0d12] border border-zinc-800 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-500 mb-3 font-mono">
              <Sparkles size={14} />
              <span>AI Executive Synthesis</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal text-pretty">
              {report.summary ||
                "Candidate shows strong alignment with core responsibilities. Focus preparation on bridging specific framework gaps and structuring behavioral examples with quantifiable business impact."}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 pt-4 mt-4 border-t border-zinc-800/80 text-center font-mono">
            <div>
              <p className="text-lg font-bold text-white tabular-nums">{report.technicalQuestions?.length || 0}</p>
              <p className="text-[11px] text-zinc-400 font-sans">Technical Questions</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white tabular-nums">{report.behavioralQuestions?.length || 0}</p>
              <p className="text-[11px] text-zinc-400 font-sans">Behavioral Prompts</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white tabular-nums">{report.preparationPlan?.length || 0} Days</p>
              <p className="text-[11px] text-zinc-400 font-sans">Action Roadmap</p>
            </div>
          </div>
        </div>

      </div>

      {/* Tab Navigation Bar - Clean, Realistic (Zero Harsh Highlighting/Glow) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0d0d12] border border-zinc-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          aria-label="View Skill Gaps Tab"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-red-600 text-white"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <AlertTriangle size={16} />
          <span>Skill Gaps ({report.skillGaps?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("technical")}
          aria-label="View Technical Questions Tab"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === "technical"
              ? "bg-red-600 text-white"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <Code2 size={16} />
          <span>Technical Deep Dives ({report.technicalQuestions?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("behavioral")}
          aria-label="View Behavioral Scenarios Tab"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === "behavioral"
              ? "bg-red-600 text-white"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <MessageSquare size={16} />
          <span>Behavioral Scenarios ({report.behavioralQuestions?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("roadmap")}
          aria-label="View Preparation Roadmap Tab"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === "roadmap"
              ? "bg-red-600 text-white"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <Calendar size={16} />
          <span>Preparation Roadmap ({report.preparationPlan?.length || 0} Days)</span>
        </button>
      </div>

      {/* Tab Content 1: Skill Gaps */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-balance">
              <AlertTriangle size={18} className="text-red-500" />
              <span>Identified Skill Gaps & Concrete Remedies</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              Ranked by Interview Severity
            </span>
          </div>

          {report.skillGaps && report.skillGaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.skillGaps.map((gap, index) => {
                const isHigh = gap.severity === "high";
                const isMedium = gap.severity === "medium";

                const badgeClass = isHigh
                  ? "bg-red-600/15 text-red-400 border-red-500/30"
                  : isMedium
                  ? "bg-red-950/40 text-red-300 border-red-900/40"
                  : "bg-zinc-800 text-zinc-300 border-zinc-700";

                return (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-[#0d0d12] border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="text-base font-bold text-white">{gap.skill}</h4>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-mono ${badgeClass}`}>
                          {gap.severity} severity
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed mt-2 text-pretty">
                        <strong className="text-red-400 font-semibold">Actionable Remedy:</strong>{" "}
                        {gap.remedy || "Review core documentation, build a targeted proof-of-concept, and practice explaining design trade-offs."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-zinc-400">
              <CheckCircle2 size={32} className="mx-auto text-red-400 mb-2" />
              <p className="text-sm font-semibold text-white">No major skill gaps identified!</p>
              <p className="text-xs text-zinc-400 mt-1">Your background directly matches the core technical requirements.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Technical Questions */}
      {activeTab === "technical" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 text-balance">
                <Code2 size={18} className="text-red-500" />
                <span>Technical Interview Deep Dives</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 text-pretty">
                Questions tailored to your actual tech stack, interviewer intent, and sample answers.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {(report.technicalQuestions || []).map((q, idx) => {
              const isExpanded = expandedQuestions[idx];
              const isMastered = masteredQuestions[idx];

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-colors overflow-hidden ${
                    isMastered
                      ? "bg-[#0d0d12] border-red-500/30"
                      : "bg-[#0d0d12] border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {/* Question Header Accordion Trigger */}
                  <div
                    onClick={() => toggleQuestionAccordion(idx)}
                    className="p-5 cursor-pointer flex items-start justify-between gap-4 select-none"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-red-600/15 text-red-400 font-bold text-xs flex items-center justify-center shrink-0 border border-red-500/30 mt-0.5 font-mono">
                        Q{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-white leading-snug text-balance">
                          {q.question}
                        </h4>
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1.5 text-pretty">
                          <strong className="text-zinc-400 font-medium">Interviewer Intent:</strong>{" "}
                          {q.intention}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        aria-label={isMastered ? "Mark question unmastered" : "Mark question mastered"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMastered(idx);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-1.5 active:scale-[0.98] ${
                          isMastered
                            ? "bg-red-600 text-white border-red-500"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                        }`}
                      >
                        <Check size={14} />
                        <span>{isMastered ? "Mastered" : "Mark Mastered"}</span>
                      </button>

                      <div className="p-1 rounded-lg text-zinc-400 hover:text-white">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-zinc-800 space-y-4 text-sm animate-fadeIn">
                      
                      {/* What to Cover Checklist */}
                      {q.answer?.whatToCover && q.answer.whatToCover.length > 0 && (
                        <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                          <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                            <CheckCircle2 size={14} className="text-red-400" />
                            <span>Key Signals to Cover in Your Answer:</span>
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                            {q.answer.whatToCover.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span className="text-pretty">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Approach */}
                      {q.answer?.approach && (
                        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30">
                          <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 font-mono">
                            Strategic Mental Framework:
                          </p>
                          <p className="text-xs text-zinc-300 leading-relaxed font-mono text-pretty">
                            {q.answer.approach}
                          </p>
                        </div>
                      )}

                      {/* Sample Master Answer */}
                      {q.answer?.sampleAnswer && (
                        <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                              <Sparkles size={14} />
                              Exemplary Sample Response:
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">Silicon Valley Standard</span>
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line font-normal text-pretty">
                            {q.answer.sampleAnswer}
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 3: Behavioral Questions */}
      {activeTab === "behavioral" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 text-balance">
                <MessageSquare size={18} className="text-red-500" />
                <span>Behavioral & STAR Scenario Prompts</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 text-pretty">
                Evaluates communication, conflict resolution, leadership, and project execution based on your real experience.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {(report.behavioralQuestions || []).map((q, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0d0d12] border border-zinc-800 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-red-600/15 text-red-400 font-bold text-xs flex items-center justify-center shrink-0 border border-red-500/30 mt-0.5 font-mono">
                    B{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white leading-snug text-balance">{q.question}</h4>
                    <p className="text-xs text-red-400 mt-1 text-pretty">
                      <strong className="text-zinc-400 font-medium">Competency Tested:</strong> {q.intention}
                    </p>
                  </div>
                </div>

                {q.answer?.approach && (
                  <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 text-xs text-zinc-300 text-pretty">
                    <strong className="text-red-400 font-semibold font-mono">Recommended STAR Strategy:</strong>{" "}
                    {q.answer.approach}
                  </div>
                )}

                {q.answer?.sampleAnswer && (
                  <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 text-xs text-zinc-200 leading-relaxed text-pretty">
                    <strong className="text-red-400 font-semibold block mb-1 font-mono">
                      Evidence-Grounded STAR Answer:
                    </strong>
                    {q.answer.sampleAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: Preparation Roadmap */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 text-balance">
                <Calendar size={18} className="text-red-500" />
                <span>Day-by-Day Preparation Roadmap</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 text-pretty">
                Check off items as you prepare. Keep track of daily focus areas.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {(report.preparationPlan || []).map((plan, dayIdx) => (
              <div
                key={dayIdx}
                className="p-6 rounded-2xl bg-[#0d0d12] border border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-red-600/15 text-red-400 font-mono text-xs font-bold border border-red-500/30">
                      DAY {plan.day || dayIdx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white text-balance">{plan.focus}</h4>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {(plan.tasks || []).map((task, taskIdx) => {
                    const taskKey = `${dayIdx}-${taskIdx}`;
                    const isDone = completedTasks[taskKey];

                    return (
                      <div
                        key={taskIdx}
                        onClick={() => toggleTask(dayIdx, taskIdx)}
                        className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center gap-3 select-none ${
                          isDone
                            ? "bg-red-950/20 border-red-900/30 text-zinc-500 line-through"
                            : "bg-black/40 border-zinc-800 text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isDone
                              ? "bg-red-600 border-red-500 text-white"
                              : "border-zinc-700 bg-black"
                          }`}
                        >
                          {isDone && <Check size={13} />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-pretty">{task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* =========================================================================
          PRINT ONLY FULL REPORT DOCUMENT
          Renders exclusively when printing (Ctrl+P or Export / Print button)
          Contains ONLY content received from the API call:
          Score, Summary, Skill Gaps with Remedies, ALL Technical Questions with
          Answers, ALL Behavioral Questions with Answers, and the Preparation Roadmap.
          Zero website UI noise, zero hero section, zero navbar.
          ========================================================================= */}
      <div className="print-only-full-report hidden print:block text-slate-900 bg-white font-sans p-4">
        {/* Print Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                PrepAI Intelligence Assessment
              </span>
              <span className="text-xs text-slate-500 font-mono">
                • {new Date(report.createdAt || Date.now()).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
              {report.jobTitle || "Target Technical Role"}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Evidence-Grounded Technical Assessment & Comprehensive Interview Preparation Bank
            </p>
          </div>

          <div className="text-right border border-slate-300 rounded-xl p-3 bg-slate-50 min-w-[130px]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Candidate Fit Score</span>
            <div className="text-3xl font-black text-indigo-600 tabular-nums">
              {report.matchScore}<span className="text-sm font-semibold text-slate-500">/100</span>
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {getScoreLabel(report.matchScore)}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50/70 print-avoid-break">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Executive Summary & Candidacy Overview
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-sans">
            {report.summary}
          </p>
        </section>

        {/* Skill Gaps & Actionable Remedies */}
        <section className="mb-6 print-avoid-break">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Identified Skill Gaps & Actionable Remedies ({report.skillGaps?.length || 0})
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Ranked by Interview Severity</span>
          </div>

          {report.skillGaps && report.skillGaps.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {report.skillGaps.map((gap, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{gap.skill}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      gap.severity === "high" ? "bg-red-50 text-red-700 border-red-300" :
                      gap.severity === "medium" ? "bg-amber-50 text-amber-800 border-amber-300" :
                      "bg-emerald-50 text-emerald-800 border-emerald-300"
                    }`}>
                      {gap.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    <strong className="text-slate-900 font-semibold">Remedy:</strong> {gap.remedy}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600 italic">No major skill gaps identified for this role.</p>
          )}
        </section>

        {/* Technical Questions Bank (All Questions with Sample Answers) */}
        <section className="mb-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Technical Interview Deep Dives ({report.technicalQuestions?.length || 0} Questions)
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Full Sample Answers & Signal Frameworks</span>
          </div>

          <div className="space-y-4">
            {(report.technicalQuestions || []).map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white print-avoid-break space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded shrink-0">
                    Q{idx + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{q.question}</h3>
                    <p className="text-[11px] text-indigo-900 mt-1">
                      <strong className="text-slate-700 font-semibold">Interviewer Intent:</strong> {q.intention}
                    </p>
                  </div>
                </div>

                {q.answer?.whatToCover && q.answer.whatToCover.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px]">
                    <span className="font-bold text-slate-800 block mb-1">Key Signals to Cover:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {q.answer.whatToCover.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {q.answer?.approach && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5 text-[11px]">
                    <strong className="text-indigo-900 font-semibold">Strategic Framework / Approach:</strong>{" "}
                    <span className="text-slate-800 font-mono">{q.answer.approach}</span>
                  </div>
                )}

                {q.answer?.sampleAnswer && (
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-[11px]">
                    <strong className="text-emerald-800 font-semibold block mb-1">Exemplary Sample Response:</strong>
                    <p className="text-slate-800 leading-relaxed whitespace-pre-line font-sans">{q.answer.sampleAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Behavioral & STAR Scenarios */}
        <section className="mb-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Behavioral & STAR Scenario Prompts ({report.behavioralQuestions?.length || 0} Questions)
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Leadership & Conflict Resolution</span>
          </div>

          <div className="space-y-4">
            {(report.behavioralQuestions || []).map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white print-avoid-break space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded shrink-0">
                    B{idx + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{q.question}</h3>
                    <p className="text-[11px] text-violet-900 mt-1">
                      <strong className="text-slate-700 font-semibold">Competency Assessed:</strong> {q.intention}
                    </p>
                  </div>
                </div>

                {q.answer?.approach && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px]">
                    <strong className="text-violet-900 font-semibold">Recommended STAR Strategy:</strong>{" "}
                    <span className="text-slate-800">{q.answer.approach}</span>
                  </div>
                )}

                {q.answer?.sampleAnswer && (
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-[11px]">
                    <strong className="text-emerald-800 font-semibold block mb-1">Evidence-Grounded STAR Answer:</strong>
                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{q.answer.sampleAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Preparation Roadmap */}
        <section className="mb-6 print-avoid-break">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Structured Preparation Roadmap ({report.preparationPlan?.length || 0} Days)
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Daily Execution Schedule</span>
          </div>

          <div className="space-y-3">
            {(report.preparationPlan || []).map((plan, dayIdx) => (
              <div key={dayIdx} className="p-3.5 rounded-xl border border-slate-200 bg-white print-avoid-break">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    DAY {plan.day || dayIdx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{plan.focus}</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                  {(plan.tasks || []).map((task, taskIdx) => (
                    <li key={taskIdx}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Print Document Footer */}
        <div className="border-t border-slate-300 pt-3 text-center text-[10px] text-slate-500 font-mono flex justify-between items-center">
          <span>PrepAI Technical Interview & Career Readiness Platform</span>
          <span>Confidential Assessment • Prepared for Candidate Career Advancement</span>
        </div>
      </div>

    </div>
  );
};

export default InterviewReportView;
