import { Link } from "@remix-run/react";
import "./navbar.css";

const Navbar = () => {
  return (
    <div className="container header-bottom-2">
      <nav className="navbar">
        <div className="logo">MyApp</div>
        <ul className="nav-links">
        {/* <li>
            <Link to="/app" className="nav-link">
              Home
            </Link>
          </li> */}
          <li>
            <Link to="/app/customerlist" className="nav-link">
              Customer list
            </Link>
          </li>
          <li className="drop-down">
            <Link to="/app/collectionlist" className="nav-link">
              Collection{" "}
            </Link>
            <div className="sub-menu">
              <ul>
                <li>
                  <Link to="/app/collection" className="nav-link">
                    Collection Export
                  </Link>
                </li>
                <li>
                  <Link to="/app/updatecollection" className="nav-link">
                    Update Collection{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li className="drop-down">
            <Link to="/app/ourproducts" className="nav-link">
              Products
            </Link>
            <div className="sub-menu">
              <ul>
              <li>
            <Link to="/app/productlist" className="nav-link">
              Product Export
            </Link>
          </li>
              </ul>
            </div>
          </li>
          <li>
            <Link to="/app/orders" className="nav-link">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/app/segments" className="nav-link">
              Customer Segment
            </Link>
          </li>
         
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
