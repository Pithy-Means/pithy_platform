export default function ModuleTabs({ 
  activeTab, 
  setActiveTab, 
  moduleData, 
  progress,
}: {
  activeTab: string,
  setActiveTab: (tab: "summary" | "question") => void,            
  progress?: {
    completed?: boolean;
    currentTime?: number;
  };
  moduleData: {
    module_description: string;
    video?: boolean;
  };
}) {
  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex border-b-2 border-gray-200">
        <button
          className={`px-3 py-2 sm:px-6 sm:py-3 text-sm font-semibold transition-all duration-300 ease-in-out ${
            activeTab === "summary"
              ? "border-b-4 border-green-600 text-green-600"
              : "text-gray-600 hover:text-green-600"
          }`}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
        <button
          className={`px-3 py-2 sm:px-6 sm:py-3 text-sm font-semibold transition-all duration-300 ease-in-out ${
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
      <div className="mt-4 sm:mt-6 text-sm text-gray-700 space-y-4">
        {activeTab === "summary" ? (
          <div className="space-y-4">
            {/* Summary Content */}
            <p className="leading-relaxed">
              {moduleData.module_description}
            </p>
            
            {/* Show video progress indicator */}
            {moduleData.video && progress && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Your Progress</h3>
                <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ 
                      width: progress?.completed ? 
                        '100%' : 
                        progress?.currentTime ? 
                          `${Math.min((progress?.currentTime || 0) / (60 * 10) * 100, 99)}%` : 
                          '0%' 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {progress?.completed ? 'Completed' : 'In progress'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Question & Answers content would go here */}
            <p className="text-gray-700">
              Questions and answers related to this module will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}