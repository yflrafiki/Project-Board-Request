import { useState } from "react";
import type { ProjectRequest } from "../Types";
import { useRequestContext } from "../Contexts/RequestContext";
import { useUserContext } from "../Contexts/UserContext";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";

const defaultForm: ProjectRequest & { file?: File | null; tags: string[] } = {
  id: "",
  projectName: "",
  description: "",
  team: "",
  priority: "Low",
  requestedBy: "",
  status: "New",
  deadline: "",
  progress: 0,
  tags: [],
  file: null,
};

const teams = ["Design Team", "Dev Team", "Marketing Team"];

export const RequestForm = () => {
  const [form, setForm] = useState(defaultForm);
  const [tagInput, setTagInput] = useState("");
  const { addRequest } = useRequestContext();
  const { currentUser } = useUserContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, file }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.projectName || !form.description || !form.team) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newRequest = {
      ...form,
      id: uuid(),
      requestedBy: currentUser?.name || "Unknown",
    };

    addRequest(newRequest);
    setForm(defaultForm);
    toast.success("Request submitted!");
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow border rounded-xl p-6 overflow-y-auto max-h-[90vh]">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">New Project Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
          <input
            type="text"
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-700"
            placeholder="e.g. Marketing Website Redesign"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-700"
            placeholder="Briefly describe the project goals..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Team *</label>
          <select
            name="team"
            value={form.team}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700  "
            required
          >
            <option value="">-- Choose Team --</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-none file:bg-blue-100 file:text-blue-700 text-gray-700"
          />
          {form.file && <p className="text-sm text-gray-600 mt-1">Selected: {form.file.name}</p>}
        </div>

        {/* Tags Input */}
        <div>
          <label className="block  text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              className="flex-1 border rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Type tag and press Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 !bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setForm(defaultForm)}
            className="px-4 py-2 rounded-lg border border-blue-500 text-white font-medium !bg-blue-600 hover:bg-blue-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg !bg-blue-600 text-white font-medium !hover:bg-blue-700 transition"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};
