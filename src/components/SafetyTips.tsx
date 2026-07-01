import React, { useState } from "react";
import { Shield, ShieldCheck, Heart, Wrench, AlertCircle } from "lucide-react";
import { SAFETY_TIPS } from "../types";

export default function SafetyTips({ onToast }: { onToast: (m: string, t: "success" | "error" | "warning" | "info") => void }) {
  const [activeCategory, setActiveCategory] = useState("gen-s");

  const categories = [
    { id: "gen-s", label: "General Security", icon: Shield },
    { id: "dat-s", label: "Data Protection", icon: ShieldCheck },
    { id: "phy-s", label: "Physical Care", icon: Heart },
    { id: "rep-s", label: "Repair Safety", icon: Wrench }
  ];

  const handleTabChange = (catId: string, label: string) => {
    setActiveCategory(catId);
    onToast(`Viewed safety tip category: ${label}`, "info");
  };

  const currentTips = SAFETY_TIPS[activeCategory] || [];

  return (
    <div id="safety" className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="text-accent-primary w-8 h-8" /> Safety & Prevention Tips
        </h2>
        <p className="text-text-muted text-sm mt-1">Implement advanced habits to secure data, prevent physically cracked screens, and maintain battery lifespans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Category Buttons Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id, cat.label)}
              className={`w-full flex items-center gap-3 p-4 border text-sm font-semibold rounded-2xl text-left transition-all ${
                activeCategory === cat.id
                  ? "bg-accent-primary/10 border-accent-primary text-accent-primary shadow-lg shadow-accent-primary/5"
                  : "bg-surface-card2 border-surface-border text-text-muted hover:border-accent-dark hover:text-text-main"
              }`}
            >
              <cat.icon className="w-5 h-5 flex-shrink-0" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Tips Display Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentTips.map((tip, idx) => (
            <div 
              key={idx}
              className="bg-surface-card2 border border-surface-border rounded-2xl p-5 hover:border-accent-primary transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-accent-primary/5 border border-accent-primary/10 flex items-center justify-center text-accent-primary mb-4 font-mono text-xs font-bold group-hover:bg-accent-primary/10 transition-all">
                0{idx + 1}
              </div>
              <h3 className="font-bold text-sm text-text-main mb-2 group-hover:text-accent-primary transition-all leading-snug">{tip.t}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{tip.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
