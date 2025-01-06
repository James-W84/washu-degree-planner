import { useState, useEffect, useContext, createContext } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const initializeUser = async () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  };

  useEffect(() => {
    initializeUser();
  }, []);

  const login = async (user) => {
    sessionStorage.setItem("user", user);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <SessionContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
