import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to lazy-initialize Gemini
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets inside the AI Studio UI.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API endpoints
  app.post("/api/diagnose", async (req, res) => {
    try {
      const { brand, model, symptoms, customDescription } = req.body;
      let ai;
      try {
        ai = getAiClient();
      } catch (e: any) {
        // Return a mock structured response if API key is not configured, or if it fails
        console.warn("Gemini Client not available:", e.message);
        return res.status(200).json({
          title: "Standard Diagnostics Summary",
          severity: "med",
          summary: `Note: The Gemini API key is missing or invalid. Showing standard diagnostics for ${brand || "device"} ${model || ""}. Symptoms: ${symptoms?.join(", ") || "general issues"}. ${customDescription ? `Details: "${customDescription}"` : ""}`,
          type: "hybrid",
          steps: [
            "Perform a soft reboot (force restart) by holding down Power and Volume Down for 10-15 seconds.",
            "Inspect the charging port for debris and ensure the charging cable is not frayed.",
            "Verify that your phone has at least 5GB of free storage to prevent unexpected crashes or lag.",
            "Go to Settings > System Updates and make sure you are running the latest software.",
            "If the problem is hardware-related (cracked glass, broken buttons, no sound), consider consulting a professional repair technician."
          ],
          difficulty: "Medium",
          estTime: "15-30 mins",
          safetyWarning: "Ensure you operate in a well-ventilated, clean workspace. Never puncture a swollen battery."
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Diagnose the following smartphone issue:
Phone Brand: ${brand || "Generic/Other"}
Phone Model: ${model || "Generic/Other"}
Selected Symptoms: ${symptoms && symptoms.length > 0 ? symptoms.join(", ") : "None specified"}
User-described Details: ${customDescription || "None specified"}

Suggest specific diagnostic steps, difficulty level, estimated repair time, and a safety warning.`,
        config: {
          systemInstruction: "You are an expert smartphone hardware and software technician. Analyze the user's phone details and symptoms, and generate a structured diagnosis. Be extremely precise and helpful, referencing specific model quirks if relevant (especially for popular models like OPPO F11 Pro, iPhone 12/13/14/15, Samsung Galaxy, Pixel, etc.). For OPPO F11 Pro, note features like its pop-up front camera and rear fingerprint sensor.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Descriptive name of the issue" },
              severity: { type: Type.STRING, description: "Severity level: low, med, or hi" },
              summary: { type: Type.STRING, description: "Brief overview of what is likely causing the issue" },
              type: { type: Type.STRING, description: "Issue type: hardware, software, or hybrid" },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Step-by-step diagnostic or troubleshooting steps to perform"
              },
              difficulty: { type: Type.STRING, description: "Repair/fix difficulty: Easy, Medium, or Hard" },
              estTime: { type: Type.STRING, description: "Estimated time to fix (e.g., '15-30 mins', '1-2 hours')" },
              safetyWarning: { type: Type.STRING, description: "Specific safety warnings (e.g., handling swollen lithium batteries, sharp glass shards, static electricity)" }
            },
            required: ["title", "severity", "summary", "type", "steps", "difficulty", "estTime", "safetyWarning"]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("Diagnosis error:", error);
      res.status(500).json({ error: error.message || "Failed to perform AI diagnosis" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      let ai;
      try {
        ai = getAiClient();
      } catch (e: any) {
        console.warn("Gemini Client not available for chat:", e.message);
        return res.status(200).json({
          text: `Hello! I am the PhoneFix Pro AI assistant. Currently, the Gemini API key is not configured in the workspace secrets.

Please add your \`GEMINI_API_KEY\` in the **Settings > Secrets** panel in AI Studio to enable fully interactive AI responses.

In the meantime, you can still use the interactive diagnostics tool, security scanner, safe online OS update assistant, error database search, and repair guides in the dashboard!`
        });
      }

      // Transform to contents format
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: "You are the PhoneFix Pro AI Smartphone Repair Assistant. You help users diagnose and troubleshoot physical and software-related smartphone problems. You provide friendly, highly structured, practical, and step-by-step guidance. If a user asks a dangerous task, warn them. Always give safe, clear advice. Mention specific smartphone specifications when relevant."
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("AI Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to query AI Assistant" });
    }
  });

  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt, aspectRatio } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      
      let ai;
      try {
        ai = getAiClient();
      } catch (e: any) {
        console.warn("Gemini Client not available for image generation:", e.message);
        return res.status(503).json({ error: "Gemini API key is not configured. Please add it in Settings > Secrets." });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [
            { text: prompt }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || "16:9",
            imageSize: "1K"
          }
        }
      });

      let imageContent: string | undefined;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageContent = part.inlineData.data;
          break;
        }
      }

      if (imageContent) {
        res.json({ imageUrl: `data:image/jpeg;base64,${imageContent}` });
      } else {
        res.status(500).json({ error: "Failed to generate image" });
      }
    } catch (error: any) {
      console.error("Image generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
