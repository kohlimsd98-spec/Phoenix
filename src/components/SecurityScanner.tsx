import React, { useState } from "react";
import { 
  ShieldCheck, ShieldAlert, Shield, ShieldX, Radio, Play, 
  RotateCw, AlertTriangle, Bug, Wifi, Eye, Lock, Database
} from "lucide-react";
import { motion } from "motion/react";

interface ScanCheck {
  name: string;
  status: "pending" | "scanning" | "passed" | "failed";
  desc: string;
}

const INITIAL_CHECKS: ScanCheck[] = [
  { name: 'Screen Lock Enabled', status: 'pending', desc: 'Checks biometric or passcode locks.' },
  { name: 'OS Version Up to Date', status: 'pending', desc: 'Validates patch level registers.' },
  { name: 'App Permissions Review', status: 'pending', desc: 'Audits intrusive system permissions.' },
  { name: 'Unknown Sources Disabled', status: 'pending', desc: 'Validates non-official installation block.' },
  { name: 'Find My Device Active', status: 'pending', desc: 'Ensures GPS location recovery hooks.' },
  { name: 'Encryption Status', status: 'pending', desc: 'Checks cryptographic filesystem locks.' },
  { name: 'Secure Network Check', status: 'pending', desc: 'Audits for active MITM gateway intercepts.' },
  { name: 'Malware Scan', status: 'pending', desc: 'Scans compiled DEX headers for Trojan signatures.' }
];

