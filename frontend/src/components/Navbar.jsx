import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

const Navbar = () => {
  const { curr_user, setCurrUser } = useContext(UserContext);
  const logout = () => {
    localStorage.clear();
    setCurrUser(null);
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link className="nav-text" to="/notes">
              Noteable
            </Link>
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/notes">
                  (A simple note taking app)
                </a>
              </li>
            </ul>
            <ul className="d-flex navbar-nav mb-2 mb-lg-0">
              {curr_user ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link text-black">
                      Hello 👋
                      <span className="text-primary">{curr_user.name}</span>
                    </span>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" onClick={logout} to="/login">
                      Logout
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
