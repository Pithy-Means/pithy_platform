"use client";

import DashboardNavBar from "@/components/dashboard_navBar";
import FooterSmallScreen from "@/components/FooterSmallScreen";
import OverView from "@/components/OverView";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserInfo } from "@/types/schema";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardContent>{children}</DashboardContent>;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore(
    (state) => state as { user: UserInfo; isAuthenticated: boolean }
  );
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated when the component mounts
    if (!isAuthenticated) {
      router.push("/signIn");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Don't render anything until the redirection is complete
  }

  return (
    <DashboardNavBar user={user?.firstname?.charAt(0)?.toUpperCase() ?? ""}>
      <OverView>
        {children}
        <Toaster />
      </OverView>
      <FooterSmallScreen />
    </DashboardNavBar>
  );
}
