import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar } from "components/MaterialUI";
import { Alert } from "@material-ui/lab";

import { setMessage } from "redux/reducers/messageReducer";

const Message = () => {
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
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert onClose={handleClose} severity={message.type}>
        {message.msg}
      </Alert>
    </Snackbar>
  );
};

export const withMessage = (Component) => (props) => {
  return (
    <React.Fragment>
      <Message />
      <Component {...props} />
    </React.Fragment>
  );
};
