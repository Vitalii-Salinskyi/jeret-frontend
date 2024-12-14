import {
  LayoutDashboard,
  BookOpenText,
  CircleUser,
  MessageCircleMore,
  Settings,
} from "lucide-vue-next";

import { HeaderVariant } from "@/interfaces";

export const navLinks = [
  {
    icon: LayoutDashboard,
    title: "Overview",
    path: "/dashboard",
  },
  {
    icon: BookOpenText,
    title: "Tasks",
    path: "/tasks",
  },
  {
    icon: CircleUser,
    title: "Users",
    path: "/users",
  },
  {
    icon: MessageCircleMore,
    title: "Message",
    path: "/inbox",
  },
  {
    icon: Settings,
    title: "Settings",
    path: "/settings",
  },
] as const;

export const headerVariants: Record<string, HeaderVariant> = {
  Dashboard: {
    title: "Hi, ",
    subtitle: "Let's finish your task today!",
  },
  Tasks: {
    title: "Explore Task",
  },
  Users: {
    title: "Explore Users",
  },
  Inbox: {
    title: "Message",
  },
  Settings: {
    title: "Settings",
  },
};
