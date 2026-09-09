import { getStockHistory } from './stockApi';
import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select } from "@mui/material";
import LineGraph from './LineGraph';
import InfoBox from './InfoBox';
import './App.css';

function App() {

  const [selectedStock, setSelectedStock] = useState("IBM");
  const [stockInfo, setStockInfo] = useState({});
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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

        const change = currentPrice - previousClose;

        const percentChange =
          (change / previousClose) * 100;

        const stockData = {
          symbol: selectedStock,
          close: currentPrice.toFixed(2),
          change: change.toFixed(2),
          percent_change: percentChange.toFixed(2),
          volume: latest.volume,
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

        <div className="app_header">

          <h1>STOCK MARKET DASHBOARD</h1>

          <FormControl className="app_dropdown">

            <Select
              value={selectedStock}
              onChange={(event) => setSelectedStock(event.target.value)}
            >

              <MenuItem value="IBM">IBM</MenuItem>
              <MenuItem value="AAPL">Apple</MenuItem>
              <MenuItem value="MSFT">Microsoft</MenuItem>
              <MenuItem value="GOOGL">Google</MenuItem>
              <MenuItem value="AMZN">Amazon</MenuItem>

            </Select>

          </FormControl>

        </div>


        <div className="app_stats">

          <InfoBox
            title="Current Price"
            cases={stockInfo?.close ? `$${stockInfo.close}` : "Loading..."}
            total={stockInfo?.symbol || ""}
          />

          <InfoBox
            title="Daily Change"
            cases={stockInfo?.change ? `$${stockInfo.change}` : "Loading..."}
            total={
              stockInfo?.percent_change
                ? `${stockInfo.percent_change}%`
                : ""
            }
          />

          <InfoBox
            title="Trading Volume"
            cases={
              stockInfo?.volume
                ? Number(stockInfo.volume).toLocaleString()
                : "Loading..."
            }
            total="Shares traded"
          />
        
        </div>


        <div className="stock_chart">

          <h2>{selectedStock} Price History</h2>

          <LineGraph
            stockHistory={stockHistory}
            symbol={selectedStock}
          />

        </div>

      </div>

    </div>
  );
}

export default App;