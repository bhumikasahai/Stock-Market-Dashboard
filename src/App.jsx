import { getStockHistory } from "./stockApi";
import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select } from "@mui/material";
import LineGraph from "./LineGraph";
import "./App.css";


function calculateSMA(prices, period) {
  if (prices.length < period) return null;

  const recentPrices = prices.slice(-period);

  const sum = recentPrices.reduce(
    (total, price) => total + price,
    0
  );

  return sum / period;
}

function calculateRSI(prices, period = 14) {
  if (prices.length <= period) return null;

  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];

    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  if (losses === 0) return 100;

  const averageGain = gains / period;
  const averageLoss = losses / period;

  const relativeStrength = averageGain / averageLoss;

  return 100 - 100 / (1 + relativeStrength);
}

function calculateMomentum(prices, period = 10) {
  if (prices.length <= period) return null;

  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 1 - period];

  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

function App() {
  const [selectedStock, setSelectedStock] = useState("IBM");
  const [stockInfo, setStockInfo] = useState({});
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("stocktrend_watchlist");

    return saved
      ? JSON.parse(saved)
      : [];
  });

  const addToWatchlist = () => {
    if (!watchlist.includes(selectedStock)) {
      const updatedWatchlist = [
        ...watchlist,
        selectedStock,
      ];

      setWatchlist(updatedWatchlist);

      localStorage.setItem(
        "stocktrend_watchlist",
        JSON.stringify(updatedWatchlist)
      );
    }
  };

  const removeFromWatchlist = (symbol) => {
    const updatedWatchlist = watchlist.filter(
      (stock) => stock !== symbol
    );

    setWatchlist(updatedWatchlist);

    localStorage.setItem(
      "stocktrend_watchlist",
      JSON.stringify(updatedWatchlist)
    );
  };

  useEffect(() => {
    let cancelled = false;

    const loadStockData = async () => {
      setLoading(true);

      try {
        const history = await getStockHistory(selectedStock);

        if (!cancelled && history && history.length > 0) {
          console.log("STOCK HISTORY:", history);

          setStockHistory(history);

          // Latest trading day
          const latest = history[0];

          // Previous trading day
          const previous = history[1];

          const currentPrice = Number(latest.close);
          const previousClose = Number(previous.close);

          // Daily price change
          const change = currentPrice - previousClose;

          const percentChange =
            (change / previousClose) * 100;

          // Highest price in the available 30-day history
          const highestPrice = Math.max(
            ...history.map((item) => Number(item.high))
          );

          // Lowest price in the available 30-day history
          const lowestPrice = Math.min(
            ...history.map((item) => Number(item.low))
          );

          // Oldest closing price in the available history
          const firstPrice = Number(
            history[history.length - 1].close
          );

          const prices = [...history]
            .reverse()
            .map((item) => Number(item.close));

          const sma20 = calculateSMA(prices, 20);
          const rsi14 = calculateRSI(prices, 14);
          const momentum = calculateMomentum(prices, 10);

          // Simple trend calculation
          let trend = "Neutral";

          if (currentPrice > firstPrice * 1.02) {
            trend = "Bullish";
          } else if (currentPrice < firstPrice * 0.98) {
            trend = "Bearish";
          }

          const stockData = {
            symbol: selectedStock,
            close: currentPrice.toFixed(2),
            change: change.toFixed(2),
            percent_change: percentChange.toFixed(2),
            volume: latest.volume,
            trend: trend,
            highest: highestPrice.toFixed(2),
            lowest: lowestPrice.toFixed(2),

            sma20: sma20 !== null ? sma20.toFixed(2) : null,
            rsi14: rsi14 !== null ? rsi14.toFixed(2) : null,
            momentum: momentum !== null ? momentum.toFixed(2) : null,
          };

          console.log("STOCK DATA:", stockData);

          setStockInfo(stockData);
        }
      } catch (error) {
        console.error("STOCK API ERROR:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStockData();

    return () => {
      cancelled = true;
    };
  }, [selectedStock]);

  return (
    <div className="app">
      <div className="app_left">

        {/* =========================
            HEADER
        ========================= */}

        <div className="app_header">

          <div className="brand">
            <span className="brand_name">
              StockTrend
            </span>

            <span className="brand_ai">
              AI
            </span>
          </div>


          <div className="stock_selector">

            <span className="search_icon">
              ⌕
            </span>

            <FormControl className="app_dropdown">

              <Select
                value={selectedStock}
                onChange={(event) =>
                  setSelectedStock(event.target.value)
                }
                displayEmpty
              >

                <MenuItem value="IBM">
                  IBM
                </MenuItem>

                <MenuItem value="AAPL">
                  Apple
                </MenuItem>

                <MenuItem value="MSFT">
                  Microsoft
                </MenuItem>

                <MenuItem value="GOOGL">
                  Google
                </MenuItem>

                <MenuItem value="AMZN">
                  Amazon
                </MenuItem>

              </Select>

            </FormControl>

          </div>

        </div>


        {/* =========================
            STOCK HERO
        ========================= */}

        <div className="stock_hero">

          <div className="stock_identity">

            <div>

              <p className="stock_symbol">
                {selectedStock}
              </p>

              <h2 className="stock_name">

                {selectedStock === "IBM"
                  ? "International Business Machines"
                  : selectedStock === "AAPL"
                    ? "Apple Inc."
                    : selectedStock === "MSFT"
                      ? "Microsoft Corporation"
                      : selectedStock === "GOOGL"
                        ? "Alphabet Inc."
                        : "Amazon.com Inc."}

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
              className={`stock_change ${stockInfo?.change &&
                Number(stockInfo.change) >= 0
                ? "positive"
                : "negative"
                }`}
            >

              {stockInfo?.change
                ? `${Number(stockInfo.change) >= 0
                  ? "+"
                  : ""
                }$${stockInfo.change}`
                : ""}


              {stockInfo?.percent_change
                ? ` (${Number(stockInfo.percent_change) >= 0
                  ? "+"
                  : ""
                }${stockInfo.percent_change}%)`
                : ""}

            </div>

          </div>

        </div>


        {/* =========================
            PRICE CHART
        ========================= */}

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


        {/* =========================
            TREND ANALYSIS
        ========================= */}

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




        {/* =========================
            TECHNICAL INDICATORS
        ========================= */}

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
                  ? `${Number(stockInfo.momentum) >= 0
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


        {/* =========================
            WATCHLIST
        ========================= */}




        <div className="watchlist_section">

          <div className="section_heading">

            <p>
              YOUR STOCKS
            </p>

            <h2>
              Watchlist
            </h2>

          </div>


          {watchlist.length === 0 ? (

            <div className="empty_watchlist">
              <span>☆</span>

              <p>
                Your watchlist is empty
              </p>

              <small>
                Add stocks you're interested in
                tracking.
              </small>
            </div>

          ) : (

            <div className="watchlist_list">

              {watchlist.map((symbol) => (

                <div
                  className="watchlist_item"
                  key={symbol}
                  onClick={() =>
                    setSelectedStock(symbol)
                  }
                >

                  <div className="watchlist_stock">

                    <strong>
                      {symbol}
                    </strong>

                    <span>
                      {symbol === "IBM"
                        ? "International Business Machines"
                        : symbol === "AAPL"
                          ? "Apple Inc."
                          : symbol === "MSFT"
                            ? "Microsoft Corporation"
                            : symbol === "GOOGL"
                              ? "Alphabet Inc."
                              : "Amazon.com Inc."}
                    </span>

                  </div>


                  <div className="watchlist_action">

                    <span className="watchlist_arrow">
                      →
                    </span>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        removeFromWatchlist(symbol);
                      }}
                    >
                      ×
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default App;