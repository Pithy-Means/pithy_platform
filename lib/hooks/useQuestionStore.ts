import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type QuestionStore = {
  currentQuestionIndex: number;
  testStarted: boolean;
  setCurrentQuestionIndex: (index: number) => void;
  setTestStarted: (started: boolean) => void;
};

export const useQuestionStore = create(
  persist<QuestionStore>(
    (set) => ({
      currentQuestionIndex: 0,
      testStarted: false,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setTestStarted: (started) => set({ testStarted: started }),
    }),
    {
      name: 'question-store', // Local storage key
    }
  )
);
