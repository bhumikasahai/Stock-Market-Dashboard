import React, { useState } from "react";

function AIExpert({ selectedStock, stockInfo }) {
  const [message, setMessage] = useState("");

  const suggestedQuestions = [
    "What is the current trend?",
    "Explain the technical indicators",
    "What are the recent price movements?",
  ];

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) return;

    console.log("USER QUESTION:", message);

    setMessage("");
  };

  return (
    <section className="ai_expert_section">

      <div className="section_heading">
        <p>AI ANALYSIS</p>
        <h2>AI Stock Expert</h2>
      </div>

      <div className="ai_expert_card">

        {/* AI HEADER */}

        <div className="ai_expert_header">

          <div>
            <span className="ai_status_dot"></span>

            <strong>
              StockTrend AI Expert
            </strong>

            <p>
              Ask questions about {selectedStock}
            </p>
          </div>

          <span className="ai_stock_badge">
            {selectedStock}
          </span>

        </div>


        {/* CHAT AREA */}

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
                Hello! I can help you understand the
                price trend, technical indicators and
                recent market data for {selectedStock}.
              </p>

            </div>

          </div>


          {/* SUGGESTED QUESTIONS */}

          <div className="ai_suggestions">

            <span>
              Try asking
            </span>

            <div className="ai_suggestion_list">

              {suggestedQuestions.map((question) => (

                <button
                  key={question}
                  onClick={() =>
                    setMessage(question)
                  }
                >
                  {question}
                </button>

              ))}

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

      </div>

    </section>
  );
}

export default AIExpert;