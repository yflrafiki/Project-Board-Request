import { useRequestContext } from "../Contexts/RequestContext";
import { RequestCard } from "../Components/RequestCard";
import { RequestForm } from "../Components/RequestForm";
import { useState } from "react";
import { FilterBar } from "../Components/FilterBar";
import type { ProjectRequest } from "../Types";
import { useAdminContext } from "../Contexts/AdminContext";
import { Modal } from "../Components/Modal";

export const RequestBoard = () => {
  const { requests } = useRequestContext();
  const { isAdmin, toggleAdmin } = useAdminContext();
  const [showForm, setShowForm] = useState(false);

  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filtering
  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter ? r.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    if (sortKey === "deadline")
      return (a.deadline || "").localeCompare(b.deadline || "");
    return a[sortKey as keyof ProjectRequest].localeCompare(
      b[sortKey as keyof ProjectRequest]
    );
  });

  // Admin Metrics
  const total = requests.length;
  const newCount = requests.filter((r) => r.status === "New").length;
  const reviewCount = requests.filter((r) => r.status === "Under Review").length;
  const inProgress = requests.filter((r) => r.status === "In Progress").length;
  const completed = requests.filter((r) => r.status === "Completed").length;
  const highPriority = requests.filter((r) => r.priority === "High").length;

  const MetricCard = ({
    value,
    label,
    color,
  }: {
    value: number;
    label: string;
    color: string;
  }) => {
    const colorClasses: Record<string, string> = {
      indigo: "bg-indigo-100 text-indigo-700",
      gray: "bg-gray-100 text-gray-700",
      yellow: "bg-yellow-100 text-yellow-700",
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      red: "bg-red-100 text-red-700",
    };

    return (
      <div className={`p-4 rounded-lg text-center ${colorClasses[color]}`}>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs font-medium uppercase tracking-wider">{label}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full px-4 py-6 sm:px-6 lg:px-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-xl shadow-lg mb-8 relative">
        <p className="text-lg sm:text-xl font-semibold text-center">
          Submit and manage project requests in one place
        </p>
        <div className="absolute top-[-13px] right-4">
          <button
            onClick={toggleAdmin}
            className="!bg-blue-600 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs font-medium transition"
          >
            {isAdmin ? "Admin Mode" : "User Mode"}
          </button>
        </div>
      </div>

      {/* Admin Dashboard */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Admin Dashboard
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <MetricCard value={total} label="Total" color="indigo" />
            <MetricCard value={newCount} label="New" color="gray" />
            <MetricCard value={reviewCount} label="Review" color="yellow" />
            <MetricCard value={inProgress} label="In Progress" color="blue" />
            <MetricCard value={completed} label="Completed" color="green" />
            <MetricCard value={highPriority} label="High Priority" color="red" />
          </div>
        </div>
      )}

      {/* Filters + New Button */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-base font-medium text-gray-700">
            Filter Project Requests
          </h3>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 !bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Request
          </button>
        </div>
        <FilterBar
          onSearch={setSearchQuery}
          onSort={setSortKey}
          onPriorityFilter={setPriorityFilter}
          onStatusFilter={setStatusFilter}
        />
      </div>

      {/* Modal for RequestForm */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <RequestForm onClose={() => setShowForm(false)} />
      </Modal>

      {/* Request List */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Requests</h2>
        {sorted.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((req) => (
              <RequestCard key={req.id} request={req} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              No requests found
            </h3>
            <p className="mt-1 text-gray-500 text-sm">
              Try adjusting your filters or add a new request.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
