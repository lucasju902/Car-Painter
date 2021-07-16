import React, { useCallback, useMemo } from "react";
import { Form } from "formik";

import {
  Box,
  Button,
  DialogActions,
  Typography,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "components/MaterialUI";

import { CustomDialogContent, CustomAutocomplete } from "./styles";

export const InnerForm = React.memo(
  ({ owner, schemeID, premiumUsers, onCancel, ...formProps }) => {
    const {
      isSubmitting,
      isValid,
      handleSubmit,
      setFieldValue,
      values,
    } = formProps;
    const unInvitedUsers = useMemo(
      () =>
        premiumUsers.filter(
          (user) =>
            user.id !== owner.id &&
            !values.sharedUsers.find((item) => item.user.id === user.id)
        ),
      [premiumUsers, owner, values]
    );

    const handleNewUserChange = useCallback(
      (user) => {
        setFieldValue(
          `newUser`,
          user
            ? {
                user_id: user.id,
                user: user,
                scheme_id: schemeID,
                accepted: 0,
                editable: 0,
              }
            : null
        );
      },
      [schemeID]
    );

    const handleNewUserPermissionChange = useCallback((value) => {
      setFieldValue(`newUser['editable']`, value);
    }, []);

    const handleSharedUserChange = useCallback((value, index) => {
      setFieldValue(`sharedUsers[${index}]['editable']`, value);
    }, []);

    return (
      <Form onSubmit={handleSubmit} noValidate>
        <CustomDialogContent dividers id="insert-text-dialog-content">
          <Box display="flex" justifyContent="space-between" mb={5} pr={5}>
            <CustomAutocomplete
              options={unInvitedUsers}
              getOptionLabel={(option) => option.id.toString()}
              style={{ width: 200 }}
              onChange={(event, newValue) => {
                handleNewUserChange(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter Customer ID"
                  variant="outlined"
                />
              )}
            />
            {values.newUser ? (
              <Box
                display="flex"
                justifyContent="space-between"
                flexGrow={1}
                ml={5}
              >
                <Box>
                  <Typography>{values.newUser.user.drivername}</Typography>
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
          <Box maxHeight="50vh" pr={5} overflow="auto">
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="textSecondary">{owner.drivername}</Typography>
              <Typography color="textSecondary">Owner</Typography>
            </Box>
            {values.sharedUsers.map((sharedUser, index) => (
              <Box
                display="flex"
                justifyContent="space-between"
                key={index}
                mb={2}
              >
                <Typography color="textSecondary">
                  {sharedUser.user.drivername}
                </Typography>
                <Select
                  variant="outlined"
                  value={sharedUser.editable}
                  onChange={(event) =>
                    handleSharedUserChange(event.target.value, index)
                  }
                >
                  <MenuItem value={0}>Can view</MenuItem>
                  <MenuItem value={1}>{"Can view & edit"}</MenuItem>
                  <MenuItem value={-1}>Remove</MenuItem>
                </Select>
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
