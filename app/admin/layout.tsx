"use client";

import AdminSidebar from "@/components/AdminSidebar";
import DashboardNavBar from "@/components/dashboard_navBar";
import { UserProvider } from "@/context/UserContext";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserInfo } from "@/types/schema";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <DashboardContent>{children}</DashboardContent>
    </UserProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore((state) => state as unknown as UserInfo);
  return (
    <div className="relative">
      <DashboardNavBar user={user?.firstname?.charAt(0)?.toUpperCase() ?? ""}>
        <div className="flex mt-4 space-x-4">
          <AdminSidebar />
          <main className="flex-1 px-4 bg-gray-50">{children}</main>
        </div>
      </DashboardNavBar>
    </div>
  );
}
