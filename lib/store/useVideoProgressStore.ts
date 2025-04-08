// src/store/useVideoProgressStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VideoProgress {
  moduleId: string;
  currentTime: number;
  completed: boolean;
}

interface VideoProgressState {
  progresses: Record<string, VideoProgress>;
  updateProgress: (moduleId: string, currentTime: number) => void;
  markAsCompleted: (moduleId: string) => void;
  getProgress: (moduleId: string) => VideoProgress | undefined;
}

export const useVideoProgressStore = create<VideoProgressState>()(
  persist(
    (set, get) => ({
      progresses: {},
      
      updateProgress: (moduleId, currentTime) => {
        set((state) => ({
          progresses: {
            ...state.progresses,
            [moduleId]: {
              moduleId,
              currentTime,
              completed: state.progresses[moduleId]?.completed || false,
            },
          },
        }));
      },
      
      markAsCompleted: (moduleId) => {
        set((state) => ({
          progresses: {
            ...state.progresses,
            [moduleId]: {
              moduleId,
              currentTime: state.progresses[moduleId]?.currentTime || 0,
              completed: true,
            },
          },
        }));
      },
      
      getProgress: (moduleId) => {
        return get().progresses[moduleId];
      },
    }),
    {
      name: 'video-progress-storage',
    }
  )
);