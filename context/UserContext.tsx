"use client";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { UserInfo } from "@/types/schema";
import React, { createContext, useEffect, useState } from "react";

interface UserContextValue {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Fetch user data from the server
      const loggedUser = await getLoggedInUser();
      setUser(loggedUser);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );  
};