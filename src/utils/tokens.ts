import Cookie from "js-cookie";

import { refreshTokens } from "@/api/auth";

import { AuthTokens } from "@/interfaces/auth";

export const setTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  Cookie.set("accessToken", accessToken, { expires: 7 });
  Cookie.set("refreshToken", refreshToken, { expires: 30 });
};

export const getAccessToken = async () => {
  let accessToken = Cookie.get("accessToken");

  if (!accessToken) {
    try {
      const newAccessToken = await refreshTokens();

      accessToken = newAccessToken;
    } catch (error) {
      clearAllCookies();
    }
  }

  return accessToken;
};

export const clearAllCookies = () => {
  const cookies = Cookie.get();

  Object.keys(cookies).forEach((cookieName) => {
    Cookie.remove(cookieName);
  });
};
