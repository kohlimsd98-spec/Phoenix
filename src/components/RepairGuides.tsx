import React, { useState } from "react";
import { 
  Wrench, ShieldAlert, Cpu, Heart, Clock, Gauge, Filter, 
  Sparkles, CheckCircle2, ChevronRight, AlertTriangle
} from "lucide-react";
import { GUIDES } from "../types";
import { motion, AnimatePresence } from "motion/react";
import DynamicRepairDiagram from "./DynamicRepairDiagram";

interface Guide {
  b: string;
  t: string;
  d: string;
  df: "Easy" | "Medium" | "Hard";
  tm: string;
  im: string;
}

export default function RepairGuides({ onToast }: { onToast: (m: string, t: "success" | "error" | "warning" | "info") => void }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);

  // Pre-repair and teardown checkpoints
  const [preChecked, setPreChecked] = useState<number[]>([]);
  const [teardownChecked, setTeardownChecked] = useState<number[]>([]);

  const togglePreCheck = (idx: number) => {
    setPreChecked(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleTeardownCheck = (idx: number) => {
    setTeardownChecked(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleOpenGuide = (g: Guide) => {
    setActiveGuide(g);
    setPreChecked([]);
    setTeardownChecked([]);
    onToast(`Opened ${g.t}`, "info");
  };

  const categories = [
    { id: "all", label: "All Brands" },
    { id: "iphone", label: "iPhone" },
    { id: "samsung", label: "Samsung" },
    { id: "oppo", label: "OPPO" },
    { id: "xiaomi", label: "Xiaomi" },
    { id: "pixel", label: "Pixel" },
    { id: "oneplus", label: "OnePlus" }
  ];

  const filteredGuides = selectedCategory === "all"
    ? GUIDES
    : GUIDES.filter(g => g.b === selectedCategory);

  const getDifficultyColor = (df: string) => {
    switch (df) {
      case 'Easy': return "bg-accent-primary/10 text-accent-primary border-accent-primary/20";
      case 'Medium': return "bg-[#f5a623]/10 text-[#f5a623] border-[#f5a623]/20";
      case 'Hard': return "bg-[#f44]/10 text-[#f44] border-[#f44]/20";
      default: return "bg-text-muted/10 text-text-muted border-surface-border";
    }
  };

  return (
    <div id="repair" className="scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Wrench className="text-accent-primary w-8 h-8" /> Specialized Repair Guides
          </h2>
          <p className="text-text-muted text-sm mt-1">Detailed physical tear-down checklists, safety steps, and modular parts transplantation guides</p>
        </div>

        {/* Categories Rail */}
        <div className="flex gap-1 bg-surface-card1 border border-surface-border p-1 rounded-xl overflow-x-auto max-w-full">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                onToast(`Filtered by ${cat.label}`, "info");
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === cat.id 
                  ? "bg-accent-primary text-surface-base font-bold" 
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((g, idx) => (
          <div
            key={idx}
            onClick={() => handleOpenGuide(g)}
            className="bg-surface-card2 border border-surface-border hover:border-accent-primary/70 rounded-2xl overflow-hidden shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
          >
            {/* Guide image with overlay */}
            <div className="h-44 relative bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${g.im})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-surface-base/40 to-transparent" />
              <span className="absolute top-3 left-3 bg-surface-base/80 backdrop-blur-md border border-surface-border text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded text-accent-primary">
                {g.b}
              </span>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-base text-text-main mb-1.5 group-hover:text-accent-primary transition-all line-clamp-1">{g.t}</h3>
              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4 h-8">{g.d}</p>
              
              <div className="flex justify-between items-center text-[11px] border-t border-surface-border/50 pt-3">
                <span className="text-text-muted flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent-secondary" /> {g.tm}</span>
                <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold rounded uppercase ${getDifficultyColor(g.df)}`}>
                  {g.df}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide Overlay Modal */}
      <AnimatePresence>
        {activeGuide && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-surface-card2 border border-surface-border rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative">
              <button 
                onClick={() => setActiveGuide(null)}
                className="absolute top-4 right-4 text-sm text-text-muted hover:text-text-main"
              >
                ✕ Close
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-3 mt-2">
                <span className="bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {activeGuide.b}
                </span>
                <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold rounded uppercase ${getDifficultyColor(activeGuide.df)}`}>
                  {activeGuide.df}
                </span>
                <span className="text-xs font-mono text-text-muted flex items-center gap-1 ml-2">
                  <Clock className="w-3.5 h-3.5 text-accent-secondary" /> {activeGuide.tm}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-text-main mb-3">{activeGuide.t}</h3>
              <p className="text-xs text-text-muted leading-relaxed mb-6 pb-4">{activeGuide.d}</p>

              {/* Dynamic Diagram Component */}
              <DynamicRepairDiagram 
                guideTitle={activeGuide.t} 
                guideDescription={activeGuide.d} 
                onToast={onToast} 
              />

              {/* Checklist 1: Pre-Repair */}
              <div className="mb-6 pt-4 border-t border-surface-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-secondary" /> Pre-Repair Audit Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-card1 p-4 rounded-xl border border-surface-border/50">
                  {[
                    "Complete local files backup",
                    "Discharge device below 25% (safer)",
                    "Power down the smartphone completely",
                    "Isolate a clean antistatic silicone mat",
                    "Acquire certified spare replacement module",
                    "Acquire screwdrivers, plastic spudgers & hot air gun"
                  ].map((step, idx) => {
                    const isChecked = preChecked.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => togglePreCheck(idx)}
                        className={`flex items-center gap-2 text-left text-xs transition-all ${
                          isChecked ? "text-accent-primary" : "text-text-muted hover:text-text-main"
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                          isChecked ? "bg-accent-primary border-accent-primary text-surface-base" : "border-surface-border"
                        }`}>
                          {isChecked && <span className="text-[9px] font-bold">✓</span>}
                        </div>
                        <span className="truncate">{step}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checklist 2: Teardown Steps */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-main mb-3 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-accent-primary" /> Teardown & Transplant Instructions
                </h4>
                <div className="space-y-2">
                  {[
                    "Softening: Use the heat gun at 80°C for 2 minutes to soften the rear plate adhesive.",
                    "Slicing: Insert a thin plastic card or guitar pick into the backplate seam to slice around the seal.",
                    "Isolating Power: Immediately detach the motherboard flexible battery connector ribbon.",
                    "Screw Mapping: Unscrew intermediate modular armor guards. Group screws carefully by size.",
                    "Dismounting: Uncouple the damaged module (ribbon lock handles must be lifted gently).",
                    "Transplanting: Clean any remaining gasket adhesive, lock in the new module, and reconnect the battery ribbon LAST.",
                    "Verification: Temporarily power up the phone to test display, camera, or charging before glue seals."
                  ].map((step, idx) => {
                    const isChecked = teardownChecked.includes(idx);
                    return (
                      <div 
                        key={idx}
                        onClick={() => toggleTeardownCheck(idx)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex gap-3 items-start ${
                          isChecked 
                            ? "bg-accent-primary/5 border-accent-primary/20 text-accent-primary" 
                            : "bg-surface-card1 border-surface-border text-text-muted hover:border-accent-dark"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                          isChecked ? "bg-accent-primary text-surface-base" : "bg-surface-border text-text-muted"
                        }`}>
                          {idx + 1}
                        </span>
                        <p className="text-xs leading-relaxed">{step}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Caution Area */}
              <div className="p-4 bg-[#f44]/5 border border-[#f44]/20 rounded-xl flex gap-3 items-start mb-6">
                <AlertTriangle className="w-5 h-5 text-[#f44] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-[#f44] uppercase tracking-wider">Critical Repair Caution</span>
                  <p className="text-xs text-text-muted leading-relaxed mt-1">
                    Always avoid metal tool contact with battery casing. Puncturing the sleeve triggers thermal runaway, which causes extreme chemical fires. If not confident, we highly recommend visiting an authorized center.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveGuide(null);
                    onToast("Repair guide closed", "info");
                  }}
                  className="w-full py-3 bg-surface-card1 border border-surface-border text-xs font-bold text-text-main rounded-xl hover:border-accent-primary transition-all"
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
