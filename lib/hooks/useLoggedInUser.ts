"use client";

import { useEffect, useRef, useState } from "react";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { UserInfo } from "@/types/schema";

export const useLoggedInUser = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const loggedUser = await getLoggedInUser();
        setUser(loggedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  return { user, error, loading };
};
