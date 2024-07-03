import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels); // Register the datalabels plugin

const NumbersSoldDoughnutChart = ({ boletos, totalNumbers }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartInstance) {
      // Destroy the previous chart instance before creating a new one
      chartInstance.destroy();
    }

    if (boletos && boletos.length > 0 && totalNumbers > 0) {
      // Calculate the total numbers sold
      const numbersSold = boletos[0].totalsold;

      const numbersAvailable = totalNumbers - numbersSold;

      // Prepare chart data
      const data = {
        labels: [
          `Vendidos (${numbersSold})`,
          `Disponibles (${numbersAvailable})`,
        ],
        datasets: [
          {
            data: [numbersSold, numbersAvailable],
            backgroundColor: ["#36A2EB", "#E0E0E0"], // Vendidos in blue, Disponibles in gray
            hoverBackgroundColor: ["#36A2EB", "#E0E0E0"],
          },
        ],
      };

      // Chart options
      const options = {
        plugins: {
          datalabels: {
            color: "#fff",
            font: {
              size: 16, // Set the font size to 16 (you can adjust this value)
            },
            formatter: (value, context) => {
              const percentage = ((value / totalNumbers) * 100).toFixed(2);
              return `${percentage}%`;
            },
          },
        },
      };

      // Create new chart instance
      const newChartInstance = new Chart(chartRef.current, {
        type: "doughnut",
        data: data,
        options: options, // Include options with datalabels plugin configuration
      });

      setChartInstance(newChartInstance);
    }

    // Cleanup function
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [boletos, totalNumbers]);

  return (
    <div>
      <h2>Numeros Vendidos</h2>
      <canvas ref={chartRef} />
    </div>
  );
};

export default NumbersSoldDoughnutChart;
