import React from "react";
import GeminiViewStyle from "./GeminiView.module.css";

function GeminiView({ viewModel }) {

    // Destrutturiamo tutto ciò che ci serve dal ViewModel
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
            <h2 className={GeminiViewStyle.title}>Chatta con Gemini ✨</h2>

            {/* Quick Actions Grid (I bottoni colorati del mockup) */}
            <div className={GeminiViewStyle.quickActionsContainer}>

                <button
                    className={`${GeminiViewStyle.actionBtn} ${GeminiViewStyle.btnFunFact}`}
                    onClick={() => handleQuickAction('fun_fact')}
                    disabled={!hasCountrySelected || isLoading}
                    title="Curiosità divertente"
                >
                    💡 Curiosità
                </button>

                <button
                    className={`${GeminiViewStyle.actionBtn} ${GeminiViewStyle.btnHoliday}`}
                    onClick={() => handleQuickAction('holiday')}
                    disabled={!hasCountrySelected || isLoading}
                    title="Festa Nazionale"
                >
                    🎉 Feste
                </button>

                <button
                    className={`${GeminiViewStyle.actionBtn} ${GeminiViewStyle.btnFood}`}
                    onClick={() => handleQuickAction('food')}
                    disabled={!hasCountrySelected || isLoading}
                    title="Cibo Tipico"
                >
                    🍝 Cibo
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
                            {msg.text}
                        </div>
                    </div>
                ))}

                {/* Indicatore di caricamento */}
                {isLoading && (
                    <div className={GeminiViewStyle.loadingIndicator}>
                        Gemini sta scrivendo...
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
                    placeholder={hasCountrySelected ? "Chiedi qualcosa..." : "Seleziona un paese..."}
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