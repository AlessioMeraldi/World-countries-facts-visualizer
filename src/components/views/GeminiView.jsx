import React from "react";
import GeminiViewStyle from "./GeminiView.module.css";
import ReactMarkdown from "react-markdown";

function GeminiView({ viewModel }) {

    // Deconstruct everything needed from the ViewModel
    const {
        chatHistory,
        inputText,
        isLoading,
        setInputText,
        handleManualSend,
        handleQuickAction,
        chatEndRef,
        hasCountrySelected
    } = viewModel;

    return (
        <div className={GeminiViewStyle.sidebar}>

            {/* Header */}
            <h2 className={GeminiViewStyle.title}>Chat with Gemini</h2>

            {/* Quick Actions Grid (I bottoni colorati del mockup) */}
            <div className={GeminiViewStyle.quickActionsContainer}>

                <button
                    className={GeminiViewStyle.actionBtn + " " + GeminiViewStyle.btnFunFact} /* alternative, Italian-Keyboard friendly solution, to using the ` ... ` chaining - remember to put the space in between the classes! */
                    onClick={() => handleQuickAction('fun_fact')}
                    disabled={!hasCountrySelected || isLoading}
                    title="Fun fact"
                >
                    💡Curiosity
                </button>

                <button
                    className={`${GeminiViewStyle.actionBtn} ${GeminiViewStyle.btnHoliday}`}
                    onClick={() => handleQuickAction('holiday')}
                    disabled={!hasCountrySelected || isLoading}
                    title="National Holiday"
                >
                    🎉Holidays
                </button>

                <button
                    className={`${GeminiViewStyle.actionBtn} ${GeminiViewStyle.btnFood}`}
                    onClick={() => handleQuickAction('food')}
                    disabled={!hasCountrySelected || isLoading}
                    title="Traditional food"
                >
                    🍝Food
                </button>

                {/* Possibili altri bottoni futuri... */}
            </div>

            {/* Area Messaggi (Chat History) */}
            <div className={GeminiViewStyle.chatWindow}>

                {/* Mappiamo la storia della chat */}
                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={
                            msg.sender === 'user'
                                ? GeminiViewStyle.messageUser
                                : GeminiViewStyle.messageGemini
                        }
                    >
                        <div className={GeminiViewStyle.messageContent}>
                            {/*
                                if (message sender is 'gemini') -> message (= Gemini's response) displayed as Markdown
                                else -> message (= User's prompt) displayed as plaintext
                            */}
                            {msg.sender === 'gemini' ? (
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}

                {/* Indicatore di caricamento */}
                {isLoading && (
                    <div className={GeminiViewStyle.loadingIndicator}>
                        Gemini is thinking...
                    </div>
                )}

                {/* Elemento invisibile per lo scroll automatico */}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area (Footer) */}
            <div className={GeminiViewStyle.inputContainer}>
                <input
                    className={GeminiViewStyle.inputField}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSend()}
                    placeholder={hasCountrySelected ? "Ask something.." : "Select a country..."}
                    disabled={isLoading}
                />

                <button
                    className={GeminiViewStyle.sendButton}
                    onClick={handleManualSend}
                    disabled={isLoading}
                >
                    ➤
                </button>
            </div>

        </div>
    );
}

export default GeminiView;