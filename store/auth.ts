import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";


export interface UserInfo {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserInfo> | null;
  hydrated: boolean;

  setHydrated(): void;

  verifySession(): Promise<void>;

  login(email: string, password: string): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;

  createAccount(name: string, email: string, password: string): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  
  logout(): Promise<void>;
};

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error) {
          console.error(error);
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(email, password);
          const [user, {jwt}] = await Promise.all([
            account.get<UserInfo>(),
            account.createJWT()
          ]);
          if (!user.prefs?.reputation) {await account.updatePrefs<UserInfo>({ reputation: 0 });}
          set({ session, jwt, user });
          return { success: true };
        } catch (error) {
          console.error(error);
          return { success: false, error: error instanceof AppwriteException ? error : null };
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return {
            success: true
          }
        } catch (error) {
          console.error(error);
          return { success: false, error: error instanceof AppwriteException ? error : null };
        }
      },

      async logout() {
        try {
          await account.deleteSession("current");
          set({ session: null, jwt: null, user: null });
        } catch (error) {
          console.error(error);          
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        }
      }
    }
  )
);