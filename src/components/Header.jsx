import React from "react";
import {
  Autocomplete,
  TextField
} from "@mui/material";

function Header({
  selectedStock,
  setSelectedStock
}) {

  const stocks = [
    {
      symbol: "IBM",
      name: "International Business Machines"
    },
    {
      symbol: "AAPL",
      name: "Apple Inc."
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation"
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc."
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc."
    }
  ];

  const selectedOption =
    stocks.find(
      (stock) =>
        stock.symbol === selectedStock
    ) || null;


  return (
    <div className="app_header">

      {/* BRAND */}

      <div className="brand">

        <span className="brand_name">
          StockTrend
        </span>

        <span className="brand_ai">
          AI
        </span>

      </div>


      {/* STOCK SEARCH */}

      <div className="stock_selector">

        <span className="search_icon">
          ⌕
        </span>

        <Autocomplete
          className="app_search"
          options={stocks}
          value={selectedOption}

          onChange={(event, newValue) => {

            if (newValue) {
              setSelectedStock(
                newValue.symbol
              );
            }

          }}

          getOptionLabel={(option) =>
            `${option.symbol} — ${option.name}`
          }

          isOptionEqualToValue={
            (option, value) =>
              option.symbol === value.symbol
          }

          renderOption={(
            props,
            option
          ) => (

            <li
              {...props}
              key={option.symbol}
            >

              <div className="search_option">

                <strong>
                  {option.symbol}
                </strong>

                <span>
                  {option.name}
                </span>

              </div>

            </li>

          )}

          renderInput={(params) => (

            <TextField
              {...params}
              placeholder="Search stocks..."
            />

          )}

        />

      </div>

    </div>
  );
}

export default Header;