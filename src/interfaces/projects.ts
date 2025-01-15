import { TASK_TYPES } from "@/constants/projects";

export type TaskType = keyof typeof TASK_TYPES;

export interface TaskStatus {
  pending: number;
  progress: number;
  completed: number;
  review: number;
}

export interface IProject {
  id: number;
  created_at: string;
  name: string;
  members_count: number;
  status: TaskStatus;
  owner_id: number;
}

export type projectsType = "all" | "own";

export interface CreateProjectDto {
  name: string;
  owner_id: number;
}

export interface MemberDto {
  member_id: number;
  project_id: number;
}

export interface UpdateProjectDto {
  name: string;
  project_id: number;
}

export interface MemberDto {
  member_id: number;
  project_id: number;
}
