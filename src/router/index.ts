import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import HomeView from "../views/HomeView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
