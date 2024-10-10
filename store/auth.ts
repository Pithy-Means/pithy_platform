import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserInfo {
  reputation: number;
}

interface Student {
  level_of_study?: string;
  school?: string;
  major_subject?: string;
  expect_year_of_graduation?: string;
}

interface Job_seeker {
  current_job_title?: string;
  skills?: string[];
  industry?: string;
  years_of_experience?: string;
}

interface Employer {
  company_name?: string;
  company_size?: string;
  industry?: string;
  about_company?: string;
  position_in_company?: string;
  job_posted?: string;
}

interface Categories {
  Student?: Student[];
  Job_seeker?: Job_seeker[];
  Employer?: Employer[];
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserInfo> | null;
  hydrated: boolean;

  setHydrated(): void;

  verifySession(): Promise<void>;

  login(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;

  createAccount(
    firstname: string,
    lastname: string,
    address: string,
    phone: string,
    categories: Categories[],
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;

  logout(): Promise<void>;
}

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
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserInfo>(),
            account.createJWT(),
          ]);
          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserInfo>({ reputation: 0 });
          }
          set({ session, jwt, user });
          return { success: true };
        } catch (error) {
          console.error(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(
        firstname: string,
        lastname: string,
        address: string,
        phone: string,
        categories: Categories[],
        email: string,
        password: string
      ) {
        try {
          // Create a new account with Appwrite using email and password
          const user = await account.create(ID.unique(), email, password, `${firstname} ${lastname}`);

          // After account creation, update user preferences with additional information
          await account.updatePrefs({
            firstname,
            lastname,
            address,
            phone,
            categories
          });

          return {
            success: true,
          };
        } catch (error) {
          console.error(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
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
        };
      },
    },
  ),
);
