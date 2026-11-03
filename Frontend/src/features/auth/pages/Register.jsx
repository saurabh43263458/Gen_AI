import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Zap, AlertCircle, Layers, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const { registerhook, loading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (setAuthError) setAuthError(null);

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    const result = await registerhook({ username, email, password });
    if (result.success) {
      navigate("/");
    } else {
      setLocalError(result.error || "Registration failed. Please try again.");
    }
  };

  const handleFillDemo = () => {
    const randomSuffix = Math.floor(Math.random() * 1000);
    setUsername(`rahul_dev_${randomSuffix}`);
    setEmail(`rahul.sharma.${randomSuffix}@gmail.com`);
    setPassword("Developer@123");
  };

  const errorMessage = localError || authError;

  return (
    <div className="auth-container">
      {/* Ambient Meshes */}
      <div className="ambient-glow-mesh" />
      <div className="grid-overlay" />

      {/* Symmetrical Laser Vectors from Main Webpage */}
      <div className="auth-bg-laser">
        <svg
          viewBox="0 0 1200 700"
          className="w-full h-full max-w-[1400px] object-cover opacity-80"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="regLaserLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="regLaserRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
            </linearGradient>

            <radialGradient id="regCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.06" />
              <stop offset="60%" stopColor="#08080a" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="600" cy="380" r="280" fill="url(#regCenterGlow)" />

          <path
            d="M 60,220 C 340,220 440,290 490,400 C 510,440 518,500 520,700"
            fill="none"
            stroke="url(#regLaserLeft)"
            strokeWidth="1.5"
          />

          <path
            d="M 1140,220 C 860,220 760,290 710,400 C 690,440 682,500 680,700"
            fill="none"
            stroke="url(#regLaserRight)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Central Conduit Falling Drops */}
      <div className="center-conduit z-0">
        <div className="drop-streak" style={{ left: "30%", animationDelay: "0.2s", animationDuration: "2.8s" }} />
        <div className="drop-streak" style={{ left: "50%", animationDelay: "1.2s", animationDuration: "3.2s" }} />
        <div className="drop-streak" style={{ left: "70%", animationDelay: "0.8s", animationDuration: "2.5s" }} />
      </div>

      {/* Top Mini Navigation */}
      <header className="auth-top-nav">
        <Link to="/" className="brand-group" title="Return to Overview">
          <img src="/logo.png" alt="prepAi" className="h-7 w-auto object-contain" />
        </Link>

        <Link to="/" className="back-link">
          <ArrowLeft size={14} />
          <span>Back to Overview</span>
        </Link>
      </header>

      {/* Main Solid Authentication Card */}
      <div className="auth-card">
        <div className="auth-header">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="prepAi" className="h-8 w-auto object-contain" />
          </div>
          <h1>Create Account</h1>
          <p>Supercharge your engineering career with PrepAI</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="auth-error-banner">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="reg-username">Full Name or Handle</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input
                id="reg-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Rahul Sharma"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul.sharma.dev@gmail.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password (minimum 6 characters)</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Quick 1-Click Sample Account Generator */}
          <button
            type="button"
            className="demo-btn"
            onClick={handleFillDemo}
          >
            <Zap size={14} className="text-amber-400" />
            <span>Auto-fill Sample Candidate Profile</span>
          </button>

          {/* Iconic Glowing White Halo Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin inline-block" />
                Creating account...
              </span>
            ) : (
              <>
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
