import {
    Link
  } from "@remix-run/react";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">MyWebsite</div>
      <ul className="nav-links">
        <li>
          <Link to="/app" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/app/chatbox" className="nav-link">Chat Box</Link>
        </li>
        <li>
          <Link to="/app/collection" className="nav-link">Collection Import</Link>
        </li>
        <li>
          <Link to="/app/collectionlist" className="nav-link">Our Collection</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
