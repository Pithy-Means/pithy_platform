"use client";

import React, { useEffect, useState } from "react";
import { getJobs } from "@/lib/actions/user.actions";
import { Job } from "@/types/schema";
import { useRouter } from "next/navigation";
import { FaBlackTie } from "react-icons/fa6";
import { FaMarker } from "react-icons/fa";
import { CalendarCheck, ChevronRight, Zap } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobs();
        toast.success("Jobs fetched successfully");
        setJobs(data.documents || []);
      } catch (err) {
        toast.error("Failed to fetch jobs. Please try again.");
        setError("Failed to fetch jobs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="w-full p-4 md:p-8 min-h-screen">
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(0, 20, 0, 0.9)',
            color: '#10ff10',
            border: '1px solid #0f0',
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
          },
        }}
      />
      
      <div className="w-full max-w-7xl mx-auto relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full filter blur-3xl opacity-5 animate-pulse"></div>
        
        {loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 backdrop-blur-sm z-50">
            <div className="relative">
              {/* Glowing circle */}
              <div className="absolute inset-0 bg-green-500 rounded-full filter blur-md animate-pulse"></div>
              
              {/* Spinning loader */}
              <div className="relative z-10 w-24 h-24">
                <div className="absolute inset-0 border-4 border-t-green-400 border-r-transparent border-b-green-200 border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-t-transparent border-r-green-400 border-b-transparent border-l-green-200 rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-4 border-t-green-200 border-r-transparent border-b-green-400 border-l-transparent rounded-full animate-spin animation-delay-150"></div>
              </div>
              
              <p className="mt-8 text-green-400 font-medium tracking-wider animate-pulse text-center">
                SCANNING DATABASE<span className="animate-ping">...</span>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-red-700 text-red-100 px-6 py-4 rounded-lg relative mb-8 animate-slideInDown">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center mr-3">
                <span className="text-white">⚠️</span>
              </div>
              <p>{error}</p>
            </div>
          </div>
        )}

        {jobs.length > 0 ? (
          <>
            <header className="text-center mb-16 relative animate-fadeIn">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full filter blur-3xl opacity-5 animate-pulse pointer-events-none"></div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white relative inline-block">
                <span className="bg-gradient-to-r from-green-300 via-green-400 to-green-200 bg-clip-text text-transparent">
                  NEXT-GEN CAREER PORTAL
                </span>
                <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-300"></div>
                <div className="absolute -bottom-3 left-0 w-16 h-1 bg-green-400 animate-pulse"></div>
              </h1>
              
              <p className="text-green-50 mt-6 max-w-2xl mx-auto text-lg opacity-80">
                Explore cutting-edge opportunities engineered for the professionals of tomorrow
              </p>
              
              <div className="mt-4 flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-green-500 opacity-75 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                ))}
              </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 w-full mx-auto">
              {jobs.map((job, index) => (
                <div 
                  key={job.job_id} 
                  className="group relative perspective-1000"
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-green-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 transform ${hoverIndex === index ? 'scale-105' : 'scale-100'}`}></div>
                  
                  {/* Main card */}
                  <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden group-hover:shadow-xl group-hover:shadow-green-600/20 transition-all duration-500 transform group-hover:scale-[1.02] border border-gray-800 group-hover:border-green-900 h-full">
                    {/* Ambient lighting effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-green-400/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 via-green-400 to-green-300 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-1000"></div>
                      <div className="absolute inset-[1px] rounded-2xl bg-gray-900"></div>
                    </div>
                    
                    {/* Top bar design */}
                    <div className="relative bg-gradient-to-r from-green-900/40 to-gray-900 h-2">
                      <div className="absolute left-0 top-0 h-2 w-1/4 bg-gradient-to-r from-green-400 to-green-300 rounded-tr-lg"></div>
                    </div>
                    
                    {/* Card content container */}
                    <div className="relative backdrop-blur-sm p-6 md:p-8 z-10">
                      {/* Tech circuit lines (decorative) */}
                      <div className="absolute top-6 right-6 w-32 h-32 opacity-5 group-hover:opacity-10">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-green-400"></div>
                        <div className="absolute top-0 left-0 w-[1px] h-full bg-green-400"></div>
                        <div className="absolute top-8 left-8 w-full h-[1px] bg-green-400"></div>
                        <div className="absolute top-8 left-8 w-[1px] h-full bg-green-400"></div>
                        <div className="absolute top-16 left-0 w-1/2 h-[1px] bg-green-400"></div>
                        <div className="absolute top-0 left-16 w-[1px] h-1/2 bg-green-400"></div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-6 right-6 px-3 py-1 text-xs font-bold uppercase bg-black bg-opacity-60 backdrop-blur-md rounded-lg border border-green-900 group-hover:border-green-500 transition-colors duration-300 z-20">
                        <div className="flex items-center space-x-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-green-300 tracking-wider">ACTIVE</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-6">
                        {/* Title with hovering bracket */}
                        <div className="group-hover:translate-x-1 transition-transform duration-300 flex items-center space-x-3">
                          <div className="h-10 w-1 bg-gradient-to-b from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div>
                            <h2 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                              {job.job_title || "Untitled Position"}
                            </h2>
                            <div className="h-px w-16 bg-green-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>
                        </div>

                        {/* Holographic description */}
                        <div className="relative px-4 py-3 bg-black bg-opacity-20 border-l-2 border-green-800 group-hover:border-green-500 rounded backdrop-blur-sm transition-all duration-300">
                          <p className="text-sm text-gray-300 group-hover:text-green-50 leading-relaxed pr-4">
                            {job.job_description.slice(0, 100) + "..."}
                          </p>
                          <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-green-500/10 to-transparent opacity-0 group-hover:opacity-100"></div>
                        </div>
                        
                        {/* Details with tech icons */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center space-x-4 group-hover:translate-x-1 transition-transform duration-300 delay-100">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black bg-opacity-50 border border-gray-800 group-hover:border-green-700 flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                              <FaBlackTie className="text-green-400 z-10" size={20} />
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">EMPLOYER</span>
                              <p className="text-sm font-semibold text-white group-hover:text-green-200 transition-colors duration-300">{job.employer || "Not specified"}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 group-hover:translate-x-1 transition-transform duration-300 delay-150">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black bg-opacity-50 border border-gray-800 group-hover:border-green-700 flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                              <FaMarker className="text-green-400 z-10" size={20} />
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">LOCATION</span>
                              <p className="text-sm font-semibold text-white group-hover:text-green-200 transition-colors duration-300">{job.country_of_work || "Not specified"}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 group-hover:translate-x-1 transition-transform duration-300 delay-200">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black bg-opacity-50 border border-gray-800 group-hover:border-green-700 flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                              <CalendarCheck className="text-green-400 z-10" size={20} /></div>
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">CLOSING DATE</span>
                              <p className="text-sm font-semibold text-white group-hover:text-green-200 transition-colors duration-300">{job.closing_date || "Not specified"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Ultra-futuristic button */}
                        <button
                          onClick={() => router.push(`/dashboard/jobs/${job.job_id}`)}
                          className="relative w-full py-3 mt-4 rounded-lg bg-black bg-opacity-40 border border-gray-800 group-hover:border-green-600 text-white font-medium overflow-hidden transition-all duration-500 group-hover:shadow-lg group-hover:shadow-green-500/20"
                        >
                          {/* Button glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                          
                          {/* Button background */}
                          <div className="absolute inset-[1px] bg-gradient-to-r from-gray-900 to-black rounded-md z-0 group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-gray-900 transition-all duration-500"></div>
                          
                          {/* Animated highlight */}
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                          
                          {/* Button text */}
                          <div className="relative z-10 flex items-center justify-center space-x-2 text-gray-100 group-hover:text-green-300 transition-colors duration-300">
                            <Zap size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span>View Position Details</span>
                            <ChevronRight size={16} className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    {/* Bottom bar design */}
                    <div className="relative bg-gradient-to-r from-gray-900 to-green-900/40 h-2">
                      <div className="absolute right-0 bottom-0 h-2 w-1/4 bg-gradient-to-l from-green-400 to-green-500 rounded-tl-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          !loading && (
            <div className="flex flex-col justify-center items-center py-32 text-center">
              <div className="relative w-24 h-24 mb-8">
                {/* Concentric circles animation */}
                <div className="absolute inset-0 border-2 border-dashed border-green-500 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 border-2 border-dashed border-green-400 rounded-full animate-spin-slow animate-reverse"></div>
                <div className="absolute inset-8 border-2 border-dashed border-green-300 rounded-full animate-spin-slow"></div>
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black bg-opacity-60 border border-green-500 flex items-center justify-center">
                    <Zap size={20} className="text-green-400" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">No Positions Available</h3>
              <p className="text-green-400 font-medium">Our AI is actively scanning for new opportunities</p>
              <p className="text-gray-400 mt-2 max-w-md">The matching algorithm is calibrating to your profile. Check back soon for personalized recommendations.</p>
              
              {/* Progress bar */}
              <div className="w-64 h-1 bg-gray-800 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-300 w-1/3 animate-pulse"></div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Add these animations to your global CSS or tailwind config
// @keyframes spin-slow {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }
// @keyframes reverse {
//   from { transform: rotate(360deg); }
//   to { transform: rotate(0deg); }
// }
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
// @keyframes slideInDown {
//   from { transform: translateY(-10px); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// }

export default JobList;