export interface ResponseResult<T = any> {
  status: "success" | "failure";
  code: number;
  data: T;
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
