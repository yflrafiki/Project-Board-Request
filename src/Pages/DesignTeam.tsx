import { useRequestContext } from "../Contexts/RequestContext";
import { useState } from "react";
import { StatusCard } from "../Components/StatusCards";

const STATUS_ORDER = ["New", "In Progress", "Under Review", "Completed"];

export const DesignTeam = () => {
  const { requests } = useRequestContext();
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  const designTasks = requests.filter((task) => task.team === "Design Team");
  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: designTasks.filter((t) => t.status === status).length,
  }));

  const filteredTasks = activeStatus
    ? designTasks.filter((t) => t.status === activeStatus)
    : designTasks;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 xl:px-12 w-full max-w-screen-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Design Team Tasks</h1>
        <p className="text-sm text-gray-500">Overview of all design-related project tasks</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statusCounts.map(({ status, count }) => (
          <StatusCard
            key={status}
            status={status}
            count={count}
            isActive={activeStatus === status}
            onClick={() => setActiveStatus(activeStatus === status ? null : status)}
          />
        ))}
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200 p-4">
        <h2 className="text-pink-700 font-semibold mb-4">Design Tasks</h2>
        <table className="min-w-full text-sm text-gray-800 divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Assignee</th>
              <th className="px-4 py-3 text-left">Deadline</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Document</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-700">
            {filteredTasks.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{t.projectName}</td>
                <td className="px-4 py-3">{t.requestedBy}</td>
                <td className="px-4 py-3">{t.deadline || "—"}</td>
                <td className="px-4 py-3">{t.priority}</td>
                <td className="px-4 py-3">{t.status}</td>
                <td className="px-4 py-3">
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
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center italic text-gray-500">
                  No tasks
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
