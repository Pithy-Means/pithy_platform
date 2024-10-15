"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import DashboardNavBar from "@/components/dashboard_navBar";

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <div>
      {isDashboard ? <DashboardNavBar /> : <Navbar />}
      {children}
    </div>
  );
};

export default ConditionalLayout;
