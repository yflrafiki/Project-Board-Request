import { useRequestContext } from "../Contexts/RequestContext";
import { RequestForm } from "../Components/RequestForm";
import { useState } from "react";
import { FilterBar } from "../Components/FilterBar";
import { Modal } from "../Components/Modal";
import { useAdminContext } from "../Contexts/AdminContext";
import type { ProjectRequest } from "../Types";
import { AdminAnalytics } from "../Components/AdminAnalytics";

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
      r.projectName?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter ? r.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    if (sortKey === "deadline")
      return (a.deadline || "").localeCompare(b.deadline || "");
    return a[sortKey as keyof ProjectRequest].toString().localeCompare(
      b[sortKey as keyof ProjectRequest].toString()
    );
  });

  const teams = ["Design Team", "Dev Team", "Marketing Team"];

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300 px-4 py-6 sm:px-6 xl:px-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-[1.75rem] font-bold text-gray-800">
            Project Request Board
          </h1>
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

      {/* Admin Password Prompt */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start sm:items-center justify-center px-4 sm:px-0 pt-20 sm:pt-0">
          <div className="bg-white w-full max-w-sm p-5 rounded-xl shadow-md border">
            <p className="text-sm text-gray-800 font-medium mb-2">Enter Admin Password:</p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 mb-3"
              placeholder="Password"
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAdminPrompt(false);
                  setAdminPassword("");
                }}
                className="text-sm px-4 py-2 !text-white !bg-blue-600 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="text-sm px-4 py-2 !bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FilterBar: now appears in both modes */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
        <FilterBar
          onSearch={setSearchQuery}
          onSort={setSortKey}
          onPriorityFilter={setPriorityFilter}
          onStatusFilter={setStatusFilter}
        />
      </div>

      {/* Admin View */}
      {isAdmin ? (
        <AdminAnalytics requests={sorted} />
      ) : (
        <>
          {/* User View: Team-Based Request Sections */}
          <div className="space-y-6">
            {teams.map((team) => {
              const teamTasks = sorted.filter(
                (task) => task.assignedTo?.team?.toLowerCase() === team.toLowerCase()
              );

              return (
                <div key={team} className="border rounded-xl bg-blue-50 shadow px-4 py-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base font-semibold text-blue-700">{team}</h2>
                    <span className="text-sm text-gray-700">{teamTasks.length} Tasks</span>
                  </div>

                  <table className="w-full text-sm text-left">
                    <thead className="border-b text-gray-700">
                      <tr>
                        <th className="py-2 px-3">Task Name</th>
                        <th className="py-2 px-3">Assignee</th>
                        <th className="py-2 px-3">Due</th>
                        <th className="py-2 px-3">Priority</th>
                        <th className="py-2 px-3">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamTasks.length > 0 ? (
                        teamTasks.map((task) => (
                          <tr key={task.id} className="border-t">
                            <td className="py-2 px-3">{task.projectName}</td>
                            <td className="py-2 px-3">{task.assignedTo?.name || "Unassigned"}</td>
                            <td className="py-2 px-3">{task.deadline || "N/A"}</td>
                            <td className="py-2 px-3">{task.priority}</td>
                            <td className="py-2 px-3">{task.status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center italic text-gray-500 py-3">
                            No tasks
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <RequestForm onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  );
};
