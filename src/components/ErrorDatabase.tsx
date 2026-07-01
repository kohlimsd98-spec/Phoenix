import React, { useState } from "react";
import { Database, Search, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { ERROR_DATABASE, ErrorCodeEntry } from "../types";

export default function ErrorDatabase({ onToast }: { onToast: (m: string, t: "success" | "error" | "warning" | "info") => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all-e");

  const tabs = [
    { id: "all-e", label: "All Errors" },
    { id: "ios-e", label: "iOS / iPhone" },
    { id: "and-e", label: "Android" },
    { id: "hw-e", label: "Hardware" },
    { id: "net-e", label: "Network" }
  ];

  const filteredErrors = ERROR_DATABASE.filter(err => {
    // Tab filter matching
    let tabMatch = false;
    if (activeTab === "all-e") {
      tabMatch = true;
    } else if (activeTab === "ios-e") {
      tabMatch = err.p === "iOS";
    } else if (activeTab === "and-e") {
      tabMatch = err.p.includes("Android") || err.p.includes("ColorOS");
    } else {
      tabMatch = err.cat === activeTab;
    }

    // Text search matching
    const matchesSearch = 
      err.c.toLowerCase().includes(searchQuery.toLowerCase()) ||
      err.d.toLowerCase().includes(searchQuery.toLowerCase()) ||
      err.p.toLowerCase().includes(searchQuery.toLowerCase()) ||
      err.f.toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && matchesSearch;
  });

  const getSeverityBadge = (sv: string) => {
    switch (sv) {
      case 'crit': 
        return <span className="bg-[#f44]/10 text-[#f44] border border-[#f44]/20 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded">Critical</span>;
      case 'warn': 
        return <span className="bg-[#f5a623]/10 text-[#f5a623] border border-[#f5a623]/20 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded">Warning</span>;
      default: 
        return <span className="bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded">Info</span>;
    }
  };

  const handleTabChange = (tabId: string, label: string) => {
    setActiveTab(tabId);
    onToast(`Filtered database by ${label}`, "info");
  };

  return (
    <div id="errs" className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Database className="text-accent-primary w-8 h-8" /> Error Code Database
        </h2>
        <p className="text-text-muted text-sm mt-1">Search immediate professional remedies for hardware codes, OS verification halts, and bootloader failures</p>
      </div>

      {/* Tabs list */}
      <div className="flex gap-1 bg-surface-card1 border border-surface-border p-1 rounded-xl overflow-x-auto max-w-full mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id, tab.label)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-accent-primary text-surface-base font-bold" 
                : "text-text-muted hover:text-text-main"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search codes, error descriptors, platform tags, or fixes..."
          className="w-full pl-12 pr-4 py-3.5 bg-surface-card2 border border-surface-border focus:border-accent-primary text-sm text-text-main placeholder-text-muted/40 rounded-xl focus:outline-none"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-surface-card2 border border-surface-border rounded-2xl shadow-xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surface-card1 border-b border-surface-border">
              <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Error Code</th>
              <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Platform</th>
              <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Description</th>
              <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Severity</th>
              <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider">Remedial Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50 text-xs">
            {filteredErrors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-text-muted text-sm font-medium">
                  No matching error codes found. Try another keywords!
                </td>
              </tr>
            ) : (
              filteredErrors.map((err, idx) => (
                <tr key={idx} className="hover:bg-surface-card1/35 transition-all">
                  <td className="p-4">
                    <span className="font-mono font-bold text-accent-primary bg-accent-primary/5 border border-accent-primary/10 px-2.5 py-1 rounded-lg">
                      {err.c}
                    </span>
                  </td>
                  <td className="p-4 text-text-main font-medium">{err.p}</td>
                  <td className="p-4 text-text-muted max-w-xs leading-relaxed">{err.d}</td>
                  <td className="p-4">{getSeverityBadge(err.sv)}</td>
                  <td className="p-4 text-text-muted max-w-sm leading-relaxed border-l border-surface-border/30 pl-4">
                    <strong className="text-text-main block mb-1">Fix Workflow:</strong>
                    {err.f}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
