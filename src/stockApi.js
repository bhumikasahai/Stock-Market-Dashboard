const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

const BASE_URL = "https://api.twelvedata.com";

export const getStockHistory = async (symbol) => {

  // Check if we already have recent data
  const cachedData = sessionStorage.getItem(`stock_${symbol}`);

  if (cachedData) {
    const parsed = JSON.parse(cachedData);

    // Use cache for 5 minutes
    const fiveMinutes = 5 * 60 * 1000;

    if (Date.now() - parsed.timestamp < fiveMinutes) {
      console.log("USING CACHED DATA:", symbol);
      return parsed.data;
    }
  }

  console.log("FETCHING FRESH DATA:", symbol);

  const url =
    `${BASE_URL}/time_series?symbol=${symbol}` +
    `&interval=1day&outputsize=30&apikey=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();

  console.log("RAW TWELVE DATA HISTORY:", data);

  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch stock history");
  }

  if (!data.values) {
    throw new Error("No historical stock data received");
  }

  // Save data in browser cache
  sessionStorage.setItem(
    `stock_${symbol}`,
    JSON.stringify({
      timestamp: Date.now(),
      data: data.values,
    })
  );

  return data.values;
};