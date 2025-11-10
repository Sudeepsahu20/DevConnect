import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/AxiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On app load, try to keep user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Optionally fetch current user profile from backend (if you have /auth/me or /profile/me)
    const fetchMe = async () => {
      try {
        const res = await axiosInstance.get("/profile/me"); // uses token via interceptor
        // profile.me returns profile with populated user
        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          // fallback: if backend returns user directly from /auth/me then adapt
          // setUser(res.data)
        }
      } catch (err) {
        console.log("Could not fetch user on load", err.message);
        localStorage.removeItem("token");
        setUser(null);
      }
    };
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    const { token, user: userFromRes } = res.data;
    localStorage.setItem("token", token);
    // set token in axiosInstance is via interceptor automatically
    setUser(userFromRes || null);
    return res;
  };

  const register = async (name, email, password) => {
    // Backend register earlier we used to return only msg, optionally token.
    const res = await axiosInstance.post("/auth/register", { name, email, password });
    // If backend returns token on register, handle similarly:
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user || null);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
