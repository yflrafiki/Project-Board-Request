import { useRequestContext } from "../Contexts/RequestContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const STATUS_ORDER = ["New", "In Progress", "Under Review", "Completed"];

export const MarketingTeam = () => {
  const { requests } = useRequestContext();

  const marketingTasks = requests.filter((task) => task.team === "Marketing Team");

  const pieData = STATUS_ORDER.map((status) => ({
    name: status,
    value: marketingTasks.filter((r) => r.status === status).length,
  })).filter((entry) => entry.value > 0);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 xl:px-12 w-full max-w-screen-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Marketing Team Tasks</h1>
        <p className="text-sm text-gray-500">Monitoring progress of marketing-related project requests</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 overflow-x-auto bg-white shadow rounded-xl border border-gray-200 p-4">
          <h2 className="text-green-700 font-semibold mb-2">Marketing Tasks</h2>
          <table className="min-w-full text-sm text-gray-600 divide-y divide-gray-200">
            <thead>
              <tr className="border-gray-50">
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Assignee</th>
                <th className="py-2 text-left">Deadline</th>
                <th className="py-2 text-left">Priority</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Document</th>
              </tr>
            </thead>
            <tbody>
              {marketingTasks.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="py-2 whitespace-nowrap">{t.projectName}</td>
                  <td className="whitespace-nowrap">{t.requestedBy}</td>
                  <td className="whitespace-nowrap">{t.deadline || "—"}</td>
                  <td className="whitespace-nowrap">{t.priority}</td>
                  <td className="whitespace-nowrap">{t.status}</td>
                  <td className="whitespace-nowrap">
                    {t.document ? (
                      <a href={t.document} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {t.fileName || "View"}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
              {marketingTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center italic text-gray-500 py-3">
                    No tasks
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pieData.length > 0 && (
          <div className="w-full xl:max-w-md bg-white border shadow rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
