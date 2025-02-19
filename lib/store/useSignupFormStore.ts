import { create } from "zustand";
import { UserInfo } from "@/types/schema";
import { persist } from "zustand/middleware";

// Create Zustand store for form persistence
interface SignupFormState {
  formData: Partial<UserInfo>;
  currentStep: number;
  termsAgreed: boolean;
  updateFormData: (data: Partial<UserInfo>) => void;
  updateCurrentStep: (step: number) => void;
  updateTermsAgreed: (agreed: boolean) => void;
  resetForm: () => void;
}

export const useSignupFormStore = create<SignupFormState>()(
  persist(
    (set) => ({
      formData: {},
      currentStep: 0,
      termsAgreed: false,
      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data } as Partial<UserInfo>
      })),
      updateCurrentStep: (step) => set({ currentStep: step }),
      updateTermsAgreed: (agreed) => set({ termsAgreed: agreed }),
      resetForm: () => set({ formData: {}, currentStep: 0, termsAgreed: false }),
    }),
    {
      name: "signup-form-storage", // name of the item in localStorage
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
        termsAgreed: state.termsAgreed,
      }),
    }
  )
);