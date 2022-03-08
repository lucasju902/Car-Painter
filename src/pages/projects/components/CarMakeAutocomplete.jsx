import React, { useMemo, useCallback } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { createCarPin, deleteCarPin } from "redux/reducers/carPinReducer";

import {
  TextField,
  Autocomplete,
  Box,
  Checkbox,
  Typography,
  CircularProgress,
} from "components/MaterialUI";
import { BsPinAngleFill, BsPinAngle } from "react-icons/bs";

export const CarMakeAutocomplete = React.memo(({ label, ...props }) => {
  const dispatch = useDispatch();
  const carMakeList = useSelector((state) => state.carMakeReducer.list);
  const carPinList = useSelector((state) => state.carPinReducer.list);
  const updatingCarMakeID = useSelector(
    (state) => state.carPinReducer.updatingID
  );

  const carPinIDList = useMemo(
    () => carPinList.map((carPin) => carPin.car_make),
    [carPinList]
  );
  let sortedCarMakesList = useMemo(
    () =>
      _.orderBy(
        [...carMakeList.filter((item) => !item.is_parent && !item.deleted)],
        [(carMake) => carPinIDList.includes(carMake.id), "car_type", "name"],
        ["desc", "asc", "asc"]
      ),
    [carMakeList, carPinIDList]
  );

  const funcGroupBy = useCallback(
    (carMake) =>
      carPinIDList.includes(carMake.id) ? "Pinned" : carMake.car_type,
    [carPinIDList]
  );

  return (
    <>
      {carMakeList && carMakeList.length ? (
        <Autocomplete
          {...props}
          options={sortedCarMakesList}
          groupBy={funcGroupBy}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label={label} variant="outlined" />
          )}
          renderOption={(option) => (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography>{option.name}</Typography>
              {option.id === updatingCarMakeID ? (
                <CircularProgress
                  size={30}
                  color="secondary"
                  style={{ margin: "5px" }}
                />
              ) : (
                <Checkbox
                  icon={<BsPinAngle />}
                  checkedIcon={<BsPinAngleFill />}
                  checked={carPinIDList.includes(option.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (carPinIDList.includes(option.id)) {
                      dispatch(deleteCarPin(option.id));
                    } else {
                      dispatch(createCarPin(option.id));
                    }
                  }}
                />
              )}
            </Box>
          )}
        />
      ) : (
        <></>
      )}
    </>
  );
});

export default CarMakeAutocomplete;
