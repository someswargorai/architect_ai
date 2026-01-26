
import AppSidebar from "@/components/app-sidebar";
import Navigation from "@/components/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import AuthProvider from "@/Providers/AuthProvider";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <AuthProvider>
      {" "}
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="flex flex-1 flex-col overflow-auto">
          <Navigation />
          {children}
          
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}
