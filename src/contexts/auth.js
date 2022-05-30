import { useState, createContext, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dnZubm1jdWFnbGFkbnhzY2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTM0MzIyMTksImV4cCI6MTk2OTAwODIxOX0.y7-D5d21kC233J15ig5z4yWyQkHKRoUrbqa9U0Zbgmc";
const ENDPOINT = "https://buvvnnmcuagladnxscjc.supabase.co";
export const supabase = createClient(ENDPOINT, ANON_KEY);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, sess) => {
      setAuth(sess);
    });
  }, []);
  async function signInWithGithub() {
    await supabase.auth.signIn({
      provider: "github",
    });
  }

  async function signOut() {
    /* const { error } =  */ await supabase.auth.signOut();
  }
  const ex = { auth, signInWithGithub, signOut };
  return <AuthContext.Provider value={ex}>{children}</AuthContext.Provider>;
};
