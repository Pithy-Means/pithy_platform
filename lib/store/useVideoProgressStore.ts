// lib/store/useVideoProgressStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VideoProgress {
  moduleId: string;
  currentTime: number;
  completed: boolean;
  lastUpdated: number;
  pendingSync?: boolean;
}

interface VideoProgressState {
  progresses: Record<string, VideoProgress>;
  updateProgress: (moduleId: string, currentTime: number) => void;
  markAsCompleted: (moduleId: string) => void;
  getProgress: (moduleId: string) => VideoProgress | undefined;
  getPendingSyncs: () => VideoProgress[];
  markSynced: (moduleId: string) => void;
  syncWithServer: () => Promise<void>;
}

export const useVideoProgressStore = create<VideoProgressState>()(
  persist(
    (set, get) => ({
      progresses: {},
      
      updateProgress: (moduleId, currentTime) => {
        const isOnline = navigator.onLine;
        
        set((state) => {
          // If current progress exists and is greater, don't overwrite
          const existingProgress = state.progresses[moduleId];
          if (existingProgress && existingProgress.currentTime > currentTime) {
            return state;
          }
          
          return {
            progresses: {
              ...state.progresses,
              [moduleId]: {
                moduleId,
                currentTime,
                completed: existingProgress?.completed || false,
                lastUpdated: Date.now(),
                pendingSync: !isOnline // Mark for sync if offline
              },
            }
          };
        });
        
        // Try to sync immediately if online
        if (isOnline) {
          get().syncWithServer();
        } 
        // Request background sync if offline
        // else if ('serviceWorker' in navigator && 'SyncManager' in window) {
        //   navigator.serviceWorker.ready
        //     .then(registration => registration.sync.register('sync-progress'))
        //     .catch(err => console.error('Background sync registration failed:', err));
        // }
      },
      
      markAsCompleted: (moduleId) => {
        const isOnline = navigator.onLine;
        
        set((state) => ({
          progresses: {
            ...state.progresses,
            [moduleId]: {
              moduleId,
              currentTime: state.progresses[moduleId]?.currentTime || 0,
              completed: true,
              lastUpdated: Date.now(),
              pendingSync: !isOnline // Mark for sync if offline
            },
          },
        }));
        
        // Try to sync immediately if online
        if (isOnline) {
          get().syncWithServer();
        } 
        // Request background sync if offline
        // else if ('serviceWorker' in navigator && 'SyncManager' in window) {
        //   navigator.serviceWorker.ready
        //     .then(registration => registration.sync.register('sync-progress'))
        //     .catch(err => console.error('Background sync registration failed:', err));
        // }
      },
      
      getProgress: (moduleId) => {
        return get().progresses[moduleId];
      },
      
      getPendingSyncs: () => {
        return Object.values(get().progresses).filter(progress => progress.pendingSync);
      },
      
      markSynced: (moduleId) => {
        set((state) => ({
          progresses: {
            ...state.progresses,
            [moduleId]: {
              ...state.progresses[moduleId],
              pendingSync: false
            },
          },
        }));
      },
      
      syncWithServer: async () => {
        const pendingSyncs = get().getPendingSyncs();
        
        if (pendingSyncs.length === 0) return;
        
        try {
          const response = await fetch('/api/sync-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates: pendingSyncs })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to sync: ${response.status}`);
          }
          
          const result = await response.json();
          
          // Mark all successfully synced items
          if (result.results) {
            result.results.forEach((item: { moduleId: string, status: string }) => {
              if (item.status === 'created' || item.status === 'updated') {
                get().markSynced(item.moduleId);
              }
            });
          }
        } catch (error) {
          console.error('Failed to sync progress with server:', error);
          // Don't mark as synced - will retry later
        }
      }
    }),
    {
      name: 'video-progress-storage',
    }
  )
);

// Add event listener to sync pending updates when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    const store = useVideoProgressStore.getState();
    store.syncWithServer();
  });
}