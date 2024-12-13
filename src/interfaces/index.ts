export interface ResponseResult {
  status: "success" | "failure";
  code: number;
  data: any;
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
