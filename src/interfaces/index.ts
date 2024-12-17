export interface ResponseResult<T = any> {
  status: "success" | "failure";
  code: number;
  data: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum JobRolesEnum {
  ProjectManager = "Project Manager",
  FrontendDeveloper = "Front-end Developer",
  BackendDeveloper = "Back-end Developer",
  WebDeveloper = "Web Developer",
  AndroidDeveloper = "Android Developer",
  IOSDeveloper = "IOS Developer",
  UIUXDesigner = "UI/UX Designer",
  ThreeDDesigner = "3D Designer",
  TwoDDesigner = "2D Designer",
}

export interface HeaderVariant {
  title: string;
  subtitle?: string;
}

export interface FilterOption<T> {
  label: string;
  value: T;
}
