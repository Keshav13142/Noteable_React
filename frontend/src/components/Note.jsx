import React, { useContext } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #fff",
  borderRadius: "10px",
  p: 4,
};

const Note = (props) => {
  const navigate = useNavigate();

  //Get hold of the global state
  const { curr_user, setInfo, setCurrUser } = useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [note, setNote] = React.useState(props.note);
  const handleClose = () => setOpen(false);
  const changeNote = (e) => {
    setNote((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateNote = async (e) => {
    if (curr_user) {
      //Prevent the default action
      e.preventDefault();

      //Make a POST request to /notes (backend API) note info in request body and JWT token in header
      const data = await fetch("/api/update", {
        method: "post",
        headers: new Headers({
          Authorization: "Bearer " + curr_user.token,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ ...note, _id: props.note._id }),
      });

      //Check if status is success
      if (data.ok) {
        handleClose();
        props.refresh();

        //Setting global state for Alert
        setInfo({
          open: true,
          message: "Note updated successfully",
          type: "success",
        });

        //Reset note detials
        // note.content = "";
        // note.title = "";
      } else {
        //Get the error message
        const { error } = await data.json();

        //Setting global state for Alert
        setInfo({ open: true, message: error.info, type: "warning" });

        //Clear local storage and Global state for users
        setCurrUser(null);
        localStorage.clear();

        //Route to the Login page
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form method="post" onSubmit={updateNote}>
            <div className="mb-3">
              <input
                onChange={changeNote}
                value={note.title}
                type="text"
                className="form-control editInput"
                id="title"
                name="title"
                placeholder="Title"
              />
            </div>
            <div className="mb-3">
              <textarea
                onChange={changeNote}
                value={note.content}
                required
                className="form-control editInput"
                id="content"
                name="content"
                rows="3"
                placeholder="Take a note...."
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      <form className="note d-flex flex-column g-5" method="post">
        <div className="d-flex justify-content-around align-items-center gap-3">
          <h5 style={{ wordBreak: "break-word" }}>{props.note.title}</h5>
          <div className="d-flex justify-content-around align-items-center">
            <IconButton onClick={handleOpen}>
              <EditIcon fontSize="small" />
            </IconButton>
            <button
              value={props.note._id}
              className="btn btn-sm btn-close"
              name={props.note.user_id}
              onClick={props.deleteNote}
            ></button>
          </div>
        </div>
        <hr className="m-0 p-0" />
        <input type="hidden" name="uid" value="<%= note.user_id %>" />
        <p style={{ wordBreak: "break-word" }}>{props.note.content}</p>
      </form>
    </>
  );
};

export default Note;
