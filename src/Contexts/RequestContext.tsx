import React, { createContext, useContext, useState, useEffect } from "react";
import type { ProjectRequest, Status } from "../Types";
import { MockRequests } from "../Data/MockRequests";
import toast from "react-hot-toast";

interface RequestContextType {
  requests: ProjectRequest[];
  addRequest: (req: ProjectRequest) => void;
  updateStatus: (id: string) => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ProjectRequest[]>(() => {
    const stored = localStorage.getItem("requests");
    return stored ? JSON.parse(stored) : MockRequests;
  });

  const addRequest = (req: ProjectRequest) => {
    setRequests((prev) => {
      const updated = [...prev, req];
      localStorage.setItem("requests", JSON.stringify(updated)); // ✅ Save to localStorage
      return updated;
    });
  };

  const updateStatus = (id: string) => {
    setRequests((prev) => {
      const updated = prev.map((req) =>
        req.id === id
          ? { ...req, status: nextStatus(req.status) }
          : req
      );
      localStorage.setItem("requests", JSON.stringify(updated)); // ✅ Sync updated status
      return updated;
    });
    toast.success("Project status updated!");
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest, updateStatus }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) throw new Error("useRequestContext must be used inside RequestProvider");
  return context;
};

const statusFlow: Status[] = ["New", "Under Review", "In Progress", "Completed"];
const nextStatus = (current: Status): Status => {
  const index = statusFlow.indexOf(current);
  return statusFlow[(index + 1) % statusFlow.length];
};
