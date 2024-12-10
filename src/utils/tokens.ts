import Cookie from "js-cookie";

import { AuthTokens } from "@/interfaces/auth";

export const setTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  Cookie.set("accessToken", accessToken, { expires: 7 });
  Cookie.set("refreshToken", refreshToken, { expires: 30 });
};
