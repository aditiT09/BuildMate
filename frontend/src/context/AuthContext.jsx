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

  const login = (token) => {
    localStorage.setItem(
      "token",
      token
    );

    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };
useEffect(() => {
  const loadUser = async () => {
    try {
      if (!token) return;

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
  loading: false,
}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);