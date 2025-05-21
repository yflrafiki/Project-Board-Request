import type { ProjectRequest } from "../Types";
import { useRequestContext } from "../Contexts/RequestContext";

export const RequestCard: React.FC<{ request: ProjectRequest; isAdmin: boolean }> = ({
  request,
  isAdmin,
}) => {
  const { updateStatus } = useRequestContext();

  const statusColors: Record<string, string> = {
    New: "bg-gray-200 text-gray-700",
    "Under Review": "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
  };

  const priorityColors: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-3 transition hover:shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-indigo-600">{request.projectName}</h3>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[request.status]}`}>
          {request.status}
        </span>
      </div>

      <p className="text-gray-700 text-sm">{request.description}</p>

      {/* Meta */}
      <div className="text-sm text-gray-500 space-y-1">
        <div><strong>Requested by:</strong> {request.requestedBy}</div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[request.priority]}`}>
            {request.priority} Priority
          </span>
          {request.deadline && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              Deadline: {new Date(request.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Document Preview */}
        {request.document && (
          <div className="mt-2">
            <a
              href={request.document}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 underline hover:text-indigo-800"
            >
              📎 {request.fileName || "View Document"}
            </a>
          </div>
        )}
      </div>

      {/* Admin Button */}
      {isAdmin && (
        <div className="pt-2">
          <button
            onClick={() => updateStatus(request.id)}
            className="!bg-blue-500 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto transition"
          >
            Advance Status
          </button>
        </div>
      )}
    </div>
  );
};
