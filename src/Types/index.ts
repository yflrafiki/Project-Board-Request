import type { ReactNode } from "react";

export type Priority = "Low" | "Medium" | "High";
export type Status = "New" | "Under Review" | "In Progress" | "Completed";

export interface ProjectRequest {
    fileName: string;
    projectName: ReactNode;
    name: string;
    id: string;
    description: string;
    requestedBy: string;
    priority: Priority;
    deadline?: string;
    status: Status;
    document?: File

}