import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { curr_user, setCurrUser, setInfo } = useContext(UserContext);
  const logout = async () => {
    const data = await fetch("/logout", {
      method: "post",
      headers: new Headers({
        Authorization: "Bearer " + curr_user.token,
        "Content-Type": "application/json",
      }),
    });
    if (data.ok) {
      const { message } = await data.json();
      setInfo({
        open: true,
        message: message,
        type: "success",
      });
      localStorage.clear();
      setCurrUser(null);
      navigate("/login");
    } else {
      const { error } = await data.json();
      console.log(error);
      setInfo({ open: true, message: error.info, type: "error" });
    }
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
                    <button className="logout nav-link" onClick={logout}>
                      Logout
                    </button>
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
