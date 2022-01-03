import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "components/MaterialUI";
import { FormControl, Grid, InputLabel } from "@material-ui/core";
import styled from "styled-components";

export const RaceDialog = React.memo((props) => {
  const { onCancel, open, onApply } = props;
  const leagueSeriesList = useSelector(
    (state) => state.leagueSeriesReducer.list
  );
  const teamList = useSelector((state) => state.teamReducer.list);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Race this paint?</DialogTitle>
      <Formik
        initialValues={{
          night: false,
          number: false,
          primary: false,
          series: "",
          team: "",
        }}
        validationSchema={Yup.object().shape({
          night: Yup.boolean(),
          number: Yup.boolean(),
          primary: Yup.boolean(),
          series: Yup.number(),
          team: Yup.number(),
        })}
        enableReinitialize
        validate={(values) => {
          return {};
        }}
        onSubmit={onApply}
      >
        {(formProps) => (
          <RaceForm
            onCancel={onCancel}
            leagueSeriesList={leagueSeriesList}
            teamList={teamList}
            {...formProps}
          />
        )}
      </Formik>
    </Dialog>
  );
});

const RaceForm = React.memo(
  ({ onCancel, leagueSeriesList, teamList, ...formProps }) => {
    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <DialogContent dividers id="insert-text-dialog-content">
          <Box display="flex" flexDirection="column">
            <Typography mb={4}>
              Race this paint as your NASCAR Cup Series Next Gen Ford Mustang?
            </Typography>
            <Box mb={2}>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <CustomGrid
                  item
                  onClick={() => formProps.setFieldValue("number", false)}
                >
                  <Typography>Sim-Stamped Number</Typography>
                </CustomGrid>
                <Grid item>
                  <Switch
                    checked={formProps.values.number}
                    onChange={(event) =>
                      formProps.setFieldValue("number", event.target.checked)
                    }
                    name="number"
                  />
                </Grid>
                <CustomGrid
                  item
                  onClick={() => formProps.setFieldValue("number", true)}
                >
                  <Typography>Custom Number</Typography>
                </CustomGrid>
              </Grid>
            </Box>
            <Box mb={1}>
              <FormControlLabel
                control={<Switch />}
                label="Primary paint"
                value={formProps.values.primary}
                onChange={(event) =>
                  formProps.setFieldValue("primary", event.target.checked)
                }
              />
            </Box>
            <Box mb={4}>
              <FormControlLabel
                control={<Switch />}
                label="Night races"
                value={formProps.values.night}
                onChange={(event) =>
                  formProps.setFieldValue("night", event.target.checked)
                }
              />
            </Box>

            <CustomFormControl variant="outlined">
              <InputLabel id="leagues-and-series">
                Leagues and series
              </InputLabel>
              <Select
                labelId="leagues-and-series"
                label="Leagues and series"
                value={formProps.values.series}
                onChange={(event) =>
                  formProps.setFieldValue("series", event.target.value)
                }
              >
                {leagueSeriesList.map((leatueSeriesItem, index) => (
                  <MenuItem value={leatueSeriesItem.id} key={index}>
                    {leatueSeriesItem.series_name}
                  </MenuItem>
                ))}
              </Select>
            </CustomFormControl>

            <CustomFormControl variant="outlined">
              <InputLabel id="teams">Teams</InputLabel>
              <Select
                labelId="teams"
                label="Teams"
                value={formProps.values.team}
                onChange={(event) =>
                  formProps.setFieldValue("team", event.target.value)
                }
              >
                {teamList.map((teamItem, index) => (
                  <MenuItem value={teamItem.id} key={index}>
                    {teamItem.team_name}
                  </MenuItem>
                ))}
              </Select>
            </CustomFormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            disabled={formProps.isSubmitting || !formProps.isValid}
          >
            Apply
          </Button>
        </DialogActions>
      </Form>
    );
  }
);

const CustomFormControl = styled(FormControl)`
  .MuiInputBase-root {
    height: 48px;
    margin-bottom: 16px;
  }
`;

const CustomGrid = styled(Grid)`
  cursor: pointer;
`;

export default RaceDialog;
