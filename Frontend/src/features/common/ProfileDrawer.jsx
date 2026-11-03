import React, { useState, useEffect } from "react";
import {
  X,
  User,
  History,
  LogOut,
  Calendar,
  Sparkles,
  Award,
  TrendingUp,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { getInterviewHistory, getInterviewById, deleteInterviewReport } from "../interview/service/api.interview";

const ProfileDrawer = ({
  isOpen,
  onClose,
  user,
  onSignOut,
  onSelectReport,
  onScrollToStudio,
  defaultTab = "profile",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      fetchHistory();
    }
  }, [isOpen, defaultTab]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getInterviewHistory();
      if (data?.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.warn("Failed to load interview history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = async (id) => {
    try {
      const data = await getInterviewById(id);
      if (data?.interviewReport) {
        onSelectReport(data.interviewReport);
        onClose();
      }
    } catch (err) {
      console.error("Failed to load report:", err);
    }
  };

  const handleDeleteReport = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this assessment report?")) return;

    setDeletingId(id);
    try {
      await deleteInterviewReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete report:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  const totalReports = reports.length;
  const bestScore = totalReports > 0 ? Math.max(...reports.map((r) => r.matchScore || 0)) : 0;
  const averageScore = totalReports > 0 ? Math.round(reports.reduce((acc, r) => acc + (r.matchScore || 0), 0) / totalReports) : 0;

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "C";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container - Pure Solid Black & Zinc with Crisp Red Accents */}
      <div className="relative z-10 w-full max-w-lg h-full bg-[#08080a] border-l border-zinc-800 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Top Header & Segmented Tab Switcher */}
        <div className="p-6 border-b border-zinc-800 bg-[#0d0d12]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="prepAi" className="h-6 w-auto object-contain" />
              <div className="h-4 w-[1px] bg-zinc-800" />
              <span className="text-xs font-semibold text-zinc-300">Candidate Hub</span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Solid Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-red-600 text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <User size={14} />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                activeTab === "history"
                  ? "bg-red-600 text-white font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <History size={14} />
              <span>Assessment History ({totalReports})</span>
            </button>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: CANDIDATE PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Profile Identity Card */}
              <div className="p-6 rounded-2xl bg-[#0f0f14] border border-zinc-800">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-red-600 text-white font-bold text-xl flex items-center justify-center border border-red-500/30 shrink-0">
                    {userInitial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-bold text-white truncate">
                        {user?.username || "Candidate User"}
                      </h4>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Verified
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 truncate mb-3">
                      {user?.email || "candidate@prepai.dev"}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <ShieldCheck size={14} className="text-red-500" />
                      <span>PrepAI Evaluation Engine</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Analytics Grid */}
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  Readiness Analytics
                </h5>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#0f0f14] border border-zinc-800 text-center">
                    <span className="text-[11px] uppercase font-medium text-zinc-400 block mb-1">Reports</span>
                    <span className="text-2xl font-bold text-white tabular-nums">{totalReports}</span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">Completed</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0f0f14] border border-zinc-800 text-center">
                    <span className="text-[11px] uppercase font-medium text-zinc-400 block mb-1">Peak Score</span>
                    <span className="text-2xl font-bold text-red-500 tabular-nums">
                      {bestScore > 0 ? `${bestScore}%` : "—"}
                    </span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">Best Match</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0f0f14] border border-zinc-800 text-center">
                    <span className="text-[11px] uppercase font-medium text-zinc-400 block mb-1">Avg Score</span>
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {averageScore > 0 ? `${averageScore}%` : "—"}
                    </span>
                    <span className="text-[11px] text-zinc-500 block mt-0.5">Readiness</span>
                  </div>
                </div>
              </div>

              {/* Target Focus Areas */}
              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <Briefcase size={14} className="text-red-500" />
                    Target Technical Domain
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">Software Engineering</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Evaluated across full-stack engineering, system design, architectural scalability, and behavioral interview scenarios.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {["React", "TypeScript", "Node.js", "System Design", "MongoDB", "REST APIs"].map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onScrollToStudio();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.99] shadow-sm"
                >
                  <Sparkles size={14} />
                  <span>Start New Assessment in Studio</span>
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
                >
                  <History size={14} />
                  <span>View All Past Reports ({totalReports})</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: ASSESSMENT HISTORY (Solid, Clean, Red & Black) */}
          {activeTab === "history" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Archived Reports ({reports.length})
                </h5>
                <button
                  onClick={fetchHistory}
                  disabled={loading}
                  className="text-xs text-zinc-400 hover:text-white transition-colors underline"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="py-16 text-center text-zinc-400">
                  <div className="w-7 h-7 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs">Loading candidate reports...</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="py-20 text-center text-zinc-400 p-6 rounded-2xl bg-[#0f0f14] border border-zinc-800">
                  <Sparkles size={30} className="mx-auto text-zinc-600 mb-3" />
                  <p className="text-sm font-semibold text-white">No assessments generated yet</p>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Submit your resume and job description in the studio to generate your first assessment suite.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onScrollToStudio();
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open Assessment Studio</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {reports.map((item) => {
                    const score = item.matchScore ?? 0;

                    return (
                      <div
                        key={item._id}
                        onClick={() => handleSelectReport(item._id)}
                        className="p-4 rounded-xl bg-[#0f0f14] hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all flex items-start justify-between gap-3 group shadow-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                              {item.jobTitle || "Technical Role"}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-red-600 text-white shrink-0">
                              {score}%
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            {item.skillGaps?.length > 0 && (
                              <>
                                <span className="text-zinc-600">•</span>
                                <span className="text-zinc-300 truncate max-w-[150px]">
                                  {item.skillGaps.length} Skill Gaps
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          <button
                            onClick={(e) => handleDeleteReport(e, item._id)}
                            disabled={deletingId === item._id}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                            title="Delete this report"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="p-1 text-zinc-500 group-hover:text-white transition-colors">
                            <ChevronRight size={15} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions - Solid Button */}
        <div className="p-4 px-6 border-t border-zinc-800 bg-[#0d0d12] flex items-center justify-between text-xs">
          <div className="text-zinc-400 text-xs">
            Signed in as <strong className="text-white font-medium">{user?.username}</strong>
          </div>

          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-200 hover:text-white border border-zinc-700 hover:border-red-600 font-medium text-xs transition-all shadow-sm active:scale-95"
            title="Sign Out of Candidate Account"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileDrawer;
