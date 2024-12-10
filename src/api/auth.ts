import axios from "axios";

import { ResponseResult } from "@/interfaces";
import { GoogleAuthDto } from "@/interfaces/auth";

export const authorizeGoogle = async (
  googleAuthDto: GoogleAuthDto
): Promise<ResponseResult> => {
  try {
    const url = new URL(
      `${import.meta.env.VITE_SERVER_URL}/auth/google/callback`
    );

    url.searchParams.append("code", JSON.stringify(googleAuthDto.code));
    url.searchParams.append("long", googleAuthDto.long.toString());
    url.searchParams.append("lat", googleAuthDto.lat.toString());
    url.searchParams.append("ip_address", googleAuthDto.ip);
    url.searchParams.append("device", googleAuthDto.device);

    const res = await axios.get(url.toString());

    return {
      status: "success",
      code: res.status,
      data: res.data,
    };
  } catch (error: any) {
    console.log(error);
    return {
      status: "failure",
      code: error.status,
      data: error.response.data.message,
    };
  }
};
