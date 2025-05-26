import { createContext, useContext, useState } from "react";

interface AdminContextType {
  isAdmin: boolean;
  toggleAdmin: (password?: string) => void;
  showAdminPrompt: boolean;
  setShowAdminPrompt: (show: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false); // Default to user view
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  
  // In a real app, this would be more secure (e.g., API call to verify)
  const ADMIN_PASSWORD = "admin123"; // Change this to your desired password

  const toggleAdmin = (password?: string) => {
    if (isAdmin) {
      // If already admin, toggle back to user
      setIsAdmin(false);
      setShowAdminPrompt(false);
    } else {
      // If not admin, show password prompt
      if (password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setShowAdminPrompt(false);
      } else if (password === undefined) {
        // Show prompt if no password provided
        setShowAdminPrompt(true);
      } else {
        // Wrong password
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