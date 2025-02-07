import { Search } from "lucide-react";
import Logo from "./Logo";
import { IoMdNotificationsOutline } from "react-icons/io";

interface DashboardNavBarProps {
  user: string | undefined;
  children: React.ReactNode;
}

const DashboardNavBar: React.FC<DashboardNavBarProps> = ({ user, children }) => {

  return (
    <div className="bg-white/90">
      <nav className="flex h-20 w-full bg-white justify-evenly items-center px-4">
        <div className="text-2xl font-bold text-black">
          <Logo />
        </div>
        <div className="hidden lg:block">
          <div className="hidden relative lg:flex space-x-4 items-center bg-gray-300 border rounded-lg">
            <input
              className="bg-gray-300 outline-none w-full p-2 pl-10 text-black/65"
              placeholder="Search Course"
              id="searchHere"
            />
            <Search color="#7f7676" />
          </div>
        </div>
        <div>
          <IoMdNotificationsOutline className="text-black h-8 w-8" />
        </div>
        <div className="flex items-center gap-x-2">
          <div className="bg-gray-600 py-1 px-2 rounded-full border border-black">
            {user}
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default DashboardNavBar;
