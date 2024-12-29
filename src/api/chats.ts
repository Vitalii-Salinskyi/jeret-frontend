import { axiosWithAuth } from ".";

import { ResponseResult } from "@/interfaces";
import { UserChat } from "@/interfaces/chats";

export const getUsersChats = async (): Promise<ResponseResult<UserChat[]>> => {
  try {
    const res = await axiosWithAuth.get("/chats");

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
