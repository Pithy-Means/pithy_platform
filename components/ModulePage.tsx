/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState } from "react";
import { Modules } from "@/types/schema";
import { Video } from "./Video";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import { Lock, CheckCircle } from "lucide-react";

export default function ModulesPage() {
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0); // Track active module

  const router = useRouter();
  const { user } = useContext(UserContext);

  // Calculate total modules and watched modules
  const totalModules = modules.length;
  const watchedModules = activeModuleIndex + 1;

  useEffect(() => {
    const fetchModules = async () => {
      if (!user) {
        router.push("/signIn");
        return;
      }
      try {
        const response = await fetch("/api/get-modules", { method: "GET" });

        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }

        const result = await response.json();
        setModules(result.data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [user, router]);

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
    <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-12">
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
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
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
          {/* Added Progress Percentage */}
          <p className="text-sm text-green-600 mt-1">
            {totalModules > 0
              ? `${((watchedModules / totalModules) * 100).toFixed(2)}%`
              : "0%"}
          </p>
          <ul className="mt-4 space-y-2">
            {modules.map((module, index) => (
              <li
                key={module.module_id}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  if (index <= activeModuleIndex) setActiveModuleIndex(index);
                }}
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

        {/* Other Courses Section */}
        {/* <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold">Other Courses</h2>
          <ul className="mt-4 space-y-4">
            {Array(3)
              .fill({
                title:
                  "Psychological Assessment in A Unhealthy Working Environment",
                duration: "3 Hours",
                modules: "3 Modules",
              })
              .map((course, index) => (
                <li key={index} className="flex items-center gap-4">
                  <img
                    src="/path-to-thumbnail.jpg"
                    alt="Course Thumbnail"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-medium">{course.title}</h3>
                    <p className="text-xs text-gray-500">
                      {course.duration} • {course.modules}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div> */}
      </div>
    </div>
  );
}
