/* eslint-disable react-hooks/exhaustive-deps */
// components/Video.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoProgressStore } from "@/lib/store/useVideoProgressStore";
import { WifiOff } from "lucide-react";

interface VideoProps {
  src: string;
  height: string;
  width: string;
  className?: string;
  controls?: boolean;
  moduleId: string;
  onComplete?: () => void;
}

export function Video({
  src,
  height,
  width,
  className,
  controls = false,
  moduleId,
  onComplete,
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { updateProgress, markAsCompleted, getProgress } = useVideoProgressStore();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineSrc, setOfflineSrc] = useState<string | null>(null);
  
  // Handler for tracking video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set the initial time if there's saved progress
    const savedProgress = getProgress(moduleId);
    if (savedProgress && savedProgress.currentTime > 0) {
      video.currentTime = savedProgress.currentTime;
    }

    // Track video time updates in memory without disrupting playback
    let lastReportedTime = video.currentTime;
    const handleTimeUpdate = () => {
      // Only start timer once when video is playing
      if (video.paused || progressTimerRef.current) return;
      
      // Create a timer that saves progress every 5 seconds while playing
      progressTimerRef.current = setInterval(() => {
        if (!video.paused && Math.abs(video.currentTime - lastReportedTime) > 1) {
          lastReportedTime = video.currentTime;
          // Update progress without pausing playback
          updateProgress(moduleId, video.currentTime);
        }
      }, 5000);
    };

    // Clean up timer when video is paused
    const handlePause = () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      // Save progress when explicitly paused
      updateProgress(moduleId, video.currentTime);
    };

    // Track video completion
    const handleEnded = () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      markAsCompleted(moduleId);
      if (onComplete) {
        onComplete();
      }
    };
    
    // Start tracking when playing
    const handlePlay = () => {
      handleTimeUpdate();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("pause", handlePause);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
    };
  }, [moduleId, updateProgress, markAsCompleted, onComplete, getProgress]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check if video is already in cache when component mounts
  useEffect(() => {
    async function checkCache() {
      try {
        const cache = await caches.open('video-cache');
        const response = await cache.match(src);
        
        if (response) {
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          setOfflineSrc(objectURL);
        }
      } catch (error) {
        console.error("Failed to check cache:", error);
      }
    }
    
    checkCache();
    
    // Clean up object URL when component unmounts
    return () => {
      if (offlineSrc) {
        URL.revokeObjectURL(offlineSrc);
      }
    };
  }, [src, offlineSrc]);

  // Make sure to cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      
      // Save final progress when component unmounts
      const videoElement = videoRef.current;
      if (videoElement) {
        const currentTime = videoElement.currentTime; // Copy currentTime to a local variable
        updateProgress(moduleId, currentTime);
      }
    };
  }, [moduleId, updateProgress]);

  // Use the cached video if offline, otherwise use the original source
  const videoSource = (isOffline && offlineSrc) ? offlineSrc : src;
  
  return (
    <div className="relative">
      <video
        ref={videoRef}
        height={height}
        width={width}
        className={className}
        controls={controls}
        src={videoSource}
        playsInline
      />
      
      {isOffline && !offlineSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
          <div className="flex flex-col items-center">
            <WifiOff className="w-10 h-10 mb-2" />
            <p className="text-center">You&apos;re offline and this video isn&apos;t downloaded</p>
          </div>
        </div>
      )}
    </div>
  );
}