import React, { useState, useEffect } from "react";
import { 
  Cloud, Smartphone, ShieldCheck, BatteryCharging, 
  Wifi, HardDrive, Plug, ShieldAlert, Key, Clock, RefreshCw, 
  Check, ListTodo, Info, AlertTriangle, BookOpen
} from "lucide-react";
import { PHONE_BRANDS } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface PreCheckItem {
  id: string;
  label: string;
  icon: any;
}

const PRE_CHECKS: PreCheckItem[] = [
  { id: 'backup', label: 'Full data backup completed', icon: Cloud },
  { id: 'battery50', label: 'Battery level above 50%', icon: BatteryCharging },
  { id: 'storage', label: 'At least 5GB free storage', icon: HardDrive },
  { id: 'wifi', label: 'Connected to stable WiFi', icon: Wifi },
  { id: 'charger', label: 'Charger connected', icon: Plug },
  { id: 'offbrand', label: 'No third-party mods/custom ROMs', icon: ShieldAlert },
  { id: 'accounts', label: 'Know all account passwords', icon: Key },
  { id: 'time', label: '30-45 minutes uninterrupted', icon: Clock }
];

const BRAND_PATHS = [
  { brand: 'iphone', label: 'Apple iPhone', path: 'Settings > General > Software Update', desc: 'OTA via stable WiFi or iTunes/Finder' },
  { brand: 'samsung', label: 'Samsung Galaxy', path: 'Settings > Software Update', desc: 'OTA or Samsung Smart Switch PC companion' },
  { brand: 'oppo', label: 'OPPO / Realme', path: 'Settings > System Update', desc: 'OTA via stable WiFi or OPPO Phone Assistant PC' },
  { brand: 'xiaomi', label: 'Xiaomi / HyperOS', path: 'About Phone > MIUI/HyperOS Version', desc: 'OTA or Mi Flash Tool' },
  { brand: 'pixel', label: 'Google Pixel', path: 'Settings > System > System Update', desc: 'A/B seamless background update' }
];

const RECOVERY_STEPS: Record<string, { n: string; steps: { t: string; d: string }[] }> = {
  iphone: {
    n: "iOS / iPhone",
    steps: [
      { t: "Verify Current Version", d: "Navigate to Settings > General > About to verify current build and compare with Apple release logs." },
      { t: "Connect Charger & WiFi", d: "Major iOS updates require the phone to be connected to AC power and on stable home Wi-Fi." },
      { t: "Initiate Server Handshake", d: "Open Software Update. iPhone connects to Apple authentication servers to verify cryptographic signature eligibility." },
      { t: "Download OTA Package", d: "Tap Download and Install. Monitor the download progress. The download is typically 2GB - 5GB." },
      { t: "Verify Package Integrity", d: "iOS automatically executes a localized checksum verification. Status will say 'Preparing Update...'." },
      { t: "Extract & Reboot", d: "iPhone reboots to Apple logo with a status bar. Do not interrupt power or touch any hardware buttons." },
      { t: "Post-Install Configuration", d: "Enter passcode, re-enter Apple ID credentials if prompted, and review new privacy policy notices." },
      { t: "Verification Check", d: "Go to Settings > General > About to confirm successful version migration. Test camera, biometrics, and cell radios." }
    ]
  },
  samsung: {
    n: "Samsung One UI",
    steps: [
      { t: "Verify Current One UI Version", d: "Go to Settings > About Phone > Software Information to check One UI and Android base versions." },
      { t: "AC Power Connection Check", d: "Ensure battery is above 50% or connected to charger. Recommended: Backup via Samsung Smart Switch." },
      { t: "Check Samsung Servers", d: "Go to Settings > Software Update > Download and Install. The phone queries regional CSC servers." },
      { t: "Download Delta Packages", d: "Download the official update package. Files are cryptographically signed by Samsung to protect Knox vault." },
      { t: "Verify and Pre-install", d: "Knox security verifies system files. Preparing update files usually takes 10 to 15 minutes." },
      { t: "Reboot to Odin Recovery", d: "Tap Install. Phone boots to system flashing state with Samsung gears animation. Do not touch hardware keys." },
      { t: "Android App Migration", d: "Major upgrade cycles run 'Optimizing apps' to recompile native dex code on first boot." },
      { t: "Complete Verification", d: "Confirm One UI is functional. Verify Knox integrity, Samsung Pay, and secure folder folders." }
    ]
  },
  oppo: {
    n: "OPPO ColorOS",
    steps: [
      { t: "Check ColorOS Details", d: "Go to Settings > About Phone. Note current ColorOS version (especially important for F11 Pro region locks)." },
      { t: "OPPO Account & Backup", d: "Log in to OPPO Cloud and run local system configuration backup to additional SD storage." },
      { t: "WiFi Lock & Current Check", d: "Connect charger. Go to Settings > System Update. Enable 'Auto-download over WiFi'." },
      { t: "Query OPPO OTA Server", d: "Tap Check for Updates to query OPPO regional distribution center for certified F11 Pro releases." },
      { t: "Download Signed Package", d: "Download stock OTA ZIP (usually 1.5GB to 4GB). OPPO signature is verified before writing boot segments." },
      { t: "Verification Phase", d: "ColorOS decodes zip security keys to ensure update is untouched. This prevents bricking during active partition writing." },
      { t: "Install & pop-up check", d: "Reboots to OPPO logo with progress animation. (F11 Pro takes 10-20 min). Motorized pop-up camera stays retracted." },
      { t: "Final Registration", d: "Re-enroll face access and rear capacitive fingerprint. Go to Settings to confirm version." }
    ]
  }
};

