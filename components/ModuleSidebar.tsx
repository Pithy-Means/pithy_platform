/* eslint-disable @typescript-eslint/no-unused-vars */
import { Lock, CheckCircle } from "lucide-react";

interface Module {
  module_id: string;
  module_title: string;
}

export default function ModuleSidebar({
  modules,
  activeModuleIndex,
  handleModuleChange,
  progressPercentage,
  getProgress
}: {
  modules: Module[];
  activeModuleIndex: number;
  handleModuleChange: (index: number) => void;
  progressPercentage: number;
  getProgress: (moduleId: string) => { completed?: boolean; currentTime?: number } | undefined;
}) {
  return (
    <div className="w-full xl:w-80 mt-6 xl:mt-0">
      {/* Course Progress Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 h-96 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800">
          Entrepreneurship in East Africa - Case Study UG
        </h2>
        <p className="text-sm text-green-600 mt-2">
          Progress: {progressPercentage.toFixed(2)}%
        </p>
        <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
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
                className={`flex items-center gap-2 sm:gap-3 ${
                  isUnlocked
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                }`}
                onClick={() =>
                  isUnlocked && handleModuleChange(index)
                }
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                ) : isUnlocked ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-green-600 rounded-full flex items-center justify-center">
                    {(progress?.currentTime ?? 0) > 0 && (
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    )}
                  </div>
                ) : (
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                )}
                <span
                  className={`text-xs sm:text-sm ${
                    isUnlocked
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {module.module_title}
                  {progress && (progress.currentTime ?? 0) > 0 && !isCompleted && (
                    <span className="text-xs text-green-600 ml-1 sm:ml-2">
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
  );
}