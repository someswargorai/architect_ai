import {
  LayoutDashboard,
  Building2,
  Sparkles,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  {
    id: "core",
    name: "Workspace",
    children: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "projects",
        name: "Projects",
        href: "/projects",
        icon: Building2,
      },
      {
        id: "ai-studio",
        name: "Ask AI",
        href: "/ai-studio",
        icon: Sparkles,
      },
    ],
  },
];
