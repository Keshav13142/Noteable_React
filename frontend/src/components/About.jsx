import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function RecipeReviewCard() {
  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar
              src="https://avatars.githubusercontent.com/u/55992029?v=4"
              alt="logo"
            />
          }
          title="Noteable"
          subheader="With 🧡 from Keshav"
        />
        <CardContent>
          <Typography variant="body2" color="text.primary">
            Hi 👋, I'm Keshav S , a CSE Undergraduate from R.M.K College of
            Engineering and Technology
            <br />
            <br />
            This is Simple Note Taking app built using <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;➡ React (Frontend)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;➡ Node Js with express (Backend)
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;➡ Mongo Db (Database)
            <br />
            <br />
            Hope you like it and if want to know more about this App (or ME😶)
            ,my GitHub profile and other socials are linked down below.
            <br />
            <br />
            Hope you have a great day..
          </Typography>
        </CardContent>
        <div className="d-flex justify-content-center w-100 mt-0">
          <CardActions disableSpacing>
            <a href="https://github.com/keshav13142" target="_blank">
              <IconButton>
                <GitHubIcon />
              </IconButton>
            </a>
            <a href="https://twitter.com/keshav13142" target="_blank">
              <IconButton>
                <TwitterIcon />
              </IconButton>
            </a>
            <a href="https://www.linkedin.com/in/keshav13142" target="_blank">
              <IconButton>
                <LinkedInIcon />
              </IconButton>
            </a>
          </CardActions>
        </div>
        <div className="d-block m-auto mb-2" style={{ width: "fit-content" }}>
          <Link style={{ textDecoration: "none" }} to="/">
            Back to home
            <ArrowBackIcon
              style={{ margin: "0px 0px 2px 2px" }}
              fontSize="small"
            />
          </Link>
        </div>
      </Card>
    </div>
  );
}
