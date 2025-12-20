import { useState, useEffect, useRef } from "react";
import { fetchGeminiResponse } from "../models/geminiModel";

/**
 * ViewModel per gestire la logica della chat con Gemini.
 * @param {string} currentCountryName - Il nome del paese attualmente selezionato (dall'Orchestratore).
 */
function useGeminiViewModel(currentCountryName) {

    // === STATE ===

    // Lo storico della chat: array di oggetti { sender: 'user' | 'gemini', text: '...' }
    const [chatHistory, setChatHistory] = useState([]);

    // Stato del campo di input testuale
    const [inputText, setInputText] = useState("");

    // Stati di caricamento ed errore
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Riferimento per lo scroll automatico alla fine della chat (opzionale ma consigliato per UX)
    const chatEndRef = useRef(null);


    // === EFFECTS ===

    /* * Effect: Reset della chat (o messaggio di benvenuto) quando cambia il paese.
     * Questo assicura che l'utente non continui a chiedere cose sulla Francia quando ha appena cliccato l'Italia.
     */
    useEffect(() => {

        // "Country selected" state
        if (currentCountryName) {
            setChatHistory([
                {
                    sender: 'gemini',
                    text: `Hello! I can give you some information about ${currentCountryName}. Just ask me!`
                }
            ]);
            setError(null);
        } else {
            // "No country selected" state
            setChatHistory([
                {
                    sender: 'gemini',
                    text: "Select a country to begin a conversation"
                }
            ]);
        }
    }, [currentCountryName]);


    // === LOGIC ===

    /**
     * Funzione generica per inviare un messaggio a Gemini.
     * @param {string} textToSend - Il testo effettivo da inviare all'API.
     * @param {string} displayLabel - (Opzionale) Cosa mostrare nella chat come messaggio dell'utente.
     * Utile se clicco un bottone "Curiosità" ma voglio inviare un prompt più complesso.
     */
    async function performRequest(textToSend, displayLabel = null) {
        if (!textToSend.trim()) return;

        setIsLoading(true);
        setError(null);

        // 1. Aggiungi il messaggio dell'utente alla chat
        // Se displayLabel esiste usiamo quella (es: "Dimmi una curiosità"), altrimenti il testo raw
        const userMessage = { sender: 'user', text: displayLabel || textToSend };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            // 2. Chiama il Model
            const responseText = await fetchGeminiResponse(textToSend);

            // 3. Aggiungi la risposta di Gemini alla chat
            setChatHistory(prev => [
                ...prev,
                { sender: 'gemini', text: responseText }
            ]);

        } catch (err) {
            setError("Si è verificato un errore durante la comunicazione con Gemini.");
            console.error(err);
            // Opzionale: aggiungere un messaggio di errore in chat
            setChatHistory(prev => [
                ...prev,
                { sender: 'gemini', text: "Scusa, ho avuto un problema a recuperare questa informazione." }
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Gestisce l'invio manuale dal box di input (tasto Enter o click su Invia).
     */
    const handleManualSend = () => {
        if (!inputText.trim()) return;

        // Se c'è un paese selezionato, potremmo voler aggiungere contesto implicitamente,
        // ma per ora lasciamo che l'utente scriva quello che vuole.
        // Opzionale: aggiungere "Riguardo a [Paese]: " all'inizio del prompt nascosto.
        let prompt = inputText;

        // UX Enhancement: Se l'utente scrive "capitale" e c'è un paese selezionato, aiutiamo Gemini
        if (currentCountryName && !inputText.toLowerCase().includes(currentCountryName.toLowerCase())) {
            prompt = `Regarding the country "${currentCountryName}": ${inputText}`;
        }

        performRequest(prompt, inputText); // Invio il prompt arricchito, ma mostro solo quello che ha scritto l'utente
        setInputText(""); // Pulisci input
    };

    /**
     * Gestisce i click sui "Bottoni Rapidi" (Quick Actions).
     * @param {string} actionType - Identificativo dell'azione (es: 'fun_fact', 'history', 'food').
     */
    const handleQuickAction = (actionType) => {
        if (!currentCountryName) {
            setError("You must first select a country!");
            return;
        }

        let prompt = "";
        let label = "";

        switch (actionType) {
            case 'fun_fact':
                prompt = `Tell me a short and fun fact about: ${currentCountryName}`;
                label = "Tell me a fun fact 🤔";
                break;
            case 'holiday':
                prompt = `What is the main national holiday of ${currentCountryName} and why is it celebrated?`;
                label = "National Holiday 🎉";
                break;
            case 'food':
                prompt = `What is the most famous traditional dish of ${currentCountryName}? Describe it briefly.`;
                label = "Traditional Dish 🍝";
                break;
            default:
                return;
        }

        performRequest(prompt, label);
    };

    return {
        chatHistory,
        inputText,
        isLoading,
        error,
        setInputText,
        handleManualSend,
        handleQuickAction,
        chatEndRef, // Per gestire lo scroll automatico nella View
        hasCountrySelected: !!currentCountryName
    };
}

export default useGeminiViewModel;