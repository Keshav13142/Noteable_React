import GitHubIcon from "@mui/icons-material/GitHub";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Navbar = () => {
  //Create instance of useNavigate()
  const navigate = useNavigate();

  //Get hold of the global state
  const { curr_user, setCurrUser, setInfo, loading, setLoading } =
    useContext(UserContext);

  //Executes when the Logout button is clicked
  const logout = async () => {
    setLoading(true);
    //Make a post request to /logout (backend API) with JWT token in header
    const data = await fetch("/api/logout", {
      method: "post",
      headers: new Headers({
        Authorization: "Bearer " + curr_user.token,
        "Content-Type": "application/json",
      }),
    });

    setLoading(false);

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
      navigate("/");
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
          {curr_user && (
            <button
              className="navbar-toggler btn-sm"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarTogglerDemo01"
              aria-controls="navbarTogglerDemo01"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          )}
          <div className="navbar-brand">
            <img
              src={require("../assets/post-it.png")}
              alt="logo"
              className="logo-icon"
            />
            <Link className="nav-text" to="/notes">
              Noteable <span style={{ fontWeight: "400" }}></span>
            </Link>
          </div>

          {curr_user ? (
            <>
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo01"
              >
                <ul className="navbar-nav me-auto">
                  <li className="nav-item"></li>
                </ul>
                <ul className="d-flex navbar-nav mb-2 mb-lg-0 gap-2 text-black">
                  <li className="nav-item d-flex justify-content-center align-items-center gap-2 mx-2">
                    {curr_user?.avatar_url ? (
                      <Avatar
                        sx={{ width: 35, height: 35 }}
                        alt="Remy Sharp"
                        src={curr_user?.avatar_url}
                      />
                    ) : (
                      <Avatar sx={{ width: 35, height: 35 }}>
                        {curr_user.name[0]}
                      </Avatar>
                    )}

                    <span className="nav-name">{curr_user?.name}</span>
                  </li>
                  <li className="nav-item d-flex justify-content-center align-items-center">
                    <span className="nav-link">
                      <LoadingButton
                        size="small"
                        loading={loading}
                        loadingPosition="end"
                        endIcon={<LogoutRoundedIcon />}
                        variant="text"
                        type="submit"
                        onClick={logout}
                        style={{
                          color: "black",
                          fontSize: "12x",
                          padding: "0",
                        }}
                      >
                        Logout
                      </LoadingButton>
                    </span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center">
              {/* eslint-disable-next-line */}
              <a
                href="https://github.com/keshav13142/Noteable_React"
                target="_blank"
              >
                <IconButton>
                  <GitHubIcon fontSize="medium" />
                </IconButton>
              </a>
              <Link to="/about">
                <IconButton>
                  <InfoOutlinedIcon fontSize="medium" />
                </IconButton>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