export default function OSUpdate({ onToast }: { onToast: (m: string, t: "success" | "error" | "warning" | "info") => void }) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [updateFinished, setUpdateFinished] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeBrandModal, setActiveBrandModal] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    if (updating) return;
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setSelectedModel("");
    resetState();
  };

  const resetState = () => {
    setCheckedItems([]);
    setUpdating(false);
    setProgress(0);
    setActiveStepIdx(-1);
    setCompletedSteps([]);
    setUpdateFinished(false);
  };

  const allChecksPassed = checkedItems.length === PRE_CHECKS.length;

  const handleStartUpdate = () => {
    if (!allChecksPassed || updating) return;
    setUpdating(true);
    setProgress(0);
    setCompletedSteps([]);
    setUpdateFinished(false);
    onToast("Secure Update Initialized", "success");

    // Fetch update instructions or fallback to 'oppo' if not specifically matched
    const updateData = RECOVERY_STEPS[selectedBrand] || RECOVERY_STEPS['oppo'];
    const stepsCount = updateData.steps.length;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= stepsCount) {
        clearInterval(interval);
        setUpdating(false);
        setUpdateFinished(true);
        setProgress(100);
        onToast("OS update simulation successfully guided!", "success");
        return;
      }

      setActiveStepIdx(currentStep);
      const prgVal = Math.round(((currentStep + 0.5) / stepsCount) * 100);
      setProgress(prgVal);

      setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        currentStep++;
        const nextPrgVal = Math.round((currentStep / stepsCount) * 100);
        setProgress(nextPrgVal);
      }, 2000);

    }, 2800);
  };

  const currentUpdateData = RECOVERY_STEPS[selectedBrand] || RECOVERY_STEPS['oppo'];

  return (
    <div id="osup" className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Cloud className="text-accent-primary w-8 h-8" /> Safe Online OS Update
        </h2>
        <p className="text-text-muted text-sm mt-1">Verify cryptographical signatures and follow safe guided steps to update phone operating systems</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update controls */}
        <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-secondary to-transparent" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-surface-base">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-main">Secure Update Assistant</h3>
              <p className="text-xs text-text-muted">Analyze stock firmware releases and execute verification protocols</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">Device Brand</label>
              <select 
                value={selectedBrand}
                onChange={handleBrandChange}
                className="w-full px-4 py-3 bg-surface-card1 border border-surface-border rounded-xl text-text-main focus:outline-none focus:border-accent-primary cursor-pointer"
              >
                <option value="">-- Select Brand --</option>
                <option value="iphone">Apple iPhone</option>
                <option value="samsung">Samsung One UI</option>
                <option value="oppo">OPPO ColorOS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-muted font-semibold uppercase tracking-wider mb-2">Model</label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedBrand}
                className="w-full px-4 py-3 bg-surface-card1 border border-surface-border rounded-xl text-text-main focus:outline-none focus:border-accent-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">-- Select Model --</option>
                {selectedBrand && PHONE_BRANDS[selectedBrand]?.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Safety Checklist */}
          {selectedModel && !updating && !updateFinished && (
            <div className="mt-4 border-t border-surface-border/50 pt-4 animate-fadeIn">
              <h4 className="text-sm font-semibold text-text-main mb-1 flex items-center gap-1.5">
                <ListTodo className="w-4 h-4 text-accent-primary" /> Pre-Update Safety Checklist
              </h4>
              <p className="text-xs text-text-muted mb-4">Complete all safety steps below to unlock the secure updater:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {PRE_CHECKS.map(item => {
                  const Icon = item.icon;
                  const isChecked = checkedItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all ${
                        isChecked 
                          ? "bg-accent-primary/10 border-accent-primary text-accent-primary" 
                          : "bg-surface-card1 border-surface-border text-text-muted hover:border-accent-dark"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        isChecked ? "bg-accent-primary border-accent-primary text-surface-base" : "border-surface-border"
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleStartUpdate}
                disabled={!allChecksPassed}
                className="w-full py-3.5 bg-gradient-to-r from-accent-primary to-accent-secondary disabled:from-surface-card1 disabled:to-surface-card1 disabled:text-text-muted disabled:border-surface-border disabled:border text-surface-base font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Begin Secure Update
              </button>
            </div>
          )}

          {/* Update Simulator active state */}
          {(updating || updateFinished) && (
            <div className="mt-4 border-t border-surface-border/50 pt-6 animate-fadeIn">
              <div className={`p-4 rounded-xl border flex gap-3 items-center mb-6 ${
                updateFinished ? "bg-accent-primary/5 border-accent-primary/20" : "bg-accent-secondary/5 border-accent-secondary/20"
              }`}>
                {updating ? (
                  <RefreshCw className="w-5 h-5 text-accent-secondary animate-spin flex-shrink-0" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-accent-primary flex-shrink-0" />
                )}
                <div>
                  <span className={`block text-xs font-bold uppercase tracking-wider ${
                    updateFinished ? "text-accent-primary" : "text-accent-secondary"
                  }`}>
                    {updateFinished ? "Update Succeeded!" : "Flashing Safe Firmware..."}
                  </span>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {updateFinished 
                      ? "Cryptographical integrity matches verified hash tables." 
                      : `Step ${activeStepIdx + 1}: ${currentUpdateData.steps[activeStepIdx]?.t}...`
                    }
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-mono text-text-muted mb-1.5">
                  <span>Installation Progress</span>
                  <span className="text-text-main font-bold">{progress}%</span>
                </div>
                <div className="h-2 bg-surface-card1 border border-surface-border rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${progress}%` }} 
                    className="h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-dark transition-all duration-300 rounded-full"
                  />
                </div>
              </div>

              {/* Process steps timeline */}
              <div className="space-y-4 mb-6">
                {currentUpdateData.steps.map((step, idx) => {
                  const isActive = idx === activeStepIdx;
                  const isDone = completedSteps.includes(idx);
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-4 border-l-2 pl-4 relative transition-all ${
                        isActive ? "border-accent-primary opacity-100" : 
                        isDone ? "border-accent-primary/40 opacity-70" : "border-surface-border opacity-35"
                      }`}
                    >
                      <div className={`absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full ${
                        isActive ? "bg-accent-primary ring-4 ring-accent-primary/10" : 
                        isDone ? "bg-accent-primary/70" : "bg-surface-border"
                      }`} />
                      <div>
                        <h5 className="text-xs font-bold text-text-main">{step.t}</h5>
                        {isActive && <p className="text-xs text-text-muted mt-1 leading-relaxed">{step.d}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {updateFinished && (
                <div className="flex gap-3 flex-wrap">
                  <button 
                    onClick={resetState}
                    className="px-5 py-2.5 bg-surface-card1 border border-surface-border hover:border-accent-dark text-xs font-semibold rounded-xl text-text-main transition-all"
                  >
                    Update Another Device
                  </button>
                  <button 
                    onClick={() => setShowPostModal(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-accent-primary to-accent-dark text-xs font-bold rounded-xl text-surface-base transition-all"
                  >
                    Post-Update Verification
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Informative Side Cards */}
        <div className="space-y-4">
          <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 shadow-xl">
            <h4 className="font-bold text-sm text-text-main mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-accent-secondary" /> Latest Available OS Versions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: "iOS 17.5", d: "Apple iPhone 15" },
                { v: "One UI 6.1", d: "Samsung Galaxy S24" },
                { v: "HyperOS 1.1", d: "Xiaomi 14 series" },
                { v: "OxygenOS 14", d: "OnePlus 12 series" },
                { v: "Android 14", d: "Google Pixel 8" },
                { v: "ColorOS 14.1", d: "OPPO F11 Pro" }
              ].map((item, idx) => (
                <div key={idx} className="bg-surface-card1 border border-surface-border rounded-xl p-3 text-center">
                  <div className="font-mono text-xs font-bold text-accent-primary">{item.v}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">{item.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 shadow-xl">
            <h4 className="font-bold text-sm text-text-main mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent-primary" /> Authorized Update Channels
            </h4>
            <div className="space-y-2">
              {BRAND_PATHS.map((bp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveBrandModal(bp.brand);
                    onToast(`Opened ${bp.label} update guidelines`, "info");
                  }}
                  className="w-full text-left bg-surface-card1/60 border border-surface-border/50 hover:border-accent-primary p-3 rounded-xl transition-all flex gap-3 items-start"
                >
                  <Smartphone className="w-4 h-4 text-text-main mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-text-main">{bp.label} Path</h5>
                    <p className="text-[10px] font-mono text-accent-primary mt-0.5">{bp.path}</p>
                    <p className="text-[10px] text-text-muted">{bp.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-card2 border border-[#f5a623]/25 bg-gradient-to-br from-surface-card2 to-[#f5a623]/2 rounded-2xl p-6 shadow-xl">
            <h4 className="font-bold text-sm text-[#f5a623] mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Crucial Firmware Principles
            </h4>
            <ul className="space-y-2 text-xs text-text-muted leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#f5a623] font-bold">•</span>
                <span><strong>No Interruption:</strong> Never reboot, remove power, or press lock buttons during active flashing. If power shuts down mid-flash, the bootloader partitions can permanently brick.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#f5a623] font-bold">•</span>
                <span><strong>Stable Connection Only:</strong> Always carry out updates via high-speed home fiber networks. Cellular data updates are prone to sudden cellular tower dropouts.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#f5a623] font-bold">•</span>
                <span><strong>Storage headroom:</strong> Smartphone system compilations generate massive cache folders. Clear space to avoid critical compilation crashes.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Post-Update Verification Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-surface-border pb-3 mb-4">
              <h3 className="font-bold text-base text-text-main flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent-primary" /> Post-Update Checklist
              </h3>
              <button 
                onClick={() => setShowPostModal(false)}
                className="text-text-muted hover:text-text-main"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-text-muted mb-4">Execute these diagnostic checks on the phone immediately to verify installation success:</p>
            <ol className="space-y-3 mb-6">
              {[
                "Verify system build details under Settings > General > Software Update.",
                "Verify cellular and carrier network registers (make/receive voice calls).",
                "Execute optical sensor checks (front selfie and main rear lenses).",
                "Execute capacitive/optical biometric audits (re-enroll fingerprints and face profiles).",
                "Test Bluetooth handshake (pair with a headset to check audio packet pipelines).",
                "Assess battery telemetry logs (monitor for abnormal drain patterns for the first 24 hours)."
              ].map((step, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-text-muted">
                  <span className="w-5 h-5 rounded bg-accent-primary/10 text-accent-primary text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setShowPostModal(false)}
              className="w-full py-2 bg-accent-primary text-surface-base font-bold text-xs rounded-xl hover:bg-accent-dark transition-all"
            >
              Checklist Confirmed
            </button>
          </div>
        </div>
      )}

      {/* Specific Brand Update Modal */}
      {activeBrandModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-surface-border pb-3 mb-4">
              <h3 className="font-bold text-base text-text-main uppercase">
                {activeBrandModal === 'iphone' ? 'Apple iOS' : activeBrandModal === 'samsung' ? 'Samsung One UI' : 'OPPO ColorOS'} Guide
              </h3>
              <button 
                onClick={() => setActiveBrandModal(null)}
                className="text-text-muted hover:text-text-main"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {(RECOVERY_STEPS[activeBrandModal] || RECOVERY_STEPS['oppo']).steps.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-accent-primary/15 text-accent-primary font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-text-main">{s.t}</h5>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setActiveBrandModal(null)}
              className="w-full py-2 bg-surface-card1 border border-surface-border hover:border-accent-primary text-text-main text-xs font-bold rounded-xl transition-all"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
