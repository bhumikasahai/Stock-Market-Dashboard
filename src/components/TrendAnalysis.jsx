import React from "react";

function TrendAnalysis({
  stockInfo,
  loading,
}) {
  return (
    <div className="trend_section">

      <div className="section_heading">

        <p>
          MARKET INSIGHT
        </p>

        <h2>
          Trend Analysis
        </h2>

      </div>


      <div className="trend_grid">


        {/* TREND */}

        <div className="trend_card">

          <span className="trend_card_label">
            TREND
          </span>

          <h3
            className={
              stockInfo?.trend === "Bullish"
                ? "positive"
                : stockInfo?.trend === "Bearish"
                  ? "negative"
                  : "neutral"
            }
          >
            {loading
              ? "Loading..."
              : stockInfo?.trend || "Neutral"}
          </h3>

          <p>
            Based on 30-day movement
          </p>

        </div>


        {/* VOLUME */}

        <div className="trend_card">

          <span className="trend_card_label">
            CURRENT VOLUME
          </span>

          <h3>
            {stockInfo?.volume
              ? Number(
                  stockInfo.volume
                ).toLocaleString()
              : "Loading..."}
          </h3>

          <p>
            Shares traded
          </p>

        </div>


        {/* 30 DAY HIGH */}

        <div className="trend_card">

          <span className="trend_card_label">
            30D HIGH
          </span>

          <h3>
            {stockInfo?.highest
              ? `$${stockInfo.highest}`
              : "Loading..."}
          </h3>

          <p>
            Highest recorded price
          </p>

        </div>


        {/* 30 DAY LOW */}

        <div className="trend_card">

          <span className="trend_card_label">
            30D LOW
          </span>

          <h3>
            {stockInfo?.lowest
              ? `$${stockInfo.lowest}`
              : "Loading..."}
          </h3>

          <p>
            Lowest recorded price
          </p>

        </div>


      </div>

    </div>
  );
}

export default TrendAnalysis;