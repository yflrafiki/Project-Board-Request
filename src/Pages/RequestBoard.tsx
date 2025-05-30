import { useRequestContext } from "../Contexts/RequestContext";
import { RequestCard } from "../Components/RequestCard";
import { RequestForm } from "../Components/RequestForm";
import { useState } from "react";
import { FilterBar } from "../Components/FilterBar";
import { Modal } from "../Components/Modal";
import { useAdminContext } from "../Contexts/AdminContext";
import type { ProjectRequest } from "../Types";

export const RequestBoard = () => {
  const { requests } = useRequestContext();
  const { isAdmin, toggleAdmin, showAdminPrompt, setShowAdminPrompt } = useAdminContext();
  const [showForm, setShowForm] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleAdminToggle = () => {
    if (isAdmin) toggleAdmin();
    else setShowAdminPrompt(true);
  };

  const handlePasswordSubmit = () => {
    toggleAdmin(adminPassword);
    setAdminPassword("");
  };

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter ? r.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    if (sortKey === "deadline")
      return (a.deadline || "").localeCompare(b.deadline || "");
    return a[sortKey as keyof ProjectRequest].localeCompare(b[sortKey as keyof ProjectRequest]);
  });

  const statuses = ["New", "In Progress", "Under Review", "Completed"];
  const grouped = statuses.map((status) => ({
    title: status,
    requests: sorted.filter((r) => r.status === status),
  }));

  return (
    <div className="min-h-screen bg-gray-50 w-full px-4 py-6 sm:px-6 lg:px-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Project Request Board</h1>
          <p className="text-sm text-gray-500">Track and manage requests visually</p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowForm(true)}
            className="!bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
          >
            + Add New Request
          </button>
          <button
            onClick={handleAdminToggle}
            className="text-sm text-white !bg-blue-600 hover:underline"
          >
            {isAdmin ? "Admin Mode (Exit)" : "Login as Admin"}
          </button>
        </div>
      </div>

      {showAdminPrompt && (
        <div className="mb-4 bg-white p-4 rounded-lg shadow border w-full max-w-sm">
          <p className="text-sm !text-black font-medium mb-2">Enter Admin Password:</p>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full border rounded !text-black px-2 py-1 text-sm mb-2"
            placeholder="Password"
            onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowAdminPrompt(false);
                setAdminPassword("");
              }}
              className="text-sm px-3 py-1 !bg-blue-600 text-white rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordSubmit}
              className="text-sm px-3 py-1 !bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
        <FilterBar
          onSearch={setSearchQuery}
          onSort={setSortKey}
          onPriorityFilter={setPriorityFilter}
          onStatusFilter={setStatusFilter}
        />
      </div>

      {/* Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <RequestForm onClose={() => setShowForm(false)} />
      </Modal>

      {/* Responsive Board Layout */}
      <section className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {grouped.map(({ title, requests }) => (
          <div
            key={title}
            className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex flex-col max-h-[calc(100vh-250px)] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                {title}
              </h2>
              <span className="text-xs bg-gray-300 text-gray-800 rounded-full px-2 py-0.5">
                {requests.length}
              </span>
            </div>

            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map((r) => (
                  <RequestCard key={r.id} request={r} isAdmin={isAdmin} />
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No requests</div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
