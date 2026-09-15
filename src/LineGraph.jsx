import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

function LineGraph({ stockHistory, symbol }) {
  if (!Array.isArray(stockHistory) || stockHistory.length === 0) {
    return <p className="chart_loading">Loading price history...</p>;
  }

  const history = [...stockHistory].reverse();

  const dates = history.map((item) => item.datetime);
  const prices = history.map((item) => Number(item.close));

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];

  const isPositive = lastPrice >= firstPrice;

  const lineColor = isPositive ? "#00c853" : "#ff4d4d";
  const fillColor = isPositive
    ? "rgba(0, 200, 83, 0.08)"
    : "rgba(255, 77, 77, 0.08)";

  const data = {
    labels: dates,
    datasets: [
      {
        label: symbol,
        data: prices,

        borderColor: lineColor,
        backgroundColor: fillColor,

        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,

        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#101613",
        titleColor: "#8b938d",
        bodyColor: "#ffffff",
        borderColor: "#26342b",
        borderWidth: 1,

        padding: 12,

        callbacks: {
          title: function (context) {
            return context[0].label;
          },

          label: function (context) {
            return ` $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#69736d",
          maxTicksLimit: 7,
          font: {
            size: 11,
          },
        },
      },

      y: {
        position: "right",

        grid: {
          color: "#18211c",
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#69736d",

          callback: function (value) {
            return `$${value}`;
          },

          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="chart_container">
      <Line data={data} options={options} />
    </div>
  );
}

export default LineGraph;