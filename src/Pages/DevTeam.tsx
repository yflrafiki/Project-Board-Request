import { useRequestContext } from "../Contexts/RequestContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const STATUS_ORDER = ["New", "In Progress", "Under Review", "Completed"];

export const DevTeam = () => {
  const { requests } = useRequestContext();

  const devTasks = requests.filter((task) => task.team === "Dev Team");

  const pieData = STATUS_ORDER.map((status) => ({
    name: status,
    value: devTasks.filter((r) => r.status === status).length,
  })).filter((entry) => entry.value > 0);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 xl:px-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dev Team Tasks</h1>
        <p className="text-sm text-gray-500">Visual breakdown of all development-related tasks</p>
      </div>

      <div className="bg-white shadow rounded-xl border border-gray-200 mb-6 px-4 py-4">
        <h2 className="text-blue-700 font-semibold mb-2">Development Tasks</h2>
        <table className="w-full text-sm text-gray-600 divide-y divide-gray-200">
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
            {devTasks.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="py-2">{t.projectName}</td>
                <td>{t.requestedBy}</td>
                <td>{t.deadline || "—"}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td>
                  {t.document ? (
                    <a
                      href={t.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {t.fileName || "View"}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
            {devTasks.length === 0 && (
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
        <div className="bg-white border shadow rounded-xl p-4 w-full max-w-lg">
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
  );
};
