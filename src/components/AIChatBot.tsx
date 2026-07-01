import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Trash2, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "How do I clean OPPO F11 Pro motorized pop-up camera lens?",
  "iPhone battery adhesive pull-tabs tear. How do I remove safely?",
  "My smartphone fell in a pool, what should I do first?",
  "What causes the SYSTEM_UI_CRASH boot loop on Android?"
];

export default function AIChatBot({ onToast }: { onToast: (m: string, t: "success" | "error" | "warning" | "info") => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I am the PhoneFix Pro AI Assistant. Ask me anything about hardware troubleshooting, diagnostic codes, or step-by-step physical repair guidelines!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      if (!res.ok) {
        throw new Error("Chat server error");
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.text || "I'm sorry, I couldn't formulate a response." }]);
    } catch (err: any) {
      console.warn("AI Chat fallback error:", err.message);
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "I am experiencing difficulty connecting to the server. Please verify that your Gemini API key is properly entered in Settings > Secrets."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: "assistant", text: "Conversation history cleared. How can I assist you with smartphone repairs today?" }
    ]);
    onToast("Chat cleared", "info");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-r from-accent-primary to-accent-secondary text-surface-base rounded-full flex items-center justify-center shadow-lg shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all relative group"
          >
            <div className="absolute inset-0 bg-accent-primary rounded-full animate-ping opacity-15" />
            <MessageSquare className="w-6 h-6 stroke-[2.5]" />
            <span className="absolute right-0 -top-1 bg-[#f44] text-[9px] text-text-main font-bold px-1.5 py-0.5 rounded-full animate-bounce">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="w-[90vw] sm:w-[400px] h-[550px] bg-surface-card2 border border-surface-border rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
          >
            {/* Header */}
            <div className="p-4 bg-surface-card1 border-b border-surface-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-main">PhoneFix Pro AI</h4>
                  <span className="text-[10px] text-accent-primary flex items-center gap-1.5 font-medium mt-0.5">
                    <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-ping" /> Diagnostic Copilot Online
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={clearChat}
                  title="Clear Chat History"
                  className="p-1.5 hover:bg-surface-card3 text-text-muted hover:text-[#f44] rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-surface-card3 text-text-muted hover:text-text-main rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-base/40"
            >
              {messages.map((m, idx) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div 
                    key={idx}
                    className={`flex items-start gap-2.5 ${isAssistant ? "" : "flex-row-reverse"}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isAssistant ? "bg-accent-primary/10 text-accent-primary" : "bg-accent-secondary/10 text-accent-secondary"
                    }`}>
                      {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                      isAssistant 
                        ? "bg-surface-card1 text-text-muted border border-surface-border/50 rounded-tl-sm" 
                        : "bg-accent-primary/10 text-text-main border border-accent-primary/20 rounded-tr-sm"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-accent-primary/10 text-accent-primary flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 bg-surface-card1 border border-surface-border/30 rounded-2xl rounded-tl-sm text-[11px] font-mono text-accent-primary flex items-center gap-1.5">
                    Analyzing schematics...
                  </div>
                </div>
              )}
            </div>

            {/* Suggestion Prompts */}
            {messages.length === 1 && (
              <div className="p-3 border-t border-surface-border/30 bg-surface-base/20">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3 text-accent-primary" /> Try questioning:</p>
                <div className="space-y-1">
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="w-full text-left p-1.5 rounded bg-surface-card1 hover:bg-surface-card3 border border-surface-border/40 text-[10px] text-text-muted hover:text-text-main transition-all truncate"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-surface-card1 border-t border-surface-border flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the repair bot a question..."
                className="flex-1 px-3 py-2 bg-surface-card2 border border-surface-border focus:border-accent-primary text-xs text-text-main placeholder-text-muted/40 rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-3 py-2 bg-accent-primary text-surface-base rounded-xl font-bold text-xs hover:bg-accent-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
