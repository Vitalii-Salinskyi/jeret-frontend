import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import AuthLayout from "../layouts/AuthLayout.vue";
import Auth from "../components/shared/auth/Auth.vue";
import Google from "@/components/shared/auth/Google.vue";
import HomeLayout from "@/layouts/HomeLayout.vue";
import SetRole from "@/components/shared/auth/SetRole.vue";
import DashboardView from "../views/DashboardView.vue";
import UsersView from "@/views/UsersView.vue";
import TasksView from "@/views/TasksView.vue";
import SettingsView from "@/views/SettingsView.vue";
import InboxView from "@/views/InboxView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "HomeLayout",
    component: HomeLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: DashboardView,
      },
      {
        path: "users",
        name: "Users",
        component: UsersView,
      },
      {
        path: "tasks",
        name: "Tasks",
        component: TasksView,
      },
      {
        path: "settings",
        name: "Settings",
        component: SettingsView,
      },
      {
        path: "inbox",
        name: "Inbox",
        component: InboxView,
      },
    ],
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
      {
        path: "role",
        name: "Role",
        component: SetRole,
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
