
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./use-storage";
import Cookies from 'universal-cookie';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [username, setUsername] = useLocalStorage("username", null);
  const navigate = useNavigate();


  const login = async ({
    username,
    user,
    token
  }) => {
// set cookies here
console.log('Login token ======>', token);
console.log('Login user ======>', user);
console.log('Login user ======>', username);



  const cookies = new Cookies();
  cookies.set('jwt', token, { secure: true});

    setUser(user);
    setUsername(username);
    navigate("/");
  };

  const logout = () => {
    new Cookies();
    setUser(null);
    setUsername(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      username,
      login,
      logout,
    }),[user, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
