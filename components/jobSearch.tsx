"use client";

import React, { useState } from "react";
import { searchJobs } from "@/lib/actions/user.actions";
import { Job } from "@/types/schema";
import { Search, MapPin, Building, ChevronDown, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface JobSearchProps {
  onSearchResults: (jobs: Job[]) => void;
  setLoading: (loading: boolean) => void;
}

const JobSearch = ({ onSearchResults, setLoading }: JobSearchProps) => {
  const [country, setCountry] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Handle search submission
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!country && !location && !title) {
      toast.error("Please enter at least one search criteria");
      return;
    }
    
    setLoading(true);
    try {
      const results = await searchJobs(country, location, title);
      onSearchResults(results);
      toast.success(`Found ${results.length} matching positions`);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset search fields and trigger refetch of all jobs
  const handleReset = () => {
    setCountry("");
    setLocation("");
    setTitle("");
    setLoading(true);
    // Trigger search with no params to get all jobs
    searchJobs().then(results => {
      onSearchResults(results);
      toast.success("Search reset");
      setLoading(false);
    }).catch(error => {
      console.error("Reset failed:", error);
      toast.error("Reset failed. Please try again.");
      setLoading(false);
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto mb-12 animate-fadeIn">
      {/* Search bar container */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-800 hover:border-green-900 transition-all duration-300 shadow-lg">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-green-500 rounded-2xl opacity-5 filter blur-xl"></div>
        
        {/* Circuit pattern (decorative) */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-green-400"></div>
          <div className="absolute top-0 left-0 w-[1px] h-full bg-green-400"></div>
          <div className="absolute top-1/3 right-0 w-[1px] h-2/3 bg-green-400"></div>
          <div className="absolute bottom-0 left-1/4 w-3/4 h-[1px] bg-green-400"></div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-green-400"></div>
        </div>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Main search bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-green-400" />
              </div>
              <input
                type="text"
                placeholder="Search job titles, keywords, or skills..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black bg-opacity-50 border border-gray-800 focus:border-green-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-30 transition-all duration-300"
              />
            </div>
            
            {/* Search button */}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="relative px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg text-white font-medium transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-black bg-opacity-20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center justify-center">
                  Search Jobs
                </span>
              </button>
              
              {/* Advanced search toggle */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-4 py-3 bg-black bg-opacity-50 border border-gray-800 hover:border-green-700 rounded-lg text-white transition-all duration-300"
              >
                <ChevronDown
                  className={`h-5 w-5 text-green-400 transform transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
          
          {/* Advanced search fields */}
          {isExpanded && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              {/* Country selector */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-green-400" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Country of work"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-black bg-opacity-50 border border-gray-800 focus:border-green-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-30 transition-all duration-300"
                  />
                  {country && (
                    <button
                      type="button"
                      onClick={() => setCountry("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-white" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Location field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-green-400" />
                </div>
                <input
                  type="text"
                  placeholder="City or region"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-black bg-opacity-50 border border-gray-800 focus:border-green-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-30 transition-all duration-300"
                />
                {location && (
                  <button
                    type="button"
                    onClick={() => setLocation("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
              
              {/* Reset button */}
              <div className="md:col-span-2 flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-green-400 hover:text-green-300 flex items-center space-x-1 transition-colors duration-300"
                >
                  <X className="h-4 w-4" />
                  <span>Reset filters</span>
                </button>
              </div>
            </div>
          )}
        </form>
        
        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
      </div>
    </div>
  );
};

export default JobSearch;