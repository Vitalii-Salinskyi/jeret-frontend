import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import Register from "../components/auth/Register.vue";

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
        name: "Register",
        component: Register,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
