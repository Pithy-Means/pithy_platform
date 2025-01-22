/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Modules, UserInfo } from "@/types/schema";
import { Video } from "./Video";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function ModulesPage() {
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  const router = useRouter();
  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  const totalModules = modules.length;
  const progressPercentage =
    totalModules > 0
      ? ((activeModuleIndex + 1) / totalModules) * 100
      : 0;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("/api/get-modules", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }
        const result = await response.json();
        setModules(result.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [user?.user, router]);

  const handleModuleChange = (index: number) => {
    if (index <= activeModuleIndex) {
      setActiveModuleIndex(index);
    } else {
      alert("Complete the current module to unlock this one.");
    }
  };

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
    <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-12 w-full">
      {/* Main Content - Active Module */}
      {modules[activeModuleIndex] && (
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-2 text-gray-700">
            {modules[activeModuleIndex].module_title}
          </h1>
          <p className="text-sm text-gray-500">
            Module {activeModuleIndex + 1} - Course Overview
          </p>

          {modules[activeModuleIndex].video ? (
            <div className="relative mt-6 w-full aspect-video rounded-lg overflow-hidden shadow-lg">
              <Video
                height="600"
                width="800"
                src={modules[activeModuleIndex].video}
                className="object-cover w-full h-full"
                controls={true}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No video available</p>
          )}

          <div className="mt-4 flex justify-between">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
              onClick={() => setActiveModuleIndex((prev) => prev - 1)}
              disabled={activeModuleIndex === 0}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed"
              onClick={() => setActiveModuleIndex((prev) => prev + 1)}
              disabled={activeModuleIndex === modules.length - 1}
            >
              Next
            </button>
          </div>

          {/* Tabs Section */}
          <div className="mt-8">
            <div className="flex border-b">
              <button className="px-4 py-2 text-sm font-medium border-b-2 border-black">
                Summary
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black">
                Resources
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-700 space-y-4">
              {modules[activeModuleIndex].module_description
                ?.split("\n")
                .map((text, index) => <p key={index}>{text}</p>)}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-8">
        {/* Course Progress Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold">
            Entrepreneurship in East Africa - Case Study UG
          </h2>
          <p className="text-sm text-green-600 mt-1">
            {progressPercentage.toFixed(2)}%
          </p>
          <ul className="mt-4 space-y-2">
            {modules.map((module, index) => (
              <li
                key={module.module_id}
                className={`flex items-center gap-2 cursor-pointer ${
                  index > activeModuleIndex && "cursor-not-allowed"
                }`}
                onClick={() => handleModuleChange(index)}
              >
                {index <= activeModuleIndex ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                <span
                  className={`text-sm ${
                    index <= activeModuleIndex ? "text-black" : "text-gray-400"
                  }`}
                >
                  {module.module_title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
