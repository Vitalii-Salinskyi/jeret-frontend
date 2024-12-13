import { JobRolesEnum } from ".";

export interface UpdateUserDto {
  name?: string;
  profile_picture?: string;
  job_role?: JobRolesEnum;
  is_online?: boolean;
  is_deleted?: boolean;
}
