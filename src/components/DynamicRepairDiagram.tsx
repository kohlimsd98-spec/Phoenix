import React, { useState } from "react";
import { Sparkles, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import repairOpeningBack from '../assets/images/repair_opening_back_1782930783040.jpg';
import repairBatteryRemoval from '../assets/images/repair_battery_removal_1782930798207.jpg';
import repairScreenLift from '../assets/images/repair_screen_lift_1782930809181.jpg';

interface DynamicRepairDiagramProps {
  guideTitle: string;
  guideDescription: string;
  onToast: (m: string, t: "success" | "error" | "warning" | "info") => void;
}

export default function DynamicRepairDiagram({ guideTitle, guideDescription, onToast }: DynamicRepairDiagramProps) {
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    setCustomImage(null);
    setIsGeneratingImage(false);
    setIsModalOpen(false);
  }, [guideTitle]);

  const getIllustrativeImage = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('battery')) return repairBatteryRemoval;
    if (t.includes('screen') || t.includes('display') || t.includes('glass')) return repairScreenLift;
    return repairOpeningBack;
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    onToast("Generating custom visual diagram with Gemini AI...", "info");
    
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `A clean, high-quality, illustrative diagram of a modern smartphone repair procedure: ${guideTitle}. ${guideDescription}. Technical line art style, isometric view, cyan and neon green accents on a dark charcoal background. No text in the image.`,
          aspectRatio: "16:9"
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate image");
      
      setCustomImage(data.imageUrl);
      onToast("Generated custom diagram successfully", "success");
    } catch (err: any) {
      console.error(err);
      onToast(err.message || "Failed to generate image", "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const currentImage = customImage || getIllustrativeImage(guideTitle);

  return (
    <>
      <div className="mb-6 rounded-2xl overflow-hidden border border-surface-border relative aspect-[2/1] sm:aspect-[2.5/1] group cursor-pointer" onClick={() => !isGeneratingImage && setIsModalOpen(true)}>
        {isGeneratingImage ? (
          <div className="w-full h-full bg-surface-card1 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
            <span className="text-xs text-text-muted font-mono">Generating AI Diagram...</span>
          </div>
        ) : (
          <>
            <img 
              src={currentImage} 
              alt="Repair Procedure Illustration" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-surface-base/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-surface-base/80 backdrop-blur-md px-3 py-2 rounded-xl text-text-main flex items-center gap-2 border border-surface-border shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <ZoomIn className="w-4 h-4 text-accent-primary" /> View Full Image
              </div>
            </div>
          </>
        )}
        
        {!isGeneratingImage && (
          <div className="absolute top-2 left-2 bg-surface-base/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-accent-primary border border-surface-border flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-accent-secondary" /> 
            {customImage ? 'AI Generated Diagram' : 'Reference Diagram'}
          </div>
        )}

        {!customImage && !isGeneratingImage && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateImage();
            }}
            className="absolute bottom-3 right-3 bg-surface-base/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-text-main border border-accent-primary/40 flex items-center gap-1.5 shadow-lg hover:border-accent-primary hover:bg-accent-primary/10 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-primary" /> Generate Dynamic
          </button>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-base/90 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full rounded-2xl overflow-hidden border border-surface-border shadow-2xl bg-surface-card1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-surface-border">
                <div className="flex items-center gap-2 text-text-main">
                  <Sparkles className="w-4 h-4 text-accent-primary" />
                  <span className="font-semibold text-sm">{customImage ? 'AI Generated Repair Diagram' : 'Reference Diagram'}</span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-card2 text-text-muted hover:text-text-main transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 bg-surface-card1">
                <img src={currentImage} alt="Full size procedure diagram" className="w-full h-auto rounded-xl max-h-[80vh] object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
