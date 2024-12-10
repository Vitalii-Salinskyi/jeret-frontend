export interface ResponseResult {
  status: "success" | "failure";
  code: number;
  data: any;
}
