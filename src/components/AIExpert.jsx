import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function AIExpert({
  selectedStock,
  stockInfo,
  aiExpertOpen,
  setAiExpertOpen,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    "What is the current trend?",
    "Explain the technical indicators",
    "What are the recent price movements?",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock: selectedStock,
            message: userMessage,
            stockInfo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (question) => {
    setMessage(question);
  };

  if (!aiExpertOpen) return null;

  return (
    <>
      <div
        className="ai_expert_backdrop"
        onClick={() => setAiExpertOpen(false)}
      />

      <aside className="ai_expert_panel">
        {/* Header */}
        <div className="ai_panel_header">
          <div className="ai_panel_title">
            <div className="ai_panel_icon">✦</div>

            <div>
              <strong>AI Stock Expert</strong>
              <p>StockTrend AI</p>
            </div>
          </div>

          <button
            className="ai_close_button"
            onClick={() => setAiExpertOpen(false)}
          >
            ×
          </button>
        </div>

        {/* Current Stock */}
        <div className="ai_current_stock">
          <span>ANALYZING</span>
          <strong>{selectedStock}</strong>
        </div>

        {/* Chat */}
        <div className="ai_chat_area">
          {messages.length === 0 && (
            <>
              <div className="ai_message ai_message_bot">
                <div className="ai_avatar">AI</div>

                <div className="ai_message_content">
                  <strong>StockTrend AI</strong>

                  <p>
                    Hello! I can help you understand the trend,
                    RSI, SMA, momentum, volume and answer any
                    stock market questions for{" "}
                    <b>{selectedStock}</b>.
                  </p>
                </div>
              </div>

              <div className="ai_suggestions">
                <span>Try asking</span>

                <div className="ai_suggestion_list">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() =>
                        handleSuggestionClick(question)
                      }
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`ai_message ${
                msg.role === "user"
                  ? "ai_message_user"
                  : "ai_message_bot"
              }`}
            >
              {msg.role === "ai" && (
                <div className="ai_avatar">AI</div>
              )}

              <div className="ai_message_content">
                <strong>
                  {msg.role === "user"
                    ? "You"
                    : "StockTrend AI"}
                </strong>

                {msg.role === "user" ? (
                  <p>{msg.text}</p>
                ) : (
                  <div className="markdown_body">
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai_message ai_message_bot">
              <div className="ai_avatar">AI</div>

              <div className="ai_message_content">
                <strong>StockTrend AI</strong>
                <p>Analyzing your question...</p>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form
          className="ai_input_area"
          onSubmit={handleSubmit}
        >
          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder={`Ask about ${selectedStock}...`}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!message.trim() || loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </aside>
    </>
  );
}

export default AIExpert;