
"use client";


import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { User } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    role: null,
    id: null,
    userName: null,
    userEmail:null
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      
      if (data.success) {
        toast.success("Registration successful! Please log in.");
        setSignUpFormData(initialSignUpFormData);
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();

    try {
      const data = await loginService(signInFormData);

      if (data.success) {
        localStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );

    
        const authInfo = {
          authenticate: true,
          role: data.data.role,
          id: data.data.id,
          userName: data.data.userName,
          User:data.data.userEmail
        };
        
        localStorage.setItem("authInfo", JSON.stringify(authInfo));
        
        setAuth(authInfo);
        toast.success("Login successfull!");
      } else {
        setAuth({
          authenticate: false,
          userName: null,
          role: null,
          id: null
        });
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
      setAuth({
        authenticate: false,
        userName: null,
        role: null,
        id: null
      });
    }
  }

  async function checkAuthUser() {
    try {
      const storedAuthInfo = localStorage.getItem("authInfo");
      if (storedAuthInfo) {
        const parsedAuthInfo = JSON.parse(storedAuthInfo);
        setAuth(parsedAuthInfo);
        setLoading(false);
        return;
      }

      const data = await checkAuthService();
      if (data.success) {
        const authInfo = {
          authenticate: true,
          role: data.data.role,
          id: data.data.id,
          userName: data.data.userName,
        };
        
        localStorage.setItem("authInfo", JSON.stringify(authInfo));
        setAuth(authInfo);
        setLoading(false);
      } else {
        clearAuthData();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        clearAuthData();
        setLoading(false);
      }
    }
  }

  function clearAuthData() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authInfo");
    setAuth({
      authenticate: false,
      role: null,
      id: null,
      userName: null,
    });
  }

  function resetCredentials() {
    clearAuthData();
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  try {
    return context;
  } catch (error) {
    throw new Error("auth context not provided!")
  }
}