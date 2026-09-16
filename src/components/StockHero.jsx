import React from "react";

function StockHero({
  selectedStock,
  stockInfo,
  watchlist,
  addToWatchlist,
}) {
  const stockNames = {
    IBM: "International Business Machines",
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.",
  };

  return (
    <div className="stock_hero">

      <div className="stock_identity">

        <div>

          <p className="stock_symbol">
            {selectedStock}
          </p>

          <h2 className="stock_name">
            {stockNames[selectedStock]}
          </h2>

        </div>


        <button
          className="watch_button"
          onClick={addToWatchlist}
        >
          {watchlist.includes(selectedStock)
            ? "★ Added"
            : "☆ Watchlist"}
        </button>

      </div>


      <div className="stock_price">

        <span>
          {stockInfo?.close
            ? `$${stockInfo.close}`
            : "Loading..."}
        </span>


        <div
          className={`stock_change ${
            stockInfo?.change &&
            Number(stockInfo.change) >= 0
              ? "positive"
              : "negative"
          }`}
        >

          {stockInfo?.change
            ? `${
                Number(stockInfo.change) >= 0
                  ? "+"
                  : ""
              }$${stockInfo.change}`
            : ""}


          {stockInfo?.percent_change
            ? ` (${
                Number(stockInfo.percent_change) >= 0
                  ? "+"
                  : ""
              }${stockInfo.percent_change}%)`
            : ""}

        </div>

      </div>

    </div>
  );
}

export default StockHero;