import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  History,
  LogOut,
  Compass,
  BrainCircuit,
  Layers,
  ArrowRight,
  User,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../auth/hooks/useAuth";

const Navbar = ({ onOpenProfile, historyCount = 0, onScrollToStudio }) => {
  const { user, logouthook } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "C";

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleOpenTab = (tab) => {
    setIsDropdownOpen(false);
    if (!user) {
      navigate("/login");
    } else {
      onOpenProfile(tab);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full bg-[#0a0a0d]/90 backdrop-blur-xl border border-zinc-800 shadow-xl">
        
        {/* Brand Logo - Official PrepAi */}
        <div
          className="flex items-center cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src="/logo.png" alt="prepAi" className="h-7 w-auto object-contain" />
        </div>

        {/* Center Navigation Shortcuts */}
        <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-full border border-zinc-800/80 text-xs">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2 font-medium"
          >
            <Compass size={14} />
            Overview
          </button>
          <button
            onClick={onScrollToStudio}
            className="px-4 py-1.5 rounded-full text-white bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center gap-2 font-medium border border-zinc-700"
          >
            <BrainCircuit size={14} className="text-red-400" />
            Assessment Studio
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2" ref={dropdownRef}>
              
              {/* Minimalist Past Reports Pill Button */}
              <button
                onClick={() => handleOpenTab("history")}
                aria-label="View Assessment History"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors"
                title="View Past Assessment Reports"
              >
                <History size={13} className="text-zinc-400" />
                <span className="hidden sm:inline">History</span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold font-mono">
                    {historyCount}
                  </span>
                )}
              </button>

              {/* Modern Minimal User Pill Button */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="User Account Menu"
                  aria-expanded={isDropdownOpen}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors select-none"
                >
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    {userInitial}
                  </div>
                  <span className="text-xs font-semibold text-white max-w-[100px] truncate hidden sm:inline">
                    {user?.username || "Candidate"}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`text-zinc-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>

                {/* Floating Glass Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0f0f14] border border-zinc-800 shadow-2xl p-2 z-50 space-y-1 animate-fadeIn"
                  >
                    {/* Header in Dropdown */}
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {userInitial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{user?.username || "Candidate"}</p>
                          <p className="text-[10px] text-zinc-400 font-mono truncate">{user?.email}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1 text-red-400">
                          <ShieldCheck size={11} />
                          Active Candidate
                        </span>
                        <span>Tier-1 Prep</span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={() => handleOpenTab("profile")}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition-colors text-left"
                    >
                      <User size={14} className="text-zinc-400" />
                      <span>My Profile & Stats</span>
                    </button>

                    <button
                      onClick={() => handleOpenTab("history")}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <History size={14} className="text-zinc-400" />
                        <span>Assessment History</span>
                      </div>
                      {historyCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono">
                          {historyCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onScrollToStudio();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition-colors text-left"
                    >
                      <Sparkles size={14} className="text-red-400" />
                      <span>Start New Evaluation</span>
                    </button>

                    <div className="border-t border-zinc-800 my-1" />

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logouthook();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-white hover:bg-red-600/20 transition-colors text-left"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full text-zinc-400 hover:text-white text-xs font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1 active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
