"use client";

import React, { useContext } from "react"
import AdminSidebar from "@/components/AdminSidebar";
import TopNav from "@/components/TopNav";
import { UserContext, UserProvider } from "@/context/UserContext";

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
  const { user } = useContext(UserContext);
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <TopNav user={user?.firstname} />
        <main className="flex-1 p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
