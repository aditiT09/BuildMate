import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { getCurrentUser } from "../api/users";

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const login = (token) => {
    localStorage.setItem(
      "token",
      token
    );

    setToken(token);
    setLoading(true);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
    setLoading(false);
  };
useEffect(() => {
  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      console.log("Loading user...");

      const data =
        await getCurrentUser();

      console.log("User:", data);

      setUser(data);
    } catch (error) {
      console.error(
        "Failed loading user",
        error
      );

      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, [token]);

  return (
    <AuthContext.Provider
    value={{
  token,
  user,
  setUser,
  login,
  logout,
  loading,
}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);