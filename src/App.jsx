import { getStockHistory } from "./stockApi";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StockHero from "./components/StockHero";
import TrendAnalysis from "./components/TrendAnalysis";
import TechnicalIndicators from "./components/TechnicalIndicators";
import PriceChart from "./components/PriceChart";
import Watchlist from "./components/Watchlist";
import AIExpert from "./components/AIExpert";
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

  for (
    let i = prices.length - period;
    i < prices.length;
    i++
  ) {
    const change = prices[i] - prices[i - 1];

    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  if (losses === 0) {
    return 100;
  }

  const averageGain = gains / period;
  const averageLoss = losses / period;

  const relativeStrength =
    averageGain / averageLoss;

  return 100 - 100 / (1 + relativeStrength);
}


function calculateMomentum(prices, period = 10) {
  if (prices.length <= period) return null;

  const currentPrice =
    prices[prices.length - 1];

  const previousPrice =
    prices[prices.length - 1 - period];

  return (
    ((currentPrice - previousPrice) /
      previousPrice) *
    100
  );
}

function App() {
  const [selectedStock, setSelectedStock] = useState("IBM");
  const [aiExpertOpen, setAiExpertOpen] = useState(false);
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

        <Header
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          setAiExpertOpen={setAiExpertOpen}
        />


        {/* =========================
          STOCK HERO
        ========================= */}

        <StockHero
          selectedStock={selectedStock}
          stockInfo={stockInfo}
          watchlist={watchlist}
          addToWatchlist={addToWatchlist}
        />


        {/* =========================
            PRICE CHART
        ========================= */}

        <PriceChart
          stockHistory={stockHistory}
          selectedStock={selectedStock}
        />


        {/* =========================
            TREND ANALYSIS
        ========================= */}

        <TrendAnalysis
          stockInfo={stockInfo}
          loading={loading}
        />



        {/* =========================
          TECHNICAL INDICATORS
        ========================= */}

        <TechnicalIndicators
          stockInfo={stockInfo}
        />


        {/* =========================
          WATCHLIST
        ========================= */}

        <Watchlist
          watchlist={watchlist}
          setSelectedStock={setSelectedStock}
          removeFromWatchlist={removeFromWatchlist}
        />


        {/* =========================
          WATCHLIST
        ========================= */}

        
        <AIExpert
          selectedStock={selectedStock}
          aiExpertOpen={aiExpertOpen}
          setAiExpertOpen={setAiExpertOpen}
        />

      </div>

    </div>
  );
}

export default App;