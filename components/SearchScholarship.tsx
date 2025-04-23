"use client";

import { useState } from "react";
import { getScholarships, searchScholarships } from "@/lib/actions/user.actions";
import { Scholarship } from "@/types/schema";

// List of common disciplines for the dropdown
const DISCIPLINES = [
  "Engineering",
  "Medicine",
  "Business",
  "Computer Science",
  "Arts",
  "Humanities",
  "Social Sciences",
  "Natural Sciences",
  "Law",
  "Education",
  "Other"
];

// List of study levels
const STUDY_LEVELS = [
  "Undergraduate",
  "Masters",
  "PhD",
  "Postdoctoral",
  "Professional",
  "Certificate",
  "Diploma"
];

// Popular countries for studying abroad
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Singapore",
  "Netherlands",
  "Other"
];

type SearchScholarshipProps = {
  onSearchResults: (results: Scholarship[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const SearchScholarship = ({ onSearchResults, setLoading, setError }: SearchScholarshipProps) => {
  // Search parameters
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [countryOfStudy, setCountryOfStudy] = useState("");
  
  // Advanced search toggle
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Only include non-empty parameters
      const searchParams: Record<string, string> = {};
      if (title) searchParams.title = title;
      if (provider) searchParams.provider = provider;
      if (studyLevel) searchParams.study_level = studyLevel;
      if (discipline) searchParams.discipline = discipline;
      if (countryOfStudy) searchParams.country_of_study = countryOfStudy;
      
      // If no search params, fetch all scholarships
      let results;
      if (Object.keys(searchParams).length === 0) {
        results = await getScholarships();
      } else {
        results = await searchScholarships(searchParams);
      }
      
      onSearchResults(results.documents || []);
      setLoading(false);
    } catch (err) {
      setError("Search failed. Please try again.");
      setLoading(false);
    }
  };
  
  // Reset all search fields
  const handleReset = () => {
    setTitle("");
    setProvider("");
    setStudyLevel("");
    setDiscipline("");
    setCountryOfStudy("");
    
    // Fetch all scholarships when filter is reset
    const fetchAllScholarships = async () => {
      setLoading(true);
      try {
        const results = await getScholarships();
        onSearchResults(results.documents || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to reset search. Please try again.");
        setLoading(false);
      }
    };
    
    fetchAllScholarships();
  };

  return (
    <div className="w-full mb-12 bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-green-200">
      <form onSubmit={handleSearch} className="space-y-4 text-black">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Main search field */}
          <div className="flex-1">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Scholarship Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Search by scholarship title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>
          
          {/* Provider field (always visible) */}
          <div className="flex-1">
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <input
              type="text"
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="University or organization..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>
          
          {/* Search and Advanced toggle buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Search
            </button>
            
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-3 border border-green-500 text-green-700 font-medium rounded-lg hover:bg-green-50 transition-all duration-300"
            >
              {showAdvanced ? "Basic" : "Advanced"}
            </button>
          </div>
        </div>
        
        {/* Advanced search fields */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
            {/* Study Level */}
            <div>
              <label htmlFor="studyLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Study Level
              </label>
              <select
                id="studyLevel"
                value={studyLevel}
                onChange={(e) => setStudyLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Any Level</option>
                {STUDY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Discipline */}
            <div>
              <label htmlFor="discipline" className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study
              </label>
              <select
                id="discipline"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Any Discipline</option>
                {DISCIPLINES.map((disc) => (
                  <option key={disc} value={disc}>
                    {disc}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Country of Study */}
            <div>
              <label htmlFor="countryOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                Country of Study
              </label>
              <select
                id="countryOfStudy"
                value={countryOfStudy}
                onChange={(e) => setCountryOfStudy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Any Country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* Reset button (only shown when at least one filter is active) */}
        {(title || provider || studyLevel || discipline || countryOfStudy) && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center"
            >
              <span className="mr-1">Clear all filters</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchScholarship;