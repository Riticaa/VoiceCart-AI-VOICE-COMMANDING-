import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'voicecart-ai-build',
          }
        }
      });
    } catch (e) {
      console.warn("Could not initialize GoogleGenAI client:", e);
    }
  }
  return genAIClient;
}

// Fallback Rule-based Parser if Gemini is offline
function fallbackNLP(text: string) {
  const clean = text.toLowerCase().trim();

  // REMOVE intent
  if (clean.includes("remove") || clean.includes("delete") || clean.includes("hatao") || clean.includes("nikalo")) {
    const rawTarget = clean
      .replace(/remove|delete|from my list|from list|from cart|hatao|hata do|nikalo|please|my/g, "")
      .trim();
    return {
      action: "REMOVE_ITEM",
      items: [{ name: rawTarget || "item" }],
      spokenFeedback: `Removed ${rawTarget || "the item"} from your shopping list.`
    };
  }

  // SEARCH intent
  if (clean.includes("find") || clean.includes("search") || clean.includes("look for") || clean.includes("dhoondo") || clean.includes("dikhao")) {
    const priceMatch = clean.match(/(?:under|below|less than|kam me)\s*(?:rs\.?|rupees|inr|₹)?\s*(\d+)/i);
    const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : undefined;
    const isOrganic = clean.includes("organic") || clean.includes("desi");
    
    let query = clean
      .replace(/find me|find|search for|search|show me|look for|dikhao|dhoondo/gi, "")
      .trim();
    if (priceMatch) {
      query = query.replace(priceMatch[0], "").trim();
    }

    return {
      action: "SEARCH",
      searchQuery: query || "all products",
      filters: {
        maxPrice,
        isOrganic: isOrganic || undefined
      },
      spokenFeedback: `Searching for ${query || "products"}${maxPrice ? ` under ₹${maxPrice}` : ""}.`
    };
  }

  // CHECKOUT intent
  if (clean.includes("checkout") || clean.includes("place order") || clean.includes("pay now") || clean.includes("buy now") || clean.includes("kharido")) {
    return {
      action: "CHECKOUT",
      spokenFeedback: "Opening checkout with your items and Indian delivery address."
    };
  }

  // SUGGESTIONS intent
  if (clean.includes("suggest") || clean.includes("substitute") || clean.includes("running low") || clean.includes("recommend")) {
    return {
      action: "SHOW_SUGGESTIONS",
      spokenFeedback: "Here are your smart suggestions, seasonal items, and healthy substitutes."
    };
  }

  // SHOW LIST intent
  if (clean.includes("show list") || clean.includes("grocery list") || clean.includes("my list") || clean.includes("kya hai cart me")) {
    return {
      action: "SHOW_LIST",
      spokenFeedback: "Showing your active shopping list organized by category."
    };
  }

  // Default: ADD ITEM intent
  const tokens = clean.replace(/add|i need|i want|chahiye|jodo|le aao/gi, "").trim();
  const parts = tokens.split(/\band\b|,/i);
  const items = parts.map(p => {
    const trimmed = p.trim();
    const qtyMatch = trimmed.match(/^(\d+)\s*(kg|g|litre|litres|pack|packet|packets|dozen|cup|cups|bottles|pcs|bunch)?\s*(.*)/i);
    if (qtyMatch) {
      return {
        quantity: parseInt(qtyMatch[1], 10),
        unit: qtyMatch[2] || "item",
        name: (qtyMatch[3] || trimmed).trim()
      };
    }
    return {
      quantity: 1,
      unit: "item",
      name: trimmed
    };
  }).filter(it => it.name.length > 0);

  return {
    action: "ADD_ITEM",
    items: items.length > 0 ? items : [{ name: clean, quantity: 1, unit: "item" }],
    spokenFeedback: `Added ${items.map(i => `${i.quantity} ${i.name}`).join(", ") || clean} to your shopping list!`
  };
}

// API Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", app: "VoiceCart AI", currency: "INR (₹)", time: new Date().toISOString() });
});

// Natural Language Voice Command NLP API
app.post("/api/nlp-command", async (req: Request, res: Response) => {
  const { commandText, language = "en" } = req.body;

  if (!commandText || typeof commandText !== "string") {
    res.status(400).json({ error: "commandText is required" });
    return;
  }

  const ai = getGenAI();

  if (!ai) {
    // Return robust fallback parser
    const fallback = fallbackNLP(commandText);
    res.json({ ...fallback, method: "rule-based" });
    return;
  }

  try {
    const prompt = `You are the Natural Language Processing engine for "VoiceCart AI", an Indian grocery voice shopping assistant with currency in Indian Rupees (₹).
User spoken query: "${commandText}"
Language hint: "${language}"

Task: Parse the user's intent, extract items, quantities, units, brands, price filters (in ₹ INR), and generate a warm, concise spoken confirmation feedback.

Recognized actions:
- ADD_ITEM (e.g., "Add 2 packs of Amul butter and 1 kg Shimla apples", "2 packet doodh jodo", "buy bananas")
- REMOVE_ITEM (e.g., "Remove milk from my list", "aloo bhujia hatao")
- SEARCH (e.g., "Find me organic apples under ₹150", "dhoondo Tata tea under 200 rupees")
- SHOW_LIST (e.g., "Show my grocery list", "what is in my cart")
- SHOW_SUGGESTIONS (e.g., "Show recommendations", "what am I running low on", "suggest milk substitutes")
- CHECKOUT (e.g., "Proceed to checkout", "place order", "buy now")
- CLEAR_LIST (e.g., "Clear entire list", "sab hata do")
- SWAP_ITEM (e.g., "Swap cow milk with almond milk")

Categories to map to: "Produce", "Dairy", "Pantry & Staples", "Snacks", "Beverages", "Personal Care".
Popular Indian Brands: Amul, Tata, Aashirvaad, Mother Dairy, Epigamia, Fortune, Haldiram's, Parle, Dabur, Paper Boat.

Return valid JSON adhering to the specified schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              description: "The primary action detected",
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Normalized item name" },
                  brand: { type: Type.STRING, description: "Brand name if mentioned e.g. Amul, Tata" },
                  category: { type: Type.STRING, description: "Produce, Dairy, Pantry & Staples, Snacks, Beverages, Personal Care" },
                  quantity: { type: Type.NUMBER, description: "Extracted numeric quantity" },
                  unit: { type: Type.STRING, description: "Unit e.g. kg, litre, pack, dozen, bunch, pcs" },
                  isOrganic: { type: Type.BOOLEAN, description: "Whether organic/desi is specified" }
                },
                required: ["name"]
              }
            },
            searchQuery: { type: Type.STRING, description: "Search query string if action is SEARCH" },
            filters: {
              type: Type.OBJECT,
              properties: {
                maxPrice: { type: Type.NUMBER, description: "Maximum price filter in ₹ INR" },
                isOrganic: { type: Type.BOOLEAN, description: "Organic filter" },
                brand: { type: Type.STRING, description: "Brand filter" },
                category: { type: Type.STRING, description: "Category filter" }
              }
            },
            spokenFeedback: { type: Type.STRING, description: "Natural spoken voice feedback for text-to-speech confirmation" },
            detectedLanguage: { type: Type.STRING, description: "en, hi, hinglish, ta, te" }
          },
          required: ["action", "spokenFeedback"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ ...parsed, method: "gemini-ai" });
  } catch (error) {
    console.error("Gemini NLP parsing error, using fallback:", error);
    const fallback = fallbackNLP(commandText);
    res.json({ ...fallback, method: "fallback-rule" });
  }
});

// Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VoiceCart AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
