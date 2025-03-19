import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserContextType {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(() =>
    localStorage.getItem("userRole")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("userRole");
      setUserRole(updatedRole);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
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
