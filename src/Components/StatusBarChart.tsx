// Components/StatusBarChart.tsx
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useRequestContext } from "../Contexts/RequestContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const StatusBarChart = () => {
  const { requests } = useRequestContext();

  const statusCounts = {
    "New": 0,
    "Under Review": 0,
    "In Progress": 0,
    "Completed": 0
  };

  requests.forEach(req => {
    if (statusCounts[req.status] !== undefined) {
      statusCounts[req.status]++;
    }
  });

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Requests by Status",
        data: Object.values(statusCounts),
        backgroundColor: ["#A5B4FC", "#FCD34D", "#93C5FD", "#6EE7B7"],
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h3 className="text-lg font-bold mb-3 text-gray-700">Project Status Overview</h3>
      <Bar data={data} />
    </div>
  );
};
