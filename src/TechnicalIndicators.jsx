import React from "react";

function TechnicalIndicators({ stockInfo }) {
  return (
    <div className="technical_section">

      <div className="section_heading">

        <p>
          TECHNICAL DATA
        </p>

        <h2>
          Technical Indicators
        </h2>

      </div>


      <div className="technical_grid">


        {/* SMA 20 */}

        <div className="technical_card">

          <span className="technical_card_label">
            SMA 20
          </span>

          <h3>
            {stockInfo?.sma20
              ? `$${stockInfo.sma20}`
              : "Loading..."}
          </h3>

          <p>
            20-day moving average
          </p>

        </div>


        {/* RSI 14 */}

        <div className="technical_card">

          <span className="technical_card_label">
            RSI 14
          </span>

          <h3>
            {stockInfo?.rsi14
              ? stockInfo.rsi14
              : "Loading..."}
          </h3>

          <p>
            Relative strength index
          </p>

        </div>


        {/* MOMENTUM */}

        <div className="technical_card">

          <span className="technical_card_label">
            MOMENTUM
          </span>

          <h3
            className={
              stockInfo?.momentum &&
              Number(stockInfo.momentum) >= 0
                ? "positive"
                : "negative"
            }
          >
            {stockInfo?.momentum
              ? `${
                  Number(stockInfo.momentum) >= 0
                    ? "+"
                    : ""
                }${stockInfo.momentum}%`
              : "Loading..."}
          </h3>

          <p>
            10-day price momentum
          </p>

        </div>


      </div>

    </div>
  );
}

export default TechnicalIndicators;