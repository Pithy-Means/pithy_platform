"use client";

import { useCallback, useEffect, useState } from "react";
import { Modules } from "@/types/schema";
import toast, { Toaster } from "react-hot-toast";
import { useVideoProgressStore } from "@/lib/store/useVideoProgressStore";

// Extracted Components
import ModuleTabs from "./ModuleTabs";
import ModuleSidebar from "./ModuleSidebar";
import LoadingSpinner from "./LoadingSpinner";
import QuestionModal from "./QuestionModal";
import VideoPlayer from "./VideoPlayer";

export default function ModulesPage() {
  const [modules, setModules] = useState<Modules[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"summary" | "question">("summary");
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  // Get the store methods
  const { getProgress } = useVideoProgressStore();

  const totalModules = modules.length;
  const progressPercentage =
    totalModules > 0 ? ((activeModuleIndex + 1) / totalModules) * 100 : 0;

  const fetchModules = useCallback(async () => {
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
  }, [getProgress]);

  useEffect(() => {
    fetchModules();
  }, [getProgress, fetchModules]);

  const handleModuleChange = (index: number) => {
    // Find the last completed module index
    const lastCompletedIndex = modules.reduce((lastIndex, module, idx) => {
      const progress = getProgress(module.module_id);
      return progress?.completed ? idx : lastIndex;
    }, -1);
    
    // Allow access to completed modules and the next one
    if (index <= lastCompletedIndex + 1) {
      setActiveModuleIndex(index);
    } else {
      toast.error("Complete the current module to unlock this one.");
    }
  };

  const handleVideoComplete = () => {
    // Check if this is the last module
    if (activeModuleIndex === modules.length - 1) {
      setShowQuestionModal(true);
      toast.success("Congratulations! You've completed all modules. Please take the assessment.");
    } else {
      toast.success("Module completed! You can now proceed to the next one.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full p-2 sm:p-4 md:p-6 lg:p-12">
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
      
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-12 w-full">
        {modules[activeModuleIndex] && (
          <div className="w-full xl:flex-1 rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-gray-800">
              {modules[activeModuleIndex].module_title}
            </h1>
            <p className="text-sm text-gray-500 mb-4 sm:mb-6">
              Module {activeModuleIndex + 1} - Course Overview
            </p>

            {modules[activeModuleIndex].video ? (
              <div className="relative mt-4 sm:mt-6 w-full aspect-video rounded-lg overflow-hidden shadow-md">
                <VideoPlayer 
                  moduleData={modules[activeModuleIndex]}
                  onComplete={handleVideoComplete}
                  onNext={() => activeModuleIndex < modules.length - 1 && handleModuleChange(activeModuleIndex + 1)}
                  onPrevious={() => activeModuleIndex > 0 && handleModuleChange(activeModuleIndex - 1)}
                  isFirstModule={activeModuleIndex === 0}
                  isLastModule={activeModuleIndex === modules.length - 1}
                  isModuleCompleted={!!getProgress(modules[activeModuleIndex].module_id)?.completed}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No video available for this module.
              </p>
            )}

            <ModuleTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              moduleData={{
                ...modules[activeModuleIndex],
                module_description: modules[activeModuleIndex].module_description || "No description available",
                video: !!modules[activeModuleIndex].video, // Convert video to boolean
              }}
              progress={getProgress(modules[activeModuleIndex].module_id)}
            />
          </div>
        )}

        <ModuleSidebar 
          modules={modules.map((module) => ({
            ...module,
            module_title: module.module_title || "Untitled Module",
          }))}
          activeModuleIndex={activeModuleIndex}
          handleModuleChange={handleModuleChange}
          progressPercentage={progressPercentage}
          getProgress={getProgress}
        />
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <QuestionModal 
          isOpen={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
        />
      )}
    </div>
  );
}