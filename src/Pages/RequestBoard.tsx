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

  const handlePasswordSubmit = () => {
    toggleAdmin(adminPassword);
    setAdminPassword("");
  };

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter ? r.priority === priorityFilter : true;
    const matchesStatus = statusFilter ? r.status === statusFilter : true;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    return (a[sortKey as keyof ProjectRequest] ?? "")
      .toString()
      .localeCompare((b[sortKey as keyof ProjectRequest] ?? "").toString());
  });

  const teams = ["Design Team", "Dev Team", "Marketing Team"];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 xl:px-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-[1.75rem] font-bold text-gray-800">
            Project Request Board
          </h1>
          <p className="text-sm text-gray-500 leading-12">Track and manage requests visually</p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowForm(true)}
            className="!bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
          >
            + Add New Request
          </button>
        </div>
      </div>

      {/* Admin Password Prompt */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-md border">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Enter Admin Password</h3>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Password"
              className="w-full border px-3 py-2 rounded text-sm text-gray-700 mb-3"
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded text-white !bg-blue-600 hover:bg-blue-700"
                onClick={handlePasswordSubmit}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowAdminPrompt(false);
                  setAdminPassword("");
                }}
                className="px-3 py-2 rounded !bg-blue-600 text-gray-700 border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
        <FilterBar
          onSearch={setSearchQuery}
          onSort={setSortKey}
          onPriorityFilter={setPriorityFilter}
          onStatusFilter={setStatusFilter}
        />
      </div>

      {/* Admin or User View */}
      {isAdmin ? (
        <AdminAnalytics requests={sorted} />
      ) : (
        <div className="space-y-6">
          {teams.map((team) => {
            const teamTasks = sorted.filter((task) => task.team === team);
            return (
              <div
                key={team}
                className="bg-white shadow border-gray-200 rounded-xl border px-4 py-4 overflow-hidden"
              >
                <div className="bg-blue-50 flex justify-between mb-2">
                  <h2 className="text-blue-700 font-semibold">{team}</h2>
                  <span className="text-sm text-gray-600">{teamTasks.length} Tasks</span>
                </div>

                <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
                  <thead className="bg-gray-100 text-xs font-semibold text-gray-700 uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Assignee</th>
                      <th className="px-4 py-3 text-left">Deadline</th>
                      <th className="px-4 py-3 text-left">Priority</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Document</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {teamTasks.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-800">{t.projectName}</td>
                        <td className="px-4 py-3">
                          {Array.isArray(t.assignees) && t.assignees.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {t.assignees.map((person, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
                                >
                                  {person.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="italic text-gray-400">Unassigned</span>
                          )}
                        </td>
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
                    {teamTasks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center italic text-gray-500 py-3">
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
      )}

      {/* Modal Form */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <RequestForm onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  );
};
