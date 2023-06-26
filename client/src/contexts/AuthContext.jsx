/* 
  Context is being used for a global state for the purposes of authentication.
  Found it suitable for this use case compared to redux, etc.
*/
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const toast = useToast();

  /* checks for the presence of a valid token
    if the exp time has passed , we revoke the access
  */
  const checkAuth = (setLoading) => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          setUser(null);
          Cookies.remove("token");
        } else {
          setUser(decodedToken);
          // console.log('logged in');
        }
      } catch (error) {
        // console.log(error);
        setUser(null);
        Cookies.remove("token");
      }
    } else {
      // console.log("user is not logged in");
      setUser(null);
    }
    setLoading(false);
  };

  // deals with the login request logic from the frontend
  const login = async (email, password, throttle) => {
    try {
      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // console.log("Logged in successfully 🔓");
        toast(data.message);
        setUser({
          email: data.email,
          username: data.username,
        });
      }
      if (response.status === 401) {
        toast(data.message, "error");
        setTimeout(() => {
          throttle(false);
        }, 3000);
      }
    } catch (error) {
      console.error(`❌ error occured: ${error}`);
    }
  };

  const logout = async () => {
    Cookies.remove("token");
    setUser(null);
    toast("Logged out successfully 🚪", "info");
  };

  const authContextValue = {
    user,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to access authcontext
function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
