"use client";

import DashboardNavBar from "@/components/dashboard_navBar";
import OverView from "@/components/OverView";
import { UserProvider, UserContext } from "@/context/UserContext";
import { useContext } from "react";

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
  const { user } = useContext(UserContext);

  return (
    <div className="relative">
      <DashboardNavBar
        user={user?.lastname?.charAt(0).toUpperCase() || "G"}
      >
        <OverView>{children}</OverView>
      </DashboardNavBar>
    </div>
  );
}
