import React, { useCallback, useMemo } from "react";
import { Form } from "formik";

import {
  Box,
  Button,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "components/MaterialUI";

import { CustomDialogContent } from "./styles";
import UserService from "services/userService";
import { getUserName } from "helper";
import { useSelector } from "react-redux";

export const InnerForm = React.memo(
  ({ owner, editable, currentUserID, schemeID, onCancel, ...formProps }) => {
    const {
      isSubmitting,
      isValid,
      handleSubmit,
      setFieldValue,
      values,
    } = formProps;

    const blockedUsers = useSelector((state) => state.authReducer.blockedUsers);
    const blockedBy = useSelector((state) => state.authReducer.blockedBy);

    const isOwner = useMemo(
      () => (!owner ? false : owner.id === currentUserID),
      [owner, currentUserID]
    );

    const handleNewUserChange = useCallback(
      async (userID) => {
        if (userID && userID.length) {
          try {
            let foundUser = await UserService.getPremiumUserByID(userID);
            if (
              foundUser &&
              !values.sharedUsers.find(
                (item) => item.user_id === foundUser.id
              ) &&
              !blockedUsers.includes(foundUser.id) &&
              !blockedBy.includes(foundUser.id)
            ) {
              setFieldValue(`newUser`, {
                user_id: foundUser.id,
                user: foundUser,
                scheme_id: schemeID,
                accepted: 0,
                editable: 0,
              });
            }
          } catch (error) {}
        }
      },
      [schemeID, setFieldValue, values.sharedUsers, blockedUsers, blockedBy]
    );

    const handleNewUserPermissionChange = useCallback(
      (value) => {
        setFieldValue(`newUser['editable']`, value);
      },
      [setFieldValue]
    );

    const handleSharedUserChange = useCallback(
      (value, index) => {
        setFieldValue(`sharedUsers[${index}]['editable']`, value);
      },
      [setFieldValue]
    );

    return (
      <Form onSubmit={handleSubmit} noValidate>
        <CustomDialogContent dividers id="insert-text-dialog-content">
          {isOwner ? (
            <Box display="flex" justifyContent="space-between" mb={5} pr={5}>
              <TextField
                label="Enter Customer ID"
                variant="outlined"
                name="newUser"
                onChange={(event) => handleNewUserChange(event.target.value)}
                style={{ width: 200 }}
              />
              {values.newUser ? (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexGrow={1}
                  ml={5}
                >
                  <Box mt="-7px">
                    <Typography>{getUserName(values.newUser.user)}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID #{values.newUser.user.id}
                    </Typography>
                  </Box>
                  <Box height="31px">
                    <Select
                      variant="outlined"
                      value={values.newUser.editable}
                      onChange={(event) =>
                        handleNewUserPermissionChange(event.target.value)
                      }
                    >
                      <MenuItem value={0}>Can view</MenuItem>
                      <MenuItem value={1}>{"Can view & edit"}</MenuItem>
                      <MenuItem value={-1}>Cancel</MenuItem>
                    </Select>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <></>
          )}
          <Box maxHeight="50vh" pr={5} overflow="auto">
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Typography color="textSecondary">
                {getUserName(owner) + (isOwner ? " (you)" : "")}
              </Typography>
              <Typography color="textSecondary">Owner</Typography>
            </Box>
            {values.sharedUsers
              .filter(
                (sharedUser) =>
                  !blockedUsers.includes(sharedUser.user.id) &&
                  !blockedBy.includes(sharedUser.user.id)
              )
              .map((sharedUser, index) => (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  key={index}
                  mb={4}
                >
                  <Box mt="-7px">
                    <Typography color="textSecondary">
                      {getUserName(sharedUser.user) +
                        (currentUserID === sharedUser.user.id ? " (you)" : "")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID #{sharedUser.user.id}
                    </Typography>
                  </Box>
                  <Box height="31px">
                    <Select
                      variant="outlined"
                      value={sharedUser.editable}
                      disabled={
                        !isOwner && currentUserID !== sharedUser.user.id
                      }
                      onChange={(event) =>
                        handleSharedUserChange(event.target.value, index)
                      }
                    >
                      <MenuItem value={0}>Can view</MenuItem>
                      <MenuItem value={1} disabled={!editable}>
                        {"Can view & edit"}
                      </MenuItem>
                      <MenuItem value={-1}>Remove</MenuItem>
                    </Select>
                  </Box>
                </Box>
              ))}
          </Box>
        </CustomDialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            disabled={isSubmitting || !isValid}
          >
            Apply
          </Button>
        </DialogActions>
      </Form>
    );
  }
);
