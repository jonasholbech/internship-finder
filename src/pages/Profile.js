import { Avatar } from "rsuite";
import useAuth from "../hooks/useAuth";
function Profile() {
  const auth = useAuth();

  return (
    <div className="Profile">
      <Avatar size="lg" src={auth.auth.user.user_metadata.avatar_url} />
      <p>Not really a profile page, but here's the data I have on you</p>
      <pre>{JSON.stringify(auth.auth.user.user_metadata, null, 2)}</pre>
    </div>
  );
}

export default Profile;
