import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels); // Register the datalabels plugin

const BoletosDoughnutChart = ({ boletos }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  console.log(boletos);

  useEffect(() => {
    if (chartInstance) {
      // Destroy the previous chart instance before creating a new one
      chartInstance.destroy();
    }

    if (boletos && boletos.length > 0) {
      // Process the boletos data to count statuses
      const counts = {
        paid: boletos[0].paid,
        setApart: boletos[0].setapart,
        inPaymentProcess: boletos[0].inpaymentprocess,
      };
      const totalBoletos = boletos[0].totalsold;

      console.log(counts);

      // Prepare chart data
      const data = {
        labels: [
          `Pagados (${counts.paid})`,
          `Transferencia (${counts.setApart})`,
          `Pago Oxxo (${counts.inPaymentProcess})`,
        ],
        datasets: [
          {
            data: [counts.paid, counts.setApart, counts.inPaymentProcess],
            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
            hoverBackgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
          },
        ],
      };

      // Chart options
      const options = {
        plugins: {
          datalabels: {
            color: "#fff",
            font: {
              size: 19,
            },
            formatter: (value, context) => {
              const percentage = ((value / totalBoletos) * 100).toFixed(2);
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
  }, [boletos]);

  return (
    <div>
      <h2>Metodos de Pago</h2>
      <canvas ref={chartRef} />
    </div>
  );
};

export default BoletosDoughnutChart;
