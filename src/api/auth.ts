import axios from "axios";

import { ResponseResult } from "@/interfaces";
import {
  CreateSessionDto,
  GoogleAuthDto,
  LoginDto,
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
    const res = await axios.post(`${ENDPOINT}/auth/register`, {
      ...registerDto,
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
