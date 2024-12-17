import { axiosWithAuth } from ".";

import {
  JobRolesEnum,
  PaginationParams,
  PaginationResponse,
  ResponseResult,
} from "@/interfaces";
import { IUser, UpdateUserDto, UserSortType } from "@/interfaces/users";

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

export const getProfile = async (): Promise<ResponseResult<IUser>> => {
  try {
    const res = await axiosWithAuth.get<IUser>("/users/me");

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

export const getUsers = async (
  category?: JobRolesEnum,
  sortBy?: UserSortType,
  input?: string,
  { page = 1, limit = 10 }: PaginationParams = {}
): Promise<ResponseResult<PaginationResponse<IUser>>> => {
  try {
    const searchParams = new URLSearchParams();

    if (category) searchParams.append("category", category);
    if (sortBy) searchParams.append("sortBy", sortBy);
    if (input) searchParams.append("input", input);

    searchParams.append("page", page.toString());
    searchParams.append("limit", limit.toString());

    const res = await axiosWithAuth.get<PaginationResponse<IUser>>(
      `/users?${searchParams.toString()}`
    );

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

export const getRecentUsers = async (
  limit: number = 8
): Promise<ResponseResult<IUser[]>> => {
  try {
    const res = await axiosWithAuth.get(`/users/recent?limit=${limit}`);

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
