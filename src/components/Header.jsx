import React from "react";
import {
  MenuItem,
  FormControl,
  Select
} from "@mui/material";

function Header({
  selectedStock,
  setSelectedStock
}) {
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


      {/* STOCK SELECTOR */}

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
  );
}

export default Header;