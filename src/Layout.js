import { Link, Outlet, useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

export default function Layout() {
  return (
    <div>
      <h1>The Internship Finder</h1>
      <AuthStatus />

      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

function AuthStatus() {
  let { auth, signOut } = useAuth();
  let navigate = useNavigate();

  if (!auth) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome {auth.user.user_metadata.user_name}!{" "}
      <button
        onClick={() => {
          signOut(() => navigate("/login"));
        }}
      >
        Sign out
      </button>
    </p>
  );
}
