import { useState } from "react";
import type { ProjectRequest } from "../Types";
import { useRequestContext } from "../Contexts/RequestContext";
import { useUserContext } from "../Contexts/UserContext";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";

const teams = ["Design Team", "Dev Team", "Marketing Team"];

export const RequestForm = ({ onClose }: { onClose: () => void }) => {
  const { addRequest } = useRequestContext();
  const { currentUser } = useUserContext();

  const [form, setForm] = useState<ProjectRequest>({
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
  });

  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName || !form.description || !form.team) {
      toast.error("Please fill all required fields");
      return;
    }

    const newRequest: ProjectRequest = {
      ...form,
      id: uuid(),
      requestedBy: currentUser?.name || "Unknown",
      document: file ? URL.createObjectURL(file) : undefined,
      fileName: file?.name,
    };

    addRequest(newRequest);
    toast.success("Request submitted successfully!");
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] lg:overflow-y-auto lg:[&::-webkit-scrollbar]:hidden"
    >
      <h2 className="text-xl font-bold mb-6 text-center text-indigo-700">
        New Project Request
      </h2>

      <div className="space-y-4">
        <input
          name="projectName"
          value={form.projectName}
          onChange={handleChange}
          placeholder="Project Name"
          className="w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400"
          required
        />
        <select
          name="team"
          value={form.team}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-3 text-gray-800"
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 text-gray-800"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label className="block text-sm font-medium text-gray-700">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400"
        />

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach Document (PDF, DOCX, JPG, PNG)
          </label>
          <input type="file" onChange={handleFileChange} className="w-full text-sm" />
          {file && (
            <p className="text-sm mt-1 text-gray-700 placeholder-gray-400">
              Selected file: <strong>{file.name}</strong>
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tag Users</label>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            placeholder="Type tag and press Enter"
            className="w-full border px-4 py-2 text-sm rounded-md mb-2 text-gray-700 placeholder-gray-400"
          />
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
              >
                {tag}{" "}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 !bg-blue-600 text-white rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 !bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
};
