import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

const Navbar = () => {
  //Create instance of useNavigate()
  const navigate = useNavigate();

  //Get hold of the global state
  const { curr_user, setCurrUser, setInfo } = useContext(UserContext);

  //Executes when the Logout button is clicked
  const logout = async () => {
    //Make a post request to /logout (backend API) with JWT token in header
    const data = await fetch("/logout", {
      method: "post",
      headers: new Headers({
        Authorization: "Bearer " + curr_user.token,
        "Content-Type": "application/json",
      }),
    });

    //Check if status is success
    if (data.ok) {
      //Get the message from the response
      const { message } = await data.json();

      //Setting global state for Alert
      setInfo({
        open: true,
        message: message,
        type: "success",
      });

      //Clear the localstorage
      localStorage.clear();

      //Empty the global state for user
      setCurrUser(null);

      //Navigate to the Login page
      navigate("/login");
    } else {
      //Get the error message
      const { error } = await data.json();

      //Setting global state for Alert
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
            <img
              src={require("../assets/post-it.png")}
              alt="logo"
              className="logo-icon"
            />
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
                      <span className="nav-name">{curr_user.name}</span>
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
