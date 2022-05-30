import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { GoMarkGithub } from "react-icons/go";
import { Button, Loader } from "rsuite";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  let location = useLocation();
  let auth = useAuth();
  let from = location.state?.from?.pathname || "/";

  function signIn() {
    setLoading(true);
    auth.signInWithGithub();
  }
  if (auth.auth) {
    return <Navigate to={from} replace />;
  }
  return (
    <div className="Login">
      {/* <p>You must log in to view the page at {from}</p> */}
      <h1>The Internship Finder</h1>
      <p>All data entered here is displayed in an anonymous way</p>
      <p>Your username, email etc will never be displayed to other users</p>
      <p>
        Your reviews could technically be used, by your previous internship to
        figure out who you are though!
      </p>
      <div className="main">
        <Button onClick={signIn} disabled={loading}>
          <span className="ghButton">
            {loading ? <Loader /> : <GoMarkGithub />} Sign in
          </span>
        </Button>
      </div>
    </div>
  );
}
