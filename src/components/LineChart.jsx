import PropTypes from 'prop-types';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

// Création d'un plugin pour dessiner une ligne verticale
const verticalLinePlugin = {
  id: "verticalLineOnTooltip",
  // We'll add the drawing logic inside the tooltip's callbacks
  beforeTooltipDraw: (context) => {
    const { scales, tooltip, ctx } = context;
    if (tooltip.getActiveElements().length > 0) {
      // const ctx = tooltip.ctx;
      const tooltipElement = tooltip.getActiveElements()[0];
      const x = tooltipElement.element.x;
      const y = tooltipElement.element.y;

      // Save the context to restore later
      ctx.save();

      // Draw the vertical line
      ctx.beginPath();
      ctx.moveTo(x, scales.y.top);
      ctx.lineTo(x, scales.y.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(128,128,128)";
      ctx.stroke();

      // Draw a circle
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      // Restore the context
      ctx.restore();
    }
  },
  // afterDraw: (chart) => {
  //   if (
  //     chart.isDatasetVisible &&
  //     chart.tooltip.getActiveElements().length > 0
  //   ) {
  //     // if (chart.tooltip.getActiveElements().length > 0) {
  //     const ctx = chart.ctx;
  //     const tooltipElement = chart.tooltip.getActiveElements()[0];
  //     const x = tooltipElement.element.x;
  //     const y = tooltipElement.element.y;

  //     // Sauvegarder le contexte pour restaurer après modifications
  //     ctx.save();

  //     // Dessiner la ligne verticale
  //     ctx.beginPath();
  //     ctx.moveTo(x, chart.scales.y.top);
  //     ctx.lineTo(x, chart.scales.y.bottom);
  //     ctx.lineWidth = 1;
  //     ctx.strokeStyle = "rgba(128,128,128)";
  //     ctx.stroke();

  //     // Dessiner un cercle
  //     ctx.beginPath();
  //     ctx.arc(x, y, 5, 0, 2 * Math.PI);
  //     ctx.fillStyle = "red";
  //     ctx.fill();

  //     // Restaurer le contexte
  //     ctx.restore();
  //   }
  // },
};

ChartJS.register(verticalLinePlugin);

export default function LineChart({ data }) {
  const hourlyLabels = data.map((entry) => entry.time);
  const dataValue = data.map((entry) => entry.value.toFixed(5));
  const dataValueColor =
    dataValue[0] > dataValue.pop() ? "rgb(220,58,51,0.4)" : "rgb(0,128,0, 0.4)";
  const chartData = {
    labels: hourlyLabels,
    datasets: [
      {
        label: "Cours",
        data: dataValue,
        borderColor: dataValueColor,
        tension: 0.1,
        pointRadius: 0,
        fill: {
          target: "origin",
          above: dataValueColor,
        },
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
};
