import React from "react";

interface FilterBarProps {
  onSearch: (query: string) => void;
  onSort: (key: string) => void;
  onPriorityFilter: (priority: string) => void;
  onStatusFilter: (status: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onSort,
  onPriorityFilter,
  onStatusFilter,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Priority Filter */}
      <select
        onChange={(e) => onPriorityFilter(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* Status Filter */}
      <select
        onChange={(e) => onStatusFilter(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Statuses</option>
        <option value="New">New</option>
        <option value="Under Review">Under Review</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Sort */}
      <select
        onChange={(e) => onSort(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Sort by</option>
        <option value="priority">Priority</option>
        <option value="deadline">Deadline</option>
        <option value="status">Status</option>
      </select>
    </div>
  );
};