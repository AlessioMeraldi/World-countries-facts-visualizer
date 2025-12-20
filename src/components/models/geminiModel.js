/* src/components/models/geminiModel.js */

// imports
import { GoogleGenerativeAI } from "@google/generative-ai";

// local variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // get (Gemini's) API key from Vite's ambient variables toDo: find the damned thing

/**
 * Inizializza l'istanza di Gemini.
 * Se la chiave manca, lancerà un errore quando si tenta di generare contenuto.
 */
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * fetchGeminiResponse
 * Interroga il modello Gemini Pro con un prompt testuale semplice.
 * * @param {string} promptText - La domanda o l'istruzione da inviare a Gemini.
 * @returns {Promise<string>} - La risposta testuale generata dall'AI.
 */
export async function fetchGeminiResponse(promptText) {

    if (!API_KEY) {
        throw new Error("API Key mancante. Controlla il file .env");
    }

    try {
        // Selezioniamo il modello (gemini-pro è ottimo per il testo)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" }); /* was: gemini-2.0-flash */

        // Inviamo il prompt
        const result = await model.generateContent(promptText);
        const response = await result.response;

        // Estraiamo il testo puro dalla risposta complessa
        const text = response.text();

        return text;

    } catch (error) {
        console.error("Errore durante la chiamata a Gemini:", error);
        throw new Error("Impossibile ottenere una risposta da Gemini al momento.");
    }
}