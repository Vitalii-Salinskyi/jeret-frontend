import { axiosWithAuth } from ".";

import { PaginationParams, ResponseResult } from "@/interfaces";
import { followType, IFollowUser } from "@/interfaces/users";

export const followUser = async (
  following_id: number
): Promise<ResponseResult<void>> => {
  try {
    const res = await axiosWithAuth.post("/followers/follow", {
      following_id,
    });

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

export const unfollowUser = async (
  following_id: number
): Promise<ResponseResult<void>> => {
  try {
    const res = await axiosWithAuth.delete("/followers/unfollow", {
      data: { following_id },
    });

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

export const getFollowers = async (
  userId: number,
  type: followType = "followers",
  { page = 1, limit = 20 }: PaginationParams = {}
): Promise<ResponseResult<IFollowUser>> => {
  const url = new URL(`/followers/${userId}`);

  url.searchParams.append("type", type);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());

  try {
    const res = await axiosWithAuth.get(url.toString());

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

export const getBulkFollowers = async (
  userIds: number[]
): Promise<ResponseResult<Record<number, boolean>>> => {
  const searchParams = new URLSearchParams();

  searchParams.append("userIds", userIds.join(","));

  try {
    const res = await axiosWithAuth.get(
      `/followers?${searchParams.toString()}`
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