export default function SecurityScanner({ onToast }: { onToast: (m: string, t: "success" | "error" | "warning" | "info") => void }) {
  const [scanning, setScanning] = useState(false);
  const [checks, setChecks] = useState<ScanCheck[]>(INITIAL_CHECKS);
  const [score, setScore] = useState<number | null>(null);
  
  // Threat levels
  const [malwareRisk, setMalwareRisk] = useState(0);
  const [networkVuln, setNetworkVuln] = useState(0);
  const [privacyExposure, setPrivacyExposure] = useState(0);
  const [physicalSecurity, setPhysicalSecurity] = useState(0);
  const [dataLeakageRisk, setDataLeakageRisk] = useState(0);

  const startSecurityScan = () => {
    if (scanning) return;
    setScanning(true);
    setScore(null);
    onToast("Security scan started...", "info");

    // Clear stats
    setMalwareRisk(0);
    setNetworkVuln(0);
    setPrivacyExposure(0);
    setPhysicalSecurity(0);
    setDataLeakageRisk(0);

    // Reset check statuses
    setChecks(INITIAL_CHECKS.map(c => ({ ...c, status: 'pending' })));

    let currentCheckIdx = 0;
    const results = [true, true, false, true, true, false, true, true]; // Simulated results: indices 2 (permissions) and 5 (encryption) fail

    const runNextCheck = () => {
      if (currentCheckIdx >= INITIAL_CHECKS.length) {
        // Scan finished, calculate score
        const passedCount = results.filter(r => r).length;
        const finalScore = Math.round((passedCount / INITIAL_CHECKS.length) * 100);
        
        setScore(finalScore);
        setScanning(false);

        // Animate threat bars
        setMalwareRisk(finalScore >= 75 ? 8 : 45);
        setNetworkVuln(finalScore >= 75 ? 12 : 55);
        setPrivacyExposure(65); // High due to failed permissions
        setPhysicalSecurity(finalScore >= 75 ? 90 : 40);
        setDataLeakageRisk(50); // Moderate due to failed encryption

        if (finalScore >= 75) {
          onToast(`Scan complete. Score: ${finalScore}/100 - Good posture!`, "success");
        } else if (finalScore >= 50) {
          onToast(`Scan complete. Score: ${finalScore}/100 - Action recommended`, "warning");
        } else {
          onToast(`Scan complete. Score: ${finalScore}/100 - Extreme vulnerabilities detected!`, "error");
        }
        return;
      }

      // Mark current check as scanning
      setChecks(prev => prev.map((c, idx) => 
        idx === currentCheckIdx ? { ...c, status: 'scanning' } : c
      ));

      setTimeout(() => {
        const passed = results[currentCheckIdx];
        setChecks(prev => prev.map((c, idx) => 
          idx === currentCheckIdx ? { ...c, status: passed ? 'passed' : 'failed' } : c
        ));

        currentCheckIdx++;
        runNextCheck();
      }, 700);
    };

    runNextCheck();
  };

  // Circular gauge math (radius = 70, circumference = 2 * PI * r = 439.82)
  const radius = 70;
  const strokeCircumference = 2 * Math.PI * radius;
  const strokeDashoffset = score !== null 
    ? strokeCircumference - (score / 100) * strokeCircumference 
    : strokeCircumference;

  // Score color selector
  const getScoreColor = () => {
    if (score === null) return "stroke-surface-border";
    if (score >= 75) return "stroke-accent-primary";
    if (score >= 50) return "stroke-[#f5a623]";
    return "stroke-[#f44]";
  };

  return (
    <div id="sec" className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="text-accent-primary w-8 h-8" /> Security Scanner
        </h2>
        <p className="text-text-muted text-sm mt-1">Run active audits of smartphone permissions, device lock settings, and system signatures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gauge Card */}
        <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-2xl relative">
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-text-muted font-semibold bg-surface-card1 px-3 py-1.5 rounded-full border border-surface-border">
            <Radio className="w-3.5 h-3.5 text-accent-primary animate-pulse" /> Active Shield
          </div>

          {/* SVG Gauge */}
          <div className="relative w-48 h-48 mt-6 mb-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="fill-none stroke-surface-border stroke-[8]"
              />
              {/* Foreground circle */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className={`fill-none ${getScoreColor()} stroke-[8] transition-all duration-1000 ease-out`}
                strokeDasharray={strokeCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Score Content inside SVG */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {score === null ? (
                <span className="text-text-muted font-mono text-2xl font-bold">--</span>
              ) : (
                <span className={`text-4xl font-bold font-mono transition-all duration-300 ${
                  score >= 75 ? "text-accent-primary" : score >= 50 ? "text-[#f5a623]" : "text-[#f44]"
                }`}>{score}</span>
              )}
              <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold mt-1">Audit Score</span>
            </div>
          </div>

          <button
            onClick={startSecurityScan}
            disabled={scanning}
            className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-dark text-surface-base font-bold rounded-xl text-xs hover:shadow-lg hover:shadow-accent-primary/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 mb-6"
          >
            {scanning ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" /> Scanning System...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> {score !== null ? "Rescan Smartphone" : "Start Security Scan"}
              </>
            )}
          </button>

          {/* Detailed sequential checks */}
          <div className="w-full space-y-2 text-left">
            {checks.map((chk, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  chk.status === 'passed' ? 'bg-accent-primary/5 border-accent-primary/20 text-text-main' :
                  chk.status === 'failed' ? 'bg-[#f44]/5 border-[#f44]/20 text-text-main' :
                  chk.status === 'scanning' ? 'bg-accent-secondary/5 border-accent-secondary/30 text-text-main' :
                  'bg-surface-card1/40 border-surface-border/50 text-text-muted'
                }`}
              >
                <div className="min-w-0">
                  <span className="block text-xs font-bold truncate">{chk.name}</span>
                  <span className="block text-[10px] text-text-muted mt-0.5 truncate">{chk.desc}</span>
                </div>

                <div className="flex-shrink-0">
                  {chk.status === 'pending' && (
                    <span className="text-[10px] font-mono text-text-muted/60 uppercase tracking-wider bg-surface-card1 px-2 py-0.5 rounded border border-surface-border">Pending</span>
                  )}
                  {chk.status === 'scanning' && (
                    <span className="text-[10px] font-mono text-accent-secondary uppercase tracking-wider bg-accent-secondary/10 px-2 py-0.5 rounded border border-accent-secondary/20 flex items-center gap-1">
                      <RotateCw className="w-2.5 h-2.5 animate-spin" /> Audit
                    </span>
                  )}
                  {chk.status === 'passed' && (
                    <span className="text-[10px] font-mono text-accent-primary uppercase tracking-wider bg-accent-primary/10 px-2 py-0.5 rounded border border-accent-primary/20 flex items-center gap-1 font-bold">
                      ✓ Pass
                    </span>
                  )}
                  {chk.status === 'failed' && (
                    <span className="text-[10px] font-mono text-[#f44] uppercase tracking-wider bg-[#f44]/10 px-2 py-0.5 rounded border border-[#f44]/20 flex items-center gap-1 font-bold">
                      ✕ Vulnerable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Assessments */}
        <div className="space-y-4">
          <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 shadow-2xl">
            <h4 className="font-bold text-sm text-text-main mb-5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-secondary" /> Real-Time Threat Exposure Bars
            </h4>

            <div className="space-y-4">
              {[
                { label: "Malware Risk (DEX scanners)", value: malwareRisk, icon: Bug, col: malwareRisk > 30 ? "bg-gradient-to-r from-[#f44] to-[#ff6b6b]" : "bg-gradient-to-r from-accent-primary to-accent-secondary" },
                { label: "Network Vulnerability (Proxy probes)", value: networkVuln, icon: Wifi, col: networkVuln > 30 ? "bg-gradient-to-r from-[#f5a623] to-[#ffb84d]" : "bg-gradient-to-r from-accent-primary to-accent-secondary" },
                { label: "Privacy Exposure (API scopes)", value: privacyExposure, icon: Eye, col: privacyExposure > 50 ? "bg-gradient-to-r from-[#f5a623] to-[#f44]" : "bg-gradient-to-r from-accent-primary to-accent-secondary" },
                { label: "Physical Security (Passcode strength)", value: physicalSecurity, icon: Lock, col: physicalSecurity < 50 ? "bg-gradient-to-r from-[#f44] to-[#f5a623]" : "bg-gradient-to-r from-accent-primary to-accent-secondary" },
                { label: "Data Leakage Risk (Un-encrypted folders)", value: dataLeakageRisk, icon: Database, col: dataLeakageRisk > 30 ? "bg-gradient-to-r from-[#f5a623] to-[#ffb84d]" : "bg-gradient-to-r from-accent-primary to-accent-secondary" }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center text-xs text-text-muted mb-1">
                    <span className="flex items-center gap-1.5"><item.icon className="w-3.5 h-3.5" /> {item.label}</span>
                    <span className="font-mono text-xs font-semibold text-text-main">{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-card1 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${item.value}%` }} 
                      className={`h-full ${item.col} transition-all duration-1000 rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 shadow-2xl">
            <h4 className="font-bold text-sm text-text-main mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#f5a623]" /> Common Android / iOS Active Threats
            </h4>
            
            <div className="space-y-3">
              {[
                { tag: "High Risk", t: "Phishing SMS & Sideloaded APKs", d: "Malicious packages masking as shipping trackers harvesting credential input tokens.", color: "bg-[#f44]/10 text-[#f44] border-[#f44]/20" },
                { tag: "High Risk", t: "Unencrypted Public WiFi MITM", d: "Active routers intercepting unencrypted DNS requests and redirecting login ports.", color: "bg-[#f44]/10 text-[#f44] border-[#f44]/20" },
                { tag: "Moderate", t: "Excessive Background Scopes", d: "Free utility software silently querying localized telemetry coordinate points.", color: "bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20" },
                { tag: "Moderate", t: "Un-patched Kernel Vulnerabilities", d: "Outdated firmware leave privilege escalation exploits open.", color: "bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20" }
              ].map((threat, idx) => (
                <div key={idx} className="p-3 bg-surface-card1/80 rounded-xl border border-surface-border/50 flex gap-3 items-start">
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase flex-shrink-0 mt-0.5 border ${threat.color}`}>
                    {threat.tag}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-text-main">{threat.t}</h5>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{threat.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
