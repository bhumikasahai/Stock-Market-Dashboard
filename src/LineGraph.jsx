import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineGraph({ stockHistory, symbol }) {
  if (!Array.isArray(stockHistory) || stockHistory.length === 0) {
    return <p>Loading price history...</p>;
  }

  // Twelve Data returns newest date first.
  // Reverse it so the graph goes from oldest → newest.
  const history = [...stockHistory].reverse();

  const dates = history.map((item) => item.datetime);

  const prices = history.map((item) => Number(item.close));

  const data = {
    labels: dates,
    datasets: [
      {
        label: `${symbol} Closing Price`,
        data: prices,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },

    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
        },
      },

      y: {
        beginAtZero: false,
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default LineGraph;