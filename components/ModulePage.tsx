"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Modules, UserInfo } from "@/types/schema";
import { Video } from "./Video";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function ModulesPage() {
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"summary" | "resources">("summary");
  const [videoSize, setVideoSize] = useState({ width: 600, height: 400 }); // Default video size

  const router = useRouter();
  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  const totalModules = modules.length;
  const progressPercentage =
    totalModules > 0 ? ((activeModuleIndex + 1) / totalModules) * 100 : 0;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(
          `/api/get-modules?timestamp=${Date.now()}`,
          { method: "GET" }
        );
        console.log("Response", response);
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
          // Adjust the video size when the user clicks next or previous
    setVideoSize((prevSize) => ({
      width: prevSize.width === 600 ? 800 : 600, // Toggle between two widths
      height: prevSize.height === 400 ? 600 : 400, // Toggle between two heights
    }));
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
    <div className="flex flex-col xl:flex-row gap-12 p-8 lg:p-16">
      {/* Main Content - Active Module */}
      {modules[activeModuleIndex] && (
        <div className="flex-1 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {modules[activeModuleIndex].module_title}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Module {activeModuleIndex + 1} - Course Overview
          </p>

          {modules[activeModuleIndex].video ? (
            <div className="relative mt-6 w-full aspect-video rounded-lg overflow-hidden shadow-md">
              <Video
                height={videoSize.height.toString()}
                width={videoSize.width.toString()}
                src={modules[activeModuleIndex].video}
                className="object-cover w-full h-full"
                controls={true}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <button
                  className="p-2 bg-gray-200 bg-opacity-35 text-gray-700 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                  onClick={() => setActiveModuleIndex((prev) => prev - 1)}
                  disabled={activeModuleIndex === 0}
                >
                  <ChevronsLeft />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <button
                  className="p-2 bg-green-600 bg-opacity-35 text-white rounded-full hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                  onClick={() => setActiveModuleIndex((prev) => prev + 1)}
                  disabled={activeModuleIndex === modules.length - 1}
                >
                  <ChevronsRight />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              No video available for this module.
            </p>
          )}

          {/* Tabs Section */}
          <div className="mt-8">
            <div className="flex border-b-2 border-gray-200">
              <button
                className={`px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out ${
                  activeTab === "summary"
                    ? "border-b-4 border-green-600 text-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
                onClick={() => setActiveTab("summary")}
              >
                Summary
              </button>
              <button
                className={`px-6 py-3 text-sm font-semibold transition-all duration-300 ease-in-out ${
                  activeTab === "resources"
                    ? "border-b-4 border-green-600 text-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
                onClick={() => setActiveTab("resources")}
              >
                Resources
              </button>
            </div>

            {/* Conditionally render content based on active tab */}
            <div className="mt-6 text-sm text-gray-700 space-y-4">
              {activeTab === "summary" ? (
                <div className="space-y-4">
                  {/* Summary Content */}
                  <p className="leading-relaxed">
                    {modules[activeModuleIndex].module_description}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Resources Content */}
                  <p className="leading-relaxed">
                    Resources section content goes here.
                  </p>
                  {/* You can add links, documents, or other resources here */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        {/* Course Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Entrepreneurship in East Africa - Case Study UG
          </h2>
          <p className="text-sm text-green-600 mt-2">
            Progress: {progressPercentage.toFixed(2)}%
          </p>
          <ul className="mt-6 space-y-4">
            {modules.map((module, index) => (
              <li
                key={module.module_id}
                className={`flex items-center gap-3 ${
                  index <= activeModuleIndex
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                onClick={() =>
                  index <= activeModuleIndex && handleModuleChange(index)
                }
              >
                {index <= activeModuleIndex ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                <span
                  className={`text-sm ${
                    index <= activeModuleIndex
                      ? "text-gray-800"
                      : "text-gray-400"
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
