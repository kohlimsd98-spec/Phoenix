import React, { useState, useEffect } from "react";
import { 
  Wrench, Battery, Flame, MousePointerClick, Sparkles, Tv, Wifi, 
  Bluetooth, VolumeX, Camera, Bug, RefreshCw, ZapOff, Fingerprint, 
  Smile, HardDrive, Hourglass, Smartphone, SignalHigh, Droplets, 
  Lightbulb, CheckCircle, AlertTriangle, Cpu, HelpCircle, ArrowRight,
  Clock, Activity
} from "lucide-react";
import { PHONE_BRANDS, SYMPTOMS, RULE_DIAGNOSTICS, DiagnosticResult } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RecentDiagnostic extends DiagnosticResult {
  id: string;
  timestamp: number;
}

// Icon mapper helper
const getSymptomIcon = (iconName: string) => {
  const props = { className: "w-5 h-5" };
  switch (iconName) {
    case 'Battery': return <Battery {...props} />;
    case 'Flame': return <Flame {...props} />;
    case 'MousePointerClick': return <MousePointerClick {...props} />;
    case 'Sparkles': return <Sparkles {...props} />;
    case 'Tv': return <Tv {...props} />;
    case 'Wifi': return <Wifi {...props} />;
    case 'Bluetooth': return <Bluetooth {...props} />;
    case 'VolumeX': return <VolumeX {...props} />;
    case 'Camera': return <Camera {...props} />;
    case 'Bug': return <Bug {...props} />;
    case 'RefreshCw': return <RefreshCw {...props} />;
    case 'ZapOff': return <ZapOff {...props} />;
    case 'Fingerprint': return <Fingerprint {...props} />;
    case 'Smile': return <Smile {...props} />;
    case 'HardDrive': return <HardDrive {...props} />;
    case 'Hourglass': return <Hourglass {...props} />;
    case 'Smartphone': return <Smartphone {...props} />;
    case 'SignalHigh': return <SignalHigh {...props} />;
    case 'Droplets': return <Droplets {...props} />;
    case 'Lightbulb': return <Lightbulb {...props} />;
    default: return <Smartphone {...props} />;
  }
};

