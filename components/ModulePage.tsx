import { useEffect, useState } from 'react';
import { Modules, UserInfo } from '@/types/schema';
import { Video } from './Video';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';

export default function ModulesPage() {
  const [modules, setModules] = useState<Modules[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const getUser = async () => {
    try {
      const loggedUser = await getLoggedInUser();
      console.log("Logged in user:", loggedUser);
      setUser(loggedUser);
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch("/api/get-modules", { method: "GET" });

      if (!response.ok) {
        throw new Error("Failed to fetch modules");
      }
  
      const result = await response.json();
      console.log("Modules fetched successfully:", result);
      setModules(result.data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };
  useEffect(() => {
    getUser();
    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Modules</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div 
            key={module.module_id} 
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {module.module_title}
            </h2>

            {module.video ? (
              <Video 
                src={module.video} 
                controls 
                className="w-full rounded-md overflow-hidden mb-4" 
              />
            ) : (
              <p className="text-gray-500 text-sm">No video available</p>
            )}

            <button 
              className="mt-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      {user?.role === "admin" && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md mr-16"
            onClick={() => router.push("/admin/addcourse")}
          >
            Create Course
          </button>
        )}
    </div>
  );
}
