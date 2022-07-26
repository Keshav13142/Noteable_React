import React from "react";

const Note = (props) => {
  //Note component
  return (
    <>
      <form className="note d-flex flex-column g-5" method="post">
        <div className="d-flex justify-content-around align-items-center gap-3">
          <h5 style={{ wordBreak: "break-word" }}>{props.note.title}</h5>
          <button
            value={props.note._id}
            className="btn btn-sm btn-close"
            name={props.note.user_id}
            onClick={props.deleteNote}
          ></button>
        </div>
        <hr className="m-0 p-0" />
        <input type="hidden" name="uid" value="<%= note.user_id %>" />
        <p style={{ wordBreak: "break-word" }}>{props.note.content}</p>
      </form>
    </>
  );
};

export default Note;
