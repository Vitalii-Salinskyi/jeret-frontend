import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import Auth from "../components/shared/auth/Auth.vue";
import Google from "@/components/shared/auth/Google.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/auth",
    name: "AuthLayout",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "Auth",
        component: Auth,
      },
    ],
  },
  {
    path: "/auth/google",
    name: "AuthGoogle",
    component: Google,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
