"use client";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

interface Video {
  src: string;
  subtitles?: string; // URL to subtitle file (.vtt)
  controls?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  key?: string;
}

export function Video({ src, subtitles, width, height }: Video) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden">
      {!isPlaying && (
        <div className="absolute inset-0 bg-cover bg-center bg-black bg-opacity-50"></div>
      )}
      <video
        ref={videoRef}
        preload="metadata"
        className={`w-full h-auto ${
          isPlaying ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        width={width}
        height={height}
        src={src}
        onClick={handlePlay}
        key={src}
      >
        {subtitles && (
          <track
            src={subtitles} // The URL to the subtitle file
            kind="subtitles"
            srcLang="en" // Language of the subtitles (e.g., English)
            label="English" // Label for the track
            default // Enable subtitles by default
          />
        )}
      </video>
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <button
          onClick={handlePlay}
          className="p-4 bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-opacity-90"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </button>
      </div>
    </div>
  );
}
