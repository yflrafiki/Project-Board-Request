// src/Components/RequestCard.tsx
import type { ProjectRequest } from "../Types";
import { useRequestContext } from "../Contexts/RequestContext";
import { useUserContext } from "../Contexts/UserContext";

export const RequestCard: React.FC<{ request: ProjectRequest; isAdmin: boolean }> = ({
  request,
  isAdmin,
}) => {
  const { updateStatus } = useRequestContext();
  const { users } = useUserContext();

  const statusColors: Record<string, string> = {
    "New": "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Under Review": "bg-yellow-100 text-yellow-700",
    "Completed": "bg-green-100 text-green-700",
  };

  const priorityColors: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  const taggedUsers = request.taggedUsers || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3 transition hover:shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="text-sm font-semibold text-indigo-600">
          {request.projectName}
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[request.status]}`}
        >
          {request.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700">{request.description}</p>

      {/* Meta Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <div><strong>Requested by:</strong> {request.requestedBy}</div>
        <div className="flex gap-2 flex-wrap items-center">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[request.priority]}`}
          >
            {request.priority} Priority
          </span>
          {request.deadline && (
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              📅 {new Date(request.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
        {/* Document */}
        {request.document && (
          <div>
            <a
              href={request.document}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              📎 {request.fileName || "View Document"}
            </a>
          </div>
        )}
      </div>

      {/* Tagged Users */}
      {taggedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <strong className="text-sm text-gray-700">Tagged:</strong>
          {taggedUsers.map((id) => {
            const user = users.find((u) => u.id === id);
            return user ? (
              <span
                key={user.id}
                title={user.name}
                className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-700 font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
                  {getInitials(user.name)}
                </div>
                <span className="hidden sm:inline">@{user.name}</span>
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Admin Control */}
      {isAdmin && (
        <button
          onClick={() => updateStatus(request.id)}
          className="mt-3 bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Advance Status
        </button>
      )}
    </div>
  );
};
