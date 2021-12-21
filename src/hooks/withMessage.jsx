import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar } from "components/MaterialUI";
import { Alert } from "@material-ui/lab";

import { setMessage } from "redux/reducers/messageReducer";

const Message = React.memo(() => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.messageReducer);

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setMessage({ message: null }));
  };

  return (
    <Snackbar
      open={message.msg ? true : false}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {message.msg && message.msg.length && (
        <Alert onClose={handleClose} severity={message.type}>
          {message.msg}
        </Alert>
      )}
    </Snackbar>
  );
});

export const withMessage = (Component) =>
  React.memo((props) => {
    return (
      <React.Fragment>
        <Message />
        <Component {...props} />
      </React.Fragment>
    );
  });
