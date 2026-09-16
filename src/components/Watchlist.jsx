import React from "react";

function Watchlist({
  watchlist,
  setSelectedStock,
  removeFromWatchlist,
}) {
  const stockNames = {
    IBM: "International Business Machines",
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.",
  };

  return (
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

          <span>
            ☆
          </span>

          <p>
            Your watchlist is empty
          </p>

          <small>
            Add stocks you're interested in tracking.
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
                  {stockNames[symbol]}
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
  );
}

export default Watchlist;