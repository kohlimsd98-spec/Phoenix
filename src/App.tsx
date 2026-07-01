import React, { useState, useEffect } from "react";
import { 
  Wrench, ShieldCheck, Activity, Search, AlertTriangle, Cpu, 
  Smartphone, Database, ShieldAlert, Sparkles, Droplets, Info,
  ExternalLink, Bell, Menu, X, ArrowUpRight, HelpCircle, Moon, Sun
} from "lucide-react";

// Import custom sub-modules
import Diagnostics from "./components/Diagnostics";
import OSUpdate from "./components/OSUpdate";
import SecurityScanner from "./components/SecurityScanner";
import RepairGuides from "./components/RepairGuides";
import ErrorDatabase from "./components/ErrorDatabase";
import SafetyTips from "./components/SafetyTips";
import AIChatBot from "./components/AIChatBot";
import { EMERGENCY_STEPS } from "./types";
import { motion, AnimatePresence } from "motion/react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

export default function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<string | null>(null);

  // Animated numbers
  const [metricErrors, setMetricErrors] = useState(0);
  const [metricRules, setMetricRules] = useState(0);
  const [metricBrands, setMetricBrands] = useState(0);
  const [metricSafety, setMetricSafety] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("phonefix-theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("phonefix-theme", newTheme);
      if (newTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
      return newTheme;
    });
  };

  // Trigger metrics animations
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
      let startTime: number | null = null;
      const step = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setter(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    animateValue(0, 1248, 1500, setMetricErrors);
    animateValue(0, 452, 1500, setMetricRules);
    animateValue(0, 10, 1200, setMetricBrands);
    animateValue(0, 16, 1000, setMetricSafety);
  }, []);

  const addToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
      addToast(`Navigating to section...`, "info");
    }
  };

  const navItems = [
    { label: "Diagnostics", id: "diagnose" },
    { label: "OS Updater", id: "osup" },
    { label: "Security", id: "sec" },
    { label: "Teardowns", id: "repair" },
    { label: "Error Codes", id: "errs" },
    { label: "Safety Tips", id: "safety" }
  ];

  return (
    <div className="min-h-screen bg-surface-base text-text-main font-sans relative overflow-x-hidden antialiased">
      {/* Background Star Particles and Radial Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Glow accents */}
        <div className="absolute top-[-10%] left-[15%] w-[60vw] h-[60vw] rounded-full bg-accent-primary opacity-[0.04] blur-[150px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-accent-secondary opacity-[0.03] blur-[150px]" />
        
        {/* Twinkling star layout */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-25 animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 4 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Global Toast Stack */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`p-4 rounded-xl border pointer-events-auto shadow-lg flex gap-3 items-center ${
                t.type === "success" ? "bg-surface-card2 border-accent-primary text-accent-primary" :
                t.type === "error" ? "bg-surface-card2 border-[#f44] text-[#f44]" :
                t.type === "warning" ? "bg-surface-card2 border-[#f5a623] text-[#f5a623]" :
                "bg-surface-card2 border-surface-border text-accent-secondary"
              }`}
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-semibold">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sticky Header Nav Bar */}
      <header className="sticky top-0 z-30 bg-surface-base/85 backdrop-blur-md border-b border-surface-border h-16 transition-all">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-surface-base">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-text-main">PhoneFix Pro</h1>
              <span className="block text-[9px] font-mono font-bold text-accent-primary uppercase tracking-wider">AI Workplace v2.4</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-surface-card1/50 border border-surface-border/40 p-1 rounded-xl">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3.5 py-1.5 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-surface-card2 rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 bg-surface-card1 border border-surface-border hover:border-accent-primary rounded-xl text-text-main transition-all"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-accent-primary/5 border border-accent-primary/15 text-[10px] font-mono font-semibold text-accent-primary rounded-full">
              <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-ping" /> System Ready
            </span>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-surface-card1 border border-surface-border hover:border-accent-primary rounded-xl text-text-main transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-card1 border-b border-surface-border absolute top-16 left-0 right-0 z-20 overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-5 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left p-3 text-sm font-semibold text-text-muted hover:text-text-main hover:bg-surface-card2 border border-transparent hover:border-surface-border rounded-xl transition-all"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 border-t border-surface-border/40 flex justify-between items-center text-xs text-text-muted">
                <span>Status Indicator</span>
                <span className="text-accent-primary font-mono font-bold">● Operational</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-primary/5 border border-accent-primary/20 text-accent-primary rounded-full text-xs font-semibold mb-6 animate-pulse">
          <span className="w-2 h-2 bg-accent-primary rounded-full" /> Advanced Smartphone Hardware & Firmware Suite
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-main max-w-4xl mx-auto leading-[1.1]">
          Diagnose. Secure. <br />
          <span className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-dark bg-clip-text text-transparent">Update & Repair.</span>
        </h2>
        
        <p className="text-text-muted text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
          Interactive diagnostic scanners, cryptographically safe operating system updates, detailed tear-down checklists, and immediate AI technical assistance.
        </p>

        {/* Dynamic Animated Statistics Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-surface-card1/60 border border-surface-border p-6 rounded-3xl max-w-4xl mx-auto shadow-2xl backdrop-blur-sm">
          <div className="text-center p-3">
            <span className="block text-3xl sm:text-4xl font-extrabold font-mono text-accent-primary tracking-tight">
              {metricErrors.toLocaleString()}
            </span>
            <span className="block text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-widest mt-1">Known Errors</span>
          </div>
          <div className="text-center p-3 border-l border-surface-border/55">
            <span className="block text-3xl sm:text-4xl font-extrabold font-mono text-accent-secondary tracking-tight">
              {metricRules}+
            </span>
            <span className="block text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-widest mt-1">Rules & Checks</span>
          </div>
          <div className="text-center p-3 border-l border-surface-border/55">
            <span className="block text-3xl sm:text-4xl font-extrabold font-mono text-accent-primary tracking-tight">
              {metricBrands}
            </span>
            <span className="block text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-widest mt-1">Brands Covered</span>
          </div>
          <div className="text-center p-3 border-l border-surface-border/55">
            <span className="block text-3xl sm:text-4xl font-extrabold font-mono text-accent-secondary tracking-tight">
              {metricSafety}
            </span>
            <span className="block text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-widest mt-1">Safety Workflows</span>
          </div>
        </div>
      </section>

      {/* Emergency Quick Action Buttons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="p-5 bg-gradient-to-r from-surface-card2 to-[#f44]/3 border border-[#f44]/20 rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#f44] uppercase tracking-wider bg-[#f44]/10 border border-[#f44]/15 px-2.5 py-1 rounded">
                <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Emergency Recovery Guidance
              </span>
              <h3 className="font-bold text-base text-text-main mt-2">Experiencing immediate device failure or emergency?</h3>
              <p className="text-xs text-text-muted mt-0.5">Click any urgent situation card below to deploy a step-by-step immediate intervention checklist.</p>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {[
                { label: "Lost / Stolen Recovery", id: "lost", col: "hover:border-[#f44]" },
                { label: "Water & Liquid Damage", id: "water", col: "hover:border-accent-secondary" },
                { label: "Shattered / Leaking Screen", id: "screen", col: "hover:border-[#f5a623]" }
              ].map(em => (
                <button
                  key={em.id}
                  onClick={() => {
                    setActiveEmergency(em.id);
                    addToast(`Opened emergency steps for: ${em.label}`, "warning");
                  }}
                  className={`px-4 py-2 bg-surface-card1/90 border border-surface-border text-xs font-semibold rounded-xl text-text-main transition-all cursor-pointer ${em.col}`}
                >
                  {em.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 relative z-10">
        
        {/* Section 1: Diagnostics troubleshooter */}
        <Diagnostics onToast={addToast} />

        {/* Section 2: OS update wizard */}
        <OSUpdate onToast={addToast} />

        {/* Section 3: Security scans */}
        <SecurityScanner onToast={addToast} />

        {/* Section 4: Tear down guides */}
        <RepairGuides onToast={addToast} />

        {/* Section 5: Database index lookup */}
        <ErrorDatabase onToast={addToast} />

        {/* Section 6: Preventative Tips */}
        <SafetyTips onToast={addToast} />

      </main>

      {/* Emergency Modal overlay */}
      <AnimatePresence>
        {activeEmergency && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-surface-card2 border border-l-4 border-[#f44] border-t-surface-border border-r-surface-border border-b-surface-border rounded-2xl p-6 md:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-surface-border pb-3 mb-4">
                <h3 className="font-bold text-lg text-text-main flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#f44]" /> {EMERGENCY_STEPS[activeEmergency]?.t}
                </h3>
                <button 
                  onClick={() => setActiveEmergency(null)}
                  className="text-text-muted hover:text-text-main text-sm"
                >
                  ✕ Close
                </button>
              </div>

              <div className="p-4 bg-[#f44]/5 border border-[#f44]/15 rounded-xl text-xs text-text-muted leading-relaxed mb-6">
                <strong>CRITICAL INTERVENTION MANDATE:</strong> Follow the prioritized timeline instructions below precisely to limit electronic board erosion, trace shorts, or permanent data loss.
              </div>

              <div className="space-y-4 mb-6">
                {EMERGENCY_STEPS[activeEmergency]?.s.map((step, idx) => (
                  <div key={idx} className="flex gap-3.5">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#f44]/10 border border-[#f44]/20 text-[#f44] font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-text-muted leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveEmergency(null);
                  addToast("Emergency protocol acknowledged", "success");
                }}
                className="w-full py-3 bg-[#f44] text-text-main font-bold text-xs rounded-xl hover:bg-[#d63b3b] transition-all"
              >
                I Have Handled All Immediate Steps
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Chat Copilot */}
      <AIChatBot onToast={addToast} />

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-card1/40 py-12 relative z-10 text-xs text-text-muted text-center font-sans mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-text-main">PhoneFix Pro Platform</span>
          </div>
          
          <div className="flex gap-4">
            <span className="hover:text-accent-primary transition-all cursor-pointer" onClick={() => scrollToSection("diagnose")}>Troubleshoot</span>
            <span className="hover:text-accent-primary transition-all cursor-pointer" onClick={() => scrollToSection("osup")}>Secure Updates</span>
            <span className="hover:text-accent-primary transition-all cursor-pointer" onClick={() => scrollToSection("sec")}>Security</span>
            <span className="hover:text-accent-primary transition-all cursor-pointer" onClick={() => scrollToSection("repair")}>Teardowns</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} PhoneFix Pro Workspace. Licensed under Apache-2.0.
          </div>
        </div>
      </footer>
    </div>
  );
}
