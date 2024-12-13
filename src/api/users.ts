import { axiosWithAuth } from ".";

import { ResponseResult } from "@/interfaces";
import { UpdateUserDto } from "@/interfaces/users";

export const updateUserData = async (
  updateUserDto: UpdateUserDto
): Promise<ResponseResult> => {
  try {
    const res = await axiosWithAuth.patch("/users", updateUserDto);

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
