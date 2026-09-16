import React, { useState } from "react";

function AIExpert({
  selectedStock,
  aiExpertOpen,
  setAiExpertOpen
}) {
  const [message, setMessage] = useState("");

  const suggestedQuestions = [
    "What is the current trend?",
    "Explain the technical indicators",
    "What are the recent price movements?"
  ];

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) return;

    console.log("USER QUESTION:", message);

    setMessage("");
  };

  if (!aiExpertOpen) {
    return null;
  }

  return (
    <>
      {/* BACKDROP */}

      <div
        className="ai_expert_backdrop"
        onClick={() => setAiExpertOpen(false)}
      ></div>


      {/* AI PANEL */}

      <aside className="ai_expert_panel">

        {/* HEADER */}

        <div className="ai_panel_header">

          <div className="ai_panel_title">

            <div className="ai_panel_icon">
              ✦
            </div>

            <div>
              <strong>
                AI Stock Expert
              </strong>

              <p>
                StockTrend AI
              </p>
            </div>

          </div>


          <button
            className="ai_close_button"
            onClick={() => setAiExpertOpen(false)}
          >
            ×
          </button>

        </div>


        {/* STOCK */}

        <div className="ai_current_stock">

          <span>
            ANALYZING
          </span>

          <strong>
            {selectedStock}
          </strong>

        </div>


        {/* CHAT */}

        <div className="ai_chat_area">

          <div className="ai_message ai_message_bot">

            <div className="ai_avatar">
              AI
            </div>

            <div className="ai_message_content">

              <strong>
                StockTrend AI
              </strong>

              <p>
                Hello! I can help you understand
                the price trend, technical indicators
                and recent market data for{" "}
                {selectedStock}.
              </p>

            </div>

          </div>


          {/* SUGGESTIONS */}

          <div className="ai_suggestions">

            <span>
              Try asking
            </span>

            <div className="ai_suggestion_list">

              {suggestedQuestions.map(
                (question) => (

                  <button
                    key={question}
                    onClick={() =>
                      setMessage(question)
                    }
                  >
                    {question}
                  </button>

                )
              )}

            </div>

          </div>

        </div>


        {/* INPUT */}

        <form
          className="ai_input_area"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder={`Ask about ${selectedStock}...`}
          />

          <button
            type="submit"
            disabled={!message.trim()}
          >
            Send
          </button>

        </form>

      </aside>
    </>
  );
}

export default AIExpert;