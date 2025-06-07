import React, { createContext, useContext, useState } from "react";
import type { ProjectRequest, Status } from "../Types";
import { MockRequests } from "../Data/MockRequests";
import toast from "react-hot-toast";

// Status to progress mapping
const statusToProgress: Record<Status, number> = {
  New: 0,
  "Under Review": 25,
  "In Progress": 60,
  Completed: 100,
};

interface RequestContextType {
  requests: ProjectRequest[];
  addRequest: (req: ProjectRequest) => void;
  updateStatus: (id: string) => void;
  updateRequest: (updatedRequest: ProjectRequest) => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ProjectRequest[]>(() => {
    const stored = localStorage.getItem("requests");
    return stored ? JSON.parse(stored) : MockRequests;
  });

  // Add a new request
  const addRequest = (req: ProjectRequest) => {
    const withProgress = {
      ...req,
      progress: statusToProgress[req.status],
    };
    setRequests((prev) => {
      const updated = [...prev, withProgress];
      localStorage.setItem("requests", JSON.stringify(updated));
      return updated;
    });
    toast.success("Request submitted!");
  };

  // Advance status (user flow)
  const updateStatus = (id: string) => {
    setRequests((prev) => {
      const updated = prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: nextStatus(req.status),
              progress: statusToProgress[nextStatus(req.status)],
            }
          : req
      );
      localStorage.setItem("requests", JSON.stringify(updated));
      return updated;
    });
    toast.success("Project status updated!");
  };

  // Fully update request (admin flow)
  const updateRequest = (updatedReq: ProjectRequest) => {
    const withProgress = {
      ...updatedReq,
      progress: statusToProgress[updatedReq.status],
    };

    setRequests((prev) => {
      const updated = prev.map((req) => (req.id === withProgress.id ? withProgress : req));
      localStorage.setItem("requests", JSON.stringify(updated));
      return updated;
    });
    toast.success("Request updated.");
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest, updateStatus, updateRequest }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) throw new Error("useRequestContext must be used inside RequestProvider");
  return context;
};

// Status flow order
const statusFlow: Status[] = ["New", "Under Review", "In Progress", "Completed"];
const nextStatus = (current: Status): Status => {
  const index = statusFlow.indexOf(current);
  return statusFlow[(index + 1) % statusFlow.length];
};
