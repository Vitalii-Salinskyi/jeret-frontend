import { axiosWithAuth } from ".";

import {
  CreateProjectDto,
  IProject,
  MemberDto,
  UpdateProjectDto,
} from "@/interfaces/projects";
import { ResponseResult } from "@/interfaces";

export const getProjectByOwnerId = async (): Promise<
  ResponseResult<IProject[]>
> => {
  try {
    const res = await axiosWithAuth.get("/projects");

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

export const getProjectMembership = async (): Promise<
  ResponseResult<IProject[]>
> => {
  try {
    const res = await axiosWithAuth.get("/projects/member");

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

export const getProjectById = async (
  id: number
): Promise<ResponseResult<IProject>> => {
  try {
    const res = await axiosWithAuth.get(`/projects/${id}`);

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

export const createProject = async (
  createProjectDto: CreateProjectDto
): Promise<ResponseResult<IProject>> => {
  try {
    const res = await axiosWithAuth.post("/projects", createProjectDto);

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

export const updateProjectName = async (
  updateProjectDto: UpdateProjectDto
): Promise<ResponseResult<void>> => {
  try {
    const res = await axiosWithAuth.patch(
      `/projects/${updateProjectDto.project_id}`,
      updateProjectDto
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

export const deleteProject = async (
  id: number
): Promise<ResponseResult<void>> => {
  try {
    const res = await axiosWithAuth.delete(`/projects/${id}`);

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

export const addNewMember = async (
  memberDto: MemberDto
): Promise<ResponseResult<void>> => {
  try {
    const res = await axiosWithAuth.post(`/projects/member`, memberDto);

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

export const removeMember = async (
  memberDto: MemberDto
): Promise<ResponseResult<void>> => {
  try {
    const res = await axiosWithAuth.delete(`/projects/member`, {
      data: memberDto,
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