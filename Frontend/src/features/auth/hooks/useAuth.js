import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../authcontext";
import { login, logout, register, getme } from "../service/api.auth";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;
  const [authError, setAuthError] = useState(null);

  const loginhook = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await login({ email, password });
      if (data?.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: "Login failed" };
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to login";
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const registerhook = async ({ username, email, password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await register({ username, email, password });
      if (data?.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: "Registration failed" };
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to register";
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logouthook = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.warn("Logout error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const data = await getme();
        if (isMounted) {
          if (data?.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [setUser, setLoading]);

  return {
    user,
    loading,
    authError,
    setAuthError,
    loginhook,
    registerhook,
    logouthook,
  };
};
