import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/users/me");

        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const form = new URLSearchParams();

    form.append("username", email);
    form.append("password", password);

    const res = await api.post(
      "/auth/login",
      form,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = res.data.access_token;

    localStorage.setItem(
      "token",
      accessToken
    );

    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    setToken(accessToken);

    const userRes = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setUser(userRes.data);

    return userRes.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);
export { AuthContext }; // add this at the bottom