// src/Contexts/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface UserContextType {
  users: User[];
  currentUser: User | null;
  registerUser: (user: User) => void;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load from storage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const storedCurrent = JSON.parse(sessionStorage.getItem("currentUser") || "null");
    setUsers(storedUsers);
    setCurrentUser(storedCurrent);
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [users, currentUser]);

  const registerUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  return (
    <UserContext.Provider value={{ users, currentUser, registerUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used inside a UserProvider");
  return ctx;
};
