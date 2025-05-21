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
        name: ""
    },
    {
        id: "2",
        projectName: "Analytics Dashboard",
        description: "Add new KPIs to internal analytics dashboard.",
        requestedBy: "Bob",
        priority: "Medium",
        status: "Under Review",
        name: ""
    },

];