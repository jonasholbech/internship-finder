import { useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  let location = useLocation();
  let auth = useAuth();
  let from = location.state?.from?.pathname || "/";

  if (auth.auth) {
    return <Navigate to={from} replace />;
  }
  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <button onClick={auth.signInWithGithub}>Sign in</button>
    </div>
  );
}
