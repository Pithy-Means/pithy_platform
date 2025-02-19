"use client";

import AdminSidebar from "@/components/AdminSidebar";
import TopNav from "@/components/TopNav";
import { UserProvider } from "@/context/UserContext";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserInfo } from "@/types/schema";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return(
    <UserProvider>
      <DashboardContent>{children}</DashboardContent>
    </UserProvider>
);
}


function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore((state) => state as unknown as UserInfo);
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <TopNav user={user?.firstname} />
        <main className="flex-1 px-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
