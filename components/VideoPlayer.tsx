import { Video } from "./Video";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface ModuleData {
  video: string;
  module_id: string;
}

interface VideoPlayerProps {
  moduleData: ModuleData;
  onComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstModule: boolean;
  isLastModule: boolean;
  isModuleCompleted: boolean;
}

export default function VideoPlayer({
  moduleData,
  onComplete,
  onNext,
  onPrevious,
  isFirstModule,
  isLastModule,
  isModuleCompleted
}: VideoPlayerProps) {
  return (
    <>
      <Video
        height="100%"
        width="100%"
        src={moduleData.video}
        className="object-cover w-full h-full"
        controls={true}
        moduleId={moduleData.module_id}
        onComplete={onComplete}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-4">
        <button
          className="p-1 sm:p-2 bg-gray-200 bg-opacity-35 text-gray-700 rounded-full hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          onClick={onPrevious}
          disabled={isFirstModule}
        >
          <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-4">
        <button
          className="p-1 sm:p-2 bg-green-600 bg-opacity-35 text-white rounded-full hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          onClick={onNext}
          disabled={isLastModule || !isModuleCompleted}
        >
          <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </>
  );
}