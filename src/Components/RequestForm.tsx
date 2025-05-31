import { useState, useRef } from "react";
import { useRequestContext } from "../Contexts/RequestContext";
import { useUserContext } from "../Contexts/UserContext";
import type { ProjectRequest, Priority } from "../Types";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

interface RequestFormProps {
  onClose: () => void;
}

export const RequestForm = ({ onClose }: RequestFormProps) => {
  const { addRequest } = useRequestContext();
  const { users } = useUserContext();

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    requestedBy: "",
    priority: "Medium" as Priority,
    deadline: "",
  });

  const [taggedUserIds, setTaggedUserIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagToggle = (userId: string) => {
    setTaggedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(selected.type)) {
        toast.error("Only PDF, DOCX, JPG, PNG files are allowed.");
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: ProjectRequest = {
      id: uuidv4(),
      name: formData.projectName,
      projectName: formData.projectName,
      description: formData.description,
      requestedBy: formData.requestedBy,
      priority: formData.priority,
      deadline: formData.deadline,
      status: "New",
      document: file ? URL.createObjectURL(file) : undefined,
      fileName: file?.name,
      taggedUsers: taggedUserIds,
    };

    addRequest(newRequest);
    toast.success("Project request submitted!");
    onClose();
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto"
    >
      <h2 className="text-xl font-bold mb-6 text-center text-indigo-700">New Project Request</h2>

      <div className="space-y-4">
        {/* Project Name */}
        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          placeholder="Project Name"
          required
          className="w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 min-h-[44px]"
        />

        {/* Description */}
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Project Description"
          required
          className="w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400"
        />

        {/* Requested By */}
        <input
          type="text"
          name="requestedBy"
          value={formData.requestedBy}
          onChange={handleChange}
          placeholder="Requested By"
          required
          className="w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 min-h-[44px]"
        />

        {/* Priority */}
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 min-h-[44px]"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Deadline */}
        <label className="block text-sm font-medium text-gray-700">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 text-gray-800 min-h-[44px]"
        />

        {/* Upload Document */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach Document (PDF, DOCX, JPG, PNG)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="w-full border rounded-lg px-4 py-2 text-gray-700"
          />
          {file && <p className="text-sm mt-2 text-green-600">Selected: {file.name}</p>}
        </div>

        {/* Tag Users */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tag Users</label>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-4 py-2 !text-gray-400 rounded-md mb-3 placeholder-gray-400 min-h-[44px]"
          />
          <div className="max-h-40 overflow-y-auto space-y-2">
            {filteredUsers.map((user) => (
              <label key={user.id} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={taggedUserIds.includes(user.id)}
                  onChange={() => handleTagToggle(user.id)}
                />
                {user.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-white pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 !bg-blue-600 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 !bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
};
