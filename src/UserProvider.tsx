import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Role } from "./config/menuConfig";

export interface UserContextType {
  userRole: Role | null;
  setUserRole: (role: Role | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storedRole = localStorage.getItem("userRole")?.toLowerCase() as Role | null;
  const [userRole, setUserRole] = useState<Role | null>(storedRole);

  useEffect(() => {
    const syncUserRole = () => {
      const role = localStorage.getItem("userRole")?.toLowerCase() as Role | null;
      setUserRole(role);
    };
    window.addEventListener("storage", syncUserRole);

    return () => {
      window.removeEventListener("storage", syncUserRole);
    };
  }, []);

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
