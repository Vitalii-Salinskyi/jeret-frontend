import { UserSortType } from "@/interfaces/users";
import { FilterOption, JobRolesEnum } from "@/interfaces";

export const userSortOption: FilterOption<UserSortType>[] = [
  {
    label: "Popular",
    value: "followers_count",
  },
  {
    label: "Rating",
    value: "rating",
  },
  {
    label: "Reviews",
    value: "review_count",
  },
  {
    label: "Tasks",
    value: "tasks_completed",
  },
];

export const userCategories: FilterOption<JobRolesEnum>[] = [
  {
    label: "Front-end Dev.",
    value: JobRolesEnum.FrontendDeveloper,
  },
  {
    label: "Back-end Dev.",
    value: JobRolesEnum.BackendDeveloper,
  },
  {
    label: "Project Man.",
    value: JobRolesEnum.ProjectManager,
  },

  {
    label: "Web Dev.",
    value: JobRolesEnum.WebDeveloper,
  },

  {
    label: "Android Dev.",
    value: JobRolesEnum.AndroidDeveloper,
  },

  {
    label: "iOS Dev.",
    value: JobRolesEnum.IOSDeveloper,
  },
  {
    label: "Design (UI/UX)",
    value: JobRolesEnum.UIUXDesigner,
  },

  {
    label: "3D Design",
    value: JobRolesEnum.ThreeDDesigner,
  },

  {
    label: "2D Design",
    value: JobRolesEnum.TwoDDesigner,
  },
];
