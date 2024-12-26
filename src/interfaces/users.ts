import { JobRolesEnum } from ".";

export interface IUser {
  id: number;
  name: string;
  email: string;
  profile_picture: string;
  description: string;
  job_role?: JobRolesEnum;
  password?: string;
  google_id?: string;
  profile_completed: boolean;
  tasks_completed: number;
  tasks_pending: number;
  is_online: boolean;
  followers_count: number;
  followed: number;
  rating: number;
  review_count: number;
  is_deleted: boolean;
  created_at: Date;
}

export interface UpdateUserDto {
  name?: string;
  profile_picture?: string;
  description?: string;
  job_role?: JobRolesEnum;
  is_online?: boolean;
  is_deleted?: boolean;
}

export type UserSortType =
  | "followers_count"
  | "tasks_completed"
  | "rating"
  | "review_count";

export type UserStatusType = Record<number, "online" | "offline">;

export interface IFollowUser {
  id: number;
  name: string;
  email: string;
  profile_picture?: string;
  description?: string;
  job_role?: JobRolesEnum;
}

export type followType = "followers" | "following";
