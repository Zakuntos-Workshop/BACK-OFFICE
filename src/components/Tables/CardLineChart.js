import React, { useState, useEffect } from "react";
import Chart from "chart.js";
import API from "api/API";

export default function CardLineChart() {
  const [transactions, setTransactions] = useState([]);
  const api = new API();

  const getTransactions = async (page, per_page) => {
    const transactionsData = await api.getData(`transactions?page=${page}&per_page=${per_page}`);
    setTransactions(transactionsData);
  };

  useEffect(() => {
    getTransactions(1, 5);
  }, []);

  useEffect(() => {
    const config = {
      type: "line",
      data: {
        labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet"],
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: [65, 78, 66, 44, 56, 67, 75],
            fill: false,
          },
          {
            label: new Date().getFullYear() - 1,
            fill: false,
            backgroundColor: "#fff",
            borderColor: "#fff",
            data: [40, 68, 86, 74, 56, 60, 87],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "index",
          intersect: false, 
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              gridLines: {
                display: false,
                color: "rgba(33, 37, 41, 0.3)",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              gridLines: {
                color: "rgba(255, 255, 255, 0.15)",
              },
            },
          ],
        },
      },
    };
    const ctx = document.getElementById("line-chart").getContext("2d");
    window.myLine = new Chart(ctx, config);
  }, []);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
              Moniteur de Transaction
            </h6>
            <h2 className="text-white text-xl font-semibold">Transaction effectuée</h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-350-px">
          <canvas id="line-chart"></canvas>
        </div>
      </div>
    </div>
  );
}
