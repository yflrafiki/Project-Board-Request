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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Priority Filter */}
      <div className="relative group">
        <select
          onChange={(e) => onPriorityFilter(e.target.value)}
          className="block w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-gray-800 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 appearance-none cursor-pointer"
        >
          <option value="">🎯 All Priorities</option>
          <option value="High">🔥 High Priority</option>
          <option value="Medium">⚡ Medium Priority</option>
          <option value="Low">🌱 Low Priority</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Status Filter */}
      <div className="relative group">
        <select
          onChange={(e) => onStatusFilter(e.target.value)}
          className="block w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-gray-800 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 appearance-none cursor-pointer"
        >
          <option value="">📋 All Statuses</option>
          <option value="New">📝 New</option>
          <option value="Under Review">👀 Under Review</option>
          <option value="In Progress">⚡ In Progress</option>
          <option value="Completed">✅ Completed</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Sort */}
      <div className="relative group">
        <select
          onChange={(e) => onSort(e.target.value)}
          className="block w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-gray-800 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 hover:border-gray-300 appearance-none cursor-pointer"
        >
          <option value="">🔀 Sort by</option>
          <option value="priority">🎯 Priority</option>
          <option value="deadline">📅 Deadline</option>
          <option value="status">📊 Status</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};