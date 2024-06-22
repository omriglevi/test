
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./use-storage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);
  const [username, setUsername] = useLocalStorage("token", null);
  const navigate = useNavigate();


  const login = async ({
    username,
    user,
    token
  }) => {
    setUser(user);
    setToken(token);
    setUsername(username);
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUsername(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      username,
      login,
      logout,
    }),[user, token, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
