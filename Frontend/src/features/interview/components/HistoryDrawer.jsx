import React, { useState, useEffect } from "react";
import { X, History, Trash2, ArrowUpRight, Calendar, Sparkles } from "lucide-react";
import { getInterviewHistory, getInterviewById, deleteInterviewReport } from "../service/api.interview";

const HistoryDrawer = ({ isOpen, onClose, onSelectReport }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getInterviewHistory();
      if (data?.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.warn("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const handleSelect = async (id) => {
    try {
      const data = await getInterviewById(id);
      if (data?.interviewReport) {
        onSelectReport(data.interviewReport);
        onClose();
      }
    } catch (err) {
      console.error("Failed to load interview report:", err);
    }
  };

  const handleDelete = async (e, id) => {
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-[#0c0f1c] border-l border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <History size={18} className="text-indigo-400" />
              <h3 className="text-base font-bold text-white">Assessment History</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* List */}
          <div className="mt-6 space-y-3">
            {loading ? (
              <div className="py-12 text-center text-gray-400">
                <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs">Loading past reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Sparkles size={32} className="mx-auto text-indigo-400/40 mb-3" />
                <p className="text-sm font-semibold text-white">No assessments generated yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Your generated interview preparation reports will appear here.
                </p>
              </div>
            ) : (
              reports.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelect(item._id)}
                  className="p-4 rounded-2xl bg-white/[0.03] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.jobTitle || "Technical Role"}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold font-mono">
                        Score: {item.matchScore ?? "N/A"}/100
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleDelete(e, item._id)}
                      disabled={deletingId === item._id}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete report"
                    >
                      <Trash2 size={15} />
                    </button>
                    <ArrowUpRight size={16} className="text-gray-500 group-hover:text-indigo-300 transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-gray-400">
            Powered by PrepAI Evaluation Cloud
          </p>
        </div>

      </div>
    </div>
  );
};

export default HistoryDrawer;

