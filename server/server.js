import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// =========================
// GEMINI
// =========================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());


// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "StockTrend AI backend is running"
    });

});




app.get("/api/models", async (req, res) => {
    try {
        const models = await ai.models.list({
            config: {
                pageSize: 50
            }
        });

        const availableModels = [];

        for await (const model of models) {
            if (
                model.supportedActions &&
                model.supportedActions.includes("generateContent")
            ) {
                availableModels.push({
                    name: model.name,
                    displayName: model.displayName
                });
            }
        }

        res.json({
            success: true,
            models: availableModels
        });

    } catch (error) {
        console.error("MODEL LIST ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =========================
// GEMINI TEST
// =========================

app.post("/api/chat", async (req, res) => {
    try {
        const { stock, message, stockInfo } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                error: "Message is required"
            });
        }

        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",

            input: `
Stock being analyzed: ${stock || "Unknown"}

Current stock data from the dashboard:
${JSON.stringify(stockInfo || {}, null, 2)}

User question:
${message}
`,

            system_instruction: `
You are StockTrend AI, an AI assistant specialized
in stock market analysis.

Your job is to help users understand stock market data
and technical analysis.

You may answer questions related to:

- stocks
- stock price movements
- technical analysis
- RSI
- SMA
- moving averages
- momentum
- volume
- price trends
- charts
- market concepts

When answering:

- Explain concepts clearly and simply.
- Distinguish between observed data, technical interpretation,
  and possible scenarios.
- Do not provide guaranteed predictions about future stock prices.
- Do not claim certainty about whether a stock will rise or fall.
- Do not provide trading orders or execute trades.
- If the user asks something unrelated to stocks or financial
  markets, politely explain that you are restricted to
  stock-related questions.

The application is an analysis-only stock dashboard.
When stock data is provided by the application, use
that data as the primary source for answering questions
about the selected stock.

Do not invent stock prices, indicators, trends, or other
market data that are not present in the provided data.
`
        });

        res.json({
            success: true,
            reply: interaction.output_text
        });

    } catch (error) {
        console.error("GEMINI CHAT ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

    console.log(
        `StockTrend AI backend running on port ${PORT}`
    );

});