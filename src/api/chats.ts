import { axiosWithAuth } from ".";

import { ResponseResult } from "@/interfaces";
import { IMessage, UserChat } from "@/interfaces/chats";

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

export const getChatMessages = async (
  chatId: number
): Promise<ResponseResult<IMessage[]>> => {
  try {
    const res = await axiosWithAuth.get(`/chats/${chatId}`);

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
