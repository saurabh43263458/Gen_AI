import React, { useState, useEffect } from "react";
import Navbar from "./common/Navbar";
import HeroSection from "./interview/components/HeroSection";
import InterviewGenerator from "./interview/components/InterviewGenerator";
import InterviewReportView from "./interview/components/InterviewReportView";
import ProfileDrawer from "./common/ProfileDrawer";
import { SAMPLE_PROFILES } from "./interview/data/sampleProfiles";
import { getInterviewHistory } from "./interview/service/api.interview";
import { useAuth } from "./auth/hooks/useAuth";

const Home = () => {
  const { user, logouthook } = useAuth();
  const [currentReport, setCurrentReport] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState("profile");
  const [prefillProfile, setPrefillProfile] = useState(null);
  const [historyCount, setHistoryCount] = useState(0);

  // Load count of past reports only if authenticated
  useEffect(() => {
    if (!user) {
      setHistoryCount(0);
      return;
    }

    const fetchCount = async () => {
      try {
        const data = await getInterviewHistory();
        if (data?.reports) {
          setHistoryCount(data.reports.length);
        }
      } catch (err) {
        // silent fallback
      }
    };
    fetchCount();
  }, [user, currentReport]);

  const handleScrollToStudio = () => {
    const el = document.getElementById("assessment-studio");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoadDemoProfile = () => {
    setPrefillProfile(SAMPLE_PROFILES[0]);
    handleScrollToStudio();
  };

  const handleReportGenerated = (report) => {
    setCurrentReport(report);
    setTimeout(() => {
      const el = document.getElementById("interview-report");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const handleReset = () => {
    setCurrentReport(null);
    handleScrollToStudio();
  };

  const handleOpenProfile = (tab = "profile") => {
    setProfileTab(tab);
    setIsProfileOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white relative selection:bg-red-600 selection:text-white">
      {/* Ambient Visual Mesh Background */}
      <div className="ambient-glow-mesh" />
      <div className="grid-overlay" />

      {/* Main Top Navigation */}
      <Navbar
        onOpenProfile={handleOpenProfile}
        historyCount={historyCount}
        onScrollToStudio={handleScrollToStudio}
      />

      {/* Hero Section (Always visible on first visit) */}
      <HeroSection
        onScrollToStudio={handleScrollToStudio}
        onLoadDemoProfile={handleLoadDemoProfile}
      />

      {/* Active Assessment Report View if present */}
      {currentReport && (
        <InterviewReportView
          report={currentReport}
          onReset={handleReset}
        />
      )}

      {/* Interactive Assessment Studio Generator */}
      <InterviewGenerator
        onReportGenerated={handleReportGenerated}
        prefillProfile={prefillProfile}
      />

      {/* Candidate Profile & History Drawer */}
      {user && (
        <ProfileDrawer
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
          defaultTab={profileTab}
          onSignOut={logouthook}
          onScrollToStudio={handleScrollToStudio}
          onSelectReport={(report) => {
            setCurrentReport(report);
            setTimeout(() => {
              const el = document.getElementById("interview-report");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-24 py-12 px-6 border-t border-zinc-800 text-center text-xs text-zinc-500 relative z-10 bg-[#08080a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="prepAi" className="h-6 w-auto object-contain" />
            <span className="text-zinc-500">© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Evidence-Based</span>
            <span>•</span>
            <span>Role-Specific</span>
            <span>•</span>
            <span>PrepAI Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
