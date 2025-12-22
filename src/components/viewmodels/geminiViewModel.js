import { useState, useEffect, useRef } from "react";
import { fetchGeminiResponse } from "../models/geminiModel";

/**
 * ViewModel per gestire la logica della chat con Gemini.
 * @param {string} currentCountryName - Il nome del paese attualmente selezionato (dall'Orchestratore).
 */
function useGeminiViewModel(currentCountryName) {

    // === STATE ===
    const [chatHistory, setChatHistory] = useState([]); // state for chat history, array of objects { sender: '(user || gemini)', text: '(written-message)' }
    const [inputText, setInputText] = useState(""); // state for user's input field (for prompts)
    const [isLoading, setIsLoading] = useState(false); // loading state
    const [error, setError] = useState(null); // error state

    // === LOCAL VARIABLES ===
    const chatEndRef = useRef(null); // reference ato automatically scroll onto the latest message in the chat (it's a <div> put after the last message)

    // === EFFECTS ===

    /* Effect to reset the chat whenever the country changes */
    useEffect(() => {

        // We must check if a country is selected already or not, to send a different message in the chat based on this
        if (currentCountryName) { // a country is currently selected
            setChatHistory([
                {
                    sender: 'gemini',
                    text: `Hello! I can give you some information about ${currentCountryName}. Just ask me!`
                }
            ]);
            setError(null); // toDo: figure out what this does
        } else { // a country isn't currently selected
            setChatHistory([
                {
                    sender: 'gemini',
                    text: "Select a country to begin a conversation"
                }
            ]);
        }
    }, [currentCountryName]); /* triggers whenever currentCountryName {passed from the useCountrySearchViewModel instance} changes */


    // === LOGIC ===

    /**
     * Generic function to send a message to Gemini.
     * @param {string} textToSend - The actual text to send to the API.
     * @param {string} displayLabel - What to display in the chat as the user's message. (when a prompt button is pressed, a mockup prompt text is displayed in the chat, as if the user wrote it)
     */
    async function performRequest(textToSend, displayLabel = null) {

        // check that the user didn't press "send" without any content
        if(textToSend.trim() === "") {
            return
        }

        setIsLoading(true);
        setError(null);

        const userMessage = { sender: 'user', text: displayLabel }; // create <chat message object> for the USER (note: when buttons are pressed, a displayLabel is still passed as if the user wrote a message)
        setChatHistory(prev => [...prev, userMessage]); // add  <chat message object> to the chat history (through setter)

        // reminder: geminiModel.js will forward the error if it gets one while interrogating API
        try {

            const responseText = await fetchGeminiResponse(textToSend); // call model to perform the prompting of Gemini
            const responseMessage = { sender: 'gemini', text: responseText }; // create <chat message object> for the GEMINI response
            // add Gemini's response to the chat
            setChatHistory(prev => [
                ...prev,
                responseMessage
            ]);

        } catch (err) {

            setError("Si è verificato un errore durante la comunicazione con Gemini.");
            console.error(err);

            const errorMessage = { sender: 'gemini', text: "I'm sorry, I've had an issue while retrieving your response" }; // create <chat message object> for the GEMINI's error

            // if an error occurs, the user is notified through the chat
            setChatHistory(prev => [
                ...prev,
                errorMessage
            ]);

        } finally {

            setIsLoading(false); // regardless of success or failure, end "loading" state

        }
    }

    /**
     * Function to handle manual prompt, the one written in the input field (sent through ENTER or by clicking the button next to it
     */
    const handleManualSend = () => {

        if (!inputText.trim()) return; // = if(inputText is falsy){return}

        let prompt = inputText; // reminder, inputText changes through setter via GeminiView.jsx (in the <input/> itself)

        // if the user's prompt doesn't contain the name of the country, it gets added at the start of the prompt (without the user noticing)
        if (currentCountryName && !inputText.toLowerCase().includes(currentCountryName.toLowerCase())) {
            prompt = `Regarding the country "${currentCountryName}": ${inputText}`;
        }

        performRequest(prompt, inputText); // sends prompt (with eventually the added context), only displays in the chat what the user actually wrote
        setInputText(""); // clear input field
    };

    /**
     * Handles clicks on "Quick Action" buttons.
     * @param {string} actionType - The action identifier (e.g., 'fun_fact', 'history', 'food').
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
        chatEndRef, // to handle automatic scrolling within view
        hasCountrySelected: !!currentCountryName // hasCountrySelected = NOT(NOT(currentCountryName)), by doing this, a Truthy/Falsy result always gets converted to a "pure boolean" TRUE or FALSE
    };
}

export default useGeminiViewModel;