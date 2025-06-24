import { create } from "zustand";

interface CourseState {
  // User-specific purchased courses mapping
  userPurchases: Record<string, string[]>; // userId -> array of courseIds
  setUserCoursePurchase: (
    userId: string,
    courseId: string,
    isPurchased: boolean,
  ) => void;
  isCoursePurchased: (userId: string | undefined, courseId: string) => boolean;
  clearUserPurchases: (userId: string) => void;
  syncPurchasesFromServer: (userId: string) => Promise<void>;
  // Add a method to get all purchases for debugging
  getUserPurchases: (userId: string) => string[];
}

// Load persisted course purchase state from localStorage with user-specific keys
const loadPersistedCourseState = (): {
  userPurchases: Record<string, string[]>;
} => {
  if (typeof window !== "undefined") {
    try {
      const storedValue = localStorage.getItem("userCoursePurchases");
      const parsed = storedValue ? JSON.parse(storedValue) : {};
      console.log("Loaded persisted course purchases:", parsed);
      return {
        userPurchases: parsed,
      };
    } catch (error) {
      console.error("Failed to load persisted course purchase state:", error);
      return { userPurchases: {} };
    }
  }
  return { userPurchases: {} };
};

export const useCourseStore = create<CourseState>((set, get) => ({
  ...loadPersistedCourseState(),

  setUserCoursePurchase: (
    userId: string,
    courseId: string,
    isPurchased: boolean,
  ) => {
    if (!userId || !courseId) {
      console.error("Invalid userId or courseId provided");
      return;
    }

    console.log(`Setting course purchase: User ${userId}, Course ${courseId}, Purchased: ${isPurchased}`);

    set((state) => {
      // Get current user's purchases or initialize empty array
      const userCourses = state.userPurchases[userId] || [];
      let updatedUserCourses: string[];

      if (isPurchased) {
        // Add course to user's purchased list if not already there
        updatedUserCourses = userCourses.includes(courseId)
          ? userCourses
          : [...userCourses, courseId];
      } else {
        // Remove course from user's purchased list
        updatedUserCourses = userCourses.filter((id) => id !== courseId);
      }

      // Create new userPurchases object with updated courses for this user
      const updatedUserPurchases = {
        ...state.userPurchases,
        [userId]: updatedUserCourses,
      };

      // Persist to localStorage immediately
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "userCoursePurchases",
            JSON.stringify(updatedUserPurchases),
          );
          console.log("Successfully persisted to localStorage:", updatedUserPurchases);
        } catch (error) {
          console.error("Failed to persist to localStorage:", error);
        }
      }

      console.log("Updated user purchases:", updatedUserPurchases);
      return { userPurchases: updatedUserPurchases };
    });
  },

  isCoursePurchased: (userId: string | undefined, courseId: string) => {
    if (!userId || !courseId) {
      console.log("Missing userId or courseId for purchase check");
      return false;
    }

    const userCourses = get().userPurchases[userId] || [];
    const isPurchased = userCourses.includes(courseId);

    console.log(`Checking if course ${courseId} is purchased by user ${userId}:`, isPurchased);
    console.log("User's purchased courses:", userCourses);

    return isPurchased;
  },

  getUserPurchases: (userId: string) => {
    if (!userId) return [];
    return get().userPurchases[userId] || [];
  },

  clearUserPurchases: (userId: string) => {
    if (!userId) return;

    set((state) => {
      const updatedUserPurchases = { ...state.userPurchases };
      delete updatedUserPurchases[userId];

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "userCoursePurchases",
            JSON.stringify(updatedUserPurchases),
          );
        } catch (error) {
          console.error("Failed to persist after clearing:", error);
        }
      }

      return { userPurchases: updatedUserPurchases };
    });
  },

  // Function to sync purchases from server after login
  syncPurchasesFromServer: async (userId: string) => {
    if (!userId) {
      console.error("No userId provided for sync");
      return;
    }

    console.log(`Syncing purchases from server for user: ${userId}`);

    try {
      // Fetch user's purchased courses from server
      const response = await fetch(
        `/api/user/purchased-courses?userId=${userId}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user's purchased courses: ${response.status}`);
      }

      const data = await response.json();
      console.log("Server response for purchased courses:", data);

      // Handle different response formats
      let purchasedCourseIds: string[] = [];

      if (data.courses && Array.isArray(data.courses)) {
        purchasedCourseIds = data.courses.map((course: Record<string, unknown>) => {
          // Handle different possible field names
          return course.course_id || course.courseId || course.id || String(course);
        }).filter(Boolean); // Remove any undefined/null values
      } else if (Array.isArray(data)) {
        purchasedCourseIds = data.map((course: Record<string, unknown>) => {
          return String(course.course_id || course.courseId || course.id || course);
        }).filter((id) => typeof id === "string" && id.length > 0);
      }

      console.log("Extracted course IDs from server:", purchasedCourseIds);

      // Update the store with fetched courses
      set((state) => {
        const updatedUserPurchases = {
          ...state.userPurchases,
          [userId]: purchasedCourseIds,
        };

        // Persist to localStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "userCoursePurchases",
              JSON.stringify(updatedUserPurchases),
            );
            console.log("Successfully synced and persisted purchases:", updatedUserPurchases);
          } catch (error) {
            console.error("Failed to persist synced purchases:", error);
          }
        }

        return { userPurchases: updatedUserPurchases };
      });
    } catch (error) {
      console.error("Error syncing purchases from server:", error);
      throw error; // Re-throw so calling code can handle it
    }
  },
}));