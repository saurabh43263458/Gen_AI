import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { UploadCloud, FileText, CheckCircle, Sparkles, AlertCircle, FileCheck, X, Zap, ArrowRight, Loader2, Lock } from "lucide-react";
import { generateInterviewReport } from "../service/api.interview";
import { SAMPLE_PROFILES } from "../data/sampleProfiles";
import { useAuth } from "../../auth/hooks/useAuth";

const PROGRESS_STEPS = [
  "Reading candidate experience & credentials...",
  "Analyzing target job competencies & expectations...",
  "Calculating candidate fit match score...",
  "Synthesizing deep-dive technical questions & interviewer intent...",
  "Formulating evidence-based STAR behavioral frameworks...",
  "Building day-by-day customized preparation roadmap...",
];

const InterviewGenerator = ({ onReportGenerated, prefillProfile }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumeMode, setResumeMode] = useState("text"); // "upload" | "text"
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState(null);

  // Restore draft from sessionStorage if returning after login
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem("prepai_pending_draft");
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.resumeText) setResumeText(parsed.resumeText);
        if (parsed.selfDescription) setSelfDescription(parsed.selfDescription);
        if (parsed.jobDescription) setJobDescription(parsed.jobDescription);
        sessionStorage.removeItem("prepai_pending_draft");
      }
    } catch (e) {}
  }, []);

  // Apply prefill if passed from Hero or Preset
  useEffect(() => {
    if (prefillProfile) {
      setResumeMode("text");
      setResumeText(prefillProfile.resumeText || "");
      setSelfDescription(prefillProfile.selfDescription || "");
      setJobDescription(prefillProfile.jobDescription || "");
    }
  }, [prefillProfile]);

  // Rotate loading steps
  useEffect(() => {
    let interval;
    if (loading) {
      setProgressStep(0);
      interval = setInterval(() => {
        setProgressStep((prev) => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setError("Please upload a PDF document (.pdf)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      setError(null);
      setResumeFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setError("Please upload a PDF document (.pdf)");
        return;
      }
      setError(null);
      setResumeFile(file);
    }
  };

  const handleSelectPreset = (profile) => {
    setResumeMode("text");
    setResumeFile(null);
    setResumeText(profile.resumeText);
    setSelfDescription(profile.selfDescription);
    setJobDescription(profile.jobDescription);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // If user is not signed in, protect the action by redirecting to login with saved draft
    if (!user) {
      try {
        sessionStorage.setItem(
          "prepai_pending_draft",
          JSON.stringify({
            resumeText,
            selfDescription,
            jobDescription,
          })
        );
      } catch (e) {}
      navigate("/login");
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      setError("Please provide a valid Job Description with at least 20 characters.");
      return;
    }

    if (!resumeFile && (!resumeText || resumeText.trim().length < 20)) {
      setError("Please provide your Resume either via PDF upload or text paste.");
      return;
    }

    setLoading(true);

    try {
      const data = await generateInterviewReport({
        resumeFile: resumeMode === "upload" ? resumeFile : null,
        resumeText: resumeMode === "text" ? resumeText : "",
        selfDescription,
        jobDescription,
      });

      if (data?.interviewReport) {
        onReportGenerated(data.interviewReport);
      } else {
        throw new Error(data?.message || "Failed to parse interview assessment report.");
      }
    } catch (err) {
      console.error("Generator error:", err);
      const msg = err.response?.data?.message || err.message || "Something went wrong while generating assessment.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="assessment-studio" className="py-12 px-6 max-w-5xl mx-auto">
      
      {/* Studio Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold mb-3">
          <Sparkles size={14} className="text-red-500" />
          <span className="uppercase tracking-wider">Evaluation Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-balance">
          Configure Your Interview Assessment
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl mx-auto text-pretty">
          Provide your candidate profile and job requirements below. The PrepAI engine will analyze both and craft your preparation roadmap.
        </p>

        {/* Quick Presets Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5 mr-1 font-mono">
            <Zap size={14} className="text-red-400" />
            Quick Presets:
          </span>
          {SAMPLE_PROFILES.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => handleSelectPreset(profile)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500/40 text-zinc-300 hover:text-white transition-all font-medium flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span>{profile.name}</span>
              <span className="text-zinc-500 text-[10px]">({profile.candidateName})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-[#0d0d12] border border-zinc-800 shadow-xl">
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="font-semibold">Assessment Generation Alert</p>
              <p className="text-xs text-red-400/90 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Resume Input */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="resume-textarea" className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <FileText size={16} className="text-red-500" />
                <span>1. Candidate Resume / Background</span>
                <span className="text-red-500">*</span>
              </label>

              {/* Mode Toggle Switch - Clean, Realistic (No neon shadow) */}
              <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-full border border-zinc-800 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setResumeMode("text")}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                    resumeMode === "text"
                      ? "bg-red-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => setResumeMode("upload")}
                  className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-colors ${
                    resumeMode === "upload"
                      ? "bg-red-600 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Upload PDF
                </button>
              </div>
            </div>

            {resumeMode === "upload" ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  resumeFile
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                }`}
              >
                {resumeFile ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 max-w-lg mx-auto">
                    <div className="flex items-center gap-3 text-left">
                      <FileCheck size={28} className="text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-white truncate max-w-xs">{resumeFile.name}</p>
                        <p className="text-xs text-slate-400 tabular-nums font-mono">{(resumeFile.size / 1024).toFixed(1)} KB • PDF Document</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove uploaded resume"
                      onClick={() => setResumeFile(null)}
                      className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition-all active:scale-[0.98]"
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <UploadCloud size={40} className="mx-auto text-white/60 mb-3" />
                    <p className="text-sm font-semibold text-white">Drag & drop your resume PDF here</p>
                    <p className="text-xs text-slate-400 mt-1">Supports PDF format up to 5MB</p>
                    <label className="mt-4 inline-block px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs font-semibold text-white cursor-pointer transition-all active:scale-[0.98]">
                      Browse Files
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <textarea
                  id="resume-textarea"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume here (Summary, Technical Skills, Projects, Experience, Education)..."
                  rows={6}
                  className="w-full px-4 py-3 bg-[#080a14] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all font-mono leading-relaxed"
                />
                <div className="text-right text-[11px] text-slate-400 mt-1 font-mono tabular-nums">
                  {resumeText.length} characters
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Candidate Self Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="self-description-textarea" className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <CheckCircle size={16} className="text-white/70" />
                <span>2. Candidate Self-Description & Highlights</span>
                <span className="text-xs text-slate-400 font-normal">(Optional but recommended)</span>
              </label>
            </div>
            <textarea
              id="self-description-textarea"
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Highlight any recent internships, key achievements, specific technologies you want tested on, or career focus (e.g., 'React performance optimization, state management, mentored 100+ students')..."
              rows={3}
              className="w-full px-4 py-3 bg-[#080a14] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all leading-relaxed"
            />
          </div>

          {/* Section 3: Target Job Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="job-description-textarea" className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FileText size={16} className="text-white/70" />
                <span>3. Target Job Description</span>
                <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                {jobDescription.length} characters
              </span>
            </div>
            <textarea
              id="job-description-textarea"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job posting, role title, required competencies, tech stack, and responsibilities here..."
              rows={7}
              required
              className="w-full px-4 py-3 bg-[#080a14] border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all font-mono leading-relaxed"
            />
          </div>

          {/* Submit Action or Loading Indicator */}
          {loading ? (
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Loader2 size={20} className="animate-spin text-red-500" />
                <span className="text-sm font-semibold text-white">
                  PrepAI Intelligence Engine in Progress
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-300 transition-all">
                {PROGRESS_STEPS[progressStep]}
              </p>
              <div className="w-full max-w-md mx-auto bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-red-600 h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${((progressStep + 1) / PROGRESS_STEPS.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-400">
                Evaluating candidate alignment • Synthesizing evidence-based assessment
              </p>
            </div>
          ) : user ? (
            <button
              type="submit"
              aria-label="Generate Comprehensive Interview Assessment Suite"
              className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base border border-red-500/30 flex items-center justify-center gap-3 transition-colors active:scale-[0.99] shadow-sm"
            >
              <Sparkles size={18} />
              <span>Generate Comprehensive Interview Assessment Suite</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Sign In to Generate Assessment"
              className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base border border-red-500/30 flex items-center justify-center gap-3 transition-colors active:scale-[0.99] shadow-sm"
            >
              <Lock size={16} />
              <span>Sign In to Launch Assessment (Redirects to Login)</span>
              <ArrowRight size={18} />
            </button>
          )}

        </form>

      </div>
    </section>
  );
};

export default InterviewGenerator;
