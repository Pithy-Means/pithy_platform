import { Search } from "lucide-react";
import Logo from "./Logo";
import { IoMdNotificationsOutline } from "react-icons/io";

interface DashboardNavBarProps {
  user: string | undefined;
  children: React.ReactNode;
}

const DashboardNavBar: React.FC<DashboardNavBarProps> = ({
  user,
  children,
}) => {
  return (
    <div className="bg-white/90">
      <nav className="flex h-20 w-full bg-white justify-between items-center px-10">
        {/* Logo Section */}
        <div className="text-2xl font-bold text-black">
          <Logo />
        </div>

        {/* Search Input Section */}
        <div className="hidden lg:block w-1/2 mx-8">
          {" "}
          {/* Set width to half (50%) */}
          <div className="relative flex items-center bg-gray-200 border rounded-lg p-2">
            <input
              className="bg-gray-200 outline-none w-full p-2 pl-10 text-black/65"
              placeholder="Search Course"
              id="searchHere"
            />
            <Search color="#7f7676" className="absolute right-3" />{" "}
            {/* Adjusted icon position */}
          </div>
        </div>

        {/* Notification and User Section */}
        <div className="flex items-center gap-x-8">
          <div>
            <IoMdNotificationsOutline className="text-black h-8 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <div className="bg-black py-1.5 px-3 rounded-full border border-white shadow-md text-white">
              {user}
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default DashboardNavBar;
