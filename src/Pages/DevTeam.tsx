import { useRequestContext } from "../Contexts/RequestContext";
import { useState } from "react";
import { StatusCard } from "../Components/StatusCards";

const STATUS_ORDER = ["New", "In Progress", "Under Review", "Completed"];

export const DevTeam = () => {
  const { requests } = useRequestContext();
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  const devTasks = requests.filter((task) => task.team === "Dev Team");
  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: devTasks.filter((t) => t.status === status).length,
  }));

  const filteredTasks = activeStatus
    ? devTasks.filter((t) => t.status === activeStatus)
    : devTasks;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 xl:px-12 w-full max-w-screen-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dev Team Tasks</h1>
        <p className="text-sm text-gray-500">Overview of all development-related project tasks</p>
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
        <h2 className="text-blue-700 font-semibold mb-2">Dev Tasks</h2>
        <table className="min-w-full text-sm text-gray-600 divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Assignee</th>
              <th className="py-2 text-left">Deadline</th>
              <th className="py-2 text-left">Priority</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Document</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="py-2 whitespace-nowrap">{t.projectName}</td>
                <td className="whitespace-nowrap">{t.requestedBy}</td>
                <td className="whitespace-nowrap">{t.deadline || "—"}</td>
                <td className="whitespace-nowrap">{t.priority}</td>
                <td className="whitespace-nowrap">{t.status}</td>
                <td className="whitespace-nowrap">
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
                <td colSpan={6} className="text-center italic text-gray-500 py-3">
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