export default function Diagnostics({ onToast }: { onToast: (m: string, t: "success" | "error" | "warning" | "info") => void }) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState("");
  const [isAiMode, setIsAiMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosticResult | null>(null);
  const [recentDiagnostics, setRecentDiagnostics] = useState<RecentDiagnostic[]>([]);
  const [issueFrequency, setIssueFrequency] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem("phonefix_recent_diagnostics");
    if (saved) {
      try {
        setRecentDiagnostics(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent diagnostics from localStorage", e);
      }
    }
    const savedFreq = localStorage.getItem("phonefix_issue_freq");
    if (savedFreq) {
      try {
        setIssueFrequency(JSON.parse(savedFreq));
      } catch (e) {
        console.error("Failed to parse issue frequency from localStorage", e);
      }
    }
  }, []);

  const saveToRecent = (diag: DiagnosticResult, symptoms: string[]) => {
    setRecentDiagnostics(prev => {
      const newDiag: RecentDiagnostic = { ...diag, id: Math.random().toString(36).substring(7), timestamp: Date.now() };
      const updated = [newDiag, ...prev].slice(0, 5);
      localStorage.setItem("phonefix_recent_diagnostics", JSON.stringify(updated));
      return updated;
    });

    setIssueFrequency(prev => {
      const newFreq = { ...prev };
      symptoms.forEach(s => {
        const label = SYMPTOMS.find(sym => sym.id === s)?.label || s;
        newFreq[label] = (newFreq[label] || 0) + 1;
      });
      localStorage.setItem("phonefix_issue_freq", JSON.stringify(newFreq));
      return newFreq;
    });
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setSelectedModel("");
    setDiagnosis(null);
  };

  const handleReset = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedSymptoms([]);
    setCustomDescription("");
    setDiagnosis(null);
    onToast("Troubleshooter reset successfully", "info");
  };

  const handleRunDiagnosis = async () => {
    if (!selectedBrand) {
      onToast("Please select a smartphone brand first", "warning");
      return;
    }
    setLoading(true);
    setDiagnosis(null);

    // If AI Mode is enabled, query our backend API
    if (isAiMode) {
      try {
        const res = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand: selectedBrand,
            model: selectedModel,
            symptoms: selectedSymptoms.map(s => SYMPTOMS.find(sym => sym.id === s)?.label || s),
            customDescription: customDescription
          })
        });

        if (!res.ok) {
          throw new Error("API call failed");
        }

        const data = await res.json();
        setDiagnosis(data);
        saveToRecent(data, selectedSymptoms);
        onToast("AI diagnosis completed", "success");
      } catch (err: any) {
        console.warn("AI diagnosis fell back:", err);
        // Fall back to rule-based logic
        runRuleBasedDiagnosis();
      } finally {
        setLoading(false);
      }
    } else {
      // Rule-based diagnostic logic
      setTimeout(() => {
        runRuleBasedDiagnosis();
        setLoading(false);
      }, 1000);
    }
  };

  const runRuleBasedDiagnosis = () => {
    // Check if we have rule matching
    const primarySymptom = selectedSymptoms[0];
    const matchedRule = RULE_DIAGNOSTICS[primarySymptom];

    if (matchedRule) {
      const diag: DiagnosticResult = {
        ...matchedRule,
        title: `${selectedBrand} ${selectedModel || ""} - ${matchedRule.title}`,
        summary: `Rule-Based Diagnosis: ${matchedRule.summary} ${customDescription ? `Note on user feedback: "${customDescription}"` : ""}`
      };
      setDiagnosis(diag);
      saveToRecent(diag, selectedSymptoms);
      onToast("Rule-based diagnosis completed", "success");
    } else {
      // Generic diagnosis output
      const diag: DiagnosticResult = {
        title: `${selectedBrand} ${selectedModel || "Device"} - General Diagnosis`,
        severity: "med",
        summary: "Could not find a specific rule match. Providing general smartphone diagnostic procedures for selected symptoms.",
        type: "hybrid",
        steps: [
          "Force restart your device to reload kernel drivers (hold Power + Vol Down for 10-15 seconds).",
          "Verify battery charges normally and doesn't overheat.",
          "Check for system updates in settings.",
          "Boot into safe mode to rule out problematic third-party applications.",
          "If physical symptoms like screen flickering exist, examine structural connectors."
        ],
        difficulty: "Medium",
        estTime: "20 mins",
        safetyWarning: "Ensure the smartphone is disconnected from charging blocks before performing diagnostics."
      };
      setDiagnosis(diag);
      saveToRecent(diag, selectedSymptoms);
      onToast("Completed general diagnostics", "info");
    }
  };

  return (
    <div id="diagnose" className="scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Wrench className="w-8 h-8 text-accent-primary" /> Smart Diagnostics
          </h2>
          <p className="text-text-muted text-sm mt-1">Select brand and symptoms for instant diagnostics and repair workflows</p>
        </div>
        
        {/* Toggle Mode */}
        <div className="bg-surface-card1 border border-surface-border p-1 rounded-xl flex gap-1 self-start">
          <button 
            onClick={() => setIsAiMode(true)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${isAiMode ? "bg-accent-primary text-surface-base" : "text-text-muted hover:text-text-main"}`}
          >
            AI Copilot Mode
          </button>
          <button 
            onClick={() => setIsAiMode(false)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${!isAiMode ? "bg-accent-primary text-surface-base" : "text-text-muted hover:text-text-main"}`}
          >
            Offline Rule Mode
          </button>
        </div>
      </div>

      <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-primary to-transparent" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-surface-base">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-main">Interactive Troubleshooting Hub</h3>
            <p className="text-xs text-text-muted">Specify your phone model and symptoms for personalized teardown guidance</p>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">Smartphone Brand</label>
            <select 
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full px-4 py-3 bg-surface-card1 border border-surface-border rounded-xl text-text-main focus:outline-none focus:border-accent-primary cursor-pointer appearance-none"
            >
              <option value="">-- Select Phone Brand --</option>
              {Object.keys(PHONE_BRANDS).map(b => (
                <option key={b} value={b}>{b.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">Phone Model</label>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="w-full px-4 py-3 bg-surface-card1 border border-surface-border rounded-xl text-text-main focus:outline-none focus:border-accent-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer appearance-none"
            >
              <option value="">-- Select Model --</option>
              {selectedBrand && PHONE_BRANDS[selectedBrand]?.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Symptoms list */}
        <div className="mb-6">
          <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-3">Select experiencing symptoms:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {SYMPTOMS.map(sym => {
              const selected = selectedSymptoms.includes(sym.id);
              return (
                <button
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all duration-200 ${
                    selected 
                      ? "bg-accent-primary/10 border-accent-primary text-accent-primary" 
                      : "bg-surface-card1 border-surface-border text-text-muted hover:border-accent-dark hover:text-text-main"
                  }`}
                >
                  {getSymptomIcon(sym.icon)}
                  <span className="truncate">{sym.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom text details */}
        <div className="mb-6">
          <label className="block text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">
            Detailed Issue Description (highly recommended for AI Mode)
          </label>
          <textarea
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="E.g., My OPPO F11 Pro front pop-up camera clicks but won't rise up, screen flickers when charging..."
            rows={3}
            className="w-full p-4 bg-surface-card1 border border-surface-border rounded-xl text-sm text-text-main placeholder-text-muted/40 focus:outline-none focus:border-accent-primary resize-none"
          />
        </div>

        {/* Diagnostic Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleRunDiagnosis}
            disabled={loading || !selectedBrand || (selectedSymptoms.length === 0 && !customDescription)}
            className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-dark text-surface-base font-bold rounded-xl text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-accent-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Performing AI Diagnosis...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" /> Run {isAiMode ? "AI" : "Offline"} Diagnosis
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="px-5 py-3 bg-surface-card1 border border-surface-border text-text-main hover:border-accent-dark font-semibold rounded-xl text-sm transition-all"
          >
            Reset
          </button>
        </div>

        {/* Result Area */}
        <AnimatePresence>
          {diagnosis && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mt-8 p-6 bg-surface-card1 border border-surface-border rounded-2xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${
                    diagnosis.severity === 'hi' ? 'bg-[#f44] shadow-[0_0_8px_#f44]' : 
                    diagnosis.severity === 'med' ? 'bg-[#f5a623] shadow-[0_0_8px_#f5a623]' : 
                    'bg-accent-primary shadow-[0_0_8px_#00e68a]'
                  }`} />
                  <h4 className="font-bold text-lg text-text-main">{diagnosis.title}</h4>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded uppercase tracking-wider ${
                    diagnosis.severity === 'hi' ? 'bg-[#f44]/10 text-[#f44]' : 
                    diagnosis.severity === 'med' ? 'bg-[#f5a623]/10 text-[#f5a623]' : 
                    'bg-accent-primary/10 text-accent-primary'
                  }`}>
                    {diagnosis.severity === 'hi' ? 'High Severity' : diagnosis.severity === 'med' ? 'Medium Severity' : 'Low Severity'}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-accent-secondary/10 text-accent-secondary rounded uppercase">
                    {diagnosis.type}
                  </span>
                </div>
              </div>

              <p className="text-sm text-text-muted leading-relaxed mb-6 bg-surface-card2/40 p-3 rounded-xl border border-surface-border/50">
                {diagnosis.summary}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-surface-card2/80 p-4 rounded-xl border border-surface-border">
                <div>
                  <span className="block text-[10px] text-text-muted uppercase tracking-wider">Difficulty Level</span>
                  <span className={`font-semibold text-sm ${
                    diagnosis.difficulty === 'Hard' ? 'text-[#f44]' : 
                    diagnosis.difficulty === 'Medium' ? 'text-[#f5a623]' : 
                    'text-accent-primary'
                  }`}>{diagnosis.difficulty}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-text-muted uppercase tracking-wider">Estimated Labor Time</span>
                  <span className="text-text-main font-semibold text-sm">{diagnosis.estTime}</span>
                </div>
              </div>

              {/* Steps */}
              <div className="mb-6">
                <h5 className="text-xs font-bold uppercase tracking-wider text-text-main mb-3 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-accent-primary" /> Recommended Troubleshooting Steps:
                </h5>
                <ol className="space-y-3">
                  {diagnosis.steps?.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-text-muted leading-relaxed">
                      <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-accent-primary font-mono text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Safety Warning */}
              {diagnosis.safetyWarning && (
                <div className="p-4 bg-[#f44]/5 border border-[#f44]/25 rounded-xl flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-[#f44] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-[#f44] uppercase tracking-wider">Safety Notification</span>
                    <p className="text-xs text-text-muted leading-relaxed mt-1">{diagnosis.safetyWarning}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Diagnostics */}
      {recentDiagnostics.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-3 text-text-main uppercase tracking-wide">
            <Clock className="w-4 h-4 text-accent-primary" /> Recent Diagnostics
          </h3>
          <div className="flex flex-col gap-2">
            {recentDiagnostics.map((diag) => (
              <div key={diag.id} className="p-3 bg-surface-card2 border border-surface-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-accent-primary transition-all cursor-pointer"
                onClick={() => {
                  setDiagnosis(diag);
                  document.getElementById("diagnose")?.scrollIntoView({ behavior: "smooth" });
                  onToast("Loaded recent diagnostic", "info");
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      diag.severity === 'hi' ? 'bg-[#f44]' : 
                      diag.severity === 'med' ? 'bg-[#f5a623]' : 
                      'bg-accent-primary'
                    }`} />
                    <h4 className="text-xs font-bold text-text-main">{diag.title}</h4>
                    <span className="text-[9px] text-text-muted ml-2 border border-surface-border px-1.5 rounded bg-surface-card1">
                      {new Date(diag.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted line-clamp-1">{diag.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issue Frequency Chart */}
      {Object.keys(issueFrequency).length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-text-main uppercase tracking-wide">
            <Activity className="w-4 h-4 text-accent-primary" /> Common Issues Frequency
          </h3>
          <div className="bg-surface-card2 border border-surface-border rounded-xl p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(issueFrequency)
                  .map(([name, count]) => ({ name, count }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  axisLine={{ stroke: "var(--color-surface-border)" }}
                  tickLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--color-surface-card1)", borderColor: "var(--color-surface-border)", borderRadius: "8px", fontSize: "12px", color: "var(--color-text-main)" }}
                  cursor={{ fill: "var(--color-surface-base)", opacity: 0.5 }}
                />
                <Bar dataKey="count" fill="var(--color-accent-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quick shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[
          { ic: "Battery", t: "Battery Draining Fast", d: "Diagnose background tasks, capacity drops, or system leaks.", sym: "battery_drain" },
          { ic: "Flame", t: "Device Overheating", d: "Isolate high thermal draw sources, charging specs, or short circuits.", sym: "overheating" },
          { ic: "Tv", t: "Black Screen / No Display", d: "Test GPU locks, panel connector loose pins, or broken AMOLED backlight.", sym: "black_screen" }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedSymptoms([item.sym]);
              if (!selectedBrand) setSelectedBrand("iphone");
              onToast(`Preselected ${item.t}`, "info");
              document.getElementById("diagnose")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-surface-card2 border border-surface-border rounded-xl p-5 text-left hover:border-accent-primary transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-3 group-hover:bg-accent-primary/20 transition-all">
              {item.ic === "Battery" && <Battery className="w-5 h-5" />}
              {item.ic === "Flame" && <Flame className="w-5 h-5" />}
              {item.ic === "Tv" && <Tv className="w-5 h-5" />}
            </div>
            <h4 className="text-sm font-semibold text-text-main flex items-center justify-between gap-2">
              {item.t} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all text-accent-primary" />
            </h4>
            <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">{item.d}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
