import type { ReactNode } from "react";
import { type ProjectRequest } from "../Types";

export const MockRequests: ProjectRequest[] = [
  {
    id: "1",
    projectName: "Website Redesign",
    description: "Client requests UI/UX overhaul of their website.",
    requestedBy: "Alice",
    priority: "High",
    deadline: "2025-05-20",
    status: "New",
    name: "Alice",
    fileName: "",
    assignedTo: {
      name: "Alice",
      team: "Design Team",
    },
    createdAt: function (): ReactNode {
      return null; // You can implement a real component or formatter here
    },
    team: "Design Team",
  },
  {
    id: "2",
    projectName: "Analytics Dashboard",
    description: "Add new KPIs to internal analytics dashboard.",
    requestedBy: "Bob",
    priority: "Medium",
    status: "Under Review",
    name: "Bob",
    fileName: "",
    assignedTo: {
      name: "Bob",
      team: "Design Team",
    },
    createdAt: function (): ReactNode {
      return null;
    },
    team: "Design Team",
  },
];
