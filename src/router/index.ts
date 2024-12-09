import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import Auth from "../components/shared/auth/Auth.vue";

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
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
