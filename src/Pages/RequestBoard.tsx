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

  const MetricCard = ({ value, label, color }: { value: number; label: string; color: string }) => {
    const colorClasses: Record<string, string> = {
      indigo: 'bg-indigo-50 text-indigo-700',
      gray: 'bg-gray-50 text-gray-700',
      yellow: 'bg-yellow-50 text-yellow-700',
      blue: 'bg-blue-50 text-blue-700',
      green: 'bg-green-50 text-green-700',
      red: 'bg-red-50 text-red-700',
    };
  
    return (
      <div className={`${colorClasses[color]} p-3 rounded-lg text-center`}>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs font-medium uppercase tracking-wider">{label}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Full-width header */}
      <div className="bg-gradient-to-r from-indigo-600 rounded-[20px] to-blue-600 p-6 w-full">
        <div className="mx-auto relative">
          <div className="text-center px-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Orcta Project Request Board
            </h1>
            <p className="text-indigo-100 mt-3 text-sm sm:text-base mx-auto">
              Submit and manage your project requests with our streamlined workflow system
            </p>
          </div>
          
          {/* Admin toggle button */}
          <div className="absolute top-[-40px] right-4">
            <button 
              onClick={toggleAdmin}
              className="!bg-blue-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full text-xs font-medium transition-all backdrop-blur-sm"
            >
              {isAdmin ? 'Admin Mode' : 'User Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content container - full width on desktop */}
      <div className="w-full p-4 sm:p-6 mx-auto">
        {/* Admin Panel */}
        {isAdmin && (
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-6 w-full">
            <h2 className="font-semibold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
              </svg>
              Admin Dashboard
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard value={total} label="Total" color="indigo" />
              <MetricCard value={newCount} label="New" color="gray" />
              <MetricCard value={reviewCount} label="Review" color="yellow" />
              <MetricCard value={inProgress} label="In Progress" color="blue" />
              <MetricCard value={completed} label="Completed" color="green" />
              <MetricCard value={highPriority} label="High Priority" color="red" />
            </div>
          </div>
        )}

        {/* Filters and New Request Button - full width */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter Requests
            </h3>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1 !bg-blue-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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

        {/* Request Cards - full width grid */}
        <section className="w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Project Requests
          </h2>
          {sorted.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {sorted.map((req) => (
                <div 
                  key={req.id} 
                  className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <RequestCard request={req} isAdmin={isAdmin} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No requests found</h3>
              <p className="mt-1 text-gray-500">
                {searchQuery ? 
                  "Try adjusting your search or filter criteria" : 
                  "Get started by creating a new project request"}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};