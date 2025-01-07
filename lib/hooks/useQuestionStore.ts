import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type QuestionStore = {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
};

export const useQuestionStore = create(
  persist<QuestionStore>(
    (set) => ({
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
    }),
    {
      name: 'question-store', // Local storage key
    }
  )
);
