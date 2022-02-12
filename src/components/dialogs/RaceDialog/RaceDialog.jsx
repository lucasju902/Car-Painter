import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
  TextField,
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
import { useCallback, useEffect } from "react";
import { NumberModSwitch } from "./NumberModSwitch";

export const RaceDialog = React.memo((props) => {
  const { open, applying, onApply, onCancel } = props;
  const [number, setNumber] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const cars = useSelector((state) => state.carReducer.cars);

  const initialValues = useMemo(
    () => ({
      night: true,
      primary: true,
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
        num: number ? Yup.string().required("Required") : Yup.string(),
        series: Yup.array().of(Yup.number()),
        team: Yup.array().of(Yup.number()),
      }),
    [number]
  );

  const handleSubmit = useCallback(
    (values) => {
      let payload = {
        ...values,
        number: number,
      };
      if (!expanded) {
        payload.primary = true;
      }
      if (payload.primary) {
        payload.night = false;
      }
      onApply(payload);
    },
    [number, expanded, onApply]
  );

  useEffect(() => {
    if (cars && cars.length) {
      if (cars[1].primary === true) {
        setNumber(1);
      } else {
        setNumber(0);
      }
    }
    // Should Initialize when open status changes too.
  }, [open, cars]);

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md">
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
            applying={applying}
            setNumber={setNumber}
            leagueList={cars[number].leagues}
            teamList={cars[number].teams}
            expanded={expanded}
            setExpanded={setExpanded}
            {...formProps}
          />
        )}
      </Formik>
    </Dialog>
  );
});

const RaceForm = React.memo(
  ({
    onCancel,
    leagueList,
    teamList,
    applying,
    number,
    setNumber,
    expanded,
    setExpanded,
    ...formProps
  }) => {
    const currentCarMake = useSelector((state) => state.carMakeReducer.current);
    const cars = useSelector((state) => state.carReducer.cars);

    const leagueSeriesMap = useMemo(() => {
      let map = {};
      for (let item of leagueList) {
        map[item.series_id] = item.league_name + " " + item.series_name;
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
              Race this paint as your {currentCarMake.name}?
            </Typography>
            <Box
              mb={4}
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
                  <NumberModSwitch
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
              <Box position="absolute" left="calc(50% + 180px)" top="6px">
                {number ? (
                  <CustomTextField
                    placeholder="Number"
                    name="num"
                    type="tel"
                    value={formProps.values.num}
                    inputProps={{ maxLength: 3 }}
                    onBlur={formProps.handleBlur}
                    onChange={formProps.handleChange}
                    error={Boolean(
                      formProps.touched.num && formProps.errors.num
                    )}
                    helperText={formProps.touched.num && formProps.errors.num}
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
                <Box display="flex" flexDirection="column" width="100%" pt={3}>
                  <Grid container mb={4}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        label="Primary paint"
                        control={
                          <Switch
                            checked={formProps.values.primary}
                            onChange={(event) => {
                              formProps.setFieldValue(
                                "primary",
                                event.target.checked
                              );
                              if (event.target.checked) {
                                formProps.setFieldValue("night", true);
                              }
                            }}
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        label="Night races"
                        control={
                          <Switch
                            checked={formProps.values.night}
                            disabled={
                              formProps.values.night &&
                              formProps.values.primary &&
                              cars.every((car) => !car.night)
                            }
                            onChange={(event) =>
                              formProps.setFieldValue(
                                "night",
                                event.target.checked
                              )
                            }
                          />
                        }
                      />
                    </Grid>
                  </Grid>

                  {leagueList.length ? (
                    <Box width="100%" mb={4}>
                      <CustomFormControl variant="outlined">
                        <InputLabel id="leagues-and-series">
                          Leagues and series
                        </InputLabel>
                        <Select
                          labelId="leagues-and-series"
                          label="Leagues and series"
                          value={formProps.values.series}
                          multiple
                          onChange={(event) =>
                            formProps.setFieldValue(
                              "series",
                              event.target.value
                            )
                          }
                          renderValue={(selected) => (
                            <Box display="flex" flexWrap="wrap">
                              {selected.map((value, index) => (
                                <Box key={index} m={1}>
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
                              {leatueSeriesItem.league_name}{" "}
                              {leatueSeriesItem.series_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </CustomFormControl>
                    </Box>
                  ) : (
                    <></>
                  )}

                  {teamList.length ? (
                    <Box width="100%">
                      <CustomFormControl variant="outlined">
                        <InputLabel id="teams">Teams</InputLabel>
                        <Select
                          labelId="teams"
                          label="Teams"
                          multiple
                          value={formProps.values.team}
                          onChange={(event) =>
                            formProps.setFieldValue("team", event.target.value)
                          }
                          renderValue={(selected) => (
                            <Box display="flex" flexWrap="wrap">
                              {selected.map((value, index) => (
                                <Box key={index} m={1}>
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
                  ) : (
                    <></>
                  )}
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
            {applying ? <CircularProgress size={20} /> : "Apply"}
          </Button>
        </DialogActions>
      </Form>
    );
  }
);

const CustomFormControl = styled(FormControl)`
  flex-grow: 1;
  width: 100%;
  .MuiInputBase-root {
    min-height: 48px;
  }
`;

const CustomGrid = styled(Grid)`
  cursor: pointer;
`;

const CustomTextField = styled(TextField)`
  margin: 0 10px;
  width: 65px;
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
