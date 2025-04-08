"use client";

import { useEffect, useState } from "react";
import { Modules } from "@/types/schema";
import { Video } from "./Video";
import { Lock, CheckCircle, ChevronsLeft, ChevronsRight } from "lucide-react";
import QuestionsManagement from "./QuestionManagement";
import toast, { Toaster } from "react-hot-toast";
import { useVideoProgressStore } from "@/lib/store/useVideoProgressStore";

export default function ModulesPage() {
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"summary" | "question">("summary");
  const [videoSize, setVideoSize] = useState({ width: 600, height: 400 });

  // Get the store methods
  const { getProgress } = useVideoProgressStore();

  const totalModules = modules.length;
  const progressPercentage =
    totalModules > 0 ? ((activeModuleIndex + 1) / totalModules) * 100 : 0;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`/api/get-modules`, { method: "GET" });
        if (!response.ok) {
          toast.error("Error fetching modules, please try again later.");
          throw new Error("Failed to fetch modules");
        }
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
          toast.success("Successfully fetched modules.");
          setModules(result.data);
          
          // Check if any module was in progress to auto-select it
          if (result.data.length > 0) {
            // Find the first incomplete module
            const firstIncompleteIndex = result.data.findIndex(
              (module: { module_id: string; completed?: boolean }) => {
                const progress = getProgress(module.module_id);
                return !progress || !progress.completed;
              }
            );
            
            // If found, set it as active
            if (firstIncompleteIndex !== -1) {
              setActiveModuleIndex(firstIncompleteIndex);
            }
          }
        } else {
          toast.error("Error fetching modules, please try again later.");
          setError("Error fetching modules, please try again later.");
          console.error("Error fetching modules:", result);
        }
      } catch (err) {
        setError((err as Error).message);
        console.error("Error fetching modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [getProgress]);

  const handleModuleChange = (index: number) => {
    // Find the last completed module index
    const lastCompletedIndex = modules.reduce((lastIndex, module, idx) => {
      const progress = getProgress(module.module_id);
      return progress?.completed ? idx : lastIndex;
    }, -1);
    
    // Allow access to completed modules and the next one
    if (index <= lastCompletedIndex + 1) {
      setActiveModuleIndex(index);
      setVideoSize((prevSize) => ({
        width: prevSize.width === 600 ? 800 : 600,
        height: prevSize.height === 400 ? 600 : 400,
      }));
    } else {
      toast.error("Complete the current module to unlock this one.");
    }
  };

  const handleVideoComplete = () => {
    if (activeModuleIndex < modules.length - 1) {
      toast.success("Module completed! You can now proceed to the next one.");
    } else {
      toast.success("Congratulations! You've completed all modules.");
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
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(0, 20, 0, 0.9)",
            color: "#10ff10",
            border: "1px solid #0f0",
            boxShadow: "0 0 10px rgba(0, 255, 0, 0.3)",
          },
        }}
      />
      
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
                moduleId={modules[activeModuleIndex].module_id}
                onComplete={handleVideoComplete}
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
                  disabled={
                    activeModuleIndex === modules.length - 1 || 
                    !getProgress(modules[activeModuleIndex].module_id)?.completed
                  }
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
                  activeTab === "question"
                    ? "border-b-4 border-green-600 text-green-600"
                    : "text-gray-600 hover:text-green-600"
                }`}
                onClick={() => setActiveTab("question")}
              >
                Question & Answers
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
                  
                  {/* Show video progress indicator */}
                  {modules[activeModuleIndex].video && getProgress(modules[activeModuleIndex].module_id) && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700">Your Progress</h3>
                      <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ 
                            width: getProgress(modules[activeModuleIndex].module_id)?.completed ? 
                              '100%' : 
                              getProgress(modules[activeModuleIndex].module_id)?.currentTime ? 
                                `${Math.min((getProgress(modules[activeModuleIndex].module_id)?.currentTime || 0) / (60 * 10) * 100, 99)}%` : 
                                '0%' 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getProgress(modules[activeModuleIndex].module_id)?.completed ? 
                          'Completed' : 
                          'In progress'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <QuestionsManagement />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        {/* Course Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-96 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800">
            Entrepreneurship in East Africa - Case Study UG
          </h2>
          <p className="text-sm text-green-600 mt-2">
            Progress: {progressPercentage.toFixed(2)}%
          </p>
          <ul className="mt-6 space-y-4">
            {modules.map((module, index) => {
              const progress = getProgress(module.module_id);
              const isCompleted = progress?.completed;
              
              // Find the last completed module index
              const lastCompletedIndex = modules.reduce((lastIdx, mod, idx) => {
                const prog = getProgress(mod.module_id);
                return prog?.completed ? idx : lastIdx;
              }, -1);
              
              // A module is unlocked if it's before or immediately after the last completed module
              const isUnlocked = index <= lastCompletedIndex + 1;

              return (
                <li
                  key={module.module_id}
                  className={`flex items-center gap-3 ${
                    isUnlocked
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                  onClick={() =>
                    isUnlocked && handleModuleChange(index)
                  }
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : isUnlocked ? (
                    <div className="w-5 h-5 border-2 border-green-600 rounded-full flex items-center justify-center">
                      {progress && progress.currentTime > 0 && (
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      )}
                    </div>
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <span
                    className={`text-sm ${
                      isUnlocked
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {module.module_title}
                    {progress && progress.currentTime > 0 && !isCompleted && (
                      <span className="text-xs text-green-600 ml-2">
                        (In progress)
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}