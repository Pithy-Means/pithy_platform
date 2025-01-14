"use client";

interface TopNavProps {
  user: string | undefined;
}

const TopNav: React.FC<TopNavProps> = ({user}) => {
  return (
    <header className="h-16 bg-gray-100 border-b border-gray-200 flex items-center px-4">
      <h1 className="text-lg text-black font-semibold">Admin Dashboard</h1>
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <div className="bg-gray-600 py-1 px-2 rounded-full border border-black">
          {user}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
