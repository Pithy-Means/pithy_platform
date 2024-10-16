"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import DashboardNavBar from "@/components/dashboard_navBar";

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isCourse = pathname?.startsWith("/course");
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <div>
      {/* If the path starts with "/dashboard/course", use DashboardNavBar */}
      {isCourse ? <DashboardNavBar /> : isDashboard ? <DashboardNavBar /> : <Navbar />}
      {/* {isDashboard ? <DashboardNavBar /> : <Navbar />} */}
     
      
      {children}
    </div>
  );
};

export default ConditionalLayout;
