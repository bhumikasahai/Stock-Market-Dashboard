import React from "react";
import LineGraph from "../LineGraph";

function PriceChart({
  stockHistory,
  selectedStock,
}) {
  return (
    <div className="stock_chart">

      <div className="chart_header">

        <div>

          <p className="chart_label">
            PRICE TREND
          </p>

          <h2>
            {selectedStock}
          </h2>

        </div>


        <div className="chart_period">

          <button className="active">
            1M
          </button>

        </div>

      </div>


      <LineGraph
        stockHistory={stockHistory}
        symbol={selectedStock}
      />

    </div>
  );
}

export default PriceChart;