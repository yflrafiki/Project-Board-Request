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

  const MAX_TAGS = 5;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagToggle = (userId: string) => {
    if (taggedUserIds.includes(userId)) {
      setTaggedUserIds(taggedUserIds.filter((id) => id !== userId));
    } else if (taggedUserIds.length < MAX_TAGS) {
      setTaggedUserIds([...taggedUserIds, userId]);
    } else {
      toast.error("You can tag up to 5 users only.");
    }
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

  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-h-[calc(100vh-100px)] overflow-y-auto px-2 md:px-4 py-6 md:py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl mx-auto space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">
          New Project Request
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Project Name"
            required
            className="w-full border rounded-lg px-4 py-3 text-gray-800"
          />

          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Project Description"
            required
            className="w-full border rounded-lg px-4 py-3 text-gray-800"
          />

          <input
            type="text"
            name="requestedBy"
            value={formData.requestedBy}
            onChange={handleChange}
            placeholder="Requested By"
            required
            className="w-full border rounded-lg px-4 py-3 text-gray-800"
          />

          <select
            name="priority"
            value={formData.priority}
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
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 text-gray-800"
          />

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach Document</label>
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
            <label className="block  text-sm font-semibold text-gray-700 mb-2">Tag Users (Max 5)</label>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-4 py-2 !text-gray-700 rounded-md mb-3"
            />

            {taggedUserIds.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {taggedUserIds.map((id) => {
                  const user = users.find((u) => u.id === id);
                  if (!user) return null;
                  const initials = user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                        {initials}
                      </span>
                      @{user.name}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="max-h-40 overflow-y-auto space-y-2 border-t pt-2">
              {filteredUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={taggedUserIds.includes(user.id)}
                    onChange={() => handleTagToggle(user.id)}
                  />
                  <span>{user.name} ({user.email})</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 !bg-blue-600 !text-white rounded-md hover:bg-gray-300"
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
    </div>
  );
};
