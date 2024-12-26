import { useEffect, useState } from "react";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { UserInfo } from "@/types/schema";

export const useLoggedInUser = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = await getLoggedInUser();
        setUser(loggedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user.");
      }
    };

    fetchUser();
  }, []);

  return { user, error };
};
