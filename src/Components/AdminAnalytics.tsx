// src/Components/AdminAnalytics.tsx

import { useRequestContext } from "../Contexts/RequestContext";
import { useUserContext } from "../Contexts/UserContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const AdminAnalytics = () => {
  const { requests } = useRequestContext();
  const { users } = useUserContext();

  // Top performers: real registered users who submitted requests
  const topPerformers = users
    .map((user) => {
      const count = requests.filter((r) => r.requestedBy === user.name).length;
      return { ...user, count };
    })
    .filter((u) => u.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Requests from the last 30 days
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const recentRequests = requests.filter((r) => {
    try {
      const created = new Date(parseInt(r.id.substring(0, 8), 16) * 1000);
      return created.getTime() > thirtyDaysAgo;
    } catch {
      return false;
    }
  });

  const totalRequests = requests.length;
  const recentCount = recentRequests.length;

  const pieData = {
    labels: ["Last 30 Days", "Older"],
    datasets: [
      {
        label: "Activity",
        data: [recentCount, totalRequests - recentCount],
        backgroundColor: ["#3b82f6", "#e5e7eb"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow p-5 border">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Top Performers</h2>
        {topPerformers.length > 0 ? (
          <ul className="space-y-4">
            {topPerformers.map((user) => (
              <li key={user.id} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{user.count} req.</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No user activity found yet.</p>
        )}
      </div>

      {/* Monthly Activity Chart */}
      <div className="bg-white rounded-xl shadow p-5 border">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Monthly Activity</h2>
        <div className="w-full max-w-xs mx-auto">
          <Doughnut data={pieData} />
          <p className="text-center text-sm mt-4 text-gray-500">
            {recentCount} of {totalRequests} requests were created in the last 30 days.
          </p>
        </div>
      </div>
    </div>
  );
};
