import { useState, useRef } from "react";
import { useRequestContext } from "../Contexts/RequestContext";
import type { ProjectRequest, Priority } from "../Types";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

interface RequestFormProps {
  onClose: () => void;
}

export const RequestForm = ({ onClose }: RequestFormProps) => {
  const { addRequest } = useRequestContext();
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    requestedBy: "",
    priority: "Medium" as Priority,
    deadline: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
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
    };

    addRequest(newRequest);
    toast.success("Project request submitted!");

    setFormData({
      projectName: "",
      description: "",
      requestedBy: "",
      priority: "Medium",
      deadline: "",
    });
    setFile(null);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl mx-auto">
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
          className="w-full border rounded-lg px-4 py-3 text-gray-800"
        />

        {/* Description */}
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Project Description"
          required
          className="w-full border rounded-lg px-4 py-3 text-gray-800"
        />

        {/* Requested By */}
        <input
          type="text"
          name="requestedBy"
          value={formData.requestedBy}
          onChange={handleChange}
          placeholder="Requested By"
          required
          className="w-full border rounded-lg px-4 py-3 text-gray-800"
        />

        {/* Priority */}
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

        {/* Deadline */}
        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline </label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 text-gray-800"
        />

        {/* Upload Document */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attach Document (PDF, DOCX, JPG, PNG,)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.png,.jpg,.jpeg,"
            onChange={handleFileChange}
            className="w-full border rounded-lg px-4 py-2 text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 !file:text-white hover:file:bg-indigo-100"
          />
          {file && <p className="text-sm mt-2 text-green-600">Selected: {file.name}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-4 py-2 !bg-blue-500 text-white rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2 !bg-blue-500 text-white rounded-md hover:bg-indigo-700">
          Submit Request
        </button>
      </div>
    </form>
  );
};
