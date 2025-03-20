// lib/hooks/useQuestionStore.ts
import { create } from "zustand";

interface QuestionState {
  currentQuestionIndex: number;
  testStarted: boolean;
  testCompleted: boolean;
  setCurrentQuestionIndex: (index: number) => void;
  setTestStarted: (started: boolean) => void;
  setTestCompleted: (completed: boolean) => void;
}

export const useQuestionStore = create<QuestionState>((set) => ({
  currentQuestionIndex: 0,
  testStarted: false,
  testCompleted: false,

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setTestStarted: (started) => set({ testStarted: started }),
  setTestCompleted: (completed) => set({ testCompleted: completed }),
}));
