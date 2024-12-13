import Cookie from "js-cookie";

import { AuthTokens } from "@/interfaces/auth";

export const setTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  Cookie.set("accessToken", accessToken, { expires: 7 });
  Cookie.set("refreshToken", refreshToken, { expires: 30 });
};

export const getAccessToken = async () => {
  let accessToken = Cookie.get("accessToken");

  if (!accessToken) {
    try {
      // TODO: add refreshToken endpoint;
    } catch (error) {
      clearAllCookies();
    }
  }

  return accessToken;
};

const clearAllCookies = () => {
  const cookies = Cookie.get();

  Object.keys(cookies).forEach((cookieName) => {
    Cookie.remove(cookieName);
  });
};
