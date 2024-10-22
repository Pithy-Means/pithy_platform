"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import DashboardNavBar from "@/components/dashboard_navBar";

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  
  // Determine if the current pathname matches the desired routes
  const isPublicRoute = ["/", "/about", "/contact", "/how-it-works"].includes(pathname);
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <div>
      {isPublicRoute ? (
        <Navbar />
      ) : ''} {/* Render nothing if not on the specified routes */}
      {children}
    </div>
  );
};

export default ConditionalLayout;
