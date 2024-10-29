import DashboardNavBar from "@/components/dashboard_navBar";
import { getLoggedInUser } from "@/lib/actions/user.actions";

export default async function DashboardLayout ({ children }: {children: React.ReactNode }) {
  const loggedIn = await getLoggedInUser();
  return (
    <div className="">
      <DashboardNavBar user={loggedIn ? loggedIn.firstname.charAt(0).toUpperCase() : 'G'}>
        {children}
      </DashboardNavBar>
    </div>
  );
};

