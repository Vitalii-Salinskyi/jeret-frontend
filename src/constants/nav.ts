import {
  LayoutDashboard,
  BookOpenText,
  CircleUser,
  MessageCircleMore,
  Settings,
} from "lucide-vue-next";

export const navLinks = [
  {
    icon: LayoutDashboard,
    title: "Overview",
    path: "/",
  },
  {
    icon: BookOpenText,
    title: "Tasks",
    path: "/tasks",
  },
  {
    icon: CircleUser,
    title: "Mentors",
    path: "/mentors",
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
