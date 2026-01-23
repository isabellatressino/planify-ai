import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth, logout as firebaseLogout } from "../services/firebase.js";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(() => firebaseLogout(), []);

  const isGoogleProvider = useMemo(() => {
    if (!user) {
      return false;
    }
    return user.providerData?.some((provider) => provider.providerId === "google.com");
  }, [user]);

  const isVerified = Boolean(user && (user.emailVerified || isGoogleProvider));

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isVerified,
    logout,
  };
}
