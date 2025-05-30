import { createContext, useContext, useState } from "react";

interface AdminContextType {
  isAdmin: boolean;
  toggleAdmin: (password?: string) => void;
  showAdminPrompt: boolean;
  setShowAdminPrompt: (show: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  
  const ADMIN_PASSWORD = "admin123";

  const toggleAdmin = (password?: string) => {
    if (isAdmin) {
      setIsAdmin(false);
      setShowAdminPrompt(false);
    } else {
      if (password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setShowAdminPrompt(false);
      } else if (password === undefined) {
        setShowAdminPrompt(true);
      } else {
        alert("Incorrect admin password");
        setShowAdminPrompt(false);
      }
    }
  };

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      toggleAdmin,
      showAdminPrompt,
      setShowAdminPrompt
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminContext must be used inside AdminProvider");
  return context;
};