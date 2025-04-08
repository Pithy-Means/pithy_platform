"use client";

import { useVideoProgressStore } from "@/lib/store/useVideoProgressStore";
import { useEffect, useRef } from "react";

interface VideoProps {
  src: string;
  width: string;
  height: string;
  controls: boolean;
  className?: string;
  moduleId: string;
  onComplete?: () => void;
}

export const Video = ({
  src,
  width,
  height,
  controls,
  className,
  moduleId,
  onComplete,
}: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Import from the store we created
  const { updateProgress, getProgress, markAsCompleted } = useVideoProgressStore();
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Restore progress when component mounts or src changes
    const savedProgress = getProgress(moduleId);
    if (savedProgress) {
      videoElement.currentTime = savedProgress.currentTime;
    }
    
    // Handle video completion
    const handleEnded = () => {
      markAsCompleted(moduleId);
      if (onComplete) onComplete();
    };
    
    // Save progress every 10 seconds instead of on every frame to reduce writes
    const progressInterval = setInterval(() => {
      if (!videoElement.paused) {
        updateProgress(moduleId, videoElement.currentTime);
      }
    }, 10000);
    
    videoElement.addEventListener('ended', handleEnded);
    
    return () => {
      clearInterval(progressInterval);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [moduleId, src, updateProgress, getProgress, markAsCompleted, onComplete]);
  
  return (
    <video
      ref={videoRef}
      src={src}
      width={width}
      height={height}
      controls={controls}
      className={className}
    />
  );
};