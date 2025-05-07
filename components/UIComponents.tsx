import React from 'react';

interface MessageProps {
  message: string;
}

export const LoadingIndicator = ({ message = "Loading Fundings..." }: { message?: string }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50 backdrop-blur-sm" 
       aria-live="polite" 
       aria-busy="true">
    <div className="flex flex-col items-center">
      {/* Modern spinner */}
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-green-700 text-lg font-semibold">{message}</p>
    </div>
  </div>
);

export const ErrorMessage = ({ message }: MessageProps) => (
  <div className="text-center py-12 px-6 bg-red-50 border border-red-300 rounded-lg shadow-md">
    <p className="text-red-700 text-lg font-medium">
      {message}
    </p>
    <p className="mt-2 text-red-600 text-sm">Please try refreshing the page.</p>
  </div>
);

export const NoDataMessage = ({ message }: MessageProps) => (
  <div className="text-center py-12 px-6 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
    <p className="text-gray-700 text-xl font-medium">{message}</p>
  </div>
);

// More UI components can be added here as needed
export const EmptySearchResults = ({ searchTitle, searchArea }: { searchTitle: string, searchArea: string }) => {
  let message = "No fundings found";
  
  if (searchTitle && searchArea) {
    message += ` matching title "${searchTitle}" and area "${searchArea}"`;
  } else if (searchTitle) {
    message += ` matching title "${searchTitle}"`;
  } else if (searchArea) {
    message += ` matching area "${searchArea}"`;
  }
  
  return <NoDataMessage message={message} />;
};

export const FilterTag = ({ 
  label, 
  value, 
  onRemove 
}: { 
  label: string; 
  value: string; 
  onRemove: () => void 
}) => (
  <div className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
    <span className="font-medium mr-1">{label}:</span>
    <span>{value}</span>
    <button 
      onClick={onRemove}
      className="ml-2 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
);