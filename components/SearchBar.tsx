import React from 'react';

interface SearchBarProps {
  searchTitle: string;
  setSearchTitle: (value: string) => void;
  searchArea: string;
  setSearchArea: (value: string) => void;
  onSearch: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTitle,
  setSearchTitle,
  searchArea,
  setSearchArea,
  onSearch,
  onKeyDown,
  isDisabled = false
}) => {
  return (
    <div className="mb-10 max-w-2xl mx-auto">
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        {/* Title/Donor Search */}
        <div className="relative flex-grow">
          <label htmlFor="funding-title-search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Title or Donor
          </label>
          <input
            id="funding-title-search"
            type="text"
            placeholder="Enter title or donor name..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isDisabled}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Focus Area Search */}
        <div className="relative flex-grow">
          <label htmlFor="funding-area-search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Focus Area
          </label>
          <input
            id="funding-area-search"
            type="text"
            placeholder="Enter focus area..."
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isDisabled}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center">
        <button
          onClick={onSearch}
          disabled={isDisabled}
          className={`
            px-8 py-3 font-semibold rounded-lg shadow-lg transition duration-200 ease-in-out
            ${isDisabled 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
            }
            text-white w-full md:w-auto
          `}
        >
          {isDisabled ? 'Searching...' : 'Search Fundings'}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;