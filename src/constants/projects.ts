import { TaskStatus } from "@/interfaces/projects";

export const TASK_TYPES: Record<keyof TaskStatus, { color: string }> = {
  pending: {
    color: "#FF8C00",
  },
  progress: {
    color: "#00D589",
  },
  review: {
    color: "#F82525",
  },
  completed: {
    color: "#0B66C2",
  },
};
