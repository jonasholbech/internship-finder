import { Navbar, Nav } from "rsuite";

import { GoPerson } from "react-icons/go";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
function NavBar() {
  const { auth, signOut } = useAuth();
  if (!auth) {
    return null;
  }
  return (
    <Navbar className="NavBar">
      <Link to="/">
        <Navbar.Brand as="span">IF</Navbar.Brand>
      </Link>
      <Nav>
        <Link to="/reviews">
          <Nav.Item as="span">Reviews</Nav.Item>
        </Link>
        <Link to="/add-review">
          <Nav.Item as="span">Add Review</Nav.Item>
        </Link>
      </Nav>
      <Nav pullRight>
        <Nav.Menu icon={<GoPerson />} title="">
          <Link to="/profile">
            <Nav.Item as="span">Profile</Nav.Item>
          </Link>
          <Nav.Item onClick={signOut}>Sign Out</Nav.Item>
        </Nav.Menu>
      </Nav>
    </Navbar>
  );
}

export default NavBar;
