// src/Components/AdminAnalytics.tsx
import { FaCircleUser } from "react-icons/fa6";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useUserContext } from "../Contexts/UserContext";
import type { ProjectRequest } from "../Types";

ChartJS.register(ArcElement, Tooltip, Legend);

type AdminAnalyticsProps = {
  requests: ProjectRequest[];
};

export const AdminAnalytics = ({ requests }: AdminAnalyticsProps) => {
  const { users } = useUserContext();

  const teams = {
    "Design Team": requests.filter((r) => r.team === "Design Team"),
    "Dev Team": requests.filter((r) => r.team === "Dev Team"),
    "Marketing Team": requests.filter((r) => r.team === "Marketing Team"),
  };

  const teamColors = {
    "Design Team": "#93C5FD",
    "Dev Team": "#FDE68A",
    "Marketing Team": "#6EE7B7",
  };

  const personalStats = users
    .map((user) => {
      const submitted = requests.filter((r) => r.requestedBy === user.name);
      return {
        name: user.name,
        email: user.email,
        role: user.role,
        total: submitted.length,
        avgTime: "4.8",
        rating: Math.min(100, submitted.length * 10),
      };
    })
    .filter((u) => u.total > 0);

  const chartData = {
    labels: Object.keys(teams),
    datasets: [
      {
        data: Object.values(teams).map((arr) => arr.length),
        backgroundColor: Object.values(teamColors),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6">
      {/* LEFT: Tables */}
      <div className="flex-1 space-y-6">
        {Object.entries(teams).map(([team, list]) => (
          <div key={team} className="bg-white shadow border rounded-xl overflow-hidden">
            <div className="bg-blue-50 p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-blue-700">{team}</h2>
              <span className="text-sm text-gray-600">{list.length} Tasks</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Task Name</th>
                    <th className="px-4 py-3 text-left">Assignee</th>
                    <th className="px-4 py-3 text-left">Due</th>
                    <th className="px-4 py-3 text-left">Priority</th>
                    <th className="px-4 py-3 text-left">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {list.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-2">{r.projectName}</td>
                      <td className="px-4 py-2 flex items-center gap-2">
                        <FaCircleUser className="text-gray-400" />
                        {r.requestedBy}
                      </td>
                      <td className="px-4 py-2 text-red-500">{r.deadline || "—"}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            r.priority === "High"
                              ? "bg-red-100 text-red-600"
                              : r.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {r.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${r.progress || 0}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {list.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center p-4 text-sm text-gray-400 italic">
                        No tasks
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Pie + Performance */}
      <div className="w-full xl:w-[300px] space-y-6 flex-shrink-0">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow border p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Team Contributions</h3>
          <div className="h-[200px] w-full">
            <Pie data={chartData} />
          </div>
          <ul className="mt-3 text-sm text-gray-600 space-y-1">
            {Object.entries(teams).map(([team, arr]) => (
              <li key={team} className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: teamColors[team] }} />
                {team}: {arr.length} Projects
              </li>
            ))}
          </ul>
        </div>

        {/* Personal Stats */}
        <div className="bg-white rounded-xl shadow border p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Top Contributors</h3>
          <div className="space-y-4">
            {personalStats.map((u) => (
              <div key={u.name}>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <FaCircleUser className="text-blue-500" />
                    <div>
                      <p className="font-medium text-sm text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.role}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-blue-600">{u.rating}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${u.rating}%` }}
                  />
                </div>
              </div>
            ))}
            {personalStats.length === 0 && (
              <p className="text-sm text-gray-500 italic">No performance data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
