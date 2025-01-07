import {
  LayoutDashboard,
  CircleUser,
  MessageCircleMore,
  Settings,
  ClipboardCheck,
} from "lucide-vue-next";

import { HeaderVariant } from "@/interfaces";

export const navLinks = [
  {
    icon: LayoutDashboard,
    title: "Overview",
    path: "/dashboard",
  },
  {
    icon: ClipboardCheck,
    title: "Projects",
    path: "/projects",
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
