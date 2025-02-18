import React, { ReactNode } from "react";
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (e: any) => void;
  logOut: () => void;
}
interface Props {
  children?: ReactNode;
}
const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  login: () => {},
  logOut: () => {},
});

const AuthProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const login = async (data: any) => {
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const res = await response;
      if (res.ok) {
        setIsLoggedIn(true);
        navigate("/dogs");
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
