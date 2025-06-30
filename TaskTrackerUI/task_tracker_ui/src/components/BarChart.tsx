import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    x: {
      grid: {
        display: false, 
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false, 
      },
    },
  },
};
  ;

interface IChart {
  high?: number;
  medium?: number;
  low?: number;
}

const BarChart = ({ high = 0, medium = 0, low = 0 }: IChart) => {
  const data = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Tasks per Priority",
        data: [high, medium, low],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
