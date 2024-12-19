import axios from "axios";
import Cookies from "js-cookie";

import { setTokens } from "@/utils/tokens";

import { ResponseResult } from "@/interfaces";
import {
  AuthTokens,
  CreateSessionDto,
  GoogleAuthDto,
  LoginDto,
  RefreshTokensDto,
  RegisterDto,
} from "@/interfaces/auth";

import { ENDPOINT } from ".";

export const authorizeGoogle = async (
  googleAuthDto: GoogleAuthDto
): Promise<ResponseResult> => {
  try {
    const url = new URL(`${ENDPOINT}/auth/google/callback`);

    url.searchParams.append("code", JSON.stringify(googleAuthDto.code));
    url.searchParams.append("long", googleAuthDto.long.toString());
    url.searchParams.append("lat", googleAuthDto.lat.toString());
    url.searchParams.append("ip_address", googleAuthDto.ip_address);
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

export const register = async (
  registerDto: RegisterDto
): Promise<ResponseResult> => {
  try {
    const res = await axios.post(`${ENDPOINT}/auth/register`, registerDto);

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

export const login = async ({
  createSessionDto,
  loginDto,
}: {
  loginDto: LoginDto;
  createSessionDto: CreateSessionDto;
}): Promise<ResponseResult> => {
  try {
    const res = await axios.post(`${ENDPOINT}/auth/login`, {
      loginDto,
      createSessionDto,
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

export const refreshTokens = async () => {
  try {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) throw new Error("Refresh token not found");

    const { error, device, ip_address, lat, long } =
      await getUserLocationAndDeviceInfo();

    if (error) throw new Error(error);

    const body: RefreshTokensDto = {
      refresh_token: refreshToken,
      device: device as string,
      ip_address,
      lat: lat as number,
      long: long as number,
    };

    const res = await axios.post<AuthTokens>(`${ENDPOINT}/auth/refresh`, body);

    if (!res.data.accessToken) throw new Error();

    setTokens(res.data);

    return res.data.accessToken;
  } catch (error) {
    throw error;
  }
};

export const getUserLocationAndDeviceInfo = async () => {
  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => resolve(position),
          () =>
            reject(
              new Error(
                "Unable to authenticate, geolocation permission denied. Please enable location access to continue."
              )
            ),
          {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 0,
          }
        );
      }
    );

    const { latitude, longitude } = position.coords;

    const browser = navigator.userAgent;
    const device = browser.split(")")[0] + ")";

    const {
      data: { ip },
    } = await axios.get("https://api.ipify.org?format=json");

    return {
      lat: latitude,
      long: longitude,
      device,
      ip_address: ip,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};
