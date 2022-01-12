import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Grid,
  InputLabel,
} from "components/MaterialUI";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import styled from "styled-components";
import { useState } from "react";
import { useMemo } from "react";
import { useCallback } from "react";
import { TextField } from "components/MaterialUI";

export const RaceDialog = React.memo((props) => {
  const { onCancel, open, onApply } = props;
  const [number, setNumber] = useState(0);
  const cars = useSelector((state) => state.carReducer.cars);

  const initialValues = useMemo(
    () => ({
      night: cars[number] ? cars[number].night : false,
      primary: cars[number] ? cars[number].primary : true,
      num: cars[number] ? cars[number].num || "" : "",
      series: cars[number]
        ? cars[number].leagues
            .filter((item) => item.racing)
            .map((item) => item.series_id)
        : [],
      team: cars[number]
        ? cars[number].teams
            .filter((item) => item.racing)
            .map((item) => item.team_id)
        : [],
    }),
    [cars, number]
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        night: Yup.boolean(),
        primary: Yup.boolean(),
        num: Yup.number(),
        series: Yup.array().of(Yup.number()),
        team: Yup.array().of(Yup.number()),
      }),
    []
  );

  const handleSubmit = useCallback(
    (values) => {
      onApply({
        ...values,
        number: number,
      });
    },
    [onApply, number]
  );

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Race this paint?</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnMount
      >
        {(formProps) => (
          <RaceForm
            onCancel={onCancel}
            number={number}
            setNumber={setNumber}
            leagueList={cars[number].leagues}
            teamList={cars[number].teams}
            {...formProps}
          />
        )}
      </Formik>
    </Dialog>
  );
});

const RaceForm = React.memo(
  ({ onCancel, leagueList, teamList, number, setNumber, ...formProps }) => {
    const [expanded, setExpanded] = useState(false);
    const [enableLeague, setEnableLeague] = useState(true);
    const [enableTeam, setEnableTeam] = useState(true);

    const leagueSeriesMap = useMemo(() => {
      let map = {};
      for (let item of leagueList) {
        map[item.series_id] = item.series_name;
      }
      return map;
    }, [leagueList]);

    const teamMap = useMemo(() => {
      let map = {};
      for (let item of teamList) {
        map[item.team_id] = item.team_name;
      }
      return map;
    }, [teamList]);

    const handleChangeNumber = useCallback(
      (number) => {
        setNumber(number ? 1 : 0);
        formProps.resetForm();
      },
      [formProps, setNumber]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <DialogContent dividers id="insert-text-dialog-content">
          <Box display="flex" flexDirection="column">
            <Typography mb={4}>
              Race this paint as your NASCAR Cup Series Next Gen Ford Mustang?
            </Typography>
            <Box
              mb={2}
              display="flex"
              justifyContent="space-between"
              position="relative"
            >
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <CustomGrid item onClick={() => handleChangeNumber(0)}>
                  <Typography>Sim-Stamped Number</Typography>
                </CustomGrid>
                <Grid item>
                  <Switch
                    checked={number ? true : false}
                    onChange={(event) =>
                      handleChangeNumber(event.target.checked)
                    }
                    name="number"
                  />
                </Grid>
                <CustomGrid item onClick={() => handleChangeNumber(1)}>
                  <Typography>Custom Number</Typography>
                </CustomGrid>
              </Grid>
              <Box position="absolute" right={0} top="7px">
                {number ? (
                  <CustomTextField
                    placeholder="Number"
                    name="num"
                    type="number"
                    value={formProps.values.num}
                    onChange={(event) =>
                      formProps.setFieldValue(
                        "num",
                        parseInt(event.target.value)
                      )
                    }
                  />
                ) : (
                  <></>
                )}
              </Box>
            </Box>
            <Accordion
              expanded={expanded}
              onChange={() => setExpanded(!expanded)}
            >
              <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">More Options</Typography>
              </CustomAccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexDirection="column" width="100%">
                  <Box mb={1}>
                    <FormControlLabel
                      label="Primary paint"
                      control={
                        <Switch
                          checked={formProps.values.primary}
                          onChange={(event) =>
                            formProps.setFieldValue(
                              "primary",
                              event.target.checked
                            )
                          }
                        />
                      }
                    />
                  </Box>
                  <Box mb={4}>
                    <FormControlLabel
                      label="Night races"
                      control={
                        <Switch
                          checked={formProps.values.night}
                          onChange={(event) =>
                            formProps.setFieldValue(
                              "night",
                              event.target.checked
                            )
                          }
                        />
                      }
                    />
                  </Box>

                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableLeague}
                          onChange={(event) => {
                            setEnableLeague(event.target.checked);
                            formProps.setFieldValue("series", []);
                          }}
                        />
                      }
                    />
                    <CustomFormControl variant="outlined">
                      <InputLabel id="leagues-and-series">
                        Leagues and series
                      </InputLabel>
                      <Select
                        labelId="leagues-and-series"
                        label="Leagues and series"
                        value={formProps.values.series}
                        multiple
                        disabled={!enableLeague}
                        onChange={(event) =>
                          formProps.setFieldValue("series", event.target.value)
                        }
                        renderValue={(selected) => (
                          <Box display="flex">
                            {selected.map((value, index) => (
                              <Box key={index} mx={2}>
                                <Chip label={leagueSeriesMap[value]} />
                              </Box>
                            ))}
                          </Box>
                        )}
                      >
                        {leagueList.map((leatueSeriesItem, index) => (
                          <MenuItem
                            value={leatueSeriesItem.series_id}
                            key={index}
                          >
                            {leatueSeriesItem.series_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </CustomFormControl>
                  </Box>
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableTeam}
                          onChange={(event) => {
                            setEnableTeam(event.target.checked);
                            formProps.setFieldValue("team", []);
                          }}
                        />
                      }
                    />
                    <CustomFormControl variant="outlined">
                      <InputLabel id="teams">Teams</InputLabel>
                      <Select
                        labelId="teams"
                        label="Teams"
                        multiple
                        disabled={!enableTeam}
                        value={formProps.values.team}
                        onChange={(event) =>
                          formProps.setFieldValue("team", event.target.value)
                        }
                        renderValue={(selected) => (
                          <Box display="flex">
                            {selected.map((value, index) => (
                              <Box key={index} margin={2}>
                                <Chip label={teamMap[value]} />
                              </Box>
                            ))}
                          </Box>
                        )}
                      >
                        {teamList.map((teamItem, index) => (
                          <MenuItem value={teamItem.team_id} key={index}>
                            {teamItem.team_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </CustomFormControl>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
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
  flex-grow: 1;
  .MuiInputBase-root {
    height: 48px;
  }
`;

const CustomGrid = styled(Grid)`
  cursor: pointer;
`;

const CustomTextField = styled(TextField)`
  margin: 0 10px;
  width: 80px;
  & .MuiInputBase-input {
    height: auto;
    border-bottom: 1px solid white;
    padding: 3px 0 4px;
  }
`;

export const CustomAccordionSummary = styled(AccordionSummary)`
  background: #3f3f3f;
  border-radius: 5px;
`;

export default RaceDialog;
