"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Determine if the current pathname matches the desired routes
  const isPublicRoute = ["/", "/about", "/contact", "/how-it-works"].includes(pathname);

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
