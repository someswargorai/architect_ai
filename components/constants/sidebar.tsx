import {
  LayoutDashboard,
  Building2,
  Sparkles,
  DollarSignIcon,
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
        id: "pricing",
        name: "Pricing",
        href: "/pricing",
        icon: DollarSignIcon,
      },
    ],
  },
];
