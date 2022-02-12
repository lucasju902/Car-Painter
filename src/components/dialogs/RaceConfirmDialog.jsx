import React, { useMemo, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "components/MaterialUI";
import { useSelector } from "react-redux";
import { Checkbox, FormControlLabel } from "@material-ui/core";

export const RaceConfirmDialog = React.memo((props) => {
  const { open, onCancel, onConfirm } = props;
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const cars = useSelector((state) => state.carReducer.cars);
  const [dismiss, setDismiss] = useState(false);
  const primaryRaceNumber = useMemo(() => {
    if (!cars) return -1;
    if (cars[0] && cars[0].primary) return 0;
    if (cars[1] && cars[1].primary) return 1;
    return -1;
  }, [cars]);

  const filteredLeagues = useMemo(
    () =>
      cars &&
      primaryRaceNumber > -1 &&
      cars[primaryRaceNumber].leagues.filter((league) => league.racing),
    [cars, primaryRaceNumber]
  );
  const filteredTeams = useMemo(
    () =>
      cars &&
      primaryRaceNumber > -1 &&
      cars[primaryRaceNumber].teams.filter((team) => team.racing),
    [cars, primaryRaceNumber]
  );
  const isDefault = useMemo(
    () =>
      cars &&
      primaryRaceNumber > -1 &&
      cars[primaryRaceNumber].primary &&
      !cars[primaryRaceNumber].night &&
      !filteredLeagues.length &&
      !filteredTeams.length,
    [cars, primaryRaceNumber, filteredLeagues, filteredTeams]
  );

  if (!cars || primaryRaceNumber === -1) return null;

  return (
    <Dialog aria-labelledby="confirm-title" open={open} onClose={onCancel}>
      <DialogTitle id="confirm-title">Race Confirm</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          Race the latest version of {currentScheme.name} as your{" "}
          {currentCarMake.name}{" "}
          {primaryRaceNumber ? "Custom Number" : "Sim-Stamped"} paint?
        </Typography>
        {!isDefault ? (
          <Box my={2}>
            <Typography variant="body1">
              This update will apply to the following:
            </Typography>
            <Box pl={2}>
              <Typography variant="body1">
                Primary: {cars[primaryRaceNumber].primary ? "Yes" : "No"}
              </Typography>
              <Typography variant="body1">
                Night: {cars[primaryRaceNumber].night ? "Yes" : "No"}
              </Typography>

              {filteredLeagues && filteredLeagues.length ? (
                <Typography variant="body1">
                  Leagues and series:{" "}
                  {filteredLeagues.map(
                    (league, index) => (index ? ", " : "") + league.series_name
                  )}
                </Typography>
              ) : (
                <></>
              )}

              {filteredTeams && filteredTeams.length ? (
                <Typography variant="body1">
                  Teams:{" "}
                  {filteredTeams.map(
                    (team, index) => (index ? ", " : "") + team.team_name
                  )}
                </Typography>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        ) : (
          <></>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={dismiss}
              onChange={(e) => setDismiss(e.target.checked)}
            />
          }
          label="Don't ask again for this project"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>

        <Button
          onClick={() => onConfirm(dismiss)}
          variant="outlined"
          color="primary"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default RaceConfirmDialog;
