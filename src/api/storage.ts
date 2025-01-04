import { axiosWithAuth } from ".";

import { ResponseResult } from "@/interfaces";

export const getFileUrl = async (
  key: string
): Promise<ResponseResult<string>> => {
  try {
    const res = await axiosWithAuth.get<string>(`/storage/${key}/url`);

    return {
      status: "success",
      code: res.status,
      data: res.data,
    };
  } catch (error: any) {
    return {
      status: "failure",
      code: error.status,
      data: error.response.data.message,
    };
  }
};
